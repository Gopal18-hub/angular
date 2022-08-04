export class getPatientHistoryModel{
    billId: number;
    billNo: string;
    billType: string;
    billDate: any;
    ipNo: string;
    admDateTime: string;
    dischargeDateTime: string;
    billAmount: string;
    discountAmount: string;
    receiptAmt: string;
    refundAmount: string;
    balanceAmt: string;
    companyName: string;
    operatorName: string;
    printEnable: number;
    allowSeparateBillFlag: string;
    creditlimit: number;
    ptnStatus: string;
    companyId: number;
    printIcon?: any;
    
    constructor(
        billId: number,
        billNo: string,
        billType: string,
        billDate: any,
        ipNo: string,
        admDateTime: string,
        dischargeDateTime: string,
        billAmount: string,
        discountAmount: string,
        receiptAmt: string,
        refundAmount: string,
        balanceAmt: string,
        companyName: string,
        operatorName: string,
        printEnable: number,
        allowSeparateBillFlag: string,
        creditlimit: number,
        ptnStatus: string,
        companyId: number,
        printIcon: any)
    {
        this.billId = billId;
        this.billNo = billNo;
        this.billType = billType;
        this.billDate = billDate;
        this.ipNo = ipNo;
        this.admDateTime = admDateTime;
        this.dischargeDateTime = dischargeDateTime;
        this.billAmount = billAmount;
        this.discountAmount = discountAmount;
        this.receiptAmt = receiptAmt;
        this.refundAmount = refundAmount;
        this.balanceAmt = balanceAmt;
        this.companyName = companyName;
        this.operatorName = operatorName;
        this.printEnable = printEnable;
        this.allowSeparateBillFlag = allowSeparateBillFlag;
        this.creditlimit = creditlimit;
        this.ptnStatus = ptnStatus;
        this.companyId = companyId;
        this.printIcon = printIcon;
    }
}