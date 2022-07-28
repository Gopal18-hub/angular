export interface PatientDetailsDmgInterface {
  dmgPatientDetailDT: dmgMappingDataDTInterface[];
  dmgMappingDataDT: dmgMappingDataDT[];
}
interface dmgMappingDataDTInterface {
  maxId: string;
  patientName: string;
  ssn: string;
}
interface dmgMappingDataDT {
  isChecked: number;
  docId: number;
  docName: string;
  specialization: string;
  otherGroupDoc: string;
}
