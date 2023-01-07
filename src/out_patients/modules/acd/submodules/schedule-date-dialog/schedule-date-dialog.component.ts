import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup} from '@angular/forms';
import { MatDialogRef } from "@angular/material/dialog";
import { QuestionControlService } from '@shared/ui/dynamic-forms/service/question-control.service';

@Component({
  selector: 'out-patients-schedule-date-dialog',
  templateUrl: './schedule-date-dialog.component.html',
  styleUrls: ['./schedule-date-dialog.component.scss']
})
export class ScheduleDateDialogComponent implements OnInit {

  scheduleDateForm!: FormGroup;
  questions: any;

  constructor(private formService: QuestionControlService, private datepipe: DatePipe,public dialogRef: MatDialogRef<ScheduleDateDialogComponent>) { }
  scheduleDateFormData={
    dateformat: 'dd/MM/yyyy',
    title: "",
    type: "object",
    properties:{
      scheduleDate:{
        type: "date"    
      },     
     
    }
  }
  scheduleddate: any;

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.scheduleDateFormData.properties,
      {}
    );
    this.scheduleDateForm = formResult.form;
    this.questions = formResult.questions;

    let todaydate = new Date();
    this.scheduleDateForm.controls["scheduleDate"].setValue(todaydate);
  }
  ngAfterViewInit(): void {
    this.scheduleddate=""
    this.scheduleDateForm.controls["scheduleDate"].valueChanges.subscribe((value:any)=>{
      this.scheduleddate=value;
      
    })}
    save()
    {
      this.dialogRef.close({ data: this.scheduleddate })
    }
    cancel()
    {
     this.dialogRef.close();
    }

}
