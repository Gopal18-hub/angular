export class PatientSearchModel {
  maxid: string;
  ssn: string;
  patientName: string;
  age: string;
  gender: string;
  completeAddress: string;
  place: string;
  firstName: string;
  lastName: string;
  phone: string;
  date: string;
  dob: string;
  pEmail: string;
  hotList: boolean;
  vip: boolean;
  od: boolean;
  cghs: boolean;
  mergeLinked: string;
  id: number;
  pPagerNumber: string;
  note: boolean;
  noteReason: string;
  notereason: string;
  categoryIcons?: any[];
  fullname?: string;

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
    firstName: string,
    lastName: string,
    id: number,
    pPagerNumber: string,
    note: boolean,
    noteReason: string,
    notereason: string,
    categoryIcons?: any[],
    fullname?: string
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.maxid = maxid;
    this.ssn = ssn;
    this.patientName = patientName;
    this.age = age;
    this.gender = gender;
    this.completeAddress = completeAddress;
    this.place = place;
    this.phone = phone;
    this.date = date;
    this.dob = dob;
    this.pEmail = pEmail;
    this.hotList = hotList;
    this.vip = vip;
    this.od = od;
    this.cghs = cghs;
    this.mergeLinked = mergeLinked;
    this.id = id;
    this.categoryIcons = categoryIcons;
    fullname = firstName + " " + lastName;
    this.fullname = fullname;
    this.pPagerNumber = pPagerNumber;
    this.note = note;
    this.noteReason = noteReason;
    this.notereason = noteReason; //added property to avoid issue while displaying categoryicons
  }
}
