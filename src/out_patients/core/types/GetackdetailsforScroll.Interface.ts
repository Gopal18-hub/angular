export interface ackscrolldetailslist {
  ackscrolllist: getackdetailsforscroll[];
}
export interface getackdetailsforscroll {
  stationslno: string;
  ackdatetime: string;
  name: string;
  operatorid: string;
  amount: number;
}
