import { Component, OnInit } from "@angular/core";
import { ThemePalette } from "@angular/material/core";
import { FormGroup, FormControl } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { SavedialogComponent } from "./save-dialog/save-dialog.component";
import { DeletedialogComponent } from "./delete-dialog/delete-dialog.component";
import { QuestionControlService } from "../../../shared/ui/dynamic-forms/service/question-control.service";
import { CookieService } from "../../../shared/services/cookie.service";
import { DatePipe } from "@angular/common";
import { __values } from "tslib";
import { CompanydialogComponent } from "./companydialog/companydialog.component";
import { ApiConstants } from "@core/constants/ApiConstants";
import { HttpService } from "@shared/services/http.service";
import { GetPatientSponsorDataModel } from "../../../out_patients/core/models/getPatientSponsorData.Model";
import { EmployeeDependantDetails } from "../../../out_patients/core/types/employeesponsor/employeeDependantDetails.Model";
import { GetPatientCompanySponsorOnEmpcode } from "../../../out_patients/core/types/employeesponsor/getPatientCompanySponsoronEmpcode.Model";
import { SaveDeleteEmployeeSponsorRequest } from "../../core/models/savedeleteEmployeeSponsorRequest.Model";
//import { SaveDeleteEmployeeSponsorResponse } from "../../../out_patients/core/types/employeesponsor/savedeleteEmployeeSponsorResponse.Model";
@Component({
  selector: "out-patients-employee-sponsor-tagging",
  templateUrl: "./employee-sponsor-tagging.component.html",
  styleUrls: ["./employee-sponsor-tagging.component.scss"],
})
export class EmployeeSponsorTaggingComponent implements OnInit {
  name: any;
  employeesponsorForm!: FormGroup;
  questions: any;
  patientSponsorData!: GetPatientSponsorDataModel;
  companySponsorData!: GetPatientSponsorDataModel;
  iomdisable: boolean = true;
  iommessage!: string;
  employeeDependantDetailList: EmployeeDependantDetails[] = [];
  patientDetailListonEmpcode: GetPatientCompanySponsorOnEmpcode[] = [];
  employeesponsorformData = {
    title: "",
    type: "object",
    properties: {
      maxId: {
        type: "string",
        defaultValue: this.cookie.get("LocationIACode") + ".",
      },
      mobileNo: {
        type: "number",
      },
      employeeCode: {
        type: "string",
      },
      company: {
        type: "autocomplete",
        options: this.patientSponsorData,
      },
      corporate: {
        type: "autocomplete",
        disabled: true,
      },
      datecheckbox: {
        type: "checkbox",
        options: [
          {
            title: "",
          },
        ],
      },
      fromdate: {
        type: "date",
      },
      todate: {
        type: "date",
      },
    },
  };

  config1: any = {
    actionItems: false,
    dateformat: "dd/MM/yyyy",
    selectBox: true,
    displayedColumns: [
      "groupCompany",
      "empCode",
      "dob",
      "employeeName",
      "dependantName",
      "maxid",
      "gender",
      "doj",
      "age",
      "relationship",
      "remarks",
    ],
    columnsInfo: {
      groupCompany: {
        title: "Group Company",
        type: "string",
      },
      empCode: {
        title: "EMP Code",
        type: "number",
      },
      dob: {
        title: "DOB",
        type: "date",
      },
      employeeName: {
        title: "Employee Name",
        type: "string",
      },
      dependantName: {
        title: "Dependant Name",
        type: "string",
      },
      maxid: {
        title: "Max Id",
        type: "string",
      },
      gender: {
        title: "Gender",
        type: "string",
      },
      doj: {
        title: "DOJ",
        type: "date",
      },
      age: {
        title: "Age",
        type: "number",
      },
      relationship: {
        title: "Relationship",
        type: "string",
      },
      remarks: {
        title: "Remarks",
        type: "string",
      },
    },
  };
  config2: any = {
    dateformat: "dd/MM/yyyy",
    selectBox: true,
    displayedColumns: [
      "slno",
      "companyname",
      "dateandtime",
      "addedby",
      "updateddate",
      "updatedby",
    ],
    columnsInfo: {
      slno: {
        title: "Sl.no",
        type: "string",
      },
      companyname: {
        title: "Company Name",
        type: "number",
      },
      dateandtime: {
        title: "Added Date & Time",
        type: "string",
      },
      addedby: {
        title: "Added By",
        type: "string",
      },
      updateddate: {
        title: "Updated Date",
        type: "string",
      },
      updatedby: {
        title: "Updated By",
        type: "string",
      },
    },
  };

