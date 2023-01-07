import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'out-patients-savesuccess-dialog',
  templateUrl: './savesuccess-dialog.component.html',
  styleUrls: ['./savesuccess-dialog.component.scss']
})
export class SavesuccessdialogComponent implements OnInit {

  constructor(private maticonregistrty:MatIconRegistry,private domsanitizer:DomSanitizer) { 
    this.maticonregistrty.addSvgIcon('round tick',
    this.domsanitizer.bypassSecurityTrustResourceUrl('assets/round tick.svg'))
  }

  ngOnInit(): void {
  }

}
