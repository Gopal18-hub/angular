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
}