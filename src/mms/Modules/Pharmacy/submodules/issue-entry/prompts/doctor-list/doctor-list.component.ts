import { Component, OnInit, ViewChild, OnDestroy, Inject } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { QuestionControlService } from "@shared/v2/ui/dynamic-forms/service/question-control.service";
import { HttpService } from "@shared/v2/services/http.service";
import { CookieService } from "@shared/v2/services/cookie.service";
import {
  debounceTime,
  tap,
  switchMap,
  finalize,
  distinctUntilChanged,
  filter,
  catchError,
  takeUntil,
} from "rxjs/operators";
import { of, Subject } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";

import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { PharmacyApiConstants } from "../../../../../../core/constants/pharmacyApiConstant";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
@Component({
  selector: "doctor-list",
  templateUrl: "./doctor-list.component.html",
  styleUrls: ["./doctor-list.component.scss"],
})
export class DoctorListComponent implements OnInit {
  public doctortype = 1;
  private readonly _destroying$ = new Subject<void>();
  config: any = {
    selectBox: false,
    clickedRows: true,
    clickSelection: "single",
    displayedColumns: ["name", "specialisation"],
    columnsInfo: {
      name: {
        title: "Doctor Name",
        type: "string",
      },
      specialisation: {
        title: "Specialisation",
        type: "string",
      },
    },
  };

  doctorFormData = {
    title: "",
    type: "object",
    properties: {
      search: {
        //0
        title: "",
        type: "search",
        placeholder: "Search Docotor",
      },
    },
  };
  doctorform: any;
  doctorsFormData = this.doctorFormData; //BillingStaticConstants.billiPatientForm;
  doctorformGroup!: FormGroup;

  @ViewChild("doctortable") doctableRows: any;
  doctortable: any;
  public doctorList: any = [];
  doctorSelected: any;
  constructor(
    private formService: QuestionControlService,
    private http: HttpService,
    private router: Router,
    private route: ActivatedRoute,
    private _bottomSheet: MatBottomSheet
  ) {}

  ngOnInit(): void {
    this.doctortype = 1;
    this.formInit();
    this.showInternalDoctor();
  }
  ngAfterViewInit() {
    this.doctableRows.selection.changed.subscribe((res: any) => {
      this.doctorSelected = res["added"][0].name;
      this._bottomSheet.dismiss(this.doctorSelected);
    });
  }
  formInit() {
    let doctorformResult: any = this.formService.createForm(
      this.doctorsFormData.properties,
      {}
    );
    this.doctorformGroup = doctorformResult.form;
    this.doctorform = doctorformResult.questions;
  }
  showInternalDoctor() {
    this.doctortype = 1;
    this.http
      .get(PharmacyApiConstants.getreferraldoctor(1, ""))
      .pipe(takeUntil(this._destroying$))
      .subscribe((res: any) => {
        this.doctorList = res;
      });
  }
  showExternalDoctor() {
    this.doctortype = 2;
    this.http
      .get(PharmacyApiConstants.getreferraldoctor(2, ""))
      .pipe(takeUntil(this._destroying$))
      .subscribe((res: any) => {
        this.doctorList = res;
      });
  }
  closeDoctorList() {
    this._bottomSheet.dismiss();
  }
}
