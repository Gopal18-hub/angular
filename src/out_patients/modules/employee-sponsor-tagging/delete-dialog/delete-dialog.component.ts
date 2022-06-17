import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconRegistry } from '@angular/material/icon';

import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'out-patients-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss']
})
export class DeletedialogComponent implements OnInit {

  constructor(private matIconRegistry: MatIconRegistry,private domsanitiser:DomSanitizer) {
  //   this.matIconregistry
  // .addSvgIcon('warning','assets/warning.svg');
  this.matIconRegistry.addSvgIcon(
    'warning',
    this.domsanitiser.bypassSecurityTrustResourceUrl('assets/warning.svg')
    );
  
   }
   
  ngOnInit(): void {
  }


}
