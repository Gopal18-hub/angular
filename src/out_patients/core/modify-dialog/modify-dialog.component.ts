import { Component, Inject, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { QuestionControlService } from "../../../shared/ui/dynamic-forms/service/question-control.service";
import { DatePipe } from "@angular/common";
//import { CookieService } from 'src/shared/services/cookie.service';
// import { HttpService } from 'src/shared/services/http.service';
// import { MergeDialogComponent } from '../../dup-reg-merging/merge-dialog/merge-dialog.component';
// import { MessageDialogService } from '../../../../../shared/ui/message-dialog/message-dialog.service';

@Component({
  selector: "out-patients-modify-dialog",
  templateUrl: "./modify-dialog.component.html",
  styleUrls: ["./modify-dialog.component.scss"],
})
export class ModifyDialogComponent implements OnInit {
  questions: any;
  OPUpdateForm!: FormGroup;
  ufirstname: string | undefined;
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      patientDetails: any;
      modifiedDetails: any;
      rejectButton: boolean;
      submitButton: boolean;
      submitButtononApproved: boolean;
    },
    private dialogRef: MatDialogRef<ModifyDialogComponent>,
    private formService: QuestionControlService,
    private datepipe: DatePipe,
    public matDialog: MatDialog // private cookie:CookieService,
  ) {}

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.updateregistrationFormData.properties,
      {}
    );
    this.OPUpdateForm = formResult.form;
    this.questions = formResult.questions;
    this.OPUpdateForm.controls["foreigner"].disable();
    this.OPUpdateForm.controls["modifiedForeigner"].disable();
  }

  updateregistrationFormData = {
    title: "",
    type: "object",
    properties: {
      firstName: {
        type: "string",
        title: "First Name",
        defaultValue: this.data.patientDetails.firstname,
        required: false,
        readonly: true,
      },

      modifiedfirstName: {
        type: "string",
        title: "First Name",
        defaultValue: this.data.modifiedDetails.firstname,
        required: false,
        readonly: true,
      },
      middleName: {
        type: "string",
        title: "Middle Name",
        defaultValue: this.data.patientDetails.middleName,
        required: false,
        readonly: true,
      },

      modifiedmiddleName: {
        type: "string",
        title: "Middle Name",
        defaultValue: this.data.modifiedDetails.middleName,
        required: false,
        readonly: true,
      },
      lastName: {
        type: "string",
        title: "Last Name",
        defaultValue: this.data.patientDetails.lastName,
        required: false,
        readonly: true,
      },

      modifiedlastName: {
        type: "string",
        title: "Last Name",
        defaultValue: this.data.modifiedDetails.lastName,
        required: false,
        readonly: true,
      },
      gender: {
        type: "string",
        title: "Gender",
        defaultValue: this.data.patientDetails.sexName,
        required: false,
        readonly: true,
      },

      modifiedgender: {
        type: "string",
        title: "Gender",
        defaultValue: this.data.modifiedDetails.title,
        required: false,
        readonly: true,
      },
      dateOfBirth: {
        type: "string",
        title: "DOB - Age - Age Type",
        defaultValue:
          (this.datepipe.transform(
            this.data.patientDetails.dateOfBirth,
            "dd/MM/yyyy"
          ) || null) +
          " - " +
          this.data.patientDetails.age +
          " " +
          this.data.patientDetails.ageTypeName,
        required: false,
        readonly: true,
      },
      modifieddateOfBirth: {
        type: "string",
        title: "DOB - Age - Age Type",
        defaultValue:
          (this.datepipe.transform(
            this.data.modifiedDetails.dateOfBirth,
            "dd/MM/yyyy"
          ) || null) +
          " - " +
          this.data.modifiedDetails.age +
          " " +
          this.data.modifiedDetails.ageTypeName,
        required: false,
        readonly: true,
      },
      email: {
        type: "string",
        title: "Email id",
        defaultValue: this.data.patientDetails.pemail,
        required: false,
        readonly: true,
      },

      modifiedemail: {
        type: "string",
        title: "Email id",
        defaultValue: this.data.modifiedDetails.pemail,
        required: false,
        readonly: true,
      },
      mobileNumber: {
        type: "number",
        title: "Mobile Number",
        defaultValue: this.data.patientDetails.pphone,
        required: false,
        readonly: true,
      },
      modifiedMobileNumber: {
        type: "number",
        title: "Mobile Number",
        defaultValue: this.data.modifiedDetails.pphone,
        required: false,
        readonly: true,
      },
      nationality: {
        type: "string",
        title: "Nationality",
        defaultValue: this.data.patientDetails.nationalityName,
        required: false,
        readonly: true,
      },
      modifiedNationality: {
        type: "string",
        title: "Nationality",
        defaultValue: this.data.modifiedDetails.nationality,
        required: false,
        readonly: true,
      },
      foreigner: {
        type: "checkbox",
        options: [{ title: "Foreigner" }],
        defaultValue: this.data.patientDetails.foreigner,
        disabled: true,
      },
      modifiedForeigner: {
        type: "checkbox",
        options: [{ title: "Foreigner" }],
        defaultValue: this.data.modifiedDetails.foreigner,
        disabled: true,
      },
    },
  };
  submit() {
    this.dialogRef.close("success");
  }
  reject() {
    this.dialogRef.close({
      data:
        "reject Maxid :" +
        this.data.patientDetails.iacode +
        "." +
        this.data.patientDetails.registrationno +
        ", id :" +
        this.data.patientDetails.id,
    });
  }

  Accept() {
    this.dialogRef.close({
      data:
        "Accepted Maxid :" +
        this.data.patientDetails.iacode +
        "." +
        this.data.patientDetails.registrationno +
        ", id :" +
        this.data.patientDetails.id,
    });
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
