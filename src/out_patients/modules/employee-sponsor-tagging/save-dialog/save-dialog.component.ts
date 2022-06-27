import { Component, OnInit } from '@angular/core';
import { Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessageDialogService } from '../../../../../src/shared/ui/message-dialog/message-dialog.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'out-patients-save-dialog',
  templateUrl: './save-dialog.component.html',
  styleUrls: ['./save-dialog.component.scss']
})
export class SavedialogComponent implements OnInit {

  constructor(
  public dialog:MatDialog,
  public messagedialogservice:MessageDialogService,
  private maticonregistry:MatIconRegistry,
  private domsanitizer:DomSanitizer
  ) { 
    this.maticonregistry.addSvgIcon('warning',
    this.domsanitizer.bypassSecurityTrustResourceUrl('assets/warning.svg'));
    
  }

  ngOnInit(): void {
   
   
  }
  savesuccess(){
    this.messagedialogservice.confirm('successtick','Saved Successfully');
  // this.dialog.open(SavesuccessdialogComponent,{width:'20vw',height:'40vh'})

  }

}
