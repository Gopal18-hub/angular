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
import { PatientDetails } from "../../../../core/models/patientDetailsModel.Model";
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
  public patientDetails: PatientDetails | undefined;
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
        minimum: 10,
        maximum: 10,
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
        required: true,
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
        conditions: "[0-9+]{1}[0-9]{1,2}[0-9 ]{1}[0-9]{7,17}",
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
      localityTxt: {
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
        required: false,
        options: [{ title: "Foreigner" }],
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
      cash: {
        type: "radio",
        required: true,
        options: [{ title: "Cash" }],
      },
      psuGovt: {
        type: "radio",
        required: false,
        options: [{ title: "PSU/Govt" }],
      },
      ews: {
        type: "radio",
        required: false,
        options: [{ title: "EWS" }],
      },
      Insurance: {
        type: "radio",
        required: false,
        options: [{ title: "Corporate/Insurance" }],
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

  constructor(
    private formService: QuestionControlService,
    private cookie: CookieService,
    private http: HttpService,
    public matDialog: MatDialog
  ) {}

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
            this.OPRegForm.controls["gender"].setValue({
              title: s.name,
              value: s.id,
            });
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

    //ON MAXID CHANGE
    this.questions[0].elementRef.addEventListener(
      "blur",
      this.getPatientDetailsByMaxId.bind(this)
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
  opendialog() {
    //  this.matDialog.open(PrintLabelDialogComponent, {width: '30vw', height: '30vh'});
    //  this.matDialog.open(VipDialogComponent, {width: '30vw', height: '40vh'});
    this.matDialog.open(HotListingDialogComponent, {
      width: "30vw",
      height: "52vh",
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

  //CITY LIST FOR STATEID
  getPatientDetailsByMaxId() {
    console.log(this.OPRegForm.value.maxid);
    let regNumber = this.OPRegForm.value.maxid.split(".")[1];
    let iacode = this.OPRegForm.value.maxid.split(".")[0];
    this.http
      .get(ApiConstants.patientDetails(regNumber, iacode))
      .subscribe((resultData: any) => {
        this.patientDetails = resultData;
        this.setValuesToOPRegForm(this.patientDetails);
      });
    // console.log(this.localityListByPin);
    // this.questions[24].options = this.cityList.map((l) => {
    //   return { title: l.cityName, value: l.id };
    // });
  }

  setValuesToOPRegForm(patientDetails: PatientDetails | undefined) {
    this.OPRegForm.controls["maxid"].setValue(this.patientDetails?.iacode+"."+
      this.patientDetails?.registrationno
    );
    this.OPRegForm.controls["SSN"].setValue(this.patientDetails?.ssn);
    this.OPRegForm.controls["mobileNumber"].setValue(
      this.patientDetails?.pphone
    );
    this.OPRegForm.controls["title"].setValue(this.patientDetails?.title,0);
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

  setPaymentMode(ppagerNumber: string | undefined) {
    switch (ppagerNumber) {
      case "CASH":
        this.OPRegForm.controls["cash"].setValue(ppagerNumber);
        break;
      case "EWS":
        this.OPRegForm.controls["ews"].setValue(ppagerNumber);
        break;
        
      case "CORPORATE/INSURANCE":
        this.OPRegForm.controls["Insurance"].setValue(ppagerNumber);
        break;
      case "PSU/GOVT":
        this.OPRegForm.controls["psuGovt"].setValue(ppagerNumber);
        break;
      default:
        this.OPRegForm.controls["cash"].setValue(ppagerNumber);
    }
  }
  // this.patientModel = new patientRegistrationModel(0, localStorage.getItem('locationIacode'), this.datepipe.transform(Date.now(),
  //     'yyyy-MM-ddThh:mm:ss'), 0, "", this.Title, saveform.Firstname, saveform.Middlename,
  //     saveform.Lastname, saveform.Mothername, this.FatherName, this.isFatherSelected,
  //     this.datepipe.transform(saveform.birthdate,
  //       'yyyy-MM-ddThh:mm:ss'),this.GenderInt, this.maritalStatus,
  //     this.SpouseName, 0,"", 0, "", "", "", "", this.AgeTypeValue, saveform.Age, saveform.Address,
  //     "", "", this.Cityortown, this.District, this.State, this.countryId, this.pincode, saveform.MobileNumber,"", saveform.EmailID,
  //      this.ppagernumber, 0,
  //     this.Nationality, false, this.foreignerObj.passportNo,
  //     this.datepipe.transform( this.foreignerObj.IssueDate,
  //       'yyyy-MM-ddThh:mm:ss'), this.datepipe.transform( this.foreignerObj.Expirydate,
  //         'yyyy-MM-ddThh:mm:ss'), this.foreignerObj.Issueat, "", false, saveform.VIP, 0, this.Foreigner, false,
  //     0, "",this.hspcode, this.vipObj.VIPNotes, true, this.localityId, this.otherLocality, this.sourceId, false, "", "1900-01-01T00:00:00",
  //      "", "", saveform.Note, this.notesObj.Notesremarks,
  //     this.receivesms, this.promotionmsg, this.panno, this.cghsInt, this.ewsObj.bplCardNo,false,  saveform.Aadhar,  this.foreignerObj.HCF,
  //     this.LandLineNumber, this.OrganDonor, saveform.OTAdvance, this.seafarerObj.HKID,
  //     this.seafarerObj.rank, this.seafarerObj.Vesselname, this.seafarerObj.FDPGroup, saveform.HWC, this.hwcObj.HWCRemarks, this.Identity,
  //     this.Identitynumber, 0,this.ewsObj.bplCardAddress,saveform.HotList,"",""
  //   );
}
// function ngAfterViewInit() {
//   throw new Error("Function not implemented.");
// }
