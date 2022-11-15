import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { CookieService } from "@shared/services/cookie.service";
import { HttpService } from "@shared/services/http.service";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";

import { Subject, takeUntil } from "rxjs";
import { GstComponent } from "../../miscellaneous-billing/billing/gst/gst.component";
import { billDetailService } from "../billDetails.service";
import { PaymentDialogComponent } from './../payment-dialog/payment-dialog.component';
import { ReportService } from "@shared/services/report.service";
import { getduereceiptnumber } from '../../../../../core/types/billdetails/getDueReceiptNumber.Interface';
import { BillDetailsApiConstants } from "../BillDetailsApiConstants";
import { PrintduereceiptComponent } from "../printduereceipt/printduereceipt.component";
@Component({
  selector: "part-cred-bill-settlement",
  templateUrl: "./part-cred-bill-settlement.component.html",
  styleUrls: ["./part-cred-bill-settlement.component.scss"],
})
export class PartialCredBillComponent implements OnInit {
  constructor(
    public matDialog: MatDialog,
    private formService: QuestionControlService,
    private router: Router,
    private http: HttpService,
    private cookie: CookieService,
    public billDetailService: billDetailService,
    private reportService:ReportService
  ) {}

  BDetailFormData = {
    type: "object",
    title: "",
    properties: {
      billAmt: {
        type: "string",
        required: false,
        defaultValue: '0.00',
        readonly: true,
      },
      dipositrAmt: {
        type: "string",
        required: false,
        defaultValue: '0.00',
        readonly: true,
      },
      discAmt: {
        type: "string",
        required: false,
        defaultValue: '0.00',
        readonly: true,
      },
      prePaidAMt: {
        type: "string",
        required: false,
        defaultValue: '0.00',
        readonly: true,
      },
      plandic: {
        type: "string",
        required: false,
        readonly: true,
        defaultValue: '0.00',
      },
      planamt: {
        type: "string",
        required: false,
        readonly: true,
        defaultValue: '0.00',
      },
      patienDue: {
        type: "string",
        required: false,
        readonly: true,
        defaultValue: '0.00',
      },
      companyDue: {
        type: "string",
        required: false,
        readonly: true,
        defaultValue: '0.00',
      },
      paymentMode: {
        type: "radio",
        options: [
          {
            title: "Patient Due",
            value: "patientDue",
          },
          {
            title: "Company Due",
            value: "companyDue",
          },
        ],
        defaultValue: "patientDue",
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
      "ItemName",
      "BilledAmount",
      "DiscAmount",
      "Refund",
    ],
    columnsInfo: {
      Sno: {
        title: "S.No.",
        type: "string",
      },
      ServiceType: {
        title: "Service Name",
        type: "string",
      },
      ItemName: {
        title: "Item Name",
        type: "string",
      },
      BilledAmount: {
        title: "Billed Amount",
        type: "string",
      },

      DiscAmount: {
        title: "Discount Amount",
        type: "string",
      },
      Refund: {
        title: "Refund",
        type: "string",
      },
    },
  };

  serviceselectedList: [] = [] as any;

  BServiceForm!: FormGroup;

  questions: any;
  private readonly _destroying$ = new Subject<void>();
  makereceiptbtn: boolean = true;
  printreceiptbtn: boolean = true;
  flagfordue: any;
  receiptnumberList: getduereceiptnumber [] = [];
  ngOnInit(): void {
    let serviceFormResult = this.formService.createForm(
      this.BDetailFormData.properties,
      {}
    );

    this.BServiceForm = serviceFormResult.form;
    this.questions = serviceFormResult.questions;
    this.getreceiptnumber();
    console.log(this.billDetailService.patientbilldetaillist.billDetialsForRefund_Table0[0].uhid);
    if(this.billDetailService.patientbilldetaillist.billDetialsForRefund_Table0[0].uhid != null ||
       this.billDetailService.patientbilldetaillist.billDetialsForRefund_Table0[0].uhid != undefined ||
       this.billDetailService.patientbilldetaillist.billDetialsForRefund_Table0[0].uhid != '')
       {
         this.fillform();
       }
    
  }
  fillform()
  {
    this.BServiceForm.controls["billAmt"].setValue(this.billDetailService.patientbilldetaillist.billDetialsForRefund_DepositRefundAmountDetail[0].billamount.toFixed(2));
    this.BServiceForm.controls["dipositrAmt"].setValue(this.billDetailService.patientbilldetaillist.billDetialsForRefund_DepositRefundAmountDetail[0].depositamount.toFixed(2));
    this.BServiceForm.controls["discAmt"].setValue(this.billDetailService.patientbilldetaillist.billDetialsForRefund_DepositRefundAmountDetail[0].discountamount.toFixed(2));
    this.BServiceForm.controls["prePaidAMt"].setValue(this.billDetailService.patientbilldetaillist.billDetialsForRefund_DepositRefundAmountDetail[0].collectedamount.toFixed(2));
    if(this.billDetailService.patientbilldetaillist.billDetialsForRefund_DepositRefundAmountDetail[0].billtype == 3)
    {
      this.makereceiptbtn = true;
      this.BServiceForm.controls["companyDue"].setValue(this.billDetailService.patientbilldetaillist.billDetialsForRefund_DepositRefundAmountDetail[0].balance.toFixed(2));
    }
    else
    {
      this.BServiceForm.controls["patienDue"].setValue(this.billDetailService.patientbilldetaillist.billDetialsForRefund_DepositRefundAmountDetail[0].balance.toFixed(2));
    }
    // this.BServiceForm.controls["refundAmt"].setValue(this.billDetailService.patientbilldetaillist.billDetialsForRefund_RequestNoGeivePaymentModeRefund[0].refundAmt);
    console.log(this.BServiceForm.controls["prePaidAMt"].value, this.BServiceForm.controls["companyDue"].value)
    if(this.BServiceForm.controls["patienDue"].value == 0 && this.BServiceForm.controls["companyDue"].value == 0)
    {
      this.makereceiptbtn = true;
      this.printreceiptbtn = true;
    }
    else if(this.BServiceForm.controls["patienDue"].value == 0 && this.BServiceForm.controls["companyDue"].value > 0)
    {
      this.BServiceForm.controls["paymentMode"].setValue('companyDue');
      this.BServiceForm.controls["paymentMode"].disable();
      this.makereceiptbtn = true;
      this.flagfordue = this.BServiceForm.controls["paymentMode"].value;
    }
    else if(this.BServiceForm.controls["patienDue"].value > 0 && this.BServiceForm.controls["companyDue"].value == 0)
    {
      this.BServiceForm.controls["paymentMode"].setValue('patientDue');
      this.BServiceForm.controls["paymentMode"].disable();
      this.makereceiptbtn = false;
      this.flagfordue = this.BServiceForm.controls["paymentMode"].value;
    }
  }
  receiptno: any;
  makereceipt() {
    const RefundDialog = this.matDialog.open(PaymentDialogComponent, {
        width: "80vw",
        height: "98vh",
        data: {   
          flag: this.flagfordue,    
          patientinfo: {
            emailId: this.billDetailService.patientbilldetaillist.billDetialsForRefund_Table0[0].emailId, 
            mobileno: this.billDetailService.patientbilldetaillist.billDetialsForRefund_Table0[0].pcellno,
          }, 
          // clickedrowdepositdetails : this.patientRefundDetails
        }
      });
  
      RefundDialog.afterClosed()
      .pipe(takeUntil(this._destroying$))
      .subscribe((result) => {
        if(result){  
          this.getreceiptnumber();     
          console.log("Refund Dialog closed");
          console.log(result);
          this.router.navigate(
            ["out-patient-billing/details", "services"],
            { queryParams: {billno: this.billDetailService.activeBillNo}});
        }    
      });
    }

  getreceiptnumber()
  {
    var billno = this.billDetailService.patientbilldetaillist.billDetialsForRefund_DepositRefundAmountDetail[0].billno;
    this.http.get(BillDetailsApiConstants.getduereceiptnumber(billno))
    .pipe(takeUntil(this._destroying$))
    .subscribe((res) => {
      console.log(res);
      this.receiptnumberList = res;
      if(res.length > 0)
      {
        this.receiptno = res[res.length - 1].recNumber;
        this.printreceiptbtn = false;
      }
    })
  }
  printreceipt()
  {
    // this.openReportModal('DueReceiptReport');
    this.matDialog.open(PrintduereceiptComponent, {
      width: "30vw",
      height: "30vh"
    })
  }
  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
