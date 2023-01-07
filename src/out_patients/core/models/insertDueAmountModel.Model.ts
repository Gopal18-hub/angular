export class insertDueAmountModel{
    tab_rec!: tab_rec;
    ds_paymode!: ds_paymode;
    operatorid: any;
    stationid: any;
    hsplocationid: any;

    constructor()
    {

    }
}

export class ds_paymode{
    tab_paymentList!: tab_paymentList[];
    tab_cheque!: tab_cheque[];
    tab_dd!: tab_dd[];
    tab_credit!: tab_credit[];
    tab_debit!: tab_debit[];
    tab_Mobile!: tab_Mobile[];
    tab_Online!: tab_Online[];
    tab_UPI!: tab_UPI[];

    constructor(
    // tab_paymentList: tab_paymentList[],
    // tab_cheque: tab_cheque[],
    // tab_dd: tab_dd[],
    // tab_credit: tab_credit[],
    // tab_debit: tab_debit[],
    // tab_Mobile: tab_Mobile[],
    // tab_Online: tab_Online[],
    // tab_UPI: tab_UPI[],
    )
    {
        // this.tab_paymentList = tab_paymentList;
        // this.tab_cheque = tab_cheque;
        // this.tab_dd = tab_dd;
        // this.tab_credit = tab_credit;
        // this.tab_debit = tab_debit;
        // this.tab_Mobile = tab_Mobile;
        // this.tab_Online = tab_Online;
        // this.tab_UPI = tab_UPI;
    }
}

export class tab_rec{
    billid: any;
    billno!: string;
    collectedamt: any;
    operatorid: any;
    stationid: any;
    hsplocationid: any;
    recnumber!: string;
    dueType: any;

    constructor()
    {
        // this.billid = billid;
        // this.billno = billno;
        // this.collectedamt = collectedamt;
        // this.operatorid = operatorid;
        // this.stationid = stationid;
        // this.hsplocationid = hsplocationid;
        // this.recnumber = recnumber;
        // this.dueType = dueType;
    }
}

export class tab_paymentList{
    slNo: any;
    modeOfPayment: string;
    amount: any;
    flag: any;

    constructor(
    slNo: any,
    modeOfPayment: string,
    amount: any,
    flag: any
    )
    {
        this.slNo = slNo;
        this.modeOfPayment = modeOfPayment;
        this.amount = amount;
        this.flag = flag;
    }
}

export class tab_cheque{
    chequeNo: string;
    chequeDate: any;
    bankName: string;
    branchName: string;
    city: string;
    flag: any

    constructor(
    chequeNo: string,
    chequeDate: string,
    bankName: string,
    branchName: string,
    city: string,
    flag: any
    )
    {
        this.chequeNo = chequeNo;
        this.chequeDate = chequeDate;
        this.bankName = bankName;
        this.branchName = branchName;
        this.city = city;
        this.flag = flag;
    }
}

export class tab_dd{
    ddNumber: string;
    ddDate: string;
    bankName: string;
    branchName: string;
    flag: any

    constructor(
    ddNumber: string,
    ddDate: string,
    bankName: string,
    branchName: string,
    flag: any
    )
    {
        this.ddNumber = ddNumber;
        this.ddDate = ddDate;
        this.bankName = bankName;
        this.branchName = branchName;
        this.flag = flag;
    }
}

export class tab_credit{
    ccNumber: string;
    cCvalidity: any;
    cardType: any;
    approvalno: string;
    cType: any;
    flag: any;
    approvalcode: string;
    terminalID: string;
    acquirer: string;
    flagman: string;
    cardholdername: string;
    bankname: string

    constructor(
    ccNumber: string,
    cCvalidity: string,
    cardType: any,
    approvalno: string,
    cType: any,
    flag: any,
    approvalcode: string,
    terminalID: string,
    acquirer: string,
    flagman: string,
    cardholdername: string,
    bankname: string
    )
    {
        this.ccNumber = ccNumber;
        this.cCvalidity = cCvalidity;
        this.cardType = cardType;
        this.approvalno = approvalno;
        this.cType = cType;
        this.flag = flag;
        this.approvalcode = approvalcode;
        this.terminalID = terminalID;
        this.acquirer = acquirer;
        this.flagman = flagman;
        this.cardholdername = cardholdername;
        this.bankname = bankname;
    }
}

export class tab_debit{
    ccNumber: string;
    cCvalidity: string;
    cardType: any;
    approvalno: string;
    cType: any;
    flag: any

    constructor(
    ccNumber: string,
    cCvalidity: string,
    cardType: any,
    approvalno: string,
    cType: any,
    flag: any
    )
    {
        this.ccNumber = ccNumber;
        this.cCvalidity = cCvalidity;
        this.cardType = cardType;
        this.approvalno = approvalno;
        this.cType = cType;
        this.flag = flag;
    }
}

export class tab_Mobile{
    mobileNo: string;
    mmid: string;
    senderName: string;
    bankName: string;
    branchName: string;
    beneficiaryMobile: string;
    transactionRef: string;
    flag: any

    constructor(
    mobileNo: string,
    mmid: string,
    senderName: string,
    bankName: string,
    branchName: string,
    beneficiaryMobile: string,
    transactionRef: string,
    flag: any
    )
    {
        this.mobileNo = mobileNo;
        this.mmid = mmid;
        this.senderName = senderName;
        this.bankName = bankName;
        this.branchName = branchName;
        this.beneficiaryMobile = beneficiaryMobile;
        this.transactionRef = transactionRef;
        this.flag = flag;
    }
}

export class tab_Online{
    transactionId: string;
    bookingId: string;
    cardValidation: string;
    flag: any;
    onlineContact: string

    constructor(
    transactionId: string,
    bookingId: string,
    cardValidation: string,
    flag: any,
    onlineContact: string
    )
    {
        this.transactionId = transactionId;
        this.bookingId = bookingId;
        this.cardValidation = cardValidation;
        this.flag = flag;
        this.onlineContact = onlineContact;
    }
}

export class tab_UPI{
    ccNumber_UPI!: string;
    cCvalidity_UPI!: string;
    cardType_UPI: any;
    approvalno_UPI!: string;
    cType_UPI: any;
    flag: any;
    approvalcode_UPI!: string;
    terminalID_UPI!: string;
    acquirer_UPI!: string;
    flagman_UPI!: string;
    cardholdername_UPI!: string;
    bankname_UPI!: string

    constructor(
    ccNumber_UPI: string,
    cCvalidity_UPI: string,
    cardType_UPI: any,
    approvalno_UPI: string,
    cType_UPI: any,
    flag: any,
    approvalcode_UPI: string,
    terminalID_UPI: string,
    acquirer_UPI: string,
    flagman_UPI: string,
    cardholdername_UPI: string,
    bankname_UPI: string
    )
    {
        this.ccNumber_UPI = ccNumber_UPI;
        this.cCvalidity_UPI = cCvalidity_UPI;
        this.cardType_UPI = cardType_UPI;
        this.approvalno_UPI = approvalno_UPI;
        this.cType_UPI = cType_UPI;
        this.flag = flag;
        this.approvalcode_UPI = approvalcode_UPI;
        this.terminalID_UPI = terminalID_UPI;
        this.acquirer_UPI = acquirer_UPI;
        this.flagman_UPI = flagman_UPI;
        this.cardholdername_UPI = cardholdername_UPI;
        this.bankname_UPI = bankname_UPI;
    }
}
