import { environment } from "@environments/environment";

export namespace BillingApiConstants {
  export const getcompanydetail = (locationId: number) => {
    return `${environment.CommonApiUrl}api/lookup/getcompanydetail/${locationId}`;
  };

  export const getopcompanyiomlocationwise = (
    locationId: number,
    companyId: number
  ) => {
    return `${environment.PatientApiUrl}api/patient/getopcompanyiomlocationwise/${locationId}/${companyId}`;
  };

  export const getsimilarsoundopbilling = (
    IACode: string,
    RegistrationNo: number
  ) => {
    return `${environment.BillingApiUrl}api/outpatientbilling/getsimilarsoundopbilling/${RegistrationNo}/${IACode}`;
  };

  export const getclinics = (locationId: number) => {
    return `${environment.CommonApiUrl}api/lookup/getclinics/${locationId}`;
  };

  export const getspecialization = `${environment.PatientApiUrl}api/patient/getspecialization`;

  export const getbillingdoctorsonsearch = (
    doctorName: string,
    locationId: number
  ) => {
    return `${environment.BillingApiUrl}api/outpatientbilling/getbillingdoctorsonsearch${doctorName}/${locationId}`;
  };

  export const getdoctorlistonSpecializationClinic = (
    isClinic: boolean,
    clinicSpecializationId: number,
    locationId: number
  ) => {
    return `${environment.BillingApiUrl}api/outpatientbilling/getdoctorlistonSpecializationClinic/${isClinic}/${clinicSpecializationId}/${locationId}`;
  };

  ////GAV-1381
  export const getDoctorsonSpecialization = (
    specializationId: number,
    locationId: number
  ) => {
    return `${environment.BillingApiUrl}api/outpatientbilling/getdoctorlistonspecialization/${specializationId}/${locationId}`;
  };

  export const getinvestigationfromphysician = (
    IACode: string,
    RegistrationNo: number,
    locationId: string
  ) => {
    return `${environment.BillingApiUrl}api/outpatientbilling/getinvestigationfromphysician/${IACode}/${RegistrationNo}/${locationId}`;
  };

  export const getPrice = (
    priorityId: number,
    itemId: number,
    serviceId: number,
    hspLocationid: string
  ) => {
    return (
      environment.BillingApiUrl +
      "api/outpatientbilling/getpriceforitemwithtariffid/" +
      priorityId +
      "/" +
      itemId +
      "/" +
      serviceId +
      "/" +
      hspLocationid
    );
    // return `${environment.BillingApiUrl}api/outpatientbilling/getpriceforitemwithtariffid/${priorityId}/${itemId}/${serviceId}/${hspLocationid}`;
  };

  export const getcalculateopbill = `${environment.BillingApiUrl}api/outpatientbilling/getcalculateopbill`;

  export const getPriceBulk = (
    hspLocationid: string,
    companyId: number = 0
  ) => {
    return `${environment.BillingApiUrl}api/outpatientbilling/getcalculateopbillformultiple/${companyId}/${hspLocationid}?IPOPTYPE=1&BedType=0`;
  };

  export const consultationTypes = `${environment.CommonApiUrl}api/lookup/getconsultationtype`;

  export const getInvetigationPriorities = `${environment.CommonApiUrl}api/lookup/getinvestigationpriority`;

  export const getinvestigationservice = `${environment.CommonApiUrl}api/lookup/getinvestigationservice`;

  export const getinvestigation = (locationId: number, serviceId: number) => {
    return `${environment.CommonApiUrl}api/lookup/getinvestigation/${locationId}/${serviceId}`;
  };

  export const getinvestigationSearch = (
    locationId: number,
    searchKey: string
  ) => {
    return `${environment.CommonApiUrl}api/lookup/getinvestigationonsearch/${locationId}/${searchKey}`;
  };

