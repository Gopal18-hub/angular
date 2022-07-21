import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QuestionControlService } from '@shared/ui/dynamic-forms/service/question-control.service';
import { MessageDialogService } from '@shared/ui/message-dialog/message-dialog.service';
import { CookieService } from "@shared/services/cookie.service";
import { getAreaCounterDetailsModel } from '@core/models/getAreaCounterDetailsModel.Model';
import { HttpService } from '@shared/services/http.service';
import { ApiConstants } from '@core/constants/ApiConstants';
import { Title } from '@angular/platform-browser';
import { Subject, takeUntil } from 'rxjs';
import { qmsEnableCounterModel } from '@core/models/qmsEnableCounterModel.Model';
@Component({
  selector: 'out-patients-qms',
  templateUrl: './qms.component.html',
  styleUrls: ['./qms.component.scss']
})
export class QmsComponent implements OnInit {
  public area: getAreaCounterDetailsModel[] = [];
  public counter: getAreaCounterDetailsModel[] = [];
  public areacounter: any[] = [];
  public enableCounter!: qmsEnableCounterModel;
  qmsFormData = {
    title: "",
    type: "object",
    properties: {
      area: {
        title: "Area",
        type: "dropdown",
        required: true,
        options: this.area,
        placeholder: "Select"
      },
      counter: {
        title: "Counter",
        type: "dropdown",
        required: true,
        options: this.counter,
        placeholder: "Select"
      }
    }
  };
  qmsform!: FormGroup;
  questions: any;
  hspId: any;
  userId: any;
  private readonly _destroying$ = new Subject<void>();
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
    this.hspId = Number(this.cookie.get("HSPLocationId"));
    this.userId = Number(this.cookie.get("UserId"));
    this.getarea();
    this.qmsform.controls["counter"].disable();
    this.qmsform.controls["area"].setErrors({required: true});
    this.questions[0].customErrorMessage = "Area Required";
  }
  ngAfterViewInit(): void{
    
    this.qmsform.controls["area"].valueChanges.subscribe((value)=>{
      this.qmsform.controls["counter"].enable();
      this.counter = this.areacounter.filter( e => {
        return e.areaId == value;
      })
      this.questions[1].options = this.counter.map((l:any) =>{
        return { title: l.counterName, value: l.counterId}
      });
    })
  }
  okbtn()
  {
    this.http.post(ApiConstants.enablecounter, this.getqmsrequestbody())
    .pipe(takeUntil(this._destroying$))
    .subscribe((resultdata: any) => {
      var area = this.areacounter.find(e => e.areaId == this.qmsform.controls["area"].value);
      var counter = this.areacounter.find(e => e.counterId == this.qmsform.controls["counter"].value);
      this.matdialog.success( area?.areaName + ", " + counter?.counterName + " Selected successfully");
    },
    error => {
      if(error.error.text == "Record Saved Successfully")
      {
        var area = this.areacounter.find(e => e.areaId == this.qmsform.controls["area"].value);
        var counter = this.areacounter.find(e => e.counterId == this.qmsform.controls["counter"].value);
        this.matdialog.success( area?.areaName + ", " + counter?.counterName + " Selected successfully");
      }
    })
  }
  clear()
  {
    this.qmsform.reset();
    this.qmsform.controls["counter"].disable();
  }
  getarea(){
    this.http.get(ApiConstants.getarecounter(18))
    .pipe(takeUntil(this._destroying$))
    .subscribe((resultdata: any)=>{
      console.log(resultdata);
      this.areacounter = resultdata.areaWithCounterData;
      this.area = resultdata.areaData;
      this.questions[0].options = resultdata.areaData.map((l:any) =>{
        return { title: l.areaName, value: l.areaId}
      });
    });
  }

  getqmsrequestbody(): qmsEnableCounterModel{
    return (this.enableCounter = new qmsEnableCounterModel(
      7,
      this.qmsform.value.area,
      this.qmsform.value.counter,
      9923,
      1
    ))
  }
}
