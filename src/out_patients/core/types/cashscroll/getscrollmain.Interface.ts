export interface getdataForScrollMain {
  getDetailsForMainScrollDetails: getMainScrollDetailsInterface[];
  getDetailsForMainScrollDatetime: getMainScrollDatetimeInterface[];
  }
  
  export interface getMainScrollDatetimeInterface {
    currentDateTime: string;
    todatetime: string;
  }
  export interface getMainScrollDetailsInterface {
    stationslno: string;
    fromdatetime: string;  
    todatetime: string;
    scrolldatetime: string ;
    name: string ;
    operatorid: number;
    flag: number;
    ackOperator: number;
    stationID: number;
    station: string;
 }