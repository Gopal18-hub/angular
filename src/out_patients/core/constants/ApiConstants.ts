import { environment } from "@environments/environment";

export namespace ApiConstants {
  //PATIENT AGE RESPONSE TYPE ageTypeModel[]
  export const ageTypeLookUp =
    environment.CommonApiUrl + "api/lookup/agetypelookup/0";

  //PATIENT GENDER RESPONSE TYPE genderModel[]
  export const genderLookUp =
    environment.CommonApiUrl + "api/lookup/genderlookup/0";

  //PATIENT IDENTITY RESPONSE TYPE identityModel[]
  export const identityTypeLookUp =
    environment.CommonApiUrl + "api/lookup/identitytypelookup/0";

  //PATIENT NATIONALITY RESPONSE TYPE nationalityModel[]
  export const nationalityLookUp =
    environment.CommonApiUrl + "api/lookup/nationalitylookup/0";

  //PATIENT SOURCE OF INFO RESPONSE TYPE sourceOfInfoModel[]
  export const sourceofinfolookup =
    environment.CommonApiUrl + "api/lookup/sourceofinfolookup/0";

  //PATIENT TITLE MR/MRS etc.. RESPOSE TYPE sourceOfInfoModel[] NEED TO CANCATINATE $hspLocation/0 IN ENDPOINT
  export const titleLookUp = (hspLocationid: number) => {
    return (
      environment.CommonApiUrl +
      "api/lookup/titlelookup/" +
      `${hspLocationid}` +
      "/0"
    );
  };
  export const hotlistMasterDataLookUp =
    environment.CommonApiUrl + "api/lookup/hotlistingreasonlookup/0";

  //OPERATOR WORKING STATION LOCATION, RESPOSE TYPE stationModel NEED TO CANCATINATE $hspLocation IN ENDPOINT
  export const stationLookup = (hspLocationid: number) => {
    environment.CommonApiUrl +
      "api/lookup/stationlookup/0/" +
      `${hspLocationid}`;
  };

  //PATIENT LOCALITY ON THE INPUT OF PINCODE, RESPONSE TYPE localityByPincode, NEED TO CONCATINATE PINCODE IN ENDPOINT
  export const localityLookUp = (pincode: number) => {
    return (
      environment.CommonApiUrl +
      "api/lookup/getlocalityonpincode/" +
      `${pincode}`
    );
  };

  //PATIENT HCF MASTER MODEL FOR PASSPORT
  export const hcfLookUp = (hspLocation: number) => {
    return (
      environment.CommonApiUrl + "api/lookup/hcflookup/" + hspLocation + "?0"
    );
  };

  //PATIENT master LOCALITY RESPONSE TYPE localityMasterModel
  export const localityMasterData =
    environment.CommonApiUrl + "api/lookup/getlocality";

  //PATIENT COUNTRY MASTER DATA, RESPONSE TYPE masterCountryModel[]
  export const masterCountryList =
    environment.CommonApiUrl + "api/lookup/getcountry";

  //PATIENT ADDRESS STATE BY COUNTRY ID, RESPONSE type stateModel[]
  export const stateByCountryId = (countryId: number) => {
    return environment.CommonApiUrl + "api/lookup/getstate/" + `${countryId}`;
  };

  //PATIENT ADDRESS STATE BY COUNTRY ID, RESPONSE type stateMasterModel
  export const stateMasterData =
    environment.CommonApiUrl + "api/lookup/getstate";

  //PATIENT ADDRESS CITY BY STATE ID, RESPONSE type commonCityTypeModel[]
  export const cityByStateID = (stateId: number) => {
    return environment.CommonApiUrl + "api/lookup/getcity/" + `${stateId}`;
  };

  //PATIENT ADDRESS ocality BY City ID, RESPONSE type commonCityTypeModel[]
  export const localityBycityID = (cityId: number) => {
    return environment.CommonApiUrl + "api/lookup/getlocality/" + `${cityId}`;
  };

