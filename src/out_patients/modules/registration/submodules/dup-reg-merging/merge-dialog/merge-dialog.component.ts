import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CookieService } from '../../../../../../shared/services/cookie.service';
import { ApiConstants } from '../../../../../../out_patients/core/constants/ApiConstants';
import { PatientSearchModel } from '../../../../../../out_patients/core/models/patientSearchModel';
import { HttpService } from '../../../../../../shared/services/http.service';


@Component({
  selector: 'out-patients-merge-dialog',
  templateUrl: './merge-dialog.component.html',
  styleUrls: ['./merge-dialog.component.scss']
})
export class MergeDialogComponent implements OnInit {
  selectedRows:PatientSearchModel[]=[];
  selectedid:any=[];  
  primaryid :number = 0;

  constructor(private http: HttpService,@Inject(MAT_DIALOG_DATA) public data : any,private dialogRef: MatDialogRef<MergeDialogComponent>,private cookie:CookieService) { }

  ngOnInit(): void {
    console.log(this.data.tableRows.selection._selected,"tableDialoagdata")
    this.selectedRows = this.data.tableRows.selection._selected;    
      this.selectedRows.forEach(element => {
        this.selectedid.push(element.id);
      });        
  }
  checboxSelected(event:any)
  {   
   this.primaryid = event.id;  
  }
  patientMerging() {   
    //let userId = Number(this.cookie.get('UserId'));
    let userId =105043
    this.http.post(ApiConstants.mergePatientApi(this.primaryid,userId),this.selectedid).subscribe((res)=>
    {
      this.dialogRef.close();      
    });
  }  
}
