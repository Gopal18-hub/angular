import { DatePipe } from "@angular/common";
import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { ApiConstants } from "@core/constants/ApiConstants";
import { ApiConstants as billingconst } from "@shared/constants/ApiConstants";
import { sendotpforpatientrefund } from "@core/models/patientsaveotprefunddetailModel.Model";
import { savepatientRefunddetailModel } from "@core/models/savepatientRefundDetailModel.Model";
import { PatientDepositCashLimitLocationDetail } from "@core/types/depositcashlimitlocation.Interface";
import { PaymentMethodsComponent } from "@core/UI/billing/submodules/payment-methods/payment-methods.component";
import { CookieService } from "@shared/services/cookie.service";
import { HttpService } from "@shared/services/http.service";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";
import { Subject, takeUntil } from "rxjs";
import { MakedepositDialogComponent } from "../../deposit/makedeposit-dialog/makedeposit-dialog.component";
import { billDetailService } from "../billDetails.service";
import { BillDetailsApiConstants } from "../BillDetailsApiConstants";
import { getBankName } from "../../../../../core/types/billdetails/getBankName.Interface";
import { getcreditcard } from "../../../../../core/types/billdetails/getcreditcard.Interface";
import { MatTabChangeEvent } from "@angular/material/tabs";
import {
  ds_paymode,
  insertDueAmountModel,
  tab_cheque,
  tab_credit,
  tab_dd,
  tab_debit,
  tab_Mobile,
  tab_Online,
  tab_paymentList,
  tab_rec,
  tab_UPI,
} from "../../../../../core/models/insertDueAmountModel.Model";
import { BillingApiConstants } from "../../billing/BillingApiConstant";
import { OnlinePaymentPaidPatientComponent } from "../../billing/prompts/online-payment-paid-patient/online-payment-paid-patient.component";
import { MaxHealthStorage } from "@shared/services/storage";
import { PaymentService } from "@core/services/payment.service";
import { DepositService } from "@core/services/deposit.service";
@Component({
  selector: "out-patients-payment-dialog",
  templateUrl: "./payment-dialog.component.html",
  styleUrls: ["./payment-dialog.component.scss"],
})
export class PaymentDialogComponent implements OnInit {
  bankname: getBankName[] = [];
  creditcard: getcreditcard[] = [];
  insertdueamt: insertDueAmountModel = new insertDueAmountModel();
  dueFormData = {
    title: "",
    type: "object",
    properties: {
      onlinepaymentreq: {
        type: "checkbox",
        options: [{ title: "Online Payment Request" }],
      },
      paymenttype: {
        type: "dropdown",
        placeholder: "Online Payment Type",
      },
      cashamount: {
        title: "Amount",
        type: "number",
        defaultValue: "0.00",
        required: true,
      },
      //cheque
      chequeamount: {
        title: "Amount",
        type: "number",
        defaultValue: "0.00",
        required: true,
      },
      chequeno: {
        title: "Cheque/NEFT No.",
        type: "number",
        required: true,
      },
      chequeissuedate: {
        title: "Issue Date",
        type: "date",
        maximum: new Date(),
        defaultValue: new Date(),
        required: true,
      },
      chequevalidity: {
        title: "Validity",
        type: "date",
        defaultValue: new Date(),
        minimum: new Date(),
        required: true,
      },
      chequebankname: {
        title: "Bank Name",
        type: "autocomplete",
        options: this.bankname,
        required: true,
      },
      chequebranchname: {
        title: "Branch Name",
        type: "string",
        required: true,
      },
      //credit
      creditamount: {
        title: "Amount",
        type: "number",
        defaultValue: "0.00",
        required: true,
      },
      creditcardno: {
        title: "Card No.",
        type: "number",
        required: true,
      },
      creditcardholdername: {
        title: "Card Holder Name",
        type: "string",
        required: true,
      },
      creditbankname: {
        title: "Bank Name",
        type: "autocomplete",
        options: this.creditcard,
        required: true,
      },
      creditbatchno: {
        title: "Batch no.",
        type: "string",
        required: true,
      },
      creditapprovalno: {
        title: "Approval Code",
        type: "string",
        required: true,
      },
      creditterminalid: {
        title: "Terminal ID",
        type: "string",
        required: true,
      },
      creditacquiringbank: {
        title: "Acquiring Bank",
        type: "string",
        required: true,
      },
      //demand
      demandamount: {
        title: "Amount",
        type: "number",
        defaultValue: "0.00",
        required: true,
      },
      demandddno: {
        title: "DD No.",
        type: "string",
        required: true,
      },
      demandissuedate: {
        title: "Issue Date",
        type: "date",
        maximum: new Date(),
        defaultValue: new Date(),
        required: true,
      },
      demandvalidity: {
        title: "Validity",
        type: "date",
        defaultValue: new Date(),
        minimum: new Date(),
        required: true,
      },
      demandbankname: {
        title: "Bank Name",
        type: "autocomplete",
        options: this.bankname,
        required: true,
      },
      demandbranchname: {
        title: "Branch Name",
        type: "string",
        required: true,
      },
      //online
      onlineamount: {
        title: "Amount",
        type: "number",
        defaultValue: "0.00",
        required: true,
      },
      onlinetransacid: {
        title: "Transaction ID",
        type: "string",
        required: true,
      },
      onlinebookingid: {
        title: "Booking ID",
        type: "string",
        required: true,
      },
      onlinecardvalidate: {
        title: "Card Validation",
        type: "radio",
        required: true,
        defaultValue: "yes",
        options: [
          { title: "Yes", value: "yes" },
          { title: "No", value: "no" },
        ],
      },
      onlinecontact: {
        title: "Contact No.",
        type: "string",
        required: true,
      },
      //28
      onlinepaidamount: {
        title: "Amount",
        type: "string",
        required: true,
      },

      //credit latest added
      posimei: {
        type: "dropdown",
        title: "POS IMEI",
        required: true,
        // defaultValue: MaxHealthStorage.getCookie("MAXMachineName"),
        readonly: false,
      },
      transactionid: {
        type: "string",
        title: "Transaction ID",
        required: true,
      },
      creditvalidity: {
        type: "date",
        title: "Validity",
        required: true,
        defaultValue: new Date(),
      },
      banktid: {
        type: "string",
        title: "Bank TID",
        required: true,
      },
    },
  };
  dueform!: FormGroup;
  questions: any;
  hsplocationId: any = Number(this.cookie.get("HSPLocationId"));
  stationId: any = Number(this.cookie.get("StationId"));
  operatorID: any = Number(this.cookie.get("UserId"));
  depositcashlimitationdetails: any;
  private readonly _destroying$ = new Subject<void>();

