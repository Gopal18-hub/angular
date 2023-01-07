import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ApiConstants } from "@core/constants/ApiConstants";
import { HttpService } from "@shared/services/http.service";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
  selector: "out-patients-staff-dept-dialog",
  templateUrl: "./staff-dept-dialog.component.html",
  styleUrls: ["./staff-dept-dialog.component.scss"],
})
export class StaffDeptDialogComponent implements OnInit {
  staffForm!: FormGroup;
  question: any;
  selectedCode: any = "";
  staffDetail: any = [];
  private readonly _destroying$ = new Subject<void>();

  staffFormData = {
    title: "",
    type: "object",
    properties: {
      org: {
        type: "dropdown",
        title: "Organisation",
        placeholder: "Select",
        //readonly: true,
      },
      code: {
        type: "string",
        title: "Employee Code/Name",
        //placeholder: "Select"
        //readonly: true,
      },
    },
  };
  staffFormConfig: any = {
    actionItems: false,
    //dateformat: 'dd/MM/yyyy',
    selectBox: false,
    displayedColumns: ["sNo", "empCode", "empName", "department"],
    clickedRows: true,
    clickSelection: "single",
    columnsInfo: {
      sNo: {
        title: "S.No",
        type: "string",
        style: {
          width: "10%",
        },
      },
      empCode: {
        title: "Employee Code",
        type: "string",
        style: {
          width: "20%",
        },
      },
      empName: {
        title: "Employee Name",
        type: "string",
        style: {
          width: "30%",
        },
      },
      department: {
        title: "Department",
        type: "string",
        style: {
          width: "40%",
        },
      },
    },
  };
  constructor(
    private formService: QuestionControlService,
    private http: HttpService,
    private dialogRef: MatDialogRef<StaffDeptDialogComponent>
  ) {}
  staffDependentTypeList: any = [];
  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.staffFormData.properties,
      {}
    );
    this.staffForm = formResult.form;
    this.question = formResult.questions;

    //Search Type Dropdown
    this.http
      .get(ApiConstants.getstaffdependentsearchtype())
      .pipe(takeUntil(this._destroying$))
      .subscribe((res: any) => {
        this.staffDependentTypeList = res;
        this.question[0].options = this.staffDependentTypeList.map((l: any) => {
          return { title: l.name, value: l.id };
        });
      });
    this.staffForm.controls["org"].setValue("1");
  }

  ngAfterViewInit(): void {
    this.question[1].elementRef.addEventListener("keypress", (event: any) => {
      if (event.key === "Enter") {
        let txt = String(this.staffForm.value.code.trim()).toUpperCase();
        this.http
          .get(
            ApiConstants.getstaffdependentdetails(
              this.staffForm.value.org,
              txt,
              txt
            )
          )
          .pipe(takeUntil(this._destroying$))
          .subscribe((res: any) => {
            if (res) {
              this.staffDetail = res.dtsStaffDependentDetails.filter(
                (s: any) => s.relationship == "Self"
              );
              if (this.staffDetail.length > 0) {
                for (var i = 0; i < this.staffDetail.length; i++) {
                  console.log(this.staffDetail[i].dob, "dob");
                  this.staffDetail[i].sNo = i + 1;
                }
              }
            }
          });
      }
    });
  }

  staffColumnClick(event: any) {
    setTimeout(() => {
      if (event && event.row && event.row.empCode) {
        this.selectedCode = event.row.empCode;
      } else {
        this.selectedCode = "";
      }
    });
  }
  submit() {
    this.dialogRef.close({ data: this.selectedCode });
  }

  clear() {
    this.staffForm.reset({ org: 1 });
    this.staffDetail = [];
    this.selectedCode = "";
  }
}
