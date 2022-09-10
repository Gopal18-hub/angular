import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { CookieService } from "@shared/services/cookie.service";
import { HttpService } from "@shared/services/http.service";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { async, Subject, takeUntil } from "rxjs";
import { GstComponent } from "../gst/gst.component";
import { ApiConstants } from "@core/constants/ApiConstants";
import { MiscMasterDataModel } from "@core/types/miscMasterDataModel.Interface";
import { objMiscBillingConfigurationList } from "@core/types/miscMasterDataModel.Interface";
import { objMiscBillingRemarksList } from "@core/types/miscMasterDataModel.Interface";
import { objMiscDoctorsList } from "@core/types/miscMasterDataModel.Interface";
import { ServiceTypeItemModel } from "@core/types/billingServiceItemModel.Interface";
import { TarrifPriceModel } from "@core/types/triffPriceModel.Interface";
import { MiscellaneousBillingModel } from "../../../../../../core/models/miscBillingModel.Model";
import { MiscService } from "../../MiscService.service";
import { MakedepositDialogComponent } from "@modules/billing/submodules/deposit/makedeposit-dialog/makedeposit-dialog.component";
import { MakeBillDialogComponent } from "../../makebill-dialog/makebill-dialog.component";
import { DiscountAmtDialogComponent } from "@modules/billing/submodules/miscellaneous-billings/bills/discount-amt-dialog/discount-amt-dialog.component";
import { GstTaxDialogComponent } from "@modules/billing/submodules/miscellaneous-billings/bills/gst-tax-dialog/gst-tax-dialog.component";
import { ReportService } from "@shared/services/report.service";

@Component({
  selector: "out-patients-bill-detail",
  templateUrl: "./bill-detail.component.html",
  styleUrls: ["./bill-detail.component.scss"],
})
export class BillDetailComponent implements OnInit {
  @Output() newItemEvent = new EventEmitter<any>();
  newItem!: MiscellaneousBillingModel;
  doctorList!: objMiscDoctorsList[];
  // serviceList!: objMiscBillingConfigurationList;
  remarkList!: objMiscBillingRemarksList[];
  serviceItemsList!: ServiceTypeItemModel[];
  serviceList!: { title: string; value: number }[];

  //Tax info
  taxid = 0;
  taxcode = '';
  taxtype = '';
  taxService = '';
  billAmnt = 0;
  gstData = [];

  constructor(
    public matDialog: MatDialog,
    private formService: QuestionControlService,
    private router: Router,
    private http: HttpService,
    private cookie: CookieService,
    private miscPatient: MiscService,
    private reportService: ReportService,
  ) { }

