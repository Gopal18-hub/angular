import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { CookieService } from "@shared/services/cookie.service";
import { HttpService } from "@shared/services/http.service";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { Subject, takeUntil } from "rxjs";
import { GstComponent } from "../gst/gst.component";
import { ApiConstants } from "@core/constants/ApiConstants";
import { MiscMasterDataModel } from "@core/types/miscMasterDataModel.Interface";
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
import { CalculateBillService } from "@core/services/calculate-bill.service";
import { GstTaxComponent } from "@modules/billing/submodules/billing/prompts/gst-tax-popup/gst-tax.component";

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
  remarkList!: objMiscBillingRemarksList[];
  serviceItemsList!: ServiceTypeItemModel[];
  serviceList!: { title: string; value: number }[];
  miscCompanyId: number = 0;
  generatedBillNo = "";
  enableDiscount: boolean = false;
  makebillFlag: boolean = false;
  depositAvailFlag: boolean = false;
  isEnableBillBtn: boolean = false;
  calcBillData: any = [];
  noMap = [];
  gstDataResult: any = [];
  //Tax info
  taxid = 0;
  taxcode = "";
  taxtype = "";
  taxService = "";
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
  // stationId = 10475;
  // userID = 9923;

  marketPrice = 0;
  selfDoc = false;

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
  TotalAmount: any = 0;
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
    public miscPatient: MiscService,
    private reportService: ReportService,
    private snackbar: MaxHealthSnackBarService,
    private billingservice: BillingService,
    private calculateBillService: CalculateBillService
  ) {}

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
      },
      //6
      remark: {
        type: "autocomplete",
        title: "Remarks",
        required: true,
        options: this.remarkList,
        placeholder: "Select",
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
        title: "Interaction Details",
        placeholder: "Select",
      },
      //10
      billAmt: {
        type: "currency",
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
        type: "currency",
        required: false,
        defaultValue: "0.00",
        readonly: true,
      },
      //13
      discAmtCheck: {
        type: "checkbox",
        required: false,
        disabled: true,
        options: [{ title: " Discount  Amount  (  -  ) " }],
      },
      //14
      discAmt: {
        type: "currency",
        required: false,
        defaultValue: "0.00",
        readonly: true,
      },
      //15
      dipositAmtcheck: {
        type: "checkbox",
        required: false,
        disabled: true,
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
        type: "currency",
        required: false,
        defaultValue: "0.00",
        readonly: true,
      },
      //18
      compDisc: {
        type: "currency",
        required: false,
        defaultValue: "0.00",
        readonly: true,
      },
      //19
      planAmt: {
        type: "currency",
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
        type: "currency",
        required: false,
        defaultValue: "0.00",
        readonly: true,
      },
      //22
      credLimit: {
        type: "currency",
        required: false,
        defaultValue: "0.00",
        readonly: true,
      },
      //23
      gstTax: {
        type: "currency",
        required: false,
        defaultValue: "0.00",
        readonly: true,
      },
      //24
      amtPayByPatient: {
        type: "currency",
        required: false,
        defaultValue: "0.00",
        readonly: true,
      },
      //25
      amtPayByComp: {
        type: "currency",
        required: false,
        defaultValue: "0.00",
        readonly: true,
      },
      //26
      paymentMode: {
        type: "radio",
        options: [
          { title: "Cash", value: "1" },
          { title: "Credit", value: "3" },
          { title: "Gen. OPD", value: "Gen OPD" },
        ],
        defaultValue: "1",
      },
      //27
      dipositAmtEdit: {
        type: "currency",
        required: false,
        defaultValue: "0.00",
        readonly: true,
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
      "TariffPriceNo",
      "Qty",
      "PriceNo",
      "DoctorName",
      "Disc",
      "DiscAmount",
      "TotalAmount",
      "GSTNo",
    ],
    columnsInfo: {
      Sno: {
        title: "S.No.",
        type: "number",
        style: {
          width: "64px",
        },
      },
      ServiceType: {
        title: "Service Type",
        type: "string",
        tooltipColumn: "ServiceType",
        style: {
          width: "170px",
        },
      },
      ItemDescription: {
        title: "Item Description",
        type: "string",
        tooltipColumn: "ItemDescription",
        style: {
          width: "180px",
        },
      },
      ItemforModify: {
        title: "Item For Modify",
        type: "textarea",
        tooltipColumn: "ItemforModify",
        style: {
          width: "180px",
        },
      },
      TariffPriceNo: {
        title: "Tariff Price",
        type: "currency",
        style: {
          width: "160px",
        },
      },
      Qty: {
        title: "Qty",
        type: "string",
        style: {
          width: "30px",
        },
      },
      PriceNo: {
        title: "Price",
        type: "currency",
        style: {
          width: "160px",
        },
      },
      DoctorName: {
        title: "Doctor Name",
        type: "string",
        tooltipColumn: "DoctorName",
        style: {
          width: "160px",
        },
      },
      Disc: {
        title: "Disc%",
        type: "string",
        style: {
          width: "60px",
        },
      },
      DiscAmount: {
        title: "Disc. Amount",
        type: "currency",
        style: {
          width: "160px",
        },
      },
      TotalAmount: {
        title: "Total Amount",
        type: "currency",
        style: {
          width: "160px",
        },
      },
      GSTNo: {
        title: "GST%",
        type: "currency",
        style: {
          width: "70px",
        },
      },
    },
  };
  clearItem = false;

  async ngOnInit(): Promise<void> {
    let serviceFormResult = this.formService.createForm(
      this.miscBillData.properties,
      {}
    );
    this.miscServBillForm = serviceFormResult.form;
    this.question = serviceFormResult.questions;

    // this.miscServBillForm.controls["dipositAmt"].setValue(
    //   this.miscPatient.cacheBillTabdata.cacheDeposit || "0.00"
    // );
    // this.miscServBillForm.controls["dipositAmtEdit"].setValue(
    //   this.miscPatient.cacheBillTabdata.cacheDepositInput || "0.00"
    // );
    // this.miscServBillForm.controls["discAmt"].setValue(
    //   this.miscPatient.cacheBillTabdata.cacheDiscount || "0.00"
    // );

    // if (this.miscPatient.cacheBillTabdata.cacheDeposit > 0) {
    //   this.miscServBillForm.controls["discAmtCheck"].setValue(true);
    // }
    // if (this.miscPatient.cacheBillTabdata.cacheDiscount > 0) {
    //   this.miscServBillForm.controls["dipositAmtCheck"].setValue(true);
    // }

    this.miscPatient.clearAllItems.subscribe((clearItems) => {
      if (clearItems) {
        this.clearItem = true;
        this.miscServBillForm.reset();
        this.resetAmt();
        this.miscServBillForm.controls["paymentMode"].setValue("1");
        this.miscServBillForm.controls["self"].setValue(false);
        this.miscServBillForm.controls["self"].enable();
        this.serviceselectedList = [];
        this.clearSelectedService();
      }
    });
    if (this.miscPatient.cacheServitem) {
      this.serviceselectedList = this.miscPatient.cacheServitem;
      if (this.miscPatient.cacheServitem.length > 0) {
        this.calculateTotalAmount();
        if (this.miscPatient.cacheBillTabdata.self == true) {
          this.miscServBillForm.controls["self"].setValue(true);
          this.selfDoc = true;
        } else {
          this.miscServBillForm.controls["self"].setValue(false);
          this.miscServBillForm.controls["self"].disable();
          this.selfDoc = false;
        }
        this.isEnableBillBtn = true;
      } else {
        this.isEnableBillBtn = false;
      }
    }

    if (this.billingservice.makeBillPayload.cmbInteraction) {
      this.miscServBillForm.controls["interactionDetails"].setValue(
        this.billingservice.makeBillPayload.cmbInteraction
      );
    }

    //Referral Doctor
    this.http
      .get(ApiConstants.getreferraldoctor(2, ""))
      .pipe(takeUntil(this._destroying$))
      .subscribe((res: any) => {
        this.referralDoctor = res;
        this.question[8].options = this.referralDoctor.map((a) => {
          return { title: a.name, value: a.id };
        });
      });
    //interaction master
    this.question[9].options = await this.miscPatient.getinteraction();

    //Set Payment mode
    if (Number(this.miscPatient.cacheBillTabdata.billType) === 3) {
      this.miscServBillForm.controls["paymentMode"].setValue("3");
    } else {
      this.miscServBillForm.controls["paymentMode"].setValue("1");

      this.miscServBillForm.controls["amtPayByComp"].setValue("0.00");
    }

    this.miscPatient.miscdepositdetailsEvent.subscribe((res: any) => {
      if (res.deposit) {
        res.deposit.forEach((element: any) => {
          this.totalDeposit += element.balanceamount;
        });
        if (this.totalDeposit > 0) {
          this.miscServBillForm.controls["dipositAmt"].setValue(
            this.totalDeposit.toFixed(2)
          );
          this.miscServBillForm.controls["dipositAmtEdit"].setValue("0.00");
        }
      }
    });
  }
  ngAfterViewInit() {
    this.formEvents();
  }
  formEvents() {
    this.getMasterMiscDetail();
    this.refreshForm();
    this.miscServBillForm.controls["paymentMode"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value: any) => {
        if (Number(value) === 3) {
          this.question[21].readonly = false;
          this.question[22].readonly = false;
          if (this.serviceselectedList.length > 0) {
            this.isEnableBillBtn = true;
            this.enablePrint = false;
            this.amtByComp();
          } else {
            this.isEnableBillBtn = false;
            this.enablePrint = false;
          }
        } else {
          this.question[21].readonly = true;
          this.question[22].readonly = true;
          let balance =
            this.billAmnt -
            (this.miscServBillForm.value.discAmt || 0) -
            (this.miscServBillForm.value.dipositAmtEdit || 0);

          this.miscServBillForm.controls["amtPayByPatient"].setValue(
            balance.toFixed(2)
          );
          this.miscServBillForm.controls["amtPayByComp"].setValue("0.00");
        }
        this.miscPatient.setBillType(value);
        this.miscPatient.cacheBillTabdata.billType = value;
      });

    this.miscServBillForm.controls["serviceType"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value: any) => {
        this.miscServBillForm.controls["item"].setValue("");
        this.setServiceItemList();
        if (value) {
          if (value.value) {
            this.serviceID = value.value;
            this.serviceName = value.title;
            this.checkService();
          }
        } else if (
          !this.miscServBillForm.value.serviceType &&
          this.clearItem == false
        ) {
          this.miscServBillForm.controls["item"].setValue("");
        }
      });

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
      });
    this.miscServBillForm.controls["qty"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value: any) => {
        if (value) {
          if (value < 10 && value > 0) {
            this.miscServBillForm.controls["qty"].setValue(value);
            this.checkService();
          }
          if (value > 9) {
            this.snackbar.open("Qty can't exceed 9 ", "error");
            this.miscServBillForm.controls["qty"].setValue(0);
          }
          if (value <= 0) {
            this.snackbar.open("Quantity Can Not be Zero", "error");
            this.miscServBillForm.controls["qty"].setValue(0);
          }
        }
      });
    this.miscServBillForm.controls["reqAmt"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value: any) => {
        if (value) {
          this.checkService();
        } else if (
          this.miscServBillForm.value.reqAmt <= 0 &&
          this.clearItem == false
        ) {
          this.snackbar.open("Item Price Can Not be Zero", "error");
        }
      });
    this.miscServBillForm.controls["remark"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value: any) => {
        if (value) {
          this.checkService();
        } else if (
          !this.miscServBillForm.value.remark &&
          this.clearItem == false
        ) {
          this.snackbar.open("Please select remarks!", "error");
        }
      });
    this.miscServBillForm.controls["self"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value: any) => {
        this.enableDiscount = false;
        if (value === true) {
          this.selfDoc = true;
        } else {
          this.selfDoc = false;
        }
        this.miscPatient.cacheBillTabdata.self = this.selfDoc;
      });
    this.miscServBillForm.controls["discAmtCheck"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value: any) => {
        this.enableDiscount = false;
        if (value === true) {
          this.enableDiscount = true;
          this.openDiscountdialog();
        } else {
          this.calcBillData.totalDiscount = 0;
          this.miscPatient.setCalculateBillItems(this.calcBillData);
          this.miscPatient.cacheBillTabdata.cacheDiscount = 0;
          let calcBill0 = this.miscPatient.calculateBill();
          this.miscServBillForm.controls["discAmtCheck"].setValue(false);
          this.miscServBillForm.controls["discAmt"].setValue(0 + ".00");
          this.miscServBillForm.controls["billAmt"].setValue(
            //  calcBill0.totalBillAmount.toFixed(2)
            this.TotalAmount.toFixed(2)
          );
          this.miscServBillForm.controls["amtPayByPatient"].setValue(
            calcBill0.amntPaidBythePatient.toFixed(2)
          );
        }
      });

    this.miscServBillForm.controls["dipositAmtcheck"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value: any) => {
        this.enableDiscount = false;
        if (value === true && this.makebillFlag == false) {
          this.openDepositdialog();
        } else {
          this.calcBillData.totalDeposit = 0;
          this.miscPatient.setCalculateBillItems(this.calcBillData);
          this.miscPatient.cacheBillTabdata.cacheDeposit = 0;
          this.miscPatient.cacheBillTabdata.cacheDepositInput = 0;
          this.miscServBillForm.controls["dipositAmtcheck"].setValue(false, {
            emitEvent: false,
          });
          let calcBill0 = this.miscPatient.calculateBill();
          this.miscServBillForm.controls["dipositAmt"].setValue(0 + ".00");
          this.miscServBillForm.controls["dipositAmtEdit"].setValue(0 + ".00");
          this.miscServBillForm.controls["billAmt"].setValue(
            //calcBill0.totalBillAmount.toFixed(2)
            this.TotalAmount.toFixed(2)
          );
          this.miscServBillForm.controls["amtPayByPatient"].setValue(
            calcBill0.amntPaidBythePatient.toFixed(2)
          );
        }
      });

    this.question[22].elementRef.addEventListener("keypress", (event: any) => {
      if (event.key === "Enter") {
        event.preventDefault();
        if (
          Number(this.miscServBillForm.value.paymentMode) === 3 &&
          this.miscServBillForm.value.credLimit &&
          this.miscServBillForm.value.credLimit > 0
        ) {
          this.amtByComp();
        }
      }
    });
    this.question[27].elementRef.addEventListener(
      "change",
      this.onModifyMiscDepositAmt.bind(this)
    );
    this.question[21].elementRef.addEventListener(
      "change",
      this.copayClick.bind(this)
    );
    this.question[22].elementRef.addEventListener(
      "change",
      this.creditClick.bind(this)
    );
    // this.question[27].elementRef.addEventListener("keypress", (event: any) => {
    //   if (event.key === "Enter") {
    //     event.preventDefault();

    //   }
    // });
    if (this.miscServBillForm.value.paymentMode == 3) {
      if (this.miscPatient.selectedcompanydetails) {
        this.getbilltocompany(this.miscPatient.selectedcompanydetails.value);
      }
    }
  }
  creditClick() {
    if (
      Number(this.miscServBillForm.value.paymentMode) === 3 &&
      this.miscServBillForm.value.credLimit &&
      this.miscServBillForm.value.credLimit > 0
    ) {
      this.amtByComp();
    }
  }
  copayClick() {
    if (Number(this.miscServBillForm.value.paymentMode) === 3) {
      this.amtByComp();
    }
  }
  refreshForm() {
    this.miscServBillForm.controls["credLimit"].setValue(
      this.miscPatient.creditLimit
    );
    this.miscServBillForm.controls["coPay"].setValue(this.miscPatient.copay);

    if (this.serviceselectedList.length > 0) {
      this.miscServBillForm.controls["discAmtCheck"].enable();
      this.miscServBillForm.controls["dipositAmtcheck"].enable();
    }
  }
  onModifyMiscDepositAmt() {
    this.calcBillData.depositInput = Number(
      this.miscServBillForm.value.dipositAmtEdit
    );
    this.miscPatient.setCalculateBillItems(this.calcBillData);
    let calcBill0 = this.miscPatient.calculateBill();
    // this.miscServBillForm.controls["billAmt"].setValue(
    //   calcBill0.totalBillAmount.toFixed(2)
    // );
    this.miscServBillForm.controls["dipositAmtEdit"].setValue(
      calcBill0.depositInput.toFixed(2)
    );
    this.miscPatient.cacheBillTabdata.cacheDepositInput =
      calcBill0.depositInput.toFixed(2);
    if (Number(this.miscServBillForm.value.paymentMode) === 3) {
      this.amtByComp();
    } else {
      this.miscServBillForm.controls["amtPayByPatient"].setValue(
        calcBill0.amntPaidBythePatient.toFixed(2)
      );
      this.miscServBillForm.controls["amtPayByComp"].setValue("0.00");
    }
  }
  checkService() {
    if (
      this.miscServBillForm.value.serviceType &&
      this.miscServBillForm.value.item &&
      this.miscServBillForm.value.qty > 0 &&
      this.miscServBillForm.value.qty !== "" &&
      this.miscServBillForm.value.remark
    ) {
      this.enableItemsService = true;
    } else {
      this.enableItemsService = false;
    }
  }

  selectedReferralDoctor(data: any) {
    if (data.docotr) {
      console.log(data.docotr);
      this.miscServBillForm.controls["self"].setValue(false);
      this.miscServBillForm.controls["self"].disable();
      this.miscPatient.setReferralDoctor(data.docotr);
    }
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
        this.question[0] = { ...this.question[0] };
        this.question[5].options =
          this.miscMasterDataList.objMiscDoctorsList.map((a) => {
            return { title: a.name, value: a.id };
          });
        this.question[5] = { ...this.question[5] };
        this.question[6].options =
          this.miscMasterDataList.objMiscBillingRemarksList.map((a) => {
            return { title: a.name, value: a.id };
          });
        this.question[6] = { ...this.question[6] };
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

        this.question[1].options = this.serviceItemsList.map((a) => {
          return { title: a.itemname, value: a.itemId };
        });
        this.question[1] = { ...this.question[1] };
      });
  }
  tablerow(event: any) {
    if (event.column === "ItemforModify") {
      this.serviceselectedList.forEach((e: any) => {
        if (e.ItemDescription == event.row.ItemDescription) {
          e.ItemforModify = event.row.ItemforModify;
        }
      });
      this.serviceselectedList = [...this.serviceselectedList];
    }
  }
  setServiceItemList() {
    if (this.miscServBillForm.value.serviceType) {
      this.serviceID = this.miscServBillForm.value.serviceType.value;
      this.serviceName = this.miscServBillForm.value.serviceType.title;
      if (this.serviceID) {
        this.getServiceItemBySerivceID();
      }
    }
  }
  //Filter items based on Service
  getallserviceitems() {
    this.serviceItemsList = [];
    this.http
      .get(
        ApiConstants.getServiceitemsByServiceID(this.serviceID, this.location)
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
      });
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
            this.marketPrice = this.terrifDetail.amount;
            this.miscServBillForm.controls["tffPrice"].setValue(
              this.terrifDetail.amount.toFixed(2)
            );
          }
        });
    }
  }
  //check Bill Preparation
  getbilltocompany(data: any) {
    this.http
      .get(ApiConstants.getbilltocompany(data))
      .pipe(takeUntil(this._destroying$))
      .subscribe((data) => {
        this.billToCompId = data.dtBilltocompany[0].id;
        this.b2bflag = data.dtBilltocompany[0].checkGSTN_ForB2B;

        if (String(this.b2bflag.trim()).toUpperCase() === "Y") {
          if (
            this.totaltaX_Value > 0 &&
            this.miscServBillForm.value.credLimit > 0
          ) {
            if (
              data.dtBilltocompany[0].gstNumber === null ||
              data.dtBilltocompany[0].gstNumber === 0
            ) {
              this.snackbar.open(
                "Bill To Company GSTN and Address Details are Mandatory for Bill Preparation",
                "error"
              );
              return;
            } else if (
              this.miscCompanyId === 0 ||
              this.miscCompanyId === null
            ) {
              this.snackbar.open("Please Select Company GSTN!", "error");
            }
          }
        }
      });
  }
  //Patient Deposit Details
  getDipositedAmountByMaxID() {
    let miscPatient = this.miscPatient.getFormLsit();
    let regNumber = miscPatient.registrationno;
    let iacode = miscPatient.iacode;
    this.disabledipositAmtEdit = false;
    this.totalDeposit = 0;

    this.http
      .get(
        // (
        //   ApiConstants.getDipositedAmountByMaxID(
        //     "BLKH", 1020369,
        //     67)
        // )
        ApiConstants.getDipositedAmountByMaxID(iacode, regNumber, this.location)
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe(
        (resultData: any) => {
          this.depositDetails = resultData;
          resultData.forEach((element: any) => {
            this.totalDeposit += element.balanceamount;
          });
        },
        (error) => {}
      );
  }
  // Bill amt based on service
  getPriceforitemwithTariffId() {
    let miscFormData = this.miscPatient.getCalculateBillItems();
    if (this.miscPatient.selectedcompanydetails) {
      this.miscCompanyId = this.miscPatient.selectedcompanydetails.value;
    } else {
      this.miscCompanyId = 0;
    }

    let PriorityId = 1;
    let Hsplocationid = this.location;
    let CompanyId = this.miscCompanyId;

    let CompanyFlag = 0;
    let intBundleId = 0;
    if (this.miscServBillForm.value.item.value) {
      this.http
        .get(
          ApiConstants.getPriceforitemwithTariffId(
            PriorityId,
            this.itemID,
            this.serviceID,
            Hsplocationid,
            CompanyId,
            CompanyFlag,
            intBundleId
          )
        )
        .pipe(takeUntil(this._destroying$))
        .subscribe((data) => {
          this.miscServBillForm.controls["tffPrice"].setValue(
            data.amount.toFixed(2)
          );
          this.miscServBillForm.controls["reqAmt"].setValue(
            data.amount.toFixed(2)
          );
        });
    }
  }
  //Get Tax id & type
  getservices_byprocedureidnew() {
    this.http
      .get(
        ApiConstants.getservices_byprocedureidnew(this.itemID, this.serviceID)
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe((data) => {
        this.noMap = data;
        this.taxid = data[0].id;
        this.taxcode = data[0].code;
        this.taxtype = data[0].taxType;
        this.taxService = data[0].serviceId;
      });
  }
  ////Service Tax map check
  getservices_byprocedureid() {
    this.http
      .get(ApiConstants.getservices_byprocedureid(this.itemID, this.serviceID))
      .pipe(takeUntil(this._destroying$))
      .subscribe((data) => {
        this.noMap = data;
      });
  }
  //Fetch GST Data
  getgstdata() {
    let location = this.location;
    if (this.miscPatient.selectedcompanydetails) {
      this.miscCompanyId = this.miscPatient.selectedcompanydetails.value;
    } else {
      this.miscCompanyId = 0;
    }
    let company = this.miscCompanyId;
    if (company >= 0) {
      this.http
        .get(
          ApiConstants.getgstdata(
            this.taxid,
            company,
            location,
            this.TotalAmount
          )
          //  ApiConstants.getgstdata(229, 19535, 7, 1000)
        )
        .pipe(takeUntil(this._destroying$))
        .subscribe((data) => {
          if (data) {
            this.gstData = data;
            this.totaltaX_Value = data[0].totaltaX_Value;
            this.miscServBillForm.controls["gstTax"].setValue(
              this.totaltaX_Value.toFixed(2) || "0.00"
            );
            this.calcBillData.totalGst = this.totaltaX_Value;
            this.miscPatient.setCalculateBillItems(this.calcBillData);
            let calcBill0 = this.miscPatient.calculateBill();
            this.miscServBillForm.controls["amtPayByPatient"].setValue(
              calcBill0.amntPaidBythePatient.toFixed(2)
            );
          }
        });
    }
  }

  ///PAN
  setpanno() {
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
    } else if (!this.miscServBillForm.value.item) {
      this.snackbar.open("Enter the Item Description First", "error");
    } else if (!this.miscServBillForm.value.qty) {
      this.snackbar.open("Enter the Item Quantity", "error");
    } else if (this.miscServBillForm.value.qty <= 0) {
      this.snackbar.open("Quantity Can Not be Zero", "error");
    } else if (!this.miscServBillForm.value.reqAmt) {
      this.snackbar.open("Enter the Item Price", "error");
    } else if (this.miscServBillForm.value.reqAmt <= 0) {
      this.snackbar.open("Item Price Can Not be Zero", "error");
    } else if (!this.miscServBillForm.value.remark) {
      this.snackbar.open("Please select remarks!", "error");
    } else if (this.noMap.length === 0) {
      this.snackbar.open("Selected Service not Mapped with Tax.", "error");
      this.clearSelectedService();
      return;
    } else {
      this.count = this.serviceselectedList.length + 1;
      let ServiceType = this.serviceName;
      let itemName = this.itemName;
      let present = false;
      this.serviceselectedList.forEach((element) => {
        if (
          ServiceType == element.ServiceType &&
          itemName == element.ItemDescription
        ) {
          this.snackbar.open("Item Already Exits", "error");
          present = true;
          return;
        }
      });
      if (!present) {
        this.pushDataToServiceTable();
        this.serviceselectedList.forEach((e: any) => {
          e.TariffPriceNo = Number(e.TariffPrice).toFixed(2);
          e.PriceNo = Number(e.Price).toFixed(2);
          // e.DiscNo = Number(e.Disc).toFixed(2);
          // e.DiscAmountNo = Number(e.DiscAmount).toFixed(2);
          e.TotalAmntNo = Number(e.TotalAmount).toFixed(2);
          e.GSTNo = Number(e.GST).toFixed(2);
          e.amountNo = Number(e.amount).toFixed(2);
          e.discountAmountNo = Number(e.discount).toFixed(2);
          e.mPriceNo = Number(e.TariffPrice).toFixed(2);
          e.qty = e.Qty;
          //For Discount Reason
          e.serviceId = e.serviceid;
          e.itemId = e.itemId;
          e.amount = e.TotalAmount;
          e.discountamount = e.discount;
          e.serviceName = e.ServiceType;
          e.itemName = e.ItemDescription;
          //Original
          e.TotalAmount = e.TotalAmount;
          e.Price = e.Price;
          e.Disc = e.Disc;
          e.DiscAmount = e.DiscAmount;
          e.TotalAmnt = e.TotalAmount;
          e.GST = e.GST;
          e.amount = e.amount;
          e.discountAmount = e.discount;
          e.mPrice = e.TariffPrice;
          e.Qty = e.Qty;
        });
        this.serviceselectedList = [...this.serviceselectedList];
        this.miscPatient.cacheService(this.serviceselectedList);
        if (this.serviceselectedList.length > 0) {
          this.isEnableBillBtn = true;
          this.miscServBillForm.controls["discAmtCheck"].enable();
          this.miscServBillForm.controls["dipositAmtcheck"].enable();
        }
      }

      this.calculateTotalAmount();
      this.clearSelectedService();
    }
  }
  pushDataToServiceTable() {
    let pDoc = "";
    let pDocValue = 0;
    if (this.miscServBillForm.value.pDoc === null) {
      pDoc = "";
      pDocValue = 0;
    } else {
      pDoc = this.miscServBillForm.value.pDoc.title;
      pDocValue = this.miscServBillForm.value.pDoc.value;
    }
    let billItem = {
      itemId: this.miscServBillForm.value.item.value,
      priority: 1,
      serviceId: this.serviceID,
      price: this.miscServBillForm.value.reqAmt,
      serviceName: this.serviceName,
      itemName: this.miscServBillForm.value.item.title,
      qty: this.miscServBillForm.value.qty,
      precaution: "",
      procedureDoctor: pDoc,
      credit: 0,
      cash: 0,
      disc: 0,
      discAmount: 0,
      totalAmount:
        Number(this.miscServBillForm.value.reqAmt) *
        Number(this.miscServBillForm.value.qty),
      gst: 0,
      gstValue: 0,
      specialisationID: 0,
      doctorID: pDocValue,
    };
    this.billingservice.addToBill(billItem);
    this.serviceselectedList.push({
      Sno: this.count,
      ServiceType: this.serviceName,
      ItemDescription: this.miscServBillForm.value.item.title,
      ItemforModify: this.miscServBillForm.value.item.title,
      TariffPrice: this.miscServBillForm.value.tffPrice,
      Qty: this.miscServBillForm.value.qty,
      Price: this.miscServBillForm.value.reqAmt,
      DoctorName: pDoc,
      Disc: "0.00",
      DiscAmount: "0.00",
      TotalAmount:
        Number(this.miscServBillForm.value.reqAmt) *
        Number(this.miscServBillForm.value.qty),
      GST: 0,
      serviceid: this.serviceID,
      amount:
        Number(this.miscServBillForm.value.reqAmt) *
        Number(this.miscServBillForm.value.qty),
      discountAmount: 0,
      serviceName: this.serviceName,
      itemModify: this.miscServBillForm.value.item.title,
      discounttype: "",
      disReasonId: 0,
      docid: pDocValue,
      remarksId: this.miscServBillForm.value.remark.value,
      itemId: this.miscServBillForm.value.item.value,
      mPrice: this.miscServBillForm.value.tffPrice,
      empowerApproverCode: 0,
      couponCode: "",
    });
  }
  //Filter
  filterList(list: any[], control: any): any {
    list.filter(function (item) {
      return item.name === control.value;
    });
  }
  //Clear
  clearDraftedService() {
    this.miscServBillForm.controls["item"].reset();
    this.miscServBillForm.controls["qty"].reset();
    this.miscServBillForm.controls["tffPrice"].reset();
    this.miscServBillForm.controls["pDoc"].reset();
    this.miscServBillForm.controls["remark"].reset();
    this.miscServBillForm.controls["reqAmt"].reset();
    this.miscServBillForm.controls["serviceType"].reset();
    this.checkService();
  }
  clearSelectedService() {
    this.miscServBillForm.controls["serviceType"].setValue({
      title: "",
      value: 0,
    });
    this.clearDraftedService();
  }

  resetAmt() {
    this.miscServBillForm.controls["billAmt"].setValue("0.00");
    this.miscServBillForm.controls["availDisc"].setValue("0.00");
    this.miscServBillForm.controls["discAmt"].setValue("0.00");
    this.miscServBillForm.controls["dipositAmt"].setValue("0.00");
    this.miscServBillForm.controls["patientDisc"].setValue("0.00");
    this.miscServBillForm.controls["compDisc"].setValue("0.00");
    this.miscServBillForm.controls["planAmt"].setValue("0.00");
    this.miscServBillForm.controls["coPay"].setValue("0.00");
    this.miscServBillForm.controls["credLimit"].setValue("0.00");
    this.miscServBillForm.controls["gstTax"].setValue("0.00");
    this.miscServBillForm.controls["amtPayByPatient"].setValue("0.00");
    this.miscServBillForm.controls["amtPayByComp"].setValue("0.00");
    this.miscServBillForm.controls["dipositAmtEdit"].setValue("0.00");

    this.miscServBillForm.controls["discAmtCheck"].disable();
    this.miscServBillForm.controls["discAmtCheck"].setValue(false);
    this.miscServBillForm.controls["dipositAmtcheck"].disable();
    this.miscServBillForm.controls["dipositAmtcheck"].setValue(false);
    this.isEnableBillBtn = false;
    this.enablePrint = false;
  }
  //  FOR SETTING PRIORITY
  getPriority() {}
  rowRwmove($event: any) {
    this.enablePrint = false;
    this.serviceselectedList.splice($event.index, 1);
    this.serviceselectedList = this.serviceselectedList.map(
      (item: any, index: number) => {
        item["Sno"] = index + 1;
        return item;
      }
    );

    this.serviceselectedList = [...this.serviceselectedList];
    this.miscPatient.cacheService(this.serviceselectedList);
    this.calculateTotalAmount();
    if (this.serviceselectedList.length <= 0) {
      this.isEnableBillBtn = false;
      this.enablePrint = false;
      this.resetAmt();
    }
  } //Dialog
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
        } else {
          this.calculateBillService.discountSelectedItems = [];
          this.miscServBillForm.controls["discAmtCheck"].setValue(false, {
            emitEvent: false,
          });
        }
      });
  }
  opendiscAmtDialog() {
    let data = {
      discounttypes: [
        { title: "On Bill", value: "On-Bill" },
        { title: "On Service", value: "On-Service" },
        { title: "On Item", value: "On-Item" },
      ],
    };
    this.billingservice.totalCost = this.TotalAmount;
    const discountReasonPopup = this.matDialog.open(DisountReasonComponent, {
      width: "80vw",
      minWidth: "90vw",
      height: "67vh",
      data: data,
    });

    discountReasonPopup.afterClosed().subscribe((res) => {
      if ("applyDiscount" in res && res.applyDiscount) {
        let discountedAmount = 0;
        let discountRow = this.calculateBillService.discountSelectedItems;
        this.serviceselectedList.forEach((e: any) => {
          discountRow.forEach((d: any) => {
            if (e.ItemDescription == d.doctor) {
              e.Disc = Number(d.disc);
              e.DiscAmount = Number(d.discAmt).toFixed(2);
              e.TotalAmount = Number(d.totalAmt).toFixed(2);
            }
          });
        });
        this.serviceselectedList = [...this.serviceselectedList];
        this.calculateBillService.discountSelectedItems.forEach((e: any) => {
          discountedAmount += Number(e.discAmt);
        });
        this.miscServBillForm.controls["discAmt"].setValue(
          discountedAmount.toFixed(2)
        );
        this.calcBillData.totalDiscount = discountedAmount;
        this.miscPatient.setCalculateBillItems(this.calcBillData);
        this.miscPatient.cacheBillTabdata.cacheDiscount =
          discountedAmount.toFixed(2);
        let calcBill0 = this.miscPatient.calculateBill();
        // this.miscServBillForm.controls["billAmt"].setValue(
        //   calcBill0.totalBillAmount.toFixed(2)
        // );
        this.miscServBillForm.controls["amtPayByPatient"].setValue(
          calcBill0.amntPaidBythePatient.toFixed(2)
        );
        if (
          Number(this.miscServBillForm.value.paymentMode) === 3 &&
          this.miscServBillForm.value.coPay >= 0
        ) {
          this.amtByComp();
        }
      }
    });
  }
  openDepositdialog() {
    this.getDipositedAmountByMaxID();
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
            width: "70vw",
            height: "60vh",
            data: {
              data: this.depositDetails,
            },
          });

          dialogref.afterClosed().subscribe((res) => {
            this.depodialogTotal = 0;
            this.depositAvailFlag = true;
            this.depodialogRows = res.data;
            if (res.data) {
              res.data.forEach((element: any) => {
                this.depodialogTotal += element.balanceamount;
              });
              this.calcBillData.totalDeposit = this.depodialogTotal;
              this.miscPatient.setCalculateBillItems(this.calcBillData);
              this.miscPatient.cacheBillTabdata.cacheDeposit =
                this.depodialogTotal.toFixed(2);
              //   this.miscServBillForm.controls["dipositAmtcheck"].setValue(true);
              this.miscServBillForm.controls["dipositAmt"].setValue(
                this.depodialogTotal.toFixed(2)
              );
              this.miscServBillForm.controls["dipositAmtEdit"].setValue(
                0 + ".00"
              );
              this.miscServBillForm.controls["dipositAmtEdit"].enable();
              this.question[27].readonly = false;
              this.question[27].disable = false;
              this.question[27] = { ...this.question[27] };
              this.question[27].elementRef.focus();
              this.miscServBillForm.controls["dipositAmtcheck"].setValue(true, {
                emitEvent: false,
              });
              this.snackbar.open("Deposit Amount availed successfully!");
              // if (this.makebillFlag == true && this.depositAvailFlag == true) {
              //   this.openPaymentModeDialog();
              // }
            } else {
              this.miscServBillForm.controls["dipositAmtcheck"].setValue(
                false,
                {
                  emitEvent: false,
                }
              );
              if (this.makebillFlag == true && this.depositAvailFlag == true) {
                this.openPaymentModeDialog();
              }
            }
          });
        } else if (
          this.makebillFlag == true &&
          this.depodialogRows.length <= 0
        ) {
          this.miscServBillForm.controls["dipositAmtcheck"].setValue(false, {
            emitEvent: false,
          });
          this.openPaymentModeDialog();
          this.makebillFlag = false;
        } else if (this.makebillFlag == false) {
          this.miscServBillForm.controls["dipositAmtcheck"].setValue(false, {
            emitEvent: false,
          });
          //this.openPaymentModeDialog();
        } else {
          this.miscServBillForm.controls["dipositAmtcheck"].setValue(false, {
            emitEvent: false,
          });
          this.openPaymentModeDialog();
          this.makebillFlag = false;
        }
      });
  }
  openGstTaxDialog() {
    if (this.serviceselectedList.length <= 0) {
      this.matDialog.open(GstTaxComponent, {
        width: "30vw",
        height: "51vh",
      });
    } else {
      const gstDialogref = this.matDialog.open(GstTaxDialogComponent, {
        width: "30vw",
        height: "51vh",
        data: {
          gstdata: this.gstData,
        },
      });

      gstDialogref
        .afterClosed()
        .pipe(takeUntil(this._destroying$))
        .subscribe((result) => {
          if (result.data) {
            this.gstDataResult = result.data;
          }
        });
    }
  }
  openMakeBilldialog() {
    this.makebillFlag = true;
    console.log(this.miscPatient.selectedcompanydetails, "checkc");
    if (Number(this.miscServBillForm.value.paymentMode) === 3) {
      if (this.miscPatient.selectedcompanydetails) {
        this.miscCompanyId = this.miscPatient.selectedcompanydetails.value;
      } else {
        this.miscCompanyId = 0;
      }
      if (
        this.miscCompanyId &&
        Number(this.miscServBillForm.value.paymentMode) === 3
      ) {
        this.getbilltocompany(this.miscCompanyId);
      }
      if (this.miscServBillForm.value.credLimit <= 0) {
        this.snackbar.open(" Enter Credit limit", "error");
      }
      // else if (
      //   Number(this.miscServBillForm.value.credLimit) <
      //   this.miscServBillForm.value.amtPayByPatient
      // ) {
      //   this.snackbar.open(
      //     "Credit limit should not be less than bill amount",
      //     "error"
      //   );
      // }
      else if (!this.miscPatient.selectedcompanydetails.value) {
        this.snackbar.open("Select the Company", "error");
      } else if (
        Number(this.miscPatient.cacheCreditTabdata.isCorporateChannel) === 1 &&
        !this.miscPatient.selectedcorporatedetails.value
      ) {
        this.snackbar.open(" Please select corporate!", "error");
      } else if (!this.miscPatient.referralDoctor && this.selfDoc === false) {
        this.snackbar.open("Please select Referral Doctor", "error");
      } else {
        const MakeDepositDialogref = this.matDialog.open(
          MakeBillDialogComponent,
          {
            width: "33vw",
            height: "40vh",
            data: {
              message: "Do you want to make Bill?",
            },
          }
        );

        MakeDepositDialogref.afterClosed()
          .pipe(takeUntil(this._destroying$))
          .subscribe((result) => {
            if (result == "Success") {
              this.makeBill();
            }
          });
      }
    } else if (Number(this.miscServBillForm.value.paymentMode) === 1) {
      if (!this.miscPatient.referralDoctor && this.selfDoc === false) {
        this.snackbar.open("Please select Referral Doctor", "error");
      } else {
        const MakeDepositDialogref = this.matDialog.open(
          MakeBillDialogComponent,
          {
            width: "33vw",
            height: "40vh",
            data: {
              message: "Do you want to make Bill?",
            },
          }
        );

        MakeDepositDialogref.afterClosed()
          .pipe(takeUntil(this._destroying$))
          .subscribe((result) => {
            if (result == "Success") {
              this.makeBill();
            }
          });
      }
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

  openPaymentModeDialog() {
    //credit
    if (Number(this.miscServBillForm.value.paymentMode) === 3) {
      if (Number(this.miscServBillForm.value.amtPayByPatient) > 0) {
        this.paymentDialog();
      } else if (Number(this.miscServBillForm.value.amtPayByPatient) === 0) {
        this.addNewItem();
        this.http
          .post(ApiConstants.postMiscBill, this.postBillObj)
          .pipe(takeUntil(this._destroying$))
          .subscribe(
            (resultData) => {
              if (resultData[0].successFlag === true) {
                this.generatedBillNo = resultData[0].billId;
                this.enablePrint = true;
                this.isEnableBillBtn = false;
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
              } else if (resultData[0].successFlag === false) {
                this.snackbar.open(resultData[0].returnMessage, "error");
              }
            },
            (error) => {
              this.snackbar.open(error, "error");
            }
          );
        this.miscPatient.makeBillPayload.ds_paymode = {
          tab_paymentList: [],
          tab_cheque: [],
          tab_dd: [],
          tab_credit: [],
          tab_debit: [],
          tab_Mobile: [],
          tab_Online: [],
          tab_UPI: [],
        };
      }
    }
    if (Number(this.miscServBillForm.value.paymentMode) === 1) {
      //cash
      this.paymentDialog();
    }
  }
  paymentDialog() {
    const RefundDialog = this.matDialog.open(BillPaymentDialogComponent, {
      width: "70vw",
      height: "98vh",
      data: {
        totalBillAmount: this.TotalAmount,
        totalDiscount: this.miscServBillForm.value.discAmt,
        totalDeposit: this.miscServBillForm.value.dipositAmtEdit,
        totalRefund: 0,
        ceditLimit: parseFloat(this.miscServBillForm.value.credLimit),
        settlementAmountRefund: 0,
        settlementAmountReceived: 0,
        toPaidAmount: parseFloat(this.miscServBillForm.value.amtPayByPatient),
        amtPayByCompany: parseFloat(this.miscServBillForm.value.amtPayByComp),
        name: "Misc Billing",
      },
    });
    RefundDialog.afterClosed()
      .pipe(takeUntil(this._destroying$))
      .subscribe((result) => {
        if (result == "MakeBill") {
          if (
            Number(this.miscServBillForm.value.amtPayByPatient) >
            Number(this.miscPatient.calculatedBill.collectedAmount)
          ) {
            const MakeDepositDialogref = this.matDialog.open(
              MakedepositDialogComponent,
              {
                width: "33vw",
                height: "40vh",
                data: {
                  message: "Do You Want To Save Less Amount ?",
                },
              }
            );

            MakeDepositDialogref.afterClosed()
              .pipe(takeUntil(this._destroying$))
              .subscribe((result) => {
                if (result == "Success") {
                  this.addNewItem();
                  this.http
                    .post(ApiConstants.postMiscBill, this.postBillObj)
                    .pipe(takeUntil(this._destroying$))
                    .subscribe(
                      (resultData) => {
                        if (resultData[0].successFlag === true) {
                          this.generatedBillNo = resultData[0].billId;
                          this.enablePrint = true;
                          this.isEnableBillBtn = false;
                          const successInfo = this.messageDialogService.info(
                            `Bill saved with the Bill No ${resultData[0].billNo} and Amount ${this.billAmnt}`
                          );
                          successInfo
                            .afterClosed()
                            .pipe(takeUntil(this._destroying$))
                            .subscribe((result: any) => {
                              const printDialog =
                                this.messageDialogService.confirm(
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
                        } else if (resultData[0].successFlag === false) {
                          this.snackbar.open(
                            resultData[0].returnMessage,
                            "error"
                          );
                        }
                      },
                      (error) => {
                        this.snackbar.open(error, "error");
                      }
                    );
                } else {
                  return;
                }
              });
          } else {
            this.addNewItem();
            this.http
              .post(ApiConstants.postMiscBill, this.postBillObj)
              .pipe(takeUntil(this._destroying$))
              .subscribe(
                (resultData) => {
                  if (resultData[0].successFlag === true) {
                    this.generatedBillNo = resultData[0].billId;
                    this.enablePrint = true;
                    this.isEnableBillBtn = false;
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
                  } else if (resultData[0].successFlag === false) {
                    this.snackbar.open(resultData[0].returnMessage, "error");
                  }
                },
                (error) => {
                  this.snackbar.open(error, "error");
                }
              );
          }
          this.miscPatient.makeBillPayload.ds_paymode = {
            tab_paymentList: [],
            tab_cheque: [],
            tab_dd: [],
            tab_credit: [],
            tab_debit: [],
            tab_Mobile: [],
            tab_Online: [],
            tab_UPI: [],
          };
        }
      });
  }
  //Calculate TA
  calculateTotalAmount() {
    this.TotalAmount = 0;
    this.getgstdata();
    this.getDipositedAmountByMaxID();
    this.serviceselectedList.forEach((element) => {
      this.TotalAmount =
        Number(this.TotalAmount) +
        Number(element.PriceNo) * Number(element.Qty);
    });
    this.calcBillData.totalAmount = this.TotalAmount;
    this.miscPatient.setCalculateBillItems(this.calcBillData);
    this.billAmnt = this.TotalAmount;
    let calcBill0 = this.miscPatient.calculateBill();
    this.miscServBillForm.controls["billAmt"].setValue(
      this.TotalAmount.toFixed(2)
    );
    this.miscServBillForm.controls["amtPayByPatient"].setValue(
      calcBill0.amntPaidBythePatient.toFixed(2)
    );
  }

  //Make Bill Obj
  addNewItem(): any {
    let miscFormData = this.miscPatient.getCalculateBillItems();
    let miscPatient = this.miscPatient.getFormLsit();
    if (this.miscPatient.selectedcompanydetails) {
      this.miscCompanyId = this.miscPatient.selectedcompanydetails.value;
    } else {
      this.miscCompanyId = 0;
    }

    let calcBill0 = this.miscPatient.calculateBill();
    // if (calcBill0.amntPaidBythePatient > 0) {
    //   this.CreditAmtforSrvTax = calcBill0.amntPaidBythePatient;
    //   let srvTax = 10.3;
    //   this.txtServiceTaxAmt = (this.CreditAmtforSrvTax * srvTax) / 100;
    // }

    let depositData: any = [];
    if (this.depodialogRows) {
      this.depodialogRows.forEach((e: any) => {
        depositData.push({
          id: e.id,
          amount: e.amount,
          balanceamount: e.balanceamount,
        });
      });
    }
    let miscellaneousData: any = [];
    this.serviceselectedList.forEach((e: any) => {
      miscellaneousData.push({
        quantity: Number(e.Qty),
        serviceid: e.serviceid,
        amount: e.amount,
        discountAmount: 0,
        serviceName: e.serviceName,
        itemModify: e.ItemforModify,
        discounttype: 0,
        disReasonId: 0,
        docid: e.docid,
        remarksId: e.remarksId,
        itemId: e.itemId,
        mPrice: this.marketPrice,
        empowerApproverCode: "",
        couponCode: "",
      });
    });
    if (Number(this.miscServBillForm.value.credLimit) <= 0) {
      this.miscServBillForm.value.credLimit = 0;
    }
    if (Number(this.miscServBillForm.value.dipositAmtEdit) <= 0) {
      this.miscServBillForm.value.dipositAmtEdit = 0;
    }
    if (Number(calcBill0.amntPaidBythePatient) <= 0) {
      calcBill0.amntPaidBythePatient = 0;
    }
    if (!calcBill0.selectedAuthorise) {
      calcBill0.selectedAuthorise = 0;
    }
    if (Number(this.miscServBillForm.value.interactionDetails) <= 0) {
      this.miscServBillForm.value.interactionDetails = 0;
    }
    if (!miscPatient.narration) {
      miscPatient.narration = "";
    }
    if (!miscPatient.b2bInvoiceType) {
      miscPatient.b2bInvoiceType = "B2C";
    }
    let refDocId = 0;
    if (this.selfDoc === true) {
      refDocId = 2015;
    } else {
      refDocId = this.miscPatient.referralDoctor.id;
    }
    this.postBillObj.dtSaveOBill_P = {
      registrationno: miscPatient.registrationno,
      iacode: miscPatient.iacode,
      billAmount:
        Number(this.miscPatient.calculatedBill.amntPaidBythePatient) || 0,
      depositAmount: this.miscServBillForm.value.dipositAmtEdit,
      discountAmount: this.discountedAmt,
      stationid: this.stationId, //10475,
      billType: this.miscServBillForm.value.paymentMode,
      categoryId: 0,
      companyId: this.miscCompanyId,
      operatorId: this.userID, // 9923,
      collectedamount:
        Number(this.miscPatient.calculatedBill.collectedAmount) || 0,
      balance:
        Number(this.miscServBillForm.value.amtPayByPatient) -
          Number(this.miscPatient.calculatedBill.collectedAmount) || 0,
      hsplocationid: this.location,
      refdoctorid: refDocId,
      authorisedid: calcBill0.selectedAuthorise,
      serviceTax: this.txtServiceTaxAmt,
      creditLimit: this.miscServBillForm.value.credLimit,
      tpaId: miscFormData.companyId.paidbyTPA,
      paidbyTPA: miscFormData.companyId.paidbyTPA,
      interactionID: this.miscServBillForm.value.interactionDetails,
      corporateid: this.miscPatient.selectedcorporatedetails.value,
      corporateName: this.miscPatient.selectedcorporatedetails.title,
      channelId:
        Number(this.miscPatient.cacheCreditTabdata.isCorporateChannel) || 0,
      billToCompany: this.billToCompId,
      invoiceType: miscPatient.b2bInvoiceType,
      narration: miscPatient.narration,
    };
    //Discount values
    this.postBillObj.dtMiscellaneous_list = miscellaneousData;
    this.postBillObj.ds_paymode = this.miscPatient.makeBillPayload
      .ds_paymode || {
      tab_paymentList: [
        {
          slNo: 1,
          modeOfPayment: "Cash",
          amount: Number(this.miscServBillForm.value.amtPayByCompany),
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
    // this.postBillObj.ds_paymode = {
    //   tab_paymentList: [
    //     {
    //       slNo: 1,
    //       modeOfPayment: "Cash",
    //       amount: Number(this.miscServBillForm.value.amtPayByPatient),
    //       flag: 1,
    //     },
    //   ],
    //   tab_cheque: [],tionid
    //   tab_dd: [],
    //   tab_credit: [],
    //   tab_debit: [],
    //   tab_Mobile: [],
    //   tab_Online: [],
    //   tab_UPI: [],
    // };
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
      taxgrpid: this.gstDataResult.taxgrpid,
    };
    this.postBillObj.dtDeposit_P = depositData;
    this.postBillObj.dtSaveDeposit_P = {};
    this.postBillObj.htParameter_P = {};
    this.postBillObj.operatorId = this.userID;
    this.postBillObj.locationId = this.location;
  }

  amtByComp() {
    let balance =
      this.billAmnt -
      (this.miscServBillForm.value.discAmt || 0) -
      (this.miscServBillForm.value.dipositAmtEdit || 0);

    this.miscPatient.setCreditLimit(
      Number(this.miscServBillForm.value.credLimit).toFixed(2)
    );
    this.miscPatient.setCoPay(
      Number(this.miscServBillForm.value.coPay).toFixed(2)
    );
    if (this.miscServBillForm.value.coPay >= 0) {
      const amtPayByComp = balance;
      let tempAmount = this.miscServBillForm.value.credLimit;

      if (parseFloat(tempAmount) <= amtPayByComp) {
        this.miscServBillForm.controls["amtPayByComp"].setValue(tempAmount);
      } else {
        this.miscServBillForm.controls["amtPayByComp"].setValue(amtPayByComp);
      }
      tempAmount =
        this.miscServBillForm.value.amtPayByComp -
        (this.miscServBillForm.value.amtPayByComp *
          this.miscServBillForm.value.coPay) /
          100;
      this.miscServBillForm.controls["amtPayByComp"].setValue(
        tempAmount.toFixed(2)
      );
    } else {
      this.miscServBillForm.controls["amtPayByComp"].setValue(
        balance.toFixed(2)
      );
    }
    this.miscServBillForm.controls["amtPayByPatient"].setValue(
      this.getAmountPayByPatient()
    );
  }
  getAmountPayByPatient() {
    let temp =
      this.billAmnt -
      (this.miscServBillForm.value.discAmt || 0) -
      (this.miscServBillForm.value.dipositAmtEdit || 0) -
      (this.miscServBillForm.value.amtPayByComp || 0);

    // this.calcBillData.totalAmount = temp;
    // this.miscPatient.setCalculateBillItems(this.calcBillData);

    // let calcBill0 = this.miscPatient.calculateBill();
    // let tempo = calcBill0.amntPaidBythePatient.toFixed(2);

    return temp.toFixed(2);
  }
  makeBill() {
    //Set Gst Values
    // if (this.totaltaX_Value) {
    //   let TotalTaxGST = this.totaltaX_Value;
    //   let txtgsttaxamt = (this.billAmnt * TotalTaxGST) / 100;
    //   // let txttotalamount = this.billAmnt;
    //   // let billamount = Number(txttotalamount) + Number(txtgsttaxamt);
    //   //this.miscServBillForm.controls["gstTax"].setValue(txtgsttaxamt);
    // }
    if (
      this.depositDetails.length > 0 &&
      this.miscServBillForm.value.dipositAmtEdit == 0
    ) {
      this.openDepositdialog();
    } else {
      this.openPaymentModeDialog();
    }
  }
  //Print Report
  print() {
    this.openReportModal("billingreport");
  }
  openReportModal(btnname: string) {
    this.reportService.openWindow(btnname, btnname, {
      opbillid: this.generatedBillNo,
      locationID: this.location,
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
  ) {}

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
