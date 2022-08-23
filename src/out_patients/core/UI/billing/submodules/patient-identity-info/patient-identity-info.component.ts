import { Component, Inject, EventEmitter,Input,Output, OnInit, ViewChild, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { QuestionControlService } from '@shared/ui/dynamic-forms/service/question-control.service';
import { FormSixtyComponent } from '../form60/form-sixty.component';
import { DepositService } from '@core/services/deposit.service';
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: 'patient-identity-info',
  templateUrl: './patient-identity-info.component.html',
  styleUrls: ['./patient-identity-info.component.scss']
})
export class PatientIdentityInfoComponent implements OnInit, AfterViewInit {
  @Input() data!: any;
  @Output() neweventform60ssave = new EventEmitter<boolean>();
  
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
  Form60success:boolean = false;

  constructor( private formService: QuestionControlService,  private depositservice: DepositService, private messageDialogService: MessageDialogService,
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
    this.patientidentityform.controls["email"].setValue(this.data.patientinfo.emailId);
    this.form60PatientInfo = this.data.patientinfo;   

    this.depositservice.clearAllItems.subscribe((clearItems) => {
      if (clearItems) {
      this.patientidentityform.controls["panno"].setValue("");
      }
    });
  }

  ngAfterViewInit(): void
  {
    this.DepositPaymentMethod = this.depositservice.getFormLsit();   
    this.patientidentityform.controls["mainradio"].valueChanges.subscribe((value:any)=>{
      if(value == "form60")
      {       
        {
         const form60dialog = this.matdialog.open(FormSixtyComponent, {width: "50vw", height: "98vh", 
          data: {from60data:this.form60PatientInfo,
                paymentamount: this.DepositPaymentMethod[0]
              }
            });

            form60dialog.afterClosed()
            .pipe(takeUntil(this._destroying$))
            .subscribe((result) => {
              if(result == "Success"){
                this.Form60success = true;
                this.neweventform60ssave.emit(this.Form60success);
                console.log("Form 60 successfull");
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
