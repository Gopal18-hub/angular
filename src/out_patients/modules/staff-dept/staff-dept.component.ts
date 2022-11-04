import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { QuestionControlService } from "../../../shared/ui/dynamic-forms/service/question-control.service";
import { __values } from "tslib";
import { HttpService } from "@shared/services/http.service";
import { ApiConstants } from "../../../out_patients/core/constants/ApiConstants";
import { StaffDependentTypeModel } from "@core/models/staffDependentTypeModel.Model";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";
import { SearchService } from "@shared/services/search.service";
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";
import { LookupService } from "@core/services/lookup.service";
import * as moment from "moment";

@Component({
  selector: "out-patients-staff-dept",
  templateUrl: "./staff-dept.component.html",
  styleUrls: ["./staff-dept.component.scss"],
})
export class StaffDeptComponent implements OnInit {
  public staffDependentTypeList: StaffDependentTypeModel[] = [];
  rowData = "";
  staffDetail: any = [];
  staffDeptDetails: any = [];
  selectedCode: any;
  org = "";
  code = "";
  ename = "";
  private readonly _destroying$ = new Subject<void>();
  searchbtn: boolean = true;
  staffFormData = {
    title: "",
    type: "object",
    properties: {
      organisation: {
        type: "dropdown",
        options: this.staffDependentTypeList,
        placeholder: "Select",
      },
      employeeCode: {
        type: "string",
      },
      employeeName: {
        type: "string",
      },
    },
  };
  name: any;
  staffForm!: FormGroup;
  questions: any;
  staffListConfig: any = {
    actionItems: false,
    //dateformat: 'dd/MM/yyyy',
    selectBox: false,
    clickedRows: true,
    clickSelection: "single",
    displayedColumns: [
      "sNo",
      "groupCompanyName",
      "empCode",
      "empName",
      "dob",
      "gender",
      "doj",
    ],
    columnsInfo: {
      sNo: {
        title: "S.No",
        type: "number",
        style: {
          width: "100px",
        },
      },
      groupCompanyName: {
        title: "Name of Organisation",
        type: "string",
        style: {
          width: "250px",
        },
      },
      empCode: {
        title: "Employee Code",
        type: "string",
        style: {
          width: "200px",
        },
      },
      empName: {
        title: "Employee Name",
        type: "string",
        style: {
          width: "250px",
        },
      },
      dob: {
        title: "DOB",
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
    },
  };
  staffDetailConfig: any = {
    actionItems: false,
    //dateformat: 'dd/MM/yyyy',
    selectBox: false,
    displayedColumns: [
      "empCode",
      "dependentName",
      "dob",
      "gender",
      "relationship",
    ],
    columnsInfo: {
      empCode: {
        title: "Employee Code",
        type: "string",
        style: {
          width: "240px",
        },
      },
      dependentName: {
        title: "Dependent Name",
        type: "string",
      },
      dob: {
        title: "Date Of Birth",
        type: "string",
      },
      gender: {
        title: "Gender",
        type: "string",
      },
      relationship: {
        title: "Relationship",
        type: "string",
      },
    },
  };

  constructor(
    private formService: QuestionControlService,
    private http: HttpService,
    private messageDialogService: MessageDialogService,
    private searchService: SearchService,
    private router: Router,
    private route: ActivatedRoute,
    private lookupService: LookupService
  ) {}

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.staffFormData.properties,
      {}
    );
    this.staffForm = formResult.form;
    this.questions = formResult.questions;
    //Search Type Dropdown
    this.http
      .get(ApiConstants.getstaffdependentsearchtype())
      .pipe(takeUntil(this._destroying$))
      .subscribe((res: any) => {
        this.staffDependentTypeList = res;
        this.questions[0].options = this.staffDependentTypeList.map((l) => {
          return { title: l.name, value: l.id };
        });
      });
    this.staffForm.controls["organisation"].setValue("1");
    this.searchService.searchTrigger
      .pipe(takeUntil(this._destroying$))
      .subscribe(async (formdata: any) => {
        console.log(formdata);
        this.router.navigate([], {
          queryParams: {},
          relativeTo: this.route,
        });
        const lookupdata = await this.lookupService.searchPatient(formdata);
        // console.log(lookupdata[0]);
      });
  }

  ngAfterViewInit(): void {
    //this.staffForm.controls["organisation"].valueChanges.subscribe((value: any) => { this.org = value; this.enableSearchBtn() })
    this.staffForm.controls["employeeCode"].valueChanges.subscribe(
      (value: any) => {
        this.code = value;
        this.enableSearchBtn();
      }
    );
    this.staffForm.controls["employeeName"].valueChanges.subscribe(
      (value: any) => {
        this.ename = value;
        this.enableSearchBtn();
      }
    );
  }
  enableSearchBtn() {
    if (this.code !== "" || this.ename !== "") {
      this.searchbtn = false;
      console.log(this.searchbtn, "tst");
    } else {
      this.searchbtn = true;
    }
  }
  staffColumnClick(event: any) {
    setTimeout(() => {
      this.rowData = event;
      if (this.staffDetail.length > 1) {
        this.staffDeptDetails = [];
        this.selectedCode = event.row.empCode;
        this.http
          .get(
            ApiConstants.getstaffdependentdetails(
              this.staffForm.value.organisation,
              this.selectedCode,
              ""
            )
          )
          .pipe(takeUntil(this._destroying$))
          .subscribe((res: any) => {
            console.log(res.dtsStaffDependentDetails, "re");
            this.staffDeptDetails = res.dtsStaffDependentDetails;
            for (var i = 0; i < this.staffDeptDetails.length; i++) {
              console.log(this.staffDeptDetails[i].dob, "dob");
              //this.staffDetail[i].sNo = i + 1;
              this.staffDeptDetails[i].dob = moment(
                this.staffDeptDetails[i].dob
              ).format("DD/MM/YYYY");
              this.staffDeptDetails[i].doj = moment(
                this.staffDeptDetails[i].doj
              ).format("DD/MM/YYYY");
              if (
                moment(this.staffDeptDetails[i].dob).format("DD/MM/YYYY") ===
                "Invalid date"
              ) {
                this.staffDeptDetails[i].dob = "";
              }
              if (
                moment(this.staffDeptDetails[i].doj).format("DD/MM/YYYY") ===
                "Invalid date"
              ) {
                this.staffDeptDetails[i].doj = "";
              }
              if (
                this.staffDeptDetails[i].gender === "M" ||
                this.staffDeptDetails[i].gender === "m"
              ) {
                this.staffDeptDetails[i].gender = "Male";
              } else if (
                this.staffDeptDetails[i].gender === "F" ||
                this.staffDeptDetails[i].gender === "f"
              ) {
                this.staffDeptDetails[i].gender = "Female";
              }
            }
            console.log(this.staffDeptDetails);
          });
      }
    });
  }
  clear() {
    this.searchbtn = true;
    this.staffDeptDetails = [];
    this.staffDetail = [];
    this.staffForm.controls["organisation"].setValue("1");
    this.staffForm.controls["employeeCode"].setValue("");
    this.staffForm.controls["employeeName"].setValue("");
  }
  search() {
    this.staffDetail = [];
    this.staffDeptDetails = [];

    if (this.staffForm.value.organisation === "") {
      this.messageDialogService.info("Select Search Type");
    }
    if (
      this.staffForm.value.employeeCode === "" &&
      this.staffForm.value.employeeName === ""
    ) {
      this.messageDialogService.info(
        "At least one information is required to search."
      );
    } else {
      var employeeCode = String(this.staffForm.value.employeeCode.trim());
      var employeeName = String(this.staffForm.value.employeeName.trim());

      this.http
        .get(
          ApiConstants.getstaffdependentdetails(
            this.staffForm.value.organisation,
            employeeCode,
            employeeName
          )
        )
        .pipe(takeUntil(this._destroying$))
        .subscribe((res: any) => {
          if (res)
            this.staffDetail = res.dtsStaffDependentDetails.filter(
              (s: any) => s.relationship == "Self"
            );
          for (var i = 0; i < this.staffDetail.length; i++) {
            console.log(this.staffDetail[i].dob, "dob");
            this.staffDetail[i].sNo = i + 1;
            this.staffDetail[i].dob = moment(this.staffDetail[i].dob).format(
              "DD/MM/YYYY"
            );
            this.staffDetail[i].doj = moment(this.staffDetail[i].doj).format(
              "DD/MM/YYYY"
            );
            if (
              moment(this.staffDetail[i].dob).format("DD/MM/YYYY") ===
              "Invalid date"
            ) {
              this.staffDetail[i].dob = "";
            }
            if (
              moment(this.staffDetail[i].doj).format("DD/MM/YYYY") ===
              "Invalid date"
            ) {
              this.staffDetail[i].doj = "";
            }
            if (
              this.staffDetail[i].gender === "M" ||
              this.staffDetail[i].gender === "m"
            ) {
              this.staffDetail[i].gender = "Male";
            } else if (
              this.staffDetail[i].gender === "F" ||
              this.staffDetail[i].gender === "f"
            ) {
              this.staffDetail[i].gender = "Female";
            }
          }
          if (this.staffDetail.length === 1) {
            this.staffDeptDetails = res.dtsStaffDependentDetails;
          }
        });
    }
  }
}
