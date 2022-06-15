export class PatientSearchModel{
   
    maxid: string;
    ssn: string;
    patientName: string;
    age: string;
    gender: string;
    completeAddress: string;
    place: string;
    firstName:string;
    lastName:string;
    phone: string;
    date: string;
    dob: string;
    pEmail: string;
    hotList: boolean;
    vip: boolean;
    od: boolean;
    cghs: boolean;
    mergeLinked: string;
    id:number;
    categoryIcons?:any[];
    constructor(
        
        maxid: string,
        ssn: string,
        patientName: string,
        age: string,
        gender: string,
        completeAddress: string,
        place: string,
        phone: string,
        date: string,
        dob: string,
        pEmail: string,
        hotList: boolean,
        vip: boolean,
        od: boolean,
        cghs: boolean,
        mergeLinked: string,
        firstName:string,
    lastName:string,
    id:number,
    categoryIcons?:any[])
    {
        this.firstName=firstName;
   this.lastName= lastName;
       this.maxid= maxid;
       this.ssn= ssn;
       this.patientName= patientName;
       this.age= age;
       this.gender= gender;
       this.completeAddress= completeAddress;
       this.place= place;
       this.phone= phone;
       this.date= date;
       this.dob= dob;
       this.pEmail= pEmail;
       this.hotList= hotList;
       this.vip= vip;
       this.od= od;
       this.cghs= cghs;
       this.mergeLinked= mergeLinked;
       this.id=id;
       this.categoryIcons = categoryIcons;
    }
}