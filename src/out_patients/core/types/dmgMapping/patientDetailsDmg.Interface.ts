export interface PatientDetailsDmgInterface {
  dmgPatientDetailDT: dmgMappingDataDTInterface[];
  dmgMappingDataDT: dmgMappingDataDT[];
}
interface dmgMappingDataDTInterface {
  maxId: string;
  patientName: string;
  ssn: string;
  age: string;
  gender: string;
  dob: string;
  nationality: string;
  hotList: number;
  vip: number;
  od: number;
  cghs: number;
  pPagerNumber: string;
  note: number;
  noteReason: string;
}
interface dmgMappingDataDT {
  isChecked: number;
  docId: number;
  docName: string;
  specialization: string;
  otherGroupDoc: string;
  id: number;
  isDmgChecked?: boolean;
}
