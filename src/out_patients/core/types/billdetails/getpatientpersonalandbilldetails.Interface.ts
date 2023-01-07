export interface getPatientPersonalandBillDetails{
    billDetialsForRefund_Table0: billDetialsForRefund_Table0[];
    billDetialsForRefund_Table1: billDetialsForRefund_Table1[];
    billDetialsForRefund_ServiceDetail: billDetialsForRefund_ServiceDetail[];
    billDetialsForRefund_DepositRefundAmountDetail: billDetialsForRefund_DepositRefundAmountDetail[];
    billDetialsForRefund_Cancelled: billDetialsForRefund_Cancelled[];
    billDetialsForRefund_ServiceItemID: billDetialsForRefund_ServiceItemID[];
    billDetialsForRefund_ServiceItemItemIDPriorityID: billDetialsForRefund_ServiceItemItemIDPriorityID[];
    billDetialsForRefund_DeptID: billDetialsForRefund_DeptID[];
    billDetialsForRefund_VisitDetail: billDetialsForRefund_VisitDetail[];
    billDetialsForRefund_PartialBill: billDetialsForRefund_PartialBill[];
    billDetialsForRefund_TransactionBookingNo: billDetialsForRefund_TransactionBookingNo[];
    billDetialsForRefund_EmailMobile: billDetialsForRefund_EmailMobile[];
    billDetialsForRefund_IdName: billDetialsForRefund_IdName[];
    billDetialsForRefund_RequestNoGeivePaymentModeRefund: billDetialsForRefund_RequestNoGeivePaymentModeRefund[];
    billDetialsForRefund_TransactionIDDetails: billDetialsForRefund_TransactionIDDetails[];
    billDetialsForRefund_ConfigValueToken: billDetialsForRefund_ConfigValueToken[];
}
export interface billDetialsForRefund_Table0{
    uhid: string,
    datetime: string,
    name: string,
    age: string,
    sex: string,
    operator: string,
    ssn: string,
    pcellno: string,
    radiologyCancellation: string,
    opCancelDaysRest: string,
    dateOfBirth: any,
    nationalityName: any,
    pPagerNumber: any,
    vip: any,
    vipreason: any,
    hotList: any,
    od: any,
    cghs: any,
    note: any,
    noteReason: any,
    hwc: any,
    hwcRemarks: any,
    hotlistreason: any,
    hotlistcomments: any,
    bplCardNo: any,
    addressOnCard: any,
    emailId: any,
}
export interface billDetialsForRefund_Table1{
    opBillID: number,
    operatorName: string
}
export interface billDetialsForRefund_ServiceDetail{
    serviceid: number,
    itemid: number,
    servicename: string,
    itemname: string,
    amount: any,
    discountamount: any,
    cancelled: number,
    orderid: number,
    qTslno: number,
    planAmount: any,
    planDesc: string,
    orderType: number,
    cancelitem: number,
    id: number,
    visitid: number,
    visitNo: string,
    requestToApproval: number
}
export interface billDetialsForRefund_DepositRefundAmountDetail{
    billamount: number,
    discountamount: number,
    depositamount: number,
    collectedamount: number,
    balance: number,
    id: number,
    billno: string,
    billtype: number,
    planid: number,
    companyPaidAmt: number
}
export interface billDetialsForRefund_Cancelled{
    cancelled: number
}
export interface billDetialsForRefund_ServiceItemID{
    serviceId: number,
    itemid: number,
    due: number,
    visited: number,
    ackby: number,
    risCan: number
}
export interface billDetialsForRefund_ServiceItemItemIDPriorityID{
    serviceId: number,
    itemid: number,
    due: number,
    visited: number,
    ackby: number,
    risCan: number,
    priority: number,
    transportationMode: number
}
export interface billDetialsForRefund_DeptID{
    deptid: number
}
export interface billDetialsForRefund_VisitDetail{
    id: number,
    visitNo: string
}
export interface billDetialsForRefund_PartialBill{
    isPartialBill: number
}
export interface billDetialsForRefund_TransactionBookingNo{
    transactionNo: string,
    bookingNo: string
}
export interface billDetialsForRefund_EmailMobile{
    id: number,
    emailId: string,
    mobileNo: string
}
export interface billDetialsForRefund_IdName{
    id: number,
    name: string
}
export interface billDetialsForRefund_RequestNoGeivePaymentModeRefund{
    requestNotGiven: number,
    notApproved: number,
    authorisedby: string,
    reason: string,
    paymentMode: string,
    serviceId: number,
    itemId: number,
    refundAmt: number,
    refundAfterAck: number
}
export interface billDetialsForRefund_TransactionIDDetails{
    transactionID: string,
    merchantID: string,
    billamountas: number,
    payTmAmount: number
}
export interface billDetialsForRefund_ConfigValueToken{
    configValue: string,
    token: string
}
