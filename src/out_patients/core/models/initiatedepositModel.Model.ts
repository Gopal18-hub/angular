export class InitiateDepositModel{
    flag: string;
    iaCode: string;
    registrationno: number;
    depositType: string;
    amount: number;
    eMailID: string;
    mobileNo: string;
    userID: number;
    stationID:number;
    hspLocationId: number;
    remark: string;
    depositHeadID: number;
    isDonation: number;
    IPID:number;
    InternetPaymentTypeId: number;
    intWaitingListNo: number;
    chvBillNo: string;


    constructor(
        flag: string,
        iaCode: string,
        registrationno: number,
        depositType: string,
        amount: number,
        eMailID: string,
        mobileNo: string,
        userID: number,
        stationID:number,
        hspLocationId: number,
        remark: string,
        depositHeadID: number,
        isDonation: number,
        IPID:number,
        InternetPaymentTypeId: number,
        intWaitingListNo: number,
        chvBillNo: string,
    )
    {
       this.flag = flag,
       this.iaCode = iaCode,
       this.registrationno = registrationno,
       this.depositType = depositType,
       this.amount = amount,
       this.eMailID = eMailID,
       this.mobileNo = mobileNo,
       this.userID = userID,
       this.stationID = stationID,
       this.hspLocationId = hspLocationId,
       this.remark = remark,
       this.depositHeadID = depositHeadID,
       this.isDonation = isDonation,
       this.IPID = IPID,
       this.InternetPaymentTypeId = InternetPaymentTypeId,
       this.intWaitingListNo = intWaitingListNo,
       this.chvBillNo = chvBillNo
    }
}