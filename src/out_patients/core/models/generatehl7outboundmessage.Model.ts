// export class Generatehl7outboundmessagerisModel {
//   opbillid: number;
//   id: number;
//   testName: string;
//   billid: number;
//   itemId: number;
//   orderId: number;
//   optestorderid: number;
//   ssn: string;
//   vistaID: number;
//   orderdatetime: string;
//   procedureid: number;
//   messagestatus: string;
//   reprocess: boolean;
//   operatorId: number;
//   stationid: number;
//   iaCode: string;
//   regNo: number;
//   userID: number;
//   locationID: number;
//   visitNo: string;
//   priority: string;
//   serviceID: number;
//   constructor(
//     opbillid: number,
//     id: number,
//     testName: string,
//     billid: number,
//     itemId: number,
//     orderId: number,
//     optestorderid: number,
//     ssn: string,
//     vistaID: number,
//     orderdatetime: string,
//     procedureid: number,
//     messagestatus: string,
//     reprocess: boolean,
//     operatorId: number,
//     stationid: number,
//     iaCode: string,
//     regNo: number,
//     userID: number,
//     locationID: number,
//     visitNo: string,
//     priority: string,
//     serviceID: number
//   ) {
//     this.opbillid = opbillid;
//     this.id = id;
//     this.testName = testName;
//     this.billid = billid;
//     this.itemId = itemId;
//     this.orderId = orderId;
//     this.optestorderid = optestorderid;
//     this.ssn = ssn;
//     this.vistaID = vistaID;
//     this.orderdatetime = orderdatetime;
//     this.procedureid = procedureid;
//     this.messagestatus = messagestatus;
//     this.reprocess = reprocess;
//     this.operatorId = operatorId;
//     this.stationid = stationid;
//     this.iaCode = iaCode;
//     this.regNo = regNo;
//     this.userID = userID;
//     this.locationID = locationID;
//     this.visitNo = visitNo;
//     this.priority = priority;
//     this.serviceID = serviceID;
//   }
// }
export class Generatehl7outboundmessagerisModel {
  opbillid: number;
  itemId: number;
  orderId: number;
  operatorid: number;
  serviceId: number;
  constructor(
    opbillid: number,
    itemId: number,
    orderId: number,
    operatorid: number,
    serviceId: number
  ) {
    this.opbillid = opbillid;
    this.itemId = itemId;
    this.orderId = orderId;
    this.operatorid = operatorid;
    this.serviceId = serviceId;
  }
}
