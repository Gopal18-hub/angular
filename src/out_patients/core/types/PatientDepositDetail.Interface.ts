export interface PatientDepositDetailInterface{
    id?: number;
    amount?: number;
    balanceamount?: number;
    datetime?: string;
    mop?: number;
    receiptno?: string;
    takenBy?: string;
    isAdvanceTypeEnabled?: boolean;
    advanceTypeId?: number;
    advanceType?: string;
    isSecurityDeposit?: boolean;
  }