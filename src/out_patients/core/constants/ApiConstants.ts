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
      environment.CommonApiUrl + "api/lookup/titlelookup/"+hspLocationid+"/0"
    );
  };
  //OPERATOR WORKING STATION LOCATION, RESPOSE TYPE stationModel NEED TO CANCATINATE $hspLocation IN ENDPOINT
  export const stationLookup = (hspLocationid: number) => {
    environment.CommonApiUrl + "api/lookup/stationlookup/0/${hspLocationid}";
  };

  //PATIENT LOCALITY ON THE INPUT OF PINCODE, RESPONSE TYPE localityByPincode, NEED TO CONCATINATE PINCODE IN ENDPOINT
  export const localityLookUp = (pincode: number) => {
    return (
      environment.CommonApiUrl + "api/lookup/getlocalityonpincode/${pincode}"
    );
  };

  //PATIENT master LOCALITY RESPONSE TYPE localityMasterModel
  export const localityMasterData =
    environment.CommonApiUrl + "api/lookup/getlocality";

  //PATIENT COUNTRY MASTER DATA, RESPONSE TYPE masterCountryModel[]
  export const masterCountryDate =
    environment.CommonApiUrl + "api/lookup/getcountry";

  //PATIENT ADDRESS STATE BY COUNTRY ID, RESPONSE type stateModel[]
  export const stateByCountryId = (countryId: number) => {
    return environment.CommonApiUrl + "api/lookup/getstate/${countryId}";
  };

  //PATIENT ADDRESS STATE BY COUNTRY ID, RESPONSE type stateMasterModel
  export const stateMasterData =
    environment.CommonApiUrl + "api/lookup/getstate";

  //PATIENT ADDRESS CITY BY STATE ID, RESPONSE type commonCityTypeModel[]
  export const cityByStateID = (stateId: number) => {
    return environment.CommonApiUrl + "api/lookup/getcity/${stateId}";
  };

  //PATIENT ADDRESS CITY MASTER MODEL, RESPONSE type commonCityTypeModel[]
  export const cityMasterData =
    environment.CommonApiUrl + "api/lookup/getcity";

  //PATIENT ADDRESS DISTRICT BY STATE ID, RESPONSE type commonDisttModel[]
  export const districtBystateID = (stateId: number) => {
    return environment.CommonApiUrl + "api/lookup/getdistrict/${stateId}";
  };

  //PATIENT ADDRESS DISTRICT BY STATE ID, RESPONSE type commonDisttModel[]
  export const disttMasterData =
    environment.CommonApiUrl + "api/lookup/getdistrict";

  //PATIENT ADDRESS BY CITY ID, RESPONSE type addressByCityIDModel[]
  export const addressByCityID = (cityID: number) => {
    return (
      environment.CommonApiUrl +
      "api/lookup/getlocalitydistrictstatebycity/${cityID}"
    );
  };

  //PATIENT CITY DETAILS BY COUNTYID, RESPONSE type commonCityTypeModel[]
  export const CityDetail = (countryId: number) => {
    return (
      environment.CommonApiUrl + "api/lookup/getcitybycountry/${countryId}"
    );
  };

  //PATIENT onlineserviceList DETAILS BY hspLocationID, RESPONSE type GenernicIdNameModel[]
  export const onlineserviceList = (hspLocationID: number) => {
    return (
      environment.CommonApiUrl +
      "api/lookup/getlistofallonlineservice/${hspLocationID}"
    );
  };

  //PATIENT NATIONALITY  DETAILS FROM MASTER DATA, RESPONSE type GenernicIdNameModel[]
  export const nationalityMasterData =
    environment.CommonApiUrl + "api/lookup/getnationality";

  //PATIENT onlineserviceList DETAILS BY hspLocationID, RESPONSE type GenernicIdNameModel[]
  export const addressByLocalityID = (locationid: number) => {
    return (
      environment.CommonApiUrl +
      "api/lookup/getcitydistrictstatecountryonlocality/${locationid}"
    );
  };

  /* ----------------------------------------------------------------------------------------------------------
    ------------------------------PatientApiUrl ENDPOINTS-------------------------------------------------- 
    ----------------------------------------------------------------------------------------------------------*/

  //PATIENT DETAILS BY REGISTATION NUMBER(MANDATORY) AND IADCODE(MANDATORY) RESPONSE TYPE patientDetailsModel
  export const patientDetails = (registrationno: number, iacode: number) => {
    return (
      environment.PatientApiUrl +
      "api/patient/getpatientbymaxid/${registrationno}/${iacode}"
    );
  };

  //POST PATIENT DETAILS FROM OPD FORM BODY TYPE patientRegistrationModel.Model AND RESPONSE TYPE patientRegistrationModel
  export const postPatientDetails =
    environment.PatientApiUrl + "api/patient/registeropdpatient";

  //get PATIENT hotlisting MAXID,HOTLISTING HEADER AND LOCATION ID IS MANDATORY OTHERS ARE QUERY PARAM, RESPONSE IS STRING ERROR IS ALSO RESPONSE WHEN USER IS ALREADY HOTLISTED BUT IS NOT APPROVED/REJECTED YET
  // RESPONSE --->You have already added a host list comment against this Max ID in "LOCATION NAME",Please Approve OR Reject Then Can Add new Host List Comment"
  export const hotlistedPatient = (
    maxId: number,
    hotlistingHeader: string,
    locationid: string,
    firstName: string,
    lastname: string,
    middleName: string,
    lastName: string,
    hotlistingcomment: string,
    type: string,
    userid: number
  ) => {
    return (
      environment.PatientApiUrl +
      "api/patient/patienthotlisting/${maxId}/${hotlistingHeader}/${locationid}?firstName=${firstName}&middleName=${middleName}&lastName=${lastName}&hotlistingComment==${hotlistingcomment}&type==${type}&userId==${userid}"
    );
  };

  //FOR FETCHING THE DMS DETAILS FOR PATIENT RESPONSE TYPE PatientDMSDetailModel
  export const PatientDMSDetail = (IaCode: string, RegistrationNo: number) => {
    return (
      environment.PatientApiUrl +
      "api/patient/getpatientdmsrefresh/${IaCode}/${RegistrationNo}"
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
  environment.PatientApiUrl +"api/patient/getsimilarsoundpatient";

  //Find Patient API Call 
  export const searchPatientApiDefault= environment.PatientApiUrl+'api/patient/getallpatientssearch';

  //PATIENT TITLE MR/MRS etc.. RESPOSE TYPE sourceOfInfoModel[] NEED TO CANCATINATE $hspLocation/0 IN ENDPOINT
  export const searchPatientApi = (maxId?: string,
    SSN?:string,
    Name?:string,
    PhoneNumber?:string,
    DOB?:string,
    AadhaarId?:string,
    HealthId?:string
    ) => {
    return (
      environment.PatientApiUrl + 'api/patient/getallpatientssearch?MaxId='+maxId+'&SSN='+SSN+'&Name='+Name+'&PhoneNumber='+PhoneNumber+'&DOB='+DOB+'&AadhaarId='+AadhaarId+'&HealthId='+HealthId
    );
  };

  export const mergePatientApi= (ActivePatientId:number, userId:number)=>
  {
    return (
      environment.PatientApiUrl + 'api/patient/patientmerging/'+ActivePatientId+'/'+userId
    );
  };

  export const mergePatientSearchApi= (MaxId:string, SSN:string)=>
  {
    return (
      environment.PatientApiUrl + 'api/patient/getmergepatientsearch?MaxId='+MaxId+'&SSN='+SSN
    );
  };

  export const unmergePatientAPi = (userId:number)=>
  {
    return (
      environment.PatientApiUrl + 'api/patient/patientunmerging/'+userId
    );
  };
    
}
