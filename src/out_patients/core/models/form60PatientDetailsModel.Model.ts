export class savepatientform60detailsModel{
    iacode: string;
    registrationno: number;
    hsplocationid: number;    
    operatorID: number;
    adhaarNo: string;
    isAppliedForPAN: number;
    panAppliedDate: string;
    panApplicationNo: string;
    agriculturalIncome: number;
    otherIncome: number;
    idDoc: number;
    idDocNumber: string;
    idNameOfAuthority: string;
    addressDoc:number;
    addressDocNumber:string;
    addressNameOfAuthority:string;
    remarks:string;
    transactionAmount:number;
    mop:string;
    opip:number;
    returnValue:number; 
    errorDetails:string;
    tickforsamedoc?:number;
    constructor(
        iacode: string,
        registrationno: number,
        hsplocationid: number,
        operatorID: number,
        adhaarNo: string,
        isAppliedForPAN: number,
        panAppliedDate: string,
        panApplicationNo: string,
        agriculturalIncome: number,
        otherIncome: number,
        idDoc: number,
        idDocNumber: string,
        idNameOfAuthority: string,
        addressDoc:number,
        addressDocNumber:string,
        addressNameOfAuthority:string,
        remarks:string,
        transactionAmount:number,
        mop:string,
        opip:number,
        returnValue:number,
        errorDetails:string,
        tickforsamedoc?:number,
    ) {
        this.iacode = iacode;
        this.registrationno= registrationno;
        this.hsplocationid = hsplocationid;
        this.operatorID = operatorID;
        this.adhaarNo = adhaarNo;
        this.isAppliedForPAN = isAppliedForPAN;
        this.panAppliedDate = panAppliedDate;
        this.panApplicationNo = panApplicationNo;
        this.agriculturalIncome = agriculturalIncome;
        this.otherIncome = otherIncome;
        this.idDoc = idDoc;
        this.idDocNumber = idDocNumber;
        this.idNameOfAuthority = idNameOfAuthority;
        this.addressDoc = addressDoc;
        this.addressDocNumber = addressDocNumber;
        this.addressNameOfAuthority = addressNameOfAuthority;
        this.remarks = remarks;
        this.transactionAmount = transactionAmount;
        this.mop = mop;
        this.opip = opip;
        this.returnValue = returnValue;
        this.errorDetails = errorDetails;
        this.tickforsamedoc = tickforsamedoc;
    }
  }