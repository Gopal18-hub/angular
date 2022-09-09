import { objdt, objtab_cancelbill } from "./saveRefundforParticularBill.Model";

export class billRefundforSingleItem{
    objDsSave!: objDsSave;
    amount!: number;
    decDiscountAmount!: number;
    otp!: number;
    hostName!: string;
    locationId!: number; 
    operatorId!: number;
    stationId!: number;
}

export class objDsSave{
    objtab_cancelbill!: objtab_cancelbill[];
    objdt!: objdt[];
}