export class dispatchReportListModel{
    sno?: number;
    balance: any;
    billno: any;
    flag: number;
    itemName: string;
    itemid: number;
    operatorid: number;
    orderId: number;
    orderdatetime: any;
    patType: any;
    ptnName: string;
    
    constructor(sno: number, balance: any, billno: any, flag: number, itemName: string, itemid: number, operatorid: number, orderId: number, orderdatetime: any, patType: any, ptnName: string)
    {
        this.sno = sno;
        this.balance = balance;
        this.billno = billno;
        this.flag = flag;
        this.itemName = itemName;
        this.itemid = itemid;
        this.operatorid = operatorid;
        this.orderId = orderId;
        this.orderdatetime = orderdatetime;
        this.patType = patType;
        this.ptnName = ptnName;
    }
}