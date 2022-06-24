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
    @Inject(MAT_DIALOG_DATA) public data : {patientDetails:any,modifiedDetails:any},
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

updateregistrationFormData= {
      title: "",
      type: "object",
      properties: {     
        firstName: {
          type: "string",
          title: "First Name",
          defaultValue: this.data.patientDetails.firstname,
          required: true,
          readonly: true,
        },
       
        modifiedfirstName: {
          type: "string",
          title: "First Name",
          defaultValue: this.data.modifiedDetails.firstname,
          required: true,
          readonly: true,
        },
        middleName: {
          type: "string",
          title: "Middle Name",
          defaultValue: this.data.patientDetails.middleName,
          required: true,
          readonly: true,
        },

        modifiedmiddleName: {
          type: "string",
          title: "Middle Name",
          defaultValue: this.data.modifiedDetails.middleName,
          required: true,
          readonly: true,
        },
        lastName: {
          type: "string",
          title: "Last Name",
          defaultValue: this.data.patientDetails.lastName,
          required: true,
          readonly: true,
        },

        modifiedlastName: {
          type: "string",
          title: "Last Name",
          defaultValue: this.data.modifiedDetails.lastName,
          required: true,
          readonly: true,
        },
        gender: {
          type: "string",
          title: "Gender",
          defaultValue: this.data.patientDetails.sexName,
          required: true,
          readonly: true,
        },

        modifiedgender: {
          type: "string",
          title: "Gender",
          defaultValue: this.data.modifiedDetails.title,
          required: true,
          readonly: true,
        },
        email: {
          type: "email",
          title: "Email id",
          defaultValue: this.data.patientDetails.pemail,
          required: true,
          readonly: true,
        },

        modifiedemail: {
          type: "email",
          title: "Email id",
          defaultValue: this.data.modifiedDetails.pemail,
          required: true,
          readonly: true,
        },
        mobileNumber: {
          type: "number",
          title: "Mobile Number",
          defaultValue: this.data.patientDetails.pphone,
          required: true,
          readonly: true,
        },
        modifiedMobileNumber: {
          type: "number",
          title: "Mobile Number",
          defaultValue: this.data.modifiedDetails.pphone,
          required: true,
          readonly: true,
        },
        nationality: {
          type: "string",
          title: "Nationality",
          defaultValue: this.data.patientDetails.nationalityName,
          required: true,
          readonly: true,
        },
        modifiedNationality: {
          type: "string",
          title: "Nationality",
          defaultValue: this.data.modifiedDetails.nationality,
          required: true,
          readonly: true,
        },
        foreigner: {
          type: "checkbox",
          options: [{ title: "Foreigner" }],
          defaultValue: this.data.patientDetails.foreigner,
          readonly: true,
        },
        modifiedForeigner: {
          type: "checkbox",
          options: [{ title: "Foreigner" }],
          defaultValue: this.data.modifiedDetails.foreigner,
          readonly: true,
        },
       }
      }
      
    

  //  updateregistrationFormData = {
  //   title: "",
  //   type: "object",
  //   properties: {
  //     firstName: {
  //       type: "string",
  //       title: "First Name",
  //       required: true,
  //     },
  //     modifiedfirstName: {
  //       type: "string",
  //       title: "First Name",
  //       required: true,
  //     },
  //     middleName: {
  //       type: "string",
  //       title: "Middle Name",
  //       required: true,
  //     },
      
  //     modifiedmiddleName: {
  //       type: "string",
  //       title: "Middle Name",
  //       required: true,
  //     },
  //     lastName: {
  //       type: "string",
  //       title: "Last Name",
  //       required: true,
  //     },
    
  //     modifiedlastName: {
  //       type: "string",
  //       title: "Last Name",
  //       required: true,
  //     },
  //     gender: {
  //       type: "string",
  //       title: "Gender",
  //       required: true,
  //     },
    
  //     modifiedgender: {
  //       type: "string",
  //       title: "Gender",
  //       required: true,
  //     },
  //     email: {
  //       type: "email",
  //       title: "Email id",
  //       required: true,
  //     },
    
  //     modifiedemail: {
  //       type: "email",
  //       title: "Email id",
  //       required: true,
  //     },
  //     mobileNumber: {
  //       type: "number",
  //       title: "Mobile Number",
  //       required: true,
  //     },
  //     modifiedMobileNumber: {
  //       type: "number",
  //       title: "Mobile Number",
  //       required: true,
  //     },
  //     nationality: {
  //       type: "number",
  //       title: "Nationality",
  //       required: true,
  //     },
  //      modifiedNationality: {
  //       type: "number",
  //       title: "Nationality",
  //       required: true,
  //     },
     
  //   }}


}
