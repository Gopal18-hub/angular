import { Component, Inject, EventEmitter,Input,Output, OnInit, ViewChild, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { QuestionControlService } from '@shared/ui/dynamic-forms/service/question-control.service';
import { FormSixtyComponent } from '../form60/form-sixty.component';
import { DepositService } from '@core/services/deposit.service';
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";

@Component({
  selector: 'patient-identity-info',
  templateUrl: './patient-identity-info.component.html',
  styleUrls: ['./patient-identity-info.component.scss']
})
export class PatientIdentityInfoComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() data!: any;
  @Input() patientclearsibilingcomponent : boolean = false;
  
  patientidentityformData = {
    title: "",
    type: "object",
    properties: {
      mobileno: {
        type: "number",
        readonly: "true"
      },
      email: {
        type: "string",
        readonly: "true"
      },      
      panno: {
        type: "string",
        pattern:"^[A-Za-z]{5}[0-9]{4}[A-Za-z]$"
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
  DepositPaymentMethod: { transactionamount : number, MOP: string}[] =[];

  constructor( private formService: QuestionControlService,  private depositservice: DepositService, private messageDialogService: MessageDialogService,
  private matdialog: MatDialog) {
   }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes['patientclearsibilingcomponent'].currentValue)
    {
      this.patientidentityform.controls["panno"].setValue("");
    }
  }


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
    }
    this.patientidentityform.controls["panno"].setValue(this.data.patientinfo.panno);
    this.patientidentityform.controls["mobileno"].setValue(this.data.patientinfo.mobileno);
    this.patientidentityform.controls["email"].setValue(this.data.patientinfo.emailId);
    this.form60PatientInfo = this.data.patientinfo;    
  }

  ngAfterViewInit(): void
  {
    this.DepositPaymentMethod = this.depositservice.getFormLsit();   
    this.patientidentityform.controls["mainradio"].valueChanges.subscribe((value:any)=>{
      if(value == "form60")
      {
        // if(this.DepositPaymentMethod[0].transactionamount == 0){
        //     this.messageDialogService.error("Amount Zero is not Allowed");
        // }
        // else
        {
          this.matdialog.open(FormSixtyComponent, {width: "50vw", height: "98vh", 
          data: {from60data:this.form60PatientInfo,
                paymentamount: this.DepositPaymentMethod[0]
              }
            });
          this.patientidentityform.controls["panno"].disable();
          this.patientidentityform.controls["panno"].setValue('');
        }      
      }
      else{
        this.patientidentityform.controls["panno"].enable();
      }
    });
  }


}
