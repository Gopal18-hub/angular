import { PatientDetail } from "./patientDetailModel.Interface";

export interface Registrationdetails {
  dsPersonalDetails: {
    dtPersonalDetails1: PatientDetail[];
    dtPersonalDetails2: [];
    dtPersonalDetails3: dtPersonalDetails3[];
    dtPersonalDetails4: dtPersonalDetails4[];
    dtPersonalDetails5: [];
  };

  dtDoctorSchedule: dtDoctorSchedule[];
  dtPlanDetail: dtPlanDetail[];
  dtOtherPlanDetail: dtOtherPlanDetail[];
  dtPatientPastDetails: [];
}

export interface dtPatientPastDetails {
  id: number;
  data: number;
}

export interface dtPersonalDetails3 {
  accountno: string;
  otp: string;
}
export interface dtPersonalDetails4 {
  flag: number;
  specialzation: number;
  itemID: number;
}
export interface dtDoctorSchedule {
  name: string;
  consultationtype: string;
  fromdate: string;
  todate: string;
  bookdate: string;
  doctorid: number;
  specialisationId: number;
  id: number;
}

export interface dtPlanDetail {
  planName: string;
  planID: number;
}

export interface dtOtherPlanDetail {
  planName: string;
  planId: number;
  serviceId: number;
}
