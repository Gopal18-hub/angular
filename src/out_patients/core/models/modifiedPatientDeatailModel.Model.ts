export class ModifiedPatientDetailModel {
  pphone: string;
  pcellno: string;
  pemail: string;
  nationality: number;
  passportNo: string;
  issueDate: string | null;
  expiryDate: string | null;
  passportIssuedAt: string;

  foreigner: boolean;

  operatorId: number;
  hsplocationId: number;
  researchFlag: boolean;

  iacode: string;
  registrationno: number;
  title: string;
  firstname: string;
  middleName: string;
  lastName: string;
  sex: number;
  hotlist: boolean;
  hotlistcomments: string;
  hotlistreason: string;
  smsrecNo: string;
  dateOfBirth: string | null;
  age: number;
  agetype: number;
  ageTypeName: string;

  constructor(
    registrationno: number,
    iacode: string,
    title: string,
    firstname: string,
    middleName: string,
    lastName: string,
    sex: number,
    pphone: string,
    pcellno: string,
    pemail: string,
    nationality: number,
    foreigner: boolean,
    passportNo: string,
    issueDate: string | null,
    expiryDate: string | null,
    passportIssuedAt: string,
    operatorId: number,
    hsplocationId: number,
    researchFlag: boolean,
    smsrecNo: string,
    hotlist: boolean,
    hotlistcomments: string,
    hotlistreason: string,
    dateOfBirth: string | null,
    age: number,
    agetype: number,
    ageTypeName: string
  ) {
    this.registrationno = registrationno;
    this.iacode = iacode;
    this.title = title;
    this.firstname = firstname;
    this.middleName = middleName;
    this.lastName = lastName;
    this.sex = sex;
    this.pphone = pphone;
    this.pcellno = pcellno;
    this.pemail = pemail;
    this.nationality = nationality;
    this.foreigner = foreigner;
    this.passportNo = passportNo;
    this.issueDate = issueDate;
    this.expiryDate = expiryDate;
    this.passportIssuedAt = passportIssuedAt;
    this.operatorId = operatorId;
    this.hsplocationId = hsplocationId;
    this.researchFlag = researchFlag;
    this.smsrecNo = smsrecNo;
    this.hotlist = hotlist;
    this.hotlistcomments = hotlistcomments;
    this.hotlistreason = hotlistreason;
    this.dateOfBirth = dateOfBirth;
    this.age = age;
    this.agetype = agetype;
    this.ageTypeName = ageTypeName;
  }
}
