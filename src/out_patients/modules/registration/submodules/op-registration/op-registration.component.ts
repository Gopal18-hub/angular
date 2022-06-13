import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { QuestionControlService } from "../../../../../shared/ui/dynamic-forms/service/question-control.service";
import {PatientitleModel} from "../../../../core/models/patientTitleModel.Model"
@Component({
  selector: "out-patients-op-registration",
  templateUrl: "./op-registration.component.html",
  styleUrls: ["./op-registration.component.scss"],
})

export class OpRegistrationComponent implements OnInit {
  public titleList:PatientitleModel[]=[];

  registrationFormData = {
    title: "",
    type: "object",
    properties: {
      maxid: {
        type: "string",
        title: "Max ID",
      },
      SSN: {
        type: "string",
        title: "SSN",
      },
      mobileNumber: {
        type: "number",
        title: "Mobile Number",
        required: true,
      },
      title: {
        type: "autocomplete",
        title: "Title",
        required: true,
        list:this.titleList
      },
      firstname: {
        type: "string",
        title: "First Name",
        required: true,
      },
      middlename: {
        type: "string",
        title: "Middle Name",
        required: true,
      },
      lastname: {
        type: "string",
        title: "Last Name",
        required: true,
      },
      gender: {
        type: "autocomplete",
        title: "Gender",
        required: true,
      },
      dob: {
        type: "string",
        title: "Date of Birth",
        required: true,
      },
      age: {
        type: "number",
        title: "Age",
        required: true,
      },
      agetype: {
        type: "autocomplete",
        title: "Age Type",
        required: true,
      },
      emailId: {
        type: "email",
        title: "Email id",
        required: true,
      },
      fatherSpouse: {
        type: "autocomplete",
        title: "Father/Spouse Name",
      },
      fatherSpouseName: {
        type: "string",
        title: "",
      },
      motherName: {
        type: "string",
        title: "Mother's Name",
      },
      altLandlineName: {
        type: "string",
        title: "Alt Contact/Landline",
      },
      idenityType: {
        type: "autocomplete",
        title: "Identity",
      },
      idenityValue: {
        type: "string",
        title: "",
      },
      adhaarId: {
        type: "string",
        title: "Aadhaar ID",
      },
      healthId: {
        type: "string",
        title: "Health ID",
      },
      address: {
        type: "string",
        title: "Address",
        // required property is dependent on country
        required: true,
      },
      pincode: {
        type: "string",
        title: "Pincode",
        // required property is dependent on country
        required: true,
      },
      locality: {
        type: "autocomplete",
        title: "Locality",
        // required property is dependent on country
        required: true,
      },
      localitytxt: {
        type: "string",
        title: "",
        // required property is dependent on country and text will be enabled on select of others
        required: true,
        hidden:true
      },
      city: {
        type: "autocomplete",
        title: "City/Town",
        // required property is dependent on country
        required: true,
      },
      district: {
        type: "autocomplete",
        title: "District",
        // required property is dependent on country
        required: true,
      },
      state: {
        type: "autocomplete",
        title: "State",
        // required property is dependent on country
        required: true,
      },
      country: {
        type: "autocomplete",
        title: "Country",
        required: true,
      },
      nationality: {
        type: "autocomplete",
        title: "Nationality",
        required: true,
      },
      foreigner: {
        type: "checkbox",
        title: "Foreigner",
        required: false,
      },
      hotlist: {
        type: "checkbox",
        title: "Hot Listing",
        required: false,
      },
      vip: {
        type: "checkbox",
        title: "VIP",
        required: false,
      },
      note:
      {  type: "checkbox",
        title: "Note",
        required: false,
      },
      hwc: {
        type: "checkbox",
        title: "HWC",
        required: false,
      },
      organdonor: {
        type: "checkbox",
        title: "Organ Donor",
        required: false,
      },
      otAdvanceExclude: {
        type: "checkbox",
        title: "OT Advance Exclude",
        required: false,
      },
      verifiedOnline: {
        type: "checkbox",
        title: "CGHS Patient Verified Online",
        required: false,
      },
      surveySMS: {
        type: "checkbox",
        title: "Customer agrees to receive any survey SMS/Email/Calls",
        required: false,
      },
      receivePromotional: {
        type: "checkbox",
        title: "Customer agrees to receive Promotional Information",
        required: false,
      },
      cash: {
        type: "radio",
        title: "Cash",
        required: true,
      },
      psuGovt: {
        type: "radio",
        title: "PSU/Govt",
        required: false,
      },
      ews: {
        type: "radio",
        title: "EWS",
        required: false,
      },
    Insurance:
    {
      type: "radio",
      title: "Corporate/Insurance",
      required: false,
    
    },
      sourceOfInput: {
        type: "autocomplete",
        title: "Source of Info about Max Healthcare",
        required: false,
      }
     

    },
  };
  OPRegForm!: FormGroup;
  questions: any;

  constructor(private formService: QuestionControlService) {}

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.registrationFormData.properties,
      {}
    );
    this.OPRegForm = formResult.form;
    this.questions = formResult.questions;
  }
  registationFormSubmit() {
    //ON SUBMITTING FORM ACTION
  }
}
