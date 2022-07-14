export class PatientPersonalDetails{
    registrationno: number;
    iacode: string;
    regdatetime: string;
    isregcardissued: number;
    freereason: string;
    title: string;
    firstname: string;
    middlename: string;
    lastname: string;
    mothersMaidenName: string;
    fathersname: string;
    age: number;
    agetype: number;
    sex: string;
    maritalstatus: number;
    vip: number;
    foreigner: number;
    passporTnO: string;
    passportIssuedAt: string;
    issueDate: string;
    expiryDate: string;
    address1: string;
    address2: string;
    address3: string;
    dateOfBirth: string;
    pPincode: string;
    pPhone: string;
    pPagerNumber: string;
    pcellno: string;
    pEMail: string;
    isfatherHusband: string;
    city: string;
    district: string;
    state: string;
    country: string;
    vipreason: string;
    religion: string;
    occupation: string;
    educationid: string;
    ageflag: number;
    ssn: string;
    paNno: string;

  constructor(
    registrationno: number,
    iacode: string,
    regdatetime: string,
    isregcardissued: number,
    freereason: string,
    title: string,
    firstname: string,
    middlename: string,
    lastname: string,
    mothersMaidenName: string,
    fathersname: string,
    age: number,
    agetype: number,
    sex: string,
    maritalstatus: number,
    vip: number,
    foreigner: number,
    passporTnO: string,
    passportIssuedAt: string,
    issueDate: string,
    expiryDate: string,
    address1: string,
    address2: string,
    address3: string,
    dateOfBirth: string,
    pPincode: string,
    pPhone: string,
    pPagerNumber: string,
    pcellno: string,
    pEMail: string,
    isfatherHusband: string,
    city: string,
    district: string,
    state: string,
    country: string,
    vipreason: string,
    religion: string,
    occupation: string,
    educationid: string,
    ageflag: number,
    ssn: string,
    paNno: string
  )
  {
      this.registrationno = registrationno;
      this.iacode = iacode;
      this.regdatetime = regdatetime;
      this.isregcardissued = isregcardissued;
      this.freereason=freereason;
      this.title = title;
      this.firstname = firstname;
      this.middlename = middlename;
      this.lastname = lastname;
      this.mothersMaidenName = mothersMaidenName;
      this.fathersname = fathersname;
      this.age = age;
      this.agetype = agetype;
      this.sex = sex;
      this.maritalstatus=  maritalstatus;
      this.vip = vip;
      this.foreigner = foreigner;
      this.passporTnO = passporTnO;
      this.passportIssuedAt = passportIssuedAt;
      this.issueDate = issueDate;
      this.expiryDate = expiryDate;
      this.address1 = address1;
      this.address2 = address2;
      this.address3 = address3;
      this.dateOfBirth = dateOfBirth;
      this.pPincode = pPincode;
      this.pPhone = pPhone;
      this.pPagerNumber = pPagerNumber;
      this.pcellno = pcellno;
      this.pEMail = pEMail;
      this.isfatherHusband = isfatherHusband;
      this.city = city;
      this.district = district;
      this.state = state;
      this.country = country;
      this.vipreason = vipreason;
      this.religion = religion;
      this.occupation = occupation;
      this.educationid = educationid;
      this.ageflag = ageflag;
      this.ssn = ssn;
      this.paNno = paNno;    
  }
  }