export class AddressonLocalityModel{
    
    localityId: number;
    locality: string;
    cityId: number;
    cityName: string;
    districtId: number;
    districtName: string;
    stateId: number;
    stateName: string;
    countryid: number;
    countryName: string;
    pinCode: number;

    constructor(
        localityId: number,
        locality: string,
        cityId: number,
        cityName: string,
        districtId: number,
        districtName: string,
        stateId: number,
        stateName: string,
        countryid: number,
        countryName: string,
        pinCode: number,
    ){
 
        this.localityId= localityId;
        this.locality= locality;
        this.cityId= cityId;
        this.cityName= cityName;
        this.districtId= districtId;
        this.districtName= districtName;
        this.stateId= stateId;
        this.stateName= stateName;
        this.countryid= countryid;
        this.countryName= countryName;
        this.pinCode= pinCode;
    }
}