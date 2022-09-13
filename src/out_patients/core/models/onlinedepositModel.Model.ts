export class getOnlineDepositModel{
    maxId: string;
    emailId: string;
    mobileNo: number;
    depositType: string;
    amount: number;
    stationName: string;
    depositStatus: string;
    date: any;
    depositSource: string;
    initdepdatetime: any;
    initdepResponsetime: any;
    payOrpayCheck: string;
    payRefNo: number;
    payBankRefNo: number;
    HisUpdateDatetime: any;
    HisDepositID: string;
    receiptNo: number;
    
    constructor(maxId: string, emailId: string, mobileNo: number, depositType: string, amount: number, stationName: string, depositStatus: string, date: any, depositSource: string, initdepdatetime: any, initdepResponsetime: any,payOrpayCheck: string,payRefNo: number,payBankRefNo: number,HisUpdateDatetime: any,HisDepositID: string,receiptNo:number)
    {
        this.maxId = maxId;
        this.emailId = emailId;
        this.mobileNo = mobileNo;
        this.depositType = depositType;
        this.amount = amount;
        this.stationName = stationName;
        this.depositStatus = depositStatus;
        this.date = date;
        this.depositSource = depositSource;
        this.initdepdatetime = initdepdatetime;
        this.initdepResponsetime = initdepResponsetime;
        this.payOrpayCheck = payOrpayCheck;
        this.payRefNo = payRefNo;
        this.payBankRefNo = payBankRefNo;
        this.HisUpdateDatetime = HisUpdateDatetime;
        this.HisDepositID = HisDepositID;
        this.receiptNo = receiptNo;
    }
}

export interface onlinedeposit{
    id: any,
    iaCode: any,
    maxid?: any,
    registrationno: any,
    eMailID: any,
    mobileNo: any,
    depositType: any,
    amount: any,
    stationName: any,
    statusCode: any,
    statusDesc: any,
    createDate: any,
    depositSource: any,
    initDep_DateTime: any,
    initDep_Response_ID: any,
    pay_Or_PayCheck_Date: any,
    pay_reference_no: any,
    pay_bank_ref_no: any,
    hiS_UpdateDateTime: any,
    hiS_DepositID: any,
    receiptNo: any,
    initDep_OtherDetail: any,
}