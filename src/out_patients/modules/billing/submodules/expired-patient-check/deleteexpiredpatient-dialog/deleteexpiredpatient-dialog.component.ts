import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MessageDialogService } from '../../../../../../shared/ui/message-dialog/message-dialog.service';

@Component({
  selector: 'out-patients-deleteexpiredpatient-dialog',
  templateUrl: './deleteexpiredpatient-dialog.component.html',
  styleUrls: ['./deleteexpiredpatient-dialog.component.scss']
})
export class DeleteexpiredpatientDialogComponent implements OnInit {

  constructor(
    private maticonregistry:MatIconRegistry,
    private domsanitizer:DomSanitizer,
    private messagedialogservice:MessageDialogService
  ) { 
    this.maticonregistry.addSvgIcon('warning',this.domsanitizer.bypassSecurityTrustResourceUrl('assets/warning.svg'));
  }

  ngOnInit(): void {
  }
  deleteExpiredpatient(){
    this.messagedialogservice.success('Expired Patient Has Been Deleted');
  }

}
