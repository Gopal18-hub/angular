export class getmergepatientsearch{
    id: number;
    maxid: string;
    ssn: string;
    patientName: string;
    age: string;
    gender: string;
    place: string;
    phone: string;
    date: string;
    dob: string;
    pEmail: string;
    hotList: boolean;
    vip: boolean;
    od: boolean;
    cghs: boolean;
    mergeLinkedMaxId: string;
    mergeLinkedId: string;
    pPagerNumber: string;
    note: boolean;
    noteReason:string;
    firstName: string;
    middleName: string;
    lastName: string;
  
constructor(
    id: number,
    maxid: string,
    ssn: string,
    patientName: string,
    age: string,
    gender: string,
    place: string,
    phone: string,
    date: string,
    dob: string,
    pEmail: string,
    hotList: boolean,
    vip: boolean,
    od: boolean,
    cghs: boolean,
    mergeLinkedMaxId: string,
    mergeLinkedId: string,
    pPagerNumber: string,
    note: boolean,
    noteReason:string,
    firstName: string,
    middleName: string,
    lastName: string,
    
){
    this.id= id;
    this.maxid= maxid;
    this.ssn= ssn;
    this.patientName= patientName;
    this.age= age;
    this.gender= gender;
    this.place= place;
    this.phone= phone;
    this.date=date;
    this.dob= dob;
    this.pEmail= pEmail;
    this.hotList= hotList;
    this.vip= vip;
    this.od= od;
    this.cghs= cghs;
    this.mergeLinkedMaxId= mergeLinkedMaxId;
    this.mergeLinkedId= mergeLinkedId;
    this.pPagerNumber= pPagerNumber;
    this.note= note;
    this.noteReason=noteReason;
    this.firstName=firstName;
    this.middleName= middleName;
    this.lastName=lastName;
}
}