import { Component, OnInit } from '@angular/core';
import { Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessageDialogService } from '../../../../../src/shared/ui/message-dialog/message-dialog.service';
@Component({
  selector: 'out-patients-save-dialog',
  templateUrl: './save-dialog.component.html',
  styleUrls: ['./save-dialog.component.scss']
})
export class SavedialogComponent implements OnInit {

  constructor(
    // @Inject(MAT_DIALOG_DATA) public data: MatDialog,
  public dialog:MatDialog,
  public messagedialogservice:MessageDialogService
  ) { 
    // console.log(data);
    // let result=data;
    
  }

  ngOnInit(): void {
    // console.log(this.data);
   
  }
  savesuccess(){
    this.messagedialogservice.confirm('successtick','Saved Successfully');
  // this.dialog.open(SavesuccessdialogComponent,{width:'20vw',height:'40vh'})

  }

}
