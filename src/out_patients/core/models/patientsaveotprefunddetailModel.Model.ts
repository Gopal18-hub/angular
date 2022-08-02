export class sendotpforpatientrefund{
    billid: number;
    billno: string;
    stationid: number;
    locationid: number;
    userID: number;
    otp: number;
    insertdatetime: string;
    maxid: string;
    ptnType: string;
    ipid: number;
    flag: number;
    constructor(  
        billid: number,
        billno: string,
        stationid: number,
        locationid: number,
        userID: number,
        otp: number,
        insertdatetime: string,
        maxid: string,
        ptnType: string,
        ipid: number,
        flag: number)
        {
            this.billid = billid;
             this.billno = billno;
             this.stationid = stationid;
             this.locationid = locationid;
             this.userID = userID;
             this.otp = otp;
             this.insertdatetime = insertdatetime;
             this.maxid = maxid;
             this.ptnType = ptnType;
             this.ipid = ipid;
             this.flag = flag;
        }
  }