import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { QuestionControlService } from '@shared/ui/dynamic-forms/service/question-control.service';

@Component({
  selector: 'patient-identity-info',
  templateUrl: './patient-identity-info.component.html',
  styleUrls: ['./patient-identity-info.component.scss']
})
export class PatientIdentityInfoComponent implements OnInit {

  patientidentityformData = {
    title: "",
    type: "object",
    properties: {
      mobielno: {
        type: "number",
        readonly: "true"
      },
      mail: {
        type: "string",
        readonly: "true"
      },      
      panno: {
        type: "string"
      },     
      mainradio: {
        type: "radio",
        required: false,
        options: [
          { title: "Form 60", value: "form60" },
          { title: "Pan card No.", value: "pancardno" },
        ]
      }
    },
  }
  patientidentityform!: FormGroup;
  questions: any;

  constructor( private formService: QuestionControlService, @Inject(MAT_DIALOG_DATA) private data: any, 
  private matdialog: MatDialog) {
   }


  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.patientidentityformData.properties,
      {}
    );
    this.patientidentityform = formResult.form;
    this.questions = formResult.questions;
  }

}
