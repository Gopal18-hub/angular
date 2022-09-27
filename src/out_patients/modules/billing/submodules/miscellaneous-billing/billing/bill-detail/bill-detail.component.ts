import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
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

import { ReportService } from "@shared/services/report.service";
import { MaxHealthSnackBarService } from "@shared/ui/snack-bar";
import { DepositDetailsComponent } from "@modules/billing/submodules/billing/prompts/deposit-details/deposit-details.component";
import { DisountReasonComponent } from "@modules/billing/submodules/billing/prompts/discount-reason/disount-reason.component";
import { BillPaymentDialogComponent } from "@modules/billing/submodules/billing/prompts/payment-dialog/payment-dialog.component";
import { BillingService } from "@modules/billing/submodules/billing/billing.service";
import { GstTaxDialogComponent } from "../../prompts/gst-tax-dialog/gst-tax-dialog.component";
import { DiscountAmtDialogComponent } from "../../prompts/discount-amt-dialog/discount-amt-dialog.component";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";

@Component({
  selector: "out-patients-bill-detail",
  templateUrl: "./bill-detail.component.html",
  styleUrls: ["./bill-detail.component.scss"],
})
export class BillDetailComponent implements OnInit {
  disabledipositAmtEdit = false;
  @Input() miscCompany!: any;
  @Output() newItemEvent = new EventEmitter<any>();
  discountedAmt = 0;
  newItem!: MiscellaneousBillingModel;
  doctorList!: objMiscDoctorsList[];
  // serviceList!: objMiscBillingConfigurationList;
  remarkList!: objMiscBillingRemarksList[];
  serviceItemsList!: ServiceTypeItemModel[];
  serviceList!: { title: string; value: number }[];
  miscCompanyId: any;
  generatedBillNo = '';
  enableDiscount: boolean = false;
  isEnableBillBtn = false
  calcBillData: any = [];
  noMap = [];
  gstDataResult: any = [];
  //Tax info
  taxid = 0;
  taxcode = '';
  taxtype = '';
  taxService = '';
  billAmnt = 0;
  gstData = [];
  billToCompId = 0;
  enablePrint = false;
  enableItems = false;
  refDoctor: any = [];
  depodialogRows = [];
  depodialogTotal = 0;
  txtServiceTaxAmt = 0;
  CreditAmtforSrvTax = 0;
  depositDetails: any = [];
  miscServBillForm!: FormGroup;
  serviceID!: number;
  location: number = Number(this.cookie.get("HSPLocationId"));
  stationId = Number(this.cookie.get("StationId"));
  userID = Number(this.cookie.get("UserId"));

  // location = 67;
  // stationId = 10475
  // userID = 9923;
  question: any;
  private readonly _destroying$ = new Subject<void>();
  interactionData: { id: number; name: string }[] = [] as any;
  referralDoctor: { id: number; name: string }[] = [] as any;

  serviceselectedList: any[] = [];
  enableItemsService = false;
  enableClear = false;
  totalDeposit = 0;

  postBillObj: MiscellaneousBillingModel = {} as any;
  count!: number;
  setItemsToBill: any = [];
  TotalAmount: any = '0';
  totaltaX_Value: any = 0;
  gst: { service: string; percentage: number; value: number }[] = [
    { service: "CGST", percentage: 0.0, value: 0.0 },
    { service: "SGST", percentage: 0.0, value: 0.0 },
    { service: "UTGST", percentage: 0.0, value: 0.0 },
    { service: "IGST", percentage: 0.0, value: 0.0 },
    { service: "CESS", percentage: 0.0, value: 0.0 },
    { service: "TOTAL TAX", percentage: 0.0, value: 0.0 },
  ];
  serviceName!: string;
  itemName!: string;

  b2bflag: any = "";
  itemID!: number;
  terrifDetail!: TarrifPriceModel;
  miscMasterDataList!: MiscMasterDataModel;




