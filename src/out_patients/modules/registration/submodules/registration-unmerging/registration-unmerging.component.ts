import { AfterViewInit, Component, OnInit,ViewChild } from '@angular/core';
import { getmergepatientsearch } from '../../../../../out_patients/core/models/getmergepatientsearch';
import { environment } from '@environments/environment';
import { HttpService } from '../../../../../shared/services/http.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { ApiConstants } from '../../../../../out_patients/core/constants/ApiConstants';
import { PatientmergeModel } from '../../../../../out_patients/core/models/patientMergeModel';
import { CookieService } from '../../../../../shared/services/cookie.service';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { MatTabLabel } from '@angular/material/tabs';
import { PatientService } from "../../../../../out_patients/core/services/patient.service";
import { SearchService } from '../../../../../shared/services/search.service';



@Component({
  selector: 'out-patients-registration-unmerging',
  templateUrl: './registration-unmerging.component.html',
  styleUrls: ['./registration-unmerging.component.scss']
})
export class RegistrationUnmergingComponent implements OnInit {  

  unmergingList:getmergepatientsearch[]=[];
  unMergePostModel:PatientmergeModel[]=[]; 
  isAPIProcess:boolean=false;
  unmergebuttonDisabled:boolean=true;
  unMergeresponse:string='';
  maxid: any='' ;
  ssn:any='';
  unmergeMastercheck={
    isSelected:false
  }
  count:number=0;

  unmergeSearchForm = new FormGroup({
    maxid: new FormControl(''),   
    ssn: new FormControl('')
  });

  @ViewChild('table') table:any;

  config: any  = {
    actionItems:true,
    dateformat: 'dd/MM/yyyy',
    selectBox : true,
    displayedColumns: ['maxid', 'ssn', 'date', 'patientName', 'age','gender','dob','place','phone','categoryIcons'],
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
      categoryIcons : {
        title: 'Category',
        type:'image',
        width:34
      }
    }
  }  
  constructor(private http: HttpService,
     private cookie:CookieService,
      private patientServie: PatientService,
      private searchService :SearchService) { }

  ngOnInit(): void { 
    this.searchService.searchTrigger.subscribe((formdata)=>{
        this.searchPatient(formdata.data);
    });   
  }
  
  unMerge(){

    this.table.selection.selected.map((s:any)=>{
      this.unMergePostModel.push({id:s.id})});

    this.unMergePatient(this.unMergePostModel).subscribe((resultdata)=>{
      console.log(resultdata);
      this.unMergeresponse=resultdata;  
    // this.openModal('unmerge-modal-1');   
     this.unmergebuttonDisabled=true; 
     this.unmergingList = [];
     this.unMergePostModel = [];
     
    },error=>{
      console.log(error);
    });   
  }

  searchPatient(formdata:any) {
    if(formdata['maxID'] == '' && formdata['ssn'] == '' )
      return;
      this.maxid = formdata['maxID'];
      this.ssn = formdata['ssn'];
    this.getAllunmergepatient().subscribe((resultData) => {
      this.unmergingList  = resultData;
      this.isAPIProcess = true; 
      this.unmergingList = this.patientServie.getAllCategoryIcons(this.unmergingList,getmergepatientsearch);
      setTimeout(()=>{        
        this.table.selection.changed.subscribe((res:any)=>{ 
          if(this.table.selection.selected.length>= 1)
              this.unmergebuttonDisabled = false;             
        });
      }) ;
     
    });
    
  }

   getAllunmergepatient(){   
    return this.http.get(ApiConstants.mergePatientSearchApi(this.maxid, this.ssn));    
  }

  unMergePatient(unmergeJSONObject:PatientmergeModel[]){
    let userId = 1;//Number(this.cookie.get('UserId'));
    return this.http.post(ApiConstants.unmergePatientAPi(userId),unmergeJSONObject);
  }

}
