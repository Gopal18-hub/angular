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
import { MessageDialogService } from '../../../../../shared/ui/message-dialog/message-dialog.service';



@Component({
  selector: 'out-patients-dup-reg-merging',
  templateUrl: './dup-reg-merging.component.html',
  styleUrls: ['./dup-reg-merging.component.scss']
})
export class DupRegMergingComponent implements OnInit {
  patientList: PatientSearchModel[] = [];
  results: any;
  isAPIProcess: boolean = false;
  mergebuttonDisabled:boolean=true;
  name = '';
  dob = '';
  email = '';
  healthId = '';
  aadhaarId = '';
  mobile = '';
  defaultUI:boolean=true;
  mergeplaceholder:string="Please search Name, Phone, DOB and Email ";

  mergeSearchForm = new FormGroup({
    name: new FormControl(''),
    mobile: new FormControl(''),
    dob: new FormControl(''),
    email: new FormControl(''),
    healthId: new FormControl(''),
    aadhaarId: new FormControl('')
  });
  @ViewChild("table") tableRows: any

  constructor(private http: HttpService,
    public matDialog: MatDialog,
    private patientServie: PatientService,
    private searchService: SearchService,
    private messageDialogService:MessageDialogService) { }

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
        title: 'Reg.Date',
        type: 'date'
      },
      firstName: {
        title: 'Name',
        type: 'string',
        tooltipColumn: "patientName",
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
        title: 'DOB',
        type: 'date'
      },
      place: {
        title: 'Address',
        type: 'string',
        tooltipColumn: "completeAddress",
      },
      phone: {
        title: 'Phone',
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
      this.messageDialogService.success("Patient has been merged successfully"); 
      this.getAllpatientsBySearch().subscribe((resultData) => {
        this.results = resultData;
        this.results = this.patientServie.getAllCategoryIcons(this.results);
        this.isAPIProcess = true;
      },(error:any)=>{
        //this.messageDialogService.error(error.error);
      });
     
    });
  }
  


  searchPatient(formdata: any) {
this.defaultUI = false;
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
      setTimeout(()=>{        
        this.tableRows.selection.changed.subscribe((res:any)=>{ 
          if(this.tableRows.selection.selected.length> 1)
          {
            this.mergebuttonDisabled = false;   
          }
          else{
            this.mergebuttonDisabled = true;   
          }
                       
        });
      }) ;
    },(error:any)=>{
      this.messageDialogService.error(error.error);
    });

  }

  getAllpatientsBySearch() {
    return this.http.get(ApiConstants.searchPatientApi('', '', this.name, this.mobile, this.dob, this.aadhaarId, this.healthId));
  }

}