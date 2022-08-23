export interface PatientPersonalDetailInterface{
  getPATIENTDETAILS: DepositPatientDetailInterface[];
  getServiceType: ServiceType[];   
  }
  
  export interface ServiceType{   
      id?: number;
    name?: string;
  }

  export interface DepositPatientDetailInterface{    
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
      nationalityName:string;
      agetypename:string;
      hotList: boolean,
      od: boolean,
      cghs: boolean,
      note: boolean,
      noteReason: string,
      hwc:boolean,
      hwcRemarks:string,
      hotlistreason:string,
      hotlistcomments:string,
      bplCardNo:string,
      addressOnCard:string,
      categoryIcons?: string;     
  }

  export interface  DepositType{
    id?: number;
    advanceType?: string;
    isSecurityDeposit?:number
  };