  export const gethealthcheckups = (locationId: number, departmentID: any) => {
    return `${environment.CommonApiUrl}api/lookup/gethealthcheckups/${locationId}/${departmentID}`;
  };
  export const getotherservice = `${environment.CommonApiUrl}api/lookup/getotherservice`;

  export const getotherserviceop = (locationId: number) => {
    return `${environment.CommonApiUrl}api/lookup/getotherserviceforop/${locationId}`;
  };

  export const getotherservicebilling = (
    locationId: number,
    servicingId: number,
    isBundle = 0
  ) => {
    return `${environment.CommonApiUrl}api/lookup/getotherservicebilling/${locationId}/${servicingId}/${isBundle}`;
  };

  export const getotherservicebillingSearch = (
    locationId: number,
    searchKey: string
  ) => {
    return `${environment.CommonApiUrl}api/lookup/getotherservicebillingonsearch/${locationId}/${searchKey}`;
  };

  export const gethealthcheckupsonsearch = (
    locationId: number,
    searchKey: string
  ) => {
    return `${environment.CommonApiUrl}api/lookup/gethealthcheckupsonsearch/${locationId}/${searchKey}`;
  };

  export const departmentlookup = `${environment.CommonApiUrl}api/lookup/departmentlookup`;

  export const getOrderSet = (locationId: number) =>
    `${environment.BillingApiUrl}api/outpatientbilling/getordersetforbilling/${locationId}`;

  export const consumableData = (
    IACode: string,
    RegistrationNo: number,
    locationId: string
  ) =>
    `${environment.BillingApiUrl}api/outpatientbilling/getdetailsforthepatientforsurgery/${IACode}/${RegistrationNo}/${locationId}`;

  export const checkpriceforzeroitemid = (
    itemCode: string,
    locationId: string,
    type: string
  ) =>
    `${environment.BillingApiUrl}api/outpatientbilling/checkpriceforzeroitemid/${itemCode}/${locationId}/${type}`;

  export const getotherplanretrieve = (
    IACode: string,
    RegistrationNo: number,
    planId: string
  ) =>
    `${environment.BillingApiUrl}api/outpatientbilling/getotherplanretrieve/${planId}/${RegistrationNo}/${IACode}`;

  export const getselectedhappyfamilyplandetail = (
    IACode: string,
    RegistrationNo: number,
    planId: string,
    locationId: string
  ) =>
    `${environment.BillingApiUrl}api/outpatientbilling/getselectedhappyfamilyplandetail/${RegistrationNo}/${IACode}/${planId}/${locationId}`;

  export const getforonlinebilldetails = (
    IACode: string,
    RegistrationNo: number,
    locationId: string
  ) =>
    `${environment.BillingApiUrl}api/outpatientbilling/getforonlinebilldetails/${RegistrationNo}/${IACode}/${locationId}`;

  export const getforegexpiredpatientdetails = (
    IACode: string,
    RegistrationNo: number,
    fromTime?: string,
    toTime?: string,
    locationID?: string
  ) =>
    `${environment.BillingApiUrl}api/outpatientbilling/getforegexpiredpatientdetails/${RegistrationNo}/${IACode}`;

  export const getunorderedpatientvisits = (
    IACode: string,
    RegistrationNo: number
  ) =>
    `${environment.BillingApiUrl}api/outpatientbilling/getunorderedpatientvisits/${RegistrationNo}/${IACode}`;

  export const gethisdecommissionconfigurationvalue = (
    decommissionType: string,
    locationId: string
  ) =>
    `${environment.BillingApiUrl}api/outpatientbilling/getunorderedpatientvisits/${decommissionType}/${locationId}`;

  export const isopdoctorinbulk = (DoctorsId: string, HsplocationId: string) =>
    `${environment.BillingApiUrl}api/outpatientbilling/isopdoctorinbulk/${DoctorsId}/${HsplocationId}`;