  miscBillData = {
    type: "object",
    title: "",
    properties: {
      //0
      serviceType: {
        type: "autocomplete",
        title: "Service Type",
        options: this.serviceList,
        //required: true,
      },
      //1
      item: {
        type: "autocomplete",
        title: "Item",
        //required: true,
        options: this.serviceItemsList,
      },
      //2
      tffPrice: {
        type: "number",
        title: "Tarrif Price",
        //required: true,
        readonly: true,
      },
      //3
      qty: {
        type: "number",
        title: "Qty",
        maximum: 9,
        minimum: 1,
        //required: true,
      },
      //4
      reqAmt: {
        type: "number",
        title: "Req. Amt.",
        minimum: 1,
        //required: true,
      },
      //5
      pDoc: {
        type: "autocomplete",
        title: "Procedure Doctor",
        options: this.doctorList,
      },
      //6
      remark: {
        type: "autocomplete",
        title: "Remarks",
        //required: true,
        options: this.remarkList,
      },
      //7
      self: {
        type: "checkbox",
        required: false,
        options: [{ title: "Self" }],
      },
      //8
      referralDoctor: {
        type: "dropdown",
        //required: true,
        title: "Referral Doctor",
      },
      //9
      interactionDetails: {
        type: "dropdown",
        //required: true,
        title: "Interaction Details",
      },
      //10
      billAmt: {
        type: "number",
        required: false,
        defaultValue: "0.00",
        readonly: true,
      },
      //11
      availDiscCheck: {
        type: "checkbox",
        required: false,
        options: [{ title: "Avail Plan Disc ( - )" }],
      },
      //12
      availDisc: {
        type: "number",
        required: false,
        defaultValue: "0.00",
        readonly: true,
      },
      //13
      discAmtCheck: {
        type: "checkbox",
        required: false,
        options: [{ title: " Discount  Amount  (  -  ) " }],
      },
      //14
      discAmt: {
        type: "number",
        required: false,
        defaultValue: "0.00",
        readonly: true,
      },
      //15
      dipositAmtcheck: {
        type: "checkbox",
        required: false,
        options: [{ title: "Deposit Amount ( - )" }],
      },
      //16
      dipositAmt: {
        type: "number",
        required: false,
        defaultValue: "0.00",
        readonly: false,
      },
      //17
      patientDisc: {
        type: "number",
        required: false,
        defaultValue: "0.00",
        readonly: true,
      },
      //18
      compDisc: {
        type: "number",
        required: false,
        defaultValue: "0.00",
        readonly: true,
      },
      //19
      planAmt: {
        type: "number",
        required: false,
        defaultValue: "0.00",
        readonly: true,
      },
      //20
      coupon: {
        type: "number",
        required: false,
        defaultValue: "0.00",
        readonly: true,
      },
      //21
      coPay: {
        type: "number",
        required: false,
        defaultValue: "0.00",
        readonly: true,
      },
      //22
      credLimit: {
        type: "number",
        required: false,
        defaultValue: "0.00",
        readonly: true,
      },
      //23
      gstTax: {
        type: "number",
        required: false,
        defaultValue: "0.00",
        readonly: true,
      },
      //24
      amtPayByPatient: {
        type: "number",
        required: false,
        defaultValue: "0.00",
        readonly: true,
      },
      //25
      amtPayByComp: {
        type: "number",
        required: false,
        defaultValue: "0.00",
        readonly: true,
      },
      //26
      paymentMode: {
        type: "radio",
        //required: true,
        options: [
          { title: "Cash", value: "cash" },
          { title: "Credit", value: "credit" },
        ],
        defaultValue: "cash",
      },
    },
  };

  config: any = {
    selectBox: false,
    clickedRows: false,
    clickSelection: "single",
    displayedColumns: [
      "Sno",
      "ServiceType",
      "ItemDescription",
      "ItemforModify",
      "TariffPrice",
      "Qty",
      "Price",
      "DoctorName",
      "Disc",
      "DiscAmount",
      "TotalAmount",
      "GST",
    ],
    columnsInfo: {
      Sno: {
        title: "S.No.",
        type: "number",
      },
      ServiceType: {
        title: "Service Type",
        type: "string",
        style: {
          width: "120px",
        },
      },
      ItemDescription: {
        title: "Item Description",
        type: "string",
        style: {
          width: "180px",
        },
      },
      ItemforModify: {
        title: "Item For Modify",
        type: "string",
        style: {
          width: "120px",
        },
      },
      TariffPrice: {
        title: "Tariff Price",
        type: "number",
        style: {
          width: "90px",
        },
      },
      Qty: {
        title: "Qty",
        type: "string",
      },
      Price: {
        title: "Price",
        type: "string",
      },
      DoctorName: {
        title: "Doctor Name",
        type: "string",
        style: {
          width: "120px",
        },
      },
      Disc: {
        title: "Disc%",
        type: "string",
      },
      DiscAmount: {
        title: "Disc. Amount",
        type: "string",
        style: {
          width: "120px",
        },
      },
      TotalAmount: {
        title: "Total Amount",
        type: "string",
        style: {
          width: "120px",
        },
      },
      GST: {
        title: "GST%",
        type: "string",
      },
    },
  };

  serviceselectedList: any[] = [];

  miscServBillForm!: FormGroup;
  serviceID!: number;
  location: number = Number(this.cookie.get("HSPLocationId"));
  question: any;
  private readonly _destroying$ = new Subject<void>();
  interactionData: { id: number; name: string }[] = [] as any;
  referralDoctor: { id: number; name: string }[] = [] as any;

  ngOnInit(): void {
    let serviceFormResult = this.formService.createForm(
      this.miscBillData.properties,
      {}
    );

    this.miscServBillForm = serviceFormResult.form;
    this.question = serviceFormResult.questions;

    //Referral Doctor
    this.http
      .get(ApiConstants.getreferraldoctor(2, ''))
      .pipe(takeUntil(this._destroying$))
      .subscribe((res: any) => {
        this.referralDoctor = res;
        this.question[8].options = this.referralDoctor.map((a) => {
          return { title: a.name, value: a.id };
        });

      });


    //interaction master
    this.http
      .get(ApiConstants.getinteractionmaster)
      .pipe(takeUntil(this._destroying$))
      .subscribe((res: any) => {
        this.interactionData = res;
        this.question[9].options = this.interactionData.map((a) => {
          return { title: a.name, value: a.id };
        });

      });
  }


