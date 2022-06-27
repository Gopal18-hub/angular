export class DMSrefreshModel{
    id:number;
    fileTypeName:string;
    fileTypeId: number;
    isVerified:number;
    doumentName:string;
    remarks:string;
    mode:string;
    orginalFileName:string;
    documentid:number;
    dms_Url:string;
    dms_DocScan:string;
    verify:number;
    // view:number;

    constructor(
        id:number,
        fileTypeName:string,
        fileTypeId: number,
        isVerified:number,
        doumentName:string,
        remarks:string,
        mode:string,
        orginalFileName:string,
        documentid:number,
        dms_Url:string,
        dms_DocScan:string,
        verify:number
        // view:number
        ){
            this.id=id;
            this.fileTypeName=fileTypeName;
            this.fileTypeId=fileTypeId;
            this.isVerified=isVerified;
            this.doumentName=doumentName;
            this.remarks=remarks;
            this.mode=mode;
            this.orginalFileName=orginalFileName;
            this.documentid=documentid;
            this.dms_Url=dms_Url;
            this.dms_DocScan=dms_DocScan;
            this.verify=verify;
            // this.view=view;
    }
}