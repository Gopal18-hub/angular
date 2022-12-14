import { Injectable } from "@angular/core";
import { HttpService } from "@shared/services/http.service";
import { CookieService } from "@shared/services/cookie.service";
import { Subject, takeUntil } from "rxjs";
import { PaymentApiConstants } from "../constants/PaymentApiConstants";

@Injectable({
  providedIn: "root",
})
export class PaymentService {
  private readonly _destroying$ = new Subject<void>();
  billTransaction: any = {};

  constructor(private http: HttpService, public cookie: CookieService) {}

  async uploadBillTransaction(
    payloadData: any,
    module: any,
    maxId: any
  ): Promise<any> {
    this.billTransaction = {
      amount: payloadData.price,
      userID: this.cookie.get("UserId"),
      imei: this.cookie.get("MAXMachineName"),
      merchantStorePosCode: this.cookie.get("MerchantPOSCode"),
      totalInvoiceAmount: payloadData.price,
      maxID: maxId,
      posEDCMachineId: Number(this.cookie.get("POSIMEI")),
      merchantID: this.cookie.get("MerchantId"),
      securityToken: this.cookie.get("SecurityToken"),
      apiUrlPineLab: this.cookie.get("PineLabApiUrl"),
      module: module,
      allowedPaymentMode: payloadData.modeOfPayment.includes("Credit Card")
        ? 1
        : Number(this.cookie.get("UPIAllowedPaymentMode")),
      loginUserId: Number(this.cookie.get("UserId")),
      hsplocationId: Number(this.cookie.get("HSPLocationId")),
      stationId: Number(this.cookie.get("StationId")),
      transactionReferenceId: payloadData.transactionid || "",
    };

    return await this.http
      .post(PaymentApiConstants.uploadBillTransaction, this.billTransaction)
      .toPromise();
  }

  async getBillTransactionStatus(
    payloadData: any,
    module: any,
    maxId: any
  ): Promise<any> {
    this.billTransaction = {
      amount: payloadData.price,
      userID: this.cookie.get("UserId"),
      imei: this.cookie.get("MAXMachineName"),
      merchantStorePosCode: this.cookie.get("MerchantPOSCode"),
      totalInvoiceAmount: payloadData.price,
      maxID: maxId,
      posEDCMachineId: Number(this.cookie.get("POSIMEI")),
      merchantID: this.cookie.get("MerchantId"),
      securityToken: this.cookie.get("SecurityToken"),
      apiUrlPineLab: this.cookie.get("PineLabApiUrl"),
      module: module,
      allowedPaymentMode: payloadData.modeOfPayment.includes("Credit Card")
        ? 1
        : Number(this.cookie.get("UPIAllowedPaymentMode")),
      loginUserId: Number(this.cookie.get("UserId")),
      hsplocationId: Number(this.cookie.get("HSPLocationId")),
      stationId: Number(this.cookie.get("StationId")),
      transactionReferenceId: payloadData.transactionid || "",
    };
    return await this.http
      .post(PaymentApiConstants.getBillTransactionStatus, this.billTransaction)
      .toPromise();
  }

  manualEntry() {}

  async paytmPaymentInit(
    payloadData: any,
    module: any,
    maxId: any
  ): Promise<any> {
    return await this.http
      .post(
        PaymentApiConstants.paytmPaymentInit(
          payloadData.price,
          Number(this.cookie.get("HSPLocationId")),
          Number(this.cookie.get("UserId")),
          Number(this.cookie.get("StationId")),
          maxId,
          this.cookie.get("PayTmMachinePOSId")
        ),
        {}
      )
      .toPromise();
  }

  async paytmPaymentTxnValidate(
    payloadData: any,
    module: any,
    maxId: any
  ): Promise<any> {
    return await this.http
      .post(
        PaymentApiConstants.paytmPaymentTxnValidate(
          payloadData.price,
          Number(this.cookie.get("HSPLocationId")),
          Number(this.cookie.get("UserId")),
          Number(this.cookie.get("StationId")),
          maxId,
          this.cookie.get("PayTmMachinePOSId")
        ),
        {}
      )
      .toPromise();
  }
}