  //Print Report
  print() {
    this.openReportModal("billingreport");
  }
  openReportModal(btnname: string) {

    this.reportService.openWindow(btnname, btnname, {
      opbillid: 10,
      locationID: 7
    });
  }








  postBillObj: MiscellaneousBillingModel = [] as any;
  addNewItem(): any {
    let abc = this.miscPatient.getFormLsit();
    console.log(abc);
    this.postBillObj.dtSaveOBill_P = this.miscPatient.getFormLsit();
    this.postBillObj.dtMiscellaneous_list = [...this.serviceselectedList];
    this.postBillObj.dtGST_Parameter_P = this.dtGST_Parameter_P;
    this.postBillObj.ds_paymode = {
      tab_paymentList: [
        {
          slNo: 1,

          modeOfPayment: "Cash",

          amount: 400,

          flag: 1,
        },
      ],
      tab_cheque: [],
      tab_dd: [],
      tab_credit: [],
      tab_debit: [],
      tab_Mobile: [],
      tab_Online: [],
      tab_UPI: [],
    };
    this.postBillObj.dtDeposit_P = {};
    this.postBillObj.dtSaveDeposit_P = {};
    this.postBillObj.htParameter_P = {};
    this.postBillObj.dtGST_Parameter_P;
    this.postBillObj.operatorId = Number(this.cookie.get("UserId"));
    this.postBillObj.locationId = Number(this.cookie.get("HSPLocationId"));
    return this.postBillObj; // this.newItemEvent.emit(this.serviceselectedList);
  }

  makeBill() {
    this.addNewItem();
    this.http
      .post(ApiConstants.postMiscBill, this.postBillObj)
      .pipe(takeUntil(this._destroying$))
      .subscribe(
        (resultData) => {
          console.log("success");
        },
        (error) => {
          console.log(error);
          // this.messageDialogService.info(error.error);
        }
      );
  }
  count!: number;
  TotalAmount!: number;
  clearDraftedService() {
    this.miscServBillForm.controls["item"].setValue({
      title: "",
      value: 0,
    });
    this.miscServBillForm.controls["qty"].setValue("");
    this.miscServBillForm.controls["tffPrice"].setValue("");
    this.miscServBillForm.controls["pDoc"].setValue({
      title: "",
      value: 0,
    });
    this.miscServBillForm.controls["remark"].setValue({
      title: "",
      value: 0,
    });

    this.miscServBillForm.controls["reqAmt"].setValue("");
  }
  addService() {
    this.count = this.serviceselectedList.length + 1;
    let ServiceType = this.serviceName;
    let present = false;
    this.serviceselectedList.forEach((element) => {
      if (ServiceType == element.ServiceType) {
        present = true;
        return;
        console.log("same service");
      }
    });
    if (!present) {
      this.pushDataToServiceTable();
      this.serviceselectedList = [...this.serviceselectedList];
    }

    this.calculateTotalAmount();
    this.clearSelectedService();
  }
  pushDataToServiceTable() {
    this.serviceselectedList.push({
      Sno: this.count,
      ServiceType: this.serviceName,
      ItemDescription: this.miscServBillForm.value.item.title,
      ItemforModify: this.miscServBillForm.value.item.title,
      TariffPrice: this.miscServBillForm.value.tffPrice,
      Qty: this.miscServBillForm.value.qty,
      Price: this.miscServBillForm.value.reqAmt,
      DoctorName: this.miscServBillForm.value.pDoc.title,
      Disc: 1,
      DiscAmount: 1,
      TotalAmount:
        this.miscServBillForm.value.reqAmt * this.miscServBillForm.value.qty,
      GST: 0,
      serviceid: this.serviceID,
      amount:
        this.miscServBillForm.value.reqAmt * this.miscServBillForm.value.qty,
      discountAmount: 0,
      serviceName: this.serviceName,
      itemModify: this.miscServBillForm.value.item.title,
      discounttype: "",
      disReasonId: 0,
      docid: 0,
      remarksId: this.miscServBillForm.value.remark.value,
      itemId: this.miscServBillForm.value.item.value,
      mPrice: this.miscServBillForm.value.tffPrice,
      empowerApproverCode: 0,
      couponCode: "",
    });
  }
  clearSelectedService() {
    this.miscServBillForm.controls["serviceType"].setValue({
      title: "",
      value: 0,
    });
  }

