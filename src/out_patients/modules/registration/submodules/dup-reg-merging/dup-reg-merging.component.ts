import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { PatientSearchModel } from '../../../../../out_patients/core/models/patientSearchModel';
import { environment } from '@environments/environment';
import { HttpService } from '../../../../../shared/services/http.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MaxTableComponent } from '../../../../../shared/ui/table/max-table.component';
import { RegistrationUnmergingComponent } from '../registration-unmerging/registration-unmerging.component';
import { MergeDialogComponent } from './merge-dialog/merge-dialog.component';
import { ApiConstants } from '../../../../../out_patients/core/constants/ApiConstants';
import { FormControl, FormGroup } from '@angular/forms';
import { PatientService } from "../../../../../out_patients/core/services/patient.service";
import { SearchService } from '../../../../../shared/services/search.service';



@Component({
  selector: 'out-patients-dup-reg-merging',
  templateUrl: './dup-reg-merging.component.html',
  styleUrls: ['./dup-reg-merging.component.scss']
})
export class DupRegMergingComponent implements OnInit {
  patientList: PatientSearchModel[] = [];
  results: any;
  isAPIProcess: boolean = false;
  name = '';
  dob = '';
  email = '';
  healthId = '';
  aadhaarId = '';
  mobile = '';

  mergeSearchForm = new FormGroup({
    name: new FormControl(''),
    mobile: new FormControl(''),
    dob: new FormControl(''),
    email: new FormControl(''),
    healthId: new FormControl(''),
    aadhaarId: new FormControl('')
  });
  @ViewChild("table") tableRows!: MaxTableComponent

  constructor(private http: HttpService,
    public matDialog: MatDialog,
    private patientServie: PatientService,
    private searchService: SearchService) { }

  config: any = {
    actionItems: true,
    dateformat: 'dd/MM/yyyy',
    selectBox: true,
    displayedColumns: ['maxid', 'ssn', 'date', 'firstName', 'age', 'gender', 'dob', 'place', 'phone', 'categoryIcons'],
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
      categoryIcons: {
        title: 'Category',
        type: 'image',
        width: 34
      }
    }
  }

  ngOnInit(): void {
    this.searchService.searchTrigger.subscribe((formdata: any) => {
      this.searchPatient(formdata.data);
    });
  }

  openDialog() {

    const matdialogref =this.matDialog.open(MergeDialogComponent, { data: { tableRows: this.tableRows } });
    matdialogref.afterClosed().subscribe(result => {     
      this.getAllpatientsBySearch().subscribe((resultData) => {
        this.results = resultData;
        this.results = this.patientServie.getAllCategoryIcons(this.results);
        this.isAPIProcess = true;
      })
    });
  }
  


  searchPatient(formdata: any) {

    if (formdata['name'] == '' && formdata['phone'] == '' 
    && formdata['dob'] == '' && formdata['email'] == '')
    {
      return;
    }
    else if(formdata['name'] == '' && formdata['phone'] == '' 
    && formdata['dob'] != '' && formdata['email'] == '')
    {
      return;
    }
       
    this.patientList = [];
    this.name = formdata['name'];
    this.mobile  = formdata['phone'];
    this.email = formdata['email'];
    this.dob = formdata['dob'];
    this.getAllpatientsBySearch().subscribe((resultData) => {
      this.results = resultData;
      this.results = this.patientServie.getAllCategoryIcons(this.results);
      this.isAPIProcess = true;
    })

  }

  getAllpatientsBySearch() {
    return this.http.get(ApiConstants.searchPatientApi('', '', this.name, this.mobile, this.dob, this.aadhaarId, this.healthId));
  }

}