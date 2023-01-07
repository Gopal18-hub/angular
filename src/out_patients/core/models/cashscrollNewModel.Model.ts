export class CashScrollNewDetail {
 
    receiptNo: string;
    billno: string;
    billamount: number;
    refund: number;
    discountamount: number;
    planamount: number;
    plandiscount: number;
    balance: number;
    netamount: number;
    cash: number
    cheque: number;
    dd: number;
    creditCard: number;
    mobilePayment: number;
    onlinePayment: number;
    dues:number;
    tdsamount:number;
    operatorid: number;
    datetime: string;
    duesrec: number;
    hsPlocationid : number;
    depositamount : number;
    batchno: string;
    modifiedCheqAmt:string;
    modifiedCCAmt:string;
    modifiedDDAmt:string;
    modifiedCash:string;
    chequeNo:string;
    creditCardNo:string;
    modifiedCashPaymentMobile:string;
    modifiedCashMobileDetails:string;
    modifiedOnlinePayment:string;
    onlinePaymentDetails:string;
    operatorName:string;
    modifiedDonationAmount:string;
    donationAmount:number;
    upiAmt:number;
    modifiedUPIAmt:string;
    upiPaymentDetails:string;
    maxid:string;
    billDateTime:string;
    compName:string;
    modifiedDDNumber:string;
    sno?: number;
    rowhighlight?:string;
    constructor(
        receiptNo: string,
        billno: string,
        billamount: number,
        refund: number,
        discountamount: number,
        planamount: number,
        plandiscount: number,
        balance: number,
        netamount: number,
        cash: number,
        cheque: number,
        dd: number,
        creditCard: number,
        mobilePayment: number,
        onlinePayment: number,
        dues:number,
        tdsamount:number,
        operatorid: number,
        datetime: string,
        duesrec: number,
        hsPlocationid : number,
        depositamount : number,
        batchno: string,
        modifiedCheqAmt:string,
        modifiedCCAmt:string,
        modifiedDDAmt:string,
        modifiedCash:string,
        chequeNo:string,
        creditCardNo:string,
        modifiedCashPaymentMobile:string,
        modifiedCashMobileDetails:string,
        modifiedOnlinePayment:string,
        onlinePaymentDetails:string,
        operatorName:string,
        modifiedDonationAmount:string,
        donationAmount:number,
        upiAmt:number,
        modifiedUPIAmt:string,
        upiPaymentDetails:string,
        maxid:string,
        billDateTime:string,
        compName:string,
        modifiedDDNumber:string,
        sno:number,
        rowhighlight:string) {
      
      this.receiptNo = receiptNo;
      this.billno = billno;
      this.billamount = billamount;
      this.refund = refund;
      this.discountamount = discountamount;
      this.planamount = planamount;
      this.plandiscount = plandiscount;
      this.balance = balance;
      this.netamount = netamount;
      this.cash = cash;
      this.cheque = cheque;
      this.dd = dd;
      this.creditCard = creditCard;
      this.mobilePayment = mobilePayment;
      this.onlinePayment = onlinePayment;
      this.dues = dues;
      this.tdsamount = tdsamount;
      this.operatorid = operatorid;
      this.datetime = datetime;
      this.duesrec = duesrec;
      this.hsPlocationid = hsPlocationid;
      this.depositamount =depositamount;
      this.batchno = batchno;
      this.modifiedCheqAmt = modifiedCheqAmt;
      this.modifiedCCAmt = modifiedCCAmt;
      this.modifiedDDAmt = modifiedDDAmt;
      this.modifiedCash = modifiedCash;
      this.chequeNo = chequeNo;
      this.creditCardNo = creditCardNo;
      this.modifiedCashPaymentMobile = modifiedCashPaymentMobile;
      this.modifiedCashMobileDetails = modifiedCashMobileDetails;
      this.modifiedOnlinePayment = modifiedOnlinePayment;
      this.onlinePaymentDetails = onlinePaymentDetails;
      this.operatorName = operatorName;
      this.modifiedDonationAmount = modifiedDonationAmount;
      this.donationAmount = donationAmount;
      this.upiAmt = upiAmt;
      this.modifiedUPIAmt = modifiedUPIAmt;
      this.upiPaymentDetails = upiPaymentDetails;
      this.maxid = maxid;
      this.billDateTime = billDateTime;
      this.compName = compName;
      this.modifiedDDNumber = modifiedDDNumber;
      this.sno = sno;
      this.rowhighlight = rowhighlight;
    }
  }
  