export class PatientDMSDetails{
    doumentName:string ;
    remarks:string;
    mode:string;
    orginalFileName : string;
    documentid : number;
    id:number;
    fileTypeName:string;
    fileTypeId: number;
    isVerified:number;   
       dms_URL:string;
    dms_DocScan:string;
    

    constructor(
        id:number,
        fileTypeName:string,
        fileTypeId:number,
        isVerified:number,
        doumentName:string,
        remarks:string,
        mode:string,
        orginalFileName:string,
        documentid: number,
        dms_URL:string,
        dms_DocScan:string,
        ){
            this.id=id;
            this.fileTypeName=fileTypeName;
            this.fileTypeId=fileTypeId;
            this.isVerified=isVerified;
            this.dms_URL=dms_URL;
            this.dms_DocScan=dms_DocScan;
            this.doumentName:doumentName;
            this.remarks:remarks;
            this.mode:mode;
            this.orginalFileName:orginalFileName
            this.documentid: documentid
    }
}