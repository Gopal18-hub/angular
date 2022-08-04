export interface dispatchReportList{
    dispatchlist: dispatchlist[];
}   
export interface dispatchlist{
    sNo?: any;
    itemName: string ,
    orderdatetime: any,
    ptnName: string,
    billno: string,
    operatorid: any,
    orderId: any,
    itemid: any,
    flag: any,
    balance: any,
    patType: any,
    billid: any,
    r_dispatchdate: any,
    r_collection_location: any,
    remarks: any,
    remarks_operatorid: any,
    receive_date: any,
    receive_oprid: any
}