  export const dmgList = (
    IACode: string,
    RegistrationNo: number,
    locationId: string,
    doctorId: number
  ) =>
    `${environment.BillingApiUrl}api/outpatientbilling/getlastgroupdoctorselected/${IACode}/${RegistrationNo}/${locationId}/${doctorId}`;

  export const getediganosticacdoninvestigationgrid = (
    locationid: string,
    orderId: number,
    RegistrationNo: number,
    IACode: string,
    itemIds: any
  ) =>
    `${environment.PatientApiUrl}api/patient/getediganosticacdoninvestigationgrid/${locationid}/${orderId}/${RegistrationNo}/${IACode}?ItemIds=${itemIds}`;

  export const checkPatientSex = (
    testId: string,
    gender: string,
    serviceId: string,
    type: string
  ) =>
    `${environment.BillingApiUrl}api/outpatientbilling/checkPatientSex/${testId}/${gender}/${serviceId}/${type}`;

  export const getHealthCheckupdetails = (hcuid: string, serviceid: string) =>
    `${environment.BillingApiUrl}api/outpatientbilling/getHealthCheckupdetails/${hcuid}/${serviceid}`;

  export const insert_billdetailsgst = () =>
    `${environment.BillingApiUrl}api/outpatientbilling/insert_billdetailsgst`;

  export const opConsumableBillCreate = () =>
    `${environment.BillingApiUrl}api/outpatientbilling/OPConsumableBillCreate`;

  export const getbillingappointmentsearch = (
    phoneNo: string,
    name: string,
    lastname: string,
    datevalidation: boolean,
    fromdate: string,
    todate: string,
    bookingNo: string,
    locationId: string
  ) => {
    return (
      environment.PatientApiUrl +
      `api/patient/getbillingappointmentsearch/${locationId}?phone=` +
      phoneNo +
      "&patientName=" +
      name +
      "&IsDateRange=" +
      datevalidation +
      "&fromDate=" +
      fromdate +
      "&toDate=" +
      todate +
      "&BookingNo=" +
      bookingNo
    );
  };

  export const SaveDeleteOpOrderRequest = `${environment.BillingApiUrl}api/outpatientbilling/saveanddeleteoporderrequest`;
  export const checkModality = (procedureid: number) =>
    `${environment.BillingApiUrl}api/outpatientbilling/checkitemmodality/${procedureid}`;
  export const checkServiceTax = (testid: number, serviceid: number) =>
    `${environment.BillingApiUrl}api/outpatientbilling/checkservicetax/${testid}/${serviceid}`;
  export const checkPatientSexoporder = (
    testId: string,
    gender: string,
    serviceId: number,
    type: string
  ) =>
    `${environment.BillingApiUrl}api/outpatientbilling/checkPatientSex/${testId}/${gender}/${serviceId}/${type}`;

  export const checkoutsourcetest = (companyId: string) =>
    `${environment.BillingApiUrl}api/outpatientbilling/checkoutsourcetest/${companyId}`;
  export const fetchoporderrequest = (maxid: string, locationid: number) =>
    `${environment.BillingApiUrl}api/outpatientbilling/fetchoporderrequest/${maxid}/${locationid}`;

  export const getinteraction = `${environment.CommonApiUrl}api/lookup/getinteraction`;

  export const getServicesForCoupon = (CouponNo: string, locationid: number) =>
    `${environment.BillingApiUrl}api/outpatientbilling/getallservicesforcoupon/${CouponNo}/${locationid}`;

  export const getFollowupConsultation = (
    IaCodeDon: string,
    RegNoDon: number,
    sid: number,
    DoctorID: number,
    LocationID: number
  ) =>
    `${environment.BillingApiUrl}api/outpatientbilling/getisopbillingexists/${IaCodeDon}/${RegNoDon}/${sid}/${DoctorID}/${LocationID}`;

  export const getOPReasonsAndAuthorisedBy = (locationId: number) =>
    `${environment.BillingApiUrl}api/outpatientbilling/getopreasonsandauthorizedby/${locationId}`;