  @ViewChild(PaymentMethodsComponent) paymentmethod!: PaymentMethodsComponent;
  @ViewChild("billpatientIdentityInfo") billingpatientidentity: any;

  config = {
    paymentmethod: {
      cash: true,
      cheque: true,
      credit: true,
      demand: true,
      onlinepayment: true,
    },
    combopayment: true,
  };
  patientIdentityInfo: any = [];
  billpatientIdentityInfo: any = [];
  duelabel: any;
  billamount: any = 0;
  prepaidamount: any = 0;
  depositamount: any = 0;
  discountamount: any = 0;
  due: any = 0;
  totaldue: any = 0;

  cashamt: any = 0.0;
  chequeamt: any = 0.0;
  creditamt: any = 0.0;
  demandamt: any = 0.0;
  onlineamt: any = 0.0;
  finalamount: number = 0;
  reduceamount: number = 0;
  selected: any = 0;

  manualbtn: boolean = true;
  retrybtn: boolean = true;
  approvalbtn: boolean = true;

  submitbtnflag: boolean = false;

  apiProcessing: boolean = false;

  POSIMEIList: any = [];
  POSMachineDetal: any = {};

  totalamtFlag: boolean = false;
  constructor(
    public matDialog: MatDialog,
    private formService: QuestionControlService,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private messageDialogService: MessageDialogService,
    private cookie: CookieService,
    private dialogRef: MatDialogRef<PaymentDialogComponent>,
    private http: HttpService,
    private datepipe: DatePipe,
    private billDetailService: billDetailService,
    private matdialog: MatDialog,
    private paymentService: PaymentService,
    private depositservice: DepositService
  ) {}

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.dueFormData.properties,
      {}
    );
    console.log(this.data);
    if (this.data.flag == "companyDue") {
      this.duelabel = "Company Due";
      this.due =
        this.billDetailService.patientbilldetaillist.billDetialsForRefund_DepositRefundAmountDetail[0].balance.toFixed(
          2
        );
    } else if (this.data.flag == "patientDue") {
      this.duelabel = "Patient Due";
      this.due =
        this.billDetailService.patientbilldetaillist.billDetialsForRefund_DepositRefundAmountDetail[0].balance.toFixed(
          2
        );
    }
    this.dueform = formResult.form;
    this.questions = formResult.questions;
    this.getdepositcashlimit();

    this.billamount =
      this.billDetailService.patientbilldetaillist.billDetialsForRefund_DepositRefundAmountDetail[0].billamount.toFixed(
        2
      );
    this.prepaidamount =
      this.billDetailService.patientbilldetaillist.billDetialsForRefund_DepositRefundAmountDetail[0].collectedamount.toFixed(
        2
      );
    this.depositamount =
      this.billDetailService.patientbilldetaillist.billDetialsForRefund_DepositRefundAmountDetail[0].depositamount.toFixed(
        2
      );
    this.discountamount =
      this.billDetailService.patientbilldetaillist.billDetialsForRefund_DepositRefundAmountDetail[0].discountamount.toFixed(
        2
      );
    this.totaldue =
      this.billDetailService.patientbilldetaillist.billDetialsForRefund_DepositRefundAmountDetail[0].balance.toFixed(
        2
      );

    this.dueform.controls["cashamount"].setValue(
      this.billDetailService.patientbilldetaillist
        .billDetialsForRefund_DepositRefundAmountDetail[0].balance
    );
    this.totalamtFlag = this.totaldue - Math.floor(this.totaldue) !== 0;
    // if (!this.totalamtFlag) {
    //   this.dueform.controls["cashamount"].setValue(Number(this.totaldue));
    // } else {
    //   this.dueform.controls["cashamount"].setValue(this.totaldue);
    // }
    // console.log(this.totalamtFlag, this.totaldue - Math.floor(this.totaldue));
    this.finalamount += Number(this.dueform.controls["cashamount"].value);
    this.data.patientinfo.toPaidAmount = this.finalamount;
    this.patientIdentityInfo = { patientinfo: this.data.patientinfo };
    this.amountcheck();
    this.getbankname();
    this.getcreditcard();
  }
  ngAfterViewInit(): void {
    // console.log(this.paymentmethod.refundform);
    // this.paymentmethod.refundform.controls['cashamount'].valueChanges.subscribe(res => {
    //   console.log(res);
    //   this.adddueamount(res);
    // })

    let amountIndex = [2, 3, 9, 17, 23];
    if (!this.totalamtFlag) {
      amountIndex.forEach((i) => {
        this.questions[i].elementRef.addEventListener(
          "keypress",
          (event: any) => {
            if (event.keyCode == 46) {
              event.preventDefault();
            }
          }
        );
      });
    }

    this.questions[2].elementRef.addEventListener(
      "focus",
      this.removezero.bind(this, this.questions[2])
    );
    this.questions[3].elementRef.addEventListener(
      "focus",
      this.removezero.bind(this, this.questions[3])
    );
    this.questions[9].elementRef.addEventListener(
      "focus",
      this.removezero.bind(this, this.questions[9])
    );
    this.questions[17].elementRef.addEventListener(
      "focus",
      this.removezero.bind(this, this.questions[17])
    );
    this.questions[23].elementRef.addEventListener(
      "focus",
      this.removezero.bind(this, this.questions[23])
    );

    // this.questions[2].elementRef.addEventListener(
    //   "blur",
    //   this.adddecimal.bind(this, this.questions[2])
    // );
    // this.questions[3].elementRef.addEventListener(
    //   "blur",
    //   this.adddecimal.bind(this, this.questions[3])
    // );
    // this.questions[9].elementRef.addEventListener(
    //   "blur",
    //   this.adddecimal.bind(this, this.questions[9])
    // );
    // this.questions[17].elementRef.addEventListener(
    //   "blur",
    //   this.adddecimal.bind(this, this.questions[17])
    // );
    // this.questions[23].elementRef.addEventListener(
    //   "blur",
    //   this.adddecimal.bind(this, this.questions[23])
    // );

    this.questions[2].elementRef.addEventListener(
      "blur",
      this.amountcheck.bind(this)
    );
    this.questions[3].elementRef.addEventListener(
      "blur",
      this.amountcheck.bind(this)
    );
    this.questions[9].elementRef.addEventListener(
      "blur",
      this.amountcheck.bind(this)
    );
    this.questions[17].elementRef.addEventListener(
      "blur",
      this.amountcheck.bind(this)
    );
    this.questions[23].elementRef.addEventListener(
      "blur",
      this.amountcheck.bind(this)
    );

    this.billingpatientidentity.patientidentityform.controls[
      "panno"
    ].valueChanges.subscribe(() => {
      if (
        this.billingpatientidentity.patientidentityform.controls["panno"]
          .status == "VALID"
      ) {
        this.submitbtnflag = false;
      } else {
        this.submitbtnflag = true;
      }
    });
    //call for submit btn disable
    // this.formvalidation();

    //GAV-1483 - pos selection on payment screen
    this.dueform.controls["posimei"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value: any) => {
        this.posimeivaluechange(value);
      });
  }

  removezero(question: any) {
    console.log(question);
    if (Number(this.dueform.controls[question.key].value) == 0) {
      this.dueform.controls[question.key].setValue("");
    }
  }

  adddecimal(question: any) {
    if (Number(this.dueform.controls[question.key].value)) {
      this.dueform.controls[question.key].setValue(
        Number(this.dueform.controls[question.key].value).toFixed(2)
      );
    } else {
      this.dueform.controls[question.key].setValue("0.00");
    }
  }

  formvalidation() {
    console.log(this.dueform);
    this.dueform.controls["cashamount"].valueChanges.subscribe((res) => {
      if (res && Number(res) > 0) {
        this.questions[2].required = true;
      } else {
        this.questions[2].required = false;
      }
    });

    this.dueform.controls["chequeamount"].valueChanges.subscribe((res) => {
      if (res && Number(res) > 0) {
        this.questions[3].required = true;
        this.questions[4].required = true;
        this.questions[5].required = true;
        this.questions[6].required = true;
        this.questions[7].required = true;
        this.questions[8].required = true;
      } else {
        this.questions[3].required = false;
        this.questions[4].required = false;
        this.questions[5].required = false;
        this.questions[6].required = false;
        this.questions[7].required = false;
        this.questions[8].required = false;
      }
    });

    this.dueform.controls["creditamount"].valueChanges.subscribe((res) => {
      if (res && Number(res) > 0) {
        this.questions[9].required = true;
        this.questions[10].required = true;
        this.questions[11].required = true;
        this.questions[12].required = true;
        this.questions[13].required = true;
        this.questions[14].required = true;
        this.questions[15].required = true;
        this.questions[16].required = true;
        this.questions[29].required = true;
        this.questions[30].required = true;
        this.questions[31].required = true;
        this.questions[32].required = true;
      } else {
        this.questions[9].required = false;
        this.questions[10].required = false;
        this.questions[11].required = false;
        this.questions[12].required = false;
        this.questions[13].required = false;
        this.questions[14].required = false;
        this.questions[15].required = false;
        this.questions[16].required = false;
        this.questions[29].required = false;
        this.questions[30].required = false;
        this.questions[31].required = false;
        this.questions[32].required = false;
      }
    });

    this.dueform.controls["demandamount"].valueChanges.subscribe((res) => {
      if (res && Number(res) > 0) {
        this.questions[17].required = true;
        this.questions[18].required = true;
        this.questions[19].required = true;
        this.questions[20].required = true;
        this.questions[21].required = true;
        this.questions[22].required = true;
      } else {
        this.questions[17].required = false;
        this.questions[18].required = false;
        this.questions[19].required = false;
        this.questions[20].required = false;
        this.questions[21].required = false;
        this.questions[22].required = false;
      }
    });

    this.dueform.controls["onlineamount"].valueChanges.subscribe((res) => {
      if (res && Number(res) > 0) {
        this.questions[23].required = true;
        this.questions[24].required = true;
        this.questions[25].required = true;
        this.questions[26].required = true;
        this.questions[27].required = true;
        this.questions[28].required = true;
      } else {
        this.questions[23].required = false;
        this.questions[24].required = false;
        this.questions[25].required = false;
        this.questions[26].required = false;
        this.questions[27].required = false;
        this.questions[28].required = false;
      }
    });
  }

  async getapproval() {
    let module = "OPD_Billing";
    const payloadData = {
      price: Number(this.dueform.controls["creditamount"].value),
    };
    if (Number(this.dueform.controls["creditamount"].value) == 0) {
      this.messageDialogService.warning("Please Give Proper Amount.");
    } else {
      console.log(payloadData);
      let res = await this.paymentService.uploadBillTransaction(
        payloadData,
        module,
        this.billDetailService.activemaxid
      );
      await this.processPaymentApiResponse(res);
    }
  }
  async retry() {
    let module = "OPD_Billing";
    const payloadData = {
      price: Number(this.dueform.controls["creditamount"].value),
    };
    if (Number(this.dueform.controls["creditamount"].value) == 0) {
      this.messageDialogService.warning("Please Give Proper Amount.");
    } else {
      let res = await this.paymentService.getBillTransactionStatus(
        payloadData,
        module,
        this.billDetailService.activemaxid
      );
      await this.processPaymentApiResponse(res);
    }
  }

  async processPaymentApiResponse(res: any) {
    if (res && res.success) {
      if (res.responseMessage && res.responseMessage != "") {
        if (res.responseMessage == "APPROVED") {
          if (res.transactionRefId) {
            this.dueform.controls["transactionid"].setValue(
              res.transactionRefId
            );
          }
          const infoDialogRef = this.messageDialogService.info(
            "Kindly Pay Using Machine"
          );
          await infoDialogRef.afterClosed().toPromise();
          return;
        } else if (res.responseMessage == "TXN APPROVED") {
          if (res.pineLabReturnResponse) {
            let bankId = 0;
            let bank = this.creditcard.filter(
              (r: any) => r.title == res.pineLabReturnResponse.ccResAcquirerName
            );
            if (bank && bank.length > 0) {
              bankId = bank[0].id;
            }
            this.dueform.controls["creditcardno"].patchValue(
              res.pineLabReturnResponse.ccResCardNo
            );
            this.dueform.controls["creditcardholdername"].patchValue(
              res.cardHolderName
            );
            this.dueform.controls["creditbankname"].patchValue(bankId);
            this.dueform.controls["creditbatchno"].patchValue(
              res.pineLabReturnResponse.ccResBatchNumber
            );
            this.dueform.controls["creditapprovalno"].patchValue(
              res.pineLabReturnResponse.ccResApprovalCode
            );
            this.dueform.controls["creditterminalid"].patchValue(
              res.terminalId
            );
            this.dueform.controls["creditacquiringbank"].patchValue(
              res.pineLabReturnResponse.ccResAcquirerName
            );
            this.dueform.controls["banktid"].patchValue(
              res.pineLabReturnResponse.ccResBankTID
            );
          }
        } else {
          const infoDialogRef = this.messageDialogService.info(
            res.responseMessage
          );
          await infoDialogRef.afterClosed().toPromise();
          return;
        }
      }
    } else if (res && !res.success) {
      if (res.errorMessage && res.errorMessage != "") {
        const errorDialogRef = this.messageDialogService.error(
          res.errorMessage
        );
        await errorDialogRef.afterClosed().toPromise();
        return;
      } else if (res.responseMessage && res.responseMessage != "") {
        const errorDialogRef = this.messageDialogService.error(
          res.responseMessage
        );
        await errorDialogRef.afterClosed().toPromise();
        return;
      }
    }
  }

  tabchange(event: MatTabChangeEvent) {
    console.log(event);
    console.log(this.selected);
    console.log(this.totalamtFlag);
    if (event.index == 0) {
      if (Number(this.dueform.controls["cashamount"].value) == 0.0) {
        if (!this.totalamtFlag) {
          this.dueform.controls["cashamount"].setValue(this.reduceamount);
        } else {
          this.dueform.controls["cashamount"].setValue(
            this.reduceamount.toFixed(2)
          );
        }
      }
    } else if (event.index == 1) {
      if (Number(this.dueform.controls["chequeamount"].value) == 0.0) {
        if (!this.totalamtFlag) {
          this.dueform.controls["chequeamount"].setValue(this.reduceamount);
        } else {
          this.dueform.controls["chequeamount"].setValue(
            this.reduceamount.toFixed(2)
          );
        }
      }
    } else if (event.index == 2) {
      //GAV-1483 - pos selection on payment screen
      this.posimeiapi();
      if (Number(this.dueform.controls["creditamount"].value) == 0.0) {
        if (!this.totalamtFlag) {
          this.dueform.controls["creditamount"].setValue(this.reduceamount);
        } else {
          this.dueform.controls["creditamount"].setValue(
            this.reduceamount.toFixed(2)
          );
        }
      }
    } else if (event.index == 3) {
      if (Number(this.dueform.controls["demandamount"].value) == 0.0) {
        if (!this.totalamtFlag) {
          this.dueform.controls["demandamount"].setValue(this.reduceamount);
        } else {
          this.dueform.controls["demandamount"].setValue(
            this.reduceamount.toFixed(2)
          );
        }
      }
    } else if (event.index == 4) {
      if (Number(this.dueform.controls["onlineamount"].value) == 0.0) {
        if (!this.totalamtFlag) {
          this.dueform.controls["onlineamount"].setValue(this.reduceamount);
        } else {
          this.dueform.controls["onlineamount"].setValue(
            this.reduceamount.toFixed(2)
          );
        }
      }
    }
    this.amountcheck();
    this.crossiconcheck(event.index);
  }
  cashicon: boolean = false;
  chequeicon: boolean = false;
  crediticon: boolean = false;
  demandicon: boolean = false;
  onlineicon: boolean = false;
  crossiconcheck(index: any) {
    if (Number(this.dueform.controls["cashamount"].value) > 0 && index != 0) {
      this.cashicon = true;
    } else {
      this.cashicon = false;
    }
    if (Number(this.dueform.controls["chequeamount"].value) > 0 && index != 1) {
      this.chequeicon = true;
    } else {
      this.chequeicon = false;
    }
    if (Number(this.dueform.controls["creditamount"].value) > 0 && index != 2) {
      this.crediticon = true;
    } else {
      this.crediticon = false;
    }
    if (Number(this.dueform.controls["demandamount"].value) > 0 && index != 3) {
      this.demandicon = true;
    } else {
      this.demandicon = false;
    }
    if (Number(this.dueform.controls["onlineamount"].value) > 0 && index != 4) {
      this.onlineicon = true;
    } else {
      this.onlineicon = false;
    }
  }
  clearTabForm(index: any) {
    if (index == 0) {
      this.dueform.controls["cashamount"].setValue(0.0);
      this.amountcheck();
      this.cashicon = false;
    }
    if (index == 1) {
      this.dueform.controls["chequeamount"].setValue(0.0);
      this.dueform.controls["chequeno"].reset();
      this.dueform.controls["chequeissuedate"].setValue(new Date());
      this.dueform.controls["chequevalidity"].setValue(new Date());
      this.dueform.controls["chequebankname"].setValue({
        title: "",
        value: "",
      });
      this.dueform.controls["chequebranchname"].reset();
      this.amountcheck();
      this.chequeicon = false;
    }
    if (index == 2) {
      this.dueform.controls["creditamount"].setValue(0.0);
      this.dueform.controls["creditcardno"].reset();
      this.dueform.controls["creditcardholdername"].reset();
      this.dueform.controls["creditbankname"].setValue({
        title: "",
        value: "",
      });
      this.dueform.controls["creditbatchno"].reset();
      this.dueform.controls["creditapprovalno"].reset();
      this.dueform.controls["creditterminalid"].reset();
      this.dueform.controls["creditacquiringbank"].reset();
      this.dueform.controls["transactionid"].reset();
      this.dueform.controls["creditvalidity"].setValue(new Date());
      this.dueform.controls["banktid"].reset();
      this.amountcheck();
      this.crediticon = false;
    }
    if (index == 3) {
      this.dueform.controls["demandamount"].setValue(0.0);
      this.dueform.controls["demandddno"].reset();
      this.dueform.controls["demandissuedate"].setValue(new Date());
      this.dueform.controls["demandvalidity"].setValue(new Date());
      this.dueform.controls["demandbankname"].setValue({
        title: "",
        value: "",
      });
      this.dueform.controls["demandbranchname"].reset();
      this.amountcheck();
      this.demandicon = false;
    }
    if (index == 4) {
      this.dueform.controls["onlineamount"].setValue(0.0);
      this.dueform.controls["onlinetransacid"].reset();
      this.dueform.controls["onlinebookingid"].reset();
      this.dueform.controls["onlinecontact"].reset();
      this.amountcheck();
      this.onlineicon = false;
    }
  }
  amountcheck() {
    this.finalamount = 0;
    if (Number(this.dueform.controls["cashamount"].value) < 0) {
      let dialogref = this.messageDialogService.info(
        "Amount can't be Negative"
      );
      dialogref.afterClosed().subscribe(() => {
        this.dueform.controls["cashamount"].setValue(0);
        this.amountcheck();
        if (!this.totalamtFlag) {
          this.dueform.controls["cashamount"].setValue(this.reduceamount);
        } else {
          this.dueform.controls["cashamount"].setValue(
            this.reduceamount.toFixed(2)
          );
        }
        this.amountcheck();
      });
    } else if (Number(this.dueform.controls["chequeamount"].value) < 0) {
      let dialogref = this.messageDialogService.info(
        "Amount can't be Negative"
      );
      dialogref.afterClosed().subscribe(() => {
        this.dueform.controls["chequeamount"].setValue(0);
        this.amountcheck();
        if (!this.totalamtFlag) {
          this.dueform.controls["chequeamount"].setValue(this.reduceamount);
        } else {
          this.dueform.controls["chequeamount"].setValue(
            this.reduceamount.toFixed(2)
          );
        }
        this.amountcheck();
      });
    } else if (Number(this.dueform.controls["creditamount"].value) < 0) {
      let dialogref = this.messageDialogService.info(
        "Amount can't be Negative"
      );
      dialogref.afterClosed().subscribe(() => {
        this.dueform.controls["creditamount"].setValue(0);
        this.amountcheck();
        if (!this.totalamtFlag) {
          this.dueform.controls["creditamount"].setValue(this.reduceamount);
        } else {
          this.dueform.controls["creditamount"].setValue(
            this.reduceamount.toFixed(2)
          );
        }
        this.amountcheck();
      });
    } else if (Number(this.dueform.controls["demandamount"].value) < 0) {
      let dialogref = this.messageDialogService.info(
        "Amount can't be Negative"
      );
      dialogref.afterClosed().subscribe(() => {
        this.dueform.controls["demandamount"].setValue(0);
        this.amountcheck();
        if (!this.totalamtFlag) {
          this.dueform.controls["demandamount"].setValue(this.reduceamount);
        } else {
          this.dueform.controls["demandamount"].setValue(
            this.reduceamount.toFixed(2)
          );
        }
        this.amountcheck();
      });
    } else if (Number(this.dueform.controls["onlineamount"].value) < 0) {
      let dialogref = this.messageDialogService.info(
        "Amount can't be Negative"
      );
      dialogref.afterClosed().subscribe(() => {
        this.dueform.controls["onlineamount"].setValue(0);
        this.amountcheck();
        if (!this.totalamtFlag) {
          this.dueform.controls["onlineamount"].setValue(this.reduceamount);
        } else {
          this.dueform.controls["onlineamount"].setValue(
            this.reduceamount.toFixed(2)
          );
        }
        this.amountcheck();
      });
    }
    this.finalamount +=
      Number(this.dueform.controls["cashamount"].value) +
      Number(this.dueform.controls["chequeamount"].value) +
      Number(this.dueform.controls["creditamount"].value) +
      Number(this.dueform.controls["demandamount"].value) +
      Number(this.dueform.controls["onlineamount"].value);
    this.reduceamount = Number(this.totaldue) - Number(this.finalamount);
    console.log(this.finalamount, this.totaldue, this.reduceamount);
    if (
      this.selected == 0 && this.totalamtFlag == false
        ? Number(this.reduceamount) < 0
        : Number(this.reduceamount) < -1
    ) {
      let dialogref = this.messageDialogService.info(
        "Entered Amount can't be Greater than Due Amount"
      );
      dialogref.afterClosed().subscribe(() => {
        this.dueform.controls["cashamount"].setValue(0);
        this.amountcheck();
        if (!this.totalamtFlag) {
          this.dueform.controls["cashamount"].setValue(this.reduceamount);
        } else {
          this.dueform.controls["cashamount"].setValue(
            this.reduceamount.toFixed(2)
          );
        }
        this.amountcheck();
      });
    } else if (
      this.selected == 1 && this.totalamtFlag == false
        ? Number(this.reduceamount) < 0
        : Number(this.reduceamount) < -1
    ) {
      console.log(this.finalamount, this.totaldue);
      let dialogref = this.messageDialogService.info(
        "Entered Amount can't be Greater than Due Amount"
      );
      dialogref.afterClosed().subscribe(() => {
        this.dueform.controls["chequeamount"].setValue(0);
        this.amountcheck();
        if (!this.totalamtFlag) {
          this.dueform.controls["chequeamount"].setValue(this.reduceamount);
        } else {
          this.dueform.controls["chequeamount"].setValue(
            this.reduceamount.toFixed(2)
          );
        }
        this.amountcheck();
      });
    } else if (
      this.selected == 2 && this.totalamtFlag == false
        ? Number(this.reduceamount) < 0
        : Number(this.reduceamount) < -1
    ) {
      let dialogref = this.messageDialogService.info(
        "Entered Amount can't be Greater than Due Amount"
      );
      dialogref.afterClosed().subscribe(() => {
        this.dueform.controls["creditamount"].setValue(0);
        this.amountcheck();
        if (!this.totalamtFlag) {
          this.dueform.controls["creditamount"].setValue(this.reduceamount);
        } else {
          this.dueform.controls["creditamount"].setValue(
            this.reduceamount.toFixed(2)
          );
        }
        this.amountcheck();
      });
    } else if (
      this.selected == 3 && this.totalamtFlag == false
        ? Number(this.reduceamount) < 0
        : Number(this.reduceamount) < -1
    ) {
      let dialogref = this.messageDialogService.info(
        "Entered Amount can't be Greater than Due Amount"
      );
      dialogref.afterClosed().subscribe(() => {
        this.dueform.controls["demandamount"].setValue(0);
        this.amountcheck();
        if (!this.totalamtFlag) {
          this.dueform.controls["demandamount"].setValue(this.reduceamount);
        } else {
          this.dueform.controls["demandamount"].setValue(
            this.reduceamount.toFixed(2)
          );
        }
        this.amountcheck();
      });
    } else if (
      this.selected == 4 && this.totalamtFlag == false
        ? Number(this.reduceamount) < 0
        : Number(this.reduceamount) < -1
    ) {
      let dialogref = this.messageDialogService.info(
        "Entered Amount can't be Greater than Due Amount"
      );
      dialogref.afterClosed().subscribe(() => {
        this.dueform.controls["onlineamount"].setValue(0);
        this.amountcheck();
        if (!this.totalamtFlag) {
          this.dueform.controls["onlineamount"].setValue(this.reduceamount);
        } else {
          this.dueform.controls["onlineamount"].setValue(
            this.reduceamount.toFixed(2)
          );
        }
        this.amountcheck();
      });
    }

    this.cashamt = Number(this.dueform.controls["cashamount"].value).toFixed(2);
    this.chequeamt = Number(
      this.dueform.controls["chequeamount"].value
    ).toFixed(2);
    this.creditamt = Number(
      this.dueform.controls["creditamount"].value
    ).toFixed(2);
    this.demandamt = Number(
      this.dueform.controls["demandamount"].value
    ).toFixed(2);
    this.onlineamt = Number(
      this.dueform.controls["onlineamount"].value
    ).toFixed(2);
    this.finalamount = Number(this.finalamount.toFixed(2));
    console.log(this.finalamount);
    console.log(this.reduceamount);
  }
  modeOfPayment: any = [];
  cashflag: any = 0;
  chequeflag: any = 0;
  creditflag: any = 0;
  ddflag: any = 0;
  onlineflag: any = 0;
  submitbtn() {
    var callflag: any = 0;
    this.modeOfPayment = [];
    if (Number(this.cashamt) > 0) {
      callflag++;
      this.cashflag = 1;
      this.modeOfPayment.push({
        mop: "Cash",
        flag: 1,
        amount: this.cashamt,
      });
    }
    if (Number(this.chequeamt) > 0) {
      callflag++;
      if (this.dueform.controls["chequeno"].value == "") {
        this.messageDialogService.info("Cheque No is Mandatory");
        this.selected = 1;
        return;
      } else if (this.dueform.controls["chequevalidity"].value <= new Date()) {
        this.messageDialogService.info(
          "Cheque validity can not be lesser then todays's date"
        );
        this.selected = 1;
        return;
      } else if (this.dueform.controls["chequebankname"].value == "") {
        this.messageDialogService.info("Bank Name is Mandatory");
        this.selected = 1;
        return;
      } else if (this.dueform.controls["chequebranchname"].value == "") {
        this.messageDialogService.info("Branch Name is Mandatory");
        this.selected = 1;
        return;
      } else {
        this.chequeflag = 2;
        this.modeOfPayment.push({
          mop: "Cheque",
          flag: 2,
          amount: this.chequeamt,
        });
      }
    }
    if (Number(this.creditamt) > 0) {
      callflag++;
      if (this.dueform.controls["creditcardno"].value == "") {
        this.messageDialogService.info("Credit Card No is Mandatory");
        this.selected = 2;
        return;
      } else if (this.dueform.controls["creditapprovalno"].value == "") {
        this.messageDialogService.info("Please Fill All Mandatory Fields");
        this.selected = 2;
        return;
      } else if (this.dueform.controls["creditbankname"].value == "") {
        this.messageDialogService.info("Bank Name is Mandatory");
        this.selected = 2;
        return;
      } else {
        this.creditflag = 3;
        this.modeOfPayment.push({
          mop: "Credit Card",
          flag: 3,
          amount: this.creditamt,
        });
      }
    }
    if (Number(this.demandamt) > 0) {
      callflag++;
      if (this.dueform.controls["demandddno"].value == "") {
        this.messageDialogService.info("Demand Draft No is Mandatory");
        this.selected = 3;
        return;
      } else if (this.dueform.controls["demandvalidity"].value <= new Date()) {
        this.messageDialogService.info(
          "Demand Draft validity can not be lesser then todays's date"
        );
        this.selected = 3;
        return;
      } else if (this.dueform.controls["demandbankname"].value == "") {
        this.messageDialogService.info("Bank Name is Mandatory");
        this.selected = 3;
        return;
      } else if (this.dueform.controls["demandbranchname"].value == "") {
        this.messageDialogService.info("Branch Name is Mandatory");
        this.selected = 3;
        return;
      } else {
        this.ddflag = 4;
        this.modeOfPayment.push({
          mop: "Demand Darft",
          flag: 4,
          amount: this.demandamt,
        });
      }
    }
    if (Number(this.onlineamt) > 0) {
      callflag++;
      if (this.dueform.controls["onlinetransacid"].value == "") {
        this.messageDialogService.info("Transaction ID is Mandatory");
        this.selected = 4;
      } else if (this.dueform.controls["onlinebookingid"].value == "") {
        this.messageDialogService.info("Booking ID is Mandatory");
        this.selected = 4;
      } else if (this.dueform.controls["onlinecontact"].value == "") {
        this.messageDialogService.info("Conatct No is Mandatory");
        this.selected = 4;
      } else if (
        this.dueform.controls["onlinecontact"].value.toString().length < 10
      ) {
        this.messageDialogService.info("Invalid Conatct No");
        this.selected = 4;
      } else {
        this.onlineflag = 5;
        this.modeOfPayment.push({
          mop: "Online Payment",
          flag: 5,
          amount: this.onlineamt,
        });
      }
    }
    if (Number(this.finalamount) == 0) {
      this.messageDialogService.info("Amount could not be zero");
    }

    //pan card and form 60

    this.billpatientIdentityInfo =
      this.billingpatientidentity.patientidentityform.value;
    if (
      Number(this.finalamount >= 200000) &&
      (this.billpatientIdentityInfo.length == 0 ||
        (this.billpatientIdentityInfo.mainradio == "pancardno" &&
          (this.billpatientIdentityInfo.panno == undefined ||
            this.billpatientIdentityInfo.panno == "")))
    ) {
      this.messageDialogService.info("Please Enter a valid PAN Number");
    } else if (
      this.billpatientIdentityInfo.mainradio == "form60" &&
      this.depositservice.isform60exists == false
    ) {
      this.messageDialogService.error("Please fill the form60 ");
    }

    console.log(callflag, this.modeOfPayment);
    if (callflag == this.modeOfPayment.length) {
      this.apiProcessing = true;
      console.log(this.modeOfPayment);
      this.duerequestbody();
      this.http
        .post(BillDetailsApiConstants.insertdueamount, this.duerequestbody())
        .subscribe((res) => {
          console.log(res);
          var data: any = {
            res: res,
            mop: this.modeOfPayment,
          };
          this.apiProcessing = false;
          let dialogref = this.messageDialogService.success(
            res[0].returnMessage
          );
          dialogref.afterClosed().subscribe(() => {
            this.dialogRef.close(data);
          });
        });
    }
  }

  duerequestbody() {
    this.insertdueamt = new insertDueAmountModel();
    this.insertdueamt.tab_rec = new tab_rec();
    this.insertdueamt.ds_paymode = new ds_paymode();
    this.insertdueamt.ds_paymode.tab_paymentList = [] as Array<tab_paymentList>;
    this.insertdueamt.ds_paymode.tab_cheque = [] as Array<tab_cheque>;
    this.insertdueamt.ds_paymode.tab_credit = [] as Array<tab_credit>;
    this.insertdueamt.ds_paymode.tab_dd = [] as Array<tab_dd>;
    this.insertdueamt.ds_paymode.tab_Online = [] as Array<tab_Online>;
    this.insertdueamt.ds_paymode.tab_Mobile = [] as Array<tab_Mobile>;
    this.insertdueamt.ds_paymode.tab_UPI = [] as Array<tab_UPI>;
    this.insertdueamt.ds_paymode.tab_debit = [] as Array<tab_debit>;

    this.insertdueamt.tab_rec.billid =
      this.billDetailService.patientbilldetaillist.billDetialsForRefund_Table1[0].opBillID;
    this.insertdueamt.tab_rec.billno =
      this.billDetailService.patientbilldetaillist.billDetialsForRefund_DepositRefundAmountDetail[0].billno;
    this.insertdueamt.tab_rec.collectedamt = Number(this.finalamount);
    this.insertdueamt.tab_rec.dueType =
      this.billDetailService.patientbilldetaillist.billDetialsForRefund_DepositRefundAmountDetail[0].billtype;
    this.insertdueamt.tab_rec.hsplocationid = Number(
      this.cookie.get("HSPLocationId")
    );
    this.insertdueamt.tab_rec.operatorid = Number(this.cookie.get("UserId"));
    this.insertdueamt.tab_rec.recnumber = "";
    this.insertdueamt.tab_rec.stationid = Number(this.cookie.get("StationId"));
    this.insertdueamt.hsplocationid = Number(this.cookie.get("HSPLocationId"));
    this.insertdueamt.operatorid = Number(this.cookie.get("UserId"));
    this.insertdueamt.stationid = Number(this.cookie.get("StationId"));
    this.modeOfPayment.forEach((item: any) => {
      var i = 1;
      this.insertdueamt.ds_paymode.tab_paymentList.push({
        slNo: i,
        modeOfPayment: item.mop,
        amount: item.amount,
        flag: item.flag,
      });
    });

    //Cheque
    if (this.chequeflag == 0) {
      this.insertdueamt.ds_paymode.tab_cheque = [] as Array<tab_cheque>;
    } else if (this.chequeflag == 2) {
      this.insertdueamt.ds_paymode.tab_cheque.push({
        chequeNo: this.dueform.controls["chequeno"].value,
        chequeDate: this.dueform.controls["chequeissuedate"].value,
        bankName: this.dueform.controls["chequebankname"].value.value,
        branchName: this.dueform.controls["chequebranchname"].value,
        city: "",
        flag: this.chequeflag,
      });
    }

    //Credit Card
    var credbank = this.creditcard.filter((i) => {
      return i.id == this.dueform.controls["creditbankname"].value.value;
    });
    console.log(credbank);
    if (credbank.length == 0) {
      credbank.push({
        id: 0,
        name: "",
      });
    }
    if (this.creditflag == 0) {
      this.insertdueamt.ds_paymode.tab_credit = [] as Array<tab_credit>;
    } else if (this.creditflag == 3) {
      this.insertdueamt.ds_paymode.tab_credit.push({
        ccNumber: this.dueform.controls["creditcardno"].value,
        cCvalidity: new Date(),
        cardType: this.dueform.controls["creditbankname"].value.value,
        approvalno: this.dueform.controls["creditapprovalno"].value,
        cType: 1,
        flag: this.creditflag,
        approvalcode: "",
        terminalID: this.dueform.controls["creditterminalid"].value,
        acquirer: this.dueform.controls["creditacquiringbank"].value,
        flagman: "1",
        cardholdername: this.dueform.controls["creditcardholdername"].value,
        bankname: credbank[0].name,
      });
    }

    //Demand Draft
    if (this.ddflag == 0) {
      this.insertdueamt.ds_paymode.tab_dd = [] as Array<tab_dd>;
    } else if (this.ddflag == 4) {
      this.insertdueamt.ds_paymode.tab_dd.push({
        ddNumber: this.dueform.controls["demandddno"].value,
        ddDate: this.dueform.controls["demandissuedate"].value,
        bankName: this.dueform.controls["demandbankname"].value.value,
        branchName: this.dueform.controls["demandbranchname"].value,
        flag: this.ddflag,
      });
    }

    //Online Payment
    if (this.onlineflag == 0) {
      this.insertdueamt.ds_paymode.tab_Online = [] as Array<tab_Online>;
    } else if (this.onlineflag == 5) {
      this.insertdueamt.ds_paymode.tab_Online.push({
        transactionId: this.dueform.controls["onlinetransacid"].value,
        bookingId: this.dueform.controls["onlinebookingid"].value,
        cardValidation: this.dueform.controls["onlinecardvalidate"].value,
        flag: this.onlineflag,
        onlineContact: this.dueform.controls["onlinecontact"].value,
      });
    }

    console.log(this.insertdueamt);
    return this.insertdueamt;
  }
  clear() {
    this._destroying$.next(undefined);
    this._destroying$.complete();
    this.dueform.reset();
  }
  onlinesearch() {
    console.log(typeof this.dueform.value.onlineamount);
    const onlinedialog = this.matdialog.open(
      OnlinePaymentPaidPatientComponent,
      {
        maxWidth: "90vw",
        height: "70vh",
        data: {
          maxid: this.billDetailService.activemaxid,
          status: "Y",
        },
      }
    );
    onlinedialog.afterClosed().subscribe((res) => {
      console.log(res);
      if (res) {
        this.dueform.controls["onlinetransacid"].setValue(res.transactionNo);
        this.dueform.controls["onlinebookingid"].setValue(res.bookingNo);
        this.dueform.controls["onlineamount"].setValue(
          res.bookingAmount.toFixed(2)
        );
        this.dueform.controls["onlinecontact"].setValue(res.mobile);
        this.dueform.controls["onlinecardvalidate"].setValue("yes");
      }
    });
  }

  onlineamtcheck() {
    if (Number(this.dueform.value.onlineamount) > 0) return true;
    else return false;
  }
  getdepositcashlimit() {
    this.http
      .get(
        ApiConstants.getcashlimitwithlocationsmsdetailsoflocation(
          this.hsplocationId
        )
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe((resultData: PatientDepositCashLimitLocationDetail) => {
        this.depositcashlimitationdetails = resultData.cashLimitOfLocation;
        console.log(resultData);
      });
  }

  getbankname() {
    this.http
      .get(BillDetailsApiConstants.getbankname)
      .pipe(takeUntil(this._destroying$))
      .subscribe((res) => {
        console.log(res);
        this.bankname = res;
        this.questions[7].options = this.bankname.map((l) => {
          return { title: l.name, value: l.name };
        });
        this.questions[7] = { ...this.questions[7] };
        this.questions[21].options = this.bankname.map((l) => {
          return { title: l.name, value: l.name };
        });
        this.questions[21] = { ...this.questions[21] };
      });
  }
  getcreditcard() {
    this.http
      .get(BillDetailsApiConstants.getcreditcard)
      .pipe(takeUntil(this._destroying$))
      .subscribe((res) => {
        console.log(res);
        this.creditcard = res;
        this.questions[12].options = this.creditcard.map((l) => {
          return { title: l.name, value: l.id };
        });
        this.questions[12] = { ...this.questions[12] };
      });
  }

  //GAV-1483 - pos selection on payment screen
  posimeiapi() {
    console.log(this.questions);
    this.http
      .get(billingconst.getPOSMachineMaster(this.hsplocationId, this.stationId))
      .subscribe((res: any) => {
        if (res && res.length > 0) {
          this.POSIMEIList = res;
          this.questions[29].options = this.POSIMEIList.map((l: any) => {
            return {
              title: l.merchantStorePosCode + "-" + l.name,
              value: l.name,
            };
          });
          this.dueform.controls["posimei"].valueChanges
            .pipe(takeUntil(this._destroying$))
            .subscribe((value: any) => {
              this.posimeivaluechange(value);
            });
          if (
            this.cookie.get("MerchantPOSCode") &&
            this.cookie.get("MAXMachineName")
          ) {
            this.dueform.controls["posimei"].setValue(
              this.cookie.get("MAXMachineName")
            );
          } else if (this.POSIMEIList.length == 1) {
            this.dueform.controls["posimei"].setValue(this.POSIMEIList[0].name);
          }
        }
      });
  }

  //GAV-1483 - pos selection on payment screen
  posimeivaluechange(value: any) {
    if (value) {
      this.POSMachineDetal = this.POSIMEIList.filter(
        (s: any) => s.name === value
      )[0];

      this.cookie.delete("POSIMEI", "/");
      this.cookie.set("POSIMEI", this.POSMachineDetal.hardwareID, {
        path: "/",
      });
      this.cookie.delete("MachineName", "/");
      this.cookie.set("MachineName", this.POSMachineDetal.edcMachineName, {
        path: "/",
      });
      this.cookie.delete("MAXMachineName", "/");
      this.cookie.set("MAXMachineName", this.POSMachineDetal.name, {
        path: "/",
      });
      this.cookie.delete("MAXMachineId", "/");
      this.cookie.set("MAXMachineId", this.POSMachineDetal.id, {
        path: "/",
      });
      this.cookie.delete("MerchantId", "/");
      this.cookie.set("MerchantId", this.POSMachineDetal.merchantID, {
        path: "/",
      });
      this.cookie.delete("MerchantPOSCode", "/");
      this.cookie.set(
        "MerchantPOSCode",
        this.POSMachineDetal.merchantStorePosCode,
        {
          path: "/",
        }
      );
      this.cookie.delete("SecurityToken", "/");
      this.cookie.set("SecurityToken", this.POSMachineDetal.securityToken, {
        path: "/",
      });
      this.cookie.delete("PineLabApiUrl", "/");
      this.cookie.set("PineLabApiUrl", this.POSMachineDetal.apiUrlPineLab, {
        path: "/",
      });
      this.cookie.delete("UPIAllowedPaymentMode", "/");
      this.cookie.set(
        "UPIAllowedPaymentMode",
        this.POSMachineDetal.upI_AllowedPaymentMode,
        {
          path: "/",
        }
      );
    }
  }
  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

  formsixtysubmit: boolean = false;
  billingformsixtysuccess(event: any) {
    console.log(event);
    this.formsixtysubmit = event;
  }

  formvalidate() {
    let price = form.amount;
    let flag: boolean = false;
    price.forEach((e: any) => {
      console.log(parseFloat(this.dueform.controls[e].value));
      if (parseFloat(this.dueform.controls[e].value) > 0) {
        let controls: any = form.form[e];
        console.log(form[controls]);
        form[controls].forEach((i: any) => {
          if (!this.dueform.controls[i].valid) {
            flag = true;
          } else {
            flag = false;
          }
        });
        return;
      }
    });
    if (flag) return true;
    else return false;
  }
}

export const form: any = {
  form: {
    cashamount: "cashform",
    chequeamount: "chequeform",
    creditamount: "creditform",
    demandamount: "demandform",
    onlineamount: "onlineform",
  },
  cashform: ["cashamount"],
  chequeform: [
    "chequeamount",
    "chequeno",
    "chequeissuedate",
    "chequevalidity",
    "chequebankname",
    "chequebranchname",
  ],
  creditform: [
    "creditamount",
    "creditcardno",
    "creditcardholdername",
    "creditbankname",
    "creditbatchno",
    "creditapprovalno",
    "creditterminalid",
    "creditacquiringbank",
    "posimei",
    "transactionid",
    "creditvalidity",
    "banktid",
  ],
  demandform: [
    "demandamount",
    "demandddno",
    "demandissuedate",
    "demandvalidity",
    "demandbankname",
    "demandbranchname",
  ],
  onlineform: [
    "onlineamount",
    "onlinetransacid",
    "onlinebookingid",
    "onlinecardvalidate",
    "onlinecontact",
  ],
  amount: [
    "cashamount",
    "chequeamount",
    "creditamount",
    "demandamount",
    "onlineamount",
  ],
};
