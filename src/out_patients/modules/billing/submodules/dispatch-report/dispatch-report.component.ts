import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QuestionControlService } from '../../../../../shared/ui/dynamic-forms/service/question-control.service';
import { MessageDialogService } from '../../../../../shared/ui/message-dialog/message-dialog.service';
import { SelectAtleastOneComponent } from './select-atleast-one/select-atleast-one.component';
import { MoreThanMonthComponent } from './more-than-month/more-than-month.component';
import { MatDialog } from '@angular/material/dialog';
import { billedLocationModel } from '@core/models/billedLocationModel.Model';
import { dispatchReportListModel } from '@core/models/dispatchReportListModel.Model';
import { ApiConstants } from '@core/constants/ApiConstants';
import { HttpService } from "@shared/services/http.service";
import { takeUntil } from "rxjs/operators";
import { Subject, Observable } from "rxjs";
import { DatePipe } from '@angular/common';
@Component({
  selector: 'out-patients-dispatch-report',
  templateUrl: './dispatch-report.component.html',
  styleUrls: ['./dispatch-report.component.scss']
})
export class DispatchReportComponent implements OnInit {

  public billedlocation: billedLocationModel[] = [];
  public dispatchreport:dispatchReportListModel[] =[]
  config: any = {
    dateformat: "dd/MM/yyyy",
    selectBox: true,
    displayedColumns: [
      "sno",
      "itemName",
      "orderdatetime",
      "ptnName",
      "billno",
      "receiveddatetime",
      "dispatcheddatetime",
      "dispatchplace",
      "remarks"
    ],
    columnsInfo: {
      sno: {
        title: "S.No",
        type: "number",
      },
      itemName: {
        title: "Test Name",
        type: "string",
      },
      orderdatetime: {
        title: "Date Time",
        type: "date",
      },
      ptnName: {
        title: "Patient Name",
        type: "string",
      },
      billno: {
        title: "Max ID",
        type: "string",
      },
      receiveddatetime: {
        title: "Received Date Time",
        type: "date",
      },
      dispatcheddatetime: {
        title: "Dispatched Date Time",
        type: "date",
      },
      dispatchplace: {
        title: "Dispatch Place",
        type: "string",
      },
      remarks: {
        title: "Remarks",
        type: "string"
      }
    },
  };

  diapatchHistoryFormData = {
    title: "",
    type: "object",
    properties: {
      billedlocation: {
        type: "autocomplete",
        options: this.billedlocation,
        allowSearchInput: true
      },
      checkbox1: {
        type: "checkbox",
        options: [{
          title: ''
        }]
      },
      fromdate: {
        type: "date",
      },
      todate: {
        type: "date"
      },
      radio: {
        type: "radio",
        required: false,
        options: [
          { title: "OPD", value: 1 },
          { title: "Pre-Adt", value: 2 },
          { title: "Triage", value: 3 }
        ]
      },
    },
  };
  dispatchhistoryform!: FormGroup;
  questions: any;
  private readonly _destroying$ = new Subject<void>();
  constructor( private formService: QuestionControlService, private msgdialog: MessageDialogService, private matdialog: MatDialog, private http: HttpService, private datepipe: DatePipe) { }
  today: any;
  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.diapatchHistoryFormData.properties,
      {}
    );
    this.dispatchhistoryform = formResult.form;
    this.questions = formResult.questions;
    this.today = new Date();
    this.dispatchhistoryform.controls["fromdate"].setValue(this.today);
    this.dispatchhistoryform.controls["todate"].setValue(this.today);
    this.getBilledLocation();
  }
  ngAfterViewInit(): void{
    
  }
  getBilledLocation() {
    this.http
      .get(ApiConstants.locationname)
      .pipe(takeUntil(this._destroying$))
      .subscribe((resultData: any) => {
        this.billedlocation = resultData;
        console.log(this.billedlocation);
        this.questions[0].options = this.billedlocation.map((l) => {
          return { title: l.address3, value: l.hspLocationId };
        });
      });
  }
  dispatchreportsearch()
  {
    console.log(this.dispatchhistoryform.value);

    // check for 31 popup
    var fdate = new Date(this.dispatchhistoryform.controls["fromdate"].value);
    var tdate = new Date(this.dispatchhistoryform.controls["todate"].value);
    var dif_in_time = tdate.getTime() - fdate.getTime();
    var dif_in_days = dif_in_time / ( 1000 * 3600 *24);
    if(this.dispatchhistoryform.controls["billedlocation"].value == '' || 
        this.dispatchhistoryform.controls["billedlocation"].value == undefined ||
        this.dispatchhistoryform.controls["radio"].value == '' ||
        this.dispatchhistoryform.controls["radio"].value == undefined)
    {
      this.matdialog.open(SelectAtleastOneComponent, {width: "35vw", height: "35vh"});
    }
    // else if(dif_in_days > 31)
    // {
    //   this.matdialog.open(MoreThanMonthComponent, {width: "30vw", height:"30vh"});
    //   this.msgdialog.error("Can not process requests for more than one month (31 Days), Please select the dates accordingly.");
    // }
    this.http.get(ApiConstants.getdispatchreport(this.datepipe.transform(this.dispatchhistoryform.controls["fromdate"].value, "YYYY-MM-dd"),
    this.datepipe.transform(this.dispatchhistoryform.controls["todate"].value, "YYYY-MM-dd"), 
    this.dispatchhistoryform.value.billedlocation.value,
    this.dispatchhistoryform.value.radio)).subscribe((resultdata:any)=>{
      console.log(resultdata);
      this.dispatchreport = resultdata.dispatchlist;
      console.log(resultdata.dispatchlist.length);
      for(var i = 0; i < resultdata.dispatchlist.length; i++)
      {
        this.dispatchreport[i].sno = i + 1;
        console.log(this.dispatchreport[i].sno);
      }
      console.log(this.dispatchreport);
    });
  }
  clear()
  {
    this.dispatchhistoryform.reset();
    this.dispatchhistoryform.controls["fromdate"].setValue(this.today);
    this.dispatchhistoryform.controls["todate"].setValue(this.today);
    this.dispatchreport = [];
  }
  savedialog()
  {
    this.msgdialog.success("Data Saved Succesully");
  }
}
