import {
  Component,
  Inject,
  OnInit,
  NgZone,
  ViewChild,
  OnDestroy,
  HostListener,
} from "@angular/core";

import { FormGroup } from "@angular/forms";
import { ApiConstants } from "@core/constants/ApiConstants";
import { CookieService } from "@shared/services/cookie.service";
import { HttpService } from "@shared/services/http.service";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { PatientitleModel } from "@core/models/patientTitleModel.Model";
import { SourceOfInfoModel } from "@core/models/sourceOfInfoModel.Model";
import { AgetypeModel } from "@core/models/ageTypeModel.Model";
import { IdentityModel } from "@core/models/identityModel.Model";
import { GenderModel } from "@core/models/genderModel.Model";
import { NationalityModel } from "@core/models/nationalityModel.Model";
import { MasterCountryModel } from "@core/models/masterCountryModel.Model";
import { CityModel } from "@core/models/cityByStateIDModel.Model";
import { DistrictModel } from "@core/models/districtByStateIDModel.Model";
import { StateModel } from "@core/models/stateMasterModel.Model";
import { LocalityModel } from "@core/models/locationMasterModel.Model";
import { LocalityByPincodeModel } from "@core/models/localityByPincodeModel.Model";
import { PrintLabelDialogComponent } from "./print-label-dialog/print-label-dialog.component";
import { VipDialogComponent } from "./vip-dialog/vip-dialog.component";
import { HotListingDialogComponent } from "./hot-listing-dialog/hot-listing-dialog.component";
import { PatientDetails } from "@core/models/patientDetailsModel.Model";
import { patientRegistrationModel } from "@core/models/patientRegistrationModel.Model";
import { DatePipe } from "@angular/common";
import { ForeignerDialogComponent } from "./foreigner-dialog/foreigner-dialog.component";
import { ModifiedPatientDetailModel } from "@core/models/modifiedPatientDeatailModel.Model";
import { UpdatepatientModel } from "@core/models/updateopd.Model";
import { ReportService } from "@shared/services/report.service";
import { PatientService } from "@core/services/patient.service";
import { SearchService } from "@shared/services/search.service";
import { hotlistingreasonModel } from "@core/models/hotlistingreason.model";
import { FormDialogueComponent } from "@shared/ui/form-dialogue/form-dialogue.component";
import { AddressonLocalityModel } from "@core/models/addressonLocality.Model";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { AppointmentSearchDialogComponent } from "../../submodules/appointment-search/appointment-search-dialog/appointment-search-dialog.component";
import { DMSComponent } from "../dms/dms.component";
import { ModifyDialogComponent } from "@core/modify-dialog/modify-dialog.component";
import { DMSrefreshModel } from "@core/models/DMSrefresh.Model";
import { GenernicIdNameModel } from "@core/models/idNameModel.Model";
import { SimilarSoundPatientResponse } from "@core/models/getsimilarsound.Model";
import { AddressonCityModel } from "@core/models/addressByCityIDModel.Model";
import { Router, ActivatedRoute } from "@angular/router";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";
import { RegistrationDialogueComponent } from "../../../registration/submodules/op-registration/Registration-dialog/registration-dialogue/registration-dialogue.component";
import { Subject, Observable } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { MatInput } from "@angular/material/input";
import { ComponentCanDeactivate } from "@shared/services/guards/pending-change-guard.service";
import { AnyCatcher } from "rxjs/internal/AnyCatcher";
import { AnimationPlayer } from "@angular/animations";
import { TileStyler } from "@angular/material/grid-list/tile-styler";
import { LookupService } from "@core/services/lookup.service";

export interface DialogData {
  expieryDate: Date;
  issueAt: string;
  passportNum: number;
  issuedate: Date;
  hcf: { id: number; title: string };
}

@Component({
  selector: "out-patients-op-registration",
  templateUrl: "./op-registration.component.html",
  styleUrls: ["./op-registration.component.scss"],
})
export class OpRegistrationComponent implements OnInit {
  public titleList: PatientitleModel[] = [];
  public sourceOfInfoList: SourceOfInfoModel[] = [];
  public ageTypeList: AgetypeModel[] = [];
  public idTypeList: IdentityModel[] = [];
  public genderList: GenderModel[] = [];
  public nationalityList: NationalityModel[] = [];
  public patientDetails!: PatientDetails;
  countryList: MasterCountryModel[] = [];
  cityList: CityModel[] = [];
  disttList: DistrictModel[] = [];
  localityList: LocalityModel[] = [];
  localitybyCityList: LocalityModel[] = [];
  fatherSpouseOptionList: [{ title: string; value: number }] = [] as any;
  stateList: StateModel[] = [];
  expieryDate: Date | undefined;
  issueAt: string | undefined;
  passportNum: number | undefined;
  issuedate: Date | undefined;
  categoryIcons: [] = [];
  passportNo: string = "";
  isNSSHLocation: boolean = false;
  seafarerDetails: {
    HKID: string;
    Vesselname: string;
    rank: string;
    FDPGroup: string;
  } = {
    HKID: "",
    Vesselname: "",
    rank: "",
    FDPGroup: "",
  };
  today: Date = new Date(new Date().getTime() - 3888000000);

  passportDetails: {
    passportNo: string;
    IssueDate: string | null;
    Expirydate: string | null;
    Issueat: string;
    HCF: { title: string; value: number };
  } = {
    passportNo: "",
    IssueDate: "",
    Expirydate: "",
    Issueat: "",
    HCF: { title: "", value: 0 },
  };
  vip!: string;
  noteRemark!: string;
  hwcRemark!: string;
  ewsDetails: {
    bplCardNo: string;
    bplCardAddress: string;
  } = {
    bplCardNo: "",
    bplCardAddress: "",
  };
  //Added new properties for UAT defect
  vipdb!: string;
  noteRemarkdb!: string;
  hwcRemarkdb!: string;
  ewsDetailsdb: {
    bplCardNo: string;
    bplCardAddress: string;
  } = {
    bplCardNo: "",
    bplCardAddress: "",
  };
  registrationFormData = {
    title: "",
    type: "object",
    properties: {
      maxid: {
        type: "string",
        title: "Max ID",
        defaultValue: this.cookie.get("LocationIACode") + ".",
      },
      SSN: {
        type: "string",
        title: "SSN",
        readonly: true,
      },
      mobileNumber: {
        type: "tel",
        title: "Mobile Number",
        required: true,
        pattern: "^[1-9]{1}[0-9]{9}",
        // minimum:10,
        // maximum:10,
      },
      title: {
        type: "dropdown",
        title: "Title",
        required: true,
        options: this.titleList,
      },
      firstName: {
        type: "string",
        title: "First Name",
        required: true,
        pattern: "^[A-Za-z]{1}[A-Za-z. '']+",
        onlyKeyPressAlpha: true,
      },
      middleName: {
        type: "string",
        title: "Middle Name",
        required: false,
        pattern: "[A-Za-z. '']{1,32}",
        onlyKeyPressAlpha: true,
      },
      lastName: {
        type: "string",
        title: "Last Name",
        required: true,
        pattern: "[A-Za-z. '']{1,32}",
        onlyKeyPressAlpha: true,
      },
      gender: {
        type: "dropdown",
        title: "Gender",
        required: true,
        options: this.genderList,
      },
      dob: {
        type: "date",
        title: "Date of Birth",
        required: false,
        maximum: new Date(),
      },
      age: {
        type: "number",
        title: "Age",
        required: true,
        pattern: "[0-9]{1,3}",
      },
      ageType: {
        type: "dropdown",
        title: "Age Type",
        required: true,
        options: this.ageTypeList,
      },
      emailId: {
        type: "email",
        title: "Email id",
        required: true,
        pattern:
          "^[A-Za-z0-9._%+-]{1}[A-Za-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$",
      },
      fatherSpouse: {
        type: "dropdown",
        options: this.fatherSpouseOptionList,
        required: false,
      },
      fatherSpouseName: {
        type: "string",
        title: "",
        required: false,
        pattern: "^[A-Za-z]{1}[A-Za-z. '']{1,32}",
        onlyKeyPressAlpha: true,
      },
      motherName: {
        type: "string",
        title: "Mother's Name",
        required: false,
        pattern: "^[A-Za-z]{1}[A-Za-z. '']{1,32}",
        onlyKeyPressAlpha: true,
      },
      altLandlineName: {
        type: "tel",
        title: "Alt Contact/Landline",
        pattern: "[0-9+]{1}[0-9]{1,2}[0-9 ]{1}[0-9]{7,17}",
        required: false,
      },
      idenityType: {
        type: "dropdown",
        title: "Identity",
        options: this.idTypeList,
        required: false,
      },
      idenityValue: {
        type: "string",
        title: "&nbsp",
        required: false,
      },
      adhaarId: {
        type: "number",
        title: "Aadhaar ID",
        required: false,
        pattern: "^[1-9]{1}[0-9]{11}",
      },
      healthId: {
        type: "string",
        title: "Health ID",
        required: false,
      },
      address: {
        type: "string",
        title: "Address",
        // required property is dependent on country
        required: true,
        pattern: "^[A-Za-z0-9]{1}[A-Za-z0-9. '',/|`~!@#$%^&*()-]{1,32}",
      },
      pincode: {
        type: "number",
        title: "Pincode",
        // required property is dependent on country
        required: true,
      },
      locality: {
        type: "autocomplete",
        title: "Locality",
        required: true,
        options: this.localityList,
        allowSearchInput: true,
        // required property is dependent on country
      },
      localityTxt: {
        type: "string",
        title: "",
        // required property is dependent on country and text will be enabled on select of others
        required: false,
        hidden: true,
      },
      city: {
        type: "autocomplete",
        title: "City/Town",
        // required property is dependent on country
        required: true,
        options: this.cityList,
      },
      district: {
        type: "autocomplete",
        title: "District",
        // required property is dependent on country
        options: this.disttList,
        required: true,
      },
      state: {
        type: "autocomplete",
        title: "State",
        // required property is dependent on country
        required: true,
        options: this.stateList,
      },
      country: {
        type: "autocomplete",
        title: "Country",
        required: true,
        options: this.countryList,
      },
      nationality: {
        type: "autocomplete",
        title: "Nationality",
        required: true,
        options: this.nationalityList,
      },
      foreigner: {
        type: "checkbox",
        required: false,
        options: [{ title: "Foreigner" }],
      },
      seaFarer: {
        type: "checkbox",
        required: false,
        options: [{ title: "Seafarers" }],
      },
      hotlist: {
        type: "checkbox",
        required: false,
        options: [{ title: "Hot Listing" }],
      },
      vip: {
        type: "checkbox",
        required: false,
        options: [{ title: "VIP" }],
      },
      note: {
        type: "checkbox",
        required: false,
        options: [{ title: "Notes" }],
      },
      hwc: {
        type: "checkbox",
        required: false,
        options: [{ title: "HWC" }],
      },
      organdonor: {
        type: "checkbox",
        required: false,
        options: [{ title: "Organ Donor" }],
      },
      otAdvanceExclude: {
        type: "checkbox",
        required: false,
        options: [{ title: "OT Advance Exclude" }],
      },
      verifiedOnline: {
        type: "checkbox",
        required: false,
        options: [{ title: "CGHS Patient Verified Online" }],
      },
      surveySMS: {
        type: "checkbox",
        required: false,
        options: [
          { title: "Customer agrees to receive any survey SMS/Email/Calls" },
        ],
      },
      receivePromotional: {
        type: "checkbox",
        required: false,
        options: [
          { title: "Customer agrees to receive Promotional Information" },
        ],
      },
      paymentMethod: {
        type: "radio",
        required: true,
        options: [
          { title: "Cash", value: "cash" },
          { title: "PSU/Govt", value: "psu/govt" },
          { title: "EWS", value: "ews" },
          { title: "Corporate/Insurance", value: "ins" },
        ],
        defaultValue: "cash",
      },
      sourceOfInput: {
        type: "dropdown",
        title: "Source of Info about Max Healthcare",
        required: false,
        options: this.sourceOfInfoList,
      },
    },
  };

  OPRegForm!: FormGroup;
  formProcessingFlag: boolean = true;
  questions: any;
  hotlistMasterList: hotlistingreasonModel[] = [];
  hotlistquestion: any;
  hotlistRemark: any;
  hotlistRemarkdb: any;
  isPatientdetailModified: boolean = false;

  private readonly _destroying$ = new Subject<void>();

  // @HostListener allows us to also guard against browser refresh, close, etc.
  @HostListener("window:beforeunload")
  canDeactivate(): Observable<boolean> | boolean {
    return !this.OPRegForm.dirty;
  }

  constructor(
    private formService: QuestionControlService,
    private cookie: CookieService,
    private http: HttpService,
    public matDialog: MatDialog,
    private datepipe: DatePipe,
    private reportService: ReportService,
    private patientService: PatientService,
    private searchService: SearchService,
    public zone: NgZone,
    private router: Router,
    private route: ActivatedRoute,
    private messageDialogService: MessageDialogService,
    private lookupService: LookupService
  ) {}

