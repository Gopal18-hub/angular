import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, OnDestroy } from '@angular/core';
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
import { DatePipe } from "@angular/common";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";


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
  showmergespinner:boolean=true;
  mergeicon:string="placeholder";
  mergingmessage:string="Please search Name, Phone, DOB and Email ";

  mergeSearchForm = new FormGroup({
    name: new FormControl(''),
    mobile: new FormControl(''),
    dob: new FormControl(''),
    email: new FormControl(''),
    healthId: new FormControl(''),
    aadhaarId: new FormControl('')
  });
  @ViewChild("table") tableRows: any
 
  private readonly _destroying$ = new Subject<void>();

  constructor(private http: HttpService,
    public matDialog: MatDialog,
    private patientServie: PatientService,
    private searchService: SearchService,
    private messageDialogService:MessageDialogService,
    private datepipe : DatePipe) { }

  config: any = {    
    actionItems: true,
    actionItemList: [
      {
        title: "OP Billing",
        //actionType: "link",
        //routeLink: "",
      },
      {
        title: "Bill Details",
      },
      {
        title: "Deposits",
      },
      {
        title: "Admission",
      },
      {
        title: "Admission log",
      },
      {
        title: "Visit History",
      },
    ],
    dateformat: 'dd/MM/yyyy',
    selectBox: true,
    displayedColumns: ['maxid', 'ssn', 'date', 'fullname', 'age', 'gender', 'dob', 'place', 'phone', 'categoryIcons'],
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
        title: 'Reg Date',
        type: 'date'
      },
      fullname: {
        title: 'Name',
        type: 'string',
        tooltipColumn: "patientName",
      },
      age: {
        title: 'Age',
        type: 'number',
        disabledSort:true,
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
        type: 'number',
        disabledSort:true,
      },
      categoryIcons: {
        title: 'Category',
        type: 'image',
        width: 34,
        style: {
          width: "220px",
        },
        disabledSort:true,
      }
    }
  }

  ngOnInit(): void {
    this.searchService.searchTrigger
    .pipe(takeUntil(this._destroying$))
    .subscribe((formdata: any) => {
      this.searchPatient(formdata.data);
    });
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

  openDialog() {
    const matdialogref =this.matDialog.open(MergeDialogComponent, { data: { tableRows: this.tableRows } });
    matdialogref.afterClosed()
    .pipe(takeUntil(this._destroying$))
    .subscribe(result => {  
      var resultArr = result.split(',');
      if(resultArr[0] == "success"){
      this.messageDialogService.success("Max ID has been mapped with " + resultArr[1] ); 
      
      this.getAllpatientsBySearch()
      .pipe(takeUntil(this._destroying$))
      .subscribe((resultData) => {
        resultData = resultData.map((item:any) => {
          item.fullname = item.firstName + ' ' + item.lastName;
          return item;
        });
        this.results = resultData;
        this.results = this.patientServie.getAllCategoryIcons(this.results);
        this.isAPIProcess = true;
        this.mergebuttonDisabled = true;     
        this.tableRows.selection.clear();   
      });
    }   
   
  });
}
  


  searchPatient(formdata: any) {
    this.defaultUI=false;
    let dateOfBirth;

    if(formdata["dob"] != undefined || formdata["dob"] != null || formdata["dob"] != "")
    {
      dateOfBirth = this.datepipe.transform(formdata["dob"],'dd/MM/yyyy');
    }
    else{
      dateOfBirth = "";
    }
    // if (formdata['name'] == '' && formdata['phone'] == '' 
    // && formdata['dob'] == '' && formdata['email'] == '')
    // {
    //   return;
    // }
    // else 
    if(formdata['name'] == '' && formdata['phone'] == '' 
    && dateOfBirth != '' && formdata['email'] == '')
    {
      this.showmergespinner = false;  
      this.defaultUI = true;
      this.mergingmessage  = "Please enter Name / Phone in combination with DOB as search criteria";
      this.mergeicon  = "placeholder";
    }
       
    this.patientList = [];
    this.name = formdata['name'];
    this.mobile  = formdata['phone'];
    this.email = formdata['email'];
    this.dob = dateOfBirth || "";
   
    this.getAllpatientsBySearch()
    .pipe(takeUntil(this._destroying$))
    .subscribe((resultData) => {
      this.showmergespinner = false;  
      resultData = resultData.map((item:any) => {
        item.fullname = item.firstName + ' ' + item.lastName;
        return item;
      });   
      this.results = resultData;
      this.results = this.patientServie.getAllCategoryIcons(this.results);
      this.isAPIProcess = true;
     
      setTimeout(()=>{        
        this.tableRows.selection.changed
        .pipe(takeUntil(this._destroying$))
        .subscribe((res:any)=>{ 
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
      this.defaultUI = true;
      this.showmergespinner = false;
      this.mergingmessage  = "No records found";
      this.mergeicon  = "norecordfound";
    });

  }

  getAllpatientsBySearch() {
    return this.http.get(ApiConstants.searchPatientApi('', '', this.name, this.mobile, this.dob, this.aadhaarId, this.healthId));
  }

}