import { Component, OnInit } from '@angular/core';
import { PatientSearchModel } from  '../../../auth/core/models/patientsearchmodel';
import { environment } from '@environments/environment';
import { HttpService } from '../../../shared/services/http.service';
import { ApiConstants } from '../../../auth/core/constants/ApiConstants';

@Component({
  selector: 'auth-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  
  patientList:PatientSearchModel[]=[];
  showpatient:boolean=false;

  config: any  = {
    selectBox : false,
    displayedColumns: ['maxid', 'ssn', 'date', 'firstName', 'age','gender','dob','place','phone','category'],
    columnsInfo: {
      maxid : {
        title: 'MAX ID',
        type: 'number'        
      },
      ssn : {
        title: 'SSN',
        type: 'number'
      },
      date : {
        title: 'Regn.Date',
        type: 'date'
      },
      firstName : {
        title: 'Name',
        type: 'string'
      },
      age : {
        title: 'Age',
        type: 'number'
      },
      gender : {
        title: 'Gender',
        type: 'string'
      },
      dob : {
        title: 'Date of Birth',
        type: 'date'
      },
      place : {
        title: 'Address',
        type: 'string'
      },
      phone : {
        title: 'Phone No.',
        type: 'number'
      },
      category : {
        title: 'Category'
      }
    }
  }
  constructor(private http: HttpService) { }

  ngOnInit(): void {

    this.getAllpatients().subscribe((resultData) => {
      this.patientList  = resultData as PatientSearchModel[];
      this.showpatient = true; 
    
    });
  }

  getAllpatients(){
    return this.http.getExternal(ApiConstants.searchPatientDefault);    
  }

}
