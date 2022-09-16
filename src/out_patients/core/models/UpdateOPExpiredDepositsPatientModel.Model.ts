export class UpdateOPExpiredDepositsPatientModel {
  chkdd: String;
  id: any;
  addby: any;
  ptype: String;

  constructor(chkdd: String, id: any, addby: any, ptype: String) {
    this.chkdd = chkdd;
    this.id = id;
    this.addby = addby;
    this.ptype = ptype;
  }
}
