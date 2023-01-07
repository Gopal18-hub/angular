export class AppointmentSearchModel {
    id:string;
    title: string;
    firstName : string;
    lastName : string;
    doctorName : string;
    registeredDateTime :  string;
    nationality: string;
    country: string;
    state: string;
    city: string;
    houseNo: string;


  
    constructor(
        id:string,
        title: string,
        firstName : string,
        lastName : string,
        doctorName : string,
        registeredDateTime :  string,
        nationality: string,
        country: string,
        state: string,
        city: string,
        houseNo: string,
          ) {
    
    this.id = id;
    this.title = title;
    this.firstName = firstName;
    this.lastName =lastName;
    this.doctorName = doctorName;
    this.registeredDateTime = registeredDateTime;
    this.nationality= nationality;
    this.country= country;
    this.state = state;
    this.city = city;
    this.houseNo = houseNo
  }
}
