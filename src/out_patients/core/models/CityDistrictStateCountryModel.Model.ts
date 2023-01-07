export class AddressonCityModel {

    localityId: number;
    locality: string;
    districtId: number;
    districtName: string;
    stateId: number;
    stateName: string;
    pinCode: number;
    cityId: number;
    cityName:string;
    countryid:number;
    countryName:string;


  
    constructor(
        localityId: number,
        locality: string,
        districtId: number,
        districtName: string,
        stateId: number,
        stateName: string,
        pinCode: number,
        cityId: number,
        cityName:string,
        countryid:number,
        countryName:string 
          ) {
    
      this.localityId= localityId,
      this.locality= locality,
      this.districtId= districtId,
      this.districtName= districtName,
      this.stateId= stateId,
      this.stateName= stateName,
      this.pinCode= pinCode,
      this.cityId= cityId,
      this.cityName=cityName,
      this.countryid=countryid
      this.countryName=countryName 
    }
  }
  
