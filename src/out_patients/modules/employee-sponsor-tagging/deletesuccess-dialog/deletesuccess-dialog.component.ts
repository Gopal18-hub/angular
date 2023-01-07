import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'out-patients-deletesuccess-dialog',
  templateUrl: './deletesuccess-dialog.component.html',
  styleUrls: ['./deletesuccess-dialog.component.scss']
})
export class DeletesuccessdialogComponent implements OnInit {

  constructor(private maticonregistrty:MatIconRegistry,private domsanitizer:DomSanitizer) { 
    this.maticonregistrty.addSvgIcon('round tick',
    this.domsanitizer.bypassSecurityTrustResourceUrl('assets/round tick.svg'))
  }

  ngOnInit(): void {
  }

}