  //PATIENT ADDRESS CITY MASTER MODEL, RESPONSE type commonCityTypeModel[]
  export const cityMasterData = environment.CommonApiUrl + "api/lookup/getcity";

  //PATIENT ADDRESS DISTRICT BY STATE ID, RESPONSE type commonDisttModel[]
  export const districtBystateID = (stateId: number) => {
    return environment.CommonApiUrl + "api/lookup/getdistrict/" + `${stateId}`;
  };

  //PATIENT ADDRESS DISTRICT BY STATE ID, RESPONSE type commonDisttModel[]
  export const disttMasterData =
    environment.CommonApiUrl + "api/lookup/getdistrict";

  //PATIENT ADDRESS BY CITY ID, RESPONSE type addressByCityIDModel[]
  export const addressByCityID = (cityID: number) => {
    return (
      environment.CommonApiUrl +
      "api/lookup/getlocalitydistrictstatebycity/" +
      `${cityID}`
    );
  };

  //PATIENT CITY DETAILS BY COUNTYID, RESPONSE type commonCityTypeModel[]
  export const CityDetail = (countryId: number) => {
    return (
      environment.CommonApiUrl + "api/lookup/getcitybycountry/" + `${countryId}`
    );
  };

  //PATIENT onlineserviceList DETAILS BY hspLocationID, RESPONSE type GenernicIdNameModel[]
  export const onlineserviceList = (hspLocationID: number) => {
    return (
      environment.CommonApiUrl +
      "api/lookup/getlistofallonlineservice/" +
      `${hspLocationID}`
    );
  };

  //PATIENT NATIONALITY  DETAILS FROM MASTER DATA, RESPONSE type GenernicIdNameModel[]
  export const nationalityMasterData =
    environment.CommonApiUrl + "api/lookup/getnationality";

  //PATIENT onlineserviceList DETAILS BY hspLocationID, RESPONSE type GenernicIdNameModel[]
  export const addressByLocalityID = (locationid: number) => {
    return (
      environment.CommonApiUrl +
      "api/lookup/getcitydistrictstatecountryonlocality/" +
      `${locationid}`
    );
  };

  /* ----------------------------------------------------------------------------------------------------------
    ------------------------------PatientApiUrl ENDPOINTS-------------------------------------------------- 
    ----------------------------------------------------------------------------------------------------------*/

  //PATIENT DETAILS BY REGISTATION NUMBER(MANDATORY) AND IADCODE(MANDATORY) RESPONSE TYPE patientDetailsModel
  export const patientDetails = (registrationno: number, iacode: string) => {
    return (
      environment.PatientApiUrl +
      "api/patient/getpatientbymaxid/" +
      registrationno +
      "/" +
      iacode
    );
  };

  //POST PATIENT DETAILS FROM OPD FORM BODY TYPE patientRegistrationModel.Model AND RESPONSE TYPE patientRegistrationModel
  export const postPatientDetails =
    environment.PatientApiUrl + "api/patient/registeropdpatient";

  //get PATIENT hotlisting MAXID,HOTLISTING HEADER AND LOCATION ID IS MANDATORY OTHERS ARE QUERY PARAM, RESPONSE IS STRING ERROR IS ALSO RESPONSE WHEN USER IS ALREADY HOTLISTED BUT IS NOT APPROVED/REJECTED YET
  // RESPONSE --->You have already added a host list comment against this Max ID in "LOCATION NAME",Please Approve OR Reject Then Can Add new Host List Comment"
  export const hotlistedPatient = (
    maxId: string,
    hotlistingHeader: string,
    locationid: string,
    firstName: string,
    lastname: string,
    middleName: string,
    hotlistingcomment: string,
    type: string,
    userid: number
  ) => {
    return (
      environment.PatientApiUrl +
      "api/patient/patienthotlisting/" +
      maxId +
      "/" +
      hotlistingHeader +
      "/" +
      locationid +
      "?firstName=" +
      firstName +
      "&middleName=" +
      middleName +
      "&lastName=" +
      lastname +
      "&hotlistingComment=" +
      hotlistingcomment +
      "&type=" +
      type +
      "&userId=" +
      userid
    );
  };

