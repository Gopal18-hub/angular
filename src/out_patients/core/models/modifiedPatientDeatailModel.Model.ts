export class ModifiedPatientDetailModel{  
    id: number;
    regDateTime: string;
    regByDeptId: number;
    password: string;
    maritalStatus: number;
    spouseName: string;
    occupation: number;
    guardian: string;
    grelationship: number;
    gaddress: string;
    gphone: string;
    gcellno: string;
    gemail: string;
    agetype: number;
    age: number;
    address1: string;
    address2: string;
    address3: string;
    pcity: number;
    pdistrict: number;
    pstate: number;
    pcountry: number;
    ppinCode: number;
    pphone: string;
    pcellno: string;
    pemail: string;
    ppagerNumber: string;
    religion: number;
    nationality: number;
    caution: boolean;
    passportNo: string;
    issueDate: string;
    expiryDate: string;
    passportIssuedAt: string;
    ccurrency: string;
    referredDocId: number;
    bloodGroup: number;
    otherAllergies: string;
    free: boolean;
    refundRegAmt: boolean;
    vip: boolean;
    billType: number;
    insuranceCompany: string;
    insuranceAddress: string;
    billed: boolean;
    billAmount: number;
    billedBy: number;
    patientType: number;
    educationId: number;
    tokenNo: string;
    reasonForCancellation: string;
    renewalDate: string;
    doctorId: number;
    foreigner: boolean;
    dob: boolean;
    specialisation: number;
    startDatetime: string;
    endDatetime: string;
    operatorId: number;
    deleted: boolean;
    gfax: string;
    isRegCardIssued: boolean;
    regCardIssuedDateTime: string;
    feeReason: string;
    companyId: number;
    hsplocationId: number;
    lastUpdated: string;
    uploaded: number;
    medmaxid: number;
    doctorId1: number;
    ts: string;
    vipreason: string;
    smsrecNo: string;
    caste: number;
    ageflag: boolean;
    locality: number;
    otherlocality: string;
    sourceofinfo: number;
    isnri: boolean;
    dataCleanFlag: boolean;
    isAvailRegCard: boolean;
    ssn: string;
    lastUpdateEmail: string;
    referredBy: string;
    referredPhone: string;
    note: boolean;
    notereason: string;
    marketing1: boolean;
    marketing2: boolean;
    panno: string;
    masterCompanyId: number;
    isCghsverified: number;
    bplcardNo: string;
    addressOnCard: string;
    cghsbeneficiaryCompany: string;
    researchFlag: boolean;
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
    identityId: number;
    identityTypeNumber: string;
    olPaymentPatient: number;
    errorDetails: string;
    sexName: string;
    maritalStatusName: string;
    ageTypeName: string;
    city: string;
    districtName: string;
    countryName: string;
    stateName: string;
    localityName: string;
    nationalityName: string;   
    mothersMaidenName: string;
    fathersname:string;
    isFatherHusband: boolean;
    dateOfBirth:string;
    iacode: string;
    registrationno: number;
    title: string;
    firstname: string;
    middleName: string;
    lastName: string;   
    sex: number;    
    hotlist:boolean;
    hotlistcomments:string;
    hotlistreason:string;
 
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
    issueDate: string,
    expiryDate: string,
    passportIssuedAt: string,
    operatorId: number,
    hsplocationId: number,
    researchFlag: boolean,
    smsrecNo: string,
    hotlist:boolean,
    hotlistcomments:string,
    hotlistreason:string

)
{
    this.registrationno= registrationno;
    this.iacode= iacode;
    this.title= title;
    this.firstname= firstname;
    this.middleName= middleName;
    this.lastName= lastName;
    this.sex= sex;
    this.pphone= pphone;
    this.pcellno= pcellno;
    this.pemail= pemail;
    this.nationality= nationality;
    this.foreigner= foreigner;
    this.passportNo= passportNo;
    this.issueDate= issueDate;
    this.expiryDate= expiryDate;
    this.passportIssuedAt= passportIssuedAt;
    this.operatorId= operatorId;
    this.hsplocationId= hsplocationId;
    this.researchFlag= researchFlag;
    this.smsrecNo= smsrecNo;    
    this.hotlist=hotlist;
    this.hotlistcomments = hotlistcomments;
    this.hotlistreason = hotlistreason;
}
}
