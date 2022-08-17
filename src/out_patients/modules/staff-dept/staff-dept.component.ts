import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QuestionControlService } from '../../../shared/ui/dynamic-forms/service/question-control.service';
import { __values } from 'tslib';
import { HttpService } from '@shared/services/http.service';
import { ApiConstants } from '../../../out_patients/core/constants/ApiConstants';
import { StaffDependentTypeModel } from "@core/models/staffDependentTypeModel.Model";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";
import { SearchService } from '@shared/services/search.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { LookupService } from '@core/services/lookup.service';

@Component({
  selector: 'out-patients-staff-dept',
  templateUrl: './staff-dept.component.html',
  styleUrls: ['./staff-dept.component.scss']
})
export class StaffDeptComponent implements OnInit {
  public staffDependentTypeList: StaffDependentTypeModel[] = [];
  staffDetail: any = [];
  staffDeptDetails: any;
  selectedCode: any;
  org = '';
  code = '';
  ename = ''
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
      }
    }
  }
  name: any;
  staffForm!: FormGroup;
  questions: any;
  staffListConfig: any = {
    actionItems: false,
    dateformat: 'dd/MM/yyyy',
    selectBox: false,
    clickedRows: true,
    clickSelection: "single",
    displayedColumns: ['sNo', 'groupCompanyName', 'empCode', 'empName', 'dob', 'gender', 'doj'],
    columnsInfo: {
      sNo: {
        title: 'S.No',
        type: 'number',
        style: {
          width: "100px",
        },
      },
      groupCompanyName: {
        title: 'Name of Organisation',
        type: 'string',
        style: {
          width: "250px",
        },
      },
      empCode: {
        title: 'Employee Code',
        type: 'string',
        style: {
          width: "200px",
        },
      },
      empName: {
        title: 'Employee Name',
        type: 'string',
        style: {
          width: "250px",
        },
      },
      dob: {
        title: 'DOB',
        type: 'date'
      },
      gender: {
        title: 'Gender',
        type: 'string'
      },
      doj: {
        title: 'DOJ',
        type: 'date'
      },
    }

  }
  staffDetailConfig: any = {
    actionItems: false,
    dateformat: 'dd/MM/yyyy',
    selectBox: false,
    displayedColumns: ['empCode', 'dependentName', 'dob', 'gender', 'relationship'],
    columnsInfo: {
      empCode: {
        title: 'Employee Code',
        type: 'string',
        style: {
          width: "240px",
        },
      },
      dependentName: {
        title: 'Dependent Name',
        type: 'string'
      },
      dob: {
        title: 'Date Of Birth',
        type: 'date'
      },
      gender: {
        title: 'Gender',
        type: 'string'
      },
      relationship: {
        title: 'Relationship',
        type: 'string'
      },

    }

  }

  constructor(private formService: QuestionControlService, private http: HttpService,
    private messageDialogService: MessageDialogService,
    private searchService: SearchService,
    private router: Router,
    private route: ActivatedRoute,
    private lookupService: LookupService) { }

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.staffFormData.properties,
      {}
    );
    this.staffForm = formResult.form;
    this.questions = formResult.questions;
    //Search Type Dropdown
    this.http.get(ApiConstants.getstaffdependentsearchtype())
      .pipe(takeUntil(this._destroying$))
      .subscribe((res: any) => {
        this.staffDependentTypeList = res;
        this.questions[0].options = this.staffDependentTypeList.map((l) => {
          return { title: l.name, value: l.id };
        });
      });
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

    this.staffForm.controls["organisation"].valueChanges.subscribe((value: any) => { this.org = value; this.enableSearchBtn() })

    this.staffForm.controls["employeeCode"].valueChanges.subscribe((value: any) => { this.code = value; this.enableSearchBtn() })
    this.staffForm.controls["employeeName"].valueChanges.subscribe((value: any) => { this.ename = value; this.enableSearchBtn() })

  }
  enableSearchBtn() {
    if (this.org !== '' && (this.code !== '' || this.ename !== '')) {
      this.searchbtn = false;
      console.log(this.searchbtn, "tst")
    }
    else {
      this.searchbtn = true;
    }
  }
  staffColumnClick(event: any) {
    if (this.staffDetail.length > 1) {
      this.staffDeptDetails = [];
      this.selectedCode = event.row.empCode;
      this.http.get(ApiConstants.getstaffdependentdetails(this.staffForm.value.organisation, this.selectedCode, ""))
        .pipe(takeUntil(this._destroying$))
        .subscribe((res: any) => {
          this.staffDeptDetails = res.dtsStaffDependentDetails
        })
    }

  }
  clear() {
    this.searchbtn = true;
    this.staffDeptDetails = [];
    this.staffDetail = [];
    this.staffForm.controls['organisation'].setValue('')
    this.staffForm.controls['employeeCode'].setValue('')
    this.staffForm.controls['employeeName'].setValue('')
  }
  search() {
    this.staffDetail = [];
    this.staffDeptDetails = [];

    if (this.staffForm.value.organisation === "") {
      this.messageDialogService.info("Select Search Type");
    }
    if (this.staffForm.value.employeeCode === "" && this.staffForm.value.employeeName === "") {
      this.messageDialogService.info("At least one information is required to search.");
    }
    else {
      var employeeCode = String(this.staffForm.value.employeeCode.trim());
      var employeeName = String(this.staffForm.value.employeeName.trim());

      this.http.get(ApiConstants.getstaffdependentdetails(this.staffForm.value.organisation, employeeCode, employeeName))
        .pipe(takeUntil(this._destroying$))
        .subscribe((res: any) => {
          if (res)
            this.staffDetail = res.dtsStaffDependentDetails.filter((s: any) => s.relationship == "Self");
          for (var i = 0; i < this.staffDetail.length; i++) {
            this.staffDetail[i].sNo = i + 1;
          }
          if (this.staffDetail.length == 1) {
            this.staffDeptDetails = res.dtsStaffDependentDetails
          }
        });
    }


  }

}
