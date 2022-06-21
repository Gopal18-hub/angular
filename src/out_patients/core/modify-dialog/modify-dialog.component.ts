import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { QuestionControlService } from '../../../shared/ui/dynamic-forms/service/question-control.service';
//import { CookieService } from 'src/shared/services/cookie.service';
// import { HttpService } from 'src/shared/services/http.service';
// import { MergeDialogComponent } from '../../dup-reg-merging/merge-dialog/merge-dialog.component';
// import { MessageDialogService } from '../../../../../shared/ui/message-dialog/message-dialog.service';

@Component({
  selector: 'out-patients-modify-dialog',
  templateUrl: './modify-dialog.component.html',
  styleUrls: ['./modify-dialog.component.scss']
})
export class ModifyDialogComponent implements OnInit {
 
  questions: any;
  OPUpdateForm!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data : any,
    private dialogRef: MatDialogRef<ModifyDialogComponent>,
    private formService: QuestionControlService,
    public matDialog: MatDialog,
    // private cookie:CookieService,
   ) { }
   
  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.updateregistrationFormData.properties,
      {}

    );
    this.OPUpdateForm = formResult.form;
    this.questions = formResult.questions;
}

   updateregistrationFormData = {
    title: "",
    type: "object",
    properties: {
      firstName: {
        type: "string",
        title: "First Name",
        required: true,
      },
      modifiedfirstName: {
        type: "string",
        title: "First Name",
        required: true,
      },
      middleName: {
        type: "string",
        title: "Middle Name",
        required: true,
      },
      
      modifiedmiddleName: {
        type: "string",
        title: "Middle Name",
        required: true,
      },
      lastName: {
        type: "string",
        title: "Last Name",
        required: true,
      },
    
      modifiedlastName: {
        type: "string",
        title: "Last Name",
        required: true,
      },
      gender: {
        type: "string",
        title: "Gender",
        required: true,
      },
    
      modifiedgender: {
        type: "string",
        title: "Gender",
        required: true,
      },
      email: {
        type: "email",
        title: "Email id",
        required: true,
      },
    
      modifiedemail: {
        type: "email",
        title: "Email id",
        required: true,
      },
      mobileNumber: {
        type: "number",
        title: "Mobile Number",
        required: true,
      },
      modifiedMobileNumber: {
        type: "number",
        title: "Mobile Number",
        required: true,
      },
      nationality: {
        type: "number",
        title: "Nationality",
        required: true,
      },
       modifiedNationality: {
        type: "number",
        title: "Nationality",
        required: true,
      },
     
    }}


}
