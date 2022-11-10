

export class UpdatepatientModel{  
    id: number;
    registrationno: number;
    iacode: string;
    regDateTime: string;
    mothersMaidenName: string;
    fathersname:string;
    dateOfBirth:string;
    maritalStatus: number;
    spouseName: string;
    occupation: number;
    guardian: string;
    grelationship: number;
    gaddress: string;
    agetype: number;
    age: number;
    address1: string;
    address2: string;
    address3: string;
    pcity: number;
    pdistrict: number;
    pstate: number;
    pcountry: number;
    ppinCode: string;
    ppagerNumber: string;
    religion: number;
    otherAllergies: string;
    free: boolean;
    vip: boolean;
    educationId: number;
    dob: boolean;
    startDatetime: string;
    endDatetime: string;
    operatorId: number;
    deleted: boolean;
    isRegCardIssued: boolean;
    regCardIssuedDateTime: string;
    feeReason: string;
    companyId: number;
    hsplocationId: number;
    lastUpdated: string;
    vipreason: string;
    ageflag: boolean;
    locality: number;
    otherlocality: string;
    sourceofinfo: number;
    isnri: boolean;
    dataCleanFlag: boolean;
    isAvailRegCard: boolean;
    ssn: string;
    referredBy: string;
    referredPhone: string;
    note: boolean;
    notereason: string;
    marketing1: boolean;
    marketing2: boolean;
    isCghsverified: number;
    bplcardNo: string;
    addressOnCard: string;
    cghsbeneficiaryCompany: string;
    adhaarId: string;
    hcfId: number;
    landlineno: string;
    isOrganDonor: boolean;
    isOtadvanceExculded: boolean;
    isbmtpatient: number;
    organisationId: number;
    hkid: string;
    rank: string;
    vesselName: string;
    fdpgroup: string;
    hwc: boolean;
    hwcRemarks: string;
    identityTypeId: number;
    identityTypeNumber: string;
    

 
constructor(
id:number,
registrationno:number,
iacode: string,
regDateTime: string,
mothersMaidenName:string,
fathersname:string,
isFatherHusband:boolean,
dateOfBirth:string,
maritalStatus:number,
spouseName:string,
occupation:number,
guardian:string,
grelationship:number,
gaddress:string,
agetype:number,
age:number,
address1:string,
address2:string,
address3:string,
pcity:number,
pdistrict:number,
pstate: number,
pcountry: number,
ppinCode: string,
ppagerNumber: string,
religion: number,
otherAllergies:string,
free: boolean,
vip: boolean,
educationId: number,
dob: boolean,
startDatetime: string,
endDatetime : string,
operatorId: number,
deleted:boolean,
isRegCardIssued: boolean,
regCardIssuedDateTime: string,
feeReason: string,
companyId: number,
hsplocationId: number,
lastUpdated: string,
vipreason: string,
ageflag: boolean,
locality: number,
otherlocality: string,
sourceofinfo: number,
isnri: boolean,
dataCleanFlag: boolean,
isAvailRegCard: boolean,
ssn: string,
referredBy: string,
referredPhone: string,
note: boolean,
notereason: string,
marketing1: boolean,
marketing2: boolean,
isCghsverified: number,
bplcardNo: string,
addressOnCard: string,
cghsbeneficiaryCompany: string,
adhaarId: string,
hcfId: number,
landlineno: string,
isOrganDonor: boolean,
isOtadvanceExculded: boolean,
isbmtpatient: number,
organisationId: number,
hkid: string,
rank: string,
vesselName: string,
fdpgroup: string,
hwc: boolean,
hwcRemarks: string,
identityTypeId: number,
identityTypeNumber: string





)
{
   this.id=id;
   this.registrationno=registrationno;
   this.iacode= iacode;
   this.regDateTime=regDateTime ;
   this.mothersMaidenName=mothersMaidenName;
   this.fathersname=fathersname;
   this.dateOfBirth=dateOfBirth;
   this.maritalStatus=maritalStatus;
   this.spouseName=spouseName;
   this.occupation=occupation;
   this.guardian=guardian;
   this.grelationship=grelationship;
   this.gaddress=gaddress;
   this.agetype=agetype;
   this.age=age;
   this.address1=address1;
   this.address2=address2;
   this.address3=address3;
   this.pcity=pcity;
   this.pdistrict=pdistrict;
   this.pstate= pstate;
   this.pcountry= pcountry;
   this.ppinCode= ppinCode;
   this.ppagerNumber= ppagerNumber;
   this.religion= religion;
   this.otherAllergies=otherAllergies;
   this.free= free;
   this.vip= vip;
   this.educationId= educationId;
   this.dob= dob;
   this.startDatetime= startDatetime;
   this.endDatetime = endDatetime;
   this.operatorId= operatorId;
   this.deleted=deleted;
   this.isRegCardIssued= isRegCardIssued;
   this.regCardIssuedDateTime= regCardIssuedDateTime;
   this.feeReason= feeReason;
   this.companyId= companyId;
   this.hsplocationId= hsplocationId;
   this.lastUpdated= lastUpdated;
   this.vipreason= vipreason;
   this.ageflag= ageflag;
   this.locality= locality;
   this.otherlocality= otherlocality;
   this.sourceofinfo= sourceofinfo;
   this.isnri= isnri;
   this.dataCleanFlag= dataCleanFlag;
   this.isAvailRegCard= isAvailRegCard;
   this.ssn= ssn;
   this.referredBy= referredBy;
   this.referredPhone= referredPhone;
   this.note= note;
   this.notereason= notereason;
   this.marketing1= marketing1;
   this.marketing2= marketing2;
   this.isCghsverified= isCghsverified;
   this.bplcardNo= bplcardNo;
   this.addressOnCard= addressOnCard;
   this.cghsbeneficiaryCompany= cghsbeneficiaryCompany;
   this.adhaarId= adhaarId;
   this.hcfId= hcfId;
   this.landlineno= landlineno;
   this.isOrganDonor= isOrganDonor;
   this.isOtadvanceExculded= isOtadvanceExculded;
   this.isbmtpatient= isbmtpatient;
   this.organisationId= organisationId;
   this.hkid= hkid;
   this.rank= rank;
   this.vesselName= vesselName;
   this.fdpgroup= fdpgroup;
   this.hwc= hwc;
   this.hwcRemarks= hwcRemarks;
   this.identityTypeId= identityTypeId;
   this.identityTypeNumber= identityTypeNumber;
      
}
}