  bool: boolean | undefined;
  ngOnInit(): void {
    this.bool = true;

    this.formInit();
    this.route.queryParams
      .pipe(takeUntil(this._destroying$))
      .subscribe((value) => {
        if (value["maxId"]) {
          this.OPRegForm.value.maxid = value["maxId"];
          this.getPatientDetailsByMaxId();
        }
      });
    this.formProcessingFlag = false;
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

  checkForMaxID() {
    if (this.MaxIDExist) {
      this.OPRegForm.controls["hotlist"].enable();
    } else {
      this.OPRegForm.controls["hotlist"].disable();
    }
  }

  checkForModifiedPatientDetail() {
    this.isPatientdetailModified = false;
    if (this.MaxIDExist) {
      this.isPatientdetailModified = true;

      // {
      //   this.isPatientdetailModified = true;
      // }
      // else{
      //   this.isPatientdetailModified = false;
      // }
    }
    return this.isPatientdetailModified;
  }
  checkForModifiedNationality() {
    this.nationalityChanged = false;
    if (this.MaxIDExist) {
      this.nationalityChanged = true;

      // {
      //   this.isPatientdetailModified = true;
      // }
      // else{
      //   this.isPatientdetailModified = false;
      // }
    }
    return this.nationalityChanged;
  }

  formInit() {
    let formResult: any = this.formService.createForm(
      this.registrationFormData.properties,
      {}
    );

    this.maxIDChangeCall = false;
    this.OPRegForm = formResult.form;
    this.questions = formResult.questions;

    this.fatherSpouseOptionList.push({ title: "-Select-", value: 0 });
    this.fatherSpouseOptionList.push({ title: "Father", value: 1 });
    this.fatherSpouseOptionList.push({ title: "Spouse", value: 2 });

    //LIST FOR FATHER/SPOUSE

    this.questions[12].options = this.fatherSpouseOptionList.map((l) => {
      return { title: l.title, value: l.value };
    });

    this.getTitleList();
    this.getSourceOfInfoList();
    this.getAgeTypeList();
    this.getIDTypeList();
    this.getGenderList();
    this.getAllNAtionalityList();
    this.getAllCountryList();
    this.getAllCityList();
    this.getAllDisttList();
    this.getAllDisttList();
    this.getAllStateList();
    this.getLocalityList();

    this.searchService.searchTrigger
      .pipe(takeUntil(this._destroying$))
      .subscribe(async (formdata: any) => {
        console.log(formdata);
        let lookupdata = await this.lookupService.searchPatient(formdata.data);
        if (lookupdata != undefined && lookupdata != null) {
          if (lookupdata["maxId"]) {
            this.OPRegForm.value.maxid = lookupdata["maxId"];
            this.getPatientDetailsByMaxId();
          }
        }
      });

    this.OPRegForm.controls["nationality"].setValue({
      title: "Indian",
      value: 149,
    });
    this.OPRegForm.controls["country"].setValue({
      title: "India",
      value: 1,
    });
    // this.OPRegForm.controls["foreigner"].disable(); // commented as UAT requirement change
    this.getStatesByCountry({ title: "India", value: 1 });
    this.getCitiesByCountry({ title: "India", value: 1 });

    this.isNSSHLocation =
      this.cookie.get("LocationIACode") == "NSSH" ? true : false;
    this.checkForMaxID();
  }

  formEvents() {
    //chnage event for email Field

    this.questions[11].elementRef.addEventListener(
      "change",
      this.onEmailModify.bind(this)
    );
    this.questions[21].elementRef.addEventListener(
      "blur",
      this.getLocalityByPinCode.bind(this)
    );

    //ENTER EVENT ON PHONE NUMBER
    this.questions[2].elementRef.addEventListener("keypress", (event: any) => {
      // If the user presses the "Enter" key on the keyboard

      if (event.key === "Enter") {
        // Cancel the default action, if needed

        event.preventDefault();

        this.onEnterPhoneModify();
      }
    });

    //chnage event for Mobile Field
    this.questions[2].elementRef.addEventListener(
      "change",
      this.onPhoneModify.bind(this)
    );

    //chnage event for FirstName
    this.questions[4].elementRef.addEventListener(
      "change",
      this.onFistNameModify.bind(this)
    );
    //chnage event for middle name
    this.questions[5].elementRef.addEventListener(
      "change",
      this.onMiddleNameModify.bind(this)
    );
    //chnage event for Last Name
    this.questions[6].elementRef.addEventListener(
      "change",
      this.onLastNameModify.bind(this)
    );
    //DOB blur event
    this.questions[8].elementRef.addEventListener(
      "blur",
      this.onageCalculator.bind(this)
    );
    this.questions[9].elementRef.addEventListener(
      "focus",
      this.onageCalculator.bind(this)
    );

    //IdenityType value change
    this.questions[17].elementRef.addEventListener(
      "blur",
      this.checkIndetityValue.bind(this)
    );

    //Father or Spouse value change
    this.questions[13].elementRef.addEventListener(
      "blur",
      this.checkFatherSpouseName.bind(this)
    );

    // nationality value chnage event to enable foreigner
    this.questions[28].elementRef.addEventListener(
      "blur",
      this.onNationalityModify.bind(this)
    );

    //ON MAXID CHANGE
    // this.questions[0].elementRef.addEventListener(
    //   "blur",
    //   this.getPatientDetailsByMaxId.bind(this)
    // );

    //ON MAXID CHANGE
    this.questions[0].elementRef.addEventListener("keypress", (event: any) => {
      // If the user presses the "Enter" key on the keyboard

      if (event.key === "Enter") {
        // Cancel the default action, if needed

        event.preventDefault();

        this.getPatientDetailsByMaxId();
      }
    });

    this.questions[21].elementRef.addEventListener(
      "blur",
      this.getLocalityByPinCode.bind(this)
    );
  }

  citybasedflow: boolean = false;
  pincodebasedflow: boolean = false;
  formProcessing() {
    this.checkForMaxID();

    // this.registeredPatiendDetails=this.patientDetails as ModifiedPatientDetailModel;
    //  if (this.maxIDChangeCall == false) {
    this.OPRegForm.controls["paymentMethod"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value: any) => {
        if (value == "ews") {
          if (this.maxIDChangeCall == false) {
            this.openEWSDialogue();
          }
        }
      });
    // }

    this.OPRegForm.controls["vip"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value: any) => {
        if (this.maxIDChangeCall == false && value) {
          this.openVipNotes();
        }
      });

