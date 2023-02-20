import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { QuestionControlService } from "@shared/v2/ui/dynamic-forms/service/question-control.service";
import { HttpService } from "@shared/v2/services/http.service";
import { CookieService } from "@shared/v2/services/cookie.service";
import { distinctUntilChanged, filter, takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";

import { CommonApiConstants } from "../../../../../../core/constants/commonApiConstant";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { IssueEntryService } from "../../../../../../core/services/issue-entry.service";
@Component({
  selector: "mms-patientdue-popup",
  templateUrl: "./patientdue-popup.component.html",
  styleUrls: ["./patientdue-popup.component.scss"],
})
export class PatientDuePopupComponent implements OnInit {
  public doctortype = 1;
  private readonly _destroying$ = new Subject<void>();

  issueEntryFormData = {
    title: "",
    type: "object",
    properties: {
      ageType: {
        //4
        title: "Select Reason to Skip Due settlement", //Age Type
        type: "dropdown",
        placeholder: "--Select--",
        required: true,
        // options: this.ageTypeList,
      },
    },
  };
  patientform: any;
  patientFormData = this.issueEntryFormData;
  patientformGroup!: FormGroup;
  dueAmount!: number;
  apiProcessing: boolean = true;
  constructor(
    private formService: QuestionControlService,
    private http: HttpService,
    private _bottomSheet: MatBottomSheet,
    private cookie: CookieService,
    public issueEntryService: IssueEntryService
  ) {}

  ngOnInit() {
    this.formInit();
    this.dueAmount = this.issueEntryService.dueAmount;
  }
  ngAfterViewInit() {}
  formInit() {
    let patientformResult: any = this.formService.createForm(
      this.patientFormData.properties,
      {}
    );
    this.patientformGroup = patientformResult.form;
    this.patientform = patientformResult.questions;
  }
  closeDoctorList() {
    this._bottomSheet.dismiss();
  }
  createDoctor() {}
}
