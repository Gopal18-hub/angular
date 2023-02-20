import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
// import { MatBottomSheet } from "@angular/material/bottom-sheet";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { CookieService } from "@shared/v2/services/cookie.service";
import { HttpService } from "@shared/v2/services/http.service";
import { QuestionControlService } from "@shared/v2/ui/dynamic-forms/service/question-control.service";
import { Subject, takeUntil } from "rxjs";
import { PatientDetails } from "../../../../../core/models/patientDetailsModel.Model";
import { PatientApiConstants } from "../../../../../core/constants/patientApiConstant";
import { CommonApiConstants } from "../../../../../core/constants/commonApiConstant";
import { BillingApiConstants } from "../../../../../core/constants/billingApiConstant";
import { AgetypeModel } from "../../../../../core/models/ageTypeModel.Model";
import { GenderModel } from "../../../../../core/models/genderModel.Model";
import { IssueEntryService } from "../../../../../core/services/issue-entry.service";
import { EwspatientPopupComponent } from "../prompts/ewspatient-popup/ewspatient-popup.component";
import { SnackBarService } from "@shared/v2/ui/snack-bar/snack-bar.service";
import { SimilarSoundPatientResponse } from "../../../../../core/models/getsimilarsound.Model";
import { ReportService } from "@shared/services/report.service";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { DoctorListComponent } from "../prompts/doctor-list/doctor-list.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { SearchService } from "@shared/v2/services/search.service";
import { PatientDuePopupComponent } from "../prompts/patientdue-popup/patientdue-popupcomponent";

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
        pattern: "[A-Za-z]+\\.[0-9]+",
      },
      mobile: {
        //1
        type: "tel",
        title: "Mobile No",
        required: true,
        pattern: "^[1-9]{1}[0-9]{9}",
      },
      patientName: {
        //2
        type: "string",
        title: "Name",
        required: true,
        pattern: "^[a-zA-Z '']*.?[a-zA-Z '']*$",
        onlyKeyPressAlpha: true,
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
        title: "Type", //Age Type
        type: "dropdown",
        placeholder: "--Select--",
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
        type: "string",
        required: true,
        readonly: true,
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
      doctorMobile: {
        title: "Doctor Mobile ",
        type: "tel",
        pattern: "^[1-9]{1}[0-9]{9}",
      },
      doctorAddress: {
        title: "Doctor Address ",
        type: "string",
      },
    },
  };
  patientform: any;
  patientFormData = this.issueEntryFormData;
  patientformGroup!: FormGroup;
  isRegPatient: boolean = false;
  isEWSPatient: boolean = false;
  isCGHSPatient: boolean = false;
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
  maxIDSearch: boolean = false;
  maxId: string = "";
  mobile: string = "";
  apiProcessing: boolean = false;
  expiredPatient: boolean = false;
  public patientDetails!: PatientDetails;
  MaxIDExist: boolean = false;
  similarContactPatientList: SimilarSoundPatientResponse[] = [];
  phoneNumberFlag: boolean = false;
  isPatientdetailModified: boolean = false;
  constructor(
    private formService: QuestionControlService,
    private http: HttpService,
    private router: Router,
    private route: ActivatedRoute,
    public matDialog: MatDialog,
    private _bottomSheet: MatBottomSheet,
    private cookie: CookieService,
    public issueEntryService: IssueEntryService,
    private reportService: ReportService,
    public snackbarService: SnackBarService,
    private searchService: SearchService,
    private _matSnackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.showInfoSection = false;
    this.isEWSPatient = false;
    this.isCGHSPatient = false;
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
    this.maxIDSearch = false;
    this.MaxIDExist = false;
    this.maxId = "";
    this.mobile = "";
    this.formInit();
  }

  ngAfterViewInit(): void {
    if (this.issueEntryService.billType == 1) {
      this.patientform[0].required = false;
    } else {
      this.patientform[0].required = true;
    }
    this.formEvents();
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
    this.getAllCompany();
    if (this.issueEntryService.billType == 1) {
      this.patientform[0].required = false;
    } else {
      this.patientform[0].required = true;
    }

    this.searchService.searchTrigger
      .pipe(takeUntil(this._destroying$))
      .subscribe((formdata: any) => {
        let searchResult = formdata.data;
        let regNumber = Number(searchResult.maxID.split(".")[1]);
        //HANDLING IF MAX ID IS NOT PRESENT
        if (regNumber != 0) {
          this.getPatientDetailsByMaxId(searchResult.maxID);
        } else if (searchResult.phone != "") {
          this.getSimilarPatientDetails(searchResult.phone);
        }
        // this.searchhotlisting(formdata.data);
      });

    this.patientformGroup.controls["maxid"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value: any) => {
        if (value == "") {
          this.valueClear();
        }
      });

    this.patientformGroup.controls["mobile"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value: any) => {
        if (value == "") {
          this.valueClear();
        }
      });
  }

  //AGE TYPE LIST
  getAgeTypeList() {
    this.http
      .get(CommonApiConstants.ageTypeLookUp)
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
      .get(CommonApiConstants.genderLookUp)
      .pipe(takeUntil(this._destroying$))
      .subscribe((resultData: any) => {
        this.genderList = resultData;
        // this.genderList.unshift({ id: 0, name: "-Select-" });
        this.patientform[5].options = this.genderList.map((l) => {
          return { title: l.name, value: l.id };
        });
      });
  }

  getAllCompany() {
    this.http
      .get(
        CommonApiConstants.getcompanydetail(
          Number(this.cookie.get("HSPLocationId"))
        )
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe((data: any[]) => {
        this.patientform[8].options = data.map((a: any) => {
          return { title: a.name, value: a.id, company: a };
        });
        this.patientform[8] = { ...this.patientform[8] };
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
    this.router.navigate([], {
      queryParams: {},
      relativeTo: this.route,
    });
    this.patientform[0].required = false;
  }
  showRegSubPanel() {
    this.issueEntryService.billType = 2;
    this.isRegPatient = true;
    this.isShowCompany = true;
    this.patientform[0].required = true;
    this._destroying$.next(undefined);
    this._destroying$.complete();
    this.flushAllObjects();
    this.formInit();
  }
  submit() {
    let isFormValid = this.validateForm();
  }

  // async validateForm(): Promise<boolean> {
  validateForm(): boolean {
    let validationerror = false;
    if (!validationerror) {
      // if (this.maxIDSearch) {
      if (this.patientformGroup.value.maxid) {
        let regNumber = Number(this.patientformGroup.value.maxid.split(".")[1]);
        //HANDLING IF MAX ID IS NOT PRESENT
        if (regNumber != 0) {
          let iacode = this.patientformGroup.value.maxid.split(".")[0];
        } else {
          if (this.issueEntryService.billType == 1) {
            this.patientformGroup.controls["maxid"].setErrors(null);
          } else {
            this.patientformGroup.controls["maxid"].setErrors({
              required: true,
            });
            this.patientform[0].customErrorMessage = "Invalid Max ID";
            this.patientformGroup.controls["maxid"].markAsTouched();
          }
        }
      }
      // }
    }

    if (!this.patientformGroup.value.mobile) {
      this.patientformGroup.controls["mobile"].setValue("");
      this.patientformGroup.controls["mobile"].markAsTouched();
    }
    //patient name field validation
    if (!this.patientformGroup.controls["patientName"].value) {
      validationerror = true;
      this.patientformGroup.controls["patientName"].setValue("");
      this.patientformGroup.controls["patientName"].markAsTouched();
    } else {
      validationerror = false;
    }
    //patient Age Validation
    // if (!validationerror) {
    if (!this.patientformGroup.controls["patienAge"].value) {
      validationerror = true;
      this.patientformGroup.controls["patienAge"].setValue("");
      this.patientformGroup.controls["patienAge"].markAsTouched();
    } else {
      validationerror = false;
    }
    // }

    //AgeType Validation
    // if (!validationerror) {
    if (!this.patientformGroup.controls["ageType"].value) {
      validationerror = true;
      this.patientformGroup.controls["ageType"].setValue("");
      this.patientformGroup.controls["ageType"].markAsTouched();
    } else {
      validationerror = false;
    }
    // }

    //Gender Validation
    // if (!validationerror) {
    if (!this.patientformGroup.controls["gender"].value) {
      validationerror = true;
      this.patientformGroup.controls["gender"].setValue("");
      this.patientformGroup.controls["gender"].markAsTouched();
    } else {
      validationerror = false;
    }
    // }

    //Address Validation
    // if (!validationerror) {
    if (!this.patientformGroup.controls["patienAddress"].value) {
      validationerror = true;
      this.patientformGroup.controls["patienAddress"].setValue("");
      this.patientformGroup.controls["patienAddress"].markAsTouched();
    } else {
      validationerror = false;
    }
    // }

    //Doctor Validation
    // if (!validationerror) {
    if (!this.patientformGroup.controls["doctorName"].value) {
      validationerror = true;
      this.patientformGroup.controls["doctorName"].setValue("");
      this.patientformGroup.controls["doctorName"].markAsTouched();
    } else {
      validationerror = false;
    }
    // }

    return validationerror;
  }

  flushAllObjects() {
    this.categoryIcons = [];
    this.showInfoSection = false;
    this.isEWSPatient = false;
    this.isCGHSPatient = false;
    this.MaxIDExist = false;
    this.patientformGroup.controls["mobile"].setValue("");
    this.patientformGroup.controls["patientName"].setValue("");
    this.patientformGroup.controls["patienAge"].setValue("");
    this.patientformGroup.controls["ageType"].setValue("");
    this.patientformGroup.controls["gender"].setValue("");
    this.patientformGroup.controls["patienAddress"].setValue("");
  }
  reset() {
    // this.formProcessingFlag = true;
    this.patientform = [];
    this.showInfoSection = false;
    this.maxIDSearch = false;
    this.maxId = "";
    this.mobile = "";
    this.issueEntryService.billType = 1;
    this.isRegPatient = false;
    this.isShowCompany = false;
    this.MaxIDExist = false;
    this.cashInfo = "C";
    this.hotlistInfo = "H";
    this.noteInfo = "N";
    this.vipInfo = "VIP";
    this.hwcinfo = "HWC";
    this.cghsInfo = "CGHS";
    this.ewsInfo = "EWS";
    this.psuInfo = "PSU";
    this.isEWSPatient = false;
    this.isCGHSPatient = false;
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

  formEvents() {
    //ON MAXID CHANGE
    this.patientform[0].elementRef.addEventListener(
      "keypress",
      (event: any) => {
        // If the user presses the "Enter" key on the keyboard
        if (event.key === "Enter") {
          // Cancel the default action, if needed
          event.preventDefault();
          this.maxIDSearch = true;
          if (this.maxId != this.patientformGroup.value.maxid)
            this.getPatientDetailsByMaxId(this.patientformGroup.value.maxid);
        }
      }
    );

    //ON MAXID CHANGE
    this.patientform[0].elementRef.addEventListener(
      "change",
      this.MarkasMaxIDChange.bind(this)
    );

    this.patientform[0].elementRef.addEventListener(
      "blur",
      this.onMaxIDChange.bind(this)
    );

    this.patientform[1].elementRef.addEventListener(
      "blur",
      this.onPhoneModify.bind(this)
    );

    //ENTER EVENT ON PHONE NUMBER
    this.patientform[1].elementRef.addEventListener(
      "keypress",
      (event: any) => {
        // If the user presses the "Enter" key on the keyboard
        if (event.key === "Enter") {
          // Cancel the default action, if needed
          event.preventDefault();
          this.onEnterPhoneModify();
        }
      }
    );

    // this.patientform[4].elementRef.addEventListener(
    //   "blur",
    //   this.onAgeTypeChange.bind(this)
    // );
  }

  MarkasMaxIDChange() {
    this.maxIDSearch = true;
  }

  valueClear() {
    // if (this.maxId != this.patientformGroup.value.maxid) {
    // this.patientformGroup.controls["maxid"].setValue("");
    this.patientformGroup.controls["mobile"].setValue("");
    this.patientformGroup.controls["patientName"].setValue("");
    this.patientformGroup.controls["patienAge"].setValue("");
    this.patientformGroup.controls["ageType"].setValue("");
    this.patientformGroup.controls["gender"].setValue("");
    this.patientformGroup.controls["patienAddress"].setValue("");
    this.patientform[1].readonly = false;
    this.showInfoSection = false;
    this.isRegPatient = false;
    this.MaxIDExist = false;
    this.maxId = this.patientformGroup.value.maxid;
    this.mobile = this.patientformGroup.value.mobile;
    // this.patientformGroup.controls["maxid"].setValue("");
    // this.patientformGroup.controls["maxid"].setValue(
    //   this.cookie.get("LocationIACode") + "."
    // );
    // }
  }
  onMaxIDChange() {
    this.maxIDSearch = true;
    if (this.maxId != this.patientformGroup.value.maxid)
      this.getPatientDetailsByMaxId(this.patientformGroup.value.maxid);
  }

  onAgeTypeChange() {
    let ageType = this.patientformGroup.value.ageType;
    if (ageType == "") {
      this.patientformGroup.controls["ageType"].setErrors({
        incorrect: true,
      });
      this.patientform[4].customErrorMessage = "AgeType is required";
    }
  }

  //Get Patient Details by Max ID
  async getPatientDetailsByMaxId(maxId: string) {
    this.apiProcessing = true;

    //let regNumber = Number(this.patientformGroup.value.maxid.split(".")[1]);
    let regNumber = Number(maxId.split(".")[1]);

    let iaCode = this.cookie.get("LocationIACode") + ".";
    // maxId.search(iaCode) != -1 &&
    //HANDLING IF MAX ID IS NOT PRESENT
    if (regNumber != 0) {
      let iacode = this.patientformGroup.value.maxid.split(".")[0];
      const expiredStatus = await this.checkPatientExpired(iacode, regNumber);
      if (expiredStatus) {
        this.expiredPatient = true;
        this.apiProcessing = false;
        this.snackbarService.showSnackBar(
          "Patient is an Expired Patient!",
          "error",
          ""
        );
      } else {
        this.expiredPatient = false;
      }
      this.http
        .get(PatientApiConstants.patientDetails(regNumber, iacode))
        .pipe(takeUntil(this._destroying$))
        .subscribe(
          (resultData: PatientDetails) => {
            if (!resultData) {
              this.apiProcessing = false;
              // this.messageDialogService.info(error.error);
              this.router.navigate([], {
                queryParams: {},
                relativeTo: this.route,
              });
              this.flushAllObjects();
              this.patientformGroup.controls["maxid"].setValue(
                iacode + "." + regNumber
              );
              this.patientformGroup.controls["maxid"].setErrors({
                incorrect: true,
              });
              this.patientform[0].customErrorMessage = "Invalid Max ID";
              this.patientform[1].readonly = false;
              this.patientform[1].elementRef.focus();
              this.patientform.markAsDirty();
              this.MaxIDExist = false;
              //this.clear();
              // this.maxIDChangeCall = false;
            } else {
              //added for modify issue - even though Mobile no not changed
              this.patientform[1].elementRef.blur();
              this.flushAllObjects();
              // this.maxIDChangeCall = true;
              this.patientDetails = resultData;
              this.apiProcessing = false;
              this.isRegPatient = true;
              this.maxId = this.patientformGroup.value.maxid;
              this.categoryIcons =
                this.issueEntryService.getCategoryIconsForPatient(
                  this.patientDetails
                );
              if (this.categoryIcons.length != 0) {
                this.showInfoSection = true;
                this.categoryIcons.forEach((icon: any) => {
                  if (icon.tooltip === "EWS") {
                    this.isEWSPatient = true;
                    // let ewsContent = EwspatientPopupComponent;
                    // this.snackbarService.showSnackBar(
                    //   "Patient is an Expired Patient!",
                    //   "error",
                    //   ""
                    // );
                    this.issueEntryService.bplCardNo =
                      this.patientDetails.bplCardNo;
                    this.issueEntryService.addressonCard =
                      this.patientDetails.addressOnCard;
                    if (this.isEWSPatient) {
                      this._matSnackBar.openFromComponent(
                        EwspatientPopupComponent,
                        {
                          data: {
                            // message: message,
                            // actionOne: { name: actionBtnOne, class: "btn-primary" },
                            // actionTwo: { name: actionBtnTwo, class: "" },
                            // onActionCB: callBack,
                            // isSingleLine: true,
                            // showCloseIcon,
                          },
                          panelClass: "info",
                          // ...this.defaultSBOptions,
                        }
                      );
                    }
                  } else if (icon.tooltip === "CGHS") {
                    this.isCGHSPatient = true;
                  }
                });
              } else {
                this.showInfoSection = false;
              }

              if (this.patientDetails.dueAmount != 0) {
                // this.showDueAmountPopup();
                this.issueEntryService.dueAmount =
                  this.patientDetails.dueAmount;
                this._bottomSheet
                  .open(PatientDuePopupComponent, {
                    panelClass: "custom-width",
                  })
                  .afterDismissed()
                  .subscribe((response) => {
                    // console.log("due-response", response);
                  });
              }
              this.MaxIDExist = true;
              //RESOPONSE DATA BINDING WITH CONTROLS
              this.setValuesToOPRegForm(this.patientDetails);

              //added timeout for address clear issue
              // setTimeout(() => {
              //   this.maxIDChangeCall = false;
              // }, 2000);
              this.maxIDSearch = false;
            }
          },
          (error) => {
            this.apiProcessing = false;
            if (error.error == "Patient Not found") {
              // this.messageDialogService.info(error.error);
              this.router.navigate([], {
                queryParams: {},
                relativeTo: this.route,
              });
              this.flushAllObjects();
              this.patientformGroup.controls["maxid"].setValue(
                iacode + "." + regNumber
              );
              this.patientformGroup.controls["maxid"].setErrors({
                incorrect: true,
              });
              this.patientform[0].customErrorMessage = "Invalid Max ID";
              this.patientform[1].readonly = false;
            }
            //this.clear();
            // this.maxIDChangeCall = false;
          }
        );
    } else {
      this.apiProcessing = false;
      this.patientform[1].readonly = false;
      this.patientformGroup.controls["maxid"].setErrors({
        incorrect: true,
      });
      this.patientform[0].customErrorMessage = "Invalid Max ID";
      this.flushAllObjects();
    }
  }

  async checkPatientExpired(iacode: string, regNumber: number) {
    const res = await this.http
      .get(
        BillingApiConstants.getforegexpiredpatientdetails(
          iacode,
          Number(regNumber)
        )
      )
      .toPromise()
      .catch(() => {
        return;
      });
    if (res == null || res == undefined) {
      return false;
    }
    if (res.length > 0) {
      if (res[0].flagexpired == 1) {
        return true;
      }
    }
    return false;
  }

  //BIND THE REGISTERED PATIENT RESPONSE TO QUESTIONS
  setValuesToOPRegForm(patientDetails: PatientDetails) {
    this.patientDetails = patientDetails;
    if (this.patientDetails?.registrationNo == 0) {
      this.patientDetails?.iaCode + ".";
    } else {
      this.patientformGroup.controls["maxid"].setValue(
        this.patientDetails?.iaCode + "." + this.patientDetails?.registrationNo
      );
    }
    this.patientformGroup.controls["mobile"].setValue(
      this.patientDetails?.mobile //pphone
    );
    this.patientform[1].readonly = true;
    this.patientformGroup.controls["patientName"].setValue(
      this.patientDetails?.name //firstname + " " + this.patientDetails?.lastName
    );
    this.patientformGroup.controls["gender"].setValue(
      this.patientDetails?.gender //sexName
    );
    this.patientformGroup.controls["patienAge"].setValue(
      this.patientDetails?.age + " " + this.patientDetails?.ageType
    );
    this.patientformGroup.controls["ageType"].setValue(
      this.patientDetails?.ageType
    );

    this.patientformGroup.controls["patienAddress"].setValue(
      patientDetails?.address //address1
    );

    //TODO
    // //FOR VIP NOTES
    // this.vip = patientDetails.vipreason;
    // this.vipdb = patientDetails.vipreason;

    // //FOR CHECKBOX
    // this.patientformGroup.controls["note"].setValue(patientDetails?.note);
    // //FOR NOTES NOTES
    // this.noteRemark = patientDetails.notereason;
    // this.noteRemarkdb = patientDetails.notereason;

    // //FOR CHECKBOX
    // this.patientformGroup.controls["hwc"].setValue(patientDetails?.hwc);
    // //FOR HWC NOTES
    // this.hwcRemark = patientDetails.hwcRemarks;
    // this.hwcRemarkdb = patientDetails.hwcRemarks;
    //TODO
    // this.categoryIcons =
    //   this.patientService.getCategoryIconsForPatient(patientDetails);

    this.apiProcessing = false;
  }

  //Patient data retrieval block based on Phone

  //CLEARING OLDER PHONE SEARCH
  onEnterPhoneModify() {
    this.similarContactPatientList = [] as any;
    this.onPhoneModify();
    this.phoneNumberFlag = true;
  }

  onPhoneModify() {
    if (
      this.patientformGroup.controls["mobile"].valid
      // && !this.maxIDChangeCall &&
      // !this.phoneNumberFlag
    ) {
      //IF EVENT HAS BEEN NOT HITTED API
      if (!this.similarSoundListPresent()) {
        if (this.checkForModifiedPatientDetail()) {
          // this.modfiedPatiendDetails.pphone = this.OPRegForm.value.mobileNumber;
        } else {
          if (this.mobile != this.patientformGroup.value.mobile)
            this.getSimilarPatientDetails(this.patientformGroup.value.mobile);
        }
      }
    }
  }
  //FLAG FOR TRIGGERED EVENT ON PHONE NUMBER
  similarSoundListPresent(): boolean {
    return this.similarContactPatientList.length > 0 ? true : false;
  }

  checkForModifiedPatientDetail() {
    this.isPatientdetailModified = false;
    if (this.MaxIDExist) {
      this.isPatientdetailModified = true;
    }
    return this.isPatientdetailModified;
  }

  getSimilarPatientDetails(mobile: number) {
    // subscribe to component event to know when to deleteconst selfDeleteSub = component.instance.deleteSelf
    this.apiProcessing = true;
    this.matDialog.closeAll();
    if (!this.MaxIDExist) {
      this.http
        .get(PatientApiConstants.similarSoundPatientDetail(mobile))
        .pipe(takeUntil(this._destroying$))
        .subscribe(
          (resultData: SimilarSoundPatientResponse[]) => {
            this.apiProcessing = false;
            this.similarContactPatientList = resultData;
            if (
              (this.similarContactPatientList.length != 0 &&
                this.similarContactPatientList.length > 1) ||
              this.similarContactPatientList[0].maxid == ""
            ) {
              this.similarDialogOpen();
            } else if (
              this.similarContactPatientList.length == 1 &&
              this.similarContactPatientList[0].maxid != ""
            ) {
              this.isRegPatient = true;
              let ageData = this.similarContactPatientList[0].age + " " + +"/";
              this.similarContactPatientList[0].ageType;

              this.patientformGroup.controls["maxid"].setValue(
                this.similarContactPatientList[0].maxid
              );
              this.patientformGroup.controls["gender"].setValue(
                this.similarContactPatientList[0].gender
              );
              this.patientformGroup.controls["mobile"].setValue(
                this.similarContactPatientList[0].phone
              );
              this.patientformGroup.controls["patienAddress"].setValue(
                this.similarContactPatientList[0].address
              );
              this.patientformGroup.controls["patienAge"].setValue(ageData);
              this.patientformGroup.controls["patientName"].setValue(
                this.similarContactPatientList[0].firstName
              );
            } else {
              console.log("no data found");
              this.snackbarService.showSnackBar("No Data Found", "info", "");
            }
            // }
          },
          (error) => {
            console.log(error);
            // this.messageDialogService.info(error.error);
          }
        );
    }
  }
  similarDialogOpen() {
    const similarSoundDialogref = this.matDialog.open(SimilarPatientDialog, {
      width: "60vw",
      height: "80vh",
      data: {
        searchResults: this.similarContactPatientList,
      },
      panelClass: ["animate__animated", "animate__slideInRight"],
      position: { right: "0px", bottom: "0px" },
    });
    similarSoundDialogref
      .afterClosed()
      .pipe(takeUntil(this._destroying$))
      .subscribe((result) => {
        if (result) {
          this.isRegPatient = true;
          let ageData =
            result.data["added"][0].age +
            " " +
            "/" +
            result.data["added"][0].ageType;
          this.patientformGroup.controls["maxid"].setValue(
            result.data["added"][0].maxid
          );
          this.patientformGroup.controls["gender"].setValue(
            result.data["added"][0].gender
          );
          this.patientformGroup.controls["mobile"].setValue(
            result.data["added"][0].phone
          );
          this.mobile = result.data["added"][0].phone;
          this.patientformGroup.controls["patienAddress"].setValue(
            result.data["added"][0].address
          );
          this.patientformGroup.controls["patienAge"].setValue(ageData);
          this.patientformGroup.controls["patientName"].setValue(
            result.data["added"][0].firstName +
              " " +
              result.data["added"][0].lastName
          );
        }
        this.similarContactPatientList = [];
      });
  }

  showDueAmountPopup() {}
  showDoctorDetails() {
    this._bottomSheet
      .open(DoctorListComponent, {
        panelClass: "custom-width",
      })
      .afterDismissed()
      .subscribe((response) => {
        this.patientformGroup.controls["doctorName"].setValue(response[0].name);

        let address;
        if (response[0].address.trim() == "" || response[0].address == null) {
          address = "NA";
        } else {
          address = response[0].address;
        }
        let mobileNo;
        if (response[0].mobile == "" || response[0].mobile == null) {
          mobileNo = "NA";
        } else {
          mobileNo = response[0].mobile;
        }
        this.mobile = response[0].mobile;
        this.patientformGroup.controls["doctorAddress"].setValue(address);
        this.patientformGroup.controls["doctorMobile"].setValue(mobileNo);
      });
  }
}

@Component({
  selector: "out-patients-op-registration",
  templateUrl: "../prompts/similar-patient-dialog/similarPatient-dialog.html",
})
export class SimilarPatientDialog {
  @ViewChild("patientDetail") tableRows: any;
  similardata: any = [];
  constructor(
    private dialogRef: MatDialogRef<SimilarPatientDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  ngOnInit(): void {
    setTimeout(() => {
      this.similardata = this.data.searchResults;
    }, 100);
  }

  ngAfterViewInit() {
    this.getMaxID();
  }

  config: any = {
    selectBox: false,
    clickedRows: true,
    clickSelection: "single",
    displayedColumns: [
      "maxid",
      "firstName",
      "lastName",
      "phone",
      "address",
      "age",
      "gender",
    ],
    columnsInfo: {
      maxid: {
        title: "Max ID",
        type: "string",
        style: {
          width: "120px",
        },
      },
      firstName: {
        title: "First Name",
        type: "string",
      },
      lastName: {
        title: "Last Name",
        type: "string",
      },
      phone: {
        title: "Phone No. ",
        type: "string",
      },
      address: {
        title: "Address ",
        type: "string",
        style: {
          width: "150px",
        },
        tooltipColumn: "address",
      },
      age: {
        title: "Age ",
        type: "string",
        style: {
          width: "90px",
        },
      },
      gender: {
        title: "Gender",
        type: "string",
        style: {
          width: "70px",
        },
      },
    },
  };

  getMaxID() {
    this.tableRows.selection.changed.subscribe((res: any) => {
      this.dialogRef.close({ data: res });
    });
  }
}