  constructor(
    private dialog: MatDialog,
    private formService: QuestionControlService,
    private cookie: CookieService,
    private datepipe: DatePipe,
    private http: HttpService
  ) {}

  ngOnInit(): void {
    console.log(this.cookie.get("LocationIACode"));

    let formResult: any = this.formService.createForm(
      this.employeesponsorformData.properties,
      {}
    );
    this.employeesponsorForm = formResult.form;
    this.questions = formResult.questions;
    let todaydate = new Date();
    this.employeesponsorForm.controls["fromdate"].setValue(todaydate);
    console.log(this.employeesponsorForm.controls["fromdate"].value);
    this.employeesponsorForm.controls["todate"].setValue(todaydate);
    console.log(this.employeesponsorForm.controls["todate"].value);
    //disable fromdate and todate
    this.employeesponsorForm.controls["fromdate"].disable();
    this.employeesponsorForm.controls["todate"].disable();
    //disable corporate dropdown
    this.employeesponsorForm.controls["corporate"].disable();

    this.http
      .get(ApiConstants.getcompanyandpatientsponsordata)
      .subscribe((data) => {
        console.log(data);
        this.companySponsorData = data as GetPatientSponsorDataModel;
        this.questions[3].options =
          this.companySponsorData.objPatientSponsorFlag.map((a) => {
            return { title: a.name, value: a.id, iomvalidity: a.iomValidity };
          });
      });
  }

  ngAfterViewInit() {
    this.questions[0].elementRef.addEventListener("keypress", (event: any) => {
      if (event.key === "Enter") {
        event.preventDefault();
        this.onMaxidEnter();
      }
    });
    this.questions[2].elementRef.addEventListener("keypress", (event: any) => {
      if (event.key === "Enter") {
        event.preventDefault();
        this.onEmployeecodeEnter();
      }
    });
    this.employeesponsorForm.controls["company"].valueChanges.subscribe(
      (value) => {
        console.log(value);
        this.iommessage = "IOM Validity:" + value.iomvalidity;
        console.log(this.iommessage);
      }
    );
  }

  disabled(employeesponsorform: any) {
    if (employeesponsorform.maxId) {
      return true;
    } else {
      return false;
    }
  }

  maxidApicall(employeesponsorform: any) {
    console.log("insode method");
    employeesponsorform.fromDate = new Date();
    employeesponsorform.mobileNo = 834738387;
    console.log(employeesponsorform.fromDate);
    console.log(employeesponsorform.mobileNo);
  }

  onMaxidEnter() {
    let iacode = this.employeesponsorForm.controls["maxId"].value.split(".")[0];
    let regno = this.employeesponsorForm.controls["maxId"].value.split(".")[1];
    this.http
      .get(ApiConstants.getpatientsponsordataonmaxid(iacode, regno))
      .subscribe((data) => {
        console.log(data);
        this.patientSponsorData = data as GetPatientSponsorDataModel;
        console.log(this.patientSponsorData);
        this.questions[0].value =
          this.patientSponsorData.objPatientSponsorData[0].iacode +
          "." +
          this.patientSponsorData.objPatientSponsorData[0].registrationNo;
        this.questions[2].value =
          this.patientSponsorData.objPatientSponsorData[0].empcode;
        this.employeesponsorForm.controls["company"].setValue({
          title: this.patientSponsorData.objPatientSponsorData[0].company,
          value: this.patientSponsorData.objPatientSponsorData[0].companyId,
        });
      });
  }

  onEmployeecodeEnter() {
    this.http
      .get(
        ApiConstants.getEmployeeStaffDependantDetails(
          this.employeesponsorForm.controls["employeeCode"].value
        )
      )
      .subscribe((data) => {
        this.employeeDependantDetailList = data as EmployeeDependantDetails[];
        console.log(this.employeeDependantDetailList);
      });

    this.http
      .get(
        ApiConstants.getpatientcompanysponsoronempcode(
          this.employeesponsorForm.controls["employeeCode"].value
        )
      )
      .subscribe((data) => {
        this.patientDetailListonEmpcode =
          data as GetPatientCompanySponsorOnEmpcode[];
        console.log(this.patientDetailListonEmpcode);
      });
  }

