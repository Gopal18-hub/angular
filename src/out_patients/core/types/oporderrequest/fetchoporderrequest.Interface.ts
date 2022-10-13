export interface FetchOpOrderrequest {
  id: number;
  maxId: string;
  patientName: string;
  serviceId: number;
  serviceName: string;
  itemId: number;
  itemName: string;
  requestedBy: number;
  reqBy: string;
  requestOn: string;
  active: boolean;
  isDelete: string;
  delBy: string;
  deletedOn: string;
  orderStatus: string;
  sno: number;
  disabled?: any;
  disablecheckbox: boolean;
}
