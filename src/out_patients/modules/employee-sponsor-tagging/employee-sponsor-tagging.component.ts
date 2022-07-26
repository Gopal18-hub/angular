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
import { ThisReceiver } from "@angular/compiler";
import {
  OpRegistrationComponent,
  SimilarPatientDialog,
} from "../../../out_patients/modules/registration/submodules/op-registration/op-registration.component";
import { PatientSearchModel } from "@core/models/patientSearchModel";
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
  validEmployeecode: boolean = false;
  disableDelete: boolean = false;
  disableClear: boolean = true;
  // validFromMaxdate = this.employeesponsorForm.controls["todate"].value;
  private readonly _destroying$ = new Subject<void>();
  @ViewChild("empdependanttable") employeeDependanttable: any;
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
        //maximum: this.validFromMaxdate,
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
    clickSelection: "single",
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
      "remark",
    ],
    columnsInfo: {
      groupCompany: {
        title: "Group Company",
        type: "string",
        style: {
          width: "9rem",
        },
      },
      empCode: {
        title: "EMP Code",
        type: "number",
        style: {
          width: "7rem",
        },
      },
      dob: {
        title: "DOB",
        type: "string",
        style: {
          width: "5.5rem",
        },
      },
      empName: {
        title: "Employee Name",
        type: "string",
        style: {
          width: "9rem",
        },
      },
      dependantName: {
        title: "Dependant Name",
        type: "string",
        style: {
          width: "9.5rem",
        },
      },
      maxid: {
        title: "Max Id",
        type: "string",
        style: {
          width: "5.5rem",
        },
      },
      gender: {
        title: "Gender",
        type: "string",
        style: {
          width: "6rem",
        },
      },
      doj: {
        title: "DOJ",
        type: "string",
        style: {
          width: "5rem",
        },
      },
      age: {
        title: "Age",
        type: "number",
        style: {
          width: "5rem",
        },
      },
      relationship: {
        title: "Relationship",
        type: "string",
        style: {
          width: "8rem",
        },
      },
      remark: {
        title: "Remarks",
        type: "input",
      },
    },
  };
  config2: any = {
    dateformat: "dd/MM/yyyy",
    selectBox: true,
    readonly: true,
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
        style: {
          width: "5rem",
        },
      },
      company: {
        title: "Company Name",
        type: "string",
        style: {
          width: "11rem",
        },
      },
      addedDateTime: {
        title: "Added Date & Time",
        type: "string",
        style: {
          width: "12rem",
        },
      },
      addedBy: {
        title: "Added By",
        type: "string",
        style: {
          width: "8rem",
        },
      },
      updatedDateTime: {
        title: "Updated Date",
        type: "string",
        style: {
          width: "10rem",
        },
      },
      updatedBy: {
        title: "Updated By",
        type: "string",
        // style: {
        //   width: "8rem",
        // },
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
    //this.validFromMaxdate = this.employeesponsorForm.controls["todate"].value;
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
      (companyobject) => {
        console.log(companyobject);
        console.log(this.iommessage);
        //TO CHECK WHETHER COMPANY IS SELECTED.
        if (companyobject != null) {
          if (companyobject.value != null && companyobject.value != 0) {
            //if (value.value != 0) {
            var selectedCompany = this.companySponsorData.find(
              (company: any) => {
                console.log(company);
                console.log(company.id);
                console.log(companyobject.value);
                company.id == companyobject.value;
                this.iommessage =
                  "IOM Validity:" +
                  this.datepipe.transform(company.iomValidity, "dd-MM-yyyy");
              }
            );
            this.disableIOM = false;
            // }
            // else if (value == null) {
            //   this.disableIOM = true;
            //   this.iommessage = "";
            // }
          } else {
            this.disableIOM = true;
            this.iommessage = "";
          }
        }
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

  enableDelete() {
    if (this.validmaxid && this.employeeDependantDetailList.length > 0) {
      this.disableDelete = false;
    }
    console.log(this.disableDelete);
  }
  enableSave() {
    console.log("enablesavw");
    if (
      this.validmaxid &&
      this.validEmployeecode
      //&&
      //this.employeesponsorForm.value.company.value
    ) {
      this.disableButton = false;
    } else {
      this.disableButton = true;
    }
    console.log(this.disableButton);
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
            this.enableSave();
            this.enableDelete();
            this.patientSponsorData = data as GetPatientSponsorDataInterface;
            console.log(this.patientSponsorData);
            let companyObject = this.companySponsorData.find((a: any) => {
              this.patientSponsorData.objPatientDemographicData[0].complayId ==
                a.id;
              // this.questions[3].value=companyObject.title;
            });
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
              title: companyObject?.companyIOM,
              value:
                this.patientSponsorData.objPatientDemographicData[0].complayId,
            });
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
            // data.objEmployeeDependentData.push({
            //   slno: data.objEmployeeDependentData.length,
            // });
            console.log(data);
            this.employeeDependantDetailList =
              this.patientSponsorData.objEmployeeDependentData;

            this.updatedTableList =
              this.patientSponsorData.objPatientSponsorDataAuditTrail;
            for (
              let i = 0;
              i <
              this.patientSponsorData.objPatientSponsorDataAuditTrail.length;
              i++
            ) {
              this.updatedTableList[i].slno = i + 1;
            }
            console.log(this.updatedTableList);
          } else {
            this.validmaxid = false;
            this.dialogService.info("Max ID doesn't exist");
          }
        },
        (error) => {
          console.log(error);
          if (
            error.status == 404 ||
            (error.error == null && error.statusText == "Not Found")
          ) {
            this.dialogService.info("Please enter  valid max ID");
          } else if (error.title == "One or more validation errors occurred.") {
            this.dialogService.info("One or more validation errors occurred.");
          } else if (
            error.error ==
            "There is an error occured while processing your transaction, check with administrator"
          ) {
            this.dialogService.info(
              "There is an error occured while processing your transaction, check with administrator"
            );
          }
        }
      );
  }
  similarPatientlist: PatientSearchModel[] = [];
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
        this.similarPatientlist = data as PatientSearchModel[];
        console.log(this.similarPatientlist);
        if (this.similarPatientlist.length > 0) {
          const similarPatientDialogref = this.dialog.open(
            SimilarPatientDialog,
            {
              width: "60vw",
              height: "80vh",
              data: {
                searchResults: this.similarPatientlist,
              },
            }
          );
          similarPatientDialogref.afterClosed().subscribe((data) => {
            console.log(data);
          });
        }
      });
  }
  onEmployeecodeEnter() {
    this.http
      .get(
        ApiConstants.getEmployeeStaffDependantDetails(
          this.employeesponsorForm.controls["employeeCode"].value
        )
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe((data) => {
        console.log(data);
        if (data.length > 0) {
          // data = data.forEach((e: any) => {
          //   e.dob = this.datepipe.transform(e.dob, "dd/MM/yyyy");
          //   return e;
          // });
          this.validEmployeecode = true;
          this.enableSave();
          this.enableDelete();
          console.log(data);
          this.employeeDependantDetailList = data as EmployeeDependantDetails[];
          console.log(this.employeeDependantDetailList);
        } else {
          this.dialogService.info("Employee code does not exist");
        }
      });

    // this.http
    //   .get(
    //     ApiConstants.getpatientcompanysponsoronempcode(
    //       this.employeesponsorForm.controls["employeeCode"].value
    //     )
    //   )
    //   .subscribe((data) => {
    //     this.patientDetailListonEmpcode =
    //       data as GetPatientCompanySponsorOnEmpcode[];
    //     console.log(this.patientDetailListonEmpcode);
    //     if (this.patientDetailListonEmpcode.length == 0) {
    //       this.dialogService.info("Employee Code does not Exist");
    //     } else {
    //     }
    //   });
  }

  //SAVE DIALOG
  employeeSave() {
    console.log(this.employeeDependanttable);
    return;
    console.log("inside save");
    let dialogRef = this.dialog.open(SavedialogComponent, {
      width: "25vw",
      height: "30vh",
    });
    dialogRef.afterClosed().subscribe((value) => {
      console.log(value);
      if (value == true) {
        console.log(this.savedeleteEmployeeObject);
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
              this.dialogService.success("Saved Successfully");
            },
            (error) => {
              console.log(error.error);
              if (error.error == "Please select Maxid!") {
                this.dialogService.info("Please enter Maxid");
              } else if (error.error == "Please select company!") {
                this.dialogService.info("Please select company");
              } else if (error.error == "Please enter employee code!") {
                this.dialogService.info("Please enter employee code");
              }
            }
          );
      }
      console.log(this.getSaveDeleteEmployeeObj());
    });
  }

  //DELETE DIALOG
  onDelete: boolean = false;
  employeeDelete() {
    console.log("inside delete");
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

    console.log(this.getSaveDeleteEmployeeObj());

    this.dialog.open(DeletedialogComponent, {
      width: "25vw",
      height: "30vh",
      panelClass: "custom-container",
    });
  }
  flag!: number;
  savedeleteEmployeeObject!: SaveDeleteEmployeeSponsorRequest;
  getSaveDeleteEmployeeObj(): SaveDeleteEmployeeSponsorRequest {
    let iacode = this.employeesponsorForm.controls["maxId"].value.split(".")[0];
    let regno = this.employeesponsorForm.controls["maxId"].value.split(".")[1];
    let validfrom = this.datepipe.transform(
      this.employeesponsorForm.controls["fromdate"].value,
      "yyyy-MM-ddThh:mm:ss"
    );
    let validto = this.datepipe.transform(
      this.employeesponsorForm.controls["todate"].value,
      "yyyy-MM-ddThh:mm:ss"
    );
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
        validfrom, //valid from
        validto, //valid to
        0
      ));
  }
  // "2022-07-12T11:29:30.085Z"

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
    this.name = "";
    this.age = "";
    this.gender = "";
    this.dob = "";
    this.nationality = "";
    this.ssn = "";
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
