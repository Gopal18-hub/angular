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



@Component({
  selector: 'out-patients-registration-unmerging',
  templateUrl: './registration-unmerging.component.html',
  styleUrls: ['./registration-unmerging.component.scss']
})
export class RegistrationUnmergingComponent implements OnInit {  

  unmergingList:getmergepatientsearch[]=[];
  unMergePostModel:PatientmergeModel[]=[];
  unmergecheckedList:getmergepatientsearch[]=[];
  unMergepatientresultList:getmergepatientsearch[]=[];
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
  constructor(private http: HttpService, private cookie:CookieService) { }

  ngOnInit(): void {    
  }

  unMerge(){
    this.unMergePostModel=this.table.selection.selected.map((s:any)=>s.id);
    this.unMergePatient(this.unMergePostModel).subscribe((resultdata)=>{
      console.log(resultdata);
      this.unMergeresponse=resultdata;
  
    // this.openModal('unmerge-modal-1');
     this.unMergepatientresultList=[];
     this.unmergebuttonDisabled=true; 
    },error=>{
      console.log(error);
    });   
  }

  searchPatient() {
    this.getAllunmergepatient().subscribe((resultData) => {
      this.unmergingList  = resultData;
      this.isAPIProcess = true; 
      setTimeout(()=>{        
        this.table.selection.changed.subscribe((res:any)=>{        
         
          if(this.table.selection.selected.length>= 1)
              this.unmergebuttonDisabled = false;
              // this.unMergePostModel=this.table.selection.selected.map((s:any)=>s.id)
              // console.log(this.unMergePostModel);
        });
      }) ;
     
    })
  }

   getAllunmergepatient(){
    return this.http.get(ApiConstants.mergePatientSearchApi(this.maxid, this.ssn));    
  }

  unMergePatient(unmergeJSONObject:PatientmergeModel[]){
    let userId = 1;//Number(this.cookie.get('UserId'));
    return this.http.post(ApiConstants.unmergePatientAPi(userId),unmergeJSONObject);
  }

}
