export class dispatchReportSaveModel{
    objDtSaveReport: objdispatchsave;
    operatorid: any;

    constructor(objDtSaveReport:objdispatchsave, operatorid:any)
    {
        this.objDtSaveReport = objDtSaveReport;
        this.operatorid = operatorid;
    }    
}

export class objdispatchsave{
    slNo?: string;
    testName?: string;
    datetime?: string;
    patientName?: string;
    billNo?: string;
    dispatchDateTime?: string;
    dispatchPlace?: string;
    remarks?: string;
    chk?: boolean;
    billid?: string;
    operatorid?: string;
    itemid?: string;
    recievedDateTime?: string;
    balance?: string;
    repType?: string;

    constructor(
        slNo: string,
        testName: string,
        datetime: string,
        patientName: string,
        billNo: string,
        dispatchDateTime: string,
        dispatchPlace: string,
        remarks: string,
        chk: boolean,
        billid: string,
        operatorid: string,
        itemid: string,
        recievedDateTime: string,
        balance: string,
        repType: string)
        {
            this.slNo = slNo;
            this.testName = testName;
            this.datetime = datetime;
            this.patientName = patientName;
            this.billNo = billNo;
            this.dispatchDateTime = dispatchDateTime;
            this.dispatchPlace = dispatchPlace;
            this.remarks = remarks;
            this.chk = chk;
            this.billid = billid;
            this.operatorid = operatorid;
            this.itemid = itemid;
            this.recievedDateTime = recievedDateTime;
            this.balance = balance;
            this.repType = repType;
        }
}