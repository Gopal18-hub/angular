import { environment } from "@environments/environment";

export namespace PaymentApiConstants {
  export const uploadBillTransaction = `${environment.BillingApiUrl}api/outpatientbilling/UploadBillTransaction`;

  export const getBillTransactionStatus = `${environment.BillingApiUrl}api/outpatientbilling/GetBillTxnStatus`;
}
