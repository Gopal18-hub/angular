import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { QuestionControlService } from "../../../../../../shared/ui/dynamic-forms/service/question-control.service";
import { FormSixtyComponent } from '@core/UI/billing/submodules/form60/form-sixty.component';
// import { FormSixtyComponent } from '../../../../../core/UI/billing/submodules/form60/form-sixty.component';
@Component({
  selector: 'out-patients-refund-dialog',
  templateUrl: './refund-dialog.component.html',
  styleUrls: ['./refund-dialog.component.scss']
})
export class RefundDialogComponent implements OnInit {

  refundFormData = {
    title: "",
    type: "object",
    properties: {         
       payable_name: {
         type: "string",
       },
       remarks: {
         type: "textarea",
       },
       avalaibleamount: {
         type: "number"
       },
       
      refunddeposit: {
        type: "string",
      },
       cardvalidate: {
        type: "radio",
        required: false,
        options: [
          { title: "Yes", value: "yes" },
          { title: "No", value: "no" }
        ],
        defaultValue: "yes"
      },     
      otpmobile: {
        type: "number"
      },
      mobielno: {
        type: "number",
        readonly: "true"
      }, 
      text:{
        type: "string",
      }
    },
  };
  refundform!: FormGroup;
  questions: any;
  onRefundReceiptpage:boolean=true;
  paymentform!: FormGroup;
  today: any;
  patientIdentityInfo:any=[];
  config = {
    paymentmethod: {
      cash: true,
      cheque: true
    },
    combopayment: false
  }
  constructor( private formService: QuestionControlService, @Inject(MAT_DIALOG_DATA) private data: any, 
  private matdialog: MatDialog) {
   }

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.refundFormData.properties,
      {}
    );
    this.refundform = formResult.form;
    this.questions = formResult.questions;
    console.log(this.data);
    this.today = new Date();
    this.patientIdentityInfo = this.data.patientinfo;
    console.log('inside refund page');
  }
  ngAfterViewInit(): void{
    this.refundform.controls["mainradio"].valueChanges.subscribe((value:any)=>{
      if(value == "form60")
      {
        this.matdialog.open(FormSixtyComponent, {width: "50vw", height: "98vh"});
        this.refundform.controls["panno"].disable();
      }
      else{
        this.refundform.controls["panno"].enable();
      }
    })
    this.paymentform.controls["amount"].valueChanges.subscribe(
      (res:any)=>{
      if(res > 200000)
      {
        console.log("200000");
        this.refundform.controls["panno"].enable();
        this.refundform.controls["mainradio"].enable();
      }
      else{
        this.refundform.controls["panno"].disable();
        this.refundform.controls["mainradio"].disable();
        this.refundform.controls["mainradio"].reset();
      }
    });
  }
  paymentformevent(event:any){
    console.log(event);
    this.paymentform = event;
  }
  clear()
  {
    this.paymentform.reset();
    this.paymentform.controls["chequeissuedate"].setValue(this.today);
    this.paymentform.controls["demandissuedate"].setValue(this.today);
    this.refundform.controls["mobielno"].setValue(this.data.Mobile);
    this.refundform.controls["mail"].setValue(this.data.Mail);
  }
}
