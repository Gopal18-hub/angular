export class PatientDetails {
  id: number;
  registrationNo: number;
  iaCode: string;
  regDateTime: string;
  regByDeptId: number;
  password: string;
  title: string;
  name: string;
  firstname: string;
  middleName: string;
  lastName: string;
  mothersMaidenName: string;
  fathersname: string;
  isFatherHusband: boolean;
  dateOfBirth: string;
  sex: number;
  maritalStatus: number;
  spouseName: string;
  occupation: number;
  guardian: string;
  grelationship: number;
  gaddress: string;
  gphone: string;
  gcellno: string;
  gemail: string;
  // agetype: number;
  age: number;
  address: string;
  address1: string;
  address2: string;
  address3: string;
  pcity: number;
  pdistrict: number;
  pstate: number;
  pcountry: number;
  ppinCode: number;
  mobile: string;
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
  bplCardNo: string;
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
  identityTypeId: number;
  identityTypeNumber: string;
  olPaymentPatient: number;
  errorDetails: string;
  gender: string;
  maritalStatusName: string;
  ageType: string;
  city: string;
  districtName: string;
  countryName: string;
  stateName: string;
  localityName: string;
  nationalityName: string;
  hotlist: boolean;
  hotlistcomments: string;
  hotlistreason: string;
  image?: string;
  registeredOn?: string;
  registeredOperatorName?: string;
  lastUpdatedOn?: string;
  operatorName?: string;
  constructor(
    id: number,
    registrationNo: number,
    iaCode: string,
    regDateTime: string,
    regByDeptId: number,
    password: string,
    title: string,
    name: string,
    firstname: string,
    middleName: string,
    lastName: string,
    mothersMaidenName: string,
    fathersname: string,
    isFatherHusband: boolean,
    dateOfBirth: string,
    sex: number,
    maritalStatus: number,
    spouseName: string,
    occupation: number,
    guardian: string,
    grelationship: number,
    gaddress: string,
    gphone: string,
    gcellno: string,
    gemail: string,
    // agetype: number,
    age: number,
    address: string,
    address1: string,
    address2: string,
    address3: string,
    pcity: number,
    pdistrict: number,
    pstate: number,
    pcountry: number,
    ppinCode: number,
    mobile: string,
    pphone: string,
    pcellno: string,
    pemail: string,
    ppagerNumber: string,
    religion: number,
    nationality: number,
    caution: boolean,
    passportNo: string,
    issueDate: string,
    expiryDate: string,
    passportIssuedAt: string,
    ccurrency: string,
    referredDocId: number,
    bloodGroup: number,
    otherAllergies: string,
    free: boolean,
    refundRegAmt: boolean,
    vip: boolean,
    billType: number,
    insuranceCompany: string,
    insuranceAddress: string,
    billed: boolean,
    billAmount: number,
    billedBy: number,
    patientType: number,
    educationId: number,
    tokenNo: string,
    reasonForCancellation: string,
    renewalDate: string,
    doctorId: number,
    foreigner: boolean,
    dob: boolean,
    specialisation: number,
    startDatetime: string,
    endDatetime: string,
    operatorId: number,
    deleted: boolean,
    gfax: string,
    isRegCardIssued: boolean,
    regCardIssuedDateTime: string,
    feeReason: string,
    companyId: number,
    hsplocationId: number,
    lastUpdated: string,
    uploaded: number,
    medmaxid: number,
    doctorId1: number,
    ts: string,
    vipreason: string,
    smsrecNo: string,
    caste: number,
    ageflag: boolean,
    locality: number,
    otherlocality: string,
    sourceofinfo: number,
    isnri: boolean,
    dataCleanFlag: boolean,
    isAvailRegCard: boolean,
    ssn: string,
    lastUpdateEmail: string,
    referredBy: string,
    referredPhone: string,
    note: boolean,
    notereason: string,
    marketing1: boolean,
    marketing2: boolean,
    panno: string,
    masterCompanyId: number,
    isCghsverified: number,
    bplCardNo: string,
    addressOnCard: string,
    cghsbeneficiaryCompany: string,
    researchFlag: boolean,
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
    identityTypeNumber: string,
    olPaymentPatient: number,
    errorDetails: string,
    gender: string,
    maritalStatusName: string,
    ageType: string,
    city: string,
    districtName: string,
    countryName: string,
    stateName: string,
    localityName: string,
    nationalityName: string,
    hotlist: boolean,
    hotlistcomments: string,
    hotlistreason: string,
    image?: string,
    registeredOn?: string,
    registeredOperatorName?: string,
    lastUpdatedOn?: string,
    operatorName?: string
  ) {
    this.id = id;
    this.registrationNo = registrationNo;
    this.iaCode = iaCode;
    this.regDateTime = regDateTime;
    this.regByDeptId = regByDeptId;
    this.password = password;
    this.title = title;
    this.name = name;
    this.firstname = firstname;
    this.middleName = middleName;
    this.lastName = lastName;
    this.mothersMaidenName = mothersMaidenName;
    this.fathersname = fathersname;
    this.isFatherHusband = isFatherHusband;
    this.dateOfBirth = dateOfBirth;
    this.sex = sex;
    this.maritalStatus = maritalStatus;
    this.spouseName = spouseName;
    this.occupation = occupation;
    this.guardian = guardian;
    this.grelationship = grelationship;
    this.gaddress = gaddress;
    this.gphone = gphone;
    this.gcellno = gcellno;
    this.gemail = gemail;
    // this.agetype = agetype;
    this.age = age;
    this.address = address;
    this.address1 = address1;
    this.address2 = address2;
    this.address3 = address3;
    this.pcity = pcity;
    this.pdistrict = pdistrict;
    this.pstate = pstate;
    this.pcountry = pcountry;
    this.ppinCode = ppinCode;
    this.mobile = mobile;
    this.pphone = pphone;
    this.pcellno = pcellno;
    this.pemail = pemail;
    this.ppagerNumber = ppagerNumber;
    this.religion = religion;
    this.nationality = nationality;
    this.caution = caution;
    this.passportNo = passportNo;
    this.issueDate = issueDate;
    this.expiryDate = expiryDate;
    this.passportIssuedAt = passportIssuedAt;
    this.ccurrency = ccurrency;
    this.referredDocId = referredDocId;
    this.bloodGroup = bloodGroup;
    this.otherAllergies = otherAllergies;
    this.free = free;
    this.refundRegAmt = refundRegAmt;
    this.vip = vip;
    this.billType = billType;
    this.insuranceCompany = insuranceCompany;
    this.insuranceAddress = insuranceAddress;
    this.billed = billed;
    this.billAmount = billAmount;
    this.billedBy = billedBy;
    this.patientType = patientType;
    this.educationId = educationId;
    this.tokenNo = tokenNo;
    this.reasonForCancellation = reasonForCancellation;
    this.renewalDate = renewalDate;
    this.doctorId = doctorId;
    this.foreigner = foreigner;
    this.dob = dob;
    this.specialisation = specialisation;
    this.startDatetime = startDatetime;
    this.endDatetime = endDatetime;
    this.operatorId = operatorId;
    this.deleted = deleted;
    this.gfax = gfax;
    this.isRegCardIssued = isRegCardIssued;
    this.regCardIssuedDateTime = regCardIssuedDateTime;
    this.feeReason = feeReason;
    this.companyId = companyId;
    this.hsplocationId = hsplocationId;
    this.lastUpdated = lastUpdated;
    this.uploaded = uploaded;
    this.medmaxid = medmaxid;
    this.doctorId1 = doctorId1;
    this.ts = ts;
    this.vipreason = vipreason;
    this.smsrecNo = smsrecNo;
    this.caste = caste;
    this.ageflag = ageflag;
    this.locality = locality;
    this.otherlocality = otherlocality;
    this.sourceofinfo = sourceofinfo;
    this.isnri = isnri;
    this.dataCleanFlag = dataCleanFlag;
    this.isAvailRegCard = isAvailRegCard;
    this.ssn = ssn;
    this.lastUpdateEmail = lastUpdateEmail;
    this.referredBy = referredBy;
    this.referredPhone = referredPhone;
    this.note = note;
    this.notereason = notereason;
    this.marketing1 = marketing1;
    this.marketing2 = marketing2;
    this.panno = panno;
    this.masterCompanyId = masterCompanyId;
    this.isCghsverified = isCghsverified;
    this.bplCardNo = bplCardNo;
    this.addressOnCard = addressOnCard;
    this.cghsbeneficiaryCompany = cghsbeneficiaryCompany;
    this.researchFlag = researchFlag;
    this.adhaarId = adhaarId;
    this.hcfId = hcfId;
    this.landlineno = landlineno;
    this.isOrganDonor = isOrganDonor;
    this.isOtadvanceExculded = isOtadvanceExculded;
    this.isbmtpatient = isbmtpatient;
    this.organisationId = organisationId;
    this.hkid = hkid;
    this.rank = rank;
    this.vesselName = vesselName;
    this.fdpgroup = fdpgroup;
    this.hwc = hwc;
    this.hwcRemarks = hwcRemarks;
    this.identityTypeId = identityTypeId;
    this.identityTypeNumber = identityTypeNumber;
    this.olPaymentPatient = olPaymentPatient;
    this.errorDetails = errorDetails;
    this.gender = gender;
    this.maritalStatusName = maritalStatusName;
    this.ageType = ageType;
    this.city = city;
    this.districtName = districtName;
    this.countryName = countryName;
    this.stateName = stateName;
    this.localityName = localityName;
    this.nationalityName = nationalityName;
    this.hotlist = hotlist;
    this.hotlistcomments = hotlistcomments;
    this.hotlistreason = hotlistreason;
    (this.image = image),
      (this.registeredOn = registeredOn),
      (this.registeredOperatorName = registeredOperatorName),
      (this.lastUpdatedOn = lastUpdatedOn),
      (this.operatorName = operatorName);
  }
}
