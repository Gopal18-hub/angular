export interface dispatchReportList{
    dispatchlist: dispatchlist[];
    dispatchDatalist: dispatchDatalist[];
}   
export interface dispatchlist{
    sNo?: any;
    itemName: string;
    orderdatetime: any;
    ptnName: string;
    billno: string;
    operatorid: number;
    orderId: number;
    itemid: number;
    flag: number;
    balance: string;
    patType: string;
    billid: number;
    receiveddatetime: any;
    dispatcheddatetime?: any;
    dispatchplace?: any;
    remarks?: any;
}

export interface dispatchDatalist{
    opbillid: number;
    orderId: number;
    r_dispatchdate: number;
    r_collection_location: number;
    remarks: string;
    remarks_operatorid: number;
    itemid: number;
    receive_date: any;
    receive_oprid: number;
    repType: string;
}