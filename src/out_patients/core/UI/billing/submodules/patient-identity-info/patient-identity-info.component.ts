import { Component, Inject, EventEmitter,Input,Output, OnInit, ViewChild, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { QuestionControlService } from '@shared/ui/dynamic-forms/service/question-control.service';
import { FormSixtyComponent } from '../form60/form-sixty.component';
import { DepositService } from '@core/services/deposit.service';
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { BillingService } from '@modules/billing/submodules/billing/billing.service';

@Component({
  selector: 'patient-identity-info',
  templateUrl: './patient-identity-info.component.html',
  styleUrls: ['./patient-identity-info.component.scss']
})
export class PatientIdentityInfoComponent implements OnInit, AfterViewInit {
  @Input() data!: any;
  @Output() neweventform60ssave = new EventEmitter<boolean>();
  @Input() form60payment! :any;
  
  patientidentityformData = {
    title: "",
    type: "object",
    properties: {
      mobileno: {
        type: "number",
        readonly: "true",
        requied:"true",
      },
      email: {
        type: "string",
        readonly: "true",
        requied:"true",
      },      
      panno: {
        type: "string",
        pattern:"^[A-Za-z]{5}[0-9]{4}[A-Za-z]$",
        title: "Pan card No",
      },     
      mainradio: {
        type: "radio",
        required: false,
        options: [
          { title: "Form 60", value: "form60" },
          { title: "Pan card No.", value: "pancardno" },
        ],
        defaultValue: "pancardno",
      }
    },
  }
  patientidentityform!: FormGroup;
  questions: any;
  form60PatientInfo:any=[];
  PaymentMethod: { transactionamount : number, MOP: string}[] =[];
  Form60success:boolean = false;

  constructor( private formService: QuestionControlService,  private depositservice: DepositService, private messageDialogService: MessageDialogService,
    private billingservice: BillingService,
  private matdialog: MatDialog) {
   }

  private readonly _destroying$ = new Subject<void>();
  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.patientidentityformData.properties,
      {}
    );
    this.patientidentityform = formResult.form;
    this.questions = formResult.questions;
    if(this.data.type == "Deposit"){
      this.patientidentityform.controls["mainradio"].enable();
      this.patientidentityform.controls["panno"].enable();
    }else if(this.data.type == "Refund"){
      this.patientidentityform.controls["mainradio"].disable();
      this.patientidentityform.controls["panno"].disable();      
    this.patientidentityform.controls["panno"].setValue(this.data.patientinfo.panno);
    }
    this.patientidentityform.controls["mobileno"].setValue(this.data.patientinfo.mobileno);
    if(this.data.patientinfo.emailId){
       this.patientidentityform.controls["email"].setValue(this.data.patientinfo.emailId);
    }
    else{
       this.patientidentityform.controls["email"].setValue("info@maxhealthcare.com");
    }  
    
    //iacode and registartion no is required
    this.form60PatientInfo = this.data.patientinfo;   

    this.depositservice.clearAllItems.subscribe((clearItems) => {
      if (clearItems) {
      this.patientidentityform.controls["panno"].setValue("");
      this.patientidentityform.controls["mainradio"].setValue("pancardno");
      }
    });

    this.billingservice.pancardpaymentmethod.subscribe((setfocus) => {
      if(setfocus){
        this.questions[2].elementRef.focus();
      }
    });

    this.billingservice.clearAllItems.subscribe((clearItems: any) => {
      if (clearItems) {
        this.data = [];
        this.patientidentityform.controls["panno"].setValue("");
        this.patientidentityform.controls["mainradio"].setValue("pancardno");
      }
    });
    }

  ngAfterViewInit(): void
  {
  
    this.patientidentityform.controls["mainradio"].valueChanges.subscribe((value:any)=>{
      if(value == "form60")
      { 
        let tobepaidby: number = 0, paymentmode:string = "" ;
        if(this.data.patientinfo.screenname == "Billing" && this.form60payment){          
            this.form60payment.tabs.forEach((payment: any) => {
              if (Number(this.form60payment.paymentForm[payment.key].value.price) > 0) {              
              tobepaidby += Number(this.form60payment.paymentForm[payment.key].value.price);
              paymentmode = paymentmode + " ," + this.form60payment.paymentForm[payment.key].value.modeOfPayment
            }
            });
            this.PaymentMethod = [{
              transactionamount : tobepaidby ,
              MOP : paymentmode
            }];          
        }
        else if(this.data.type == "Deposit"){          
        this.PaymentMethod = this.depositservice.data;  
        }
        else{

        }       
    
         const form60dialog = this.matdialog.open(FormSixtyComponent, {width: "50vw", height: "94vh", 
          data: {from60data:this.form60PatientInfo,
                paymentamount: this.PaymentMethod[0]
              }
            });

            form60dialog.afterClosed()
            .pipe(takeUntil(this._destroying$))
            .subscribe((result) => {
              if(result == "Success"){
                this.Form60success = true;
                this.neweventform60ssave.emit(this.Form60success);
              }else{
                this.patientidentityform.controls["mainradio"].setValue("pancardno");
              }
            });

          this.patientidentityform.controls["panno"].disable();
          this.patientidentityform.controls["panno"].setValue('');
          
      }
      else{
        this.patientidentityform.controls["panno"].enable();
      }
    });
  }


}