    this.OPRegForm.controls["seaFarer"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value: any) => {
        if (this.maxIDChangeCall == false && value) {
          this.seafarersDetailsdialog();
        }
      });

    this.OPRegForm.controls["note"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value: any) => {
        if (this.maxIDChangeCall == false && value) {
          this.openNotes();
        }
      });
    this.OPRegForm.controls["hwc"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value: any) => {
        if (this.maxIDChangeCall == false && value) {
          this.openHWCNotes();
        }
      });
    this.OPRegForm.controls["hotlist"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value: any) => {
        if (this.maxIDChangeCall == false && value) {
          this.openHotListDialog();
        }
      });
    // this.OPRegForm.controls["foreigner"].valueChanges
    // .pipe(takeUntil(this._destroying$))
    // .subscribe((value: any) => {
    //     if (this.maxIDChangeCall == false) {
    //       this.showPassportDetails();
    //     }

    // });

    this.OPRegForm.controls["dob"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value: any) => {
        if (value != undefined && value != null && value != "" && value > 0) {
          //this.OPRegForm.controls["dob"].setValue(value);
          this.onageCalculator();
        }
      });

    //on value chnae event of age Type
    this.OPRegForm.controls["ageType"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value: any) => {
        if (value != undefined && value != null && value != "" && value > 0) {
          this.validatePatientAge();
          this.getSimilarpatientlistonagetype();
        }
      });

    this.OPRegForm.controls["pincode"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value: any) => {
        if (!this.countrybasedflow) {
          this.citybasedflow = false;
          this.pincodebasedflow = true;
          this.clearAddressOnPincodeChange();
        }
      });
    //value chnage event of country to fill city list and staelist
    this.OPRegForm.controls["country"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value: any) => {
        this.clearAddressOnCountryChange();
        if (
          this.OPRegForm.value.country.value != undefined &&
          this.OPRegForm.value.country.value != null &&
          this.OPRegForm.value.country.value != ""
        ) {
          this.getStatesByCountry(value);
          this.getCitiesByCountry(value);
          if (this.OPRegForm.value.country.value != 1) {
            this.questions[21].required = false;
            this.questions[22].required = false;
            this.questions[23].required = false;
            this.questions[24].required = false;
            this.questions[25].required = false;
            this.questions[26].required = false;
            this.questions[21] = { ...this.questions[21] };
            if (!this.OPRegForm.value.nationality.value) {
              this.OPRegForm.controls["nationality"].setValue(null);
            } else {
              this.OPRegForm.controls["nationality"].setValue({
                title: this.OPRegForm.value.nationality.title,
                value: this.OPRegForm.value.nationality.value,
              });
            }
          }
        }
      });
    //value chnage event of state to fill city list and district list
    this.OPRegForm.controls["state"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value: any) => {
        // this.clearAddressOnStateChange();
        if (
          this.OPRegForm.value.state.value != undefined &&
          this.OPRegForm.value.state.value != null &&
          this.OPRegForm.value.state.value != ""
        ) {
          this.getDistricyListByState(value);
          this.getCityListByState(value);
        }
      });

    this.OPRegForm.controls["district"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value: any) => {
        if (this.countrybasedflow && !value) {
          if (
            this.OPRegForm.value.state.value != undefined &&
            this.OPRegForm.value.state.value != null &&
            this.OPRegForm.value.state.value != ""
          ) {
            // this.clearAddressOnDistrictChange();
            this.getDistricyListByState(this.OPRegForm.value.state);
            this.getCityListByState(this.OPRegForm.value.state);
          }
        }
      });

    //city chnage event
    this.OPRegForm.controls["city"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value: any) => {
        if (value.value > 0) {
          if (
            (this.OPRegForm.value.locality.value == undefined ||
              this.OPRegForm.value.locality.value == null ||
              this.OPRegForm.value.locality.value <= 0 ||
              this.OPRegForm.value.locality.value == "") &&
            (this.OPRegForm.value.pincode == undefined ||
              this.OPRegForm.value.pincode == null ||
              this.OPRegForm.value.pincode <= 0 ||
              this.OPRegForm.value.pincode == "") &&
            (this.OPRegForm.value.state.value == undefined ||
              this.OPRegForm.value.state.value == null ||
              this.OPRegForm.value.state.value == "" ||
              this.OPRegForm.value.state.value <= 0)
          ) {
            this.citybasedflow = true;
            this.clearAddressOnCityChange();
            this.getAddressByCity(value);
          } else {
            if (this.countrybasedflow) {
              this.citybasedflow = false;
              // this.getCityListByState(this.OPRegForm.value.state);
              this.getLocalityByCity(value);
            } else if (!this.pincodebasedflow) {
              this.citybasedflow = true;
              //this.clearAddressOnCityChange();
              this.getLocalityByCity(value);
            }
          }
        }
      });

    //locality chnage event
    this.OPRegForm.controls["locality"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value: any) => {
        if (!this.maxIDChangeCall && this.countrybasedflow) {
          this.OPRegForm.controls["pincode"].setValue("");
        }
        if (
          value.value > 0 &&
          value.value != undefined &&
          value.value != null &&
          value.value != ""
        ) {
          this.addressByLocalityID(value);
        }
      });

    //on change of Title Gender needs to be changed
    this.OPRegForm.controls["title"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value: any) => {
        if (value) {
          let gender = "";
          if (
            this.OPRegForm.controls["gender"].value != undefined &&
            this.OPRegForm.controls["gender"].value != "" &&
            this.OPRegForm.controls["gender"].value != null
          ) {
            gender = this.genderList.filter(
              (g) => g.id === this.OPRegForm.controls["gender"].value
            )[0].name;
          }

          if (
            gender == "" ||
            gender == undefined ||
            gender == null ||
            gender != "Transgender"
          ) {
            let sex = this.titleList.filter((e) => e.name === value);
            if (sex.length) {
              let exists = this.genderList.filter((e) => e.id === sex[0].sex);
              this.OPRegForm.controls["gender"].setValue(exists[0].id);
            }
          }
        }
      });

    // //on change of Gender Title needs to be dafult for Transgender
    this.OPRegForm.controls["gender"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value: any) => {
        if (value) {
          let genderName = this.genderList.filter((g) => g.id === value)[0]
            .name;
          if (
            genderName != "" &&
            genderName != undefined &&
            genderName != null
          ) {
            if (genderName == "Transgender") {
              this.OPRegForm.controls["title"].setValue(0);
            }
          }
          this.onGenderModify();
        }
      });
  }

  ngAfterViewInit(): void {
    this.formProcessing();
    this.formEvents();
  }
  clearClicked: boolean = false;

  clear() {
    this.clearClicked = true;
    this.formProcessingFlag = true;
    this.questions = [];
    //this.OPRegForm = null;
    // this.OPRegForm.reset({
    //   maxid: this.cookie.get("LocationIACode") + ".",
    //   nationality: {
    //     title: "Indian",
    //     value: 149,
    //   },
    //   country: {
    //     title: "India",
    //     value: 1,
    //   },
    //   paymentMethod: "cash",
    // });
    // this.OPRegForm.markAsUntouched();
    this._destroying$.next(undefined);
    this._destroying$.complete();
    this.router.navigate([], {
      queryParams: {},
      relativeTo: this.route,
    });
    this.formInit();
    this.formProcessingFlag = false;
    setTimeout(() => {
      this.formProcessing();
    }, 10);
    this.flushAllObjects();
    //this.checkForMaxID();
    this.clearClicked = false;
  }

  flushAllObjects() {
    this.categoryIcons = [];
    this.fatherSpouseOptionList = [] as any;
    this.similarContactPatientList = [] as any;
    //CLEARING PASSPORT DETAILS
    this.passportDetails = {
      passportNo: "",
      IssueDate: "",
      Expirydate: "",
      Issueat: "",
      HCF: { title: "", value: 0 },
    };
    this.noteRemark = "";
    this.hwcRemark = "";
    this.ewsDetails = {
      bplCardNo: "",
      bplCardAddress: "",
    };
    this.hotlistReason = { title: "", value: 0 };
    this.hotlistRemark = "";
    this.vip = "";

    this.seafarerDetails = {
      HKID: "",
      Vesselname: "",
      rank: "",
      FDPGroup: "",
    };
    this.patientDetails = [] as any;
    this.modfiedPatiendDetails = [] as any;
    this.maxIDChangeCall = false;

    this.MaxIDExist = false;
  }

  //validation for Indetity Number if Identity Type Selected
  checkIndetityValue() {
    let IdenityType = this.OPRegForm.controls["idenityType"].value;
    if (
      IdenityType != null &&
      IdenityType != undefined &&
      IdenityType != "" &&
      IdenityType > 0
    ) {
      let identityTypeName = this.idTypeList.filter(
        (i) => i.id === IdenityType
      )[0].name;
      if (
        this.OPRegForm.controls["idenityValue"].value == "" ||
        this.OPRegForm.controls["idenityValue"].value == undefined ||
        this.OPRegForm.controls["idenityValue"].value == null
      ) {
        this.OPRegForm.controls["idenityValue"].setErrors({ incorrect: true });
        this.questions[17].customErrorMessage =
          "Please enter valid " + identityTypeName + " number";
      } else {
        if (identityTypeName == "Passport") {
          this.passportNo = this.OPRegForm.controls["idenityValue"].value;
        }
      }
    } else {
      this.OPRegForm.controls["idenityValue"].setErrors(null);
      this.questions[17].customErrorMessage = "";
      this.OPRegForm.controls["idenityValue"].setValue("");
    }
  }

  // vipChecked()
  // {
  //   this.OPRegForm.controls["vip"]
  //     .valueChanges.subscribe(
  //       (value: any) => {
  //         if  (value) {
  //           this.openHotListDialog();
  //         }
  //       }
  //     );

  // }
  seaferrorCLick(event: Event) {
    if (!this.OPRegForm.controls["seaFarer"].value) {
      this.seafarersDetailsdialog();
    }
  }
  foreignCLick(event: Event) {
    if (
      !this.OPRegForm.controls["foreigner"].value
      //&& this.OPRegForm.value.nationality.title.toLowerCase() != "indian" //removed condition as per UAT requirement change
    ) {
      this.showPassportDetails();
    }
  }
  hotlistClick(event: Event) {
    if (!this.OPRegForm.controls["hotlist"].value && this.MaxIDExist) {
      this.openHotListDialog();
    }
  }

  hwcClick(event: Event) {
    if (!this.OPRegForm.controls["hwc"].value) {
      this.openHWCNotes();
    }
  }

  openVIP(event: Event) {
    let flag = 0;
    console.log(this.OPRegForm.controls["vip"].value);
    if (!this.OPRegForm.controls["vip"].value) {
      this.openVipNotes();
    }
  }
  NotesClick(event: Event) {
    if (!this.OPRegForm.controls["note"].value) {
      this.openNotes();
    }
  }
  //validation for empty Father or SPouse Name if Type selected
  checkFatherSpouseName() {
    let FatherSpouse = this.OPRegForm.controls["fatherSpouse"].value;
    if (
      FatherSpouse != null &&
      FatherSpouse != undefined &&
      FatherSpouse != "" &&
      FatherSpouse > 0
    ) {
      if (
        this.OPRegForm.controls["fatherSpouseName"].value == "" ||
        this.OPRegForm.controls["fatherSpouseName"].value == undefined ||
        this.OPRegForm.controls["fatherSpouseName"].value == null
      ) {
        let selectedName = this.fatherSpouseOptionList.filter(
          (f) => f.value === FatherSpouse
        )[0].title;
        this.OPRegForm.controls["fatherSpouseName"].setErrors({
          incorrect: true,
        });
        this.questions[13].customErrorMessage =
          "Please enter " + selectedName + " name";
      }
    } else {
      this.OPRegForm.controls["fatherSpouseName"].setErrors(null);
      this.questions[13].customErrorMessage = "";
      this.OPRegForm.controls["fatherSpouseName"].setValue("");
    }
  }

  //TITLE LIST API CALL
  getTitleList() {
    let hspId = Number(this.cookie.get("HSPLocationId"));
    this.http
      .get(ApiConstants.titleLookUp(hspId))
      .pipe(takeUntil(this._destroying$))
      .subscribe((resultData: any) => {
        this.titleList = resultData;
        // this.titleList.unshift({ id: 0, name: "-Select-", sex: 0, gender: "" });
        this.questions[3].options = this.titleList.map((l) => {
          return { title: l.name, value: l.name };
        });
      });
  }
  //SOURCE OF INFO DROP DOWN
  getSourceOfInfoList() {
    this.http
      .get(ApiConstants.sourceofinfolookup)
      .pipe(takeUntil(this._destroying$))
      .subscribe((resultData: any) => {
        this.sourceOfInfoList = resultData;
        this.sourceOfInfoList.unshift({ id: 0, name: "-Select-" });
        this.questions[41].options = this.sourceOfInfoList.map((l) => {
          return { title: l.name, value: l.id };
        });
      });
  }

  //AGE TYPE LIST
  getAgeTypeList() {
    this.http
      .get(ApiConstants.ageTypeLookUp)
      .pipe(takeUntil(this._destroying$))
      .subscribe((resultData: any) => {
        this.ageTypeList = resultData;
        // this.ageTypeList.unshift({ id: 0, name: "-Select-" });
        this.questions[10].options = this.ageTypeList.map((l) => {
          return { title: l.name, value: l.id };
        });
      });
  }

  //IDENTITY TYPE LOOKUP CALL

  getIDTypeList() {
    this.http
      .get(ApiConstants.identityTypeLookUp)
      .pipe(takeUntil(this._destroying$))
      .subscribe((resultData: any) => {
        this.idTypeList = resultData;
        this.idTypeList.unshift({ id: 0, name: "-Select-" });
        this.questions[16].options = this.idTypeList.map((l) => {
          return { title: l.name, value: l.id };
        });
      });
  }

  //GENDER LIST FOR GENDER DROP DOWN
  getGenderList() {
    this.http
      .get(ApiConstants.genderLookUp)
      .pipe(takeUntil(this._destroying$))
      .subscribe((resultData: any) => {
        this.genderList = resultData;
        // this.genderList.unshift({ id: 0, name: "-Select-" });
        this.questions[7].options = this.genderList.map((l) => {
          return { title: l.name, value: l.id };
        });
      });
  }

  DMSList: DMSrefreshModel[] = [];
  dmsClicked: boolean = false;
  getPatientDMSDetail() {
    this.matDialog.closeAll();
    let arr = [] as any;
    this.http
      .get(
        ApiConstants.PatientDMSDetail(
          this.patientDetails.iacode,
          this.patientDetails.registrationno
        )
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe((resultData: DMSrefreshModel[]) => {
        this.DMSList = resultData;
        console.log(resultData);
        this.openDMSDialog(this.DMSList);
      });
    // this.OPRegForm.controls["dms"].disable();
    // this.dmsClicked=false;
  }

  similarContactPatientList: SimilarSoundPatientResponse[] = [];
  getSimilarPatientDetails() {
    // subscribe to component event to know when to deleteconst selfDeleteSub = component.instance.deleteSelf

    this.matDialog.closeAll();
    console.log(this.similarContactPatientList.length);
    if (!this.MaxIDExist) {
      this.http
        .post(ApiConstants.similarSoundPatientDetail, {
          phone: this.OPRegForm.value.mobileNumber,
        })
        .pipe(takeUntil(this._destroying$))
        .subscribe(
          (resultData: SimilarSoundPatientResponse[]) => {
            this.similarContactPatientList = resultData;
            console.log(this.similarContactPatientList);
            if (this.similarContactPatientList.length == 1) {
              console.log(this.similarContactPatientList[0]);
              let maxID = this.similarContactPatientList[0].maxid;
              this.OPRegForm.controls["maxid"].setValue(maxID);
              this.getPatientDetailsByMaxId();
            } else {
              if (this.similarContactPatientList.length != 0) {
                const similarSoundDialogref = this.matDialog.open(
                  SimilarPatientDialog,
                  {
                    width: "60vw",
                    height: "80vh",
                    data: {
                      searchResults: this.similarContactPatientList,
                    },
                  }
                );
                similarSoundDialogref
                  .afterClosed()
                  .pipe(takeUntil(this._destroying$))
                  .subscribe((result) => {
                    if (result) {
                      console.log(result.data["added"][0].maxid);
                      let maxID = result.data["added"][0].maxid;
                      this.OPRegForm.controls["maxid"].setValue(maxID);
                      this.getPatientDetailsByMaxId();
                    }
                    console.log("seafarers dialog was closed");
                    this.similarContactPatientList = [];
                  });
              } else {
                console.log("no data found");
              }
            }
          },
          (error) => {
            console.log(error);
            this.messageDialogService.info(error.error);
          }
        );
    }
  }

  hcfDetailMasterList: { title: string; value: number }[] = [] as any;

  //CLICK EVENT FROM FOREIGN CHECKBOX
  showPassportDetails() {
    this.getHCFDetails();
    if (this.modfiedPatiendDetails) {
      this.modfiedPatiendDetails.foreigner = true;
    }
  }

  getHCFDetails() {
    this.http
      .get(ApiConstants.hcfLookUp(Number(this.cookie.get("HSPLocationId"))))
      .pipe(takeUntil(this._destroying$))
      .subscribe((resultData: GenernicIdNameModel[]) => {
        console.log(resultData);
        console.log(this.hcfDetailMasterList);
        this.hcfDetailMasterList = resultData.map((l) => {
          return { title: l.name, value: l.id };
        });
        this.passportDetailsdialog(this.hcfDetailMasterList);
      });
  }

  showRegisteredId(message1: string) {
    let formsubmitdialogref = this.matDialog.open(
      RegistrationDialogueComponent,
      {
        width: "30vw",

        data: {
          message1: message1,
          message2:
            "Max ID: " +
            this.patientDetails.iacode +
            "." +
            this.patientDetails.registrationno,
          btn1: true,
          btn2: true,
          bt1Msg: "Proceed to Billing",
          bt2Msg: " Proceed to Deposit",
        },
      }
    );
  }
  //HOTLISTING POP UP DROP DOWN VALUES
  hotlistDialogList: { title: string; value: number }[] = [] as any;
  gethotlistMasterData(): { title: string; value: number }[] {
    let arr = [] as any;
    this.http
      .get(ApiConstants.hotlistMasterDataLookUp)
      .pipe(takeUntil(this._destroying$))
      .subscribe((resultData: hotlistingreasonModel[]) => {
        this.hotlistMasterList = resultData;
        console.log(resultData);
        // this.Hotlistform.hotlistTitle
        console.log(this.hotlistdialogref);

        // this.hotlistDialogList = this.hotlistMasterList.map((l) =>
        this.hotlistDialogList = this.hotlistMasterList.map((l) => {
          return { title: l.name, value: l.id };
          // this.questions[24].options = this.cityList.map((l) => {
          //   return { title: l.cityName, value: l.id };
        });
        let hotlistvalue = this.hotlistDialogList.filter((e) => {
          e.title == this.hotlistReason.title;
          return e.value;
        });

        this.hotlistReason = {
          title: this.hotlistReason.title,
          value: hotlistvalue[0].value,
        };

        // this.hotlistReasondb = {
        //   title: this.hotlistReasondb.title,
        //   value: hotlistvalue[0].value,
        // };

        this.hotlistdialogref = this.matDialog.open(FormDialogueComponent, {
          width: "30vw",
          height: "62vh",
          data: {
            title: "Hot Listing",
            form: {
              title: "",
              type: "object",
              properties: {
                hotlistTitle: {
                  type: "autocomplete",
                  title: "Hot Listing",
                  required: true,
                  defaultValue: this.hotlistReason,
                  options: this.hotlistDialogList,
                },
                reason: {
                  type: "textarea",
                  title: "Remark",
                  defaultValue: this.hotlistRemark,
                  required: true,
                },
              },
            },
            layout: "single",
            buttonLabel: "Save",
          },
        });
        this.hotlistdialogref
          .afterClosed()
          .pipe(takeUntil(this._destroying$))
          .subscribe(
            (result: any) => {
              console.log("The dialog was closed");
              console.log(result);
              this.hotlistReason = result.data.hotlistTitle.title;
              this.hotlistRemark = result.data.reason;
              this.postHotlistComment(
                this.hotlistReason.title,
                this.hotlistRemark
              );
              console.log(this.hotlistReason, this.hotlistRemark);
              // this.postHotlistComment();
            },
            (error: { error: string }) => {
              console.log(error);
              this.messageDialogService.info(error.error);
            }
          );
      });
    return arr;
  }

  hotlistReason!: { title: string; value: number };
  hotlistReasondb!: { title: string; value: number };
  hotlistdialogref: any;
  openHotListDialog() {
    this.gethotlistMasterData();
    console.log(this.hotlistDialogList);
    // const dialogref = this.matDialog.open(HotListingDialogComponent, {
    //   width: "30vw",
    //   height: "52vh",
    // });
  }

  postHotlistComment(title: string, remark: string) {
    let maxid =
      this.patientDetails.iacode + "." + this.patientDetails.registrationno;
    this.http
      .get(
        ApiConstants.hotlistedPatient(
          maxid,
          title,
          this.cookie.get("HSPLocationId"),
          this.patientDetails.firstname,
          this.patientDetails.lastName,
          this.patientDetails.middleName,
          remark,
          "",
          Number(this.cookie.get("UserId"))
        )
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe(
        (resultData: any) => {
          console.log(resultData);
          // this.questions[24].options = this.cityList.map((l) => {
          //   return { title: l.cityName, value: l.id };
        },
        (error) => {
          console.log(error);
          if (
            !(
              error.error.text ==
              "You Have Successfully Added Host List Comment."
            )
          ) {
            this.messageDialogService.info(error.error.text);
          }
          // else
          // {
          //   You have already added a host list comment against this Max ID
          // }
          else {
            this.messageDialogService.success(
              "You Have Successfully Added Host List for MAX ID - " +
                this.patientDetails.iacode +
                "." +
                this.patientDetails.registrationno
            );
          }
        }
      );
  }

  ///Address Related functionality

  //MASTER LIST FOR NATIONALITY
  getAllNAtionalityList() {
    this.http
      .get(ApiConstants.nationalityLookUp)
      .pipe(takeUntil(this._destroying$))
      .subscribe((resultData: any) => {
        this.nationalityList = resultData;
        this.questions[28].options = this.nationalityList.map((l) => {
          return { title: l.name, value: l.id };
        });
      });
  }

  //MASTER LIST FOR COUNTRY
  getAllCountryList() {
    this.http
      .get(ApiConstants.masterCountryList)
      .pipe(takeUntil(this._destroying$))
      .subscribe((resultData: any) => {
        this.countryList = resultData;
        this.questions[27].options = this.countryList.map((l) => {
          return { title: l.countryName, value: l.id };
        });
      });
  }

  //MASTER LIST FOR COUNTRY
  getAllCityList() {
    this.http
      .get(ApiConstants.cityMasterData)
      .pipe(takeUntil(this._destroying$))
      .subscribe((resultData: any) => {
        this.cityList = resultData;
        this.questions[24].options = this.cityList.map((l) => {
          return { title: l.cityName, value: l.id };
        });
      });
  }

  //MASTER LIST FOR Distt
  getAllDisttList() {
    this.http
      .get(ApiConstants.disttMasterData)
      .pipe(takeUntil(this._destroying$))
      .subscribe((resultData: any) => {
        this.disttList = resultData;
        this.questions[25].options = this.disttList.map((l) => {
          return { title: l.districtName, value: l.id };
        });
      });
  }

  //MASTER LIST FOR STATES
  getAllStateList() {
    this.http
      .get(ApiConstants.stateMasterData)
      .pipe(takeUntil(this._destroying$))
      .subscribe((resultData: any) => {
        this.stateList = resultData;
        this.questions[26].options = this.stateList.map((l) => {
          return { title: l.stateName, value: l.id };
        });
      });
  }

  //MASTER LIST FOR LOCALITY
  getLocalityList() {
    this.http
      .get(ApiConstants.localityMasterData)
      .pipe(takeUntil(this._destroying$))
      .subscribe((resultData: any) => {
        this.localityList = resultData;
        this.questions[22].options = this.localityList.map((l) => {
          return { title: l.localityName, value: l.id };
        });
      });
  }

  localityListByPin: LocalityByPincodeModel[] = [];
  //LOCALITY LIST FOR PINCODE
  getLocalityByPinCode() {
    if (
      this.OPRegForm.value.pincode != undefined &&
      this.OPRegForm.value.pincode > 0 &&
      this.OPRegForm.value.pincode != null
    ) {
      this.countrybasedflow = false;
      this.http
        .get(ApiConstants.localityLookUp(this.OPRegForm.value.pincode))
        .pipe(takeUntil(this._destroying$))
        .subscribe((resultData: any) => {
          this.localityListByPin = resultData;
          this.questions[22].options = this.localityListByPin.map((l) => {
            return { title: l.name, value: l.id };
          });
          this.questions[22] = { ...this.questions[22] };
        });
    }
  }

  clearAddressOnPincodeChange() {
    if (
      !this.maxIDChangeCall &&
      !this.citybasedflow &&
      !this.countrybasedflow
    ) {
      if (
        this.OPRegForm.value.city.value != undefined &&
        this.OPRegForm.value.city.value != null &&
        this.OPRegForm.value.city.value != ""
      ) {
        this.OPRegForm.controls["city"].setValue({ title: "", value: 0 });
      }

      if (
        this.OPRegForm.value.locality.value != undefined &&
        this.OPRegForm.value.locality.value != null &&
        this.OPRegForm.value.locality.value != ""
      ) {
        this.OPRegForm.controls["locality"].setValue({ title: "", value: 0 });
      }

      if (
        this.OPRegForm.value.state.value != undefined &&
        this.OPRegForm.value.state.value != null &&
        this.OPRegForm.value.state.value != ""
      ) {
        this.OPRegForm.controls["state"].setValue({ title: "", value: 0 });
      }
      if (
        this.OPRegForm.value.district.value != undefined &&
        this.OPRegForm.value.district.value != null &&
        this.OPRegForm.value.district.value != ""
      ) {
        this.OPRegForm.controls["district"].setValue({ title: "", value: 0 });
      }

      this.questions[24].readonly = false;
      this.questions[25].readonly = false;
      this.questions[26].readonly = false;
      this.questions[27].readonly = false;

      this.getCitiesByCountry({ title: "India", value: 1 });
      this.getStatesByCountry({ title: "India", value: 1 });

      // this.OPRegForm.controls["country"].setValue({
      //   title: "India",
      //   value: 1,
      // });
    }
  }

  clearAddressOnCountryChange() {
    if (
      !this.maxIDChangeCall &&
      (this.OPRegForm.value.pincode == undefined ||
        this.OPRegForm.value.pincode == null ||
        this.OPRegForm.value.pincode == "" ||
        this.OPRegForm.value.pincode <= 0)
    ) {
      this.countrybasedflow = true;
      this.OPRegForm.controls["pincode"].setErrors(null);
      this.questions[21].customErrorMessage = "";

      if (
        this.OPRegForm.value.city.value != undefined &&
        this.OPRegForm.value.city.value != null &&
        this.OPRegForm.value.city.value != ""
      ) {
        this.OPRegForm.controls["city"].setValue({ title: "", value: 0 });
      }

      if (
        this.OPRegForm.value.locality.value != undefined &&
        this.OPRegForm.value.locality.value != null &&
        this.OPRegForm.value.locality.value != ""
      ) {
        this.OPRegForm.controls["locality"].setValue({ title: "", value: 0 });
      }

      if (
        this.OPRegForm.value.state.value != undefined &&
        this.OPRegForm.value.state.value != null &&
        this.OPRegForm.value.state.value != ""
      ) {
        this.OPRegForm.controls["state"].setValue({ title: "", value: 0 });
      }
      if (
        this.OPRegForm.value.district.value != undefined &&
        this.OPRegForm.value.district.value != null &&
        this.OPRegForm.value.district.value != ""
      ) {
        this.OPRegForm.controls["district"].setValue({ title: "", value: 0 });
      }
    }
  }

  clearAddressOnStateChange() {
    if (!this.maxIDChangeCall && !this.pincodebasedflow) {
      if (
        this.OPRegForm.value.pincode > 0 &&
        this.OPRegForm.value.pincode != undefined &&
        this.OPRegForm.value.pincode != ""
      ) {
        this.OPRegForm.controls["pincode"].setValue("");
      }
      if (
        this.OPRegForm.value.city.value != undefined &&
        this.OPRegForm.value.city.value != null &&
        this.OPRegForm.value.city.value != ""
      ) {
        this.OPRegForm.controls["city"].setValue({ title: "", value: 0 });
      }

      if (
        this.OPRegForm.value.locality.value != undefined &&
        this.OPRegForm.value.locality.value != null &&
        this.OPRegForm.value.locality.value != ""
      ) {
        this.OPRegForm.controls["locality"].setValue({ title: "", value: 0 });
      }
      if (
        this.OPRegForm.value.district.value != undefined &&
        this.OPRegForm.value.district.value != null &&
        this.OPRegForm.value.district.value != ""
      ) {
        this.OPRegForm.controls["district"].setValue({ title: "", value: 0 });
      }
    }
  }

  clearAddressOnDistrictChange() {
    if (!this.maxIDChangeCall && !this.pincodebasedflow) {
      if (
        this.OPRegForm.value.pincode > 0 &&
        this.OPRegForm.value.pincode != undefined &&
        this.OPRegForm.value.pincode != ""
      ) {
        this.OPRegForm.controls["pincode"].setValue("");
      }
      if (
        this.OPRegForm.value.city.value != undefined &&
        this.OPRegForm.value.city.value != null &&
        this.OPRegForm.value.city.value != ""
      ) {
        this.OPRegForm.controls["city"].setValue({ title: "", value: 0 });
      }

      if (
        this.OPRegForm.value.locality.value != undefined &&
        this.OPRegForm.value.locality.value != null &&
        this.OPRegForm.value.locality.value != ""
      ) {
        this.OPRegForm.controls["locality"].setValue({ title: "", value: 0 });
      }
    }
  }

  clearAddressOnCityChange() {
    this.OPRegForm.controls["pincode"].setErrors(null);
    this.questions[21].customErrorMessage = "";
    if (
      !this.maxIDChangeCall &&
      (this.countrybasedflow || this.citybasedflow) &&
      !this.pincodebasedflow
    ) {
      if (
        this.OPRegForm.value.pincode > 0 &&
        this.OPRegForm.value.pincode != undefined &&
        this.OPRegForm.value.pincode != ""
      ) {
        this.OPRegForm.controls["pincode"].setValue("");
      }

      if (
        this.OPRegForm.value.locality.value != undefined &&
        this.OPRegForm.value.locality.value != null &&
        this.OPRegForm.value.locality.value != ""
      ) {
        this.OPRegForm.controls["locality"].setValue({ title: "", value: 0 });
      }
    }
  }

  //fetch Address based on locality or set pincode on selection of locality
  countrybasedflow: boolean = false;
  AddressonLocalityModellst!: AddressonLocalityModel;
  addressByLocalityID(locality: any) {
    if (
      this.OPRegForm.value.city.value == undefined ||
      this.OPRegForm.value.city.value == "" ||
      this.OPRegForm.value.city.value == null
    ) {
      if (
        locality.value != undefined &&
        locality.value != null &&
        locality.value != "" &&
        locality.value > 0
      ) {
        this.http
          .get(ApiConstants.addressByLocalityID(locality.value))
          .pipe(takeUntil(this._destroying$))
          .subscribe((resultData: any) => {
            this.AddressonLocalityModellst = resultData[0];
            this.questions[24].readonly = true;
            this.questions[25].readonly = true;
            this.questions[26].readonly = true;
            this.questions[27].readonly = true;

            this.OPRegForm.controls["country"].setValue({
              title: this.AddressonLocalityModellst.countryName,
              value: this.AddressonLocalityModellst.countryid,
            });
            this.OPRegForm.controls["state"].setValue({
              title: this.AddressonLocalityModellst.stateName,
              value: this.AddressonLocalityModellst.stateId,
            });
            this.OPRegForm.controls["district"].setValue({
              title: this.AddressonLocalityModellst.districtName,
              value: this.AddressonLocalityModellst.districtId,
            });
            this.OPRegForm.controls["city"].setValue({
              title: this.AddressonLocalityModellst.cityName,
              value: this.AddressonLocalityModellst.cityId,
            });
            this.pincodebasedflow = false;
          });
      }
      this.countrybasedflow = false;
      this.citybasedflow = false;
    } else {
      if (
        this.OPRegForm.value.pincode == undefined ||
        this.OPRegForm.value.pincode == null ||
        this.OPRegForm.value.pincode == "" ||
        this.OPRegForm.value.pincode <= 0
      ) {
        if (
          locality.value != undefined &&
          locality.value != null &&
          locality.value != "" &&
          locality.value > 0
        ) {
          let pincode = this.localitybyCityList.filter(
            (l) => l.id === locality.value
          )[0].pincode;
          // this.countrybasedflow = true;
          this.pincodebasedflow = false;
          this.OPRegForm.controls["pincode"].setValue(pincode);
          this.countrybasedflow = false;
          this.citybasedflow = false;
        }
      } else {
        if (!this.maxIDChangeCall && this.countrybasedflow) {
          this.OPRegForm.controls["pincode"].setValue(null);
          this.countrybasedflow = false;
          this.citybasedflow = false;
          this.pincodebasedflow = false;
        }
      }
    }
  }

  cityListByState: CityModel[] = [];
  //CITY LIST FOR STATEID
  getCityListByState(state: any) {
    if (state.value != undefined && state.value != null && state.value != "") {
      this.http
        .get(ApiConstants.cityByStateID(state.value))
        .pipe(takeUntil(this._destroying$))
        .subscribe((resultData: any) => {
          this.cityList = resultData;
          this.questions[24].options = this.cityList.map((l) => {
            return { title: l.cityName, value: l.id };
          });
          this.questions[24] = { ...this.questions[24] };
        });
    }
  }

  //DISTRICT LIST BY STATE
  getDistricyListByState(state: any) {
    if (state.value != undefined && state.value != null && state.value != "") {
      this.http
        .get(ApiConstants.districtBystateID(state.value))
        .pipe(takeUntil(this._destroying$))
        .subscribe((resultData: any) => {
          this.disttList = resultData;
          this.questions[25].options = this.disttList.map((l) => {
            return { title: l.districtName, value: l.id };
          });
          this.questions[25] = { ...this.questions[25] };
        });
    }
  }

  //locality by city
  getLocalityByCity(city: any) {
    console.log(city.value);
    if (city.value != undefined && city.value != null && city.value != "") {
      this.http
        .get(ApiConstants.localityBycityID(city.value))
        .pipe(takeUntil(this._destroying$))
        .subscribe((resultData: any) => {
          this.localitybyCityList = resultData;
          this.questions[22].options = this.localitybyCityList.map((l) => {
            return { title: l.localityName, value: l.id };
          });
          this.questions[22] = { ...this.questions[22] };
        });
    }
  }

  addressByCity: AddressonCityModel[] = [];
  //address BY City
  getAddressByCity(city: any) {
    if (city.value != undefined && city.value != null && city.value != "") {
      this.http
        .get(ApiConstants.addressByCityID(city.value))
        .pipe(takeUntil(this._destroying$))
        .subscribe((resultData: any) => {
          this.addressByCity = resultData;
          this.OPRegForm.controls["state"].setValue({
            title: this.addressByCity[0].stateName,
            value: this.addressByCity[0].stateId,
          });
          this.OPRegForm.controls["district"].setValue({
            title: this.addressByCity[0].districtName,
            value: this.addressByCity[0].districtId,
          });
          this.getLocalityByCity(city);
        });
    }
  }
  //Get StateList Basedon Country
  getStatesByCountry(country: any) {
    if (
      country.value != undefined &&
      country.value != null &&
      country.value != ""
    ) {
      this.http
        .get(ApiConstants.stateByCountryId(country.value))
        .pipe(takeUntil(this._destroying$))
        .subscribe((resultData: any) => {
          this.stateList = resultData;
          // console.log(this.localityListByPin);
          this.questions[26].options = this.stateList.map((l) => {
            return { title: l.stateName, value: l.id };
          });
        });
    }
  }

  //Get CityList based on country
  getCitiesByCountry(country: any) {
    if (
      country.value != undefined &&
      country.value != null &&
      country.value != ""
    ) {
      this.http
        .get(ApiConstants.CityDetail(country.value))
        .pipe(takeUntil(this._destroying$))
        .subscribe((resultData: any) => {
          this.cityList = resultData;
          // console.log(this.localityListByPin);
          this.questions[24].options = this.cityList.map((l) => {
            return { title: l.cityName, value: l.id };
          });
        });
    }
  }

  //Get Patient Details by Max ID
  maxIDChangeCall: boolean = false;
  MaxIDExist: boolean = false;
  getPatientDetailsByMaxId() {
    this.maxIDChangeCall = true;
    console.log(this.OPRegForm.value.maxid);

    let regNumber = Number(this.OPRegForm.value.maxid.split(".")[1]);

    //HANDLING IF MAX ID IS NOT PRESENT
    if (regNumber != 0) {
      let iacode = this.OPRegForm.value.maxid.split(".")[0];
      this.http
        .get(ApiConstants.patientDetails(regNumber, iacode))
        .pipe(takeUntil(this._destroying$))
        .subscribe(
          (resultData: PatientDetails) => {
            // this.clear();
            this.flushAllObjects();
            this.maxIDChangeCall = true;
            this.patientDetails = resultData;
            this.categoryIcons = this.patientService.getCategoryIconsForPatient(
              this.patientDetails
            );
            this.MaxIDExist = true;
            console.log(this.categoryIcons);
            this.checkForMaxID();
            //RESOPONSE DATA BINDING WITH CONTROLS

            this.setValuesToOPRegForm(this.patientDetails);

            //SETTING PATIENT DETAILS TO MODIFIEDPATIENTDETAILOBJ
            this.registeredPatientDetails(this.patientDetails);
            this.maxIDChangeCall = false;
          },
          (error) => {
            if (error.error == "Patient Not found") {
              // this.messageDialogService.info(error.error);
              this.router.navigate([], {
                queryParams: {},
                relativeTo: this.route,
              });
              this.flushAllObjects();
              // this.setValuesToOPRegForm(this.patientDetails);
              this.OPRegForm.controls["maxid"].setValue(
                iacode + "." + regNumber
              );
              this.OPRegForm.controls["maxid"].setErrors({ incorrect: true });
              this.questions[0].customErrorMessage = "Invalid Max ID";
            }
            // this.clear();

            this.maxIDChangeCall = false;
          }
        );
    }
  }

  onModifyDetail() {
    let passportdetailspresent = false;
    if (
      this.nationalityChanged &&
      this.OPRegForm.value.nationality.title != "Indian" &&
      this.OPRegForm.value.foreigner &&
      this.passportDetails.passportNo != ""
    ) {
      passportdetailspresent = true;
    } else if (
      this.nationalityChanged &&
      this.OPRegForm.value.nationality.title == "Indian"
    ) {
      passportdetailspresent = true;
    } else {
      passportdetailspresent = false;
    }

    if (passportdetailspresent) {
      this.onUpdatePatientDetail();

      if (this.isPatientdetailModified || this.nationalityChanged) {
        this.modifyDialogg();
      }
    } else {
      this.onUpdatePatientDetail();
    }
  }

  postModifyCall() {
    this.http
      .post(
        ApiConstants.modifyPatientDetail,
        this.getModifiedPatientDetailObj()
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe(
        (resultData) => {
          if (this.OPRegForm.value.maxid) {
            this.getPatientDetailsByMaxId();
          } // this.setValuesToOPRegForm(resultData);
          if (resultData == "Your request has been processed successfully") {
            this.showRegisteredId("Modified request went for approval");
          }
          console.log(resultData);
        },
        (error) => {
          console.log(error);
          this.messageDialogService.info(error.error);
        }
      );
  }

  onUpdatePatientDetail() {
    this.http
      .post(ApiConstants.updatePatientDetail, this.getPatientUpdatedReqBody())
      .pipe(takeUntil(this._destroying$))
      .subscribe(
        (resultData: PatientDetails) => {
          this.maxIDChangeCall = true; // Added to avoid overlapping of ews popup and successdialog
          this.populateUpdatePatientDetail(resultData);
          if (!this.isPatientdetailModified && !this.nationalityChanged) {
            this.messageDialogService.success(
              "Patient Details has been modified"
            );
          }
          this.maxIDChangeCall = false;
          console.log(resultData);
        },
        (error) => {
          this.messageDialogService.error(error.error);
        }
      );
  }
  postForm() {
    console.log("request body" + this.getPatientSubmitRequestBody());
    this.http
      .post(ApiConstants.postPatientDetails, this.getPatientSubmitRequestBody())
      .pipe(takeUntil(this._destroying$))
      .subscribe(
        (resultData: PatientDetails) => {
          this.patientDetails = resultData;
          this.showRegisteredId("Patient Registered Successfully");
          this.flushAllObjects();
          this.maxIDChangeCall = true;
          this.setValuesToOPRegForm(resultData);
          this.MaxIDExist = true;
          this.checkForMaxID();
          console.log(resultData);
          this.maxIDChangeCall = false;
        },
        (error) => {
          console.log(error);
          this.messageDialogService.info(error.error);
        }
      );
  }

  //BIND THE REGISTERED PATIENT RESPONSE TO QUESTIONS
  setValuesToOPRegForm(patientDetails: PatientDetails) {
    this.patientDetails = patientDetails;
    if (this.patientDetails?.registrationno == 0) {
      this.patientDetails?.iacode + ".";
    } else {
      this.OPRegForm.controls["maxid"].setValue(
        this.patientDetails?.iacode + "." + this.patientDetails?.registrationno
      );
    }
    this.OPRegForm.controls["SSN"].setValue(this.patientDetails?.ssn);
    this.OPRegForm.controls["mobileNumber"].setValue(
      this.patientDetails?.pphone
    );
    this.OPRegForm.controls["title"].setValue(this.patientDetails?.title);
    this.OPRegForm.controls["firstName"].setValue(
      this.patientDetails?.firstname
    );
    this.OPRegForm.controls["lastName"].setValue(this.patientDetails?.lastName);
    this.OPRegForm.controls["middleName"].setValue(
      this.patientDetails?.middleName
    );
    this.OPRegForm.controls["gender"].setValue(this.patientDetails?.sex);
    if (this.patientDetails?.dob) {
      this.OPRegForm.controls["dob"].setValue(this.patientDetails?.dateOfBirth);
    } else {
      this.OPRegForm.controls["dob"].setValue("");
    }
    this.OPRegForm.controls["age"].setValue(this.patientDetails?.age);
    this.OPRegForm.controls["ageType"].setValue(this.patientDetails?.agetype);
    this.OPRegForm.controls["emailId"].setValue(this.patientDetails?.pemail);

    this.OPRegForm.controls["nationality"].setValue({
      title: this.patientDetails?.nationalityName,
      value: this.patientDetails?.nationality,
    });
    this.OPRegForm.controls["foreigner"].setValue(
      this.patientDetails?.foreigner
    );
    // this.enableDisableForeignerCheck(this.patientDetails);//// commented as UAT requirement change
    this.OPRegForm.controls["hotlist"].setValue(this.patientDetails?.hotlist);

    //PASSPORT DETAILS
    if (this.patientDetails.passportNo != "") {
      this.passportDetails.Expirydate = this.patientDetails?.expiryDate;
      this.passportDetails.IssueDate = this.patientDetails?.issueDate;
      this.passportDetails.HCF.value = this.patientDetails?.hcfId;
      this.passportDetails.Issueat = this.patientDetails?.passportIssuedAt;
      this.passportDetails.passportNo = this.patientDetails?.passportNo;
    } else {
      this.passportDetails.Expirydate = "";
      this.passportDetails.IssueDate = "";
      this.passportDetails.HCF.value = 0;
      this.passportDetails.Issueat = "";
      this.passportDetails.passportNo = "";
    }
    this.setHotlistDetails(this.patientDetails);
    this.populateUpdatePatientDetail(this.patientDetails);
  }

  setHotlistDetails(patientDetail: PatientDetails) {
    this.hotlistReason.title = patientDetail.hotlistreason;

    this.hotlistRemark = patientDetail.hotlistcomments;
  }

  // commented as UAT requirement change
  // enableDisableForeignerCheck(patientDetails: PatientDetails) {
  //   if (patientDetails.nationalityName.toLowerCase() == "indian") {
  //     this.OPRegForm.controls["foreigner"].disable();
  //   } else {
  //     this.OPRegForm.controls["foreigner"].enable();
  //   }
  // }

  //FLAG FOR TRIGGERED EVENT ON PHONE NUMBER
  similarSoundListPresent(): boolean {
    return this.similarContactPatientList.length > 0 ? true : false;
  }

  //CLEARING OLDER PHONE SEARCH
  onEnterPhoneModify() {
    this.similarContactPatientList = [] as any;
    this.onPhoneModify();
  }
  onPhoneModify() {
    console.log("phone changed");
    if (!this.maxIDChangeCall) {
      //IF EVENT HAS BEEN NOT HITTED API
      if (!this.similarSoundListPresent()) {
        if (this.checkForModifiedPatientDetail()) {
          this.modfiedPatiendDetails.pphone = this.OPRegForm.value.mobileNumber;
        } else {
          this.getSimilarPatientDetails();
        }
        // } else {
        //   if (this.similarContactPatientList.length == 1) {
        //     if (this.checkForModifiedPatientDetail()) {
        //       this.modfiedPatiendDetails.pphone = this.OPRegForm.value.mobileNumber;
        //     } else {
        //       this.getSimilarPatientDetails();
        //     }
        //   }
      }
    }
  }
  onTitleModify() {
    console.log("title changed");
    if (!this.maxIDChangeCall) {
      if (this.checkForModifiedPatientDetail()) {
        if (this.OPRegForm.value.title)
          this.modfiedPatiendDetails.title = this.OPRegForm.value.title.title;
      }
    }
  }

  onMiddleNameModify() {
    console.log("middle name changed");
    if (!this.maxIDChangeCall) {
      if (this.checkForModifiedPatientDetail()) {
        this.modfiedPatiendDetails.middleName = this.OPRegForm.value.middleName;
      }
    }
  }

  onFistNameModify() {
    console.log("firstname changed");
    if (!this.maxIDChangeCall) {
      if (this.checkForModifiedPatientDetail()) {
        this.modfiedPatiendDetails.firstname = this.OPRegForm.value.firstname;
      }
    }
  }
  onLastNameModify() {
    console.log("lastname changed");
    if (!this.maxIDChangeCall) {
      if (this.checkForModifiedPatientDetail()) {
        this.modfiedPatiendDetails.lastName = this.OPRegForm.value.lastName;
      }
    }
  }
  onGenderModify() {
    console.log("gender changed");
    if (!this.maxIDChangeCall) {
      if (this.checkForModifiedPatientDetail()) {
        this.modfiedPatiendDetails.sex = this.OPRegForm.value.gender.title;
      }
    }
  }
  onEmailModify() {
    console.log("Age changed");
    if (!this.maxIDChangeCall) {
      if (this.checkForModifiedPatientDetail()) {
        this.modfiedPatiendDetails.pemail = this.OPRegForm.value.emailId;
      }
    }
  }
  nationalityChanged: boolean = false;
  onNationalityModify() {
    console.log("country changed");
    if (
      this.OPRegForm.value.nationality.title != "Indian" &&
      this.OPRegForm.value.nationality.value != null &&
      this.OPRegForm.value.nationality.value != undefined &&
      this.OPRegForm.value.nationality.value != "" &&
      this.OPRegForm.value.nationality.title != "" &&
      this.OPRegForm.value.nationality.title != null
    ) {
      // commented as UAT requirement change
      // this.OPRegForm.controls["foreigner"].enable();
      this.OPRegForm.controls["foreigner"].setValue(true);
      this.showPassportDetails();
    } else {
      // commented as UAT requirement change
      //  this.OPRegForm.controls["foreigner"].disable();
      this.OPRegForm.controls["foreigner"].setValue(false);
    }
    if (
      this.OPRegForm.value.nationality.title !=
      this.patientDetails.nationalityName
    ) {
      if (this.checkForModifiedNationality()) {
        this.modfiedPatiendDetails.nationality =
          this.OPRegForm.value.nationality.value;
      }
    } else {
      this.nationalityChanged = false;
    }
  }

  //BINDING UPDATE RELATED DETAILS FROM UPDATE ENDPOINT CALL
  populateUpdatePatientDetail(patientDetails: PatientDetails) {
    this.OPRegForm.controls["country"].setValue({
      title: this.patientDetails?.countryName,
      value: this.patientDetails?.pcountry,
    });
    if (patientDetails?.spouseName != "") {
      // this.OPRegForm.controls["fatherSpouse"].setValue({ title: "Spouse", value: 2 });
      this.OPRegForm.controls["fatherSpouse"].setValue(2);

      this.OPRegForm.controls["fatherSpouseName"].setValue(
        patientDetails?.spouseName
      );
      //fatherSpouse
    } else {
      // this.OPRegForm.controls["fatherSpouse"].setValue({ title: "Father", value: 1 })
      if (patientDetails?.fathersname != "") {
        this.OPRegForm.controls["fatherSpouseName"].setValue(
          patientDetails?.fathersname
        );
        this.OPRegForm.controls["fatherSpouse"].setValue(1);
      }
    }

    this.OPRegForm.controls["motherName"].setValue(
      patientDetails?.mothersMaidenName
    );
    this.OPRegForm.controls["altLandlineName"].setValue(
      patientDetails?.landlineno
    );
    this.OPRegForm.controls["idenityType"].setValue(
      patientDetails?.identityTypeId
    );
    this.OPRegForm.controls["idenityValue"].setValue(
      patientDetails?.identityTypeNumber
    );
    this.OPRegForm.controls["adhaarId"].setValue(patientDetails?.adhaarId);
    this.OPRegForm.controls["healthId"].setValue("");
    this.OPRegForm.controls["address"].setValue(patientDetails?.address1);
    this.OPRegForm.controls["pincode"].setValue(patientDetails?.ppinCode);
    this.OPRegForm.controls["state"].setValue({
      title: patientDetails?.stateName,
      value: patientDetails?.pstate,
    });
    this.OPRegForm.controls["district"].setValue({
      title: patientDetails?.districtName,
      value: patientDetails?.pdistrict,
    });
    this.OPRegForm.controls["city"].setValue({
      title: patientDetails?.city,
      value: patientDetails?.pcity,
    });
    this.OPRegForm.controls["locality"].setValue({
      title: patientDetails?.localityName,
      value: patientDetails?.locality,
    });

    //FOR CHECKBOX
    this.OPRegForm.controls["vip"].setValue(patientDetails?.vip);
    //FOR VIP NOTES
    this.vip = patientDetails.vipreason;
    this.vipdb = patientDetails.vipreason;

    //FOR CHECKBOX
    this.OPRegForm.controls["note"].setValue(patientDetails?.note);
    //FOR NOTES NOTES
    this.noteRemark = patientDetails.notereason;
    this.noteRemarkdb = patientDetails.notereason;

    //FOR CHECKBOX
    this.OPRegForm.controls["hwc"].setValue(patientDetails?.hwc);
    //FOR HWC NOTES
    this.hwcRemark = patientDetails.hwcRemarks;
    this.hwcRemarkdb = patientDetails.hwcRemarks;

    //FOR CHECKBOX
    this.OPRegForm.controls["organdonor"].setValue(
      patientDetails?.isOrganDonor
    );

    //FOR CHECKBOX
    this.OPRegForm.controls["otAdvanceExclude"].setValue(
      patientDetails?.isOtadvanceExculded
    );

    this.OPRegForm.controls["verifiedOnline"].setValue(
      patientDetails?.isCghsverified
    );
    this.OPRegForm.controls["surveySMS"].setValue(patientDetails?.marketing1);
    this.OPRegForm.controls["receivePromotional"].setValue(
      patientDetails?.marketing2
    );

    //FOR CHECKBOX
    //IF PAGERNO IS NOT UNDERFINED
    if (patientDetails?.ppagerNumber) {
      this.setPaymentMode(patientDetails?.ppagerNumber.toUpperCase());
    }
    this.categoryIcons =
      this.patientService.getCategoryIconsForPatient(patientDetails);

    //FOR EWS POP UP
    //IF PAGERNO IS NOT UNDERFINED
    if (patientDetails?.ppagerNumber) {
      if (patientDetails.ppagerNumber.toUpperCase() == "EWS") {
        this.ewsDetails.bplCardNo = patientDetails.bplcardNo;
        this.ewsDetails.bplCardAddress = patientDetails.addressOnCard;
        this.ewsDetailsdb.bplCardNo = patientDetails.bplcardNo;
        this.ewsDetailsdb.bplCardAddress = patientDetails.addressOnCard;
      }
    } else {
      this.setPaymentMode("cash");
    }

    //FOR SEAFAROR
    this.OPRegForm.controls["seaFarer"].setValue(
      patientDetails.hkid != "" ? true : false
    );

    this.setValuesToSeaFarer(patientDetails);

    //SOURCE OF INFO DROPDOWN
    this.OPRegForm.controls["sourceOfInput"].setValue(
      patientDetails?.sourceofinfo
    );
  }

  //FOR ASSIGNING SEAFARER DETAILS TO POP UP
  setValuesToSeaFarer(patientDetails: PatientDetails) {
    this.seafarerDetails.HKID = patientDetails.hkid;
    this.seafarerDetails.FDPGroup = patientDetails.fdpgroup;
    this.seafarerDetails.Vesselname = patientDetails.vesselName;
    this.seafarerDetails.rank = patientDetails.rank;
  }

  //POPULATING THE MODE OF PATMENT FOR PATIENT DETAILS
  setPaymentMode(ppagerNumber: string | undefined) {
    this.OPRegForm.value.paymentMethod;
    this.OPRegForm.controls["paymentMethod"].setValue(
      ppagerNumber?.toLowerCase()
    );
  }

  getDobStatus(): boolean {
    let dob =
      this.OPRegForm.value.dob == "" || this.OPRegForm.value.dob == undefined
        ? false
        : true;
    return dob;
  }

  updateRequestBody!: UpdatepatientModel;
  getPatientUpdatedReqBody(): UpdatepatientModel {
    let dob =
      this.OPRegForm.value.dob == "" || this.OPRegForm.value.dob == undefined
        ? false
        : true;
    console.log(this.OPRegForm.controls["idenityType"].value);
    return (this.updateRequestBody = new UpdatepatientModel(
      this.patientDetails.id,
      this.OPRegForm.value.maxid.split(".")[1],
      this.OPRegForm.value.maxid.split(".")[0],
      this.datepipe.transform(
        this.patientDetails.regDateTime == null
          ? Date.now()
          : this.patientDetails.regDateTime,
        "yyyy-MM-ddThh:mm:ss"
      ) || "1900-01-01T00:00:00",
      this.OPRegForm.value.motherName,
      this.getFather(),
      this.getFather() === "" ? false : true,
      this.datepipe.transform(
        this.OPRegForm.value.dob,
        "yyyy-MM-ddThh:mm:ss"
      ) || "1900-01-01T00:00:00",
      11,
      this.getSpouseName(),
      0,
      "",
      0,
      "",
      this.OPRegForm.controls["ageType"].value,
      this.OPRegForm.value.age,
      this.OPRegForm.value.address,
      "",
      "",
      this.OPRegForm.value.city.value,
      this.OPRegForm.value.district.value,
      this.OPRegForm.value.state.value,
      this.OPRegForm.value.country.value,
      this.OPRegForm.value.pincode,
      this.OPRegForm.value.paymentMethod, //PAGER NEED TO CHECK HOW CAN BE SENT
      0,
      "",
      false,
      this.OPRegForm.value.vip || false,
      0,
      this.getDobStatus(),
      "1900-01-01T00:00:00",
      "1900-01-01T00:00:00",
      Number(this.cookie.get("UserId")),
      false,
      false, //IS CARD ISSUED
      "1900-01-01T00:00:00",
      "", //fee reason
      0, //company id
      Number(this.cookie.get("HSPLocationId")),
      this.datepipe.transform(Date.now(), "yyyy-MM-ddThh:mm:ss") ||
        "1900-01-01T00:00:00", //lat updted
      this.vip,
      !this.getDobStatus(),
      this.OPRegForm.value.locality.value || 0,
      this.OPRegForm.value.locality.value == undefined
        ? this.OPRegForm.value.locality.title
        : "",
      this.OPRegForm.controls["sourceOfInput"].value || 0,
      false,
      false, //data clean flag
      false, //isavailregcard
      this.OPRegForm.value.SSN,
      "", //referredname
      "", //referredphone
      this.OPRegForm.value.note || false,
      this.noteRemark,
      this.OPRegForm.value.surveySMS || false,
      this.OPRegForm.value.receivePromotional || false,
      this.OPRegForm.value.verifiedOnline == "" ? 0 : 1,
      this.ewsDetails.bplCardNo,
      this.ewsDetails.bplCardAddress,
      "cghsbeneficiaryCompany",
      this.OPRegForm.value.adhaarId,
      this.passportDetails.HCF.value || 0,
      this.OPRegForm.value.altLandlineName,
      this.OPRegForm.value.organdonor || false,
      this.OPRegForm.value.otAdvanceExclude || false,
      0,
      0,
      this.seafarerDetails.HKID || "",
      this.seafarerDetails.rank || "",
      this.seafarerDetails.Vesselname || "",
      this.seafarerDetails.FDPGroup || "",
      this.OPRegForm.value.hwc || false,
      this.hwcRemark,
      this.OPRegForm.controls["idenityType"].value || 0,
      this.OPRegForm.value.idenityValue || ""
    ));
  }

  //WORKING ON THE BELOW FUNCTION
  patientSubmitDetails: patientRegistrationModel | undefined;
  // registationFormSubmit()
  // {}
  registationFormSubmit() {
    this.postForm();
  }

  getPatientSubmitRequestBody(): patientRegistrationModel {
    console.log(this.OPRegForm.controls["title"].value);
    let iacode = this.cookie.get("LocationIACode");
    let deptId = 0;

    //IF PASSPOET DETAILS HAVE NOT BEEN ADDED
    this.getPassportDetailObj();

    return (this.patientSubmitDetails = new patientRegistrationModel(
      0,
      iacode,
      this.datepipe.transform(Date.now(), "yyyy-MM-ddThh:mm:ss") || "{}",
      deptId,
      "",
      this.OPRegForm.controls["title"].value,
      this.OPRegForm.value.firstName,
      this.OPRegForm.value.middleName,
      this.OPRegForm.value.lastName,
      this.OPRegForm.value.motherName,
      this.getFather(),
      this.getFather() === "" ? false : true,
      this.datepipe.transform(
        this.OPRegForm.value.dob,
        "yyyy-MM-ddThh:mm:ss"
      ) || "1900-01-01T00:00:00",
      this.OPRegForm.controls["gender"].value,
      11,
      this.getSpouseName(),
      0,
      "",
      0,
      "",
      "",
      "",
      "",
      this.OPRegForm.controls["ageType"].value,
      this.OPRegForm.value.age,
      this.OPRegForm.value.address,
      "",
      "",
      this.OPRegForm.value.city.value,
      this.OPRegForm.value.district.value,
      this.OPRegForm.value.state.value,
      this.OPRegForm.value.country.value,
      this.OPRegForm.value.pincode,
      this.OPRegForm.value.mobileNumber,
      "",
      this.OPRegForm.value.emailId,
      this.OPRegForm.value.paymentMethod, //PAGER NEED TO CHECK HOW CAN BE SENT
      0,
      this.OPRegForm.value.nationality.value,
      false,
      this.passportDetails.passportNo,
      this.passportDetails.IssueDate,
      this.passportDetails.Expirydate,
      this.passportDetails.Issueat,

      "",
      false,
      this.OPRegForm.value.vip || false,
      0,
      this.OPRegForm.value.foreigner || false,
      this.getDobStatus(),
      Number(this.cookie.get("UserId")),
      "",
      Number(this.cookie.get("HSPLocationId")),
      this.vip,
      !this.getDobStatus(),
      this.OPRegForm.value.locality.value || 0,
      this.OPRegForm.value.locality.value == undefined
        ? this.OPRegForm.value.locality.title
        : "",
      this.OPRegForm.controls["sourceOfInput"].value || 0,
      false,
      this.OPRegForm.value.SSN,
      "1900-01-01T00:00:00",
      "",
      "",
      this.OPRegForm.value.note || false,
      this.noteRemark || "",
      this.OPRegForm.value.surveySMS || false,
      this.OPRegForm.value.receivePromotional || false,
      "",
      this.OPRegForm.value.verifiedOnline == "" ? 0 : 1,
      this.ewsDetails.bplCardNo,
      false,
      this.OPRegForm.value.adhaarId,
      this.passportDetails.HCF.value,
      this.OPRegForm.value.altLandlineName,
      this.OPRegForm.value.organdonor || false,
      this.OPRegForm.value.otAdvanceExclude || false,
      this.seafarerDetails.HKID || "",
      this.seafarerDetails.rank || "",
      this.seafarerDetails.Vesselname || "",
      this.seafarerDetails.FDPGroup || "",
      this.OPRegForm.controls["hwc"].value || false,
      this.hwcRemark || "",
      this.OPRegForm.controls["idenityType"].value || 0,
      this.OPRegForm.value.idenityValue,
      0,
      this.ewsDetails.bplCardNo,
      this.OPRegForm.value.hotlist || false,
      "",
      ""
    ));
  }

  //SETTING UP DEFAULT DATE AND HCF VALUE FOR API CALLS
  getPassportDetailObj() {
    if (this.passportDetails.passportNo == "") {
      this.passportDetails.Expirydate = null;
      this.passportDetails.IssueDate = null;
      this.passportDetails.HCF.value = 0;
      this.passportDetails.Issueat = "";
      this.passportDetails.passportNo = "";
    }
  }

  //FETCHING FATHER DETAILS FROM DROP DOWN
  getFather(): string {
    let response = "";
    if (
      this.OPRegForm.controls["fatherSpouse"].value != undefined &&
      this.OPRegForm.controls["fatherSpouse"].value != ""
    ) {
      if (this.OPRegForm.controls["fatherSpouse"].value == "Father") {
        return this.OPRegForm.value.fatherSpouseName;
      }
    }
    return response;
  }
  getSpouseName() {
    let response = "";
    if (
      this.OPRegForm.controls["fatherSpouse"].value != undefined &&
      this.OPRegForm.controls["fatherSpouse"].value != ""
    ) {
      if (this.OPRegForm.controls["fatherSpouse"].value != "Father") {
        return this.OPRegForm.value.fatherSpouseName;
      }
    }
    return response;
  }

  modfiedPatiendDetails!: ModifiedPatientDetailModel;
  registeredPatiendDetails!: ModifiedPatientDetailModel;
  getModifiedPatientDetailObj(): ModifiedPatientDetailModel {
    //this.checkForForeignerCheckbox();
    return (this.modfiedPatiendDetails = new ModifiedPatientDetailModel(
      this.OPRegForm.value.maxid.split(".")[1],
      this.OPRegForm.value.maxid.split(".")[0],
      this.OPRegForm.controls["title"].value,
      this.OPRegForm.value.firstName,
      this.OPRegForm.value.middleName,
      this.OPRegForm.value.lastName,
      this.OPRegForm.controls["gender"].value,
      this.OPRegForm.value.mobileNumber,
      "",
      this.OPRegForm.value.emailId,
      this.OPRegForm.value.nationality.value,
      this.OPRegForm.value.foreigner || false,
      this.patientDetails.passportNo,
      this.datepipe.transform(
        this.patientDetails.issueDate,
        "yyyy-MM-ddThh:mm:ss"
      ) || null,
      this.datepipe.transform(
        this.patientDetails.expiryDate,
        "yyyy-MM-ddThh:mm:ss"
      ) || null,
      this.patientDetails.passportIssuedAt,
      Number(this.cookie.get("UserId")),
      Number(this.cookie.get("HSPLocationId")),
      false,
      this.OPRegForm.value.mobileNumber,
      false,
      "",
      ""
    ));
  }

  checkForForeignerCheckbox() {
    if (
      // commented as UAT requirement change
      // this.OPRegForm.value.nationality.title.toLowerCase() != "indian" &&
      this.OPRegForm.value.foreigner == false
    ) {
      this.OPRegForm.controls["foreigner"].setValue(true);
    }
  }
  // ON MOFIFY BUTTON PRESS CALL
  registeredPatientDetails(patientDetails: ModifiedPatientDetailModel) {
    let expdate =
      patientDetails.expiryDate != null
        ? this.datepipe.transform(
            patientDetails.expiryDate,
            "yyyy-MM-ddThh:mm:ss"
          )
        : "1900-01-01T00:00:00";
    this.modfiedPatiendDetails = new ModifiedPatientDetailModel(
      patientDetails.registrationno,
      patientDetails.iacode,
      patientDetails.title,
      patientDetails.firstname,
      patientDetails.middleName,
      patientDetails.lastName,
      patientDetails.sex,
      patientDetails.pphone,
      "",
      patientDetails.pemail,
      patientDetails.nationality,
      patientDetails.foreigner,
      patientDetails.passportNo,
      this.datepipe.transform(
        patientDetails.issueDate,
        "yyyy-MM-ddThh:mm:ss"
      ) || null,
      expdate || null,
      patientDetails.passportIssuedAt,
      Number(this.cookie.get("UserId")),
      Number(this.cookie.get("HSPLocationId")),
      false,
      patientDetails.pphone,
      false,
      "",
      ""
    );
  }

  openReportModal(btnname: string) {
    if (btnname == "PrintLabel") {
      this.reportService.getOPRegistrationPrintLabel(
        this.OPRegForm.value.maxid
      );
      {
        console.log("success");
      }
    } else if (btnname == "PrintForm") {
      this.reportService.getOPRegistrationForm(this.OPRegForm.value.maxid);
      {
        console.log("success");
      }
    } else if (btnname == "PrintOD") {
      this.reportService.getOPRegistrationOrganDonorForm(
        this.OPRegForm.value.maxid
      );
      console.log("success");
    }
  }

  //for Date of birth and age calculation
  showAge: number | undefined;
  showAgeType: any;
  dateNotValid: boolean = false;
  convetAge: Date = new Date();
  timeDiff: number | undefined;
  dobFlag: boolean = false;
  ageFlag: boolean = false;

  onageCalculator() {
    console.log(this.OPRegForm.value.dob);
    // if (!this.MaxIDExist) {
    if (this.OPRegForm.value.dob == "") {
      this.OPRegForm.value.age = null;
      this.OPRegForm.controls["ageType"].setValue(null);
    }
    this.timeDiff = 0;
    if (this.OPRegForm.value.dob) {
      this.dobFlag = true;
      this.ageFlag = false;
    }
    console.log(this.OPRegForm.value.age);

    if (new Date(this.OPRegForm.value.dob) > new Date(Date.now())) {
      this.dateNotValid = true;
      this.OPRegForm.value.age = null;
      this.OPRegForm.controls["ageType"].setValue(this.ageTypeList[3].id);
      let element: HTMLElement = document.getElementById(
        "saveform"
      ) as HTMLElement;
    } else {
      this.dateNotValid = false;
    }
    let year = new Date(this.OPRegForm.value.dob).getFullYear();

    if (year > 1000) {
      if (this.OPRegForm.value.dob) {
        this.timeDiff =
          new Date(Date.now()).getFullYear() -
          new Date(this.OPRegForm.value.dob).getFullYear();
        if (this.timeDiff <= 0) {
          this.timeDiff =
            new Date(Date.now()).getMonth() -
            new Date(this.OPRegForm.value.dob).getMonth();

          var date1 = new Date(Date.now());
          var date2 = new Date(this.OPRegForm.value.dob);
          var timedifference = date1.getTime() - date2.getTime();

          var Difference_In_Days = Math.floor(
            timedifference / (1000 * 3600 * 24)
          );

          if (
            (this.timeDiff <= 0 || this.timeDiff == 1) &&
            Difference_In_Days < 30
          ) {
            if (this.timeDiff < 0) {
            } else {
              this.OPRegForm.controls["age"].setValue(
                Math.floor(Difference_In_Days)
              );
              this.OPRegForm.controls["ageType"].setValue(
                this.ageTypeList[0].id
              );
              console.log(this.ageTypeList[0].name);
            }
          } else {
            this.OPRegForm.controls["age"].setValue(Math.floor(this.timeDiff));
            this.OPRegForm.controls["ageType"].setValue(this.ageTypeList[3].id);
            console.log(this.ageTypeList[3].name);
          }
        } else {
          let currentmonth = new Date(Date.now()).getMonth();
          let MonthofDOB = new Date(this.OPRegForm.value.dob).getMonth();
          let monthDiff = currentmonth - MonthofDOB;
          let monthDiff2 = MonthofDOB - currentmonth;
          if (monthDiff <= 1 && monthDiff2 >= 1 && this.timeDiff == 1) {
            if (monthDiff < 12 && this.timeDiff == 1) {
              if (monthDiff <= 0) {
                this.OPRegForm.controls["age"].setValue(
                  12 - MonthofDOB + currentmonth
                );
              } else {
                this.OPRegForm.controls["age"].setValue(monthDiff);
              }
            }
            this.OPRegForm.controls["ageType"].setValue(this.ageTypeList[3].id);
          } else {
            this.OPRegForm.controls["age"].setValue(Math.floor(this.timeDiff));
            this.OPRegForm.controls["ageType"].setValue(this.ageTypeList[4].id);
            console.log(this.ageTypeList[4].name);
          }
        }
      } else {
        this.OPRegForm.controls["age"].setValue(this.OPRegForm.value.age);
        console.log(this.OPRegForm.controls["ageType"].value);
      }
    }
    // }
  }
  similaragetypePatientList: SimilarSoundPatientResponse[] = [];
  getSimilarpatientlistonagetype() {
    if (
      this.OPRegForm.controls["gender"].value != undefined &&
      this.OPRegForm.controls["gender"].value != "" &&
      this.OPRegForm.controls["gender"].value != null &&
      this.OPRegForm.controls["age"].value != undefined &&
      this.OPRegForm.controls["age"].value != "" &&
      this.OPRegForm.controls["age"].value != null &&
      this.OPRegForm.controls["firstName"].value != undefined &&
      this.OPRegForm.controls["firstName"].value != "" &&
      this.OPRegForm.controls["firstName"].value != null &&
      this.OPRegForm.controls["lastName"].value != undefined &&
      this.OPRegForm.controls["lastName"].value != "" &&
      this.OPRegForm.controls["lastName"].value != null
    ) {
      console.log(this.similaragetypePatientList.length);
      if (!this.MaxIDExist && !this.maxIDChangeCall) {
        this.matDialog.closeAll();
        this.http
          .post(ApiConstants.similarSoundPatientDetail, {
            firstName: this.OPRegForm.value.firstName,
            lastName: this.OPRegForm.value.lastName,
            gender:
              this.OPRegForm.value.gender == 1
                ? "Male"
                : this.OPRegForm.value.gender == 2
                ? "Female"
                : "Transgender",
            dob: this.datepipe.transform(
              this.OPRegForm.value.dob,
              "yyyy-MM-ddThh:mm:ss"
            ),
          })
          .pipe(takeUntil(this._destroying$))
          .subscribe(
            (resultData: SimilarSoundPatientResponse[]) => {
              this.similaragetypePatientList = resultData;
              console.log(this.similaragetypePatientList);
              if (this.similaragetypePatientList.length != 0) {
                const formsubmitdialogref = this.matDialog.open(
                  RegistrationDialogueComponent,
                  {
                    width: "30vw",

                    data: {
                      message1:
                        "Similar sound patient detail exists. Please validate",
                      message2: "",
                      btn1: true,
                      btn2: true,
                      bt1Msg: "Ok",
                      bt2Msg: "Cancel",
                    },
                  }
                );

                formsubmitdialogref
                  .afterClosed()
                  .pipe(takeUntil(this._destroying$))
                  .subscribe((result) => {
                    if (result == "Success") {
                      const similarSoundDialogref = this.matDialog.open(
                        SimilarPatientDialog,
                        {
                          width: "60vw",
                          height: "80vh",
                          data: {
                            searchResults: this.similaragetypePatientList,
                          },
                        }
                      );
                      similarSoundDialogref
                        .afterClosed()
                        .pipe(takeUntil(this._destroying$))
                        .subscribe((result) => {
                          if (result) {
                            console.log(result.data["added"][0].maxid);
                            let maxID = result.data["added"][0].maxid;
                            this.OPRegForm.controls["maxid"].setValue(maxID);
                            this.getPatientDetailsByMaxId();
                          }
                          console.log("agetype dialog was closed");
                          this.similaragetypePatientList = [];
                        });
                    } else {
                      this.questions[11].elementRef.focus();
                    }
                  });
              } else {
                console.log("no data found");
              }
            },
            (error) => {
              console.log(error);
              this.messageDialogService.info(error.error);
            }
          );
      }
    }
  }
  validatePatientAge() {
    //need to implement logic for patient who has age < 18 years but DOB not provided.
    // need to mention DOB as mandatory.
    if (
      this.OPRegForm.value.age != null ||
      this.OPRegForm.value.age != undefined ||
      this.OPRegForm.value.age != ""
    ) {
      if (
        this.OPRegForm.value.age > 0 &&
        this.OPRegForm.value.age < 18 &&
        (this.OPRegForm.controls["ageType"].value != null ||
          this.OPRegForm.controls["ageType"].value != undefined)
      ) {
        if (
          this.OPRegForm.value.dob == null ||
          this.OPRegForm.value.dob == undefined ||
          this.OPRegForm.value.dob == ""
        ) {
          this.OPRegForm.controls["dob"].setErrors({ incorrect: true });
          this.questions[8].customErrorMessage =
            "DOB is required, Age is less than 18 Years";
          this.OPRegForm.controls["dob"].markAsTouched();
        }
      } else if (
        this.OPRegForm.controls["ageType"].value == 1 &&
        this.OPRegForm.value.age >= 18
      ) {
        this.OPRegForm.controls["dob"].setErrors(null);
        this.questions[8].customErrorMessage = "";
      }
    }
  }

  doCategoryIconAction(categoryIcon: any) {
    const data: any = {
      note: {
        notes: this.noteRemarkdb,
      },
      vip: {
        notes: this.vipdb,
      },
      hwc: {
        notes: this.hwcRemarkdb,
      },
      ppagerNumber: {
        bplCardNo: this.ewsDetailsdb.bplCardNo,
        BPLAddress: this.ewsDetailsdb.bplCardAddress,
      },
      hotlist: {
        hotlistTitle: this.hotlistReasondb,
        reason: this.hotlistRemarkdb,
      },
    };
    if (
      categoryIcon.tooltip != "CASH" &&
      categoryIcon.tooltip != "INS" &&
      categoryIcon.tooltip != "PSU"
    ) {
      this.patientService.doAction(categoryIcon.type, data[categoryIcon.type]);
    }
  }

  //DIALOGS ---------------------------------------------------------------------------------------

  openVipNotes() {
    const vipNotesDialogref = this.matDialog.open(FormDialogueComponent, {
      width: "28vw",
      // height: "42vh",
      data: {
        title: "VIP Remarks",
        form: {
          title: "",
          type: "object",
          properties: {
            VipNotes: {
              type: "textarea",
              title: "",
              required: true,
              defaultValue: this.vip,
            },
          },
        },
        layout: "single",
        buttonLabel: "Save",
      },
    });
    vipNotesDialogref
      .afterClosed()
      .pipe(takeUntil(this._destroying$))
      .subscribe((result) => {
        if (result != "" && result != undefined) {
          this.vip = result.data.VipNotes;
        }
        console.log("openVipNotes dialog was closed");
      });
  }

  openNotes() {
    const notesDialogref = this.matDialog.open(FormDialogueComponent, {
      width: "28vw",
      // height: "47vh",
      data: {
        title: "Note Remarks",
        form: {
          title: "",
          type: "object",
          properties: {
            notes: {
              type: "textarea",
              title: "",
              required: true,

              defaultValue: this.noteRemark,
            },
          },
        },
        layout: "single",
        buttonLabel: "Save",
      },
    });
    notesDialogref
      .afterClosed()
      .pipe(takeUntil(this._destroying$))
      .subscribe((result) => {
        console.log(result);
        if (result != "" && result != undefined) {
          this.noteRemark = result.data.notes;
        }
        console.log("notes dialog was closed");
      });
  }

  openEWSDialogue() {
    const EWSDialogref = this.matDialog.open(FormDialogueComponent, {
      width: "28vw",
      // height: "56vh",
      data: {
        title: "EWS Details",
        form: {
          title: "",
          type: "object",
          properties: {
            bplCardNo: {
              type: "string",
              title: "BPL Card No.",
              required: true,
              defaultValue: this.ewsDetails.bplCardNo,
            },
            BPLAddress: {
              type: "textarea",
              title: "Address on card",
              required: true,
              defaultValue: this.ewsDetails.bplCardAddress,
            },
          },
        },
        layout: "single",
        buttonLabel: "Save",
      },
    });
    EWSDialogref.afterClosed()
      .pipe(takeUntil(this._destroying$))
      .subscribe((result) => {
        console.log("HWC dialog was closed");
        if (result != "" && result != undefined) {
          this.ewsDetails = {
            bplCardNo: result.data.BPLAddress,
            bplCardAddress: result.data.bplCardNo,
          };
        } else {
          this.OPRegForm.controls["paymentMethod"].setErrors({
            incorrect: true,
          });
          this.questions[40].customErrorMessage = "Invalid EWS details";
        }
      });
  }

  openHWCNotes() {
    const HWCnotesDialogref = this.matDialog.open(FormDialogueComponent, {
      width: "28vw",
      // height: "45vh",
      data: {
        title: "HWC Remarks",
        form: {
          title: "",
          type: "object",
          properties: {
            HWCRemark: {
              type: "textarea",
              //title: "HWC Remarks",
              required: true,
              defaultValue: this.hwcRemark,
            },
          },
        },
        layout: "single",
        buttonLabel: "Save",
      },
    });
    HWCnotesDialogref.afterClosed()
      .pipe(takeUntil(this._destroying$))
      .subscribe((result) => {
        if (result != "" && result != undefined) {
          this.hwcRemark = result.data.HWCRemark;
        }
        console.log("HWC dialog was closed");
      });
  }
  appointmentSearchClicked: boolean = false;
  openDialog() {
    this.appointmentSearchClicked = true;
    let appointmentSearchDialogref = this.matDialog.open(
      AppointmentSearchDialogComponent,
      {
        maxWidth: "100vw",
        width: "95vw",
      }
    );
    appointmentSearchDialogref
      .afterClosed()
      .pipe(takeUntil(this._destroying$))
      .subscribe((result) => {
        console.log(result);
        let apppatientDetails = result.data.added[0];
        // this.patientDetails = new PatientDetails();

        //CLEARING DATA BEFORE APPOINTMENT SEARCH CALL
        this.clear();

        //ASSIGNING MAX ID FROM SELECTED ROW OF APPOINTMENT POP UP
        let maxid =
          apppatientDetails.iAcode + "." + apppatientDetails.registrationno;

        //IF IACODE IS EMPTY THAT MEAN NOT REGIGISTRATION PATIENT
        if (apppatientDetails.iAcode == "") {
          //CREATING OBJ FOR SETTING OPPOINTMENT PATIENT VALUES TO FORM
          let appointmentPatientDetails = new PatientDetails(
            apppatientDetails.id,
            0,
            this.cookie.get("LocationIACode"), //IA CODE PULLING FROM CURRENT LOGGED IN USER ID
            apppatientDetails.registeredDateTime,
            apppatientDetails.registeredBy
              ? apppatientDetails.registeredBy
              : "",
            "",
            apppatientDetails.title,
            apppatientDetails.firstName,
            "",
            apppatientDetails.lastName,
            "",
            "",
            false,
            this.datepipe.transform(
              apppatientDetails.dob,
              "yyyy-MM-ddThh:mm:ss"
            ) || "1900-01-01T00:00:00",
            apppatientDetails.sex,
            11,
            "",
            0,
            "",
            0,
            "",
            "",
            "",
            apppatientDetails.email.toLowerCase(),
            0,
            apppatientDetails.age,
            apppatientDetails.houseNo,
            "",
            "",
            0,
            0,
            0,
            0,
            0,
            apppatientDetails.mobileno,
            apppatientDetails.mobileno,
            apppatientDetails.email,
            "",
            0,
            0,
            false,
            "",
            "",
            "",
            "",
            "",
            0,
            0,
            "",
            false,
            false,
            false,
            0,
            "",
            "",
            apppatientDetails.billNo != 0 ? true : false,
            apppatientDetails.amount,
            0,
            0,
            0,
            "",
            "",
            "",
            0,
            false,
            apppatientDetails.isdoborAge,
            0,
            "",
            "",
            0,
            false,
            "",
            false,
            "",
            "",
            0,
            0,
            "",
            0,
            0,
            0,
            "",
            "",
            "",
            0,
            !apppatientDetails.isdoborAge,
            apppatientDetails.locationId,
            apppatientDetails.locality,
            0,
            false,
            false,
            false,
            "",
            "",
            "",
            "",
            false,
            "",
            false,
            false,
            "",
            0,
            0,
            "",
            "",
            "",
            false,
            "",
            0,
            "",
            false,
            false,
            0,
            0,
            "",
            "",
            "",
            "",
            false,
            "",
            0,
            "",
            0,
            "",
            "",
            "",
            "",
            apppatientDetails.city,
            "",
            apppatientDetails.country,
            apppatientDetails.state,
            apppatientDetails.locality,
            apppatientDetails.nationality,
            false,
            "",
            ""
          );
          //SETTING APPOINTMENT DETAIL OBJECT THE OBJ TO THE FORM
          this.setValuesToOPRegForm(appointmentPatientDetails);
        } else {
          //SETTING THE MAX ID FROM APPOINTMENT PATIENT SEARCH
          this.OPRegForm.value.maxid = maxid;

          //SEARCHING PATIENT BYH MAXID
          this.getPatientDetailsByMaxId();
        }
      });
    this.appointmentSearchClicked = false;

    // let appointmentSearchDialogref = this.matDialog.open(
    //   AppointmentSearchDialogComponent,
    //   {
    //     maxWidth: "100vw",
    //   }
    // );
    // appointmentSearchDialogref
    //   .afterClosed()
    //   .pipe(takeUntil(this._destroying$))
    //   .subscribe((result) => {
    //     console.log(result);

    //     console.log("appointment dialog was closed");
    //   });
  }

  modfiedPatiendDetailsForPopUp!: ModifiedPatientDetailModel;

  modifyDialogg() {
    this.modfiedPatiendDetailsForPopUp = this.getModifiedPatientDetailObj();
    this.modfiedPatiendDetailsForPopUp.title = this.genderList.filter(
      (g) => g.id === this.OPRegForm.controls["gender"].value
    )[0].name;
    this.modfiedPatiendDetailsForPopUp.nationality =
      this.OPRegForm.value.nationality.title;

    const modifyDetailDialogref = this.matDialog.open(ModifyDialogComponent, {
      width: "30vw",
      height: "96vh",
      data: {
        patientDetails: this.patientDetails,
        modifiedDetails: this.modfiedPatiendDetailsForPopUp,
      },
    });

    modifyDetailDialogref
      .afterClosed()
      .pipe(takeUntil(this._destroying$))
      .subscribe((result) => {
        console.log(result);
        if (result == "success") {
          this.postModifyCall();
          this.isPatientdetailModified = false;
        }
      });
  }

  passportDetailsdialog(hcfMasterList: { title: string; value: number }[]) {
    let hcfTitle;
    if (
      this.passportDetails.HCF.value != 0 &&
      this.passportDetails.HCF != undefined &&
      this.passportDetails.HCF != null
    ) {
      let hcfvalue = hcfMasterList.filter((e) => {
        e.value == this.passportDetails.HCF.value;
        return e.value;
      });
      hcfTitle = {
        title: hcfvalue[0].title,
        value: this.passportDetails.HCF.value,
      };
    }
    let minExpDate;
    let maxYear;
    if (this.passportDetails.passportNo != "") {
    } else {
      minExpDate = new Date(
        new Date(Date.now()).setFullYear(new Date(Date.now()).getFullYear() + 1)
      );
      maxYear = new Date(
        new Date(Date.now()).setFullYear(
          new Date(Date.now()).getFullYear() + 15
        )
      );
    }
    //MEED TO SET DEFAULT HCF VALUE
    const passportDetailDialogref = this.matDialog.open(FormDialogueComponent, {
      width: "30vw",
      // height: "52vh",
      data: {
        title: "Passport Details",
        form: {
          title: "",
          type: "object",
          properties: {
            passportNo: {
              type: "string",
              title: "Passport No.",
              required: true,
              defaultValue: this.passportDetails.passportNo,
            },
            issueDate: {
              type: "date",
              title: "Issue Date",
              required: true,
              maximum: new Date(),

              defaultValue: this.passportDetails.IssueDate,
            },
            expiryDate: {
              type: "date",
              title: "Expiry Date",
              required: true,
              minimum: minExpDate,
              maximum: maxYear,
              defaultValue: this.passportDetails.Expirydate,
            },
            issuedAt: {
              type: "string",
              title: "Issued At",
              required: true,
              defaultValue: this.passportDetails.Issueat,
            },
            hcf: {
              type: "autocomplete",
              title: "HCF",
              defaultValue: hcfTitle,
              required: false,
              options: hcfMasterList,
            },
          },
        },
        layout: "double",
        buttonLabel: "Save",
      },
    });
    passportDetailDialogref
      .afterClosed()
      .pipe(takeUntil(this._destroying$))
      .subscribe((result) => {
        console.log("passport dialog was closed ");
        if (this.passportDetails.passportNo != "") {
          this.OPRegForm.controls["foreigner"].setValue(true);
        } else {
          if (result == undefined || result.data == undefined) {
            this.OPRegForm.controls["foreigner"].setValue(false);
            if (this.OPRegForm.value.nationality.value != 149) {
              this.OPRegForm.controls["nationality"].setErrors({
                incorrect: true,
              });
              this.questions[28].customErrorMessage =
                "foreigner unchecked as passport not entered.";
            }
          } else {
            this.passportDetails = {
              Expirydate:
                this.datepipe.transform(
                  result.data.expiryDate,
                  "yyyy-MM-ddThh:mm:ss"
                ) || null,
              Issueat: result.data.issuedAt,
              IssueDate:
                this.datepipe.transform(
                  result.data.issueDate,
                  "yyyy-MM-ddThh:mm:ss"
                ) || null,
              passportNo: result.data.passportNo,
              HCF: result.data.hcf,
            };
            console.log(this.passportDetails);
            this.OPRegForm.controls["nationality"].setErrors(null);
            this.questions[28].customErrorMessage = "";
          }
        }
      });
  }
  seafarersDetailDialogref: any | null;
  seafarersDetailsdialog() {
    if (!this.seafarersDetailDialogref) {
      const seafarersDetailDialogref = this.matDialog.open(
        FormDialogueComponent,
        {
          width: "30vw",
          height: "52vh",
          data: {
            title: "Seafarers Details",
            form: {
              title: "",
              type: "object",
              properties: {
                hkID: {
                  type: "string",
                  title: "HK ID",
                  required: true,
                  defaultValue: this.seafarerDetails.HKID,
                },
                vesselName: {
                  type: "string",
                  title: "Vessel name",
                  required: true,
                  defaultValue: this.seafarerDetails.Vesselname,
                },
                rank: {
                  type: "string",
                  title: "Rank",
                  required: true,
                  defaultValue: this.seafarerDetails.rank,
                },
                fdpGroup: {
                  type: "string",
                  title: "FDP Group",
                  required: true,
                  defaultValue: this.seafarerDetails.FDPGroup,
                },
              },
            },
            layout: "double",
            buttonLabel: "Save",
          },
        }
      );
      seafarersDetailDialogref
        .afterClosed()
        .pipe(takeUntil(this._destroying$))
        .subscribe((result) => {
          console.log("seafarers dialog was closed");
          if (result != "" && result != undefined) {
            this.seafarerDetails = {
              HKID: result.data.hkID,
              Vesselname: result.data.vesselName,
              rank: result.data.rank,
              FDPGroup: result.data.fdpGroup,
            };
          }
          this.seafarersDetailDialogref = null;
        });
    }
  }
  openDMSDialog(dmsDetailList: any) {
    this.matDialog.open(DMSComponent, {
      width: "100vw",
      data: {
        list: dmsDetailList,
        maxid:
          this.patientDetails.iacode + "." + this.patientDetails.registrationno,
        firstName: this.patientDetails.firstname,
        lastName: this.patientDetails.lastName,
      },
    });
  }
}
function phone(
  similarSoundPatientDetail: string,
  phone: any,
  arg2: { this: any }
) {
  throw new Error("Function not implemented.");
}
@Component({
  selector: "out-patients-op-registration",
  templateUrl: "similarPatient-dialog.html",
})
export class SimilarPatientDialog {
  @ViewChild("patientDetail") tableRows: any;
  constructor(
    private dialogRef: MatDialogRef<SimilarPatientDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  // searchResults:{verify:string,isVerified:string,remarks:string,view:string,fileName:string,docName:string,idType:string}[]=[] as any
  ngOnInit(): void {
    console.log(this.data.searchResults);

    // this.searchResults.push({verify:"no",isVerified:"no",remarks:"no",view:"no",fileName:"xyz",docName:"docname",idType:"idtype"});
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
    console.log(event);

    this.tableRows.selection.changed.subscribe((res: any) => {
      this.dialogRef.close({ data: res });
    });
  }
}
