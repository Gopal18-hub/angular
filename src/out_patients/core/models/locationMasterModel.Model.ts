export class LocalityModel{
    id:number;
    localityName:string;
    pincode:string;

    constructor(
        id:number,
        localityName:string,
        pincode:string
        ){
            this.id=id;
            this.localityName=localityName;
            this.pincode=pincode;
    }
}