  //appointment patient search
  export const appointmentPatientDetail = (
    phoneNo: string,
    name: string,
    lastname: string,
    datevalidation: number,
    fromdate: string,
    todate: string,
    bookingNo: string
  ) => {
    return (
      environment.PatientApiUrl +
      "api/patient/getappointmentpatientssearch?phone=" +
      phoneNo +
      "&fname=" +
      name +
      "&lname=" +
      lastname +
      "" +
      "&IsDateRange=" +
      datevalidation +
      "&fromDate=" +
      fromdate +
      "&ToDate=" +
      todate +
      "&SearchFrom=" +
      1 +
      "&BookingNo=" +
      bookingNo
    );
  };

  //FOR FETCHING THE DMS DETAILS FOR PATIENT RESPONSE TYPE PatientDMSDetailModel
  export const PatientDMSDetail = (IaCode: string, RegistrationNo: number) => {
    return (
      environment.PatientApiUrl +
      "api/patient/getpatientdmsrefresh/" +
      IaCode +
      "/" +
      RegistrationNo
    );
  };

  //POST CALL TO UPDATE THE PATIENT DETAIL, BODY TYPE patientRegistrationModel
  export const updatePatientDetail =
    environment.PatientApiUrl + "api/patient/updateopdpatientdetails";

  //POST CALL TO MODIFY THE PATIENT DETAIL, BODY TYPE patientRegistrationModel
  export const modifyPatientDetail =
    environment.PatientApiUrl + "api/patient/modifyopdpatient";

  //POST CALL FOR THE LIST OF SIMILAR PATIENT DETAIL, BODY TYPE SimilarSoundPatientDetails
  export const similarSoundPatientDetail =
    environment.PatientApiUrl + "api/patient/getsimilarsoundpatient";

  //Find Patient API Call
  export const searchPatientApiDefault =
    environment.PatientApiUrl + "api/patient/getallpatientssearch";

  //PATIENT TITLE MR/MRS etc.. RESPOSE TYPE sourceOfInfoModel[] NEED TO CANCATINATE $hspLocation/0 IN ENDPOINT
  export const searchPatientApi = (
    maxId?: string,
    SSN?: string,
    Name?: string,
    PhoneNumber?: string,
    DOB?: string,
    AadhaarId?: string,
    HealthId?: string
  ) => {
    return (
      environment.PatientApiUrl +
      "api/patient/getallpatientssearch?MaxId=" +
      maxId +
      "&SSN=" +
      SSN +
      "&Name=" +
      Name +
      "&PhoneNumber=" +
      PhoneNumber +
      "&DOB=" +
      DOB +
      "&AadhaarId=" +
      AadhaarId +
      "&HealthId=" +
      HealthId
    );
  };

  export const globalSearchApi = (value: string, hspId: Number) => {
    return (
      environment.PatientApiUrl +
      "api/patient/getglobalsearch/" +
      `${value}` +
      "/" +
      `${hspId}`
    );
  };

  export const mergePatientApi = (ActivePatientId: number, userId: number) => {
    return (
      environment.PatientApiUrl +
      "api/patient/patientmerging/" +
      ActivePatientId +
      "/" +
      userId
    );
  };

  export const mergePatientSearchApi = (MaxId: string, SSN: string) => {
    return (
      environment.PatientApiUrl +
      "api/patient/getmergepatientsearch?MaxId=" +
      MaxId +
      "&SSN=" +
      SSN
    );
  };

  export const unmergePatientAPi = (userId: number) => {
    return environment.PatientApiUrl + "api/patient/patientunmerging/" + userId;
  };

