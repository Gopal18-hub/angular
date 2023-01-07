export interface getPatientVisitHistory{
    lastConsultationData: lastConsultationData[];
    opPreviousDMGMappingDoctorData: opPreviousDMGMappingDoctorData[];
    opdmgmAppingDoctorData: opdmgmAppingDoctorData[];
    opGroupDoctorLog: opGroupDoctorLog[];
}
export interface lastConsultationData{
    visitDate: any;
    days: number;
    doctorName: string;
    consultationType: string;
    amount: number;
    billNo: string;
    paymentMode: string;
    companyName: string;
    id: number;
}
export interface opPreviousDMGMappingDoctorData{
    docId: number;
    name: string;
    dmgid: number;
    specialisationId: number;
    specialization: string;
    actualSpec: string;
    counter: number;
    active: number;
}
export interface opdmgmAppingDoctorData{
    docId: number;
    name: string;
    dmgid: number;
    specialisationId: number;
    specialization: string;
    actualSpec: string;
    counter: number;
    active: number;
}
export interface opGroupDoctorLog{
    id: number;
    iacode: string;
    registrationno: number;
    operatorid: number;
    dmg: number;
    deleted: number;
    modifieddatetime: any;
    opbillid: number;
    otherGroupDocRemark: string;
    patType: string;
    hsplocationid: number;
}