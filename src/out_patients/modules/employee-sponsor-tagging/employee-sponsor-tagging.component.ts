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
import { SearchService } from "@shared/services/search.service";
import { Router, ActivatedRoute } from "@angular/router";
import { LookupService } from "../../../out_patients/core/services/lookup.service";
import {
  OpRegistrationComponent,
  SimilarPatientDialog,
} from "../../../out_patients/modules/registration/submodules/op-registration/op-registration.component";
import { PatientSearchModel } from "@core/models/patientSearchModel";
import { SimilarSoundPatientResponse } from "@core/models/getsimilarsound.Model";
import * as moment from "moment";
import { IomPopupComponent } from "@modules/billing/submodules/billing/prompts/iom-popup/iom-popup.component";

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
  userId: any;
  hsplocationId: any;
  dependantChecked: boolean = false;
  isdate: number = 0;
  validfrom: any;
  validto: any;
  companyId!: any;
  todaydate = new Date();
  maxidmapped!: boolean;
  activeflaglength: number = 0;
  onDelete: boolean = false;
  count: number = 0;
  apiprocessing: boolean = false;
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
        //maximum: 10,
      },
      employeeCode: {
        type: "string",
      },
      company: {
        type: "dropdown",
        placeholder: "Select",
        title: "",
        options: this.patientSponsorData,
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
    //dateformat: "dd/MM/yyyy",
    clickedRows: false,
    //selectBox: true,
    // selectCheckBoxPosition: 10,
    clickSelection: "single",
    displayedColumns: [
      "groupCompanyName",
      "empCode",
      "dob",
      "empName",
      "dependentName",
      "maxid",
      "gender",
      "doj",
      "age",
      "relationship",
      "flag",
      "remark",
    ],
    columnsInfo: {
      groupCompanyName: {
        title: "Group Company",
        type: "string",
        style: {
          width: "10rem",
        },
        tooltipColumn: "groupCompanyName",
      },
      empCode: {
        title: "EMP Code",
        type: "number",
        style: {
          width: "6rem",
        },
        tooltipColumn: "empCode",
      },
      dob: {
        title: "DOB",
        type: "string",
        style: {
          width: "5.5rem",
        },
        tooltipColumn: "dob",
      },
      empName: {
        title: "Employee Name",
        type: "string",
        style: {
          width: "9rem",
        },
        tooltipColumn: "empName",
      },
      dependentName: {
        title: "Dependant Name",
        type: "string",
        style: {
          width: "9.5rem",
        },
        tooltipColumn: "dependentName",
      },
      maxid: {
        title: "Max Id",
        type: "string",
        style: {
          width: "5.5rem",
        },
        tooltipColumn: "maxid",
      },
      gender: {
        title: "Gender",
        type: "string",
        style: {
          width: "5rem",
        },
        tooltipColumn: "gender",
      },
      doj: {
        title: "DOJ",
        type: "string",
        style: {
          width: "5.5rem",
        },
        tooltipColumn: "doj",
      },
      age: {
        title: "Age",
        type: "number",
        style: {
          width: "5rem",
        },
        tooltipColumn: "age",
      },
      relationship: {
        title: "Relationship",
        type: "string",
        style: {
          width: "7rem",
        },
        tooltipColumn: "relationship",
      },
      flag: {
        title: "Active",
        type: "checkbox_active",
        style: {
          width: "5rem",
        },
        // tooltipColumn: "flag",
      },
      remark: {
        title: "Remarks",
        type: "textarea",
        disabledSort: "true",
        // readonly: true,
      },
      tooltipColumn: "remark",
    },
  };
  config2: any = {
    // dateformat: "d/M/yy, h:mm a ",
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
        tooltipColumn: "company",
      },
      addedDateTime: {
        title: "Added Date & Time",
        type: "any",
        style: {
          width: "5rem",
        },
        tooltipColumn: "addedDateTime",
      },
      addedBy: {
        title: "Added By",
        type: "string",
        style: {
          width: "4.5rem",
        },
        tooltipColumn: "addedBy",
      },
      updatedDateTime: {
        title: "Updated Date",
        type: "string",
        style: {
          width: "5rem",
        },
        tooltipColumn: "updatedDateTime",
      },
      updatedBy: {
        title: "Updated By",
        type: "string",
        style: {
          width: "4rem",
        },
        tooltipColumn: "updatedBy",
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
    private dialogService: MessageDialogService,
    private searchService: SearchService,
    private router: Router,
    private route: ActivatedRoute,
    private lookupservice: LookupService
  ) {}

  ngOnInit(): void {
    this.lastUpdatedBy = this.cookie.get("UserName");
    this.userId = Number(this.cookie.get("UserId"));
    this.hsplocationId = Number(this.cookie.get("HSPLocationId"));
    let formResult: any = this.formService.createForm(
      this.employeesponsorformData.properties,
      {}
    );
    this.employeesponsorForm = formResult.form;
    this.questions = formResult.questions;

    //this.validFromMaxdate = this.employeesponsorForm.controls["todate"].value;
    this.employeesponsorForm.controls["fromdate"].setValue(this.todaydate);
    this.employeesponsorForm.controls["todate"].setValue(this.todaydate);
    this.questions[7].minimum =
      this.employeesponsorForm.controls["fromdate"].value;
    this.questions[6].maximum =
      this.employeesponsorForm.controls["todate"].value;
    //disable fromdate and todate
    this.employeesponsorForm.controls["fromdate"].disable();
    this.employeesponsorForm.controls["todate"].disable();
    //disable corporate dropdown
    this.employeesponsorForm.controls["corporate"].disable();

    this.searchService.searchTrigger
      .pipe(takeUntil(this._destroying$))
      .subscribe(async (formdata: any) => {
        console.log(formdata.data.SearchTerm);
        this.router.navigate([], {
          queryParams: {},
          relativeTo: this.route,
        });

        const lookupdata = await this.lookupservice.searchPatient(formdata);
        console.log(lookupdata);
        if (lookupdata.length == 1) {
          this.employeesponsorForm.value.maxId = lookupdata[0]["maxid"];
          console.log(this.employeesponsorForm.value.maxId);
          this.onMaxidEnter(this.employeesponsorForm.value.maxId);
          //   if (lookupdata[0] && "maxid" in lookupdata[0]) {
          //     this.employeesponsorForm.controls["maxId"].setValue(
          //       lookupdata[0]["maxid"]
          //     );

          //     this.employeesponsorForm.value.maxId = lookupdata[0]["maxid"];

          //     this.onMaxidEnter(this.employeesponsorForm.controls["maxId"].value);
          //   }
          //  else if (lookupdata[0] && "phone" in lookupdata[0]) {
          //   console.log(lookupdata[0]["phone"]);
          //   this.employeesponsorForm.controls["mobileNo"].setValue(
          //     lookupdata[0]["phone"]
          //   );
        }
        // }
        else if (lookupdata.length > 1) {
          const similarSoundDialogref = this.dialog.open(SimilarPatientDialog, {
            width: "60vw",
            height: "65vh",
            data: {
              searchResults: lookupdata,
            },
          });
          similarSoundDialogref
            .afterClosed()
            .pipe(takeUntil(this._destroying$))
            .subscribe((result: any) => {
              if (result) {
                console.log(result.data["added"][0].maxid);
                let maxID = result.data["added"][0].maxid;
                this.employeesponsorForm.controls["maxId"].setValue(maxID);
                this.onMaxidEnter(
                  this.employeesponsorForm.controls["maxId"].value
                );
              }
              //this.similarContactPatientList = [];
            });
        }
      });
    this.http
      .get(ApiConstants.getcompanyandpatientsponsordata)
      .pipe(takeUntil(this._destroying$))
      .subscribe((data) => {
        console.log(data);
        this.companySponsorData = data as GetCompanyDataInterface[];
        this.questions[3].options = this.companySponsorData.map((a) => {
          return { title: a.name, value: a.id };
        });
        console.log(this.questions[3].options);
        //this.questions[3] = { ...this.questions[3] };
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

    //CHNAGE FROM AUTOCOMPLETE TO DROPDOWN
    this.employeesponsorForm.controls["company"].valueChanges.subscribe(
      (companyobject) => {
        console.log(companyobject);
        //TO CHECK WHETHER COMPANY IS SELECTED.
        if (companyobject != null) {
          //if (companyobject.value != null && companyobject.value != 0) {
          //if (value.value != 0) {
          console.log("companyobject.value!=null");
          this.companySelected = true;
          this.enableSave();
          this.enableDelete();

          this.companySponsorData.forEach((company: any) => {
            if (companyobject.value != null) {
              if (company.id == companyobject.value) {
                this.companyId = companyobject.value;
                this.iommessage =
                  "IOM Validity:" +
                  this.datepipe.transform(company.iomValidity, "dd-MMM-yyyy");
                this.employeesponsorForm.controls["company"].setValue(
                  companyobject.value
                );
                console.log(company.iomValidity);
                console.log(this.iommessage);
              }
            } else {
              if (company.id == companyobject) {
                this.companyId = companyobject;
                this.iommessage =
                  "IOM Validity:" +
                  this.datepipe.transform(company.iomValidity, "dd-MMM-yyyy");
                console.log(company.iomValidity);
                console.log(this.iommessage);
              }
            }
          });

          this.disableIOM = false;

          console.log(this.companyId);
        } else {
          this.disableIOM = true;
          this.companyId = 0;
          this.iommessage = "";
        }
      }
    );
    this.employeesponsorForm.controls["datecheckbox"].valueChanges.subscribe(
      (value) => {
        console.log(value);
        if (value == true) {
          this.isdate = 1;
        } else {
          this.isdate = 0;
        }
      }
    );

    this.employeesponsorForm.controls["fromdate"].valueChanges.subscribe(
      (value) => {
        if (this.isdate == 1) {
          this.validfrom = this.datepipe.transform(
            this.employeesponsorForm.controls["fromdate"].value,
            "yyyy-MM-ddThh:mm:ss"
          );
        } else {
          this.validfrom = this.datepipe.transform(
            this.todaydate,
            "yyyy-MM-ddThh:mm:ss"
          );
        }
        this.questions[7].minimum = value;
      }
    );
    this.employeesponsorForm.controls["todate"].valueChanges.subscribe(
      (value) => {
        if (this.isdate == 1) {
          this.validto = this.datepipe.transform(
            this.employeesponsorForm.controls["todate"].value,
            "yyyy-MM-ddThh:mm:ss"
          );
        } else {
          this.validto = this.datepipe.transform(
            this.todaydate,
            "yyyy-MM-ddThh:mm:ss"
          );
        }
        this.questions[6].maximum = value;
      }
    );
    //tocall enablesave and enabledelete method to toggle buttons.
    this.employeesponsorForm.controls["employeeCode"].valueChanges.subscribe(
      (value) => {
        //  this.onEmployeecodeEnter();
      }
    );
    setTimeout(() => {
      this.employeesponsorForm.valueChanges.subscribe((val) => {
        console.log("val");
        console.log(val);
        this.disableClear = false;
      });
    }, 300);

    // this.employeesponsorForm.controls['fromdate'].valueChanges.subscribe( (val) => {
    //   this.questions[3].minimum = val;
    // });
  }

  enableDelete() {
    console.log("inside delete");
    console.log("company" + this.companySelected);
    console.log("maxid" + this.validmaxid);
    console.log("employee code" + this.validEmployeecode);
    console.log("dependantchecked" + this.dependantChecked);
    console.log("maxidmapped" + this.maxidmapped);
    console.log(this.employeeDependantDetailList);
    console.log(this.updatedTableList);
    if (
      this.validmaxid &&
      this.employeeDependantDetailList.length > 0 &&
      this.maxidmapped &&
      //this.dependantChecked &&
      this.updatedTableList.length > 0 &&
      this.companySelected
    ) {
      this.disableDelete = false;
      //this.maxidmapped = false;
    } else {
      this.disableDelete = true;
    }
    console.log(this.disableDelete);
  }
  enableSave() {
    console.log("company" + this.companySelected);
    console.log("maxid" + this.validmaxid);
    console.log("employee code" + this.validEmployeecode);
    console.log("dependantchecked" + this.dependantChecked);
    console.log("enablesavw");
    if (this.validmaxid && this.dependantChecked && this.companySelected) {
      this.disableButton = false;
    } else {
      this.disableButton = true;
    }
    console.log(this.disableButton);
  }

  doblist: any = [];

  onMaxidEnter(maxid: any) {
    console.log(maxid);
    // let iacode = this.employeesponsorForm.controls["maxId"].value.split(".")[0];
    //let regno = this.employeesponsorForm.controls["maxId"].value.split(".")[1];
    this.activeflaglength = 0;
    let iacode = maxid.split(".")[0];
    let regno = maxid.split(".")[1];
    this.apiprocessing = true;
    this.http
      .get(
        ApiConstants.getpatientsponsordataonmaxid(
          iacode,
          regno,
          this.hsplocationId,
          this.userId
        )
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe(
        (data) => {
          console.log(data);
          if (data != null) {
            if (data.objPatientDemographicData.length > 0) {
              this.cleardata();
              this.validmaxid = true;
              this.apiprocessing = false;
              //this.disableClear = false;
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
              let maxid =
                this.patientSponsorData.objPatientDemographicData[0].iacode +
                "." +
                this.patientSponsorData.objPatientDemographicData[0]
                  .registrationNo;
              this.employeesponsorForm.controls["maxId"].setValue(maxid);
              this.employeesponsorForm.controls["mobileNo"].setValue(
                this.patientSponsorData.objPatientDemographicData[0].mobileNo
              );
              this.employeesponsorForm.controls["employeeCode"].setValue(
                this.patientSponsorData.objPatientDemographicData[0].empCode
              );
              if (companydetails[0] != undefined) {
                this.employeesponsorForm.controls["company"].setValue({
                  title: companydetails[0].name,
                  value:
                    this.patientSponsorData.objPatientDemographicData[0]
                      .complayId,
                });
              }
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
              this.patientSponsorData.objEmployeeDependentData =
                this.patientSponsorData.objEmployeeDependentData.map((r) => {
                  if (!r.flag) {
                    r.remark_disabled = true;
                  }
                  return r;
                });
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
                if (this.employeeDependantDetailList.length > 0) {
                  this.updatedTableList[0].flag = true;
                  console.log("updatedtable flag true");
                }
              }
              this.updatedTableList.forEach((item) => {
                item.addedDateTime = this.datepipe.transform(
                  item.addedDateTime,
                  "dd/MM/yyyy hh:mm:ss a"
                );
                item.updatedDateTime = this.datepipe.transform(
                  item.updatedDateTime,
                  "dd/MM/yyyy"
                );
              });
              if (this.employeeDependantDetailList.length > 0) {
                this.employeesponsorForm.controls["employeeCode"].disable();
              }

              this.employeeDependantDetailList.forEach((item, index) => {
                if (item.flag == 1) {
                  if (item.maxid != "") {
                    this.maxidmapped = true;
                    // this.employeeDependantDetailList[index].maxid = item.maxid;
                  }

                  // this.employeeDependantDetailList[selectedIndex].maxid =
                  //   this.employeesponsorForm.controls["maxId"].value;
                  this.empid = item.id;
                  this.dependantRemarks = item.remark;
                  console.log("flag 1");
                  this.dependantChecked = true;
                  this.activeflaglength++;
                  this.enableSave();
                  this.enableDelete();
                } else {
                  // this.dependantChecked = false;
                }
                console.log(this.activeflaglength);
              });
            } else {
              this.validmaxid = false;
              this.apiprocessing = false;
              //this.disableClear = true;
              this.questions[1].elementRef.focus();
              this.employeesponsorForm.controls["maxId"].setErrors({
                incorrect: true,
              });
              this.questions[0].customErrorMessage = " Invalid Maxid";
              //this.dialogService.info("Max ID doesn't exist");
            }
          } else {
            //this.validmaxid=true;
            this.apiprocessing = false;
            console.log("else part of data != null");
            this.questions[1].elementRef.focus();
            this.employeesponsorForm.controls["maxId"].setErrors({
              incorrect: true,
            });
            this.questions[0].customErrorMessage = " Invalid Maxid";
          }
        },
        (error) => {
          console.log(error);
          this.apiprocessing = false;
          if (
            error.status == 404 ||
            (error.error == null && error.statusText == "Not Found")
          ) {
            this.questions[1].elementRef.focus();
            this.employeesponsorForm.controls["maxId"].setErrors({
              incorrect: true,
            });
            this.questions[0].customErrorMessage = "Invalid Maxid";
            //this.dialogService.info("Please enter  valid max ID");
          } else if (
            error.error.title == "One or more validation errors occurred."
          ) {
            this.questions[1].elementRef.focus();
            this.employeesponsorForm.controls["maxId"].setErrors({
              incorrect: true,
            });
            this.questions[0].customErrorMessage = "Invalid Maxid";
            //this.dialogService.info("One or more validation errors occurred.");
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
  //similarPatientlist: PatientSearchModel[] = [];
  similarPatientlist: SimilarSoundPatientResponse[] = [];
  maxID!: string;
  onMobilenumberEnter() {
    this.http
      .post(ApiConstants.similarSoundPatientDetail, {
        phone: this.employeesponsorForm.controls["mobileNo"].value,
      })
      .pipe(takeUntil(this._destroying$))
      .subscribe(
        (data) => {
          console.log(data);
          // this.similarPatientlist = data as PatientSearchModel[];
          this.similarPatientlist = data as SimilarSoundPatientResponse[];
          if (this.similarPatientlist != null) {
            if (this.similarPatientlist.length > 1) {
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
                      this.maxID = result.data["added"][0].maxid;
                      this.onMaxidEnter(this.maxID);
                    }
                  },
                  (error) => {
                    console.log(error);
                  }
                );
            } else if (this.similarPatientlist.length == 1) {
              console.log(this.similarPatientlist);
              this.maxID = this.similarPatientlist[0].maxid;
              this.onMaxidEnter(this.maxID);
            }
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }
  employeelistLength: number = 0;
  onEmployeecodeEnter() {
    this.empid = null;
    this.activeflaglength = 0;
    this.apiprocessing = true;
    this.http
      .get(
        ApiConstants.getEmployeeStaffDependantDetails(
          this.employeesponsorForm.controls["employeeCode"].value
        )
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe((data) => {
        console.log(data);
        if (data != null || data.length != 0) {
          if (data.length > 0) {
            console.log(data);
            this.employeesponsorForm.controls["employeeCode"].disable();
            this.validEmployeecode = true;
            this.apiprocessing = false;
            console.log(data);
            this.employeeDependantDetailList =
              data as EmployeeDependantDetails[];
            //to check the checkbox on entering employee code details.
            this.employeeDependantDetailList.forEach((item) => {
              if (item.flag != 1) {
                item.remark_disabled = true;
              }
              if (item.maxid != "") {
                this.empid = item.id;
                this.dependantRemarks = item.remark;
                console.log(this.empid);
                console.log(this.activeflaglength);
                this.enableSave();
                this.enableDelete();
              } else {
                this.employeelistLength++;
                console.log(this.empid);
              }
            });
          } else {
            console.log("employee data list length =0");
            this.questions[1].elementRef.focus();
            this.validEmployeecode = false;
            this.apiprocessing = false;
            this.employeesponsorForm.controls["employeeCode"].setErrors({
              incorrect: true,
            });
            this.questions[2].customErrorMessage = "Invalid Employee code";
            this.questions[2].elementRef.focus();
            //this.dialogService.info("Employee code does not exist");
          }
        } else {
          this.questions[1].elementRef.focus();
          this.employeesponsorForm.controls["employeeCode"].setErrors({
            incorrect: true,
          });
          this.questions[2].customErrorMessage = "Invalid Employee code";
          this.validEmployeecode = false;
          this.apiprocessing = false;
          this.questions[2].elementRef.focus();
        }
      });
  }

  //SAVE DIALOG
  employeeSave() {
    console.log(this.dependantChecked);
    console.log(this.employeeDependanttable.selection.selected);
    console.log(this.employeesponsorForm.controls["company"].value);
    console.log(this.companyId);
    console.log("inside save");
    this.onDelete = false;
    // let dialogRef = this.dialog.open(SavedialogComponent, {
    //   width: "25vw",
    //   height: "30vh",
    // });
    let dialogRef = this.dialogService.confirm("", "Do You Want to Save?");
    dialogRef.afterClosed().subscribe((result) => {
      if (result.type == "yes") {
        console.log(this.activeflaglength);

        if (this.activeflaglength > 1) {
          console.log("active flag more than 1");
          this.dialogService.info("Only one dependant can be selected");
        } else if (this.activeflaglength == 0) {
          this.dialogService.info("Please select one dependant");
        } else if (this.companyId == 0) {
          this.dialogService.info("Please select company");
        } else {
          this.apiprocessing = true;
          this.http
            .post(
              ApiConstants.saveEmployeeSponsorData,
              this.getSaveDeleteEmployeeObj()
            )
            .subscribe(
              (data) => {
                console.log(data);
                this.apiprocessing = false;
                this.onMaxidEnter(
                  this.employeesponsorForm.controls["maxId"].value
                );
                this.maxidmapped = true;

                //Once saved, empid=null;
                this.enableDelete();
                this.employeelistLength = 0;
                this.activeflaglength = 0;
                this.dialogService.success("Saved Successfully");
              },
              (error) => {
                console.log(error);
                this.apiprocessing = false;
                if (error.error == "Please select Maxid!") {
                  this.dialogService.info("Please enter Maxid");
                } else if (error.error == "Please select company!") {
                  this.dialogService.info("Please select company");
                } else if (error.error == "Please enter employee code!") {
                  this.dialogService.info("Please enter employee code");
                } else if (
                  error.error.errors.regno[0] == "The regno field is required."
                ) {
                  this.dialogService.info("Please enter Maxid");
                }
                //  else if (error.error.errors.$.compid.length > 0) {
                //   this.dialogService.info("Please select company");
                // }
              }
            );
        }
      } else {
        console.log("result type NO");
      }
      console.log(this.getSaveDeleteEmployeeObj());
    });
  }

  //DELETE DIALOG

  employeeDelete() {
    console.log(this.empid);
    console.log("inside delete");
    this.count = 0;
    this.onDelete = true;
    // let deleteDialogref = this.dialog.open(DeletedialogComponent, {
    //   width: "25vw",
    //   height: "30vh",
    //   panelClass: "custom-container",
    // });
    let dialogRef = this.dialogService.confirm("", "Do You Want to Delete?");
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this._destroying$))
      .subscribe((result) => {
        if (result.type == "yes") {
          this.employeeDependantDetailList.forEach((item) => {
            if (
              item.maxid == this.employeesponsorForm.controls["maxId"].value
            ) {
              this.count++;
            }
            console.log(this.count);
          });

          if (
            this.employeelistLength == this.employeeDependantDetailList.length
          ) {
            this.dialogService.info("Max id  is not mapped yet");
          } else if (this.companyId == 0) {
            this.dialogService.info("Please select company");
          }
          //  else if (this.count == this.employeeDependantDetailList.length) {
          //   {
          //     this.dialogService.info("Max id  is not mapped yet");
          //     this.count = 0;
          //   }
          // }
          else if (this.count == 0) {
            {
              this.dialogService.info("Max id  is not mapped yet");
              this.count = 0;
            }
          } else {
            this.apiprocessing = true;
            this.http
              .post(
                ApiConstants.saveEmployeeSponsorData,
                this.getSaveDeleteEmployeeObj()
              )
              .subscribe(
                (data) => {
                  console.log(data);
                  this.apiprocessing = false;
                  this.updatedTableList =
                    data as SaveDeleteEmployeeSponsorResponse[];
                  for (let i = 0; i < this.updatedTableList.length; i++) {
                    this.updatedTableList[i].slno = i + 1;
                  }
                  this.employeeDependantDetailList = [];
                  this.employeesponsorForm.controls["company"].setValue(null);
                  this.iommessage = "";
                  this.disableIOM = true;
                  this.employeesponsorForm.controls["datecheckbox"].setValue(0);
                  this.employeesponsorForm.controls["fromdate"].setValue(
                    this.todaydate
                  );
                  this.employeesponsorForm.controls["todate"].setValue(
                    this.todaydate
                  );
                  this.employeesponsorForm.controls["fromdate"].disable();
                  this.employeesponsorForm.controls["todate"].disable();
                  this.employeesponsorForm.controls["employeeCode"].enable();
                  // this.dependantChecked = false; //COMMENETED TO PREVENT TOGGLING SAVE BUTTON
                  this.maxidmapped = false;
                  //this.companySelected = false;
                  this.empid = null;
                  this.employeelistLength = 0;
                  this.activeflaglength = 0;
                  this.dialogService.success("Deleted Successfully");
                },
                (error) => {
                  this.apiprocessing = false;
                  console.log(error);
                  // if (error.error.errors.($.compid).length > 0) {
                  //   this.dialogService.info("Please select company");
                  // }
                }
              );
          }

          //}
        } else {
          console.log("result type NO");
        }
      });
  }
  flag!: number;
  empid!: any;
  savedeleteEmployeeObject!: SaveDeleteEmployeeSponsorRequest;
  iacode!: string;
  regno!: string;
  getSaveDeleteEmployeeObj(): SaveDeleteEmployeeSponsorRequest {
    console.log(this.empid);
    if (this.employeeDependanttable.selection.selected[0] != undefined) {
      if (this.employeeDependanttable.selection.selected[0].flag == 1) {
        this.empid = this.employeeDependanttable.selection.selected[0].id;
        this.dependantRemarks =
          this.employeeDependanttable.selection.selected[0].remark;
      } else {
        this.employeeDependantDetailList.forEach((item: any, index: any) => {
          if (item.flag == true) {
            console.log("flagtrue");
            this.empid = item.id;
            this.dependantRemarks = item.remark;
          }
        });
      }
    } else {
      this.employeeDependantDetailList.forEach((item: any, index: any) => {
        if (item.flag == true) {
          console.log("flagtrue");
          this.empid = item.id;
          this.dependantRemarks = item.remark;
        }
      });
    }
    if (this.updatedTableList.length == 0 && this.onDelete == false) {
      this.flag = 1;
      this.iacode =
        this.employeesponsorForm.controls["maxId"].value.split(".")[0];
      this.regno =
        this.employeesponsorForm.controls["maxId"].value.split(".")[1];
    } else if (this.updatedTableList.length > 0 && this.onDelete == false) {
      this.flag = 2;
      this.iacode =
        this.employeesponsorForm.controls["maxId"].value.split(".")[0];
      this.regno =
        this.employeesponsorForm.controls["maxId"].value.split(".")[1];
    } else if (this.onDelete == true) {
      this.flag = 3;
      this.onDelete = false;
      this.employeeDependantDetailList.forEach((item) => {
        if (item.maxid != "") {
          if (item.maxid == this.employeesponsorForm.controls["maxId"].value) {
            this.empid = item.id;
            this.dependantRemarks = item.remark;
            this.iacode =
              this.employeesponsorForm.controls["maxId"].value.split(".")[0];
            this.regno =
              this.employeesponsorForm.controls["maxId"].value.split(".")[1];
          }
          console.log(this.employeesponsorForm.controls["maxId"].value);
          console.log(this.iacode);
          console.log(this.regno);
        } else {
        }
      });
    }
    return new SaveDeleteEmployeeSponsorRequest(
      this.flag,
      this.companyId,
      0,
      this.regno,
      this.iacode,
      69,
      this.userId,
      0, //corporate id
      true,
      this.empid, // this.empid
      this.employeesponsorForm.controls["employeeCode"].value,
      0, //relation
      this.dependantRemarks, //reamrks editable field need to be added . this.employeeDependanttable.selection.selected[0].remark
      this.validfrom, //valid from
      this.validto, //valid to
      this.isdate
    );
  }
  // "2022-07-12T11:29:30.085Z"

  oncheckboxClick(event: any) {
    console.log(event);
    this.employeesponsorForm.controls["datecheckbox"].valueChanges.subscribe(
      (value) => {
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
  activeClick(event: any) {
    console.log(event);
    if (event.column == "flag") {
      if (event.row.flag == 0) {
        console.log("flag is 0 & it is getting checked");
        this.activeflaglength = 1;
        let employeeid = event.row.id;
        if (this.employeeDependantDetailList.length == 1) {
          this.empid = employeeid;
          this.dependantRemarks = event.row.remarks;
        } else {
          this.employeeDependantDetailList.forEach((item) => {
            if (item.id != employeeid) {
              item.flag = 0;
              this.empid = employeeid;
              this.dependantRemarks = event.row.remarks;
              console.log("set other flags as 0");
              item.remark_disabled = true;
            } else {
              item.remark_disabled = false;
            }
          });
        }
        //item.remark_disabled = false;
        console.log(this.activeflaglength);
        this.dependantChecked = true;
        this.enableSave();
        this.enableDelete();
      } else {
        //this.empid = null;
        // this.activeflaglength = 0;
        this.activeflaglength--;
        console.log(this.activeflaglength);
        this.dependantRemarks = "";
        this.employeeDependantDetailList.forEach((item) => {
          item.remark_disabled = true;
        });
        //this.dependantChecked = false;
      }
    }
  }
  iomdata: any;
  iomClick() {
    console.log("inside iomclick");
    this.http
      .get(
        ApiConstants.getopcompanyiomlocationwise(
          this.hsplocationId,
          this.companyId
        )
      )
      .subscribe((data) => {
        console.log(data);
        if (data.length == 0) {
          this.dialogService.info("IOM document not found");
        } else if (data.length > 0) {
          if (data[0].length < 150) {
            this.dialogService.info("IOM document not found");
          } else {
            this.dialog.open(IomPopupComponent, {
              width: "70%",
              height: "80%",
              data: {
                company: this.employeesponsorForm.value.company,
              },
            });
          }
        }
      });
  }

  cleardata() {
    console.log(this.empid);
    this.employeesponsorForm.reset();
    this.employeesponsorForm.controls["fromdate"].setValue(this.todaydate);
    this.employeesponsorForm.controls["todate"].setValue(this.todaydate);
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

    this.dependantChecked = false;
    this.validmaxid = false;
    this.companySelected = false;
    this.maxidmapped = false;
    this.activeflaglength = 0;
    this.employeelistLength = 0;
    this.employeesponsorForm.controls["maxId"].setValue(
      this.cookie.get("LocationIACode") + "."
    );
    this.disableClear = true;
  }

  ngOnDestroy() {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