  constructor(
    public matDialog: MatDialog,
    private formService: QuestionControlService,
    private messageDialogService: MessageDialogService,
    private router: Router,
    private http: HttpService,
    private cookie: CookieService,
    private miscPatient: MiscService,
    private reportService: ReportService,
    private snackbar: MaxHealthSnackBarService,
    private billingservice: BillingService,
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
        placeholder: "Select",
        required: true,
      },
      //1
      item: {
        type: "autocomplete",
        title: "Item",
        required: true,
        options: this.serviceItemsList,
        placeholder: "Select",
      },
      //2
      tffPrice: {
        type: "number",
        title: "Tarrif Price",
        //required: true,
        readonly: true,
        defaultValue: "0.00",
      },
      //3
      qty: {
        type: "number",
        title: "Qty",
        maximum: 9,
        minimum: 1,
        defaultValue: "0",
        required: true,
      },
      //4
      reqAmt: {
        type: "number",
        title: "Req. Amt.",
        defaultValue: "0.00",
        minimum: 1,
        required: true,
      },
      //5
      pDoc: {
        type: "autocomplete",
        title: "Procedure Doctor",
        options: this.doctorList,
        placeholder: "Select",
        // required: true,
      },
      //6
      remark: {
        type: "autocomplete",
        title: "Remarks",
        required: true,
        options: this.remarkList,
        placeholder: "Select"
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
        required: true,
        title: "Referral Doctor",
        placeholder: "Select",
      },
      //9
      interactionDetails: {
        type: "dropdown",
        //required: true,
        title: "Interaction Details",
        placeholder: "Select"
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
        readonly: true,
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
        readonly: true,
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
        //readonly: true,
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
          { title: "Cash", value: "1" },
          { title: "Credit", value: "2" },
          { title: "Gen. OPD", value: "Gen OPD" },
        ],
        defaultValue: "1",
      },
      //27
      dipositAmtEdit: {
        type: "number",
        required: false,
        defaultValue: "0.00",
        readonly: this.disabledipositAmtEdit,
      },
    },

  };
  config: any = {
    selectBox: false,
    clickedRows: false,
    clickSelection: "single",
    removeRow: true,
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
      "TotalAmnt",
      "GST",
    ],
    columnsInfo: {
      Sno: {
        title: "S.No.",
        type: "number",
        style: {
          width: "5%",
        },
      },
      ServiceType: {
        title: "Service Type",
        type: "string",
        style: {
          width: "11%",
        },
      },
      ItemDescription: {
        title: "Item Description",
        type: "string",
        style: {
          width: "13%",
        },
      },
      ItemforModify: {
        title: "Item For Modify",
        type: "string",
        style: {
          width: "13%",
        },
      },
      TariffPrice: {
        title: "Tariff Price",
        type: "number",
        style: {
          width: "7%",
        },
      },
      Qty: {
        title: "Qty",
        type: "string",
        style: {
          width: "7%",
        },
      },
      Price: {
        title: "Price",
        type: "string",
        style: {
          width: "8%",
        },
      },
      DoctorName: {
        title: "Doctor Name",
        type: "string",
        style: {
          width: "8%",
        },
      },
      Disc: {
        title: "Disc%",
        type: "string",
        style: {
          width: "4%",
        },
      },
      DiscAmount: {
        title: "Disc. Amount",
        type: "string",
        style: {
          width: "8%",
        },
      },
      TotalAmnt: {
        title: "Total Amount",
        type: "string",
        style: {
          width: "8%",
        },
      },
      GST: {
        title: "GST%",
        type: "string",
        style: {
          width: "4%",
        },
      },
    },
  };
  clearItem = false
  ngOnInit(): void {

    let serviceFormResult = this.formService.createForm(
      this.miscBillData.properties,
      {}
    );

    this.miscServBillForm = serviceFormResult.form;
    this.question = serviceFormResult.questions;
    //this.getbilltocompany();



    this.miscPatient.clearAllItems.subscribe((clearItems) => {
      if (clearItems) {
        this.clearItem = true;
        this.miscServBillForm.reset();
        this.resetAmt()
        this.serviceselectedList = [];
        this.clearSelectedService();
      }
    });
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
  ngAfterViewInit() {
    this.formEvents();
    // this.getDipositedAmountByMaxID();
  }
  formEvents() {
    this.getMasterMiscDetail();
    // this.enableItemsService = false;
    let compId = this.miscPatient.getCompany();
    if (this.miscServBillForm.value.paymentMode == 2) {
      if (compId) {
        this.getbilltocompany(compId);
      }
    }
    this.miscServBillForm.controls["paymentMode"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value: any) => {
        this.setItemsToBill.paymentMode = value;
        this.miscPatient.setMiscBillFormData(this.setItemsToBill);
      });

    this.miscServBillForm.controls["serviceType"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value: any) => {
        if (value) {
          if (value.value) {
            this.serviceID = value.value;
            this.serviceName = value.title;
            this.checkService();
          }
        }
        else if (!this.miscServBillForm.value.serviceType && this.clearItem == false) {
          this.snackbar.open("Select Service Item", "error");
        }
        this.setServiceItemList();
      });
    // this.question[0].elementRef.addEventListener("Tab",
    //   this.checkService()
    // );

    this.miscServBillForm.controls["item"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value: any) => {
        if (value) {
          if (value.value) {
            this.itemID = value.value;
            this.itemName = value.title;
            this.checkService();
            this.getservices_byprocedureidnew();
            this.setTarrifItemList();
          }
        }
        else if (!this.miscServBillForm.value.item && this.clearItem == false) {
          this.snackbar.open("Enter the Item Description First", "error");
        }
      });
    this.miscServBillForm.controls["qty"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value: any) => {
        if (value) {
          this.checkService();
        }
        else if (this.miscServBillForm.value.qty === 0 && this.clearItem == false) {
          this.snackbar.open("Quantity Can Not be Zero", "error");
        }
      })
    this.miscServBillForm.controls["reqAmt"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value: any) => {
        if (value) {
          this.checkService();
        }
        else if (this.miscServBillForm.value.reqAmt <= 0 && this.clearItem == false) {
          this.snackbar.open("Item Price Can Not be Zero", "error");
        }
      })
    this.miscServBillForm.controls["remark"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value: any) => {
        if (value) {
          this.checkService();
        }
        else if (!this.miscServBillForm.value.remark && this.clearItem == false) {
          this.snackbar.open("Please select remarks!", "error");
        }
      })
    this.miscServBillForm.controls["discAmtCheck"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value: any) => {
        this.enableDiscount = false;
        if (value === true) {
          this.enableDiscount = true;
          this.openDiscountdialog();
        }
        else {
          this.calcBillData.totalDiscount = 0;
          this.miscPatient.setCalculateBillItems(this.calcBillData);
          let calcBill0 = this.miscPatient.calculateBill();
          this.miscServBillForm.controls["discAmt"].setValue(0 + ".00");
          this.miscServBillForm.controls["billAmt"].setValue((calcBill0.totalBillAmount) + ".00");
          this.miscServBillForm.controls["amtPayByPatient"].setValue(calcBill0.amntPaidBythePatient + ".00");
        }
      });

    this.miscServBillForm.controls["dipositAmtcheck"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value: any) => {
        this.enableDiscount = false;
        if (value === true) {
          this.openDepositdialog();
        }
        else {
          this.calcBillData.totalDeposit = 0;
          this.miscPatient.setCalculateBillItems(this.calcBillData);
          let calcBill0 = this.miscPatient.calculateBill();
          this.miscServBillForm.controls["dipositAmt"].setValue(0 + ".00");
          this.miscServBillForm.controls["dipositAmtEdit"].setValue(0 + ".00");
          this.miscServBillForm.controls["billAmt"].setValue((calcBill0.totalBillAmount) + ".00");
          this.miscServBillForm.controls["amtPayByPatient"].setValue(calcBill0.amntPaidBythePatient + ".00");
        }
      });


    this.question[27].elementRef.addEventListener("keypress", (event: any) => {
      if (event.key === "Enter") {
        event.preventDefault();
        this.calcBillData.depositInput = Number(this.miscServBillForm.value.dipositAmtEdit);
        this.miscPatient.setCalculateBillItems(this.calcBillData);
        let calcBill0 = this.miscPatient.calculateBill();
        this.miscServBillForm.controls["billAmt"].setValue(calcBill0.totalBillAmount + ".00");
        this.miscServBillForm.controls["dipositAmtEdit"].setValue((calcBill0.depositInput) + ".00");
        this.miscServBillForm.controls["amtPayByPatient"].setValue((calcBill0.amntPaidBythePatient) + ".00");

      }
    });
  }
  checkService() {
    if (this.miscServBillForm.value.serviceType && this.miscServBillForm.value.item && this.miscServBillForm.value.qty > 0 && this.miscServBillForm.value.reqAmt > 0 && this.miscServBillForm.value.remark) {
      this.enableItemsService = true;
    }
    else {
      this.enableItemsService = false;
    }
  }
  selectedReferralDoctor(data: any) {
    this.refDoctor = data.docotr;
    this.billingservice.setReferralDoctor(data.docotr);
  }
  //Get onload Dropdown
  getMasterMiscDetail() {

    this.http
      .get(ApiConstants.getMasterMiscDetail)
      .pipe(takeUntil(this._destroying$))
      .subscribe((data) => {

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
  //Get Service
  getServiceItemBySerivceID() {
    this.http
      .get(
        ApiConstants.getServiceitemsByServiceID(this.serviceID, this.location)
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe((data) => {

        this.serviceItemsList = data as ServiceTypeItemModel[];

        this.question[1].options = [
          ...this.serviceItemsList.map((a) => {
            return { title: a.itemname, value: a.itemId };
          }),
        ];


      });
  }
  setServiceItemList() {


    // this.clearDraftedService();

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
          this.serviceID, this.location
        )
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe((data) => {
        this.serviceItemsList = data as ServiceTypeItemModel[];
        if (this.serviceItemsList.length > 0) {
          this.question[1].options = [
            ...this.serviceItemsList.map((a) => {
              return { title: a.itemname, value: a.itemId };
            }),
          ];
        }
      })
  }
  //Tarrif Trigger
  setTarrifItemList() {
    if (this.miscServBillForm.value.item) {
      this.getPriceforitemwithTariffId();
    }
  }
  //Tarrif
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

          this.terrifDetail = data as TarrifPriceModel;
          if (this.terrifDetail) {
            this.miscServBillForm.controls["tffPrice"].setValue(
              this.terrifDetail.amount + ".00"
            );
          } else {
            //this.miscServBillForm.controls["tffPrice"].setValue(0);
          }
        });
    }
  }
  //check Bill Preparation 
  getbilltocompany(data: any) {
    this.http
      .get(
        ApiConstants.getbilltocompany(data)
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe((data) => {
        this.billToCompId = data.dtBilltocompany[0].id;
        this.b2bflag = data.dtBilltocompany[0].checkGSTN_ForB2B;

        if (String(this.b2bflag.trim()).toUpperCase() === "Y") {
          //TotalTaxGST > 0 And creditlimit > 0

          if ((data.dtBilltocompany[0].gstNumber === null) || (data.dtBilltocompany[0].gstNumber === 0)) {
            this.snackbar.open("Bill To Company GSTN and Address Details are Mandatory for Bill Preparation", "error")
          }
          else if (this.miscCompanyId === 0 || this.miscCompanyId === null) {
            this.snackbar.open("Please Select Company GSTN!", "error")
          }
        }
      })
  }
  //Patient Deposit Details
  getDipositedAmountByMaxID() {
    let miscPatient = this.miscPatient.getFormLsit();
    let regNumber = miscPatient.registrationno;
    let iacode = miscPatient.iacode;
    this.disabledipositAmtEdit = false;

    this.http
      .get
      // (
      //   ApiConstants.getDipositedAmountByMaxID(
      //     "BLKH", 1020369,
      //     67)
      // )
      (
        ApiConstants.getDipositedAmountByMaxID(
          iacode,
          regNumber,
          this.location
        )
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe(
        (resultData: any) => {
          this.depositDetails = resultData;
          resultData.forEach((element: any) => {
            this.totalDeposit += element.balanceamount;
          });

        },
        (error) => {
        }
      );
  }
  // Bill amt based on service
  getPriceforitemwithTariffId() {

    this.miscCompanyId = this.miscPatient.getCompany();
    if (!this.miscCompanyId) {
      this.miscCompanyId = 0
    }

    let PriorityId = 1;

    let Hsplocationid = this.location;
    //let Hsplocationid = 7;
    let CompanyId = this.miscCompanyId;
    //let CompanyId = Number(this.miscCompany);

    let CompanyFlag = 0;
    let intBundleId = 0;
    if (this.miscServBillForm.value.item.value) {
      this.http
        .get(
          ApiConstants.getPriceforitemwithTariffId(PriorityId, this.itemID, this.serviceID, Hsplocationid, CompanyId, CompanyFlag, intBundleId)
        )
        .pipe(takeUntil(this._destroying$))
        .subscribe((data) => {
          this.miscServBillForm.controls["tffPrice"].setValue(data.amount + ".00");
          this.miscServBillForm.controls["reqAmt"].setValue(data.amount + ".00");

        })
    }

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
        this.noMap = data;
        this.taxid = data[0].id;
        this.taxcode = data[0].code;
        this.taxtype = data[0].taxType;
        this.taxService = data[0].serviceId;
        if (this.taxid) {
          // this.getgstdata();
        }
      })

  }
  ////Service Tax map check
  getservices_byprocedureid() {
    this.http
      .get(
        ApiConstants.getservices_byprocedureid(
          this.itemID, this.serviceID
        )
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe((data) => {
        this.noMap = data;
      })
  }
  //Fetch GST Data
  getgstdata() {
    let location = this.location;
    //let company =this.miscServBillForm.controls["company"].value;
    //let location = 7;
    let company = this.miscCompanyId;
    this.http
      .get
      (
        ApiConstants.getgstdata(
          this.taxid, company, location, this.TotalAmount
        )
        // ApiConstants.getgstdata(
        //   229, 19535, 7, 1000
        // )
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe((data) => {
        this.gstData = data;
        this.totaltaX_Value = data[0].totaltaX_Value
        this.miscServBillForm.controls["gstTax"].setValue(this.totaltaX_Value + ".00")
        this.calcBillData.totalGst = this.totaltaX_Value;
        this.miscPatient.setCalculateBillItems(this.calcBillData);
        let calcBill0 = this.miscPatient.calculateBill();
        this.miscServBillForm.controls["amtPayByPatient"].setValue((calcBill0.amntPaidBythePatient) + ".00");


      })
  }

  ///PAN
  setpanno() {


    // let regNumber = Number(this.miscForm.value.maxid.split(".")[1]);
    // let iacode = this.miscForm.value.maxid.split(".")[0];

    let miscPatient = this.miscPatient.getFormLsit();
    let regNumber = miscPatient.registrationno;
    let iacode = miscPatient.iacode;
    this.http
      .get(ApiConstants.setpanno(iacode, regNumber, miscPatient.pan))
      .pipe(takeUntil(this._destroying$))
      .subscribe((res: any) => {
        this.interactionData = res;
        this.question[9].options = this.interactionData.map((a) => {
          return { title: a.name, value: a.id };
        });

      });
  }
  //Add Service
  addService() {

    if (!this.miscServBillForm.value.serviceType) {
      this.snackbar.open("Select Service Item", "error");
    }
    else if (!this.miscServBillForm.value.item) {
      this.snackbar.open("Enter the Item Description First", "error");
    }
    else if (!this.miscServBillForm.value.qty) {
      this.snackbar.open("Enter the Item Quantity", "error");
    }
    else if (this.miscServBillForm.value.qty <= 0) {
      this.snackbar.open("Quantity Can Not be Zero", "error");
    }
    else if (!this.miscServBillForm.value.reqAmt) {
      this.snackbar.open("Enter the Item Price", "error");
    }
    else if (this.miscServBillForm.value.reqAmt === 0) {
      this.snackbar.open("Item Price Can Not be Zero", "error");
    }
    else if (!this.miscServBillForm.value.remark.value) {
      this.snackbar.open("Please select remarks!", "error");
    }
    else if (this.noMap.length === 0) {
      this.snackbar.open("Selected Service not Mapped with Tax.", "error");
      this.clearSelectedService();
      return
    }
    else {
      this.count = this.serviceselectedList.length + 1;
      let ServiceType = this.serviceName;
      let itemName = this.itemName
      let present = false;
      this.serviceselectedList.forEach((element) => {
        if (ServiceType == element.ServiceType && itemName == element.ItemDescription) {
          this.snackbar.open("Item Already Exits", "error");
          present = true;
          return;
        }
      });
      if (!present) {
        this.getgstdata();
        this.pushDataToServiceTable();
        this.serviceselectedList.forEach((e: any) => {
          e.TariffPrice = Number(e.TariffPrice).toFixed(2);
          //e.Qty = Number(e.Qty).toFixed(2);
          e.Price = Number(e.Price).toFixed(2);
          e.Disc = Number(e.Disc).toFixed(2);
          e.DiscAmount = Number(e.DiscAmount).toFixed(2);
          e.TotalAmnt = Number(e.TotalAmount).toFixed(2);
          e.GST = Number(e.GST).toFixed(2);
          e.amount = Number(e.amount).toFixed(2);
          e.discountAmount = Number(e.discount).toFixed(2);
          e.mPrice = Number(e.mPrice).toFixed(2);
          e.TotalAmount = e.TotalAmount;
        })
        this.serviceselectedList = [...this.serviceselectedList];
        this.miscPatient.setBillDetail(this.serviceselectedList);
        if (this.serviceselectedList.length > 0) {
          this.isEnableBillBtn = true
        }
      }

      this.calculateTotalAmount();
      this.clearSelectedService();
    }

  }
  pushDataToServiceTable() {
    let miscPatient = this.miscPatient.getMiscBillFormData();
    let pDoc = '';
    if (this.miscServBillForm.value.pDoc === null) {
      pDoc = ''
    }
    else { pDoc = this.miscServBillForm.value.pDoc.title; }



    this.serviceselectedList.push({
      Sno: this.count,
      ServiceType: this.serviceName,
      ItemDescription: this.miscServBillForm.value.item.title,
      ItemforModify: this.miscServBillForm.value.item.title,
      TariffPrice: this.miscServBillForm.value.tffPrice,
      Qty: this.miscServBillForm.value.qty,
      Price: this.miscServBillForm.value.reqAmt,
      DoctorName: pDoc,
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
  //Filter
  filterList(list: any[], control: any): any {
    // this.genderList.filter(
    //   (g) => g.id === this.OPRegForm.controls[control"].value
    // )[0].name;
    list.filter(function (item) {
      return item.name === control.value;
    });
  }
  //Clear
  clearDraftedService() {
    this.miscServBillForm.controls["item"].reset()
    this.miscServBillForm.controls["qty"].reset()
    this.miscServBillForm.controls["tffPrice"].reset()
    this.miscServBillForm.controls["pDoc"].reset()
    this.miscServBillForm.controls["remark"].reset()
    this.miscServBillForm.controls["reqAmt"].reset()
    //this.miscServBillForm.controls["serviceType"].reset();
    //this.miscServBillForm.controls["reqAmt"].reset()
    this.miscServBillForm.controls["serviceType"].reset()
    this.checkService()


    // this.miscServBillForm.reset();
  }
  clearSelectedService() {
    this.miscServBillForm.controls["serviceType"].setValue({
      title: "",
      value: 0,
    });
    this.clearDraftedService();
  }

  resetAmt() {
    this.miscServBillForm.controls["billAmt"].setValue(0 + ".00")
    this.miscServBillForm.controls["availDisc"].setValue(0 + ".00")
    this.miscServBillForm.controls["discAmt"].setValue(0 + ".00")
    this.miscServBillForm.controls["dipositAmt"].setValue(0 + ".00")
    this.miscServBillForm.controls["patientDisc"].setValue(0 + ".00")
    this.miscServBillForm.controls["compDisc"].setValue(0 + ".00")
    this.miscServBillForm.controls["planAmt"].setValue(0 + ".00")
    this.miscServBillForm.controls["coPay"].setValue(0 + ".00")
    this.miscServBillForm.controls["credLimit"].setValue(0 + ".00")
    this.miscServBillForm.controls["gstTax"].setValue(0 + ".00")
    this.miscServBillForm.controls["amtPayByPatient"].setValue(0 + ".00")
    this.miscServBillForm.controls["amtPayByComp"].setValue(0 + ".00")
    this.miscServBillForm.controls["dipositAmtEdit"].setValue(0 + ".00")

  }
  //  FOR SETTING PRIORITY
  getPriority() { }
  rowRwmove($event: any) {
    this.serviceselectedList.splice($event.index, 1);
    this.serviceselectedList = this.serviceselectedList.map(
      (item: any, index: number) => {
        item["Sno"] = index + 1;
        return item;
      }
    );

    this.serviceselectedList = [...this.serviceselectedList];
    if (this.serviceselectedList.length <= 0) {
      this.isEnableBillBtn = false;
    }
    // this.billingservice.calculateTotalAmount();
  }  //Dialog
  openDiscountdialog() {
    const MakeDepositDialogref = this.matDialog.open(
      MakedepositDialogComponent,
      {
        width: "33vw",
        height: "40vh",
        data: {
          message: "Do you want to apply Discounts?",
        },
      }
    );

    MakeDepositDialogref.afterClosed()
      .pipe(takeUntil(this._destroying$))
      .subscribe((result) => {
        if (result == "Success") {
          this.opendiscAmtDialog();
        }
      });
  }
  opendiscAmtDialog() {
    let dialogRes;
    //DisountReasonComponent
    //DiscountAmtDialogComponent
    const dialogref = this.matDialog.open(DiscountAmtDialogComponent, {
      width: 'full', height: 'auto', data: {
        data: this.billAmnt
      },
    });


    dialogref.afterClosed().subscribe(res => {
      this.calcBillData.totalDiscount = res.data;
      this.miscPatient.setCalculateBillItems(this.calcBillData);
      this.discountedAmt = res.data;
      let calcBill0 = this.miscPatient.calculateBill();
      this.miscServBillForm.controls["discAmt"].setValue((res.data) + ".00");
      this.miscServBillForm.controls["billAmt"].setValue((calcBill0.totalBillAmount) + ".00");
      this.miscServBillForm.controls["amtPayByPatient"].setValue(calcBill0.amntPaidBythePatient + ".00");

    })
  }
  openDepositdialog() {
    this.getDipositedAmountByMaxID()
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
        if (result == "Success") {
          const dialogref = this.matDialog.open(DepositDetailsComponent, {
            width: 'full', height: 'auto', data: {
              data: this.depositDetails
            },
          });


          dialogref.afterClosed().subscribe(res => {

            this.depodialogRows = res.data;
            res.data.forEach((element: any) => {
              this.depodialogTotal += element.balanceamount;
            });;

            this.calcBillData.totalDeposit = this.depodialogTotal;
            this.miscPatient.setCalculateBillItems(this.calcBillData);
            let calcBill0 = this.miscPatient.calculateBill();
            this.miscServBillForm.controls["dipositAmt"].setValue(this.depodialogTotal + ".00");
            if (res.data)
              this.snackbar.open("Deposit Amount availed successfully!");
            this.miscServBillForm.controls["dipositAmtEdit"].enable();

          })
        }
      });
  }
  openGstTaxDialog() {
    const gstDialogref = this.matDialog.open(GstTaxDialogComponent, {
      width: '35vw', height: '70vh', data: {
        gstdata: this.gstData,
      },
    });

    gstDialogref.afterClosed()
      .pipe(takeUntil(this._destroying$))
      .subscribe((result) => {
        if (result.data) {
          this.gstDataResult = result.data
        }
      })
  }
  openMakeBilldialog() {

    let miscFormData = this.miscPatient.getMiscBillFormData();


    if (!this.refDoctor.id) { this.snackbar.open("Please select Referral Doctor", "error") }
    else if (!miscFormData.companyId.value) { this.snackbar.open("Select the Company", "error") }
    else if (miscFormData.companyId.value && this.miscServBillForm.value.paymentMode === 2) {
      this.getbilltocompany(miscFormData.companyId.value)
      //  if (this.miscServBillForm.value.credLimit <= 0) { this.snackbar.open(" Enter Credit limit", "error") }
    }
    else if (!miscFormData.corporateId.value) { this.snackbar.open(" Please select corporate!", "error") }
    else {
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
            // this.openDepositdialog();
            this.makeBill();
          }
        });
      //}
    }

  }
  //NA
  openGSTDialog() {
    this.matDialog.open(GstComponent, {
      width: "24vw",
      height: "56vh",

      data: {
        gstDetails: this.gst,
      },
    });
  }

  //Calculate TA
  calculateTotalAmount() {
    this.TotalAmount = 0;
    this.serviceselectedList.forEach((element) => {
      this.TotalAmount = this.TotalAmount + element.TotalAmount;
    });
    this.calcBillData.totalAmount = this.TotalAmount;
    this.miscPatient.setCalculateBillItems(this.calcBillData);
    this.billAmnt = this.TotalAmount;
    let calcBill0 = this.miscPatient.calculateBill();
    this.miscServBillForm.controls["billAmt"].setValue(calcBill0.totalBillAmount + ".00");
    this.miscServBillForm.controls["amtPayByPatient"].setValue(calcBill0.amntPaidBythePatient + ".00");

  }

  //Make Bill Obj
  addNewItem(): any {
    //Payment Cash Popup
    const RefundDialog = this.matDialog.open(BillPaymentDialogComponent, {
      width: "70vw",
      height: "98vh",
      data: {
        billAmount: this.billAmnt,
        name: "MiscBilling"
      },
    });
    this.miscCompanyId = this.miscPatient.getCompany();
    let miscPatient = this.miscPatient.getFormLsit();
    let miscFormData = this.miscPatient.getMiscBillFormData()
    //this.setpanno();
    let calcBill0 = this.miscPatient.calculateBill();
    if (calcBill0.amntPaidBythePatient > 0) {
      this.CreditAmtforSrvTax = calcBill0.amntPaidBythePatient
      let srvTax = 10.3;
      this.txtServiceTaxAmt = ((this.CreditAmtforSrvTax) * srvTax) / 100
    }

    let depositData: any = {};
    if (this.depodialogRows) {
      this.depodialogRows.forEach((e: any) => {
        depositData.id = e.id;
        depositData.amount = e.amount;
        depositData.balanceamount = e.balanceamount;
      })
    }
    if (this.miscServBillForm.value.credLimit <= 0) {
      this.miscServBillForm.value.credLimit = 0
    }
    if (this.miscServBillForm.value.dipositAmtEdit <= 0) {
      this.miscServBillForm.value.dipositAmtEdit = 0;
    }
    if (calcBill0.amntPaidBythePatient <= 0) {
      calcBill0.amntPaidBythePatient = 0;
    }
    if (!calcBill0.selectedAuthorise) {
      calcBill0.selectedAuthorise = 0
    }
    if (this.miscServBillForm.value.interactionDetails <= 0) {
      this.miscServBillForm.value.interactionDetails = 0
    }
    if (!miscPatient.narration) {
      miscPatient.narration = ""
    }
    if (!miscPatient.b2bInvoiceType) {
      miscPatient.b2bInvoiceType = "B2B"
    }
    this.postBillObj.dtSaveOBill_P =
    {
      registrationno: miscPatient.registrationno,
      iacode: miscPatient.iacode,
      billAmount: this.billAmnt,
      depositAmount: this.miscServBillForm.value.dipositAmtEdit,
      discountAmount: this.discountedAmt,
      stationid: this.stationId, //10475, // Number(this.cookie.get("StationId")),
      billType: this.miscServBillForm.value.paymentMode, //cash
      categoryId: 0,
      companyId: miscFormData.companyId.value,
      operatorId: this.userID,// 9923, //Number(this.cookie.get("UserId"))
      collectedamount: 400,//from payment cash net amount
      balance: 100,//calcBill0.amntPaidBythePatient,
      hsplocationid: this.location, //Number(this.cookie.get("HSPLocationId"))
      refdoctorid: this.refDoctor.id,
      authorisedid: calcBill0.selectedAuthorise,
      serviceTax: this.txtServiceTaxAmt,
      creditLimit: this.miscServBillForm.value.credLimit,
      tpaId: 0,
      paidbyTPA: 0,
      interactionID: this.miscServBillForm.value.interactionDetails,
      corporateid: miscFormData.corporateId.value,
      corporateName: miscFormData.corporateId.title,
      channelId: 0,
      billToCompany: this.billToCompId,
      invoiceType: miscPatient.b2bInvoiceType,
      narration: miscPatient.narration
    };
    //Discount values
    this.postBillObj.dtMiscellaneous_list = [{
      quantity: this.miscServBillForm.value.qty,
      serviceid: this.miscServBillForm.value.serviceType.value,
      amount: 100,
      discountAmount: 0,
      serviceName: this.miscServBillForm.value.serviceType.title,
      itemModify: this.miscServBillForm.value.item.title,
      discounttype: 0,
      disReasonId: 0,
      docid: 20362,
      remarksId: 4,
      itemId: this.miscServBillForm.value.item.value,
      mPrice: 50,
      empowerApproverCode: '',
      couponCode: ""
    }];
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
    this.postBillObj.dtGST_Parameter_P = {
      gsT_value: this.gstDataResult.gst,
      gsT_percent: 0,
      cgsT_Value: this.gstDataResult.cgsT_Value,
      cgsT_Percent: this.gstDataResult.cgst,

      sgsT_value: this.gstDataResult.sgsT_Value,
      sgsT_percent: this.gstDataResult.sgst,

      utgsT_value: this.gstDataResult.utgsT_Value,
      utgsT_percent: this.gstDataResult.utgst,

      igsT_Value: this.gstDataResult.igst,
      igsT_percent: this.gstDataResult.igsT_Value,

      cesS_value: this.gstDataResult.cesS_Value,
      cesS_percent: this.gstDataResult.cess,

      taxratE1_Value: this.gstDataResult.taxratE1_Value,
      taxratE1_Percent: this.gstDataResult.taxratE1,

      taxratE2_Value: this.gstDataResult.taxratE2_Value,
      taxratE2_Percent: this.gstDataResult.taxratE2,

      taxratE3_Value: this.gstDataResult.taxratE3_Value,
      taxratE3_Percent: this.gstDataResult.taxratE3,

      taxratE4_Value: this.gstDataResult.taxratE4_Value,
      taxratE4_Percent: this.gstDataResult.taxratE4,

      taxratE5_Value: this.gstDataResult.taxratE5_Value,
      taxratE5_Percent: this.gstDataResult.taxratE5,
      totaltaX_RATE: this.gstDataResult.totaltaX_RATE,
      totaltaX_RATE_VALUE: this.gstDataResult.totaltaX_Value,
      saccode: this.gstDataResult.saccode,
      taxgrpid: this.gstDataResult.taxgrpid
    }
    this.postBillObj.dtDeposit_P = depositData;
    this.postBillObj.dtSaveDeposit_P = {};
    this.postBillObj.htParameter_P = {};
    this.postBillObj.operatorId = this.userID;
    this.postBillObj.locationId = this.location;


    this.http
      .post(ApiConstants.postMiscBill, this.postBillObj)
      .pipe(takeUntil(this._destroying$))
      .subscribe(
        (resultData) => {
          if (resultData[0].successFlag === true) {
            RefundDialog.afterClosed()
              .pipe(takeUntil(this._destroying$))
              .subscribe((result) => {
                if (result == "MakeBill") {
                  // this.openDepositdialog();
                  this.generatedBillNo = resultData[0].billId;
                  this.enablePrint = true;
                  const successInfo = this.messageDialogService.info(
                    `Bill saved with the Bill No ${resultData[0].billNo} and Amount ${this.billAmnt}`
                  );
                  successInfo
                    .afterClosed()
                    .pipe(takeUntil(this._destroying$))
                    .subscribe((result: any) => {
                      const printDialog = this.messageDialogService.confirm(
                        "",
                        `Do you want to print bill?`
                      );
                      printDialog
                        .afterClosed()
                        .pipe(takeUntil(this._destroying$))
                        .subscribe((result: any) => {
                          if ("type" in result) {
                            if (result.type == "yes") {

                              this.print();
                            } else {
                            }
                          }
                        });
                    });
                }
              });
            // this.snackbar.open(resultData[0].returnMessage + " " + resultData[0].billNo, "success")

          }
        },
        (error) => {
          this.snackbar.open(error, "error")
        }
      );
  }
  makeBill() {
    //Set Gst Values
    if (this.totaltaX_Value) {
      let TotalTaxGST = this.totaltaX_Value;
      let txtgsttaxamt = ((this.billAmnt * TotalTaxGST) / 100)
      let txttotalamount = this.billAmnt;
      let billamount = (txttotalamount + txtgsttaxamt);
      this.miscServBillForm.controls["gstTax"].setValue(txtgsttaxamt);
    }
    this.addNewItem();
  }
  //Print Report
  print() {
    this.openReportModal("billingreport");
  }
  openReportModal(btnname: string) {

    this.reportService.openWindow(btnname, btnname, {
      opbillid: this.generatedBillNo,
      locationID: this.location
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
    private Miscservice: MiscService,


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





