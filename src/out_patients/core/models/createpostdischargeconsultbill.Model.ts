export class createpostdischargeconsultbill
{
    registrationNo: number;
    iaCode: string;
    hsplocationid: number;
    couponNo: number;
    billPreparedBy: number;
    stationid: number;
    referDoctorId: number;
    doctorId: number;
    specialisationId: number

    constructor(
    registrationNo: number,
    iaCode: string,
    hsplocationid: number,
    couponNo: number,
    billPreparedBy: number,
    stationid: number,
    referDoctorId: number,
    doctorId: number,
    specialisationId: number
    )
    {
        this.registrationNo = registrationNo;
        this.iaCode = iaCode;
        this.hsplocationid = hsplocationid;
        this.couponNo = couponNo;
        this.billPreparedBy = billPreparedBy;
        this.stationid = stationid;
        this.referDoctorId = referDoctorId;
        this.doctorId = doctorId;
        this.specialisationId = specialisationId;
    }
}