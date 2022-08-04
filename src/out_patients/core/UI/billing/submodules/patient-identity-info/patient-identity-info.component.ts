import { Component, Inject, EventEmitter,Input,Output, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { QuestionControlService } from '@shared/ui/dynamic-forms/service/question-control.service';
import { FormSixtyComponent } from '../form60/form-sixty.component';

@Component({
  selector: 'patient-identity-info',
  templateUrl: './patient-identity-info.component.html',
  styleUrls: ['./patient-identity-info.component.scss']
})
export class PatientIdentityInfoComponent implements OnInit, AfterViewInit {
  @Input() data!: any;
  @Input() clearsibilingcomponent : boolean = false;
  
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

  constructor( private formService: QuestionControlService, 
  private matdialog: MatDialog) {
   }


  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.patientidentityformData.properties,
      {}
    );
    this.patientidentityform = formResult.form;
    this.questions = formResult.questions;

    if(this.clearsibilingcomponent){
       this.patientidentityform.reset();
    }else{
      this.patientidentityform.controls["panno"].setValue(this.data.panno);
      this.patientidentityform.controls["mobileno"].setValue(this.data.mobileno);
      this.patientidentityform.controls["email"].setValue(this.data.emailId);
      this.form60PatientInfo = this.data;
    }  
  }

  ngAfterViewInit(): void
  {
    this.patientidentityform.controls["mainradio"].valueChanges.subscribe((value:any)=>{
      if(value == "form60")
      {
        this.matdialog.open(FormSixtyComponent, {width: "50vw", height: "98vh", data: {from60data:this.form60PatientInfo}});
        this.patientidentityform.controls["panno"].disable();
      }
      else{
        this.patientidentityform.controls["panno"].enable();
      }
    });
  }


}