  calculateTotalAmount() {
    this.TotalAmount = 0;
    this.serviceselectedList.forEach((element) => {
      this.TotalAmount += element.TotalAmount;
    });
    this.miscServBillForm.controls["billAmt"].setValue(this.TotalAmount);
  }
  ngAfterViewInit(): void {
    this.formEvents();
  }

  formEvents() {
    this.getMasterMiscDetail();

    this.miscServBillForm.controls["serviceType"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value: any) => {
        console.log(value);
        if (value.value) {
          this.serviceID = value.value;
          this.serviceName = value.title;
        }
        this.setServiceItemList();
      });
    this.miscServBillForm.controls["item"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value: any) => {
        console.log(value);
        if (value.value) {
          this.itemID = value.value;
          this.itemName = value.title;
        }
        this.setTarrifItemList();
      });
    // this.questions[0].elementRef.addEventListener(
    //   "change",
    //   this.setServiceItemList.bind(this)
    // );
    this.question[1].elementRef.addEventListener(
      "blur",
      this.getTarrifPrice.bind(this)
    );
  }

  gst: { service: string; percentage: number; value: number }[] = [
    { service: "CGST", percentage: 0.0, value: 0.0 },
    { service: "SGST", percentage: 0.0, value: 0.0 },
    { service: "UTGST", percentage: 0.0, value: 0.0 },
    { service: "IGST", percentage: 0.0, value: 0.0 },
    { service: "CESS", percentage: 0.0, value: 0.0 },
    { service: "TOTAL TAX", percentage: 0.0, value: 0.0 },
  ];
  openGSTDialog() {
    this.matDialog.open(GstComponent, {
      width: "24vw",
      height: "56vh",

      data: {
        gstDetails: this.gst,
      },
    });
  }
  serviceName!: string;
  itemName!: string;

  setServiceItemList() {
    console.log("setServiceItemList");

    this.clearDraftedService();
    console.log(this.miscServBillForm.value.serviceType.title);
    if (this.miscServBillForm.value.serviceType) {
      this.serviceID = this.miscServBillForm.value.serviceType.value;
      this.serviceName = this.miscServBillForm.value.serviceType.title;
      if (this.serviceID) {
        this.getallserviceitems();
      }

      this.getServiceItemBySerivceID();
    }
  }
  //Filter items based on Service
  getallserviceitems() {
    this.serviceItemsList = [];
    this.http
      .get(
        ApiConstants.getServiceitemsByServiceID(
          this.serviceID, 7
        )
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe((data) => {
        this.serviceItemsList = data as ServiceTypeItemModel[];
        this.question[1].options = [
          ...this.serviceItemsList.map((a) => {
            return { title: a.itemname, value: a.itemId };
          }),
        ];

      })
  }
  //Tarrif Trigger
  setTarrifItemList() {
    if (this.miscServBillForm.value.item) {
      this.getPriceforitemwithTariffId();
      this.getservices_byprocedureidnew();
    }
  }
  // Bill amt based on service
  getPriceforitemwithTariffId() {
    let PriorityId = 1;

    //let Hsplocationid = this.location;
    let Hsplocationid = 7;
    let CompanyId = 0;
    let CompanyFlag = 0;
    let intBundleId = 0;
    this.http
      .get(
        ApiConstants.getPriceforitemwithTariffId(PriorityId, this.itemID, this.serviceID, Hsplocationid, CompanyId, CompanyFlag, intBundleId)
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe((data) => {
        this.billAmnt = data.amount;
        this.miscServBillForm.controls["tffPrice"].setValue(data.amount);
        this.miscServBillForm.controls["reqAmt"].setValue(data.amount);

        console.log(data, "getPriceforitemwithTariffId");
      })
  }
  //Get Tax id & type
  getservices_byprocedureidnew() {
    this.http
      .get(
        ApiConstants.getservices_byprocedureidnew(
          this.itemID, this.serviceID
        )
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe((data) => {
        this.taxid = data[0].id;
        this.taxcode = data[0].code;
        this.taxtype = data[0].taxType;
        this.taxService = data[0].serviceId

        console.log(data, "getservices_byprocedureidnew");
      })

    if (this.taxid) {
      this.getgstdata();
    }
  }
  //Fetch GST Data
  getgstdata() {
    // let location = this.location;
    //let company =this.miscServBillForm.controls["company"].value;
    let location = 7;
    let company = 31316;
    this.http
      .get(
        ApiConstants.getgstdata(
          this.taxid, company, location, this.billAmnt
        )
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe((data) => {

        this.gstData = data;
        console.log(this.gstData, "getgstdata");
      })
  }
  miscMasterDataList!: MiscMasterDataModel;

  getMasterMiscDetail() {
    this.http
      .get(ApiConstants.getMasterMiscDetail)
      .pipe(takeUntil(this._destroying$))
      .subscribe((data) => {
        console.log(data);
        this.miscMasterDataList = data as MiscMasterDataModel;
        this.question[0].options =
          this.miscMasterDataList.objMiscBillingConfigurationList.map((a) => {
            return { title: a.name, value: a.serviceid };
          });
        this.question[5].options =
          this.miscMasterDataList.objMiscDoctorsList.map((a) => {
            return { title: a.name, value: a.id };
          });
        this.question[6].options =
          this.miscMasterDataList.objMiscBillingRemarksList.map((a) => {
            return { title: a.name, value: a.id };
          });
      });
  }

  getServiceItemBySerivceID() {
    this.http
      .get(
        ApiConstants.getServiceitemsByServiceID(this.serviceID, this.location)
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe((data) => {
        console.log(data);
        this.serviceItemsList = data as ServiceTypeItemModel[];
        console.log(this.serviceItemsList, "Service list")
        this.question[1].options = [
          ...this.serviceItemsList.map((a) => {
            return { title: a.itemname, value: a.itemId };
          }),
        ];
      });
  }

  //  FOR SETTING PRIORITY
  getPriority() { }
  itemID!: number;
  terrifDetail!: TarrifPriceModel;
  getTarrifPrice() {
    if (this.miscServBillForm.value.item.value) {
      this.http
        .get(
          ApiConstants.getTarrifByServiceID(
            this.miscPatient.getPriority(this.serviceName),
            this.miscServBillForm.value.item.value,
            this.serviceID,
            Number(this.cookie.get("HSPLocationId"))
          )
        )
        .pipe(takeUntil(this._destroying$))
        .subscribe((data) => {
          console.log(data);
          this.terrifDetail = data as TarrifPriceModel;
          if (this.terrifDetail) {
            this.miscServBillForm.controls["tffPrice"].setValue(
              this.terrifDetail.amount
            );
          } else {
            this.miscServBillForm.controls["tffPrice"].setValue(0);
          }
        });
    }
  }
  filterList(list: any[], control: any): any {
    // this.genderList.filter(
    //   (g) => g.id === this.OPRegForm.controls[control"].value
    // )[0].name;
    list.filter(function (item) {
      return item.name === control.value;
    });
  }
  discAmtDialog() {
    this.matDialog.open(DiscountAmtDialogComponent, {
      width: 'full', height: 'auto', data: {
        message: "Do you want to save?"
      },
    });
  }
  openMakeBilldialog() {
    const MakeDepositDialogref = this.matDialog.open(MakeBillDialogComponent, {
      width: "33vw",
      height: "40vh",
      data: {
        message: "Do you want to make Bill?",
      },
    });

    MakeDepositDialogref.afterClosed()
      .pipe(takeUntil(this._destroying$))
      .subscribe((result) => {
        if (result == "Success") {
          this.openDepositdialog();
        }
      });
  }
  openGstTaxDialog() {
    this.matDialog.open(GstTaxDialogComponent, {
      width: '35vw', height: '70vh', data: {
        gstdata: this.gstData,
      },
    });
  }

  // discAmtDialog() {
  //   this.matDialog.open(DiscountAmtDialogComponent, {
  //     width: 'full', height: 'auto', data: {
  //       message: "Do you want to save?"
  //     },
  //   });
  // }
  openDepositdialog() {
    const MakeDepositDialogref = this.matDialog.open(
      MakedepositDialogComponent,
      {
        width: "33vw",
        height: "40vh",
        data: {
          message: "Do you want to avail Deposits?",
        },
      }
    );

    MakeDepositDialogref.afterClosed()
      .pipe(takeUntil(this._destroying$))
      .subscribe((result) => {
        // if (result == "Success")
        //  {
        //   const DepositDialogref = this.matDialog.open(DepositDialogComponent, {
        //     width: '70vw', height: '98vh', data: {
        //       servicetype: this.patientservicetype, deposittype: this.patientdeposittype,
        //       patientinfo: {
        //         emailId: this.patientpersonaldetails[0]?.pEMail  , mobileno: this.patientpersonaldetails[0]?.pcellno,
        //         panno : this.patientpersonaldetails[0]?.paNno, registrationno: this.regNumber, iacode:this.iacode
        //       }
        //     },
        //   });
        //   DepositDialogref.afterClosed()
        //     .pipe(takeUntil(this._destroying$))
        //     .subscribe((result) => {
        //       if(result == "Success"){
        //         this.getPatientPreviousDepositDetails();
        //         console.log("Deposit Dialog closed");
        //       }
        //     });
        // }
      });
  }

  //USING FOR TESTING PURPOSE
  dtGST_Parameter_P: any = {
    gsT_value: 0,
    gsT_percent: 0,
    cgsT_Value: 0,
    cgsT_Percent: 0,
    sgsT_value: 0,
    sgsT_percent: 0,
    utgsT_value: 0,
    utgsT_percent: 0,
    igsT_Value: 0,
    igsT_percent: 0,
    cesS_value: 0,

    cesS_percent: 0,

    taxratE1_Value: 0,

    taxratE1_Percent: 0,

    taxratE2_Value: 0,

    taxratE2_Percent: 0,

    taxratE3_Value: 0,

    taxratE3_Percent: 0,

    taxratE4_Value: 0,

    taxratE4_Percent: 0,

    taxratE5_Value: 0,

    taxratE5_Percent: 0,

    totaltaX_RATE: 0,

    totaltaX_RATE_VALUE: 0,

    saccode: "99931",
    taxgrpid: 25,
  };
  tab_paymentList: {
    slNo: number;

    modeOfPayment: string;

    amount: number;

    flag: number;
  } = {
      slNo: 1,

      modeOfPayment: "Cash",

      amount: 400,

      flag: 1,
    };
}
@Component({
  selector: "out-patients-bill-detail",
  templateUrl: "./credit-detail.component.html",
  styleUrls: ["./bill-detail.component.scss"],
})
export class MiscCredDetail implements OnInit {
  comapnyFormData = {
    title: "",
    type: "object",
    properties: {
      company: {
        type: "dropdown",
        title: "Company",
      },
      corporate: {
        type: "dropdown",
        title: "Corporate",
      },
      companyGSTN: {
        type: "dropdown",
        title: "Company GSTN",
      },
      letterDate: {
        type: "date",
        title: "Letter Date",
      },
      issuedBy: {
        type: "string",
        title: "Issued By",
      },
      employeeNo: {
        type: "string",
        title: "Employee No.",
      },
      companyName: {
        type: "string",
        title: "Company Name",
      },
      tokenNo: {
        type: "string",
        title: "Token No.",
      },
      companyAddress: {
        type: "string",
        title: "Company Address",
      },
    },
  };

  generalFormData = {
    title: "",
    type: "object",
    properties: {
      employeeName: {
        type: "dropdown",
        title: "Employee Name",
      },
      designation: {
        type: "string",
        title: "Designation",
      },
      reasonForAllowingCredit: {
        type: "textarea",
        title: "Reason for Allowing Credit",
      },
      notes: {
        title: "Notes",
        type: "textarea",
      },
    },
  };

  comapnyFormGroup!: FormGroup;
  generalFormGroup!: FormGroup;
  companyQuestions: any;
  generalQuestions: any;

  constructor(
    private formService: QuestionControlService,
    private Miscservice: MiscService
  ) { }

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.comapnyFormData.properties,
      {}
    );
    this.comapnyFormGroup = formResult.form;
    this.companyQuestions = formResult.questions;

    let formResult1: any = this.formService.createForm(
      this.generalFormData.properties,
      {}
    );
    this.generalFormGroup = formResult1.form;
    this.generalQuestions = formResult1.questions;
  }


}
