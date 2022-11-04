import { Component, Inject, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { CookieService } from "@shared/services/cookie.service";

@Component({
  selector: "out-patients-dms",
  templateUrl: "./dms.component.html",
  styleUrls: ["./dms.component.scss"],
})
export class DMSComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<DMSComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      list: [];
      maxid: string;
      firstName: string;
      lastName: string;
    },
    private cookie: CookieService
  ) {}
  // searchResults:{verify:string,isVerified:string,remarkss:string,view:string,fileName:string,docName:string,idType:string}[]=[] as any

  defaultUI: boolean = true;
  dmsmessage: string = "No Records Found";
  dmsicon: string = "placeholder";

  ngOnInit(): void {
    // this.data.searchResults={verify:"no",isVerified:"no",remarkss:"no",view:"no",fileName:"xyz",docName:"docname",idType:"idtype"};
    console.log(this.data.list);
    let filename = this.data.list;
    // if (this.data.list.length >= 1 && (filename[0].fileName!="") {
    //   this.defaultUI = false;
    // }
  }

  config: any = {
    selectBox: false,
    displayedColumns: [
      "fileTypeName",
      "doumentName",
      "orginalFileName",
      "view",
      "remarks",
      "mode",
      "isVerified",
      "verify",
    ],
    columnsInfo: {
      fileTypeName: {
        title: "Document Type",
        type: "string",
      },
      doumentName: {
        title: "Document Name",
        type: "string",
      },
      orginalFileName: {
        title: "Original File Name",
        type: "string",
      },
      view: {
        title: "View",
        type: "button",
      },
      remarks: {
        title: "Remarks ",
        type: "string",
      },
      mode: {
        title: "Mode",
        type: "string",
      },
      isVerified: {
        title: "Is Verified",
        type: "checkbox",
      },
      verify: {
        title: "Verify",
        type: "button",
      },
    },
  };

  uploadkycclick() {
    // this.closeModal('DMSpopup');
    window.open(
      "http://172.25.1.22:7020/eDocsLogin.do?mode=eDocsSSOLoginForm&loginMode=SSO&userId=" +
        this.cookie.get('UserId') +
        "&maxId=" +
        this.data.maxid +
        "&pFirstName=" +
        this.data.firstName +
        "&pLastName=" +
        this.data.lastName
    );
  }

  RefreshDMSbtn() {
    // this.DMSlist =[];
    // this.registrationAPI.getDMSvalue(this.iacode,this.registrationno).subscribe((resultData) =>{
    // console.log(resultData);
    // for(var i = 0; i< resultData.length; i++)
    // {
    //   if(resultData[i].fileTypeId != 0)
    //   {
    //     this.hiddengrid=false;
    //     this.DMSlist.push(resultData[i]);
    //     if(resultData[i].isVerified !=0)
    //     {
    //       this.isDMSverify = true;
    //     }
    //   }
    // }
    //   console.log(this.DMSlist);
    // },error=>{
    //   console.log(error);
    // });
  }
}
