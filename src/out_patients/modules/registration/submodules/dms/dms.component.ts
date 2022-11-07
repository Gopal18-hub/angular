import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { CookieService } from "@shared/services/cookie.service";
import { ApiConstants } from "@core/constants/ApiConstants";
import { HttpService } from "@shared/services/http.service";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";
@Component({
  selector: "out-patients-dms",
  templateUrl: "./dms.component.html",
  styleUrls: ["./dms.component.scss"],
})
export class DMSComponent implements OnInit {
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
        tooltipColumn: 'fileTypeName'
      },
      doumentName: {
        title: "Document Name",
        type: "string",
        tooltipColumn: 'doumentName'
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
        type: "Changeablebutton",
      },
    },
  };
  constructor(
    private http: HttpService,
    private msgdialog: MessageDialogService,
    private dialogRef: MatDialogRef<DMSComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      list: any;
      maxid: string;
      firstName: string;
      lastName: string;
    },
    private cookie: CookieService
  ) { }
  @ViewChild("table") table: any;

  ngOnInit(): void {
    console.log(this.data.list);
    this.data.list.forEach((item: any) => {
      item.isViewed = 0;
      if(item.isVerified == 0)
      {
        item.verify = 'Verify';
      }
      else{
        item.verify = 'UnVerify';
      }
    })
    let filename = this.data.list;
  }


  uploadkycclick() {
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
    this.data.list = [];
    this.http.get(ApiConstants.PatientDMSDetail(
      this.data.maxid.split('.')[0],
      Number(this.data.maxid.split('.')[1])
    ))
    .subscribe(res => {
      console.log(res);
      this.data.list = res;
      this.data.list.forEach((item: any) => {
        item.isViewed = 0;
        if(item.isVerified == 0)
        {
          item.verify = 'Verify';
        }
        else{
          item.verify = 'UnVerify';
        }
      })
    })
  }

  ngAfterViewInit(): void{
    this.table.buttonClickTrigger.subscribe((res: any) =>{
      console.log(res);
      if(res.col == 'verify')
      { 
        if(res.data.isViewed == 0)
        {
          this.msgdialog.error('First View the Document ! ');
        }
        else
        {
          this.http.get(ApiConstants.verifydmsdocument(
            Number(res.data.id),
            Number(res.data.isVerified) == 0? 1: 0,
            this.data.maxid.split('.')[0],
            Number(this.data.maxid.split('.')[1]),
            Number(this.cookie.get('UserId'))
          ))
          .subscribe(result => {
            this.data.list[this.data.list.map((i: any) => i.id).indexOf(res.data.id)].isVerified = result[result.map((i: any) => i.id).indexOf(res.data.id)].isVerified;
            if(this.data.list[this.data.list.map((i: any) => i.id).indexOf(res.data.id)].isVerified == 0)
            {
              this.data.list[this.data.list.map((i: any) => i.id).indexOf(res.data.id)].verify = 'Verify';
            }
            else
            {
              this.data.list[this.data.list.map((i: any) => i.id).indexOf(res.data.id)].verify = 'UnVerify';
            }
            this.data = {...this.data};
          })
        }
      }
      if(res.col == 'view')
      {
        window.open(
          res.data.dmS_DocScan +
          "&maxId=" +
          this.data.maxid + 
          "&fileTypeId=" +
          res.data.fileTypeId +
          "&docId=" +
          res.data.documentid +
          "&preventCache=" +
          1667641191889
        );
        res.data.isViewed = 1;
      }
    })
  }
}
