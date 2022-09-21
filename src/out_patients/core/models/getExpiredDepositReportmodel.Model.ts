export class getExpiredDepositReportModel {
  receiptno: string;
  uhid: string;
  datetime: string;
  usedOP: number;
  usedIP: number;
  refund: number;
  balance: number;
  executedBy: string;
  executedDate: string;
  checkedDD: string;
  episode: string;
  id: number;
  constructor(
    receiptno: string,
    uhid: string,
    datetime: string,
    usedOP: number,
    usedIP: number,
    refund: number,
    balance: number,
    executedBy: string,
    executedDate: string,
    checkedDD: string,
    episode: string,
    id: number
  ) {
    this.receiptno = receiptno;
    this.uhid = uhid;
    this.datetime = datetime;
    this.usedOP = usedOP;
    this.usedIP = usedIP;
    this.refund = refund;
    this.balance = balance;
    this.executedBy = executedBy;
    this.executedDate = executedDate;
    this.checkedDD = checkedDD;
    this.episode = episode;
    this.id = id;
  }
}
