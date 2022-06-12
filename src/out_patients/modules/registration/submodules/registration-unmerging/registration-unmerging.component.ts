import { AfterViewInit, Component, OnInit } from '@angular/core';
import { getmergepatientsearch } from '../../../../../out_patients/core/models/getmergepatientsearch';
import { environment } from '@environments/environment';
import { HttpService } from '../../../../../shared/services/http.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';


@Component({
  selector: 'out-patients-registration-unmerging',
  templateUrl: './registration-unmerging.component.html',
  styleUrls: ['./registration-unmerging.component.scss']
})
export class RegistrationUnmergingComponent implements OnInit {

  unmergingList:getmergepatientsearch[]=[];
  showunmerge:boolean=false;
  maxid: any='' ;
  ssn:any='';

  config: any  = {
    dateformat: 'dd/MM/yyyy',
    selectBox : true,
    displayedColumns: ['maxid', 'ssn', 'date', 'patientName', 'age','gender','dob','place','phone','category'],
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
      patientName : {
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

    
  }

  searchPatient() {
    this.getAllunmergepatient().subscribe((resultData) => {
      this.unmergingList  = resultData as getmergepatientsearch[];
      this.showunmerge = true;  
      console.log(this.unmergingList);
    })
  }

   getAllunmergepatient(){
    return this.http.get(environment.PatientApiUrl+'api/patient/getmergepatientsearch?MaxId=' + this.maxid + '&SSN=' + this.ssn );    
  }

}
