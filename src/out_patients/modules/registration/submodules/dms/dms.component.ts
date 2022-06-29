import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'out-patients-dms',
  templateUrl: './dms.component.html',
  styleUrls: ['./dms.component.scss']
})
export class DMSComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<DMSComponent>, @Inject(MAT_DIALOG_DATA) public searchResults : any ) { }
  // searchResults:{verify:string,isVerified:string,remarks:string,view:string,fileName:string,docName:string,idType:string}[]=[] as any
  
  defaultUI:boolean = true;
  dmsmessage:string="No Records Found";
  dmsicon:string="placeholder";  
  MaxID:string | undefined;
  Firstname:string | undefined;
  Lastname:string | undefined;

  ngOnInit(): void {
    this.searchResults={verify:"no",isVerified:"no",remarks:"no",view:"no",fileName:"xyz",docName:"docname",idType:"idtype"};
  }
  
  
  config: any = {
    selectBox: false,
    displayedColumns: ['idType', 'docName', 'fileName', 'view', 'remark', 'mode', 'isVerified', 'verify'],
    columnsInfo: {
      idType: {
        title: 'Document Type',
        type: 'string'
      },
      docName: {
        title: 'Document Name',
        type: 'string'
      },
      fileName: {
        title: 'Original File Name',
        type: 'string'
      },
      view: {
        title: 'View',
        type: 'string'
      },
      remark: {
        title: 'Remarks ',
        type: 'string'
      },
      mode:
      {
        title: 'Mode',
        type: 'string'
      }
      ,
      isVerified:
      {
        title: 'Is Verified',
        type: 'checkbox'
      }
      ,
      verify:
      {
        title: 'Verify',
        type: 'button'
      }

    }
    }
    
uploadkycclick(){
      // this.closeModal('DMSpopup');
      window.open("http://172.25.1.22:7020/eDocsLogin.do?mode=eDocsSSOLoginForm&loginMode=SSO&userId=M026749&maxId="+this.MaxID+"&pFirstName="+this.Firstname+"&pLastName="+this.Lastname);
      }

RefreshDMSbtn()
{
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

