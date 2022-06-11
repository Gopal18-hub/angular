import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { getallpatient } from '../../../../../out_patients/core/models/findpatientmodel';
import { environment } from '@environments/environment';
import { HttpService } from '../../../../../shared/services/http.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MaxTableComponent } from '../../../../../shared/ui/table/max-table.component';
import { RegistrationUnmergingComponent } from '../registration-unmerging/registration-unmerging.component';
import { MergeDialogComponent } from './merge-dialog/merge-dialog.component';



@Component({
  selector: 'out-patients-dup-reg-merging',
  templateUrl: './dup-reg-merging.component.html',
  styleUrls: ['./dup-reg-merging.component.scss']
})
export class DupRegMergingComponent implements OnInit {
  patientList: getallpatient[] = [];
  results: any;
  showpatient: boolean = false;
  name = '';
  dob = '';
  email = '';
  healthId = '';
  aadhaarId = '';
  mobile = '';

  @ViewChild("table") tableRows!: MaxTableComponent

  constructor(private http: HttpService, public matDialog: MatDialog) { }

  config: any = {
    selectBox: true,
    displayedColumns: ['maxid', 'ssn', 'date', 'firstName', 'age', 'gender', 'dob', 'place', 'phone', 'category'],
    columnsInfo: {
      maxid: {
        title: 'Max ID',
        type: 'number'
      },
      ssn: {
        title: 'SSN',
        type: 'number'
      },
      date: {
        title: 'Regn.Date',
        type: 'date'
      },
      firstName: {
        title: 'Name',
        type: 'string'
      },
      age: {
        title: 'Age',
        type: 'number'
      },
      gender: {
        title: 'Gender',
        type: 'string'
      },
      dob: {
        title: 'Date of Birth',
        type: 'date'
      },
      place: {
        title: 'Address',
        type: 'string'
      },
      phone: {
        title: 'Phone No.',
        type: 'number'
      },
      category: {
        title: 'Category'
      }
    }
  }

  ngOnInit(): void { }

  openDialog() {
   this.matDialog.open(MergeDialogComponent,{data:{name:"ABC"}})
  }

  searchPatient() {    
    this.patientList = [];
    this.getAllpatientsBySearch().subscribe((resultData) => {     
      this.results = resultData as getallpatient[];
      this.showpatient = true;     
    })  

  } 


  getAllpatientsBySearch() {
    return this.http.get(environment.PatientApiUrl + 'api/patient/getallpatientssearch?MaxId=' + '' + '&SSN=' + '' + '&Name=' + this.name + '&PhoneNumber=' + this.mobile + '&DOB=' + this.dob + '&AadhaarId=' + this.aadhaarId + '&HealthId=' + this.healthId);
  }
  patientMerging() {
    return this.http.get(environment.PatientApiUrl + 'api/patient/patientmerging/' + "activateUserid" + "userid")
  }
}