import { Component, OnInit,NgZone } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QuestionControlService } from '../../../../../shared/ui/dynamic-forms/service/question-control.service';
import { MessageDialogService } from '../../../../../shared/ui/message-dialog/message-dialog.service';
import { MatDialog } from '@angular/material/dialog';
import { SaveexpiredpatientDialogComponent } from './saveexpiredpatient-dialog/saveexpiredpatient-dialog.component';
import { DeleteexpiredpatientDialogComponent } from './deleteexpiredpatient-dialog/deleteexpiredpatient-dialog.component';

@Component({
  selector: 'out-patients-expired-patient-check',
  templateUrl: './expired-patient-check.component.html',
  styleUrls: ['./expired-patient-check.component.scss']
})
export class ExpiredPatientCheckComponent implements OnInit {
  
  expiredpatientformdata={
    type:"object",
    title:"",
    properties:{
      maxid:{
        type:"string",

      },
      mobileno:{
        type:"number"
      },
      checkbox:{
        type:"checkbox",
        options:[{
          title:""
        }]
      },
      dateInput:{
        type:"date"
      },
      remarks:{
        type:"textarea"
      }
    }
  }

  expiredpatientForm!:FormGroup;
  questions:any;
  disableButton:boolean=true;

  constructor(
    private formService:QuestionControlService,
    private messagedialogservice:MessageDialogService,
    private zone:NgZone,
    private dialog:MatDialog
  ) { }

  ngOnInit(): void {
    let formResult= this.formService.createForm(
      this.expiredpatientformdata.properties,
      {}
    )
    this.expiredpatientForm=formResult.form;
    this.questions=formResult.questions;
  }
  
  ngAfterViewInit():void{
    this.zone.run(()=>{
      this.questions[0].elementRef.addEventListener(
        "change",
        this.onMaxidEnter.bind(this)
      );
    });
  }

  onMaxidEnter(){
    console.log('inside on maxidenter');
    console.log(this.expiredpatientForm.value.maxid);
    if(this.expiredpatientForm.value.maxid != null || this.expiredpatientForm.value.maxid !=undefined){
      console.log('inside if maxid method');
      this.disableButton=false;
    }else{
      this.disableButton=true;
    }
  }


  saveExpiredpatient(){
    console.log(this.expiredpatientForm.value);
    this.expiredpatientForm.controls["checkbox"].valueChanges.subscribe(value=>{
      console.log(value);
    })
    if(this.expiredpatientForm.value.checkbox == false){
      this.dialog.open(SaveexpiredpatientDialogComponent,{width:'25vw',height:'30vh'});
    }else{
      this.messagedialogservice.success('Data Saved');
    }
   
  }

  deleteExpiredpatient(){
    this.dialog.open(DeleteexpiredpatientDialogComponent,{width:'25vw',height:'30vh'});
  }

 

}
