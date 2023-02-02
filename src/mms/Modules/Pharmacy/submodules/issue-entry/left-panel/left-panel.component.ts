import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { CookieService } from "@shared/v2/services/cookie.service";
import { HttpService } from "@shared/v2/services/http.service";
import { QuestionControlService } from "@shared/v2/ui/dynamic-forms/service/question-control.service";
import { MaxHealthSnackBarService } from "@shared/v2/ui/snack-bar";
import { Subject, takeUntil } from "rxjs";
import { PharmacyApiConstants } from "../../../../../core/constants/pharmacyApiConstant";
import { AgetypeModel } from "../../../../../core/models/ageTypeModel.Model";
import { GenderModel } from "../../../../../core/models/genderModel.Model";
import { IssueEntryService } from "../../../../../core/services/issue-entry.service";

@Component({
  selector: "issue-entry-left-panel",
  templateUrl: "./left-panel.component.html",
  styleUrls: ["./left-panel.component.scss"],
})
export class LeftPanelComponent implements OnInit {
  public ageTypeList: AgetypeModel[] = [];
  public genderList: GenderModel[] = [];
  private readonly _destroying$ = new Subject<void>();
  issueEntryFormData = {
    title: "",
    type: "object",
    properties: {
      maxid: {
        //0
        title: "Max ID",
        type: "string",
        required: true,
        defaultValue: this.cookie.get("LocationIACode") + ".", //MaxHealthStorage.getCookie("LocationIACode") + ".",
      },
      mobile: {
        //1
        type: "tel",
        title: "Mobile No",
        required: true,
        pattern: "^[1-9]{1}[0-9]{9}",
      },
      patienName: {
        //2
        type: "pattern_string",
        title: "Name",
        required: true,
        pattern: "^[a-zA-Z0-9 ]*$",
        capitalizeText: true,
      },
      patienAge: {
        //3
        title: "Age",
        type: "string",
        required: true,
        pattern: "[0-9]{1,3}",
      },
      ageType: {
        //4
        title: "", //Age Type
        type: "dropdown",
        required: true,
        options: this.ageTypeList,
      },
      gender: {
        //5
        title: "Gender ",
        type: "dropdown",
        placeholder: "--Select--",
        required: true,
        options: this.genderList,
      },
      patienAddress: {
        //6
        title: "Address",
        type: "textarea",
        required: true,
        pattern: "^[A-Za-z0-9]{1}[A-Za-z0-9. '',/|`~!@#$%^&*()-]{1,49}",
      },
      doctorName: {
        //7
        title: "Doctor Name ",
        type: "autocomplete",
        placeholder: "--Select--",
        required: true,
      },
      companyName: {
        //8
        title: "Company Name ",
        type: "autocomplete",
        required: true,
      },
      remarks: {
        //9
        title: "Remarks ",
        type: "textarea",
        required: false,
      },
    },
  };
  patientform: any;
  patientFormData = this.issueEntryFormData;
  patientformGroup!: FormGroup;
  isRegPatient: boolean = false;
  isEWSPatient: boolean = false;
  showInfoSection: boolean = false;
  isShowCompany: boolean = false;
  categoryIcons: [] = [];
  cashInfo: string = "";
  hotlistInfo: string = "";
  noteInfo: string = "";
  vipInfo: string = "";
  hwcinfo: string = "";
  cghsInfo: string = "";
  ewsInfo: string = "";
  psuInfo: string = "";
  constructor(
    private formService: QuestionControlService,
    private http: HttpService,
    private router: Router,
    private route: ActivatedRoute,
    public matDialog: MatDialog,
    private _bottomSheet: MatBottomSheet,
    private snackbar: MaxHealthSnackBarService,
    private cookie: CookieService,
    public issueEntryService: IssueEntryService
  ) {}

  ngOnInit(): void {
    this.showInfoSection = false;
    this.isEWSPatient = false;
    this.issueEntryService.billType = 1;
    this.isRegPatient = false;
    this.cashInfo = "C";
    this.hotlistInfo = "H";
    this.noteInfo = "N";
    this.vipInfo = "VIP";
    this.hwcinfo = "HWC";
    this.cghsInfo = "CGHS";
    this.ewsInfo = "EWS";
    this.psuInfo = "PSU";
    this.formInit();
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

  formInit() {
    let patientformResult: any = this.formService.createForm(
      this.patientFormData.properties,
      {}
    );
    this.patientformGroup = patientformResult.form;
    this.patientform = patientformResult.questions;
    this.getAgeTypeList();
    this.getGenderList();
  }

  //AGE TYPE LIST
  getAgeTypeList() {
    this.http
      .get(PharmacyApiConstants.ageTypeLookUp)
      .pipe(takeUntil(this._destroying$))
      .subscribe((resultData: any) => {
        this.ageTypeList = resultData;
        // this.ageTypeList.unshift({ id: 0, name: "-Select-" });
        this.patientform[4].options = this.ageTypeList.map((l) => {
          return { title: l.name, value: l.id };
        });
      });
  }

  //GENDER LIST FOR GENDER DROP DOWN
  getGenderList() {
    this.http
      .get(PharmacyApiConstants.genderLookUp)
      .pipe(takeUntil(this._destroying$))
      .subscribe((resultData: any) => {
        this.genderList = resultData;
        // this.genderList.unshift({ id: 0, name: "-Select-" });
        this.patientform[5].options = this.genderList.map((l) => {
          return { title: l.name, value: l.id };
        });
      });
  }

  showWalkinSubPanel() {
    this.issueEntryService.billType = 1;
    this.isShowCompany = false;
    this.isRegPatient = false;
    this._destroying$.next(undefined);
    this._destroying$.complete();
    this.flushAllObjects();
    this.formInit();
  }
  showRegSubPanel() {
    this.issueEntryService.billType = 2;
    this.isRegPatient = true;
    this.isShowCompany = true;
    this._destroying$.next(undefined);
    this._destroying$.complete();
    this.flushAllObjects();
    this.formInit();
  }
  flushAllObjects() {
    this.categoryIcons = [];
    this.showInfoSection = false;
    this.isEWSPatient = false;
  }
  reset() {
    // this.formProcessingFlag = true;
    this.patientform = [];
    this.showInfoSection = false;
    this.issueEntryService.billType = 1;
    this.isRegPatient = false;
    this.cashInfo = "C";
    this.hotlistInfo = "H";
    this.noteInfo = "N";
    this.vipInfo = "VIP";
    this.hwcinfo = "HWC";
    this.cghsInfo = "CGHS";
    this.ewsInfo = "EWS";
    this.psuInfo = "PSU";
    this.isEWSPatient = false;
    this._destroying$.next(undefined);
    this._destroying$.complete();
    this.router.navigate([], {
      queryParams: {},
      relativeTo: this.route,
    });
    this.flushAllObjects();
    this.formInit();
    // this.formProcessingFlag = false;
    // this.maxIDSearch = false;
    // setTimeout(() => {
    //   this.formProcessing();
    // }, 10);

    // this.clearClicked = false;
  }
}