  export const getalldoctorname = (locationId: number) =>
    `${environment.CommonApiUrl}api/lookup/getalldoctorname/${locationId}`;

  export const getbanknames = `${environment.CommonApiUrl}api/lookup/getbankname`;

  export const checkopgroupdoctor = (unitDocId: number, locationId: number) =>
    `${environment.BillingApiUrl}api/outpatientbilling/opcheckdoctorforgroupdoctor/${unitDocId}/${locationId}`;

  export const getlastgrpdocselected = (
    Regno: number,
    Iacode: string,
    locationId: number,
    docId: number
  ) =>
    `${environment.BillingApiUrl}api/outpatientbilling/getlastgroupdoctorselected/${Regno}/${Iacode}/${locationId}/${docId}`;

  // #region QMS

  export const getnextqueueno = (
    locationid: number,
    stationId: number,
    counterId: number
  ) =>
    `${environment.BillingApiUrl}api/outpatientbilling/getnextqueueno/${locationid}/${stationId}/${counterId}`;

  export const donequeueno = (queueId: number, counterId: number) =>
    `${environment.BillingApiUrl}api/outpatientbilling/DoneQueueNo/${queueId}/${counterId}`;

  //#endregion

  export const getgroupdoctormappedwithdmg = (
    DmgID: number,
    SpecID: number,
    HspLocationID: any
  ) =>
    `${environment.BillingApiUrl}api/outpatientbilling/getgroupdoctormappedwithdmg/${DmgID}/${SpecID}/${HspLocationID}`;

  export const GetClinicDoctorsDMGRota = (
    DmgID: number,
    SpecID: number,
    HspLocationID: any
  ) =>
    `${environment.BillingApiUrl}api/outpatientbilling/getclinicdoctorsdmgrota/${DmgID}/${SpecID}/${HspLocationID}`;

  export const checkfreeopdflag = (
    regNumber: number,
    iaCode: string,
    itemId: number
  ) =>
    `${environment.BillingApiUrl}api/outpatientbilling/checkfreeopdflag/${regNumber}/${iaCode}/${itemId}`;

  export const getcompanydetailcreditallow = (
    CompanyId: number,
    episode: string,
    LocId: number,
    userId: number
  ) => {
    return `${environment.BillingApiUrl}api/outpatientbilling/iscompanycreditallow/${CompanyId}/${episode}/${LocId}/${userId}`;
  };

  export const gettestprofileid = (profileid: any) => {
    return `${environment.BillingApiUrl}api/outpatientbilling/gettestprofileid/${profileid}`;
  };

  export const isemailenablelocation = (HsplocationId: any) => {
    return `${environment.BillingApiUrl}api/outpatientbilling/isemailenablelocation/${HsplocationId}`;
  };

  export const sendemailalerttoservice = (
    OPBillID: number,
    EmailID: string,
    Remarks: string
  ) => {
    return `${environment.BillingApiUrl}api/outpatientbilling/sendemailalerttoservice/${OPBillID}/${EmailID}/${Remarks}`;
  };

  export const getDoctorConsultType = (
    locationId: number,
    doctorId: number,
    iaCode: string,
    RegNumber: number
  ) => {
    return `${environment.BillingApiUrl}api/outpatientbilling/doctorconsulttypesorder/${locationId}/${doctorId}/${iaCode}/${RegNumber}`;
  };

  export const checkCGHSBeneficiary = (
    iacode: string,
    regNumber: number,
    companyId: number,
    adhaarId: string
  ) => {
    return `${environment.BillingApiUrl}api/outpatientbilling/checkcghsbeneficiary/${iacode}/${regNumber}/${companyId}/${adhaarId}`;
  };

  export const updateopprintbillduplicate = (OPBillID: number) => {
    return `${environment.BillingApiUrl}api/outpatientbilling/updateopprintbillduplicate/${OPBillID}`;
  };
}