  export const locationname =
  environment.PatientApiUrl + "api/patient/getlocationname";
 
  export const getdispatchreport = (fromdate:any, todate:any, locationid:number, reptype:number) => {
    return ( environment.PatientApiUrl + "api/patient/getdataforreportdispatch/"+fromdate+'/'+todate+'/'+locationid +'/'+reptype);
  }

  export const getarecounter = (HsplocationId: number) => {
    return ( environment.BillingApiUrl + "api/outpatientbilling/getareacounterdetails/"+ HsplocationId);
  }

  export const gettransactiontype = 
  environment.BillingApiUrl + "api/outpatientbilling/getpatienthistorytransactiontype";

  export const getregisteredpatientdetails = (IACode: string, RegistrationNo: number) => {
    return ( environment.BillingApiUrl + "api/outpatientbilling/getregisteredpatientdetail/"+IACode+'/'+RegistrationNo);
  }

  export const dispatchreportsave =
  environment.PatientApiUrl + "api/patient/reportdispatchsave"

  export const approvalpostapproveApi =
    environment.PatientApiUrl + "api/patient/approverejectopregrequests";

  export const hotlistingpostapproveApi = (UserId: number, flag: number) => {
    return (
      environment.PatientApiUrl +
      "api/patient/approvedrejectdeletehotlisting/" +
      UserId +
      "/" +
      flag
    );
  };
  export const opapprovalpending = (
    fromdate: string,
    todate: string,
    hspLocationid: number
  ) => {
    return (
      environment.PatientApiUrl +
      "api/patient/getopregistrationpendingrequests/" +
      fromdate +
      "/" +
      todate +
      "/" +
      hspLocationid
    );
  };

  export const opapprovalaccepted = (
    fromdate: string,
    todate: string,
    hspLocationid: number
  ) => {
    return (
      environment.PatientApiUrl +
      "api/patient/getopregapproverejectrequests/" +
      fromdate +
      "/" +
      todate +
      "/" +
      hspLocationid +
      "/" +
      1
    );
  };
  export const opapprovalrejected = (
    fromdate: string,
    todate: string,
    hspLocationid: number
  ) => {
    return (
      environment.PatientApiUrl +
      "api/patient/getopregapproverejectrequests/" +
      fromdate +
      "/" +
      todate +
      "/" +
      hspLocationid +
      "/" +
      2
    );
  };
  export const ophotlistingpending = (
    fromdate: string,
    todate: string,
    hspLocationid: number
  ) => {
    return (
      environment.PatientApiUrl +
      "api/patient/getpendinghotlist/" +
      fromdate +
      "/" +
      todate +
      "/" +
      hspLocationid
    );
  };
  export const ophotlistingaccept = (
    fromdate: string,
    todate: string,
    hspLocationid: number
  ) => {
    return (
      environment.PatientApiUrl +
      "api/patient/getapprovedhotlist/" +
      fromdate +
      "/" +
      todate +
      "/" +
      hspLocationid
    );
  };

  export const ophotlistingreject = (
    fromdate: string,
    todate: string,
    hspLocationid: number
  ) => {
    return (
      environment.PatientApiUrl +
      "api/patient/getrejectedhotlist/" +
      fromdate +
      "/" +
      todate +
      "/" +
      hspLocationid
    );
  };

  export const expiredpatientdetail = (
    registrationno: number,
    iacode: string
  ) => {
    return (
      environment.PatientApiUrl +
      "api/patient/getexpiredpatientdetails/" +
      registrationno +
      "/" +
      iacode
    );
  };

  export const deleteexpiredpatientdetail = (
    registrationno: number,
    iacode: string,
    operatorid: number
  ) => {
    return (
      environment.PatientApiUrl +
      "api/patient/deleteexpiredpatientsdetails/64952/SHGN?operatorid=3456"
    );
  };
}