  //SAVE DIALOG
  employeeSave() {
    this.http
      .post(
        ApiConstants.saveEmployeeSponsorData,
        this.getSaveDeleteEmployeeObj()
      )
      .subscribe((data) => {
        console.log(data);
      });
    // this.dialog.open(SavedialogComponent, {
    //   width: "25vw",
    //   height: "30vh",
    //   data: {
    //     id: 12334,
    //     name: "name",
    //   },
    // });
  }
  savedeleteEmployeeObject!: SaveDeleteEmployeeSponsorRequest;
  getSaveDeleteEmployeeObj(): SaveDeleteEmployeeSponsorRequest {
    let iacode = this.employeesponsorForm.controls["maxId"].value.split(".")[0];
    let regno = this.employeesponsorForm.controls["maxId"].value.split(".")[1];
    return (this.savedeleteEmployeeObject =
      new SaveDeleteEmployeeSponsorRequest(
        1,
        this.employeesponsorForm.value.company.value,
        0,
        regno,
        iacode,
        69,
        9923,
        0,
        true,
        0,
        this.employeesponsorForm.controls["employeeCode"].value,
        0,
        "string",
        "2022-07-12T11:29:30.085Z",
        "2022-07-12T11:29:30.085Z",
        0
      ));
  }

  //DELETE DIALOG
  employeeDelete() {
    this.dialog.open(DeletedialogComponent, {
      width: "25vw",
      height: "30vh",
      panelClass: "custom-container",
    });
  }

  oncheckboxClick(event: any) {
    console.log(event);
    this.employeesponsorForm.controls["datecheckbox"].valueChanges.subscribe(
      (value) => {
        console.log(value);
        if (value == true) {
          this.employeesponsorForm.controls["fromdate"].enable();
          this.employeesponsorForm.controls["todate"].enable();
        } else {
          this.employeesponsorForm.controls["fromdate"].disable();
          this.employeesponsorForm.controls["todate"].disable();
        }
      }
    );
  }

  iomClick() {
    this.dialog.open(CompanydialogComponent, { width: "40vw", height: "70vh" });
  }

  clearTabledata() {
    let todaydate = new Date();
    this.employeesponsorForm.controls["fromdate"].setValue(todaydate);
    this.employeesponsorForm.controls["todate"].setValue(todaydate);
    this.data = [];
    this.data1 = [];
  }

  //HARD CODED DATA FOR EMPLOYEE DEPENDANT TABLE
  data: any[] = [
    {
      groupCompany: "Max healthcare",
      empCode: "B015330",
      dob: "10/1/2017",
      employeeName: "Mr.Amit kumar",
      dependantName: "priti",
      maxid: "",
      gender: "F",
      doj: "10/1/2017",
      age: "53",
      relationship: "Mother",
      remarks: "",
    },
    {
      groupCompany: "Max healthcare",
      empCode: "B015330",
      dob: "10/1/2017",
      employeeName: "Mr.Amit kumar",
      dependantName: "priti",
      maxid: "",
      gender: "F",
      doj: "10/1/2017",
      age: "53",
      relationship: "Mother",
      remarks: "",
    },
    {
      groupCompany: "Max healthcare",
      empCode: "B015330",
      dob: "10/1/2017",
      employeeName: "Mr.Amit kumar",
      dependantName: "priti",
      maxid: "",
      gender: "F",
      doj: "10/1/2017",
      age: "53",
      relationship: "Mother",
      remarks: "",
    },
    {
      groupCompany: "Max healthcare",
      empCode: "B015330",
      dob: "10/1/2017",
      employeeName: "Mr.Amit kumar",
      dependantName: "priti",
      maxid: "",
      gender: "F",
      doj: "10/1/2017",
      age: "53",
      relationship: "Mother",
      remarks: "",
    },
  ];

  //HARD CODED DATA FOR SECOIND TABLE
  data1: any[] = [
    {
      slno: "1",
      companyname: "xxxxx",
      dateandtime: "05/11/2022 08:48:52 AM",
      addedby: "xxx",
      updateddate: "05/11/2022",
      updatedby: "xxxx",
    },
    {
      slno: "2",
      companyname: "yyy",
      dateandtime: "05/11/2022 08:48:52 AM",
      addedby: "xxx",
      updateddate: "05/11/2022",
      updatedby: "xxxx",
    },
    {
      slno: "3",
      companyname: "zzz",
      dateandtime: "05/11/2022 08:48:52 AM",
      addedby: "xxx",
      updateddate: "05/11/2022",
      updatedby: "xxxx",
    },
    {
      slno: "4",
      companyname: "aaa",
      dateandtime: "05/11/2022 08:48:52 AM",
      addedby: "xxx",
      updateddate: "05/11/2022",
      updatedby: "xxxx",
    },
  ];
}
