import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QuestionControlService } from '../../../../../shared/ui/dynamic-forms/service/question-control.service';
import { MessageDialogService } from '../../../../../shared/ui/message-dialog/message-dialog.service';
import { SelectAtleastOneComponent } from './select-atleast-one/select-atleast-one.component';
import { MoreThanMonthComponent } from './more-than-month/more-than-month.component';
import { MatDialog } from '@angular/material/dialog';
import { billedLocationModel } from '@core/models/billedLocationModel.Model';
import { dispatchReportListModel } from '@core/models/dispatchReportListModel.Model';
import { dispatchReportSaveModel, objdispatchsave } from '@core/models/dispatchReportSaveModel.Model';
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
  public dispatchreport: dispatchReportListModel[] = [];
  public dispatchreportsave: dispatchReportSaveModel[] = [];
  public obj: objdispatchsave[] = [];
  config: any = {
    clickedRows: true,
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
  title: any;
  show: boolean = true;
  pendingreport: boolean = false;
  pendingbtn: boolean = true;
  exportbtn: boolean = true;
  savebtn: boolean = true;
  printbtn: boolean = true;

  @ViewChild("showtable") tableRows: any; 

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
        this.dispatchhistoryform.controls["billedlocation"].setValue({
          title: this.billedlocation[0].address3,
          value: this.billedlocation[0].hspLocationId
        });
      });
      
  }
  dispatchreportsearch()
  {
    this.show = true;
    this.pendingreport = false;

    // check for 31 popup
    var fdate = new Date(this.dispatchhistoryform.controls["fromdate"].value);
    var tdate = new Date(this.dispatchhistoryform.controls["todate"].value);
    var dif_in_time = tdate.getTime() - fdate.getTime();
    var dif_in_days = dif_in_time / ( 1000 * 3600 *24);

    if(this.dispatchhistoryform.controls["radio"].value == '' ||
      this.dispatchhistoryform.controls["radio"].value == undefined)
    {
      this.matdialog.open(SelectAtleastOneComponent, {width: "35vw", height: "35vh"});
    }
    else if(dif_in_days > 31)
    {
      this.matdialog.open(MoreThanMonthComponent, {width: "30vw", height:"30vh"});
      // this.msgdialog.error("Can not process requests for more than one month (31 Days), Please select the dates accordingly.");
    }
    this.title = "("+this.questions[4].options[this.dispatchhistoryform.value.radio - 1].title+")";
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
      this.pendingbtn = false;
      this.savebtn = false;
      this.exportbtn = false;
      this.printbtn = true;
    },
    (error)=>{
      console.log(error.error);
    }
    );
  }
  pendingreportsearch()
  {
    this.show = false;
    this.pendingreport = true;
    this.savebtn = true;
    this.exportbtn = false;
    this.printbtn = false;
  }
  clear()
  {
    this.dispatchhistoryform.reset();
    this.dispatchhistoryform.controls["fromdate"].setValue(this.today);
    this.dispatchhistoryform.controls["todate"].setValue(this.today);
    this.dispatchreport = [];
    this.show = true;
    this.pendingreport = false;
    this.pendingbtn = true;
    this.savebtn = true;
    this.exportbtn = true;
    this.printbtn = true;
    this.title = '';
    this.dispatchhistoryform.controls["billedlocation"].setValue({
      title: this.billedlocation[0].address3,
      value: this.billedlocation[0].hspLocationId
    });
  }
  savedialog()
  {
    console.log(this.dispatchreportsave);
    console.log(this.tableRows.selection.selected);
    console.log(this.tableRows.selection.selected.length);
    console.log(this.tableRows.selection.selected[0]);
    console.log(this.dispatchreportsave);
    this.msgdialog.success("Data Saved Succesully");
    console.log(this.getdispatchrequestbody());
    this.http.post(ApiConstants.dispatchreportsave, this.getdispatchrequestbody()).subscribe((res:any)=>{
      console.log(res);
    })
  }
  //as of now using hardcode value for test purpose
  getdispatchrequestbody(): dispatchReportSaveModel{
  
    return ( this.dispatchreportsave[0] = new dispatchReportSaveModel(
      this.obj[0] = new objdispatchsave(
        "222",
        "Jitu Testing ",
        "2022-06-27",
        "KAKARAN Singh",
        "3222",
        "2022-06-27",
        "Delhi .",
        "New Delhi .",
        true,
        "2222",
        "22",
        "22",
        "2022-06-27",
        "4343",
        "1"
      ),
      444
    ));
  }


}
