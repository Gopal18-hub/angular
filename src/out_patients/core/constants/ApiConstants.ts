import { environment } from "@environments/environment";

export namespace ApiConstants {
  //PATIENT AGE RESPONSE TYPE ageTypeModel[]
  export const ageTypeLookUp =
    environment.CommonApiUrl + "/api/lookup/agetypelookup/0";

  //PATIENT GENDER RESPONSE TYPE genderModel[]
  export const genderLookUp =
    environment.CommonApiUrl + "api/lookup/genderlookup/0";

  //PATIENT IDENTITY RESPONSE TYPE identityModel[]
  export const identityTypeLookUp =
    environment.CommonApiUrl + "/api/lookup/identitytypelookup/0";

  //PATIENT NATIONALITY RESPONSE TYPE nationalityModel[]
  export const nationalityLookUp =
    environment.CommonApiUrl + "/api/lookup/nationalitylookup/0";

  //PATIENT SOURCE OF INFO RESPONSE TYPE sourceOfInfoModel[]
  export const locationLookup =
    environment.CommonApiUrl + "/api/lookup/sourceofinfolookup/0";

  //PATIENT TITLE MR/MRS etc.. RESPOSE TYPE sourceOfInfoModel[] NEED TO CANCATINATE $hspLocation/0 IN ENDPOINT
  export const titleLookUp = (hspLocationid : number) =>  {
   return environment.CommonApiUrl + "/api/lookup/titlelookup/${hspLocationid}/0";
  }
  //OPERATOR WORKING STATION LOCATION, RESPOSE TYPE stationModel NEED TO CANCATINATE $hspLocation IN ENDPOINT
  export const stationLookup = (hspLocationid : number) =>  {
    environment.CommonApiUrl + "/api/lookup/stationlookup/0/${hspLocationid}";
  }

  //PATIENT LOCALITY ON THE INPUT OF PINCODE, RESPONSE TYPE localityByPincode, NEED TO CONCATINATE PINCODE IN ENDPOINT
  export const localityLookUp = (pincode : number) =>  {
    return environment.CommonApiUrl + "/api/lookup/getlocalityonpincode/${pincode}";
  }

   //PATIENT master LOCALITY RESPONSE TYPE localityMasterModel
   export const localityMasterData = environment.CommonApiUrl + "/api/lookup/getlocality";
  

    //PATIENT COUNTRY MASTER DATA, RESPONSE TYPE masterCountryModel[]
    export const masterCountryDate =
    environment.CommonApiUrl + "/api/lookup/getcountry";

    //PATIENT ADDRESS STATE BY COUNTRY ID, RESPONSE type stateModel[]
    export const stateByCountryId = (countryId : number) =>  {
    return environment.CommonApiUrl +"/api/lookup/getstate/${countryId}";
    }

    //PATIENT ADDRESS STATE BY COUNTRY ID, RESPONSE type stateMasterModel
    export const stateMasterData =  environment.CommonApiUrl +"/api/lookup/getstate";
        

     //PATIENT ADDRESS CITY BY STATE ID, RESPONSE type commonCityTypeModel[]
     export const cityByStateID = (stateId : number) =>  {
       return environment.CommonApiUrl +"/api/lookup/getcity/${stateId}";
     }

     //PATIENT ADDRESS CITY MASTER MODEL, RESPONSE type commonCityTypeModel[]
     export const cityMasterData =  environment.CommonApiUrl +"/api/lookup/getcity";
      
        //PATIENT ADDRESS DISTRICT BY STATE ID, RESPONSE type commonDisttModel[]
     export const districtBystateID = (stateId : number) =>  {
        return environment.CommonApiUrl + "/api/lookup/getdistrict/${stateId}"
     }

      //PATIENT ADDRESS DISTRICT BY STATE ID, RESPONSE type commonDisttModel[]
      export const disttMasterData= environment.CommonApiUrl + "/api/lookup/getdistrict"
     
       //PATIENT ADDRESS BY CITY ID, RESPONSE type addressByCityIDModel[]
  export const addressByCityID = (cityID : number) =>  {
    return environment.CommonApiUrl + "/api/lookup/getlocalitydistrictstatebycity/${cityID}"
  }
     
     //PATIENT CITY DETAILS BY COUNTYID, RESPONSE type commonCityTypeModel[]
  export const CityDetail = (countryId : number) =>  {
    return environment.CommonApiUrl + "/api/lookup/getcitybycountry/${countryId}"
  }

     //PATIENT onlineserviceList DETAILS BY hspLocationID, RESPONSE type GenernicIdNameModel[]
  export const onlineserviceList = (hspLocationID : number) =>  {
  return  environment.CommonApiUrl + "/api/lookup/getlistofallonlineservice/${hspLocationID}"
  }
    
   //PATIENT NATIONALITY  DETAILS FROM MASTER DATA, RESPONSE type GenernicIdNameModel[]
   export const nationalityMasterData = environment.CommonApiUrl + "/api/lookup/getnationality"
    

    //PATIENT onlineserviceList DETAILS BY hspLocationID, RESPONSE type GenernicIdNameModel[]
   export const addressByLocalityID = (locationid  : number) =>  {
    return  environment.CommonApiUrl + "/api/lookup/getcitydistrictstatecountryonlocality/${locationid}"
    }
      


}
