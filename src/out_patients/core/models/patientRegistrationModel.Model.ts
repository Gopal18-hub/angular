export class patientRegistrationModel{  
  //number while posting
    registrationno: number;
    //abbr. for location need to be sent
    iacode: string;
    //current date time 
    regDateTime: string;
    //need to discuss
    regByDeptId: number;
    //need to discuss
    password: string;
    title: string;
    firstname: string;
    middleName : string;
    lastName: string;
    mothersMaidenName: string;
    fathersname: string;
//for father/husband field if value provided
    isFatherHusband: boolean;
    dateOfBirth : string;
    //id of gender
    sex : number;
    //default number
    maritalStatus : number;
    spouseName: string;
    // number by default else from APIresponse selection
    occupation: number;
    //default sent null
    guardian: string;
    //defualt send number
    grelationship: number;
    gaddress: string;
    gphone: string;
    gcellno: string;
    gemail: string;
    // id from response of API by default number if age is not provided and DOB is provided
    agetype: number;
    age: number;
    address1: string;
    //default empty
       address2: string;
       //default empty
    address3: string;
    //drop down id
    pcity: number;
    //drop down id
    pdistrict: number;
    //drop down id
    pstate: number;
    //drop down id
    pcountry: number;
    //send pin code
    ppinCode: string;

    pphone: string;
    //unknown default empty
    pcellno: string;
    //default empty
    pemail: string;
    //unknown default empty
    ppagerNumber: string;
    //unknown default number
    religion: number;
    //id from API call 
    nationality: number;
    //unknown default false
    caution: boolean;
    passportNo: string;
    issueDate: string|null;
    expiryDate: string|null;
    passportIssuedAt: string;
  
    //unknown default   
    otherAllergies: string;
    //unknown default   
    free: boolean;
    vip: boolean;
    //unknown default number
    educationId: number;
    foreigner: boolean;
    dob: boolean;
    //logged in user's id
    operatorId: number;
    //unknown default   
    feeReason: string; 
    //location id of operator
    hsplocationId: number;
    vipreason: string;
    ageflag: boolean;
    //drop down from api if
    locality: number;
    otherlocality : string;
    //default number
    sourceofinfo : number;
    isnri : boolean;
//always   
    ssn: string;
    //unknown default   
    lastUpdateEmail : string;
    //unknown default   
    referredBy : string;
    //unknown default   
    referredPhone : string;
    note : boolean;
    notereason : string;
    marketing1 : boolean;
    marketing2 : boolean;
    panno : string;
    isCghsverified : number;
    //unknown default   
    bplcardNo : string;
    //unknown default false
    researchFlag : boolean;
    adhaarId : string;
    hcfId : number;
    landlineno : string;
    isOrganDonor : boolean;
    isOtadvanceExculded : boolean;
    hkid : string;
    rank : string;
    vesselName : string;
    fdpgroup : string;
    hwc : boolean;
    hwcRemarks : string;
    identityTypeId : number;
    identityTypeNumber : string;
    //need to share id's by piyush
    olPaymentPatient : number;
     hotlist:boolean;
    hotlistcomments:string;
    hotlistreason:string;
    addressOnCard: string;
  

//   public patient: patientRegistrationModel[];

constructor(
registrationno:number,
iacode: string,
regDateTime: string,
regByDeptId:number,
password: string,
title: string,
firstname: string,
middleName:string  ,
lastName: string,
mothersMaidenName:string ,
fathersname:string ,
isFatherHusband: boolean,
dateOfBirth: string,
sex: number,
maritalStatus: number,
spouseName: string,
occupation:number,
guardian: string,
grelationship:number,
gaddress:string ,
gphone: string,
gcellno:string,
gemail:string ,
agetype: number,
age: number,
address1:string,
address2:string ,
address3:string ,
pcity: number,
pdistrict:number,
pstate: number,
pcountry: number,
ppinCode: string,
pphone: string,
pcellno: string,
pemail: string,
ppagerNumber: string,
religion:number,
nationality: number,
caution: boolean,
passportNo: string,
issueDate: string|null,
expiryDate: string|null,
passportIssuedAt: string,
otherAllergies:string ,
free: boolean,
vip: boolean,
educationId:number,
foreigner: boolean,
dob: boolean,
operatorId: number,
feeReason: string, 
hsplocationId:number,
vipreason: string,
ageflag: boolean,
locality: number,
otherlocality: string,
sourceofinfo: number,
isnri: boolean,
ssn: string,
lastUpdateEmail: string,
referredBy: string,
referredPhone: string,
note: boolean,
notereason: string,
marketing1: boolean,
marketing2: boolean,
panno: string,
isCghsverified: number,
bplcardNo: string,
researchFlag: boolean,
adhaarId: string,
hcfId: number,
landlineno: string,
isOrganDonor: boolean,
isOtadvanceExculded: boolean, 
hkid: string,
rank: string,
vesselName: string,
fdpgroup: string,
hwc: boolean,
hwcRemarks: string,
identityTypeId: number,
identityTypeNumber: string,
olPaymentPatient: number,
addressOnCard:string,
hotlist:boolean,
    hotlistcomments:string,
    hotlistreason:string
  
)
{
  this.registrationno=registrationno;
this.iacode=iacode;
this.regDateTime=regDateTime;
this.regByDeptId=regByDeptId;
this.password=password;
this.title=title;
this.firstname=firstname;
this.middleName=middleName;
this.lastName=lastName;
this.mothersMaidenName=mothersMaidenName;
this.fathersname=fathersname;
this.isFatherHusband=isFatherHusband;
this.dateOfBirth=dateOfBirth;
this.sex=sex;
this.maritalStatus=maritalStatus;
this.spouseName=spouseName;
this.occupation=occupation;
this.guardian=guardian;
this.grelationship=grelationship;
this.gaddress=gaddress;
this.gphone=gphone;
this.gcellno=gcellno;
this.gemail=gemail;
this.agetype=agetype;
this.age=age;
this.address1=address1;
this.address2=address2;
this.address3=address3;
this.pcity=pcity;
this.pdistrict=pdistrict;
this.pstate=pstate;
this.pcountry=pcountry;
this.ppinCode=ppinCode;
this.pphone=pphone;
this.pcellno=pcellno;
this.pemail=pemail;
this.ppagerNumber=ppagerNumber;
this.religion=religion;
this.nationality=nationality;
this.caution=caution;
this.passportNo=passportNo;
this.issueDate=issueDate;
this.expiryDate=expiryDate;
this.passportIssuedAt=passportIssuedAt;
this.otherAllergies=otherAllergies;
this.free=free;
this.vip=vip;
this.educationId=educationId;
this.foreigner=foreigner;
this.dob=dob;
this.operatorId=operatorId;
this.feeReason=feeReason;
this.hsplocationId=hsplocationId;
this.vipreason=vipreason;
this.ageflag=ageflag;
this.locality=locality;
this.otherlocality=otherlocality;
this.sourceofinfo=sourceofinfo;
this.isnri=isnri;
this.ssn=ssn;
this.lastUpdateEmail=lastUpdateEmail;
this.referredBy=referredBy;
this.referredPhone=referredPhone;
this.note=note;
this.notereason=notereason;
this.marketing1=marketing1;
this.marketing2=marketing2;
this.panno=panno;
this.isCghsverified=isCghsverified;
this.bplcardNo=bplcardNo;
this.researchFlag=researchFlag;
this.adhaarId=adhaarId;
this.hcfId=hcfId;
this.landlineno=landlineno;
this.isOrganDonor=isOrganDonor;
this.isOtadvanceExculded=isOtadvanceExculded;
this.hkid=hkid;
this.rank=rank;
this.vesselName=vesselName;
this.fdpgroup=fdpgroup;
this.hwc=hwc;
this.hwcRemarks=hwcRemarks;
this.identityTypeId=identityTypeId;
this.identityTypeNumber=identityTypeNumber;
this.olPaymentPatient=olPaymentPatient;
this.addressOnCard=addressOnCard;
this.hotlist = hotlist;
this.hotlistcomments = hotlistcomments;
this.hotlistreason = hotlistreason;
  
}


    //  // ccurrency:string;
    // id : number
    //  referredDocId : number;
    //  bloodGroup : number;
    //  refundRegAmt : boolean;
    //  billType : number;
    //  insuranceCompany :  string ;
    //  insuranceAddress :  string ;
    //  billed : boolean;
    //  billAmount : number;
    //  billedBy : number;
    //  patientType : number;
    //  tokenNo :  string ;
    //  reasonForCancellation :  string ;
    //  renewalDate :  string ;
    //  doctorId : number;
    //  specialisation : number;
    //  startDatetime : string ;
    //  endDatetime :  string ;
    //  deleted : boolean;
    //  gfax :  string ;
    //  isRegCardIssued : boolean;
    //  regCardIssuedDateTime :  string ;
    //  companyId : number;
    //  lastUpdated :  Date ;
    //  uploaded : number;
    //  medmaxid : number;
    //  doctorId1 : number;
    //  ts :  string ;
    //  smsrecNo :  string ;
    //  caste : number;
    //  dataCleanFlag : boolean;
    //  isAvailRegCard : boolean;
    //  masterCompanyId : number;
    //  addressOnCard :  string ;
    //  cghsbeneficiaryCompany :  string ;
    //  isbmtpatient : number;
    //  organisationId : number;
    //  errorDetails :string ;

}
