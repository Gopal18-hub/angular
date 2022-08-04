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
  companySelected: boolean = false;
  disableDelete: boolean = true;
  disableClear: boolean = true;
  lastUpdatedBy: string = "";
  dependantRemarks: string = "";
  currentTime: string = new Date().toLocaleString();
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
        //pattern: "^[a-zA-Z0-9.]$",
      },
      mobileNo: {
        type: "tel",
        title: "Mobile Number",
        //required: true,
        pattern: "^[1-9]{1}[0-9]{9}",
        // type: "number",
        // pattern: "^[1-9]{1}[0-9]{9}",
        // maximum: "10",
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

    //selectBox: true,
    // selectCheckBoxPosition: 10,
    //clickSelection: "single",
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
      "flag",
      "remark",
    ],
    columnsInfo: {
      groupCompany: {
        title: "Group Company",
        type: "string",
        style: {
          width: "10rem",
        },
      },
      empCode: {
        title: "EMP Code",
        type: "number",
        style: {
          width: "6rem",
        },
      },
      dob: {
        title: "DOB",
        type: "date",
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
          width: "5rem",
        },
      },
      doj: {
        title: "DOJ",
        type: "date",
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
          width: "7rem",
        },
      },
      flag: {
        title: "Active",
        type: "checkbox_active",
        style: {
          width: "5rem",
        },
      },
      remark: {
        title: "Remarks",
        type: "input",
      },
    },
  };
  config2: any = {
    dateformat: "dd/MM/yyyy  hh:mm:ss ",
    //selectBox: true,
    readonly: true,
    displayedColumns: [
      "slno",
      "company",
      "addedDateTime",
      "addedBy",
      "updatedDateTime",
      "updatedBy",
      "flag",
    ],
    columnsInfo: {
      slno: {
        title: "Sl.no",
        type: "string",
        style: {
          width: "3rem",
        },
      },
      company: {
        title: "Company Name",
        type: "string",
        style: {
          width: "5rem",
        },
      },
      addedDateTime: {
        title: "Added Date & Time",
        type: "string",
        style: {
          width: "5rem",
        },
      },
      addedBy: {
        title: "Added By",
        type: "string",
        style: {
          width: "4.5rem",
        },
      },
      updatedDateTime: {
        title: "Updated Date",
        type: "string",
        style: {
          width: "5rem",
        },
      },
      updatedBy: {
        title: "Updated By",
        type: "string",
        style: {
          width: "4rem",
        },
      },
      flag: {
        title: "Active",
        type: "checkbox",
        style: {
          width: "5rem",
        },
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
  ) {
    // setTimeout(() => {
    //   this.employeeDependanttable.selection.selected
    //     .pipe(takeUntil(this._destroying$))
    //     .subscribe((res: any) => {
    //       console.log(this.employeeDependanttable.selection);
    //       console.log(res);
    //       console.log(res.added[0]);
    //       this.dependantRemarks = res.added[0].remark;
    //       console.log(this.dependantRemarks);
    //     });
    // });
  }

  ngOnInit(): void {
    console.log(this.cookie.get("LocationIACode"));
    this.lastUpdatedBy = this.cookie.get("UserName");
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
        this.onMaxidEnter(this.employeesponsorForm.controls["maxId"].value);
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
        console.log(this.employeesponsorForm.controls["company"].value.value);
        //TO CHECK WHETHER COMPANY IS SELECTED.
        if (companyobject != null) {
          if (companyobject.value != null && companyobject.value != 0) {
            //if (value.value != 0) {
            this.companySelected = true;
            this.enableSave();
            this.enableDelete();
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
            this.companySelected = false;
          }
        } else {
          this.companySelected = false;
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
    if (
      this.validmaxid &&
      // this.employeeDependantDetailList.length > 0
      //&& //check for dependant selected through active status
      this.companySelected
    ) {
      this.disableDelete = false;
    }
    console.log(this.disableDelete);
  }
  enableSave() {
    console.log("enablesavw");
    if (
      this.validmaxid &&
      this.validEmployeecode &&
      this.companySelected
      //&&
      //this.employeesponsorForm.value.company.value
      //this.employeeDependantTable.selection.selected[0].checkbox
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

  onMaxidEnter(maxid: any) {
    console.log(maxid);
    // let iacode = this.employeesponsorForm.controls["maxId"].value.split(".")[0];
    //let regno = this.employeesponsorForm.controls["maxId"].value.split(".")[1];
    let iacode = maxid.split(".")[0];
    let regno = maxid.split(".")[1];
    this.http
      .get(ApiConstants.getpatientsponsordataonmaxid(iacode, regno))
      .pipe(takeUntil(this._destroying$))
      .subscribe(
        (data) => {
          console.log(data);
          if (data != null) {
            if (data.objPatientDemographicData.length > 0) {
              this.validmaxid = true;
              this.enableSave();
              this.enableDelete();
              this.disableClear = false;
              this.patientSponsorData = data as GetPatientSponsorDataInterface;
              console.log(this.patientSponsorData);
              if (
                this.patientSponsorData.objPatientDemographicData[0]
                  .complayId != null
              ) {
              }
              let companydetails = this.companySponsorData.filter((a) => {
                return (
                  this.patientSponsorData.objPatientDemographicData[0]
                    .complayId == a.id
                );
              });
              console.log(companydetails);
              console.log(this.companySponsorData);
              console.log(
                this.patientSponsorData.objPatientDemographicData[0].complayId
              );

              let maxid =
                this.patientSponsorData.objPatientDemographicData[0].iacode +
                "." +
                this.patientSponsorData.objPatientDemographicData[0]
                  .registrationNo;
              console.log(this.questions[0].value);
              this.employeesponsorForm.controls["maxId"].setValue(maxid);
              console.log(this.employeesponsorForm.controls["maxId"].value);
              this.questions[1].value =
                this.patientSponsorData.objPatientDemographicData[0].mobileNo;
              this.questions[2].value =
                this.patientSponsorData.objPatientDemographicData[0].empCode;
              if (companydetails[0] != undefined) {
                this.employeesponsorForm.controls["company"].setValue({
                  title: companydetails[0].name,
                  value:
                    this.patientSponsorData.objPatientDemographicData[0]
                      .complayId,
                });
              }

              //this.questions[3].value=companyObject.title;

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
                this.patientSponsorData.objPatientDemographicData[0]
                  .dateOfBirth,
                "dd/MM/yyyy"
              );
              this.nationality =
                this.patientSponsorData.objPatientDemographicData[0].nationality;
              this.ssn =
                this.patientSponsorData.objPatientDemographicData[0].ssn;

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
              this.disableClear = true;
              this.employeesponsorForm.controls["maxId"].setErrors({
                incorrect: true,
              });
              this.questions[0].customErrorMessage = "Invalid Maxid";
              //this.dialogService.info("Max ID doesn't exist");
            }
          } else {
            this.employeesponsorForm.controls["maxId"].setErrors({
              incorrect: true,
            });
            this.questions[0].customErrorMessage = "Invalid Maxid";
          }
        },
        (error) => {
          console.log(error);
          if (
            error.status == 404 ||
            (error.error == null && error.statusText == "Not Found")
          ) {
            this.employeesponsorForm.controls["maxId"].setErrors({
              incorrect: true,
            });
            this.questions[0].customErrorMessage = "Invalid Maxid";
            //this.dialogService.info("Please enter  valid max ID");
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
      .subscribe(
        (data) => {
          console.log(data);
          this.similarPatientlist = data as PatientSearchModel[];
          console.log(this.similarPatientlist);
          if (this.similarPatientlist != null) {
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
              similarPatientDialogref
                .afterClosed()
                .pipe(takeUntil(this._destroying$))
                .subscribe(
                  (result) => {
                    if (result) {
                      console.log(result.data["added"][0].maxid);
                      let maxID = result.data["added"][0].maxid;
                      this.onMaxidEnter(maxID);
                    }
                  },
                  (error) => {
                    console.log(error);
                  }
                );
            }
          }
        },
        (error) => {
          console.log(error);
        }
      );
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
        if (data != null) {
          if (data.length > 0) {
            // data = data.forEach((e: any) => {
            //   e.dob = this.datepipe.transform(e.dob, "dd/MM/yyyy");
            //   return e;
            // });
            console.log(data);
            this.validEmployeecode = true;
            this.enableSave();
            this.enableDelete();
            console.log(data);
            this.employeeDependantDetailList =
              data as EmployeeDependantDetails[];
            // this.employeesponsorForm.controls["employeeCode"].disable();
            console.log(this.employeeDependantDetailList);
          } else {
            this.employeesponsorForm.controls["employeeCode"].setErrors({
              incorrect: true,
            });
            this.questions[2].customErrorMessage = "Invalid Employee code";
            //this.dialogService.info("Employee code does not exist");
          }
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
    // this.employeeDependanttable.selection.selected
    //   .pipe(takeUntil(this._destroying$))
    //   .subscribe((res: any) => {
    //     console.log(this.employeeDependanttable.selection);
    //     console.log(res);
    //     console.log(res.added[0]);
    //     this.dependantRemarks = res.added[0].remark;
    //     console.log(this.dependantRemarks);
    //   });
    console.log(this.employeeDependanttable);
    // this.employeeDependanttable.config.columnsInfo.remark.disable();
    //console.log(this.employeeDependanttable);
    //  console.log(this.employeeDependanttable.selection.selected[0].relationship);
    //  return;
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

    console.log(this.getSaveDeleteEmployeeObj());

    let deleteDialogref = this.dialog.open(DeletedialogComponent, {
      width: "25vw",
      height: "30vh",
      panelClass: "custom-container",
    });
    deleteDialogref
      .afterClosed()
      .pipe(takeUntil(this._destroying$))
      .subscribe((result) => {
        if (result) {
          this.http
            .post(
              ApiConstants.saveEmployeeSponsorData,
              this.getSaveDeleteEmployeeObj()
            )
            .subscribe((data) => {
              console.log(data);
              this.updatedTableList =
                data as SaveDeleteEmployeeSponsorResponse[];
              this.employeeDependantDetailList = [];
              this.employeesponsorForm.controls["company"].setValue(null);
              this.iommessage = "";
              this.disableIOM = true;
            });
        }
      });
  }
  flag!: number;
  savedeleteEmployeeObject!: SaveDeleteEmployeeSponsorRequest;
  getSaveDeleteEmployeeObj(): SaveDeleteEmployeeSponsorRequest {
    console.log(this.employeesponsorForm.controls["maxId"].value);
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
    return new SaveDeleteEmployeeSponsorRequest(
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
      0, //relation
      this.dependantRemarks, //reamrks editable field need to be added . this.employeeDependanttable.selection.selected[0].remark
      validfrom, //valid from
      validto, //valid to
      0
    );
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
  checkboxClick(event: any) {
    console.log(event);
    // if(event.row.flag == 0)
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
    this.employeesponsorForm.controls["employeeCode"].enable();
    this.employeeDependantDetailList = [];
    this.updatedTableList = [];
    this.iommessage = "";
    this.name = "";
    this.age = "";
    this.gender = "";
    this.dob = "";
    this.nationality = "";
    this.ssn = "";
    this.disableIOM = true;
    this.disableButton = true;
    this.disableDelete = true;
    this.disableClear = true;
    this.employeesponsorForm.controls["maxId"].setValue(
      this.cookie.get("LocationIACode") + "."
    );
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
