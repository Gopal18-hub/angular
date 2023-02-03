import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
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
import { PharmacyApiConstants } from "../../../../../core/constants/pharmacyApiConstant";
import { AgetypeModel } from "../../../../../core/models/ageTypeModel.Model";
import { GenderModel } from "../../../../../core/models/genderModel.Model";
import { IssueEntryService } from "../../../../../core/services/issue-entry.service";
import { EwspatientPopupComponent } from "../prompts/ewspatient-popup/ewspatient-popup.component";
import { SnackBarService } from "@shared/v2/ui/snack-bar/snack-bar.service";
import { SimilarSoundPatientResponse } from "../../../../../core/models/getsimilarsound.Model";
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
    public snackbarService: SnackBarService
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
    this.formInit();
  }

  ngAfterViewInit(): void {
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
    this.isCGHSPatient = false;
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
          this.getPatientDetailsByMaxId();
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

    this.patientform[4].elementRef.addEventListener(
      "blur",
      this.onAgeTypeChange.bind(this)
    );
  }

  MarkasMaxIDChange() {
    this.maxIDSearch = true;
  }

  onMaxIDChange() {
    this.maxIDSearch = true;
    this.getPatientDetailsByMaxId();
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
  async getPatientDetailsByMaxId() {
    this.apiProcessing = true;

    let regNumber = Number(this.patientformGroup.value.maxid.split(".")[1]);
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
        .get(PharmacyApiConstants.patientDetails(regNumber, iacode))
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
              this.patientform[1].elementRef.focus();
              this.patientform.markAsDirty();
              //this.clear();
              // this.maxIDChangeCall = false;
            } else {
              //added for modify issue - even though Mobile no not changed
              this.patientform[1].elementRef.blur();
              this.flushAllObjects();
              // this.maxIDChangeCall = true;
              this.patientDetails = resultData;
              this.isRegPatient = true;
              this.categoryIcons =
                this.issueEntryService.getCategoryIconsForPatient(
                  this.patientDetails
                );
              if (this.categoryIcons.length != 0) {
                this.showInfoSection = true;
                this.categoryIcons.forEach((icon: any) => {
                  if (icon.tooltip === "EWS") {
                    this.isEWSPatient = true;
                  } else if (icon.tooltip === "CGHS") {
                    this.isCGHSPatient = true;
                  }
                });
              } else {
                this.showInfoSection = false;
              }
              this.MaxIDExist = true;
              //RESOPONSE DATA BINDING WITH CONTROLS
              this.setValuesToOPRegForm(this.patientDetails);

              //added timeout for address clear issue
              // setTimeout(() => {
              //   this.maxIDChangeCall = false;
              // }, 2000);
              this.maxIDSearch = false;
              if (this.isEWSPatient) {
                this._bottomSheet.open(EwspatientPopupComponent);
              }
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
            }
            //this.clear();
            // this.maxIDChangeCall = false;
          }
        );
    } else {
      this.apiProcessing = false;
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
        PharmacyApiConstants.getforegexpiredpatientdetails(
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
    if (this.patientDetails?.registrationno == 0) {
      this.patientDetails?.iacode + ".";
    } else {
      this.patientformGroup.controls["maxid"].setValue(
        this.patientDetails?.iacode + "." + this.patientDetails?.registrationno
      );
    }
    this.patientformGroup.controls["mobile"].setValue(
      this.patientDetails?.pphone
    );
    this.patientformGroup.controls["patienName"].setValue(
      this.patientDetails?.firstname
    );
    this.patientformGroup.controls["gender"].setValue(
      this.patientDetails?.sexName
    );
    this.patientformGroup.controls["patienAge"].setValue(
      this.patientDetails?.age + " " + this.patientDetails?.ageTypeName
    );
    this.patientformGroup.controls["ageType"].setValue(
      this.patientDetails?.ageTypeName
    );

    this.patientformGroup.controls["patienAddress"].setValue(
      patientDetails?.address1
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
          this.getSimilarPatientDetails();
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

  getSimilarPatientDetails() {
    // subscribe to component event to know when to deleteconst selfDeleteSub = component.instance.deleteSelf
    this.matDialog.closeAll();
    if (!this.MaxIDExist) {
      this.http
        .post(PharmacyApiConstants.similarSoundPatientDetail, {
          phone: this.patientformGroup.value.mobile,
        })
        .pipe(takeUntil(this._destroying$))
        .subscribe(
          (resultData: SimilarSoundPatientResponse[]) => {
            this.similarContactPatientList = resultData;
            if (
              this.similarContactPatientList.length != 0 &&
              this.similarContactPatientList.length > 1
            ) {
              const similarSoundDialogref = this.matDialog.open(
                SimilarPatientDialog,
                {
                  width: "60vw",
                  height: "80vh",
                  data: {
                    searchResults: this.similarContactPatientList,
                  },
                  panelClass: ["animate__animated", "animate__slideInRight"],
                  position: { right: "0px", bottom: "0px" },
                }
              );
              similarSoundDialogref
                .afterClosed()
                .pipe(takeUntil(this._destroying$))
                .subscribe((result) => {
                  if (result) {
                    this.isRegPatient = true;

                    let ageData = result.data["added"][0].age;
                    let ageArray = ageData.split(" ");
                    let age = ageArray.slice(0, 1).toString();
                    let ageType = ageArray.slice(1, 2).toString();

                    this.patientformGroup.controls["maxid"].setValue(
                      result.data["added"][0].maxid
                    );
                    this.patientformGroup.controls["ageType"].setValue(ageType);
                    this.patientformGroup.controls["gender"].setValue(
                      result.data["added"][0].gender
                    );
                    this.patientformGroup.controls["mobile"].setValue(
                      result.data["added"][0].phone
                    );
                    this.patientformGroup.controls["patienAddress"].setValue(
                      result.data["added"][0].address
                    );
                    this.patientformGroup.controls["patienAge"].setValue(age);
                    this.patientformGroup.controls["patienName"].setValue(
                      result.data["added"][0].firstName
                    );
                  }
                  this.similarContactPatientList = [];
                });
            } else if (this.similarContactPatientList.length == 1) {
              this.isRegPatient = true;
              let ageData = this.similarContactPatientList[0].age;
              let ageArray = ageData.split(" ");
              let age = ageArray.slice(0, 1).toString();
              let ageType = ageArray.slice(1, 2).toString();

              this.patientformGroup.controls["maxid"].setValue(
                this.similarContactPatientList[0].maxid
              );
              this.patientformGroup.controls["ageType"].setValue(ageType);
              // this.patientformGroup.controls["companyName"].setValue(this.similarContactPatientList[0].maxid)
              // this.patientformGroup.controls["doctorName"].setValue(this.similarContactPatientList[0].maxid)
              this.patientformGroup.controls["gender"].setValue(
                this.similarContactPatientList[0].gender
              );
              this.patientformGroup.controls["mobile"].setValue(
                this.similarContactPatientList[0].phone
              );
              this.patientformGroup.controls["patienAddress"].setValue(
                this.similarContactPatientList[0].address
              );
              this.patientformGroup.controls["patienAge"].setValue(age);
              this.patientformGroup.controls["patienName"].setValue(
                this.similarContactPatientList[0].firstName
              );
            } else {
              console.log("no data found");
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
}

@Component({
  selector: "out-patients-op-registration",
  templateUrl: "../prompts/similar-patient-dialog/similarPatient-dialog.html",
})
export class SimilarPatientDialog {
  @ViewChild("patientDetail") tableRows: any;
  constructor(
    private dialogRef: MatDialogRef<SimilarPatientDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  ngOnInit(): void {}

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
