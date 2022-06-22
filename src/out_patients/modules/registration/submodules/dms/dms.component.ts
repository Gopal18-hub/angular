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
  ngOnInit(): void {
    this.searchResults.push({verify:"no",isVerified:"no",remarks:"no",view:"no",fileName:"xyz",docName:"docname",idType:"idtype"});
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
    
  }

