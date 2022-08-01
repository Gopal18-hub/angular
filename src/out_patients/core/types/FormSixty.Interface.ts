export interface PatientFormSixtyInterface{
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

  export interface getform60masterdataInterface{
    getForm60MasterDataPOI1: getForm60MasterDataPOI;
    getForm60MasterDataPOA1: getForm60MasterDataPOA;
  }

  export interface getForm60MasterDataPOI{
    id: number,
    docName: string
  }
  export interface getForm60MasterDataPOA{
    id: number,
      docName: string
  }