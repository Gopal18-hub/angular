import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QuestionControlService } from '@shared/ui/dynamic-forms/service/question-control.service';
import { MessageDialogService } from '@shared/ui/message-dialog/message-dialog.service';
import { CookieService } from "@shared/services/cookie.service";
import { getAreaCounterDetailsModel } from '@core/models/getAreaCounterDetailsModel.Model';
import { HttpService } from '@shared/services/http.service';
import { ApiConstants } from '@core/constants/ApiConstants';
import { Title } from '@angular/platform-browser';
@Component({
  selector: 'out-patients-qms',
  templateUrl: './qms.component.html',
  styleUrls: ['./qms.component.scss']
})
export class QmsComponent implements OnInit {
  public area: getAreaCounterDetailsModel[] = [];
  public counter: getAreaCounterDetailsModel[] = [];
  qmsFormData = {
    title: "",
    type: "object",
    properties: {
      area: {
        type: "dropdown",
        required: true,
        options: this.area
      },
      counter: {
        type: "dropdown",
        required: true,
        options: this.counter
      }
    }
  };
  qmsform!: FormGroup;
  questions: any;
  hspId: any;
  constructor(
    private formService: QuestionControlService, 
    private matdialog: MessageDialogService, 
    private cookie: CookieService,
    private http: HttpService) { }

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.qmsFormData.properties,
      {}
    );
    this.qmsform = formResult.form;
    this.questions = formResult.questions;
    this.qmsform.controls["area"].value;
    this.hspId= Number(this.cookie.get("HSPLocationId"));
    console.log(this.hspId);
    this.getarea();
    this.getcounter();
  }
  okbtn()
  {
   
    this.matdialog.success( this.questions[0].options.title + ", " + this.questions[1].options.title + " Selected successfully");
    // this.clear();
  }
  clear()
  {
    this.qmsform.reset();
  }
  getarea(){
    this.http.get(ApiConstants.getarecounter(this.hspId)).subscribe((resultdata: any)=>{
      console.log(resultdata);
      this.area = resultdata.areaData;
      this.questions[0].options = this.area.map((l) =>{
        return { title: l.areaName, value: l.areaId}
      })
    })
  }
  getcounter(){
    this.http.get(ApiConstants.getarecounter(this.hspId)).subscribe((resultdata: any)=>{
      console.log(resultdata);
      this.counter = resultdata.areaWithCounterData;
      this.questions[1].options = this.counter.map((l) =>{
        return { title: l.counterName, value: l.counterId}
      })
    })
  }
}
