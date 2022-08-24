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
    private billDetailService: billDetailService
  ) {}

  BDetailFormData = {
    type: "object",
    title: "",
    properties: {
      billAmt: {
        type: "string",
        required: false,
        defaultValue: '0.0',
        readonly: true,
      },
      dipositrAmt: {
        type: "string",
        required: false,
        defaultValue: '0.0',
        readonly: true,
      },
      discAmt: {
        type: "string",
        required: false,
        defaultValue: '0.0',
        readonly: true,
      },
      prePaidAMt: {
        type: "string",
        required: false,
        defaultValue: '0.0',
        readonly: true,
      },
      plandic: {
        type: "string",
        required: false,
        readonly: true,
        defaultValue: '0.0',
      },
      planamt: {
        type: "string",
        required: false,
        readonly: true,
        defaultValue: '0.0',
      },
      patienDue: {
        type: "string",
        required: false,
        readonly: true,
        defaultValue: '0.0',
      },
      companyDue: {
        type: "string",
        required: false,
        readonly: true,
        defaultValue: '0.0',
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
  ngOnInit(): void {
    let serviceFormResult = this.formService.createForm(
      this.BDetailFormData.properties,
      {}
    );

    this.BServiceForm = serviceFormResult.form;
    this.questions = serviceFormResult.questions;
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
    this.BServiceForm.controls["billAmt"].setValue(this.billDetailService.patientbilldetaillist.billDetialsForRefund_DepositRefundAmountDetail[0].billamount);
    this.BServiceForm.controls["dipositrAmt"].setValue(this.billDetailService.patientbilldetaillist.billDetialsForRefund_DepositRefundAmountDetail[0].depositamount);
    this.BServiceForm.controls["discAmt"].setValue(this.billDetailService.patientbilldetaillist.billDetialsForRefund_DepositRefundAmountDetail[0].discountamount);
    this.BServiceForm.controls["prePaidAMt"].setValue(this.billDetailService.patientbilldetaillist.billDetialsForRefund_DepositRefundAmountDetail[0].collectedamount);
    this.BServiceForm.controls["companyDue"].setValue(this.billDetailService.patientbilldetaillist.billDetialsForRefund_DepositRefundAmountDetail[0].companyPaidAmt);
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
      this.makereceiptbtn = false;
      this.printreceiptbtn = false;
    }
    else if(this.BServiceForm.controls["patienDue"].value > 0 && this.BServiceForm.controls["companyDue"].value == 0)
    {
      this.BServiceForm.controls["paymentMode"].setValue('patientDue');
      this.BServiceForm.controls["paymentMode"].disable();
      this.makereceiptbtn = false;
      this.printreceiptbtn = false;
    }
  }
  makereceipt() {
    const RefundDialog =   this.matDialog.open(PaymentDialogComponent, {
        width: "70vw",
        height: "98vh",
        data: {       
          // patientinfo: {
          //   emailId: this.patientpersonaldetails[0]?.pEMail, 
          //   mobileno: this.patientpersonaldetails[0]?.pcellno,
          // },
          // clickedrowdepositdetails : this.patientRefundDetails
        }
      });
  
      RefundDialog.afterClosed()
      .pipe(takeUntil(this._destroying$))
      .subscribe((result) => {
        //if(result == "Success"){        
          console.log("Refund Dialog closed");
        //}    
      });
    }
}
