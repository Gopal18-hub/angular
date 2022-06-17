import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CookieService } from '../../../../../../shared/services/cookie.service';
import { ApiConstants } from '../../../../../../out_patients/core/constants/ApiConstants';
import { PatientSearchModel } from '../../../../../../out_patients/core/models/patientSearchModel';
import { HttpService } from '../../../../../../shared/services/http.service';
import { PatientmergeModel } from '../../../../../../out_patients/core/models/patientMergeModel';
import { hotlistingreasonModel } from '../../../../../core/models/hotlistingreason.model';

@Component({
  selector: 'out-patients-hot-listing-dialog',
  templateUrl: './hot-listing-dialog.component.html',
  styleUrls: ['./hot-listing-dialog.component.scss']
})
export class HotListingDialogComponent implements OnInit {

  Hotlistform:hotlistingreasonModel[] = [];
  hotlistRemark: any;
  selectedid:any=[];  
  mergePostModel:any[]=[];
  primaryid :number = 0;

  constructor(private http: HttpService,
    @Inject(MAT_DIALOG_DATA) public data : any,
    private dialogRef: MatDialogRef<HotListingDialogComponent>,
    private cookie:CookieService,
    private messageDialogService:HotListingDialogComponent) { }

  ngOnInit(): void {
    console.log(this.data.tableRows.selection._selected,"tableDialoagdata")
    this.Hotlistform = this.data.tableRows.selection._selected;    
      this.Hotlistform.forEach(element => {
        this.selectedid.push(element.id);
      }); 
  }

}
