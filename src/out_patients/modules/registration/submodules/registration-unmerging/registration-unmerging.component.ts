import { AfterViewInit, Component, OnInit } from '@angular/core';
import { getmergepatientsearch } from '../../../../../out_patients/core/models/getmergepatientsearch';
import { environment } from '@environments/environment';
import { HttpService } from '../../../../../shared/services/http.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { ApiConstants } from '../../../../../out_patients/core/constants/ApiConstants';
import { PatientmergeModel } from '../../../../../out_patients/core/models/patientMergeModel';
import { CookieService } from '../../../../../shared/services/cookie.service';


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

   //child checkbox functionality for un merge
  onCheckUnMergepatientdata(event:any,unmergepatient:getmergepatientsearch){
  if(event.target.checked){
   this.count++;
    console.log(unmergepatient);
    this.unmergecheckedList.push(unmergepatient);
    this.unMergePostModel.push({id:unmergepatient.id});
    console.log(this.unmergecheckedList);
  
  }else{
    this.unmergeMastercheck.isSelected = false;
    this.unmergecheckedList.forEach((item,index)=>{
      if(item.id === unmergepatient.id){
        this.unmergecheckedList.splice(index,1);
        this.unMergePostModel.splice(index,1);
      }
    })

    console.log(this.unmergecheckedList);
   this.count--;
  }

  if(this.count < 1){
    this.unmergebuttonDisabled=true;
  }
  else{
    this.unmergebuttonDisabled=false;
  }
  }

  //master check for un merge
  onCheckmasterUnMergedata(event:any,unmergepatientresultList:getmergepatientsearch){
  if(event.target.checked){
    this.unmergeMastercheck.isSelected= true;
    unmergepatientresultList['forEach']((item:any,index:any)=>{
      item.isSelected = true;
    })
  }else{
    if(unmergepatientresultList['length'] === this.unmergecheckedList.length){
      unmergepatientresultList['forEach']((item:any,index:any)=>{
        item.isSelected = false;
      })
    } 
  }
  }

  unMerge(){
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
      console.log(this.unmergingList);
    })
  }

   getAllunmergepatient(){
    return this.http.get(ApiConstants.mergePatientSearchApi(this.maxid, this.ssn));    
  }

  unMergePatient(unmergeJSONObject:PatientmergeModel[]){
    let userId = Number(this.cookie.get('UserId'));
    return this.http.post(ApiConstants.unmergePatientAPi(userId),unmergeJSONObject);
  }

}
