export class PatientDepositDetails{
    id: number;
    amount: number;
    balanceamount: number;
    datetime: string;
    mop: number;
    receiptno: string;
    takenBy: string;
    isAdvanceTypeEnabled: boolean;
    advanceTypeId: number;
    advanceType: string;
    isSecurityDeposit: boolean;
  
  constructor(
    id: number,
    amount: number,
    balanceamount: number,
    datetime: string,
    mop: number,
    receiptno: string,
    takenBy: string,
    isAdvanceTypeEnabled: boolean,
    advanceTypeId: number,
    advanceType: string,
    isSecurityDeposit: boolean   
  )
  {
      this.id= id;
      this.amount= amount;
      this.balanceamount= balanceamount;
      this.datetime= datetime;
      this.mop= mop;
      this.receiptno= receiptno;
      this.takenBy= takenBy;
      this.isAdvanceTypeEnabled= isAdvanceTypeEnabled;
      this.advanceTypeId= advanceTypeId;
      this.advanceType= advanceType;
      this.isSecurityDeposit= isSecurityDeposit;     
  }
  }