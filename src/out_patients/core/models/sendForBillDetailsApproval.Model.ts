export class sendForBillDetailsApproval{
    public objSendApprovalTableList!: objSendApprovalTableList[];

    constructor()
    {
        // this.objSendApprovalTableList = objSendApprovalTableList;
    }
}
export class objSendApprovalTableList{
    ssn: any;
    maxid: any;
    ptnName: any;
    billNo: any;
    operatorName: any;
    authorisedby: any;
    reason: any;
    refundAmt: any;
    mop: any;
    serviceId: any;
    itemId: any;
    serviceName: any;
    itemName: any;
    refundAfterAck: any;
    itemOrderId: any;

    constructor(
        ssn: any,
        maxid: any,
        ptnName: any,
        billNo: any,
        operatorName: any,
        authorisedby: any,
        reason: any,
        refundAmt: any,
        mop: any,
        serviceId: any,
        itemId: any,
        serviceName: any,
        itemName: any,
        refundAfterAck: any,
        itemOrderId: any,
    )
    {
        this.ssn = ssn;
        this.maxid = maxid;
        this.ptnName = ptnName;
        this.billNo = billNo;
        this.operatorName = operatorName;
        this.authorisedby = authorisedby;
        this.reason = reason;
        this.refundAmt = refundAmt;
        this.mop = mop;
        this.serviceId = serviceId;
        this.itemId = itemId;
        this.serviceName = serviceName;
        this.itemName = itemName;
        this.refundAfterAck = refundAfterAck;
        this.itemOrderId = itemOrderId;
    }
}