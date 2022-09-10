import { environment } from "@environments/environment";

export namespace BillDetailsApiConstants{
    export const getrefundreason = `${environment.BillingApiUrl}api/outpatientbilling/getrefundreason`;

    export const getpatientbilldetails = (BillNo: string) =>{
        return `${environment.BillingApiUrl}api/outpatientbilling/getpatientpersonalandbilldetails/${BillNo}`;
    } 

    export const getsearchopbills = (
        BillNo: any,
        registrationno: any,
        iacode: any,
        MobileNo: any,
        DateFlag: any,
        fromDate: any,
        ToDate: any,
        locationid : any
    ) => {
        return `${environment.BillingApiUrl}api/outpatientbilling/getsearchopbills/${DateFlag}/${fromDate}/${ToDate}/${locationid}?BillNo=${BillNo}&registrationno=${registrationno}&iacode=${iacode}&MobileNo=${MobileNo}`
    }

    export const sendapproval = (HostName: string, Locationid: any, UserId: any) => {
        return `${environment.BillingApiUrl}api/outpatientbilling/sendapproval/${HostName}/${Locationid}/${UserId}`;
    }

    export const getrefundbillnumber = (
        opbillid: any
    ) => {
        return `${environment.BillingApiUrl}api/outpatientbilling/getrefundbillnumber/${opbillid}`;
    }

    export const getpaymentmode = (BillNo: any, stationid: any) => {
        return `${environment.BillingApiUrl}api/outpatientbilling/getpaymentmode/${BillNo}/${stationid}`;
    }

    export const saverefunddetailsforparticularbill = `${environment.BillingApiUrl}api/outpatientbilling/saverefunddetailsforparticularbill`;

    export const billrefundforsingleitem = `${environment.BillingApiUrl}api/outpatientbilling/billrefundforsingleitem`;

    export const cancelvisitnumberinrefund = `${environment.BillingApiUrl}api/outpatientbilling/cancelvisitnumberinrefund`;

    export const refundbillafteracknowledgementforfull = (
        OTP: any,
        HostName : any,
        Operatorid : any,
        LocationId: any,
        Stationid: any
    ) => {
        return `${environment.BillingApiUrl}api/outpatientbilling/refundbillafteracknowledgementforfull/${OTP}/${HostName}/${Operatorid}/${LocationId}/${Stationid}`;
    }
}