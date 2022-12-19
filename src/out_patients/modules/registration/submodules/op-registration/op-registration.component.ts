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
import * as moment from "moment";
import { BillingApiConstants } from "@modules/billing/submodules/billing/BillingApiConstant";
import { debug } from "console";
import { PatientImageUploadDialogComponent } from "@modules/registration/submodules/patient-image-upload-dialog/patient-image-upload-dialog.component";
import { patientImageModel } from "@core/models/patientImageModel";

export interface DialogData {
  expieryDate: Date;
  issueAt: string;
  passportNum: number;
  issuedate: Date;
  hcf: { id: number; title: string };
}

const hexToBase64 = (str: any) => {
  var bString = "";
  for (var i = 0; i < str.length; i += 2) {
    bString += String.fromCharCode(parseInt(str.substr(i, 2), 16));
  }
  return "data:image/png;base64," + window.btoa(bString);
};

const base64ToHexa = (str: any) => {
  const raw = window.atob(str);
  let result = "";
  for (let i = 0; i < raw.length; i++) {
    const hex = raw.charCodeAt(i).toString(16);
    result += hex.length === 2 ? hex : "0" + hex;
  }
  return result.toUpperCase();
};

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
  lastUpdatedBy: string | undefined;
  registeredBy: string | undefined;
  lastupdatedDate: any;
  lastregisteredDate: any;
  LastupdateExist: boolean = false;
  currentTime: any = this.datepipe.transform(new Date(), "dd/MM/yyyy hh:mm aa");
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
  expiredPatient: boolean = false;
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
  maxIDSearch: boolean = false;
  moment = moment;
  apiProcessing: boolean = false;
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
  onlineId: number = 0;
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
        type: "pattern_string",
        title: "First Name",
        required: true,
        pattern: "^[a-zA-Z0-9 ]*$",
        capitalizeText: true,
      },
      middleName: {
        type: "string",
        title: "Middle Name",
        required: false,
        pattern: "[A-Za-z. '']{1,32}",
        onlyKeyPressAlpha: true,
        capitalizeText: true,
      },
      lastName: {
        type: "string",
        title: "Last Name",
        required: true,
        pattern: "^[a-zA-Z '']*.?[a-zA-Z '']*$",
        onlyKeyPressAlpha: true,
        capitalizeText: true,
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
        type: "string",
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
          "^[A-Za-z0-9._%+-]{1}[A-Za-z0-9._%+-]+@(([a-zA-Z-0-9]+\\.+[a-zA-Z]{2,4}))$",
      },
      fatherSpouse: {
        type: "dropdown",
        options: this.fatherSpouseOptionList,
        required: false,
        emptySelect: true,
        placeholder: "Select",
      },
      fatherSpouseName: {
        type: "string",
        title: "",
        required: false,
        pattern: "^[A-Za-z]{1}[A-Za-z. '']{1,32}",
        onlyKeyPressAlpha: true,
        capitalizeText: true,
      },
      motherName: {
        type: "string",
        title: "Mother's Name",
        required: false,
        pattern: "^[A-Za-z]{1}[A-Za-z. '']{1,32}",
        onlyKeyPressAlpha: true,
        capitalizeText: true,
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
        emptySelect: true,
        placeholder: "Select",
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
        pattern: "^[A-Za-z0-9]{1}[A-Za-z0-9. '',/|`~!@#$%^&*()-]{1,49}",
        placeholder: "House No/Apartment/Street Name",
      },
      pincode: {
        type: "number",
        title: "Pincode",
        // required property is dependent on country
        required: true,
        // minimum: 5,
        // maximum: 6,
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
        allowSearchInput: false,
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
        type: "autocomplete",
        title: "Source of Info about Max Healthcare",
        required: false,
        options: this.sourceOfInfoList,
        emptySelect: true,
        placeholder: "Select",
      },
    },
  };
  patientImage: any;
  patientNoImage: any;
  fileType!: string;

  saveApimessage!: string;
  OPRegForm!: FormGroup;
  formProcessingFlag: boolean = true;
  questions: any;
  hotlistMasterList: hotlistingreasonModel[] = [];
  hotlistquestion: any;
  hotlistRemark: any;
  hotlistRemarkdb: any;
  isPatientdetailModified: boolean = false;
  private readonly _destroying$ = new Subject<void>();
  maxIDChangeCall: boolean = false;
  MaxIDExist: boolean = false;
  public isNoImage: boolean = true;
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
  disableforeigner: boolean = false;
  ngOnInit(): void {
    this.bool = true;
    this.isNoImage = true;
    this.patientNoImage =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAABrCAIAAAB/gh4NAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAi4SURBVHhe7Z2JcptIEED3/38xVSk7lhMfiS4s6wJ530w3eAySIkeI6RnrLWUDAjHdj7mQvPnv7UrWXAVnzlVw5lwFZ85VcObkL7gsy81ms1qtXl9fF4tFURTz+ZyfrC+XS/bzKsfo0dmRp+CqqtbrNQpxeTocz1mcq++SBVkJxg2VUuroOfAO1OzdbqfvmzKZCEYGatVPf6BZL5AsOQimXVUhl4H31yslSNqCSf35DfIpcJXtdqtXTYqEBX92DHU+jMP12umQquCXlxfN+rAk5zg9wYynYtkVaDm0KCmQmGDsDtPpHichx4kJjlt3Q1JxnJJg+j/Nrg2YeWvJDJOM4EtPdv8N+09CzAmmlxV021OWpWbUHsbnx7YEq1uP7jIzsDoEZQtLaw2LgquqClNmrevtYrkzNlqDddt24xxi9kNG64Os4Z9H/htmn3CZFrzZbDR/KWCzEhsVTCtNvuw81jgFm5XYqGDsUn0tD573YrASGxXM2KqXL98MjMGvBhgVTPVleJWcYIMPqI0Ktvlg8hQ0ADMYFbxarWazmeYsKaw9uTQnWB500AFPp1PNWVJYG0vbEix2GYuK4BQrMVM7DcYGhgQ3doF6MJlMEm2lNR4bmGuisUs3huBEazBoJDYwIVjqrqwjmDkSgrGbqGBCkFgsYFEwcyT5jCFRwab+VjG+YLELsolgRljylCNRwbRAEosFzNVgbn8mwUnXYFMPLM0NshAsTbTrga+Cz8aWYOpxIzjdUbSph1m2BNMBI1g+aWAerAlLjesg6yAimBogghOtwddp0kFoosXx9UlWX1gUDNcnWX1hTrCQ7ocNdC4ajA1sCQYRzFSYZKUo2NpfK5kTDAhmppTc93UEU0NosCgYZKakOUsHbkoNwAxGBTNTohvWtKUDZdYAzGBXsHTDaWHqGZZgVDA9Gd2wpi0dtPSWMCpYxtJptdIG22cwKlioqkqTlwKUVsttCeuCU6nENqsvmBYsDbWm0DaUUwttDOuC+Wl/OG3qE/4WpgU3WP5DYWvfdG9hTrBvlR267bE82rI5tmpIQzBst1vNqCVMfYFyLxYFUye6gtkzHo81rzaYTCbdclojDcFU34eHh/v7+z9//mh2Y0NJKM/j46O1j49aGG2idcPDKPrnz59kE1j5/fu35jgez8/PUh749euX5YbanOAWr6+vmsiAiI5ns9nT05OWo4bbztrn/A1GBVOJZVSlKexA2zj89z24ovQUe7k+i/4E2F0sFqPRSJO3D3I9HfD/AsC1aI312gcw6NiiYKpvURT4C7u6vQzTJVNxKUkzDjiOtadaMQW3BlOCNM4k9Nu3bz9+/NC0HYWKdbnRNTfQXytuCAebevQRTTAiu4LZQyvH/JIu9s6jaTsBxj79ttgU40iPewRKovEYII5gsQu67WGTukta6XqpB93B6ilw1ng8Pmf8xbm0B/929QbeRKOKjZUaLOvkl8YZwXR4VGLN1ufh9M+aFq9c9MS+9q8YmRybGGRhV8Ym5Je6K4I/1fMdQm4UZHPfAB0qFhHPT9ZlJ6+eczMdguZdoouLCcFA40wdCmtPXzUpIhYaaiuCGXne3Nwwqjo+900OblyNMBImBNM+c7Pf3t6KY81NFtAXaJCRiCyYiss9zvSGBplZ7/fv3/mZQeMcEvfRR2TBDK/KspSxK40zlVhGWDk5ZhCn0cYgvmAqMbVWxszSAWcmGCJ+1hRNsKhlpSiKZmDVCJbNbIjYE0cTTMssjwKkfZbxc2NaaG0mTawvfkQQTN1tmM/nTePcEG765ORArDnxxQWLSN3o0EyK8muWQ4iOm1VjHpYhanBXsOxZLpcSuaYha2io6JKG/yQxThMtHRJDj4eHh/DpFb4F2cwD19OMRs/Pz/RHw8+J4wiWG5mbGpeNXRC7gu7KBYJlQtzU4CPdVr9EG2Sxcnt723owqW49uisLCIf7mOl+E77g83FZIggWaK80+o/kZ1dAMHczTbS6zbgGC8RMB5ylyyMwWRrSLgwheG883M4iOOyDs4QAJUaCfXx8pBvOUHAYEusEKc+fv5Rg4iXqlmCfmwv6HrQGsyLDyMViIcHD1xEsyP+t1Gt9T4usXIJB+2AikRnweDymsZLIQUPPF41zNCJqYicD5CFnwcwIaa806C8gGCRSmQ2TgbChzkqwNNEyeJaYJf6vAMESOI4lFT4ljgwFi1rQ0L8YkgqfEkeGgsPnz3lDlZXmSiBqYpdU+JQ48hEsrNfrrya4gaibB5aSDchN8Hw+7wrWBOQOgd/c3JCEi0oNiSC4KApCRSqO94F7p/9yHL70xbnn4qPOny3t8K2rvRNB8MvLS/M9rBDarppb/X3n/usdEq1rA0D5m+XujqifHp/a/zJLZoK5f3FMPZ51mM6mnon7wdZsOp/NZZmxyGq9Z89So2/3EX3N/8sKulYfqRuKfy93vc7ir+F+uS133uGl/uWC8IunmBfEvlkHNRi1XrD/rUuPRBB8HDonxtpBvImzN4ImOKm7HcEsfdGn4D4GDi66j/FmRxOZX94FBzHL0gvWBIMGWIc8JHLpS6LBtReN1gccLudjRbA/Nzy9jjfY3TriU/y1bBywk+fDWpJTL9UcfdIJ4dHBotHW4YbLmfQs2CXo89QnfjiXDfLdRCm//aqnvb0feecu+nKN21W5f/bUO65cpt8v0D5YaB2hi5f0YVdI66VgkRM7u91yJr0J9qUJy7Mty+1ysy3r7xF6dm/lmkRuJBFuR11v5A3e2e6qV/cyZ9e7nYZuGvYQvOwzJ9Sv7bbl+2n+YztXQn7KJ10f0FNBdxzBXU+v5m8Rf31F1vcu8rqUVFbed/dAv4JDVpvNcrpYrj78iXv1ti425XqBaDkBudutpFiQ3btq+bZ1n5tuK85RdhXWg9yxdJFUNUfIpq+WDev1+8ZqteRGZAUtoWB3cnOql+Y29cXDuMM4vKSs7uQGzpU3kuIfeCP/krzcLOfx9vY/UtjHPe3MD7MAAAAASUVORK5CYII=";
    this.patientImage = this.patientNoImage;

    this.registeredBy =
      this.cookie.get("Name") + " ( " + this.cookie.get("UserName") + " )";
    this.formInit();
    this.route.queryParams
      .pipe(takeUntil(this._destroying$))
      .subscribe((value) => {
        if (value["maxId"]) {
          this.OPRegForm.value.maxid = value["maxId"];
          this.getPatientDetailsByMaxId();
        }
        if (value["id"]) {
          this.apiProcessing = true;
          this.onlineId = value["id"];
          this.getappointmentpatientssearchbyid(value["id"]);
        }
      });
    this.formProcessingFlag = false;
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
  getappointmentpatientssearchbyid(id: any) {
    this.getTitleList();
    this.http
      .get(ApiConstants.getappointmentpatientssearchbyid(id))
      .pipe(takeUntil(this._destroying$))
      .subscribe(async (res) => {
        this.OPRegForm.controls["mobileNumber"].setValue(res[0]?.mobileno, {
          emitEvent: false,
        });
        this.OPRegForm.controls["gender"].setValue(res[0]?.gender);
        this.OPRegForm.controls["emailId"].setValue(res[0]?.email);
        this.OPRegForm.controls["dob"].setValue(res[0]?.dob);
        this.OPRegForm.controls["title"].setValue(res[0]?.titleId, {
          emitEvent: false,
        });
        this.OPRegForm.controls["firstName"].setValue(res[0]?.firstName);
        this.OPRegForm.controls["lastName"].setValue(res[0]?.lastName);
        // this.OPRegForm.controls["age"].setValue(res[0]?.age);
        // this.OPRegForm.controls["ageType"].setValue(res[0]?.agetype);
        this.OPRegForm.controls["address"].setValue(res[0]?.houseNo);
        // this.OPRegForm.controls["pincode"].setValue(
        //   patientDetails?.ppinCode == 0 ? "" : patientDetails?.ppinCode
        // );
        this.OPRegForm.controls["country"].setValue({
          title: res[0]?.country,
          value: res[0]?.countryId,
        });
        this.OPRegForm.controls["state"].setValue({
          title: res[0]?.state,
          value: res[0]?.stateId,
        });
        // this.OPRegForm.controls["district"].setValue({
        //   title: patientDetails?.districtName,
        //   value: patientDetails?.pdistrict,
        // });
        this.OPRegForm.controls["city"].setValue({
          title: res[0]?.city,
          value: res[0]?.cityId,
        });
        this.apiProcessing = false;
      });
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
    this.isOrganDonor = false;
    this.OPRegForm = formResult.form;
    this.questions = formResult.questions;

    //as ABDM integration not completed so disabling HealthID Textbox
    this.OPRegForm.controls["healthId"].disable();

    // this.fatherSpouseOptionList.push({ title: "-Select-", value: 0 });
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
    // this.getAllStateList();
    this.getLocalityList();
    //added for initially load state based on country
    this.getStatesByCountry(this.OPRegForm.controls["country"].value);

    this.searchService.searchTrigger
      .pipe(takeUntil(this._destroying$))
      .subscribe(async (formdata: any) => {
        console.log(formdata);
        this.router.navigate([], {
          queryParams: {},
          relativeTo: this.route,
        });
        const lookupdata = await this.lookupService.searchPatient(formdata);
        console.log(lookupdata[0]);
        if (lookupdata.length == 1) {
          if (lookupdata[0] && "maxid" in lookupdata[0]) {
            this.OPRegForm.value.maxid = lookupdata[0]["maxid"];
            this.getPatientDetailsByMaxId();
            // if (lookupdata[0]["mergeLinked"]) {
            //   this.messageDialogService.info(
            //     "Max Id :" +
            //       lookupdata[0]["maxid"] +
            //       " merged with these " +
            //       lookupdata[0]["mergeLinked"]
            //   );
            // }
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

    //this.OPRegForm.controls["fatherSpouse"].setValue("-Select-");

    //this.OPRegForm.controls["idenityType"].setValue("-Select-");
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
    this.questions[2].elementRef.addEventListener(
      "blur",
      this.onPhoneModify.bind(this)
    );

    //ON MAXID CHANGE
    this.questions[0].elementRef.addEventListener("keypress", (event: any) => {
      // If the user presses the "Enter" key on the keyboard
      if (event.key === "Enter") {
        // Cancel the default action, if needed
        event.preventDefault();
        this.maxIDSearch = true;
        this.getPatientDetailsByMaxId();
      }
    });

    //ENTER EVENT ON PHONE NUMBER
    this.questions[2].elementRef.addEventListener("keypress", (event: any) => {
      // If the user presses the "Enter" key on the keyboard

      if (event.key === "Enter") {
        // Cancel the default action, if needed

        event.preventDefault();

        this.onEnterPhoneModify();
      }
    });

    //tab event for Mobile Field
    //this.questions[2].elementRef.addEventListener("keydown", (event: any) => {
    // If the user presses the "TAB" key on the keyboard

    //  if (event.key === "Tab") {
    // Cancel the default action, if needed

    // event.preventDefault();

    //this.onPhoneModify();
    //  }
    // });

    this.questions[2].elementRef.addEventListener(
      "change",
      this.resetPhoneFlag.bind(this)
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
    // this.questions[9].elementRef.addEventListener(
    //   "focus",
    //   this.onageCalculator.bind(this)
    // );

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
    // this.questions[28].elementRef.addEventListener(
    //   "blur"
    //   // this.onNationalityModify.bind(this)
    // );

    //ON MAXID CHANGE
    this.questions[0].elementRef.addEventListener(
      "change",
      this.MarkasMaxIDChange.bind(this)
    );

    this.questions[21].elementRef.addEventListener(
      "blur",
      this.getLocalityByPinCode.bind(this)
    );
  }

  citybasedflow: boolean = false;
  pincodebasedflow: boolean = false;
  formProcessing() {
    this.checkForMaxID();

    //unfreeze foreigner checkbox
    this.OPRegForm.controls["nationality"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((res) => {
        console.log(res, typeof res);
        //added for - able to save by don't lose focus of the nationality element
        if (res.title && res.value && typeof res == "object") {
          this.OPRegForm.controls["nationality"].setErrors(null);
          this.onNationalityModify();
        }
        if (typeof res == "string") {
          this.OPRegForm.controls["nationality"].setErrors({ incorrect: true });
        }
        this.disableforeigner = false;
      });

    // this.registeredPatiendDetails=this.patientDetails as ModifiedPatientDetailModel;
    //  if (this.maxIDChangeCall == false) {
    this.OPRegForm.controls["paymentMethod"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value: any) => {
        if (value == "ews") {
          if (this.maxIDChangeCall == false) {
            this.openEWSDialogue();
          }
        } else {
          this.ewsDetails.bplCardAddress = "";
          this.ewsDetails.bplCardNo = "";
        }
      });
    // }

    this.OPRegForm.controls["vip"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value: any) => {
        if (this.maxIDChangeCall == false && value) {
          this.openVipNotes();
        } else if (!value && !this.MaxIDExist) {
          this.vip = "";
        }
      });

    this.OPRegForm.controls["seaFarer"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value: any) => {
        if (this.maxIDChangeCall == false && value) {
          this.seafarersDetailsdialog();
        } else if (!value && !this.MaxIDExist) {
          this.seafarerDetails.FDPGroup = "";
          this.seafarerDetails.HKID = "";
          this.seafarerDetails.Vesselname = "";
          this.seafarerDetails.rank = "";
        }
      });

    this.OPRegForm.controls["note"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value: any) => {
        if (this.maxIDChangeCall == false && value) {
          this.openNotes();
        } else if (!value && !this.MaxIDExist) {
          this.noteRemark = "";
        }
      });
    this.OPRegForm.controls["hwc"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value: any) => {
        if (this.maxIDChangeCall == false && value) {
          this.openHWCNotes();
        } else if (!value && !this.MaxIDExist) {
          this.hwcRemark = "";
        }
      });
    this.OPRegForm.controls["hotlist"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value: any) => {
        if (this.maxIDChangeCall == false && value && !this.expiredPatient) {
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
        if (value) {
          this.onageCalculator(value);
          //this.questions[9].disabled = true;
          this.OPRegForm.controls["age"].disable();
          this.questions[10].disabled = true;
          if (!this.maxIDChangeCall) {
            if (this.checkForModifiedPatientDetail()) {
              this.modfiedPatiendDetails.dateOfBirth =
                this.OPRegForm.value.dateOfBirth;
              this.modfiedPatiendDetails.age = this.OPRegForm.value.age;
              this.modfiedPatiendDetails.agetype = this.OPRegForm.value.ageType;
            }
          }
          // if(this.datepipe.transform(this.OPRegForm.controls['dob'].value, 'dd/mm/yyyy') !=
          //   this.datepipe.transform(this.patientDetails?.dateOfBirth, 'dd/mm/yyyy'))
          //   {
          //     if (!this.maxIDChangeCall) {
          //       if (this.checkForModifiedPatientDetail()) {
          //         this.modfiedPatiendDetails.dateOfBirth =
          //           this.OPRegForm.value.dob;
          //         this.modfiedPatiendDetails.age = this.OPRegForm.value.age;
          //         this.modfiedPatiendDetails.agetype = this.OPRegForm.value.ageType;
          //       }
          //     }
          //   }
          //   else
          //   {
          //     this.isPatientdetailModified = false;
          //   }
        } else {
          //this.questions[9].disabled = false;
          this.OPRegForm.controls["age"].enable();
          this.questions[10].disabled = false;
          this.OPRegForm.controls["age"].setValue("");
          this.OPRegForm.controls["ageType"].setValue(0);
        }
      });

    this.OPRegForm.controls["age"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value: any) => {
        if (value) {
          if (!this.OPRegForm.value.dob) {
            this.questions[8].disabled = true;
            if (this.OPRegForm.controls["ageType"].value == 1 && value >= 18) {
              this.OPRegForm.controls["dob"].setErrors(null);
              this.questions[8].customErrorMessage = "";
            } else {
              if (this.OPRegForm.controls["ageType"].value) {
                if (value < 18) {
                  this.OPRegForm.controls["dob"].setErrors({ incorrect: true });
                  this.questions[8].customErrorMessage =
                    "DOB is required, Age is less than 18 Years";
                  this.questions[8].disabled = false;
                  this.OPRegForm.controls["dob"].markAsTouched();
                }
              }
            }
            if (!this.maxIDChangeCall) {
              if (this.checkForModifiedPatientDetail()) {
                this.modfiedPatiendDetails.dateOfBirth =
                  this.OPRegForm.value.dob;
                this.modfiedPatiendDetails.age = this.OPRegForm.value.age;
                this.modfiedPatiendDetails.agetype =
                  this.OPRegForm.value.ageType;
              }
            }
          } else {
            this.questions[8].disabled = false;
          }
        } else {
          this.questions[8].disabled = false;
        }
      });

    //on value chnae event of age Type
    this.OPRegForm.controls["ageType"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value: any) => {
        if (value != undefined && value != null && value != "" && value > 0) {
          this.validatePatientAge(value);
          this.getSimilarpatientlistonagetype();
          if (!this.maxIDChangeCall) {
            if (this.checkForModifiedPatientDetail()) {
              this.modfiedPatiendDetails.dateOfBirth = this.OPRegForm.value.dob;
              this.modfiedPatiendDetails.age = this.OPRegForm.value.age;
              this.modfiedPatiendDetails.agetype = this.OPRegForm.value.ageType;
            }
          }
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
        if (this.OPRegForm.value.country.value != 1) {
          this.OPRegForm.controls["locality"].setErrors(null);
          // this.OPRegForm.controls["city"].setErrors(null);
          // this.OPRegForm.controls["state"].setErrors(null);
          this.OPRegForm.controls["district"].setErrors(null);
          this.OPRegForm.controls["pincode"].setErrors(null);
          this.questions[21].required = false;
          this.questions[22].required = false;
          this.questions[23].required = false;
          this.questions[24].required = true;
          this.questions[25].required = false;
          this.questions[26].required = true;
          this.questions = { ...this.questions };
        }
      });
    //value chnage event of country to fill city list and staelist
    this.OPRegForm.controls["country"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value: any) => {
        this.questions[25].options = [];
        this.questions[22].options = [];
        this.questions = { ...this.questions };
        this.clearAddressOnCountryChange();
        if (
          this.OPRegForm.value.country.value != undefined &&
          this.OPRegForm.value.country.value != null &&
          this.OPRegForm.value.country.value != ""
        ) {
          this.getStatesByCountry(value);
          this.getCitiesByCountry(value);
          if (this.OPRegForm.value.country.value != 1) {
            this.disttList = [];
            this.localityList = [];
            this.OPRegForm.controls["pincode"].setErrors(null);
            this.OPRegForm.controls["locality"].setErrors(null);
            this.questions[21].required = false;
            this.questions[22].required = false;
            this.questions[23].required = false;
            this.questions[24].required = true;
            this.questions[25].required = false;
            this.questions[26].required = true;
            this.questions = { ...this.questions };
            console.log(this.OPRegForm.controls);
            console.log(this.questions);

            //commented this on 25/11/2022 by deena - causing issue while changing country for foreigner nationality
            // if (!this.OPRegForm.value.nationality.value) {
            //   this.OPRegForm.controls["nationality"].setValue(null);
            // } else {
            //   this.OPRegForm.controls["nationality"].setValue({
            //     title: this.OPRegForm.value.nationality.title,
            //     value: this.OPRegForm.value.nationality.value,
            //   });
            // }
          } else {
            this.questions[21].required = true;
            this.questions[22].required = true;
            this.questions[24].required = true;
            this.questions[25].required = true;
            this.questions[26].required = true;
          }
        }
        console.log(this.OPRegForm);
      });
    //value chnage event of state to fill city list and district list
    this.OPRegForm.controls["state"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value: any) => {
        // this.clearAddressOnStateChange();
        if (this.OPRegForm.value.state) {
          if (
            this.OPRegForm.value.state.value != undefined &&
            this.OPRegForm.value.state.value != null &&
            this.OPRegForm.value.state.value != ""
          ) {
            this.getDistricyListByState(value);
            this.getCityListByState(value);
            if (!this.OPRegForm.controls["locality"].value) {
              this.countrybasedflow = true;
            }
          }
        }
        //added on 25/11/2022 - by deena for empty state refresh other fields
        else {
          this.OPRegForm.controls["city"].setValue("");
          this.OPRegForm.controls["district"].setValue("");
          // this.OPRegForm.controls["locality"].setValue('');
          this.getStatesByCountry(this.OPRegForm.controls["country"].value);
          this.getCitiesByCountry(this.OPRegForm.controls["country"].value);
          this.questions[25].options = [];
          this.localitybyCityList = [];
          this.questions[22].options = [];
          this.questions = { ...this.questions };
        }

        if (this.OPRegForm.value.country.value != 1) {
          this.OPRegForm.controls["pincode"].setErrors(null);
          // this.OPRegForm.controls["city"].setErrors(null);
          // this.OPRegForm.controls["state"].setErrors(null);
          this.OPRegForm.controls["district"].setErrors(null);
          this.OPRegForm.controls["locality"].setErrors(null);

          this.questions[21].required = false;
          this.questions[22].required = false;
          this.questions[23].required = false;
          this.questions[24].required = true;
          this.questions[25].required = false;
          this.questions[26].required = true;
          this.questions = { ...this.questions };
        }
      });

    this.OPRegForm.controls["district"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value: any) => {
        if (this.countrybasedflow && !value && this.OPRegForm.value.state) {
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
        if (this.OPRegForm.value.country && this.OPRegForm.value.country.value && this.OPRegForm.value.country.value != 1) {
          this.OPRegForm.controls["pincode"].setErrors(null);
          this.OPRegForm.controls["district"].setErrors(null);
          this.OPRegForm.controls["locality"].setErrors(null);
          this.questions[21].required = false;
          this.questions[22].required = false;
          this.questions[23].required = false;
          this.questions[24].required = true;
          this.questions[25].required = false;
          this.questions[26].required = true;
          this.questions = { ...this.questions };
        }
      });

    //city chnage event
    this.OPRegForm.controls["city"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value: any) => {
        if (typeof value != "object") {
          this.OPRegForm.controls["city"].setErrors({ incorrect: true });
        } else if (typeof value == "object") {
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
              this.questions[25].readonly = false;
              this.questions[26].readonly = false;
              this.getAddressByCity(value);
            } else {
              if (this.countrybasedflow) {
                this.citybasedflow = false;
                // this.getCityListByState(this.OPRegForm.value.state);
                this.getLocalityByCity(value);
                if (this.OPRegForm.value.country.value != 1) {
                  this.OPRegForm.controls["pincode"].setErrors(null);
                  this.OPRegForm.controls["district"].setErrors(null);
                  this.OPRegForm.controls["locality"].setErrors(null);
                  this.questions[21].required = false;
                  this.questions[22].required = false;
                  this.questions[23].required = false;
                  this.questions[24].required = true;
                  this.questions[25].required = false;
                  this.questions[26].required = true;
                  this.questions = { ...this.questions };
                }
              } else if (!this.pincodebasedflow) {
                this.citybasedflow = true;
                //this.clearAddressOnCityChange();
                this.getLocalityByCity(value);
              }
            }
          }
        }
        //added on 25/11/2022 - deena for empty city with other country show error
        else {
          if (this.OPRegForm.value.country.value != 1) {
            this.OPRegForm.controls["pincode"].setErrors(null);
            this.OPRegForm.controls["district"].setErrors(null);
            this.OPRegForm.controls["locality"].setErrors(null);
            this.questions[21].required = false;
            this.questions[22].required = false;
            this.questions[23].required = false;
            this.questions[24].required = true;
            this.questions[25].required = false;
            this.questions[26].required = true;
            this.questions = { ...this.questions };
          }
        }
      });

    //locality chnage event
    this.OPRegForm.controls["locality"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe(async (value: any) => {
        //if (!this.maxIDChangeCall && this.countrybasedflow) {
        //  this.OPRegForm.controls["pincode"].setValue("");
        //}
        if (
          (this.OPRegForm.value.pincode == "" ||
            this.OPRegForm.value.pincode == undefined ||
            this.OPRegForm.value.pincode == null) &&
          ((this.OPRegForm.value.city &&
            (this.OPRegForm.value.city.value == undefined ||
              this.OPRegForm.value.city.value == "" ||
              this.OPRegForm.value.city.value == null)) ||
            !this.OPRegForm.value.city)
        ) {
          this.OPRegForm.controls["locality"].setErrors(null);
          this.questions[22].customErrorMessage = "";
          if (!value.value) {
            if (value.length >= 3) {
              this.localitybyCityList = await this.http
                .get(ApiConstants.getlocalityByName(value))
                .toPromise();
              if (this.localitybyCityList) {
                if (this.localitybyCityList.length > 0) {
                  this.questions[22].options = this.localitybyCityList.map(
                    (l: any) => {
                      return { title: l.localityName, value: l.id };
                    }
                  );
                  this.questions[22] = { ...this.questions[22] };
                }
              }
            }
          }

          if (this.localitybyCityList) {
            if (value.value && this.localitybyCityList.length > 0) {
              let pincode = this.localitybyCityList.filter(
                (l) => l.id === value.value
              )[0].pincode;

              this.OPRegForm.controls["pincode"].setValue(Number(pincode));
              this.pincodebasedflow = true;
              this.countrybasedflow = false;
              this.citybasedflow = false;
              this.addressByLocalityID(value);
            } else if (value && value.value) {
              this.OPRegForm.controls["locality"].setErrors(null);
              this.questions[22].customErrorMessage = "";
              this.addressByLocalityID(value);
            }
          } else if (value && value.value) {
            this.OPRegForm.controls["locality"].setErrors(null);
            this.questions[22].customErrorMessage = "";
            this.addressByLocalityID(value);
          }
        } else if (
          value.value > 0 &&
          value.value != undefined &&
          value.value != null &&
          value.value != ""
        ) {
          this.OPRegForm.controls["locality"].setErrors(null);
          this.questions[22].customErrorMessage = "";
          this.addressByLocalityID(value);
        } else if (!value.value && value.value != 0) {
          if (value.trim() == "") {
            this.OPRegForm.controls["locality"].setErrors({ incorrect: true });
            this.questions[22].customErrorMessage = "locality is required";
          } else {
            this.OPRegForm.controls["locality"].setErrors(null);
            this.questions[22].customErrorMessage = "";
          }
        }

        if (this.OPRegForm.value.country && this.OPRegForm.value.country.value && this.OPRegForm.value.country.value != 1) {
          this.OPRegForm.controls["pincode"].setErrors(null);
          this.OPRegForm.controls["district"].setErrors(null);
          this.OPRegForm.controls["locality"].setErrors(null);
          this.questions[21].required = false;
          this.questions[22].required = false;
          this.questions[23].required = false;
          this.questions[24].required = true;
          this.questions[25].required = false;
          this.questions[26].required = true;
          this.questions = { ...this.questions };
        }
        console.log(this.OPRegForm);
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
              if (exists.length) {
                this.OPRegForm.controls["gender"].setValue(exists[0].id);
              } else {
                this.OPRegForm.controls["gender"].setValue(0);
              }
            }
          }

          ///// GAV-1430
          setTimeout(() => {
            this.questions[4].elementRef.focus();
          }, 100);
        }
      });

    // //on change of Gender Title needs to be dafult for Transgender
    this.OPRegForm.controls["gender"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value: any) => {
        if (value && !this.maxIDChangeCall) {
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

  MarkasMaxIDChange() {
    this.maxIDSearch = true;
  }
  ngAfterViewInit(): void {
    this.questions[2].elementRef.focus();
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
    this.flushAllObjects();
    this.formInit();
    this.formProcessingFlag = false;
    this.maxIDSearch = false;
    setTimeout(() => {
      this.formProcessing();
    }, 10);

    this.isNoImage = true;
    this.patientImage = this.patientNoImage;

    //this.checkForMaxID();
    this.clearClicked = false;
    this.registeredBy =
      this.cookie.get("Name") + " ( " + this.cookie.get("UserName") + " )";
    this.disableforeigner = false;
    setTimeout(() => {
      this.OPRegForm.controls["nationality"].setErrors(null);
      this.OPRegForm.controls["nationality"].setValue({
        title: "Indian",
        value: 149,
      });
    }, 20);
    console.log(this.OPRegForm.controls["nationality"]);
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
    this.countrybasedflow = false;
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
      if (this.OPRegForm.controls["idenityType"].value) {
        let identityTypeName = this.idTypeList.filter(
          (i) => i.id === this.OPRegForm.controls["idenityType"].value
        )[0].name;
        if (identityTypeName == "Passport") {
          this.passportDetails.passportNo = this.OPRegForm.value.idenityValue;
        }
      }
      this.showPassportDetails();
    }
  }
  hotlistClick(event: Event) {
    if (
      !this.OPRegForm.controls["hotlist"].value &&
      this.MaxIDExist &&
      !this.expiredPatient
    ) {
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
        //  this.sourceOfInfoList.unshift({ id: 0, name: "-Select-" });
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
        //  this.idTypeList.unshift({ id: 0, name: "-Select-" });
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
          bt2Msg: "Proceed to Deposit",
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
        console.log(this.hotlistReason);
        // this.hotlistDialogList = this.hotlistMasterList.map((l) =>
        this.hotlistDialogList = this.hotlistMasterList.map((l) => {
          return { title: l.name, value: l.id };
          // this.questions[24].options = this.cityList.map((l) => {
          //   return { title: l.cityName, value: l.id };
        });
        // let hotlistvalue = this.hotlistDialogList.filter((e) => {
        //   e.title == this.hotlistReason.title;
        //   return e.value;
        // });

        let hotlistvalue = this.hotlistMasterList.filter((l) => {
          return l.name == this.hotlistReason.title;
        });

        // this.hotlistReason = {
        //   title: this.hotlistReason.title,
        //   value: hotlistvalue[0].value,
        // };
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
                  type: "dropdown",
                  title: "Hot Listing",
                  required: true,
                  defaultValue:
                    hotlistvalue.length > 0
                      ? hotlistvalue[0].id
                      : { title: "", value: "" },
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
              if (result) {
                let reason = this.hotlistDialogList.filter(
                  (e) => e.value === result.data.hotlistTitle
                );
                this.hotlistReason = reason[0];
                this.hotlistRemark = result.data.reason;
                this.postHotlistComment(
                  this.hotlistReason.title,
                  this.hotlistRemark
                );
                console.log(this.hotlistReason.title, this.hotlistRemark);
                // this.postHotlistComment();
              } else {
                this.OPRegForm.controls["hotlist"].setValue(false);
              }
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
  hotlistReasondb: { title: string; value: number } = { title: "", value: 0 };
  hotlistdialogref: any;
  openHotListDialog() {
    if (!this.expiredPatient) {
      this.gethotlistMasterData();
      console.log(this.hotlistDialogList);
    }

    // const dialogref = this.matDialog.open(HotListingDialogComponent, {
    //   width: "30vw",
    //   height: "52vh",
    // });
  }

  postHotlistComment(title: string, remark: string) {
    let maxId =
      this.patientDetails.iacode + "." + this.patientDetails.registrationno;
    let firstName = this.patientDetails.firstname;
    let middleName = this.patientDetails.middleName;
    let lastName = this.patientDetails.lastName;
    let type = "";
    let userId = Number(this.cookie.get("UserId"));
    let locationId = Number(this.cookie.get("HSPLocationId"));
    let hotlistingHeader = title;
    let hotlistingComment = remark;
    this.http
      // .get(
      //   ApiConstants.hotlistedPatient(
      //     maxid,
      //     title,
      //     this.cookie.get("HSPLocationId"),
      //     this.patientDetails.firstname,
      //     this.patientDetails.lastName,
      //     this.patientDetails.middleName,
      //     remark,
      //     "",
      //     Number(this.cookie.get("UserId"))
      //   )
      // )
      .post(
        ApiConstants.hotlistedPatient,
        JSON.stringify({
          maxId,
          firstName,
          middleName,
          lastName,
          hotlistingHeader,
          hotlistingComment,
          type,
          locationId,
          userId,
        })
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe(
        (resultData: any) => {
          console.log(resultData);
          if (resultData["success"]) {
            if (
              resultData["message"] ==
              "Hotlisting request submitted for approval"
            ) {
              this.messageDialogService.success(resultData["message"]);
            } else {
              this.messageDialogService.info(resultData["message"]);
            }
          } else {
            this.messageDialogService.error(resultData["message"]);
          }
        },
        (error) => {
          console.log(error);
          this.messageDialogService.error(error.error[0].error.text);
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
        this.questions[24] = { ...this.questions[24] };
      });
  }

  //MASTER LIST FOR Distt
  getAllDisttList() {
    this.disttList = [];
    this.http
      .get(ApiConstants.disttMasterData)
      .pipe(takeUntil(this._destroying$))
      .subscribe((resultData: any) => {
        this.disttList = resultData;
        this.questions[25].options = this.disttList.map((l) => {
          return { title: l.districtName, value: l.id };
        });
        this.questions[25] = { ...this.questions[25] };
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
        this.questions[26] = { ...this.questions[26] };
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
        this.questions[22] = { ...this.questions[22] };
      }, (err:any) => {
        this.questions[22] = [];
        this.questions[22] = { ...this.questions[22] };
      });
  }

  localityListByPin: LocalityByPincodeModel[] = [];
  //LOCALITY LIST FOR PINCODE
  getLocalityByPinCode() {
    let isvalidpincode = false;
    if (
      this.OPRegForm.value.pincode != undefined &&
      this.OPRegForm.value.pincode > 0 &&
      this.OPRegForm.value.pincode != null
    ) {
      let pinCodeLength = String(this.OPRegForm.value.pincode).length;
      if (this.OPRegForm.value.country.value == 1) {
        if (pinCodeLength == 6) {
          isvalidpincode = true;
        } else {
          isvalidpincode = false;
        }
      } else {
        if (
          pinCodeLength == 6 ||
          pinCodeLength == 5 ||
          pinCodeLength == 4
        ) {
          isvalidpincode = true;
        } else {
          isvalidpincode = false;
        }
      }
      if (isvalidpincode) {
        this.countrybasedflow = false;
        this.OPRegForm.controls["pincode"].setErrors(null);
        this.questions[21].customErrorMessage = "";
        this.http
          .get(ApiConstants.localityLookUp(this.OPRegForm.value.pincode))
          .pipe(takeUntil(this._destroying$))
          .subscribe((resultData: any) => {
            if(resultData){
              this.localityListByPin = resultData;
              this.questions[22].options = this.localityListByPin.map((l) => {
                return { title: l.name, value: l.id };
              });
            }else{
              this.localityListByPin = this.questions[22].options = []
            }
            this.questions[22] = { ...this.questions[22] };
          }, (err:any) => {
            this.questions[22] = [];
            this.questions[22] = { ...this.questions[22] };
         });
      } else {
        this.OPRegForm.controls["pincode"].setErrors({ incorrect: true });
        this.questions[21].customErrorMessage = "PinCode is Invalid";
      }
    } else {
      if (this.OPRegForm.value.country.value == 1) {
        this.OPRegForm.controls["pincode"].setErrors({ incorrect: true });
        this.questions[21].customErrorMessage = "PinCode is Invalid";
      }
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
      let isflag = true;
      if(this.AddressonLocalityModellst  
        && this.AddressonLocalityModellst.pinCode == this.OPRegForm.controls["pincode"].value){
        isflag = false;
      }
      if (isflag &&
        this.OPRegForm.value.locality.value != undefined &&
        this.OPRegForm.value.locality.value != null &&
        this.OPRegForm.value.locality.value != ""
      ) {
        this.OPRegForm.controls["locality"].setValue({ title: "", value: 0 });
      }

      if (isflag && this.OPRegForm.value.locality) {
        this.OPRegForm.controls["locality"].setValue("");
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
      console.log(this.OPRegForm.controls["country"].value);
      // this.getCitiesByCountry({ title: "India", value: 1 });
      // this.getStatesByCountry({ title: "India", value: 1 });

      this.getCitiesByCountry(this.OPRegForm.controls["country"].value);
      this.getStatesByCountry(this.OPRegForm.controls["country"].value);
      this.questions[22].options = [];
      this.questions[25].options = [];
      this.questions = { ...this.questions };
      this.localitybyCityList = [];
      this.getLocalityList();
    }
    if (this.OPRegForm.value.country.value != 1) {
      this.OPRegForm.controls["district"].setErrors(null);
      this.OPRegForm.controls["locality"].setErrors(null);
      this.questions[21].required = false;
      this.questions[22].required = false;
      this.questions[23].required = false;
      this.questions[24].required = true;
      this.questions[25].required = false;
      this.questions[26].required = true;
      this.questions = { ...this.questions };
    }
  }

  clearAddressOnCountryChange() {
    debugger;
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

      if (this.OPRegForm.value.city) {
        this.OPRegForm.controls["city"].setValue({ title: "", value: 0 });
      }

      if (this.OPRegForm.value.locality) {
        this.OPRegForm.controls["locality"].setValue({ title: "", value: 0 });
        this.getLocalityList();
      }

      if (this.OPRegForm.value.state) {
        this.OPRegForm.controls["state"].setValue({ title: "", value: 0 });
      }

      if (this.OPRegForm.value.district) {
        this.OPRegForm.controls["district"].setValue({ title: "", value: 0 });
      }
    }
    if (this.OPRegForm.value.country.value != 1) {
      this.OPRegForm.controls["pincode"].setErrors(null);
      this.OPRegForm.controls["district"].setErrors(null);
      this.OPRegForm.controls["locality"].setErrors(null);
      this.OPRegForm.controls["state"].setErrors({ incorrect: true });
      this.OPRegForm.controls["city"].setErrors({ incorrect: true });
      this.questions[21].required = false;
      this.questions[22].required = false;
      this.questions[23].required = false;
      this.questions[24].required = true;
      this.questions[25].required = false;
      this.questions[26].required = true;
      this.questions = { ...this.questions };
    }else{
      if(this.OPRegForm.controls["pincode"].value == "") {
        this.getLocalityList();
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
      this.getLocalityList();
    }
  }

  //fetch Address based on locality or set pincode on selection of locality
  countrybasedflow: boolean = false;
  localitybasedflow: boolean = false;
  AddressonLocalityModellst!: AddressonLocalityModel;
  addressByLocalityID(locality: any) {
    //added on 25/11/2022 - for null error by Deena
    if (
      this.OPRegForm.value.city == undefined ||
      this.OPRegForm.value.city == "" ||
      this.OPRegForm.value.city == null ||
      (this.OPRegForm.value.city && this.OPRegForm.value.city.value == 0)
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
            this.OPRegForm.controls["pincode"].setValue(
              Number(this.AddressonLocalityModellst.pinCode),
              { emitEvent: false }
            );
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
          this.OPRegForm.controls["pincode"].setValue(Number(pincode), { emitEvent: false });
          this.questions[24].readonly = true;
          this.questions[25].readonly = true;
          this.questions[26].readonly = true;
          this.questions[27].readonly = true;
          this.countrybasedflow = false;
          this.citybasedflow = false;
        }
      } else {
        if (!this.maxIDChangeCall && this.countrybasedflow) {
          this.OPRegForm.controls["pincode"].setValue(null);
          this.countrybasedflow = false;
          this.citybasedflow = false;
          this.pincodebasedflow = false;
          this.questions[24].readonly = false;
          this.questions[25].readonly = false;
          this.questions[26].readonly = false;
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
    this.disttList = [];
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
    this.localitybyCityList = [];
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
      this.addressByCity = [];
      this.http
        .get(ApiConstants.addressByCityID(city.value))
        .pipe(takeUntil(this._destroying$))
        .subscribe((resultData: any) => {
          this.addressByCity = resultData;
          if (this.addressByCity.length > 0) {
            this.OPRegForm.controls["state"].setValue({
              title: this.addressByCity[0].stateName,
              value: this.addressByCity[0].stateId,
            }, { emitEvent: false });
            this.OPRegForm.controls["district"].setValue({
              title: this.addressByCity[0].districtName,
              value: this.addressByCity[0].districtId,
            } ,{ emitEvent: false });
          }
          this.questions[25].readonly = true;
          this.questions[26].readonly = true;
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
      this.stateList = [];
      // this.questions[26].options = [];
      this.http
        .get(ApiConstants.stateByCountryId(country.value))
        .pipe(takeUntil(this._destroying$))
        .subscribe((resultData: any) => {
          this.stateList = resultData;
          this.questions[26].options = this.stateList.map((l) => {
            return { title: l.stateName, value: l.id };
          });

          this.questions[26] = { ...this.questions[26] };
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
      this.cityList = [];
      this.http
        .get(ApiConstants.CityDetail(country.value))
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

  //Get Patient Details by Max ID
  async getPatientDetailsByMaxId() {
    this.apiProcessing = true;
    this.maxIDChangeCall = true;

    let regNumber = Number(this.OPRegForm.value.maxid.split(".")[1]);

    //HANDLING IF MAX ID IS NOT PRESENT
    if (regNumber != 0) {
      let iacode = this.OPRegForm.value.maxid.split(".")[0];
      const expiredStatus = await this.checkPatientExpired(iacode, regNumber);
      if (expiredStatus) {
        this.expiredPatient = true;
        this.apiProcessing = false;
        this.OPRegForm.controls["hotlist"].disable();
        const dialogRef = this.messageDialogService.error(
          "Patient is an Expired Patient!"
        );
        await dialogRef.afterClosed().toPromise();
      } else {
        this.expiredPatient = false;
        this.OPRegForm.controls["hotlist"].enable();
      }
      this.http
        .get(ApiConstants.patientDetails(regNumber, iacode))
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
              // this.setValuesToOPRegForm(this.patientDetails);
              this.OPRegForm.controls["maxid"].setValue(
                iacode + "." + regNumber
              );
              this.OPRegForm.controls["maxid"].setErrors({ incorrect: true });
              this.questions[0].customErrorMessage = "Invalid Max ID";
              this.questions[2].elementRef.focus();
              //this.clear();
              this.maxIDChangeCall = false;
            } else {
              //added for modify issue - even though Mobile no not changed
              this.questions[2].elementRef.blur();
              this.flushAllObjects();
              this.maxIDChangeCall = true;
              this.patientDetails = resultData;
              this.getPatientImage();
              this.lastupdatedDate =
                this.datepipe.transform(
                  this.patientDetails.lastUpdatedOn,
                  "dd/MM/yyyy"
                ) == "01/01/1900"
                  ? this.datepipe.transform(
                      this.patientDetails.registeredOn,
                      "dd/MM/yyyy hh:mm aa"
                    )
                  : this.datepipe.transform(
                      this.patientDetails.lastUpdatedOn,
                      "dd/MM/yyyy hh:mm aa"
                    );
              this.registeredBy = this.patientDetails.registeredOperatorName;
              this.lastUpdatedBy = this.patientDetails.operatorName;

              if (
                this.datepipe.transform(
                  this.patientDetails.lastUpdatedOn,
                  "dd/MM/yyyy"
                ) == "01/01/1900"
              ) {
                this.LastupdateExist = false;
              } else {
                this.LastupdateExist = true;
                this.lastregisteredDate = this.datepipe.transform(
                  this.patientDetails.registeredOn,
                  "dd/MM/yyyy hh:mm aa"
                );
              }

              this.categoryIcons =
                this.patientService.getCategoryIconsForPatient(
                  this.patientDetails
                );
              this.MaxIDExist = true;
              this.checkForMaxID();
              //RESOPONSE DATA BINDING WITH CONTROLS

              this.setValuesToOPRegForm(this.patientDetails);

              //SETTING PATIENT DETAILS TO MODIFIEDPATIENTDETAILOBJ
              this.registeredPatientDetails(this.patientDetails);
              //added timeout for address clear issue
              setTimeout(() => {
                this.maxIDChangeCall = false;
              }, 2000);
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
              // this.setValuesToOPRegForm(this.patientDetails);
              this.OPRegForm.controls["maxid"].setValue(
                iacode + "." + regNumber
              );
              this.OPRegForm.controls["maxid"].setErrors({ incorrect: true });
              this.questions[0].customErrorMessage = "Invalid Max ID";
            }
            //this.clear();

            this.maxIDChangeCall = false;
          }
        );
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
  async onModifyDetail() {
    let isFormValid = await this.validateForm();
    if (!isFormValid) {
      let passportdetailspresent = false;
      if (
        this.nationalityChanged &&
        this.OPRegForm.value.foreigner &&
        this.passportDetails.passportNo != ""
      ) {
        passportdetailspresent = true;
      } else if (
        this.nationalityChanged &&
        this.OPRegForm.value.country.value == 1
      ) {
        passportdetailspresent = true;
      }
      //else if (
      //   this.OPRegForm.value.foreigner &&
      //   this.passportDetails.passportNo != ""
      // ) {
      //   this.isPatientdetailModified = true;
      // }
      else {
        passportdetailspresent = false;
      }

      if (passportdetailspresent || this.isPatientdetailModified) {
        this.onUpdatePatientDetail();

        // if (this.isPatientdetailModified || this.nationalityChanged) {

        //   this.modifyDialogg();
        // }
        if (this.modificationCheckForMandatoryControls()) {
          this.modifyDialogg();
        }
      } else {
        this.onUpdatePatientDetail();

        if (this.modificationCheckForMandatoryControls()) {
          this.modifyDialogg();
        }
      }
    }
  }

  postModifyCall() {
    this.apiProcessing = true;
    this.http
      .post(
        ApiConstants.modifyPatientDetail,
        this.getModifiedPatientDetailObj()
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe(
        (resultData) => {
          this.apiProcessing = false;
          if (this.OPRegForm.value.maxid) {
            this.getPatientDetailsByMaxId();
            this.maxIDSearch = false;
          } // this.setValuesToOPRegForm(resultData);
          if (resultData["success"]) {
            if (
              resultData["message"] ==
              "Your request has been processed successfully"
            ) {
              this.OPRegForm.markAllAsTouched();
              this.OPRegForm.markAsPristine();
              ////GAV-1389 - popup change
              this.messageDialogService.success(
                "Max Id " +
                  this.patientDetails.iacode +
                  "." +
                  this.patientDetails.registrationno +
                  " modified request sent for approval"
              );
              //this.showRegisteredId("Modified request sent for approval");
            }
          } else {
            this.messageDialogService.info(resultData["message"]);
          }
        },
        (error) => {
          this.apiProcessing = false;
          console.log(error);
          this.messageDialogService.error(error.error);
        }
      );
  }

  onUpdatePatientDetail() {
    this.apiProcessing = true;
    this.http
      .post(ApiConstants.updatePatientDetail, this.getPatientUpdatedReqBody())
      .pipe(takeUntil(this._destroying$))
      .subscribe(
        (resultData: PatientDetails) => {
          this.maxIDChangeCall = true; // Added to avoid overlapping of ews popup and successdialog
          this.populateUpdatePatientDetail(resultData);
          this.apiProcessing = false;
          this.savePatientImage();
          // if (!this.isPatientdetailModified && !this.nationalityChanged) {
          //   const successdialog = this.messageDialogService.success(
          //     "Patient Details has been modified"
          //   );

          //   successdialog.afterClosed().subscribe(() => {
          //     this.getPatientDetailsByMaxId();
          //   });
          // }

          if (!this.modificationCheckForMandatoryControls()) {
            const successdialog = this.messageDialogService.success(
              "Patient Details has been modified"
            );

            successdialog.afterClosed().subscribe(() => {
              this.getPatientDetailsByMaxId();
            });
          }
          // else{
          //   this.getPatientDetailsByMaxId();
          // }
          this.maxIDChangeCall = false;
        },
        (error) => {
          console.log(error);
          this.apiProcessing = false;
          this.messageDialogService.error(error.error);
        }
      );
  }
  postForm() {
    this.apiProcessing = true;
    console.log("request body" + this.getPatientSubmitRequestBody());
    this.http
      .post(ApiConstants.postPatientDetails, this.getPatientSubmitRequestBody())
      .pipe(takeUntil(this._destroying$))
      .subscribe(
        (resultData: PatientDetails) => {
          this.apiProcessing = false;
          this.patientDetails = resultData;
          this.OPRegForm.markAllAsTouched();
          this.OPRegForm.markAsPristine();
          this.showRegisteredId("Patient Registered Successfully");
          this.flushAllObjects();
          this.maxIDChangeCall = true;
          this.setValuesToOPRegForm(resultData);
          this.MaxIDExist = true;
          this.maxIDSearch = false;
          this.checkForMaxID();
          this.maxIDChangeCall = false;
          this.lastupdatedDate =
            this.datepipe.transform(
              this.patientDetails.lastUpdatedOn,
              "dd/MM/yyyy"
            ) == "01/01/1900"
              ? this.datepipe.transform(
                  this.patientDetails.registeredOn,
                  "dd/MM/yyyy hh:mm aa"
                )
              : this.datepipe.transform(
                  this.patientDetails.lastUpdatedOn,
                  "dd/MM/yyyy hh:mm aa"
                );
          this.registeredBy = this.patientDetails.registeredOperatorName;
          this.savePatientImage();
          if (
            this.datepipe.transform(
              this.patientDetails.lastUpdatedOn,
              "dd/MM/yyyy"
            ) == "01/01/1900"
          ) {
            this.LastupdateExist = false;
          } else {
            this.LastupdateExist = true;
          }
        },
        (error) => {
          this.apiProcessing = false;
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
    //if (this.patientDetails?.dob) {
    this.OPRegForm.controls["dob"].setValue(this.patientDetails?.dateOfBirth);
    // } else {
    //   this.OPRegForm.controls["dob"].setValue("");
    // }
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
    if (patientDetail.hotlist) {
      this.hotlistReasondb.title = patientDetail.hotlistreason;
      this.hotlistRemarkdb = patientDetail.hotlistcomments;
    }
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

  resetPhoneFlag() {
    this.phoneNumberFlag = false;
  }

  phoneNumberFlag: boolean = false;
  //CLEARING OLDER PHONE SEARCH
  onEnterPhoneModify() {
    this.similarContactPatientList = [] as any;
    this.onPhoneModify();
    this.phoneNumberFlag = true;
  }
  onPhoneModify() {
    console.log("phone changed");
    if (
      this.OPRegForm.controls["mobileNumber"].valid &&
      !this.maxIDChangeCall &&
      !this.phoneNumberFlag
    ) {
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
        this.modfiedPatiendDetails.firstname = this.OPRegForm.value.firstName;
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
      if (!this.OPRegForm.value.foreigner) {
        this.OPRegForm.controls["foreigner"].setValue(true);
        this.showPassportDetails();
      }
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

  isOrganDonor: boolean = false;
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
      } else {
        this.OPRegForm.controls["fatherSpouseName"].setValue("");
        this.OPRegForm.controls["fatherSpouse"].setValue(0);
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
    this.OPRegForm.controls["pincode"].setValue(
      Number(patientDetails?.ppinCode == 0 ? "" : patientDetails?.ppinCode)
    );
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
    if (patientDetails?.locality == 0) {
      if (
        patientDetails?.otherlocality != "" ||
        patientDetails?.otherlocality != undefined
      ) {
        this.OPRegForm.controls["locality"].setValue({
          title: patientDetails?.otherlocality || "",
          value: 0,
        });
        this.OPRegForm.controls["localityTxt"].setValue(
          patientDetails?.otherlocality
        );
      }
    } else {
      this.OPRegForm.controls["locality"].setValue({
        title: patientDetails?.localityName,
        value: patientDetails?.locality,
      });
      this.OPRegForm.controls["localityTxt"].setValue(
        patientDetails?.localityName
      );
    }

    this.questions[24].readonly = true;
    this.questions[25].readonly = true;
    this.questions[26].readonly = true;

    if (patientDetails?.ppinCode != 0) {
      this.questions[27].readonly = true;
    } else {
      //added for make readonly as false in case there is no pincode(Foreign country) by deena
      this.questions[24].readonly = false;
      this.questions[25].readonly = false;
      this.questions[26].readonly = false;
    }
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

    this.isOrganDonor = patientDetails?.isOrganDonor;

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
    this.setSourceOfInforValues(patientDetails);
    this.apiProcessing = false;
  }

  //SETTING THE RESPONSE TO ID AND VALUE FOR DROP DOWN
  setSourceOfInforValues(patientDetails: PatientDetails) {
    if (patientDetails?.sourceofinfo != 0) {
      let sourceofinfo = this.sourceOfInfoList.filter(
        (e) => e.id === patientDetails?.sourceofinfo
      );
      if (sourceofinfo.length > 0) {
        this.OPRegForm.controls["sourceOfInput"].setValue({
          title: sourceofinfo[0].name,
          value: sourceofinfo[0].id,
        });
      } else {
        this.OPRegForm.controls["sourceOfInput"].setValue({
          title: "",
          value: 0,
        });
      }
    } else {
      this.OPRegForm.controls["sourceOfInput"].setValue({
        title: "",
        value: 0,
      });
    }
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
      Number(this.OPRegForm.controls["age"].value),
      this.OPRegForm.value.address,
      "",
      "",
      this.OPRegForm.value.city ? this.OPRegForm.value.city.value : 0,
      this.OPRegForm.value.district ? this.OPRegForm.value.district.value : 0,
      this.OPRegForm.value.state ? this.OPRegForm.value.state.value : 0,
      this.OPRegForm.value.country.value,
      this.OPRegForm.value.pincode.toString() || "0",
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
        ? this.OPRegForm.value.localityTxt == ""
          ? this.OPRegForm.value.locality
            ? this.OPRegForm.value.locality
            : ""
          : this.OPRegForm.value.locality
        : this.OPRegForm.value.locality.title == undefined ||
          this.OPRegForm.value.locality.title == ""
        ? this.OPRegForm.value.locality.title ||
          this.OPRegForm.value.localityTxt
        : this.OPRegForm.value.locality.title,
      this.OPRegForm.value.sourceOfInput == null ||
      this.OPRegForm.value.sourceOfInput == undefined
        ? 0
        : this.OPRegForm.value.sourceOfInput.value || 0,
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

  // validationerror:boolean=false;
  //WORKING ON THE BELOW FUNCTION
  patientSubmitDetails: patientRegistrationModel | undefined;
  // registationFormSubmit()
  // {}
  async registationFormSubmit() {
    let isFormValid = await this.validateForm();
    if (!isFormValid) {
      //validateForm return boolean variable if validation error present or not
      this.postForm();
    }
  }

  async validateForm(): Promise<boolean> {
    let validationerror = false;
    if (!validationerror) {
      if (this.maxIDSearch) {
        if (this.OPRegForm.value.maxid) {
          let regNumber = Number(this.OPRegForm.value.maxid.split(".")[1]);
          //HANDLING IF MAX ID IS NOT PRESENT
          if (regNumber != 0) {
            let iacode = this.OPRegForm.value.maxid.split(".")[0];
            const resultData = await this.http
              .get(ApiConstants.patientDetails(regNumber, iacode))
              .toPromise();
            if (!resultData) {
              validationerror = true;
              this.flushAllObjects();
              // this.OPRegForm.controls["maxid"].setValue(
              //   iacode + "." + regNumber
              // );
              this.OPRegForm.controls["maxid"].setErrors({ incorrect: true });
              this.questions[0].customErrorMessage = "Invalid Max ID";
              this.questions[2].elementRef.focus();
              // this.messageDialogService.error("Invalid MaxId");
            } else if (resultData.length <= 0) {
              validationerror = true;
              this.flushAllObjects();
              this.OPRegForm.controls["maxid"].setErrors({ incorrect: true });
              this.questions[0].customErrorMessage = "Invalid Max ID";
              this.questions[2].elementRef.focus();
              //this.messageDialogService.error("Invalid MaxId");
            } else {
              validationerror = false;
            }
          } else {
            validationerror = true;
            this.flushAllObjects();
            this.OPRegForm.controls["maxid"].setErrors({ incorrect: true });
            this.questions[0].customErrorMessage = "Invalid Max ID";
            this.questions[2].elementRef.focus();
            // this.messageDialogService.error("Invalid MaxId");
          }
        } else {
          validationerror = true;
          this.flushAllObjects();
          this.OPRegForm.controls["maxid"].setErrors({ incorrect: true });
          this.questions[0].customErrorMessage = "Invalid Max ID";
          this.questions[2].elementRef.focus();
          // this.messageDialogService.error("Invalid MaxId");
        }
      }
    }

    if (!validationerror) {
      if (this.OPRegForm.value.mobileNumber) {
        if (!this.MaxIDExist && !this.maxIDChangeCall) {
          const resultData = await this.http
            .post(ApiConstants.similarSoundPatientDetail, {
              phone: this.OPRegForm.value.mobileNumber,
            })
            .toPromise();
          if (resultData) {
            if (resultData.length != 0) {
              validationerror = true;
              const formsubmitdialogref = this.matDialog.open(
                RegistrationDialogueComponent,
                {
                  width: "30vw",

                  data: {
                    message1:
                      "Similar patient detail with Mobile Number exists. Do you want to proceed?",
                    message2: "",
                    btn1: true,
                    btn2: true,
                    bt1Msg: "Ok",
                    bt2Msg: "Cancel",
                  },
                }
              );

              const result = await formsubmitdialogref
                .afterClosed()
                .toPromise();
              if (result == "Success") {
                validationerror = false;
              } else {
                validationerror = true;
              }
            } else {
              validationerror = false;
            }
          }
        } else {
          validationerror = false;
        }
      } else {
        validationerror = true;
        this.messageDialogService.error("Please enter Mobile Number");
      }
    }

    if (!validationerror) {
      if (!this.OPRegForm.controls["title"].value) {
        validationerror = true;
        this.messageDialogService.error("Please enter title");
      } else {
        validationerror = false;
      }
    }

    if (!validationerror) {
      if (!this.OPRegForm.value.firstName) {
        validationerror = true;
        this.messageDialogService.error("Please enter First Name");
      } else {
        validationerror = false;
      }
    }

    if (!validationerror) {
      if (!this.OPRegForm.value.lastName) {
        validationerror = true;
        this.messageDialogService.error("Please enter Last Name");
      } else {
        validationerror = false;
      }
    }

    if (!validationerror) {
      if (!this.OPRegForm.controls["gender"].value) {
        validationerror = true;
        this.messageDialogService.error("Please enter gender");
      } else {
        validationerror = false;
      }
    }

    if (!validationerror) {
      let sex = this.titleList.filter(
        (e) =>
          e.name === this.OPRegForm.controls["title"].value && e.gender != null
      );
      if (sex.length && this.OPRegForm.controls["gender"].value != 3) {
        if (this.OPRegForm.controls["gender"].value != sex[0].sex) {
          validationerror = true;
          this.messageDialogService.error(
            "Please select correct Title against gender"
          );
        }
      }
    }

    if (!validationerror) {
      if (!this.MaxIDExist && !this.maxIDChangeCall) {
        const resultData = await this.http
          .post(ApiConstants.similarSoundPatientDetail, {
            firstName: this.OPRegForm.value.firstName,
            lastName: this.OPRegForm.value.lastName,
            gender:
              this.OPRegForm.value.gender == 1
                ? "Male"
                : this.OPRegForm.value.gender == 2
                ? "Female"
                : "Transgender",
          })
          .toPromise();
        if (resultData) {
          if (resultData.length != 0) {
            validationerror = true;
            const formsubmitdialogref = this.matDialog.open(
              RegistrationDialogueComponent,
              {
                width: "30vw",

                data: {
                  message1:
                    "Similar patient detail with Mobile Number exists. Do you want to proceed?",
                  message2: "",
                  btn1: true,
                  btn2: true,
                  bt1Msg: "Ok",
                  bt2Msg: "Cancel",
                },
              }
            );

            const result = await formsubmitdialogref.afterClosed().toPromise();
            if (result == "Success") {
              validationerror = false;
            } else {
              validationerror = true;
            }
          } else {
            validationerror = false;
          }
        }
      } else {
        validationerror = false;
      }
    }

    if (!validationerror) {
      if (!this.OPRegForm.controls["emailId"].value) {
        validationerror = true;
        this.messageDialogService.error("Please enter email");
      } else {
        validationerror = false;
      }
    }

    if (!validationerror) {
      if (this.OPRegForm.value.note) {
        if (this.noteRemark.trim() == "") {
          validationerror = true;
          this.noteRemark = "";
          this.messageDialogService.error("Please enter note reason");
        } else {
          validationerror = false;
        }
      } else {
        this.noteRemark = "";
      }
    }

    if (!validationerror) {
      if (this.OPRegForm.value.hwc) {
        if (this.hwcRemark.trim() == "") {
          validationerror = true;
          this.hwcRemark = "";
          this.messageDialogService.error("Please enter hwc remark");
        } else {
          validationerror = false;
        }
      } else {
        this.hwcRemark = "";
      }
    }

    if (!validationerror) {
      if (this.OPRegForm.value.vip) {
        if (this.vip.trim() == "") {
          validationerror = true;
          this.vip = "";
          this.messageDialogService.error("Please enter vip reason");
        } else {
          validationerror = false;
        }
      } else {
        this.vip = "";
      }
    }

    if (!validationerror) {
      if (this.OPRegForm.value.paymentMethod.toLowerCase().trim() == "ews") {
        if (this.ewsDetails.bplCardNo.trim() == "") {
          validationerror = true;
          this.messageDialogService.error(
            "Please enter BplCardNo for EWS Payment Method"
          );
        } else if (this.ewsDetails.bplCardAddress.trim() == "") {
          validationerror = true;
          this.messageDialogService.error(
            "Please enter BplCardAddress for EWS Payment Method"
          );
        } else {
          validationerror = false;
        }
      } else {
        this.ewsDetails.bplCardNo = "";
        this.ewsDetails.bplCardAddress = "";
      }
    }

    if (!validationerror) {
      if (this.OPRegForm.controls["fatherSpouse"].value) {
        if (
          this.OPRegForm.value.fatherSpouseName == null ||
          this.OPRegForm.value.fatherSpouseName.trim() == ""
        ) {
          validationerror = true;
          this.messageDialogService.error("Please enter Father/Spouse Name");
        } else {
          validationerror = false;
        }
      } else {
        this.OPRegForm.value.fatherSpouseName = "";
      }
    }

    if (!validationerror) {
      if (this.OPRegForm.controls["idenityType"].value) {
        if (this.OPRegForm.value.idenityValue.trim() == "") {
          validationerror = true;
          this.messageDialogService.error("Please enter Indentity Number");
        } else {
          validationerror = false;
        }
      } else {
        this.OPRegForm.value.idenityValue = "";
      }
    }

    // Check City validation
    if (!validationerror) {
      if (
        this.OPRegForm.controls["city"] &&
        this.OPRegForm.value.city &&
        this.OPRegForm.controls["city"].value
      ) {
        if (
          !this.OPRegForm.value.city.value &&
          this.OPRegForm.value.city.value !== 0 &&
          this.OPRegForm.value.city.trim() == ""
        ) {
          validationerror = true;
        } else if (Number(this.OPRegForm.value.city.value) == 0) {
          validationerror = true;
        } else {
          validationerror = false;
        }
      } else {
        validationerror = true;
      }

      if (validationerror) {
        this.OPRegForm.controls["city"].setValue("");
        this.OPRegForm.controls["city"].markAsTouched();
      }
    }

    // Check State validation
    if (!validationerror) {
      if (
        this.OPRegForm.controls["state"] &&
        this.OPRegForm.value.state &&
        this.OPRegForm.controls["state"].value
      ) {
        if (
          !this.OPRegForm.value.state.value &&
          this.OPRegForm.value.state.value !== 0 &&
          this.OPRegForm.value.state.trim() == ""
        ) {
          validationerror = true;
        } else if (Number(this.OPRegForm.value.state.value) == 0) {
          validationerror = true;
        } else {
          validationerror = false;
        }
      } else {
        validationerror = true;
      }

      if (validationerror) {
        this.OPRegForm.controls["state"].setValue("");
        this.OPRegForm.controls["state"].markAsTouched();
      }
    }

    return validationerror;
  }
  getPatientSubmitRequestBody(): patientRegistrationModel {
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
      Number(this.OPRegForm.value.age),
      this.OPRegForm.value.address,
      "",
      "",
      this.OPRegForm.value.city ? this.OPRegForm.value.city.value : 0,
      this.OPRegForm.value.district ? this.OPRegForm.value.district.value : 0,
      this.OPRegForm.value.state ? this.OPRegForm.value.state.value : 0,
      this.OPRegForm.value.country.value,
      this.OPRegForm.value.pincode.toString() || "0",
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
        ? this.OPRegForm.value.locality
        : "",
      this.OPRegForm.value.sourceOfInput.value || 0,
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
      this.onlineId || 0,
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
      // if (this.OPRegForm.controls["fatherSpouse"].value == "Father") {
      //   return this.OPRegForm.value.fatherSpouseName;
      // }
      if (this.OPRegForm.controls["fatherSpouse"].value == 1) {
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
      // if (this.OPRegForm.controls["fatherSpouse"].value != "Father") {
      //   return this.OPRegForm.value.fatherSpouseName;
      // }
      if (this.OPRegForm.controls["fatherSpouse"].value == 2) {
        return this.OPRegForm.value.fatherSpouseName;
      }
    }
    return response;
  }

  modfiedPatiendDetails!: ModifiedPatientDetailModel;
  registeredPatiendDetails!: ModifiedPatientDetailModel;
  getModifiedPatientDetailObj(): ModifiedPatientDetailModel {
    //this.checkForForeignerCheckbox();
    let ageTypeName = this.ageTypeList.filter(
      (a) => a.id === this.OPRegForm.value.ageType
    )[0].name;
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
      this.passportDetails.passportNo,
      this.datepipe.transform(
        this.passportDetails.IssueDate,
        "yyyy-MM-ddThh:mm:ss"
      ) || null,
      this.datepipe.transform(
        this.passportDetails.Expirydate,
        "yyyy-MM-ddThh:mm:ss"
      ) || null,
      this.passportDetails.Issueat,
      Number(this.cookie.get("UserId")),
      Number(this.cookie.get("HSPLocationId")),
      false,
      this.OPRegForm.value.mobileNumber,
      false,
      "",
      "",
      this.OPRegForm.value.dob || null,
      // this.datepipe.transform(
      //   this.OPRegForm.value.dob,
      //   "yyyy-MM-ddThh:mm:ss"
      // ) || null,
      this.OPRegForm.controls["age"].value,
      this.OPRegForm.value.ageType,
      ageTypeName
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
      "",
      this.datepipe.transform(
        patientDetails.dateOfBirth,
        "yyyy-MM-ddThh:mm:ss"
      ) || null,
      patientDetails.age,
      patientDetails.agetype,
      patientDetails.ageTypeName
    );
  }

  openReportModal(btnname: string) {
    this.reportService.openWindow(btnname, btnname, {
      maxId: this.OPRegForm.value.maxid,
    });
    // if (btnname == "PrintLabel") {
    //   this.reportService.getOPRegistrationPrintLabel(
    //     this.OPRegForm.value.maxid
    //   );
    //   {
    //     console.log("success");
    //   }
    // } else if (btnname == "PrintForm") {
    //   this.reportService.getOPRegistrationForm(this.OPRegForm.value.maxid);
    //   {
    //     console.log("success");
    //   }
    // } else if (btnname == "PrintOD") {
    //   this.reportService.getOPRegistrationOrganDonorForm(
    //     this.OPRegForm.value.maxid
    //   );
    //   console.log("success");
    // }
  }

  //for Date of birth and age calculation
  showAge: number | undefined;
  showAgeType: any;
  dateNotValid: boolean = false;
  convetAge: Date = new Date();
  timeDiff: number | undefined;
  dobFlag: boolean = false;
  ageFlag: boolean = false;

  onageCalculator(ageDOB = "") {
    if (this.ageTypeList.length == 0) {
      return;
    }
    if (!ageDOB) {
      ageDOB = this.OPRegForm.value.dob;
    }
    if (ageDOB) {
      let dobRef = moment(ageDOB);
      if (!dobRef.isValid()) {
        return;
      }
      const today = moment();
      const diffYears = today.diff(dobRef, "years");
      const diffMonths = today.diff(dobRef, "months");
      const diffDays = today.diff(dobRef, "days");
      if (diffYears > 0) {
        if (diffYears > 122) {
          this.OPRegForm.controls["dob"].setErrors({ incorrect: true });
          this.questions[8].customErrorMessage = "DOB is invalid";
          this.OPRegForm.controls["age"].setValue("");
          this.OPRegForm.controls["ageType"].setValue(0);
          return;
        }
        this.OPRegForm.controls["age"].setValue(diffYears);
        this.OPRegForm.controls["ageType"].setValue(this.ageTypeList[0].id);
      } else if (diffMonths > 0) {
        this.OPRegForm.controls["age"].setValue(diffMonths);
        this.OPRegForm.controls["ageType"].setValue(this.ageTypeList[1].id);
      } else if (diffDays > 0) {
        this.OPRegForm.controls["age"].setValue(diffDays);
        this.OPRegForm.controls["ageType"].setValue(this.ageTypeList[2].id);
      } else if (diffYears < 0 || diffMonths < 0 || diffDays < 0) {
        this.OPRegForm.controls["dob"].setErrors({ incorrect: true });
        this.questions[8].customErrorMessage = "DOB is invalid";
        this.OPRegForm.controls["age"].setValue("");
        this.OPRegForm.controls["ageType"].setValue(0);
        return;
      } else if (diffDays == 0) {
        this.OPRegForm.controls["age"].setValue(diffDays + 1);
        this.OPRegForm.controls["ageType"].setValue(this.ageTypeList[2].id);
      }
      this.OPRegForm.controls["dob"].setErrors(null);
      this.questions[8].customErrorMessage = "";
    }
  }

  // onageCalculator() {
  //   console.log(this.OPRegForm.value.dob);
  //   // if (!this.MaxIDExist) {
  //   //if (this.OPRegForm.value.dob == "") {
  //   //this.OPRegForm.value.age = null;
  //   //this.OPRegForm.controls["ageType"].setValue(null);
  //   // }
  //   this.timeDiff = 0;
  //   if (this.OPRegForm.value.dob) {
  //     this.dobFlag = true;
  //     this.ageFlag = false;
  //   }
  //   console.log(this.OPRegForm.value.age);

  //   if (new Date(this.OPRegForm.value.dob) > new Date(Date.now())) {
  //     this.dateNotValid = true;
  //     this.OPRegForm.value.age = null;
  //     this.OPRegForm.controls["ageType"].setValue(this.ageTypeList[3].id);
  //     let element: HTMLElement = document.getElementById(
  //       "saveform"
  //     ) as HTMLElement;
  //   } else {
  //     this.dateNotValid = false;
  //   }
  //   let year = new Date(this.OPRegForm.value.dob).getFullYear();

  //   if (year > 1000) {
  //     if (this.OPRegForm.value.dob) {
  //       this.timeDiff =
  //         new Date(Date.now()).getFullYear() -
  //         new Date(this.OPRegForm.value.dob).getFullYear();
  //       if (this.timeDiff <= 0) {
  //         this.timeDiff =
  //           new Date(Date.now()).getMonth() -
  //           new Date(this.OPRegForm.value.dob).getMonth();

  //         var date1 = new Date(Date.now());
  //         var date2 = new Date(this.OPRegForm.value.dob);
  //         var timedifference = date1.getTime() - date2.getTime();

  //         var Difference_In_Days = Math.floor(
  //           timedifference / (1000 * 3600 * 24)
  //         );

  //         Difference_In_Days = Difference_In_Days == 0 ? 1 : Difference_In_Days;
  //         if (
  //           (this.timeDiff <= 0 || this.timeDiff == 1) &&
  //           Difference_In_Days < 30
  //         ) {
  //           if (this.timeDiff < 0) {
  //           } else {
  //             this.OPRegForm.controls["age"].setValue(
  //               Math.floor(Difference_In_Days)
  //             );
  //             this.OPRegForm.controls["ageType"].setValue(
  //               this.ageTypeList[2].id
  //             );
  //             console.log(this.ageTypeList[2].name);
  //           }
  //         } else {
  //           this.OPRegForm.controls["age"].setValue(Math.floor(this.timeDiff));
  //           this.OPRegForm.controls["ageType"].setValue(this.ageTypeList[1].id);
  //           console.log(this.ageTypeList[1].name);
  //         }
  //       } else {
  //         let currentmonth = new Date(Date.now()).getMonth();
  //         let MonthofDOB = new Date(this.OPRegForm.value.dob).getMonth();
  //         let monthDiff = currentmonth - MonthofDOB;
  //         let monthDiff2 = MonthofDOB - currentmonth;
  //         if (monthDiff <= 1 && monthDiff2 >= 1 && this.timeDiff == 1) {
  //           if (monthDiff < 12 && this.timeDiff == 1) {
  //             if (monthDiff <= 0) {
  //               this.OPRegForm.controls["age"].setValue(
  //                 12 - MonthofDOB + currentmonth
  //               );
  //             } else {
  //               this.OPRegForm.controls["age"].setValue(monthDiff);
  //             }
  //           }
  //           this.OPRegForm.controls["ageType"].setValue(this.ageTypeList[1].id);
  //         } else {
  //           this.OPRegForm.controls["age"].setValue(Math.floor(this.timeDiff));
  //           this.OPRegForm.controls["ageType"].setValue(this.ageTypeList[0].id);
  //           console.log(this.ageTypeList[0].name);
  //         }
  //       }
  //     } else {
  //       this.OPRegForm.controls["age"].setValue(this.OPRegForm.value.age);
  //       console.log(this.OPRegForm.controls["ageType"].value);
  //     }
  //   }
  //   // }
  // }

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
                        "Similar patient detail exists. Please validate",
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
  validatePatientAge(agetype: any) {
    //need to implement logic for patient who has age < 18 years but DOB not provided.
    // need to mention DOB as mandatory.
    if (
      this.OPRegForm.value.age != null ||
      this.OPRegForm.value.age != undefined ||
      this.OPRegForm.value.age != ""
    ) {
      if (agetype != 1 || (agetype == 1 && this.OPRegForm.value.age < 18)) {
        if (
          this.OPRegForm.value.dob == null ||
          this.OPRegForm.value.dob == undefined ||
          this.OPRegForm.value.dob == ""
        ) {
          this.OPRegForm.controls["dob"].setErrors({ incorrect: true });
          this.questions[8].customErrorMessage =
            "DOB is required, Age is less than 18 Years";
          this.questions[8].disabled = false;
          this.OPRegForm.controls["dob"].markAsTouched();
        }
      } else if (
        this.OPRegForm.controls["ageType"].value == 1 &&
        this.OPRegForm.value.age >= 18 &&
        agetype == 1
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
        } else {
          this.vip = "";
          this.OPRegForm.controls["vip"].setValue(false);
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
        } else {
          this.noteRemark = "";
          this.OPRegForm.controls["note"].setValue(false);
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
              pattern: "^[0-9A-Za-z]+",
            },
            BPLAddress: {
              type: "textarea",
              title: "Address on card",
              required: true,
              defaultValue: this.ewsDetails.bplCardAddress,
              pattern: "^[0-9A-Za-z]+",
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
            bplCardNo: result.data.bplCardNo,
            bplCardAddress: result.data.BPLAddress,
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
              pattern: "^S*$",
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
        } else {
          this.hwcRemark = "";
          this.OPRegForm.controls["hwc"].setValue(false);
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
        width: "98vw",
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

  patientImageUploadClicked: boolean = false;
  openImageUploadDialog() {
    this.patientImageUploadClicked = true;

    let regNumber = Number(this.OPRegForm.value.maxid.split(".")[1]);
    let iacode = this.OPRegForm.value.maxid.split(".")[0];

    let ImageUploadDialogref = this.matDialog.open(
      PatientImageUploadDialogComponent,
      {
        maxWidth: "50vw",
        width: "48vw",
        height: "59vh",
        data: {
          regNumber: regNumber,
          iacode: iacode,
          imageData: !this.isNoImage ? this.patientImage : null,
        },
      }
    );
    ImageUploadDialogref.afterClosed()
      .pipe(takeUntil(this._destroying$))
      .subscribe((res) => {
        if (res && res.patientImage) {
          this.patientImage = res.patientImage;
          this.fileType = res.fileType;
          this.isNoImage = false;
        }
      });
    this.patientImageUploadClicked = false;
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
      //height: "96vh",
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
  modificationCheckForMandatoryControls() {
    this.modfiedPatiendDetailsForPopUp = this.getModifiedPatientDetailObj();
    console.log(this.OPRegForm.controls);
    console.log(this.patientDetails);
    console.log(this.modfiedPatiendDetailsForPopUp);
    console.log(
      this.patientDetails.firstname !=
        this.modfiedPatiendDetailsForPopUp.firstname,
      this.patientDetails.middleName !=
        this.modfiedPatiendDetailsForPopUp.middleName,
      this.patientDetails.lastName !=
        this.modfiedPatiendDetailsForPopUp.lastName,
      this.patientDetails.sex != this.modfiedPatiendDetailsForPopUp.sex,
      this.patientDetails.dateOfBirth !=
        this.modfiedPatiendDetailsForPopUp.dateOfBirth,
      this.patientDetails.pemail != this.modfiedPatiendDetailsForPopUp.pemail,
      this.patientDetails.pphone != this.modfiedPatiendDetailsForPopUp.pphone,
      this.patientDetails.nationalityName !=
        this.OPRegForm.value.nationality.title
    );

    if (
      this.patientDetails.firstname !=
        this.modfiedPatiendDetailsForPopUp.firstname ||
      this.patientDetails.middleName !=
        this.modfiedPatiendDetailsForPopUp.middleName ||
      this.patientDetails.lastName !=
        this.modfiedPatiendDetailsForPopUp.lastName ||
      this.patientDetails.sex != this.modfiedPatiendDetailsForPopUp.sex ||
      this.datepipe.transform(this.patientDetails.dateOfBirth, "dd/mm/yyyy") !=
        this.datepipe.transform(
          this.modfiedPatiendDetailsForPopUp.dateOfBirth,
          "dd/mm/yyyy"
        ) ||
      this.patientDetails.pemail != this.modfiedPatiendDetailsForPopUp.pemail ||
      this.patientDetails.pphone != this.modfiedPatiendDetailsForPopUp.pphone ||
      this.patientDetails.nationalityName !=
        this.OPRegForm.value.nationality.title
    ) {
      return true;
    } else {
      return false;
    }
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
      minExpDate = new Date();
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
          layout: {
            hcf: "w-full-alt",
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
          this.disableforeigner = true;
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
          this.isPatientdetailModified = true;
        } else {
          if (result == undefined || result.data == undefined) {
            this.OPRegForm.controls["foreigner"].setValue(false);
            this.disableforeigner = false;
            if (this.OPRegForm.value.nationality.value != 149) {
              this.OPRegForm.controls["nationality"].setErrors({
                incorrect: true,
              });
              this.questions[28].customErrorMessage =
                "foreigner unchecked as passport not entered.";
            }
            this.isPatientdetailModified = false;
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
            this.isPatientdetailModified = true;
            this.disableforeigner = true;
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
            if (
              result.data.hkID.trim() == "" &&
              result.data.vesselName.trim() == "" &&
              result.data.rank.trim() == "" &&
              result.data.fdpGroup.trim() == ""
            ) {
              this.seafarerDetails.FDPGroup = "";
              this.seafarerDetails.HKID = "";
              this.seafarerDetails.Vesselname = "";
              this.seafarerDetails.rank = "";
              this.OPRegForm.controls["seaFarer"].setValue(false);
            } else {
              this.seafarerDetails = {
                HKID: result.data.hkID,
                Vesselname: result.data.vesselName,
                rank: result.data.rank,
                FDPGroup: result.data.fdpGroup,
              };
            }
          } else {
            this.seafarerDetails.FDPGroup = "";
            this.seafarerDetails.HKID = "";
            this.seafarerDetails.Vesselname = "";
            this.seafarerDetails.rank = "";
            this.OPRegForm.controls["seaFarer"].setValue(false);
          }
          this.seafarersDetailDialogref = null;
        });
    }
  }
  openDMSDialog(dmsDetailList: any) {
    this.matDialog.open(DMSComponent, {
      width: "100vw",
      maxWidth: "90vw",
      data: {
        list: dmsDetailList,
        maxid:
          this.patientDetails.iacode + "." + this.patientDetails.registrationno,
        firstName: this.patientDetails.firstname,
        lastName: this.patientDetails.lastName,
      },
    });
  }

  public getPatientImage() {
    let iacode = this.OPRegForm.value.maxid.split(".")[0];
    let regNumber = Number(this.OPRegForm.value.maxid.split(".")[1]);
    this.patientImage = this.patientNoImage;
    this.isNoImage = true;
    this.http
      .get(ApiConstants.patientImageData(regNumber, iacode))
      .pipe(takeUntil(this._destroying$))
      .subscribe((resultData: any) => {
        let hexString = resultData.image.replace("0x", "");
        this.patientImage = hexToBase64(hexString);
        this.isNoImage = false;
      });
  }

  patientImageModel!: patientImageModel;
  getpatientImageObj(): patientImageModel {
    let iacode = this.OPRegForm.value.maxid.split(".")[0];
    let regNumber = Number(this.OPRegForm.value.maxid.split(".")[1]);
    let tmp_imageStr = this.patientImage.split("data:")[1];
    let tmp_base64 = tmp_imageStr.indexOf(";base64");
    if (tmp_base64 != -1) {
      this.fileType = tmp_imageStr.substring(0, tmp_base64);
    } else {
      this.fileType = "image/png";
    }
    let base64Str = this.patientImage.replace(
      "data:" + this.fileType + ";base64,",
      ""
    );
    let patientImage = base64ToHexa(base64Str);
    return (this.patientImageModel = new patientImageModel(
      regNumber,
      iacode,
      patientImage
    ));
  }

  public savePatientImage() {
    this.http
      .post(
        ApiConstants.postPatientImageData(Number(this.cookie.get("UserId"))),
        this.getpatientImageObj()
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe(
        (resultdata) => {
          this.saveApimessage = resultdata;
          if (this.saveApimessage.toString() == "Saved Successfully") {
            this.messageDialogService.success("Data saved successfully");
          } else {
          }
        },
        (HttpErrorResponse) => {
          if (HttpErrorResponse.error.text == "Saved Successfully") {
            this.messageDialogService.success("Data saved successfully");
          } else {
            console.log("HttpErrorResponse", HttpErrorResponse);
          }
        }
      );
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
