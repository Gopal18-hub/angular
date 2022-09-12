export class saveRefundforParticularBill{
    objtab_cancelbill!: objtab_cancelbill[];
    objdt!: objdt[];
    otp: any;
    hostName: any;

    constructor(
    )
    {
        // this.objtab_cancelbill = objtab_cancelbill;
        // this.objdt = objdt;
        // this.otp = otp;
        // this.hostName = hostName;
    }
}

export class objtab_cancelbill{
    billno: string;
    operatorid: number;
    hsplocationid: number;
    registrationno: number;
    mop: number;
    authorisedby: string;
    reason: string;
    chequeno: string;
    chequedate: string;
    bankid: number;
    branchname: string;
    validity: string;
    cardtype: number;
    approvalno: string;
    stationid: number;
    itemid: number;
    orderid: number;
    serviceid: number;
    qtslno: number;
    itemName: string;
    iaCode: string;
    transMode: number;
    priority: number;

    constructor(
    billno: string,
    operatorid: number,
    hsplocationid: number,
    registrationno: number,
    mop: number,
    authorisedby: string,
    reason: string,
    chequeno: string,
    chequedate: string,
    bankid: number,
    branchname: string,
    validity: string,
    cardtype: number,
    approvalno: string,
    stationid: number,
    itemid: number,
    orderid: number,
    serviceid: number,
    qtslno: number,
    itemName: string,
    iaCode: string,
    transMode: number,
    priority: number
    )
    {
        this.billno = billno;
        this.operatorid = operatorid;
        this.hsplocationid =hsplocationid;
        this.registrationno = registrationno;
        this.mop = mop;
        this.authorisedby = authorisedby;
        this.reason = reason;
        this.chequeno = chequeno;
        this.chequedate = chequedate;
        this.bankid = bankid;
        this.branchname = branchname;
        this.validity = validity;
        this.cardtype = cardtype;
        this.approvalno = approvalno;
        this.stationid =stationid;
        this.itemid = itemid;
        this.orderid = orderid;
        this.serviceid = serviceid;
        this.qtslno = qtslno;
        this.itemName = itemName;
        this.iaCode = iaCode;
        this.transMode = transMode;
        this.priority = priority;
    }
}

export class objdt{
    serviceid: number;
    itemid: number;
    servicename: string;
    itemname: string;
    amount: number;
    discountamount: number;
    cancelled: number;
    orderid: number;
    qTslno: number;
    planAmount: number;
    planDesc: string;
    orderType: number;
    cancelitem: number;
    id: number;
    visitid: number;
    visitNo: string;
    requestToApproval: number;

    constructor(
    serviceid: number,
    itemid: number,
    servicename: string,
    itemname: string,
    amount: number,
    discountamount: number,
    cancelled: number,
    orderid: number,
    qTslno: number,
    planAmount: number,
    planDesc: string,
    orderType: number,
    cancelitem: number,
    id: number,
    visitid: number,
    visitNo: string,
    requestToApproval: number
    )
    {
        this.serviceid = serviceid;
        this.itemid = itemid;
        this.servicename = servicename;
        this.itemname = itemname;
        this.amount = amount;
        this.discountamount = discountamount;
        this.cancelled = cancelled;
        this.orderid = orderid;
        this.qTslno = qTslno;
        this.planAmount = planAmount;
        this.planDesc = planDesc;
        this.orderType = orderType;
        this.cancelitem = cancelitem;
        this.id = id;
        this.visitid = visitid;
        this.visitNo = visitNo;
        this.requestToApproval = requestToApproval;
    }
}
