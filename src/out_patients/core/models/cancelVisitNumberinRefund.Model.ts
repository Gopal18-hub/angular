export class cancelVisitNumberinRefund{
    objVisitDataTable!: objVisitDataTable[];
    cancelReasonID: any;
    operatorID: any;
    locationId: any;
}

export class objVisitDataTable{
    id: any;
    visitId: any;
    visitno: string;
    deleted: any;
    ssn: string;
    uhid: string;
    registrationno: string;

    constructor(
    id: any,
    visitId: any,
    visitno: string,
    deleted: any,
    ssn: string,
    uhid: string,
    registrationno: string
    )
    {
        this.id = id;
        this.visitId = visitId;
        this.visitno = visitno;
        this.deleted = deleted;
        this.ssn = ssn;
        this.uhid = uhid;
        this.registrationno = registrationno;
    }
}