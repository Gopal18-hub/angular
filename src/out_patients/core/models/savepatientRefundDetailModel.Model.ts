export class savepatientRefunddetailModel{
    iacode: string;    
    paidby: string;
    remarks: string;
    depreceiptno: string;
    registrationno: number;
    amount: number;
    stationid: number;
    hsplocationid: number;
    operatorid: number;
    paytype: number;
    chequeno: string;
   
    bankname: string;
    branchname: string;
    chequedate: string;
    isDonation: number;
    otp: number;
    constructor(
        iacode: string,
       
        paidby: string,
        remarks: string,
        depreceiptno: string,
        registrationno: number,
        amount: number,
        stationid: number,
        hsplocationid: number,
        operatorid: number,
        paytype: number,
        chequeno: string,
       
        bankname: string,
        branchname: string,
        chequedate: string,
        isDonation: number,
        otp: number,
      ) {
        this.iacode = iacode;     
        this.paidby = paidby;
        this.remarks = remarks;
        this.depreceiptno = depreceiptno;
        this.registrationno = registrationno;
        this.amount = amount;
        this.stationid = stationid;
        this.hsplocationid = hsplocationid;
        this.operatorid = operatorid;
        this.paytype = paytype;
        this.chequeno = chequeno;
       
        this.bankname = bankname;
        this.branchname = branchname;
        this.chequedate = chequedate;
        this.isDonation = isDonation;
        this.otp = otp;
      }
    }