import { Injectable } from "@angular/core";
import { HttpService } from "@shared/services/http.service";
import { CookieService } from "@shared/services/cookie.service";
import { Subject, takeUntil } from "rxjs";
import { PaymentApiConstants } from "../constants/PaymentApiConstants";

@Injectable({
  providedIn: "root",
})
export class PaytmRedirectionService {
  private readonly _destroying$ = new Subject<void>();
  constructor(private http: HttpService, public cookie: CookieService) {}
  Mid = this.cookie.get("PayTmMachineMID");
  Port = this.cookie.get("PayTmMachinePortName");
  BaudRate = this.cookie.get("PayTmMachineBaudRate");
  Parity = this.cookie.get("PayTmMachineParity");
  DataBits = this.cookie.get("PayTmMachineDataBits");
  StopBits = this.cookie.get("PayTmMachineStopBits");
  DebugMode = this.cookie.get("PayTmMachineDebugMode");
  PosId = this.cookie.get("PayTmMachinePOSId");

  redirectToPayTmHomeScreen() {
    window.location.href =
      "PaytmPayments:?requestId=123;method=showHomeScreen;mid=" +
      this.Mid +
      ";portName=" +
      this.Port +
      ";baudRate=" +
      this.BaudRate +
      ";parity=" +
      this.Parity +
      ";dataBits=" +
      this.DataBits +
      ";stopBits=" +
      this.StopBits +
      ";debugMode=1;posid=" +
      this.PosId;
  }

  redirectToPayTmDownloadHomeScreen() {
    window.location.href =
      "PaytmPayments:?requestId=123;method=downloadHomeScreen;mid=" +
      this.Mid +
      ";portName=" +
      this.Port +
      ";baudRate=" +
      this.BaudRate +
      ";parity=" +
      this.Parity +
      ";dataBits=" +
      this.DataBits +
      ";stopBits=" +
      this.StopBits +
      ";debugMode=1;posid=" +
      this.PosId;
  }

  redirectToPayTmDisplayTxn(orderId: any, order_amount: any, qrData: any) {
    window.location.href =
      "PaytmPayments:?requestId=123;method=displayTxnQr;mid=" +
      this.Mid +
      ";portName=" +
      this.Port +
      ";baudRate=" +
      this.BaudRate +
      ";parity=" +
      this.Parity +
      ";dataBits=" +
      this.DataBits +
      ";stopBits=" +
      this.StopBits +
      ";order_id=" +
      orderId +
      ";order_amount=" +
      order_amount +
      ";qrcode_id=" +
      qrData +
      ";currencySign=null;debugMode=1;posid=" +
      this.PosId;

    // window.location.href =
    //   "PaytmPayments:?requestId=123;method=displayTxnQr;mid=TES202001281820506353958;portName=COM4;baudRate=115200;parity=0;dataBits=8;stopBits=1;order_id=TES202001281820506353958;order_amount=1;qrcode_id=upi://pay? pa=testupineelkesh@paytm&pn=Test%20Merchant&mc=5641&tr=TES202001281820506353958&am=1.00&cu=INR&paytmqr=281005050101YJIR2MW5YPBC;currencySign=null;debugMode=1;posid=POS-1";
  }

  redirectToPayTmSuccessScreen(orderId: any, order_amount: any) {
    //PaytmPayments:?requestId=123;method=showSuccessScreen;mid=TES202001281820506353958;portName=COM4;baudRate=115200;parity=0;dataBits=8;stopBits=1;order_id=TES202001281820506353958;order_amount=1;currencySign=null;debugMode=1;posid=POS-1

    window.location.href =
      "PaytmPayments:?requestId=123;method=showSuccessScreen;mid=" +
      this.Mid +
      ";portName=" +
      this.Port +
      ";baudRate=" +
      this.BaudRate +
      ";parity=" +
      this.Parity +
      ";dataBits=" +
      this.DataBits +
      ";stopBits=" +
      this.StopBits +
      ";order_id=" +
      orderId +
      ";order_amount=" +
      order_amount +
      ";currencySign=null;debugMode=1;posid=" +
      this.PosId;
  }
}
