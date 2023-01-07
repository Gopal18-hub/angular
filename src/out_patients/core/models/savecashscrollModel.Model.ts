export class savecashscroll {
    fromdate: string;
    todate: string;
    totdisc: number;
    totcash: number;
    ccamt: number;
    cheque: number;
    totdues: number;
    totrefund: number;
    scrolldate: string;
    gross: number
    netamt: number;
    duereceived: number;
    totalamt: number;
    totdd: number;
    totplanamt: number;
    totplandiscount:number;
    totaltds:number;
    totaldeposit: number;
    mobilePayment: number;
    onlinePayment: number;
    upiAmt : number;
    donationAmount : number;
    stationid: string;
    operatorId:string;
    hsplocationId:string;
    
    constructor( fromdate: string,
        todate: string,
        totdisc: number,
        totcash: number,
        ccamt: number,
        cheque: number,
        totdues: number,
        totrefund: number,
        scrolldate: string,
        gross: number,
        netamt: number,
        duereceived: number,
        totalamt: number,
        totdd: number,
        totplanamt: number,
        totplandiscount:number,
        totaltds:number,
        totaldeposit: number,
        mobilePayment: number,
        onlinePayment: number,
        upiAmt : number,
        donationAmount : number,
        stationid: string,
        operatorId:string,
        hsplocationId:string
        ) {
      this.fromdate = fromdate;
      this.todate = todate;
      this.totdisc = totdisc;
      this.totcash = totcash;
      this.ccamt = ccamt;
      this.cheque = cheque;
      this.totdues = totdues;
      this.totrefund = totrefund;
      this.scrolldate = scrolldate;
      this.gross = gross;
      this.netamt = netamt;
      this.duereceived = duereceived,
      this.totalamt = totalamt,
      this.totdd = totdd,
      this.totplanamt = totplanamt,
      this.totplandiscount = totplandiscount,
      this.totaltds = totaltds,
      this.totaldeposit = totaldeposit,
      this.mobilePayment = mobilePayment;
      this.onlinePayment = onlinePayment;
      this.upiAmt = upiAmt;
      this.donationAmount = donationAmount;
      this.stationid = stationid;
      this.operatorId = operatorId;
      this.hsplocationId = hsplocationId;
    }
  }
  