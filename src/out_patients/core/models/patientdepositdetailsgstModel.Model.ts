export class PatientSaveDepositDetailGST {
    iacode: string;
    registrationno: number;
    amount: number;
    stationid: number;
    hsplocationid: number;
    paidby: string;
    remarks: string;
    operatorid: number;
    paytype: number;
    chequeno: string;
    chequedate: string;
    bankname: string;
    branchname: string;
    ddno: string;
    dddate: string;
    ddbnkname: string;
    ddbncname: string;
    ccno: string;
    approvalno: string;
    ccbnkname: string;
    ccname: string;
    approvalcode: string;
    terminalID: string;
    acquirer: string;
    cardHolderName: string;
    flagman: number;
    panNo: string;
    servicetypeid: number;
    isDonation: number;
    intAdvanceTypeId: number;
    senMobile: string;
    transactionRef: string;
    mmid:string;

    constructor(
        iacode: string,
        registrationno: number,
        amount: number,
        stationid: number,
        hsplocationid: number,
        paidby: string,
        remarks: string,
        operatorid: number,
        paytype: number,
        chequeno: string,
        chequedate: string,
        bankname: string,
        branchname: string,
        ddno: string,
        dddate: string,
        ddbnkname: string,
        ddbncname: string,
        ccno: string,
        approvalno: string,
        ccbnkname: string,
        ccname: string,
        approvalcode: string,
        terminalID: string,
        acquirer: string,
        cardHolderName: string,
        flagman: number,
        panNo: string,
        servicetypeid: number,
        isDonation: number,
        intAdvanceTypeId: number,
        senMobile: string,
        transactionRef: string,
        mmid:string
    ) {
        this.iacode = iacode;
        this.registrationno= registrationno;
        this.amount = amount;
        this.stationid = stationid;
        this.hsplocationid = hsplocationid;
        this.paidby = paidby;
        this.remarks = remarks;
        this.operatorid = operatorid;
        this.paytype = paytype;
        this.chequeno = chequeno;
        this.chequedate = chequedate;
        this.bankname = bankname;
        this.branchname = branchname;
        this.ddno = ddno;
        this.dddate = dddate;
        this.ddbnkname = ddbnkname;
        this.ddbncname = ddbncname;
        this.ccno = ccno;
        this.approvalno = approvalno;
        this.ccbnkname = ccbnkname;
        this.ccname = ccname;
        this.approvalcode = approvalcode;
        this.terminalID = terminalID;
        this.acquirer = acquirer;
        this.cardHolderName = cardHolderName;
        this.flagman = flagman;
        this.panNo = panNo;
        this.servicetypeid = servicetypeid;
        this.isDonation = isDonation;
        this.intAdvanceTypeId = intAdvanceTypeId;
        this.senMobile = senMobile;
        this.transactionRef = transactionRef;
        this.mmid = mmid;
    }
  }