import { Component, OnInit } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpService } from '../../../../../../shared/services/http.service';

@Component({
  selector: 'out-patients-merge-dialog',
  templateUrl: './merge-dialog.component.html',
  styleUrls: ['./merge-dialog.component.scss']
})
export class MergeDialogComponent implements OnInit {

  constructor(private http: HttpService,) { }

  ngOnInit(): void {
  }
  mergePatients() {  
    
  }


 
  patientMerging() {
    return this.http.get(environment.PatientApiUrl + 'api/patient/patientmerging/' + "activateUserid" + "userid")
  }

}
