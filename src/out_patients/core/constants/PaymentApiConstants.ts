import { environment } from "@environments/environment";

export namespace PaymentApiConstants {
  export const uploadBillTransaction = `${environment.BillingApiUrl}api/outpatientbilling/UploadBillTransaction`;

  export const getBillTransactionStatus = `${environment.BillingApiUrl}api/outpatientbilling/GetBillTxnStatus`;

  export const paytmPaymentInit = (
    amount: any,
    locationId: number,
    userId: number,
    stationId: number,
    maxId: any,
    posId: any
  ) => {
    return `${environment.BillingApiUrl}api/outpatientbilling/paytmpaymentinit/${amount}/${locationId}/${userId}/${stationId}/${maxId}/${posId}`;
  };

  export const paytmPaymentTxnValidate = (
    amount: any,
    locationId: number,
    userId: number,
    stationId: number,
    maxId: any,
    posId: any
  ) => {
    return `${environment.BillingApiUrl}api/outpatientbilling/paytmpaymenttxnvalidate/${amount}/${locationId}/${userId}/${stationId}/${maxId}/${posId}`;
  };
}
