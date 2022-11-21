import { Injectable } from "@angular/core";
import { HttpService } from "@shared/services/http.service";
import { CookieService } from "@shared/services/cookie.service";
import { Subject, takeUntil } from "rxjs";
import { PaymentApiConstants } from "../constants/PaymentApiConstants";
import { AnyARecord } from "dns";

@Injectable({
  providedIn: "root",
})
export class PaymentService {
  private readonly _destroying$ = new Subject<void>();
  billTransaction: any = {};

  constructor(private http: HttpService, public cookie: CookieService) {}

  async uploadBillTransaction(payloadData: any, module: any): Promise<any> {
    this.billTransaction = {
      amount: payloadData.price,
      userID: this.cookie.get("UserId"),
      imei: this.cookie.get("MAXMachineName"),
      merchantStorePosCode: this.cookie.get("MerchantPOSCode"),
      totalInvoiceAmount: payloadData.price,
      maxID: "",
      posEDCMachineId: this.cookie.get("POSIMEI"),
      merchantID: this.cookie.get("MerchantId"),
      securityToken: this.cookie.get("SecurityToken"),
      apiUrlPineLab: this.cookie.get("PineLabApiUrl"),
      module: module,
      allowedPaymentMode: 1,
      loginUserId: Number(this.cookie.get("UserId")),
      hsplocationId: this.cookie.get("HSPLocationId"),
      stationId: this.cookie.get("StationId"),
      transactionReferenceId: payloadData.transactionid || "",
    };

    return await this.http
      .post(PaymentApiConstants.uploadBillTransaction, this.billTransaction)
      .toPromise();
  }

  async getBillTransactionStatus(payloadData: any, module: any): Promise<any> {
    this.billTransaction = {
      amount: payloadData.price,
      userID: this.cookie.get("UserId"),
      imei: this.cookie.get("MAXMachineName"),
      merchantStorePosCode: this.cookie.get("MerchantPOSCode"),
      totalInvoiceAmount: payloadData.price,
      maxID: "",
      posEDCMachineId: this.cookie.get("POSIMEI"),
      merchantID: this.cookie.get("MerchantId"),
      securityToken: this.cookie.get("SecurityToken"),
      apiUrlPineLab: this.cookie.get("PineLabApiUrl"),
      module: module,
      allowedPaymentMode: 1,
      loginUserId: Number(this.cookie.get("UserId")),
      hsplocationId: this.cookie.get("HSPLocationId"),
      stationId: this.cookie.get("StationId"),
      transactionReferenceId: payloadData.transactionid || "",
    };
    return await this.http
      .post(PaymentApiConstants.uploadBillTransaction, this.billTransaction)
      .toPromise();
  }

  manualEntry() {}
}
