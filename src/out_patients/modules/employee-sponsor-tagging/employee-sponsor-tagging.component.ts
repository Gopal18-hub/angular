import { Component, OnInit, ViewChild } from "@angular/core";
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
import { GetPatientSponsorDataInterface } from "../../core/types/employeesponsor/getPatientSponsorData.Interface";
import { EmployeeDependantDetails } from "../../core/types/employeesponsor/employeeDependantDetails.interface";
import { GetPatientCompanySponsorOnEmpcode } from "../../core/types/employeesponsor/getPatientCompanySponsoronEmpcode.Interface";
import { SaveDeleteEmployeeSponsorRequest } from "../../core/types/employeesponsor/savedeleteEmployeeSponsorRequest.Interface";
import { SaveDeleteEmployeeSponsorResponse } from "../../core/types/employeesponsor/savedeleteemployeeSponsorResponse.Interface";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { GetCompanyDataInterface } from "../../core/types/employeesponsor/getCompanydata.Interface";
interface CorporateInterface {
  id: number;
  name: string;
}
@Component({
  selector: "out-patients-employee-sponsor-tagging",
  templateUrl: "./employee-sponsor-tagging.component.html",
  styleUrls: ["./employee-sponsor-tagging.component.scss"],
})
export class EmployeeSponsorTaggingComponent implements OnInit {
  name: any;
  age: any;
  gender: any;
  dob: any;
  nationality: any;
  ssn: any;
  employeesponsorForm!: FormGroup;
  questions: any;
  patientSponsorData!: GetPatientSponsorDataInterface;
  companySponsorData!: GetCompanyDataInterface[];
  iomdisable: boolean = true;
  iommessage: string = "";
  employeeDependantDetailList: EmployeeDependantDetails[] = [];
  patientDetailListonEmpcode: GetPatientCompanySponsorOnEmpcode[] = [];
  updatedTableList: SaveDeleteEmployeeSponsorResponse[] = [];
  corporateList!: CorporateInterface[];
  disableButton: boolean = true;
  disableIOM: boolean = true;
  validmaxid: boolean = false;
  disableDelete: boolean = true;
  private readonly _destroying$ = new Subject<void>();
  @ViewChild("table") tableRows: any;
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
        placeholder: "Select",
      },
      corporate: {
        type: "autocomplete",
        disabled: true,
        placeholder: "Select",
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
      "empName",
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
        type: "string",
      },
      empName: {
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
        type: "string",
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
      "company",
      "addedDateTime",
      "addedBy",
      "updatedDateTime",
      "updatedBy",
    ],
    columnsInfo: {
      slno: {
        title: "Sl.no",
        type: "string",
      },
      company: {
        title: "Company Name",
        type: "string",
      },
      addedDateTime: {
        title: "Added Date & Time",
        type: "string",
      },
      addedBy: {
        title: "Added By",
        type: "string",
      },
      updatedDateTime: {
        title: "Updated Date",
        type: "string",
      },
      updatedBy: {
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
    private http: HttpService,
    private dialogService: MessageDialogService
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
      .pipe(takeUntil(this._destroying$))
      .subscribe((data) => {
        console.log(data);
        this.companySponsorData = data as GetCompanyDataInterface[];
        this.questions[3].options = this.companySponsorData.map((a) => {
          return { title: a.name, value: a.id };
        });
      });
    this.http
      .get(ApiConstants.getCorporate)
      .pipe(takeUntil(this._destroying$))
      .subscribe((data) => {
        this.corporateList = data as CorporateInterface[];
        console.log(this.corporateList);
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
    this.questions[1].elementRef.addEventListener("keypress", (event: any) => {
      if (event.key === "Enter") {
        event.preventDefault();
        this.onMobilenumberEnter();
      }
    });
    this.employeesponsorForm.controls["company"].valueChanges.subscribe(
      (value) => {
        console.log(value);
        console.log(this.iommessage);
        //TO CHECK WHETHER COMPANY IS SELECTED.
        if (value != null) {
          if (value.value != 0) {
            var selectedCompany = this.companySponsorData.find(
              (company: any) => {
                console.log(company);
                console.log(company.id);
                company.id == value;
                this.iommessage = "IOM Validity:" + company.iomValidity;
              }
            );
            this.disableIOM = false;
          } else if (value == null) {
            this.disableIOM = true;
            this.iommessage = "";
          }
        } else {
          this.disableIOM = true;
          this.iommessage = "";
        }
      }
    );
    //  setTimeout(() => {
    //   this.tableRows.selection.changed
    //     .pipe(takeUntil(this._destroying$))
    //     .subscribe((res: any) => {
    //       if (this.tableRows.selection.selected.length > 1) {
    //         this.mergebuttonDisabled = false;
    //       } else {
    //         this.mergebuttonDisabled = true;
    //       }
    //     });
    // });

    // if (
    //   //this.employeesponsorForm.controls["maxId"].value != null &&
    //   this.employeesponsorForm.controls["employeeCode"].value != null &&
    //   this.employeesponsorForm.controls["company"].value != null
    //   //  this.employeesponsorForm.value.company.value != null
    // ) {
    //   console.log("inside if enable.disable button");
    //   this.disableButton = false;
    // } else {
    //   this.disableButton = true;
    // }

    //DISABLE/ENABLE DELETE
    if (this.validmaxid && this.employeeDependantDetailList.length > 0) {
      this.disableDelete = false;
    }
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
      .pipe(takeUntil(this._destroying$))
      .subscribe(
        (data) => {
          console.log(data);
          if (data.objPatientDemographicData.length > 0) {
            this.validmaxid = true;
            this.patientSponsorData = data as GetPatientSponsorDataInterface;
            console.log(this.patientSponsorData);
            this.questions[0].value =
              this.patientSponsorData.objPatientDemographicData[0].iacode +
              "." +
              this.patientSponsorData.objPatientDemographicData[0]
                .registrationNo;
            this.questions[1].value =
              this.patientSponsorData.objPatientDemographicData[0].mobileNo;
            this.questions[2].value =
              this.patientSponsorData.objPatientDemographicData[0].empCode;
            this.employeesponsorForm.controls["company"].setValue({
              // title:
              //   this.patientSponsorData.objPatientDemographicData[0].company,
              value:
                this.patientSponsorData.objPatientDemographicData[0].complayId,
            });
            //console.log(this.employeesponsorForm.value.company);
            this.questions[6].value =
              this.patientSponsorData.objPatientDemographicData[0].validfrom;
            this.questions[7].value =
              this.patientSponsorData.objPatientDemographicData[0].validto;
            //Assign Second row values
            this.name =
              this.patientSponsorData.objPatientDemographicData[0].ptnName;
            this.age =
              this.patientSponsorData.objPatientDemographicData[0].ageWithName;
            this.gender =
              this.patientSponsorData.objPatientDemographicData[0].sexname;
            this.dob = this.datepipe.transform(
              this.patientSponsorData.objPatientDemographicData[0].dateOfBirth,
              "dd/MM/yyyy"
            );
            this.nationality =
              this.patientSponsorData.objPatientDemographicData[0].nationality;
            this.ssn = this.patientSponsorData.objPatientDemographicData[0].ssn;
            //Assign tabledata
            this.employeeDependantDetailList =
              this.patientSponsorData.objEmployeeDependentData;
            this.updatedTableList =
              this.patientSponsorData.objPatientSponsorDataAuditTrail;
          } else {
            this.validmaxid = false;
            this.dialogService.info("Max ID doesn't exist");
          }
        },
        (error) => {
          console.log(error);
          if (error.status == 404) {
            this.dialogService.info("Please enter max ID");
          } else if (error.status == 400) {
            this.dialogService.info("Please enter valid Max ID");
          }
        }
      );
  }

  onMobilenumberEnter() {
    this.http
      .get(
        ApiConstants.getSimilarPatientonMobilenumber(
          this.employeesponsorForm.controls["mobileNo"].value
        )
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe((data) => {
        console.log(data);
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
        // this.employeeDependantDetailList.forEach((e) => {
        //   e.dob = this.datepipe.transform(e.dob, "dd/MM/yyyy");
        // });
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
        if (this.patientDetailListonEmpcode.length == 0) {
          this.dialogService.info("Employee Code does not Exist");
        } else {
        }
      });
  }

  //SAVE DIALOG
  employeeSave() {
    console.log("inside save");
    let dialogRef = this.dialog.open(SavedialogComponent, {
      width: "25vw",
      height: "30vh",
    });
    dialogRef.afterClosed().subscribe((value) => {
      console.log(value);
      if (value == true) {
        console.log("inside value =true");
        this.http
          .post(
            ApiConstants.saveEmployeeSponsorData,
            this.getSaveDeleteEmployeeObj()
          )
          .subscribe(
            (data) => {
              console.log(data);
              this.updatedTableList =
                data as SaveDeleteEmployeeSponsorResponse[];
              console.log(this.updatedTableList);
            },
            (error) => {
              console.log(error.error);
              if (error.error == "Please select Maxid!") {
                this.dialogService.info("Please enter Maxid");
              } else if (error.error == "Please select company!") {
                this.dialogService.info("Please select company");
              }
            }
          );
      }
    });
  }

  //DELETE DIALOG
  onDelete: boolean = false;
  employeeDelete() {
    console.log("inside delete");
    if (
      this.employeesponsorForm.value.maxId != null &&
      this.employeesponsorForm.value.employeeCode != null &&
      this.employeesponsorForm.value.company != null
      //  this.patientDetailListonEmpcode.length > 0
    ) {
      console.log("inside if");
      this.onDelete = true;
      this.http
        .post(
          ApiConstants.saveEmployeeSponsorData,
          this.getSaveDeleteEmployeeObj()
        )
        .subscribe((data) => {
          console.log(data);
          this.updatedTableList = data as SaveDeleteEmployeeSponsorResponse[];
          this.employeeDependantDetailList = [];
        });
    }
    console.log(this.getSaveDeleteEmployeeObj());

    // this.dialog.open(DeletedialogComponent, {
    //   width: "25vw",
    //   height: "30vh",
    //   panelClass: "custom-container",
    // });
  }
  flag!: number;
  savedeleteEmployeeObject!: SaveDeleteEmployeeSponsorRequest;
  getSaveDeleteEmployeeObj(): SaveDeleteEmployeeSponsorRequest {
    let iacode = this.employeesponsorForm.controls["maxId"].value.split(".")[0];
    let regno = this.employeesponsorForm.controls["maxId"].value.split(".")[1];
    if (this.updatedTableList.length == 0 && this.onDelete == false) {
      this.flag = 1;
    } else if (this.updatedTableList.length > 0 && this.onDelete == false) {
      this.flag = 2;
    } else if (this.onDelete == true) {
      this.flag = 3;
      this.onDelete = false;
    }
    console.log(this.flag);
    return (this.savedeleteEmployeeObject =
      new SaveDeleteEmployeeSponsorRequest(
        this.flag,
        this.employeesponsorForm.value.company.value,
        0,
        regno,
        iacode,
        69,
        9923,
        0, //corporate id
        true,
        0,
        this.employeesponsorForm.controls["employeeCode"].value,
        0, //relation needs to be added
        "string", //reamrks editable field need to be added
        "2022-07-12T11:29:30.085Z", //valid from
        "2022-07-12T11:29:30.085Z", //valid to
        0
      ));
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
    console.log("inside iomclick");
    //DO an api call here
    this.http
      .get(ApiConstants.getopcompanyiomlocationwise)
      .subscribe((data) => {
        console.log(data);
      });
    this.dialog.open(CompanydialogComponent, { width: "40vw", height: "70vh" });
  }

  cleardata() {
    let todaydate = new Date();
    this.employeesponsorForm.controls["fromdate"].setValue(todaydate);
    this.employeesponsorForm.controls["todate"].setValue(todaydate);
    this.employeeDependantDetailList = [];
    this.updatedTableList = [];
    this.disableIOM = true;
    this.iommessage = "";
    this.disableButton = true;
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
