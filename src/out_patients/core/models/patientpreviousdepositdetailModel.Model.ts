export class PatientPreviousDepositDetail {
  receiptno: number;
  uhid: string;
  dateTime: string;
  deposit: number;
  usedOP: number;
  usedIP: number;
  refund: number;
  balance: number;
  gst: number;
  gstValue: number;
  amtType: string;
  donationRefundFlag: number;
  advanceTypeId: number;
  advanceType: string;
  remarks: string;
  recordSequence: number;
  depositRefund: string;
  cashTransactionID: number;
  paymentType: string;
  serviceTypeName: string;
  operatorName: string;
  parentID: number;

  constructor(
    receiptno: number,
    uhid: string,
    dateTime: string,
    deposit: number,
    usedOP: number,
    usedIP: number,
    refund: number,
    balance: number,
    gst: number,
    gstValue: number,
    amtType: string,
    donationRefundFlag: number,
    advanceTypeId: number,
    advanceType: string,
    remarks: string,
    recordSequence: number,
    depositRefund: string,
    cashTransactionID: number,
    paymentType: string,
    serviceTypeName: string,
    operatorName: string,
    parentID: number,
  ) {
    this.receiptno = receiptno,
      this.uhid = uhid,
      this.dateTime = dateTime,
      this.deposit = deposit,
      this.usedOP = usedOP,
      this.usedIP = usedIP,
      this.refund = refund,
      this.balance = balance,
      this.gst = gst,
      this.gstValue = gstValue,
      this.amtType = amtType,
      this.donationRefundFlag = donationRefundFlag,
      this.advanceTypeId = advanceTypeId,
      this.advanceType = advanceType,
      this.remarks = remarks,
      this.recordSequence = recordSequence,
      this.depositRefund = depositRefund,
      this.cashTransactionID = cashTransactionID,
      this.paymentType = paymentType,
      this.serviceTypeName = serviceTypeName,
      this.operatorName = operatorName,
      this.parentID = parentID

  }
}