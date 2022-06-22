import { Component, Inject, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ApiConstants } from "../../../../core/constants/ApiConstants";
import { CookieService } from "../../../../../shared/services/cookie.service";
import { HttpService } from "../../../../../shared/services/http.service";
import { QuestionControlService } from "../../../../../shared/ui/dynamic-forms/service/question-control.service";
import { PatientitleModel } from "../../../../core/models/patientTitleModel.Model";
import { SourceOfInfoModel } from "../../../../core/models/sourceOfInfoModel.Model";
import { AgetypeModel } from "../../../../core/models/ageTypeModel.Model";
import { IdentityModel } from "../../../../core/models/identityModel.Model";
import { GenderModel } from "../../../../core/models/genderModel.Model";
import { NationalityModel } from "../../../../core/models/nationalityModel.Model";
import { MasterCountryModel } from "../../../../core/models/masterCountryModel.Model";
import { CityModel } from "../../../../core/models/cityByStateIDModel.Model";
import { DistrictModel } from "../../../../core/models/districtByStateIDModel.Model";
import { StateModel } from "../../../../core/models/stateMasterModel.Model";
import { LocalityModel } from "../../../../core/models/locationMasterModel.Model";
import { LocalityByPincodeModel } from "../../../../core/models/localityByPincodeModel.Model";
import { PatientDetails } from "../../../../core/models/patientDetailsModel.Model";
import { patientRegistrationModel } from "../../../../core/models/patientRegistrationModel.Model";
import { DatePipe } from "@angular/common";
import { ForeignerDialogComponent } from "./foreigner-dialog/foreigner-dialog.component";
import { ModifiedPatientDetailModel } from "../../../../core/models/modifiedPatientDeatailModel.Model";
import { UpdatepatientModel } from "../../../../core/models/updateopd.Model";
import { ReportService } from "../../../../../shared/services/report.service";
import { PatientService } from "../../../../../out_patients/core/services/patient.service";
import { SearchService } from "../../../../../shared/services/search.service";
import { hotlistingreasonModel } from "../../../../core/models/hotlistingreason.model";
import { FormDialogueComponent } from "./form-dialogue/form-dialogue.component";
import { AddressonLocalityModel } from "../../../../core/models/addressonLocality.Model";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { AppointmentSearchDialogComponent } from "../../submodules/appointment-search/appointment-search-dialog/appointment-search-dialog.component";
import { DMSComponent } from "../dms/dms.component";
import { ModifyDialogComponent } from "../../../../core/modify-dialog/modify-dialog.component";
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
  fatherSpouseOptionList: [{ title: string; value: number }] = [] as any;
  stateList: StateModel[] = [];
  expieryDate: Date | undefined;
  issueAt: string | undefined;
  passportNum: number | undefined;
  issuedate: Date | undefined;
  categoryIcons: [] = [];
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

  passportDetails: {
    passportNo: string;
    IssueDate: string;
    Expirydate: string;
    Issueat: string;
    HCF: number;
  } = {
    passportNo: "",
    IssueDate: "null",
    Expirydate: "null",
    Issueat: "",
    HCF: 0,
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
        type: "number",
        title: "Mobile Number",
        required: true,
      },
      title: {
        type: "autocomplete",
        title: "Title",
        required: true,
        list: this.titleList,
      },
      firstName: {
        type: "string",
        title: "First Name",
        required: true,
      },
      middleName: {
        type: "string",
        title: "Middle Name",
        required: true,
      },
      lastName: {
        type: "string",
        title: "Last Name",
        required: true,
      },
      gender: {
        type: "autocomplete",
        title: "Gender",
        required: true,
        list: this.genderList,
      },
      dob: {
        type: "date",
        title: "Date of Birth",
      },
      age: {
        type: "number",
        title: "Age",
        required: true,
      },
      ageType: {
        type: "autocomplete",
        title: "Age Type",
        required: true,
        list: this.ageTypeList,
      },
      emailId: {
        type: "email",
        title: "Email id",
        required: true,
      },
      fatherSpouse: {
        type: "autocomplete",
        list: this.fatherSpouseOptionList,
        required: false,
      },
      fatherSpouseName: {
        type: "string",
        title: "",
        required: false,
      },
      motherName: {
        type: "string",
        title: "Mother's Name",
        required: false,
      },
      altLandlineName: {
        type: "number",
        title: "Alt Contact/Landline",
        // pattern: "[0-9+]{1}[0-9]{1,2}[0-9 ]{1}[0-9]{7,17}",
        required: false,
      },
      idenityType: {
        type: "autocomplete",
        title: "Identity",
        list: this.idTypeList,
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
        list: this.localityList,
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
        list: this.cityList,
      },
      district: {
        type: "autocomplete",
        title: "District",
        // required property is dependent on country
        list: this.disttList,
        required: true,
      },
      state: {
        type: "autocomplete",
        title: "State",
        // required property is dependent on country
        required: true,
        list: this.stateList,
      },
      country: {
        type: "autocomplete",
        title: "Country",
        required: true,
        list: this.countryList,
      },
      nationality: {
        type: "autocomplete",
        title: "Nationality",
        required: true,
        list: this.nationalityList,
      },
      foreigner: {
        type: "checkbox",
        required: false,
        options: [{ title: "Foreigner" }],
      },
      seaFarer: {
        type: "checkbox",
        required: false,
        options: [{ title: "Seaferers" }],
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
        options: [{ title: "Note" }],
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
        required: false,
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
        list: this.sourceOfInfoList,
      },
    },
  };
  AddressonLocalityModellst!: AddressonLocalityModel;
  OPRegForm!: FormGroup;
  questions: any;
  hotlistMasterList: hotlistingreasonModel[] = [];
  hotlistquestion: any;
  hotlistRemark: any;
  isPatientdetailModified: boolean = false;

  constructor(
    private formService: QuestionControlService,
    private cookie: CookieService,
    private http: HttpService,
    public matDialog: MatDialog,
    private datepipe: DatePipe,
    private reportService: ReportService,
    private patientService: PatientService,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.registrationFormData.properties,
      {}
    );

    this.OPRegForm = formResult.form;
    this.questions = formResult.questions;
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
    this.OPRegForm.controls["nationality"].setValue({ title: "Indian" });
    this.OPRegForm.controls["country"].setValue({ title: "India" });
  }

  checkForMaxID() {
    if (this.MaxIDExist) {
      this.OPRegForm.controls["hotlist"].enable();
    } else {
      this.OPRegForm.controls["hotlist"].disable();
      this.OPRegForm.controls;
    }
  }

  openForeigner() {
    this.matDialog.open(ForeignerDialogComponent, {
      width: "30vw",
      height: "52vh",
      data: {
        passportNum: this.passportNum,
        issuedate: this.issuedate,
        expieryDate: this.expieryDate,
        issueAt: this.issueAt,
      },
    });

    this.searchService.searchTrigger.subscribe((formdata: any) => {
      this.searchPatient(formdata.data);
    });
  }

  searchPatient(formdata: any) {
    if (
      formdata["name"] == "" &&
      formdata["phone"] == "" &&
      formdata["dob"] == "" &&
      formdata["maxID"] == "" &&
      formdata["healthID"] == "" &&
      formdata["adhaar"] == ""
    ) {
      return;
    } else if (
      formdata["name"] == "" &&
      formdata["phone"] == "" &&
      formdata["dob"] != "" &&
      formdata["maxID"] == "" &&
      formdata["healthID"] == "" &&
      formdata["adhaar"] == ""
    ) {
      return;
    } else {
      //need to implement search functionality
    }
  }

  checkForModifiedPatientDetail() {
    if (this.MaxIDExist) {
      this.isPatientdetailModified = true;
    }
  }
  ngAfterViewInit(): void {
    //  this.checkForMaxID();

    // this.registeredPatiendDetails=this.patientDetails as ModifiedPatientDetailModel;
    console.log(this.passportNum);

    // this.OPRegForm.controls["cash"].setValue({title:"cash",value:"Cash"});
    this.questions[22].elementRef.addEventListener(
      "blur",
      this.addressByLocalityID.bind(this)
    );

    this.questions[21].elementRef.addEventListener(
      "blur",
      this.getLocalityByPinCode.bind(this)
    );
    //Adding event to filter states based country
    this.questions[27].elementRef.addEventListener(
      "blur",
      this.getStatesByCountry.bind(this),
      this.getCitiesByCountry.bind(this)
    );
    this.questions[2].elementRef.addEventListener(
      "change",
      this.onPhoneModify.bind(this)
    );
    this.questions[3].elementRef.addEventListener(
      "blur",
      this.onTitleModify.bind(this)
    );
    this.questions[4].elementRef.addEventListener(
      "change",
      this.onFistNameModify.bind(this)
    );
    this.questions[6].elementRef.addEventListener(
      "change",
      this.onLastNameModify.bind(this)
    );
    this.questions[7].elementRef.addEventListener(
      "change",
      this.onGenderModify.bind(this)
    );
    this.questions[12].elementRef.addEventListener(
      "change",
      this.onTitleModify.bind(this)
    );
    this.questions[28].elementRef.addEventListener(
      "blur",
      this.onNationalityModify.bind(this)
    );
    this.questions[8].elementRef.addEventListener(
      "blur",
      this.onageCalculator.bind(this)
    );
    //this event to make DOB as mandatory if patient age <18 years
    this.questions[10].elementRef.addEventListener(
      "blur",
      this.validatePatientAge.bind(this)
    );

    // this.questions[30].elementRef.addEventListener(
    //   "click",
    //   this.openHotListDialog.bind(this)
    // );
    // this.questions[26].elementRef.addEventListener(
    //   "blur",
    //   this.getCityListByState.bind(this)
    // );

    //ON MAXID CHANGE
    this.questions[0].elementRef.addEventListener(
      "blur",
      this.getPatientDetailsByMaxId.bind(this)
    );

    //on change of Title Gender nees to be changed
    this.OPRegForm.controls["title"].valueChanges.subscribe((value: any) => {
      if (value) {
        let sex = this.titleList.filter((e) => e.id === value.value);
        if (sex.length) {
          this.questions[8].options = this.genderList
            .filter((e) => e.id === sex[0].sex)
            .map((s) => {
              this.OPRegForm.controls["gender"].setValue({
                title: s.name
              });             
            });
        }
      }
    });

    // //on change of Gender Title needs to be changed
    // this.OPRegForm.controls["gender"].valueChanges.subscribe((value: any) => {
    //   if (value) {
    //     let sex = this.titleList.filter((e) => e.id === value.value);
    //     if (sex.length) {
    //       this.questions[3].options = this.titleList           
    //         .map((s) => {
    //           this.OPRegForm.controls["title"].setValue({
    //             title: s.name
    //           });            
    //         });
    //     }
    //   }
    // });
  }

  //TITLE LIST API CALL
  getTitleList() {
    let hspId = Number(this.cookie.get("HSPLocationId"));
    this.http
      .get(ApiConstants.titleLookUp(hspId))
      .subscribe((resultData: any) => {
        this.titleList = resultData;
        this.questions[3].options = this.titleList.map((l) => {
          return { title: l.name, value: l.id };
        });
      });
  }

  addressByLocalityID() {
    this.http
      .get(
        ApiConstants.addressByLocalityID(this.OPRegForm.value.locality.value)
      )
      .subscribe((resultData: AddressonLocalityModel) => {
        this.AddressonLocalityModellst = resultData;
        this.OPRegForm.controls["city"].setValue({
          title: this.AddressonLocalityModellst.cityName,
          value: this.AddressonLocalityModellst.cityId,
        });
        this.OPRegForm.controls["country"].setValue({
          title: this.AddressonLocalityModellst.countryName,
          value: this.AddressonLocalityModellst.countryid,
        });
        this.OPRegForm.controls["state"].setValue({
          title: this.AddressonLocalityModellst.stateName,
          value: this.AddressonLocalityModellst.stateId,
        });
        // this.OPRegForm.controls["pincode"].setValue(
        //   {title:this.AddressonLocalityModellst.,value:this.AddressonLocalityModellst.cityId}
        // );
        this.OPRegForm.controls["district"].setValue({
          title: this.AddressonLocalityModellst.districtName,
          value: this.AddressonLocalityModellst.districtId,
        });
        // this.OPRegForm.controls["city"].setValue(
        //   {title:this.AddressonLocalityModellst.,value:this.AddressonLocalityModellst.cityId}
        // );
      });
  }
  //SOURCE OF INFO DROP DOWN
  getSourceOfInfoList() {
    this.http
      .get(ApiConstants.sourceofinfolookup)
      .subscribe((resultData: any) => {
        this.sourceOfInfoList = resultData;
        this.questions[41].options = this.sourceOfInfoList.map((l) => {
          return { title: l.name, value: l.id };
        });
      });
  }

  //AGE TYPE LIST
  getAgeTypeList() {
    this.http.get(ApiConstants.ageTypeLookUp).subscribe((resultData: any) => {
      this.ageTypeList = resultData;
      this.questions[10].options = this.ageTypeList.map((l) => {
        return { title: l.name, value: l.id };
      });
    });
  }

  //IDENTITY TYPE LOOKUP CALL

  getIDTypeList() {
    this.http
      .get(ApiConstants.identityTypeLookUp)
      .subscribe((resultData: any) => {
        this.idTypeList = resultData;
        this.questions[16].options = this.idTypeList.map((l) => {
          return { title: l.name, value: l.id };
        });
      });
  }

  //GENDER LIST FOR GENDER DROP DOWN
  getGenderList() {
    this.http.get(ApiConstants.genderLookUp).subscribe((resultData: any) => {
      this.genderList = resultData;
      this.questions[7].options = this.genderList.map((l) => {
        return { title: l.name, value: l.id };
      });
    });
  }

  //MASTER LIST FOR NATIONALITY
  getAllNAtionalityList() {
    this.http
      .get(ApiConstants.nationalityLookUp)
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
      .subscribe((resultData: any) => {
        this.countryList = resultData;
        this.questions[27].options = this.countryList.map((l) => {
          return { title: l.countryName, value: l.id };
        });
      });
  }

  //MASTER LIST FOR COUNTRY
  getAllCityList() {
    this.http.get(ApiConstants.cityMasterData).subscribe((resultData: any) => {
      this.cityList = resultData;
      this.questions[24].options = this.cityList.map((l) => {
        return { title: l.cityName, value: l.id };
      });
    });
  }

  //MASTER LIST FOR Distt
  getAllDisttList() {
    this.http.get(ApiConstants.disttMasterData).subscribe((resultData: any) => {
      this.disttList = resultData;
      this.questions[25].options = this.disttList.map((l) => {
        return { title: l.districtName, value: l.id };
      });
    });
  }

  //MASTER LIST FOR STATES
  getAllStateList() {
    this.http.get(ApiConstants.stateMasterData).subscribe((resultData: any) => {
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
      .subscribe((resultData: any) => {
        this.localityList = resultData;
        this.questions[22].options = this.localityList.map((l) => {
          return { title: l.localityName, value: l.id };
        });
      });
  }

  hotlistDialogList: { title: string; value: number }[] = [] as any;

  // gethotlistMasterData(): {title:string,value:number}[] {
  //   let arr=[] as any;
  //    this.http

  // }
  // hotlistDialogList: { title: string, value: number }[] = [] as any
  gethotlistMasterData(): { title: string; value: number }[] {
    let arr = [] as any;
    this.http
      .get(ApiConstants.hotlistMasterDataLookUp)
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
        this.hotlistdialogref = this.matDialog.open(FormDialogueComponent, {
          width: "30vw",
          height: "52vh",
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
                  options: this.hotlistDialogList,
                },
                reason: {
                  type: "textarea",
                  title: "Remark",
                  required: true,
                },
              },
            },
            layout: "single",
            buttonLabel: "Save",
          },
        });
        this.hotlistdialogref.afterClosed().subscribe((result: any) => {
          console.log("The dialog was closed");
          console.log(result);
          this.hotlistReason = result.data.hotlistTitle.title;
          this.hotlistRemark = result.data.reason;
          this.postHotlistComment(this.hotlistReason, this.hotlistRemark);
          console.log(this.hotlistReason, this.hotlistRemark);
          // this.postHotlistComment();
        });
      });
    return arr;
  }

  hotlistReason: string = "";
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
    this.http
      .get(
        ApiConstants.hotlistedPatient(
          this.patientDetails.registrationno,
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
      .subscribe((resultData: any) => {
        console.log(resultData);
        // this.questions[24].options = this.cityList.map((l) => {
        //   return { title: l.cityName, value: l.id };
      });
  }
  localityListByPin: LocalityByPincodeModel[] = [];
  //LOCALITY LIST FOR PINCODE
  getLocalityByPinCode() {
    this.http
      .get(ApiConstants.localityLookUp(this.OPRegForm.value.pincode))
      .subscribe((resultData: any) => {
        this.localityListByPin = resultData;
        console.log(this.localityListByPin);
        this.questions[22].options = this.localityListByPin.map((l) => {
          return { title: l.name, value: l.id };
        });
      });
  }

  cityListByState: CityModel[] = [];
  //CITY LIST FOR STATEID
  getCityListByState() {
    this.http
      .get(ApiConstants.cityByStateID(this.questions[26].options.value))
      .subscribe((resultData: any) => {
        this.cityList = resultData;
        console.log(this.localityListByPin);
        this.questions[24].options = this.cityList.map((l) => {
          return { title: l.cityName, value: l.id };
        });
      });
  }

  //Get StateList Basedon Country
  getStatesByCountry() {
    this.http
      .get(ApiConstants.stateByCountryId(this.questions[27].options.value))
      .subscribe((resultData: any) => {
        this.stateList = resultData;
        // console.log(this.localityListByPin);
        this.questions[26].options = this.stateList.map((l) => {
          return { title: l.stateName, value: l.id };
        });
      });
  }

  //Get CityList based on country
  getCitiesByCountry() {
    this.http
      .get(ApiConstants.CityDetail(this.questions[27].options.value))
      .subscribe((resultData: any) => {
        this.cityList = resultData;
        // console.log(this.localityListByPin);
        this.questions[26].options = this.cityList.map((l) => {
          return { title: l.cityName, value: l.id };
        });
      });
  }

  //Get Patient Details by Max ID
  MaxIDExist: boolean = false;
  getPatientDetailsByMaxId() {
    console.log(this.OPRegForm.value.maxid);
    let regNumber = this.OPRegForm.value.maxid.split(".")[1];
    let iacode = this.OPRegForm.value.maxid.split(".")[0];
    this.http
      .get(ApiConstants.patientDetails(regNumber, iacode))
      .subscribe((resultData: PatientDetails) => {
        this.patientDetails = resultData;
        this.categoryIcons = this.patientService.getCategoryIcons(
          this.patientDetails
        );
        this.MaxIDExist = true;
        console.log(this.categoryIcons);
        this.checkForMaxID();
        //RESOPONSE DATA BINDING WITH CONTROLS

        this.setValuesToOPRegForm(this.patientDetails);

        //SETTING PATIENT DETAILS TO MODIFIEDPATIENTDETAILOBJ
        this.registeredPatientDetails(this.patientDetails);
      });
  }

  onModifyDetail() {
    this.onUpdatePatientDetail();

    if (this.isPatientdetailModified) {
      this.modifyDialogg();
    }
  }

  postModifyCall() {
    this.http
      .post(
        ApiConstants.modifyPatientDetail,
        this.getModifiedPatientDetailObj()
      )
      .subscribe((resultData: PatientDetails) => {
        this.setValuesToOPRegForm(resultData);
        console.log(resultData);
      });
  }

  onUpdatePatientDetail() {
    console.log(this.getPatientUpdatedReqBody());
    this.http
      .post(ApiConstants.updatePatientDetail, this.getPatientUpdatedReqBody())
      .subscribe((resultData: PatientDetails) => {
        this.populateUpdatePatientDetail(resultData);
        console.log(resultData);
      });
  }
  postForm() {
    console.log(this.getPatientSubmitRequestBody());
    this.http
      .post(ApiConstants.postPatientDetails, this.getPatientSubmitRequestBody())
      .subscribe((resultData: PatientDetails) => {
        this.setValuesToOPRegForm(resultData);
        console.log(resultData);
      });
  }

  //BIND THE REGISTERED PATIENT RESPONSE TO QUESTIONS
  setValuesToOPRegForm(patientDetails: PatientDetails) {
    this.patientDetails = patientDetails;
    this.OPRegForm.controls["maxid"].setValue(
      this.patientDetails?.iacode + "." + this.patientDetails?.registrationno
    );
    this.OPRegForm.controls["SSN"].setValue(this.patientDetails?.ssn);
    this.OPRegForm.controls["mobileNumber"].setValue(
      this.patientDetails?.pphone
    );
    this.OPRegForm.controls["title"].setValue(this.patientDetails?.title, 0);
    this.OPRegForm.controls["firstName"].setValue(
      this.patientDetails?.firstname
    );
    this.OPRegForm.controls["lastName"].setValue(this.patientDetails?.lastName);
    this.OPRegForm.controls["middleName"].setValue(
      this.patientDetails?.middleName
    );
    this.OPRegForm.controls["gender"].setValue(this.patientDetails?.sex);
    this.OPRegForm.controls["dob"].setValue(this.patientDetails?.dateOfBirth);
    this.OPRegForm.controls["age"].setValue(this.patientDetails?.age);
    this.OPRegForm.controls["ageType"].setValue(
      this.patientDetails?.ageTypeName
    );
    this.OPRegForm.controls["emailId"].setValue(this.patientDetails?.pemail);
    this.OPRegForm.controls["country"].setValue(
      this.patientDetails?.countryName
    );
    this.OPRegForm.controls["nationality"].setValue(
      this.patientDetails?.nationality
    );
    this.OPRegForm.controls["foreigner"].setValue(
      this.patientDetails?.foreigner
    );
    this.OPRegForm.controls["hotlist"].setValue(this.patientDetails?.hotlist);
    this.populateUpdatePatientDetail(this.patientDetails);
    //THERE ARE MORE FUNCTIONALITIES NEEDED TO BE ADDED BELOW
    // this.OPRegForm.controls["SSN"].setValue(this.patientDetails?.ssn);
    // this.OPRegForm.controls["SSN"].setValue(this.patientDetails?.ssn);
    // this.OPRegForm.controls["SSN"].setValue(this.patientDetails?.ssn);
    // this.OPRegForm.controls["SSN"].setValue(this.patientDetails?.ssn);
    // this.OPRegForm.controls["SSN"].setValue(this.patientDetails?.ssn);
    // this.OPRegForm.controls["SSN"].setValue(this.patientDetails?.ssn);
    // this.OPRegForm.controls["SSN"].setValue(this.patientDetails?.ssn);
    // this.OPRegForm.controls["SSN"].setValue(this.patientDetails?.ssn);
    // this.OPRegForm.controls["SSN"].setValue(this.patientDetails?.ssn);
    // this.OPRegForm.controls["SSN"].setValue(this.patientDetails?.ssn);
    // this.OPRegForm.controls["SSN"].setValue(this.patientDetails?.ssn);
    // this.OPRegForm.controls["SSN"].setValue(this.patientDetails?.ssn);
    // this.OPRegForm.controls["SSN"].setValue(this.patientDetails?.ssn);
    // this.OPRegForm.controls["SSN"].setValue(this.patientDetails?.ssn);
    // this.OPRegForm.controls["SSN"].setValue(this.patientDetails?.ssn);
    // this.OPRegForm.controls["SSN"].setValue(this.patientDetails?.ssn);
    // this.OPRegForm.controls["SSN"].setValue(this.patientDetails?.ssn);
    // this.OPRegForm.controls["SSN"].setValue(this.patientDetails?.ssn);
    // this.OPRegForm.controls["SSN"].setValue(this.patientDetails?.ssn);
    // this.OPRegForm.controls["SSN"].setValue(this.patientDetails?.ssn);
    // this.OPRegForm.controls["SSN"].setValue(this.patientDetails?.ssn);
    // this.OPRegForm.controls["SSN"].setValue(this.patientDetails?.ssn);
    // this.OPRegForm.controls["SSN"].setValue(this.patientDetails?.ssn);
    // this.OPRegForm.controls["SSN"].setValue(this.patientDetails?.ssn);
    // this.OPRegForm.controls["SSN"].setValue(this.patientDetails?.ssn);
    // this.OPRegForm.controls["SSN"].setValue(this.patientDetails?.ssn);
  }

  onPhoneModify() {
    console.log("phone changed");
    this.modfiedPatiendDetails.pphone = this.OPRegForm.value.mobileNumber;
    this.checkForModifiedPatientDetail();
  }
  onTitleModify() {
    console.log("title changed");
    if (this.OPRegForm.value.title)
      this.modfiedPatiendDetails.title = this.OPRegForm.value.title.title;
    this.checkForModifiedPatientDetail();
  }

  onFistNameModify() {
    console.log("firstname changed");
    this.modfiedPatiendDetails.firstname = this.OPRegForm.value.firstName;
    this.checkForModifiedPatientDetail();
  }
  onLastNameModify() {
    console.log("lastname changed");
    this.modfiedPatiendDetails.lastName = this.OPRegForm.value.lastName;
    this.checkForModifiedPatientDetail();
  }
  onGenderModify() {
    console.log("gender changed");
    this.modfiedPatiendDetails.sex = this.OPRegForm.value.gender.title;
    this.checkForModifiedPatientDetail();
  }
  onEmailModify() {
    console.log("Age changed");
    this.modfiedPatiendDetails.pemail = this.OPRegForm.value.emailId;
    this.checkForModifiedPatientDetail();
  }
  onNationalityModify() {
    console.log("country changed");
    this.modfiedPatiendDetails.nationality =
      this.OPRegForm.value.nationality.value;
    this.checkForModifiedPatientDetail();
  }

  //BINDING UPDATE RELATED DETAILS FROM UPDATE ENDPOINT CALL
  populateUpdatePatientDetail(patientDetails: PatientDetails) {
    if (this.patientDetails?.spouseName != "") {
      this.OPRegForm.controls["fatherSpouse"].setValue("Spouse");
      this.OPRegForm.controls["fatherSpouseName"].setValue(
        this.patientDetails?.spouseName
      );
    } else {
      this.OPRegForm.controls["fatherSpouse"].setValue("Father");
      this.OPRegForm.controls["fatherSpouseName"].setValue(
        this.patientDetails?.fathersname
      );
    }

    this.OPRegForm.controls["motherName"].setValue(
      this.patientDetails?.mothersMaidenName
    );
    this.OPRegForm.controls["altLandlineName"].setValue(
      this.patientDetails?.landlineno
    );
    this.OPRegForm.controls["idenityType"].setValue(
      this.patientDetails?.identityTypeId
    );
    this.OPRegForm.controls["idenityValue"].setValue(
      this.patientDetails?.identityTypeNumber
    );
    this.OPRegForm.controls["adhaarId"].setValue(this.patientDetails?.adhaarId);
    this.OPRegForm.controls["healthId"].setValue("");
    this.OPRegForm.controls["address"].setValue(this.patientDetails?.address1);
    this.OPRegForm.controls["pincode"].setValue(this.patientDetails?.ppinCode);
    this.OPRegForm.controls["locality"].setValue(this.patientDetails?.locality);
    this.OPRegForm.controls["city"].setValue(this.patientDetails?.city);
    this.OPRegForm.controls["district"].setValue(
      this.patientDetails?.districtName
    );
    this.OPRegForm.controls["state"].setValue(this.patientDetails?.stateName);
    this.OPRegForm.controls["vip"].setValue(this.patientDetails?.vip);
    this.OPRegForm.controls["note"].setValue(this.patientDetails?.note);
    this.OPRegForm.controls["hwc"].setValue(this.patientDetails?.hwc);
    this.OPRegForm.controls["organdonor"].setValue(
      this.patientDetails?.isOrganDonor
    );
    this.OPRegForm.controls["otAdvanceExclude"].setValue(
      this.patientDetails?.isOtadvanceExculded
    );
    this.OPRegForm.controls["verifiedOnline"].setValue(
      this.patientDetails?.isCghsverified
    );
    this.OPRegForm.controls["surveySMS"].setValue(
      this.patientDetails?.marketing1
    );
    this.OPRegForm.controls["receivePromotional"].setValue(
      this.patientDetails?.marketing2
    );
    this.setPaymentMode(this.patientDetails?.ppagerNumber.toUpperCase());
    this.OPRegForm.controls["sourceOfInput"].setValue(
      this.patientDetails?.sourceofinfo
    );
  }

  setPaymentMode(ppagerNumber: string | undefined) {
    this.OPRegForm.value.paymentMethod;
    this.OPRegForm.controls["paymentMethod"].setValue(ppagerNumber);
    // switch (ppagerNumber) {
    //   case "CASH":
    //     this.OPRegForm.controls["cash"].setValue(ppagerNumber);
    //     break;
    //   case "EWS":
    //     this.OPRegForm.controls["ews"].setValue(ppagerNumber);
    //     break;

    //   case "CORPORATE/INSURANCE":
    //     this.OPRegForm.controls["Insurance"].setValue(ppagerNumber);
    //     break;
    //   case "PSU/GOVT":
    //     this.OPRegForm.controls["psuGovt"].setValue(ppagerNumber);
    //     break;
    //   default:
    //     this.OPRegForm.controls["cash"].setValue(ppagerNumber);
    // }
  }

  updateRequestBody!: UpdatepatientModel;
  getPatientUpdatedReqBody(): UpdatepatientModel {
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
      this.OPRegForm.value.ageType.value,
      this.OPRegForm.value.age,
      this.OPRegForm.value.address,
      "",
      "",
      this.OPRegForm.value.city.value,
      this.OPRegForm.value.district.value,
      this.OPRegForm.value.state.value,
      this.OPRegForm.value.country.value,
      this.OPRegForm.value.pincode,
      "Cash", //PAGER NEED TO CHECK HOW CAN BE SENT
      0,
      "",
      false,
      this.OPRegForm.value.vip || false,
      0,
      this.OPRegForm.value.dob == "" ? true : false,
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
      this.OPRegForm.value.dob == "" ? true : false,
      this.OPRegForm.value.locality.value || 0,
      this.OPRegForm.value.locality.value == undefined
        ? this.OPRegForm.value.locality.title
        : "",
      this.OPRegForm.value.sourceOfInput.value || 0,
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
      "this.ewsObj.bplCardNo",
      "addressOnCard",
      "cghsbeneficiaryCompany",
      this.OPRegForm.value.adhaarId,
      111111,
      this.OPRegForm.value.altLandlineName,
      this.OPRegForm.value.organdonor || false,
      this.OPRegForm.value.otAdvanceExclude || false,
      0,
      0,
      "this.seafarerObj.HKID",
      "this.seafarerObj.rank",
      "this.seafarerObj.Vesselname",
      "this.seafarerObj.FDPGroup",
      false,
      this.hwcRemark,
      this.OPRegForm.value.idenityType.value || 0,
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
    console.log("title", this.OPRegForm.value.title.title);

    let iacode = this.cookie.get("LocationIACode");
    let deptId = 0;

    return (this.patientSubmitDetails = new patientRegistrationModel(
      0,
      iacode,
      this.datepipe.transform(Date.now(), "yyyy-MM-ddThh:mm:ss") || "{}",
      deptId,
      "",
      this.OPRegForm.value.title.title,
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
      this.OPRegForm.value.gender.value,
      11,
      this.getSpouseName(),
      0,
      "",
      0,
      "",
      "",
      "",
      "",
      this.OPRegForm.value.ageType.value,
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
      "PASSPORT NO",
      "1900-01-01T00:00:00",
      "1900-01-01T00:00:00",
      " ISSUE AT",
      "",
      false,
      this.OPRegForm.value.vip || false,
      0,
      this.OPRegForm.value.foreigner || false,
      this.OPRegForm.value.dob == "" ? true : false,
      Number(this.cookie.get("UserId")),
      "",
      Number(this.cookie.get("HSPLocationId")),
      this.vip,
      this.OPRegForm.value.dob == "" ? true : false,
      this.OPRegForm.value.locality.value || 0,
      this.OPRegForm.value.locality.value == undefined
        ? this.OPRegForm.value.locality.title
        : "",
      this.OPRegForm.value.sourceOfInput.value || 0,
      false,
      this.OPRegForm.value.SSN,
      "1900-01-01T00:00:00",
      "",
      "",
      this.OPRegForm.value.note || false,
      this.noteRemark,
      this.OPRegForm.value.surveySMS || false,
      this.OPRegForm.value.receivePromotional || false,
      "",
      this.OPRegForm.value.verifiedOnline == "" ? 0 : 1,
      "this.ewsObj.bplCardNo",
      false,
      this.OPRegForm.value.adhaarId,
      111111,
      this.OPRegForm.value.altLandlineName,
      this.OPRegForm.value.organdonor || false,
      this.OPRegForm.value.otAdvanceExclude || false,
      "this.seafarerObj.HKID",
      "this.seafarerObj.rank",
      "this.seafarerObj.Vesselname",
      "this.seafarerObj.FDPGroup",
      false,
      this.hwcRemark,
      this.OPRegForm.value.idenityType.value || 0,
      this.OPRegForm.value.idenityValue,
      0,
      "this.ewsObj.bplCardAddress",
      this.OPRegForm.value.hotlist || false,
      "hotlsitcomment",
      "hotlistreason"
    ));
  }

  getFather(): string {
    let response = "";
    if (this.OPRegForm.value.fatherSpouse.title == "Father") {
      return this.OPRegForm.value.fatherSpouseName;
    }
    return response;
  }
  getSpouseName() {
    let response = "";
    if (this.OPRegForm.value.fatherSpouse.title != "Father") {
      return this.OPRegForm.value.fatherSpouseName;
    }
    return response;
  }

  modfiedPatiendDetails!: ModifiedPatientDetailModel;
  registeredPatiendDetails!: ModifiedPatientDetailModel;
  getModifiedPatientDetailObj(): ModifiedPatientDetailModel {
    return (this.modfiedPatiendDetails = new ModifiedPatientDetailModel(
      this.OPRegForm.value.maxid.split(".")[1],
      this.OPRegForm.value.maxid.split(".")[0],
      this.OPRegForm.value.title.title,
      this.OPRegForm.value.firstName,
      this.OPRegForm.value.middleName,
      this.OPRegForm.value.lastName,
      this.OPRegForm.value.gender.value,
      this.OPRegForm.value.mobileNumber,
      "",
      this.OPRegForm.value.emailId,
      this.OPRegForm.value.nationality.value,
      this.OPRegForm.value.foreigner || false,
      this.patientDetails.passportNo,
      this.datepipe.transform(
        this.patientDetails.issueDate,
        "yyyy-MM-ddThh:mm:ss"
      ) || "1900-01-01T00:00:00",
      this.datepipe.transform(
        this.patientDetails.expiryDate,
        "yyyy-MM-ddThh:mm:ss"
      ) || "1900-01-01T00:00:00",
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
      ) || "1900-01-01T00:00:00",
      expdate || "1900-01-01T00:00:00",
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
    if (this.OPRegForm.value.dob == "") {
      this.OPRegForm.value.age = null;
      this.OPRegForm.value.ageType = null;
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
      this.OPRegForm.value.ageType = null;
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

          if (this.timeDiff <= 0) {
            this.timeDiff =
              new Date(Date.now()).getDate() -
              new Date(this.OPRegForm.value.dob).getDate();
            if (this.timeDiff <= 0) {
            } else {
              this.OPRegForm.controls["age"].setValue(
                Math.floor(this.timeDiff)
              );
              this.OPRegForm.controls["ageType"].setValue({
                title: this.ageTypeList[0].name,
                value: this.ageTypeList[0].id,
              });
              console.log(this.ageTypeList[0].name);
            }
          } else {
            this.OPRegForm.controls["age"].setValue(Math.floor(this.timeDiff));
            this.OPRegForm.controls["ageType"].setValue({
              title: this.ageTypeList[3].name,
              value: this.ageTypeList[3].id,
            });
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
            this.OPRegForm.controls["ageType"].setValue({
              title: this.ageTypeList[3].name,
              value: this.ageTypeList[3].id,
            });
          } else {
            this.OPRegForm.controls["age"].setValue(Math.floor(this.timeDiff));
            this.OPRegForm.controls["ageType"].setValue({
              title: this.ageTypeList[4].name,
              value: this.ageTypeList[4].id,
            });
            console.log(this.ageTypeList[4].name);
          }
        }
      } else {
        this.OPRegForm.controls["age"].setValue(this.OPRegForm.value.age);
        console.log(this.OPRegForm.value.ageType);
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
        this.OPRegForm.value.age <= 18 &&
        (this.OPRegForm.value.ageType != null ||
          this.OPRegForm.value.ageType != undefined)
      ) {
        if (
          this.OPRegForm.value.dob == null ||
          this.OPRegForm.value.dob == undefined ||
          this.OPRegForm.value.dob == ""
        ) {
          this.OPRegForm.controls["dob"].setErrors({ incorrect: true });
          this.questions[8].customErrorMessage =
            "DOB is required, Age is less than 18 Years";
        }
      }
    }
  }
  //DIALOGS ---------------------------------------------------------------------------------------
  
  openVipNotes() {
    const vipNotesDialogref = this.matDialog.open(FormDialogueComponent, {
      width: "30vw",
      height: "52vh",
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
            },
          },
        },
        layout: "single",
        buttonLabel: "Save",
      },
    });
    vipNotesDialogref.afterClosed().subscribe((result) => {
      this.vip = result.data.VipNotes;
      console.log("openVipNotes dialog was closed");
    });
  }
  openNotes() {
    const notesDialogref = this.matDialog.open(FormDialogueComponent, {
      width: "30vw",
      height: "52vh",
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
            },
          },
        },
        layout: "single",
        buttonLabel: "Save",
      },
    });
    notesDialogref.afterClosed().subscribe((result) => {
      console.log(result);
      this.noteRemark = result.data.notes;
      console.log("notes dialog was closed");
    });
  }

  openEWSDialogue() {
    const EWSDialogref = this.matDialog.open(FormDialogueComponent, {
      width: "30vw",
      height: "52vh",
      data: {
        title: "HWC Remarks",
        form: {
          title: "",
          type: "object",
          properties: {
            bplCardNo: {
              type: "autocomplete",
              title: "BPL Card No.",
              required: true,
            },
            BPLAddress: {
              type: "textarea",
              title: "Address on card",
              required: true,
            },
          },
        },
        layout: "single",
        buttonLabel: "Save",
      },
    });
    EWSDialogref.afterClosed().subscribe((result) => {
      console.log("HWC dialog was closed");
    });
  }

  openHWCNotes() {
    const HWCnotesDialogref = this.matDialog.open(FormDialogueComponent, {
      width: "30vw",
      height: "52vh",
      data: {
        title: "HWC Remarks",
        form: {
          title: "",
          type: "object",
          properties: {
            HWCRemark: {
              type: "textarea",
              title: "HWC Remarks",
              required: true,
            },
          },
        },
        layout: "single",
        buttonLabel: "Save",
      },
    });
    HWCnotesDialogref.afterClosed().subscribe((result) => {
      this.hwcRemark = result.data.HWCRemark;
      console.log("HWC dialog was closed");
    });
  }
  openDialog() {
    this.matDialog.open(AppointmentSearchDialogComponent, {
      width: "100vw",
      height: "52vh",
    });
  }

  modifyDialogg() {
    // const passportDetailDialogref = this.matDialog.open(ModifyDialogComponent, {
    //         width: "30vw",
    //         height: "80vh",
    //  }
    const passportDetailDialogref = this.matDialog.open(FormDialogueComponent, {
      width: "30vw",
      height: "80vh",
      data: {
        title: "Passport Details",
        form: {
          title: "",
          type: "object",
          properties: {
            msg1:{
              title:"Existing Data"
            },
            firstName: {
              type: "string",
              title: "First Name",
              defaultValue: this.patientDetails.firstname,
              required: true,
              readonly: true,
            },
            msg2:{
              title:"Modified Data"
            },
            modifiedfirstName: {
              type: "string",
              title: "First Name",
              defaultValue: this.OPRegForm.value.firstName,
              required: true,
              readonly: true,
            },
            middleName: {
              type: "string",
              title: "Middle Name",
              defaultValue: this.patientDetails.middleName,
              required: true,
              readonly: true,
            },

            modifiedmiddleName: {
              type: "string",
              title: "Middle Name",
              defaultValue: this.OPRegForm.value.middleName,
              required: true,
              readonly: true,
            },
            lastName: {
              type: "string",
              title: "Last Name",
              defaultValue: this.patientDetails.lastName,
              required: true,
              readonly: true,
            },

            modifiedlastName: {
              type: "string",
              title: "Last Name",
              defaultValue: this.OPRegForm.value.lastName,
              required: true,
              readonly: true,
            },
            gender: {
              type: "string",
              title: "Gender",
              defaultValue: this.patientDetails.sexName,
              required: true,
              readonly: true,
            },

            modifiedgender: {
              type: "string",
              title: "Gender",
              defaultValue: this.OPRegForm.value.gender.title,
              required: true,
              readonly: true,
            },
            email: {
              type: "email",
              title: "Email id",
              defaultValue: this.patientDetails.pemail,
              required: true,
              readonly: true,
            },

            modifiedemail: {
              type: "email",
              title: "Email id",
              defaultValue: this.OPRegForm.value.emailId,
              required: true,
              readonly: true,
            },
            mobileNumber: {
              type: "number",
              title: "Mobile Number",
              defaultValue: this.patientDetails.pphone,
              required: true,
              readonly: true,
            },
            modifiedMobileNumber: {
              type: "number",
              title: "Mobile Number",
              defaultValue: this.OPRegForm.value.mobileNumber,
              required: true,
              readonly: true,
            },
            nationality: {
              type: "string",
              title: "Nationality",
              defaultValue: this.patientDetails.nationalityName,
              required: true,
              readonly: true,
            },
            modifiedNationality: {
              type: "string",
              title: "Nationality",
              defaultValue: this.OPRegForm.value.nationality.title,
              required: true,
              readonly: true,
            },
            foreigner: {
              type: "checkbox",
              options: [{ title: "Foreigner" }],
              defaultValue: this.patientDetails.foreigner,
              readonly: true,
            },
            modifiedForeigner: {
              type: "checkbox",
              options: [{ title: "Foreigner" }],
              defaultValue: this.OPRegForm.value.foreigner,
              readonly: true,
            },
            msg:{
              title:"*Please note that highlighted text are the modified data."
            }
          },
        },
        layout: "double",
        buttonLabel: "Submit for Approval",
      },
    });
    passportDetailDialogref.afterClosed().subscribe((result) => {
      this.postModifyCall();
    });
  }

  passportDetailsdialog() {
    const passportDetailDialogref = this.matDialog.open(FormDialogueComponent, {
      width: "30vw",
      height: "52vh",
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
            },
            issueDate: {
              type: "date",
              title: "Issue Date",
              required: true,
            },
            expiryDate: {
              type: "date",
              title: "Expiry Date",
              required: true,
            },
            issuedAt: {
              type: "string",
              title: "Issued At",
              required: true,
            },

            hcf: {
              type: "autcomplete",
              title: "HCF",
              required: true,
            },
          },
        },
        layout: "double",
        buttonLabel: "Save",
      },
    });
    passportDetailDialogref.afterClosed().subscribe((result) => {
      console.log("passport dialog was closed");
    });
  }

  seafarersDetailsdialog() {
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
              },
              vesselName: {
                type: "string",
                title: "Vessel name",
                required: true,
              },
              rank: {
                type: "string",
                title: "Rank",
                required: true,
              },
              fdpGroup: {
                type: "string",
                title: "FDP Group",
                required: true,
              },
            },
          },
          layout: "double",
          buttonLabel: "Save",
        },
      }
    );
    seafarersDetailDialogref.afterClosed().subscribe((result) => {
      console.log("seafarers dialog was closed");
    });
  }
  openDMSDialog() {
    this.matDialog.open(DMSComponent, { width: "100vw", height: "52vh" });
  }
}

// function ngAfterViewInit() {
//   throw new Error("Function not implemented.");
// }
