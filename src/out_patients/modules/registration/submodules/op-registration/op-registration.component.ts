import { Component, OnInit } from "@angular/core";
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
import { MatDialog } from "@angular/material/dialog";
import { PrintLabelDialogComponent } from "./print-label-dialog/print-label-dialog.component";
import { VipDialogComponent } from "./vip-dialog/vip-dialog.component";
import { HotListingDialogComponent } from "./hot-listing-dialog/hot-listing-dialog.component";
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
  countryList: MasterCountryModel[] = [];
  cityList: CityModel[] = [];
  disttList: DistrictModel[] = [];
  localityList: LocalityModel[] = [];

  registrationFormData = {
    title: "",
    type: "object",
    properties: {
      maxid: {
        type: "string",
        title: "Max ID",
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
      firstname: {
        type: "string",
        title: "First Name",
        required: true,
      },
      middlename: {
        type: "string",
        title: "Middle Name",
        required: true,
      },
      lastname: {
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
        required: true,
      },
      age: {
        type: "number",
        title: "Age",
        required: true,
      },
      agetype: {
        type: "autocomplete",
        title: "Age Type",
        required: true,
      },
      emailId: {
        type: "email",
        title: "Email id",
        required: true,
      },
      fatherSpouse: {
        type: "autocomplete",
        title: "Father/Spouse Name",
      },
      fatherSpouseName: {
        type: "string",
        title: "",
      },
      motherName: {
        type: "string",
        title: "Mother's Name",
      },
      altLandlineName: {
        type: "string",
        title: "Alt Contact/Landline",
      },
      idenityType: {
        type: "autocomplete",
        title: "Identity",
      },
      idenityValue: {
        type: "string",
        title: "",
      },
      adhaarId: {
        type: "string",
        title: "Aadhaar ID",
      },
      healthId: {
        type: "string",
        title: "Health ID",
      },
      address: {
        type: "string",
        title: "Address",
        // required property is dependent on country
        required: true,
      },
      pincode: {
        type: "string",
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
      localitytxt: {
        type: "string",
        title: "",
        // required property is dependent on country and text will be enabled on select of others
        required: true,
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
        required: true,
      },
      state: {
        type: "autocomplete",
        title: "State",
        // required property is dependent on country
        required: true,
      },
      country: {
        type: "autocomplete",
        title: "Country",
        required: true,
      },
      nationality: {
        type: "autocomplete",
        title: "Nationality",
        required: true,
        list: this.nationalityList,
      },
      foreigner: {
        type: "checkbox",
        title: "Foreigner",
        required: false,
        options: [{ title: "foreigner" }],
      },
      hotlist: {
        type: "checkbox",
        title: "Hot Listing",
        required: false,
        options: [{ title: "hotList" }],
      },
      vip: {
        type: "checkbox",
        title: "VIP",
        required: false,
        options: [{ title: "Vip" }],
      },
      note: {
        type: "checkbox",
        title: "Note",
        required: false,
        options: [{ title: "notes" }],
      },
      hwc: {
        type: "checkbox",
        title: "HWC",
        required: false,
        options: [{ title: "hwc" }],
      },
      organdonor: {
        type: "checkbox",
        title: "Organ Donor",
        required: false,
        options: [{ title: "od" }],
      },
      otAdvanceExclude: {
        type: "checkbox",
        title: "OT Advance Exclude",
        required: false,
        options: [{ title: "ot" }],
      },
      verifiedOnline: {
        type: "checkbox",
        title: "CGHS Patient Verified Online",
        required: false,
        options: [{ title: "cghs" }],
      },
      surveySMS: {
        type: "checkbox",
        title: "Customer agrees to receive any survey SMS/Email/Calls",
        required: false,
        options: [{ title: "" }],
      },
      receivePromotional: {
        type: "checkbox",
        title: "Customer agrees to receive Promotional Information",
        required: false,
        options: [{ title: "cghs" }],
      },
      cash: {
        type: "radio",
        title: "Cash",
        required: true,
        options: [{ title: "cghs" }],
      },
      psuGovt: {
        type: "radio",
        title: "PSU/Govt",
        required: false,
        options: [{ title: "cghs" }],
      },
      ews: {
        type: "radio",
        title: "EWS",
        required: false,
        options: [{ title: "cghs" }],
      },
      Insurance: {
        type: "radio",
        title: "Corporate/Insurance",
        required: false,
        options: [{ title: "cghs" }],
      },
      sourceOfInput: {
        type: "autocomplete",
        title: "Source of Info about Max Healthcare",
        required: false,
        list: this.sourceOfInfoList,
      },
    },
  };
  OPRegForm!: FormGroup;
  questions: any;
  stateList: StateModel[] = [];

  
 

  
  

  constructor(private formService: QuestionControlService, private cookie: CookieService,private http: HttpService, public matDialog: MatDialog) {}

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.registrationFormData.properties,
      {}
    );

    this.OPRegForm = formResult.form;
    this.questions = formResult.questions;

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
  }

  ngAfterViewInit(): void {
    this.OPRegForm.controls["title"].valueChanges.subscribe((value: any) => {
      if (value) {
        let sex = this.titleList.filter((e) => e.id === value.value)[0].sex;
        this.questions[8].options = this.genderList
          .filter((e) => e.id === sex)
         
          .map((s) => {
            this.OPRegForm.controls['gender'].setValue({ title: s.name, value: s.id });
            return { title: s.name, value: s.id };
          });
      }
    });
    this.questions[21].elementRef.addEventListener(
      "blur",
      this.getLocalityByPinCode.bind(this)
    );
    this.questions[26].elementRef.addEventListener(
      "blur",
      this.getCityListByState.bind(this)
    );

  
   
  }

  registationFormSubmit() {
    //ON SUBMITTING FORM ACTION
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

  //SOURCE OF INFO DROP DOWN
  getSourceOfInfoList() {
    this.http
      .get(ApiConstants.sourceofinfolookup)
      .subscribe((resultData: any) => {
        this.sourceOfInfoList = resultData;
        this.questions[43].options = this.sourceOfInfoList.map((l) => {
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
  opendialog()
  {
    // this.matDialog.open(PrintLabelDialogComponent, {width: '30vw', height: '30vh'});
    // this.matDialog.open(VipDialogComponent, {width: '30vw', height: '40vh'});
    this.matDialog.open(HotListingDialogComponent, {width: '30vw', height: '52vh'})
  }


localityListByPin:LocalityByPincodeModel[]=[];
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

cityListByState:CityModel[]=[];
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



}
// function ngAfterViewInit() {
//   throw new Error("Function not implemented.");
// }
