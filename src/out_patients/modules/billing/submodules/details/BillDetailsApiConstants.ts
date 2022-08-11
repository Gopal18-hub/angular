import { environment } from "@environments/environment";

export namespace BillDetailsApiConstants{
    export const getrefundreason = `${environment.BillingApiUrl}api/outpatientbilling/getrefundreason`;

    export const getpatientbilldetails = (BillNo: string) =>{
        return `${environment.BillingApiUrl}api/outpatientbilling/getpatientpersonalandbilldetails/${BillNo}`;
    } 
}