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

import { dispatchReportList } from '@core/types/dispatchReportList.Interface';
import { ApiConstants } from '@core/constants/ApiConstants';
import { HttpService } from "@shared/services/http.service";
import { takeUntil } from "rxjs/operators";
import { Subject, Observable } from "rxjs";
import { DatePipe } from '@angular/common';
import { CookieService } from '@shared/services/cookie.service';
@Component({
  selector: 'out-patients-dispatch-report',
  templateUrl: './dispatch-report.component.html',
  styleUrls: ['./dispatch-report.component.scss']
})
export class DispatchReportComponent implements OnInit {

  public billedlocation: billedLocationModel[] = [];
  // public dispatchreport: dispatchReportListModel[] = [];
  // public dispatchreport: dispatchReportListModel[] = [];
  public dispatchreportsave: dispatchReportSaveModel = new dispatchReportSaveModel();
  public obj: objdispatchsave[] = [];

  public dispatchreport: dispatchReportList = {dispatchlist:[]};
  public dispatchreportpending: dispatchReportList = {dispatchlist:[]}

  config: any = {
    clickedRows: true,
    actionItems: false,
    dateformat: "dd/MM/YYYY HH:mm:ss.ss",
    selectBox: true,
    displayedColumns: [
      "sNo",
      "itemName",
      "orderdatetime",
      "ptnName",
      "billno",
      "receive_date",
      "r_dispatchdate",
      "r_collection_location",
      "remarks"
    ],
    columnsInfo: {
      sNo: {
        title: "S.No",
        type: "number",
        style: {
          width: "3rem"
        }
      },
      itemName: {
        title: "Test Name",
        type: "string",
        tooltipColumn: "itemName",
        style: {
          width: "8rem"
        }
      },
      orderdatetime: {
        title: "Date Time",
        type: "date",
        tooltipColumn: "orderdatetime",
        style: {
          width: "8rem"
        }
      },
      ptnName: {
        title: "Patient Name",
        type: "string",
        tooltipColumn: "ptnName",
        style: {
          width: "8rem"
        }
      },
      billno: {
        title: "Max ID",
        type: "string",
        style: {
          width: "6rem"
        }
      },
      receive_date: {
        title: "Received Date Time",
        type: "input_date",
        style: {
          width: "11rem"
        }
      },
      r_dispatchdate: {
        title: "Dispatched Date Time",
        type: "input_date",
        style: {
          width: "12rem"
        }
      },
      r_collection_location: {
        title: "Dispatch Place",
        type: "dropdown",
        options: {
          title: "",
          value: this.billedlocation,
        },
        style: {
          width: "11rem"
        }
      },
      remarks: {
        title: "Remarks",
        type: "input"
      }
    },
  };

  diapatchHistoryFormData = {
    title: "",
    type: "object",
    properties: {
      billedlocation: {
        title: "Billed Location",
        type: "autocomplete",
        options: this.billedlocation,
        placeholder: "Select",
        required: true
      },
      checkbox1: {
        type: "checkbox",
        options: [{
          title: ''
        }]
      },
      fromdate: {
        title: "Date",
        type: "date",
        required: true
      },
      todate: {
        title: "Date",
        type: "date",
        required: true
      },
      radio: {
        type: "radio",
        required: false,
        options: [
          { title: "OPD", value: 1 },
          { title: "Pre-Adt", value: 2 },
          { title: "Triage", value: 3 }
        ],
        defaultValue: 1,
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
  userId:any;
  @ViewChild("showtable") tableRows: any; 

  private readonly _destroying$ = new Subject<void>();
  constructor( 
    private formService: QuestionControlService, 
    private msgdialog: MessageDialogService, 
    private matdialog: MatDialog, 
    private http: HttpService, 
    private datepipe: DatePipe,
    private cookie:CookieService) 
  {

  }
  today: any;
  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.diapatchHistoryFormData.properties,
      {}
    );
    this.dispatchhistoryform = formResult.form;
    this.questions = formResult.questions;
    this.today = new Date();
    this.userId = Number(this.cookie.get("UserId"));
    this.dispatchhistoryform.controls["fromdate"].setValue(this.today);
    this.dispatchhistoryform.controls["todate"].setValue(this.today);
    this.getBilledLocation();
  }
  ngAfterViewInit(): void{
    this.dispatchhistoryform.controls["radio"].valueChanges.subscribe(value=>{
      this.dispatchreport = {dispatchlist:[]};
    })
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
    this.title = "("+this.questions[4].options[this.dispatchhistoryform.value.radio - 1].title+")";
    console.log(this.dispatchhistoryform.value);
    if(this.dispatchhistoryform.value.billedlocation == '' ||
      this.dispatchhistoryform.value.billedlocation == undefined || 
      this.dispatchhistoryform.value.fromdate == '' ||
      this.dispatchhistoryform.value.fromdate == undefined ||
      this.dispatchhistoryform.value.todate == '' ||
      this.dispatchhistoryform.value.todate == undefined)
    {
      this.matdialog.open(SelectAtleastOneComponent, {width: "35vw", height: "35vh"});
    }
    else
    {
      // check for 31 popup
      var fdate = new Date(this.dispatchhistoryform.controls["fromdate"].value);
      var tdate = new Date(this.dispatchhistoryform.controls["todate"].value);
      var dif_in_time = tdate.getTime() - fdate.getTime();
      var dif_in_days = dif_in_time / ( 1000 * 3600 *24);
      if(dif_in_days > 310000000)
      {
      this.matdialog.open(MoreThanMonthComponent, {width: "30vw", height:"30vh"});
      // this.msgdialog.error("Can not process requests for more than one month (31 Days), Please select the dates accordingly.");
      }
      else
      {
        // this.title = "("+this.questions[4].options[this.dispatchhistoryform.value.radio - 1].title+")";
        // this.http.get(ApiConstants.getdispatchreport(this.datepipe.transform(this.dispatchhistoryform.controls["fromdate"].value, "YYYY-MM-dd"),
        // this.datepipe.transform(this.dispatchhistoryform.controls["todate"].value, "YYYY-MM-dd"), 
        // this.dispatchhistoryform.value.billedlocation.value,
        // this.dispatchhistoryform.value.radio)).subscribe((resultdata:any)=>{
        // console.log(resultdata);
        // this.dispatchreport = resultdata;
        // console.log(resultdata.dispatchlist.length);
        // for(var i = 0; i < this.dispatchreport.dispatchlist.length; i++)
        // {
        //   this.dispatchreport.dispatchlist[i].sNo = i + 1;
        //   console.log(this.dispatchreport.dispatchlist[i].sNo);
        // }
        // console.log(this.dispatchreportpending.dispatchlist);
        // console.log(this.dispatchreport);
        this.getDispatchReport();
        this.pendingbtn = false;
        this.savebtn = false;
        this.exportbtn = false;
        this.printbtn = true;
        
      // },
      // (error)=>{
      //   console.log(error.error);
      // }
      // );
      }
    }
  }
  pendingreportsearch()
  {
    this.title = "("+this.questions[4].options[this.dispatchhistoryform.value.radio - 1].title+")";
    this.show = false;
    this.getDispatchReport(); 
    this.pendingreport = true;
    this.savebtn = true;
    this.exportbtn = false;
    this.printbtn = false; 
  }

getDispatchReport(){
    this.dispatchreport = {} as dispatchReportList;
    this.http.get(ApiConstants.getdispatchreport(this.datepipe.transform(this.dispatchhistoryform.controls["fromdate"].value, "YYYY-MM-dd"),
    this.datepipe.transform(this.dispatchhistoryform.controls["todate"].value, "YYYY-MM-dd"), 
    this.dispatchhistoryform.value.billedlocation.value,
    this.dispatchhistoryform.value.radio)).subscribe((resultdata:any)=>{
      console.log(resultdata);
      this.dispatchreport = resultdata;
      console.log(resultdata.dispatchlist.length);
      for(var i = 0; i < this.dispatchreport.dispatchlist.length; i++)
      {
        this.dispatchreport.dispatchlist[i].sNo = i + 1;
        console.log(this.dispatchreport.dispatchlist[i].sNo);
      }
      debugger
      this.tableRows.config.columnsInfo.r_collection_location.options = this.billedlocation.map((l) => {
        return { title: l.address3, value: l.hspLocationId };
      });
      if(this.pendingreport == true && this.show == false)
      {
        this.dispatchreport.dispatchlist = this.dispatchreport.dispatchlist.filter((e:any)=>{
          return e.flag == 0;
        });
        console.log(this.dispatchreport.dispatchlist);
      }
      else if(this.pendingreport == false && this.show == true)
      {
        this.dispatchreport.dispatchlist = this.dispatchreport.dispatchlist.filter((e:any)=>{
          return e.flag >= 0;
        });
        console.log(this.dispatchreport.dispatchlist);
      }      
      },
      (error)=>{
        console.log(error.error);
      }
      );

  }
  clear()
  {
    this.dispatchhistoryform.reset();
    this.dispatchhistoryform.controls["fromdate"].setValue(this.today);
    this.dispatchhistoryform.controls["todate"].setValue(this.today);
    this.dispatchreport = {} as dispatchReportList;
    this.show = true;
    this.pendingreport = false;
    this.pendingbtn = true;
    this.savebtn = true;
    this.exportbtn = true;
    this.printbtn = true;
    this.title = '';
    this.dispatchhistoryform.controls["radio"].setValue(1);
    this.dispatchhistoryform.controls["billedlocation"].setValue({
      title: this.billedlocation[0].address3,
      value: this.billedlocation[0].hspLocationId
    });
  }
  savedialog()
  {
    // console.log(this.dispatchreportsave);
    console.log(this.tableRows.config.columnsInfo.r_collection_location);
    console.log(this.tableRows.selection.selected);
    console.log(this.tableRows.selection.selected.length);
    console.log(this.tableRows.selection.selected[0].sNo);
    // console.log(this.dispatchreportsave);
    debugger;
    // if(this.tableRows.config.columnsInfo)
    this.dispatchreportsave.objDtSaveReport = [] as Array<objdispatchsave>;
    this.tableRows.selection.selected.forEach((e:any) => {
      console.log(e.itemid.toString());
      
      this.dispatchreportsave.objDtSaveReport.push(
        {
          slNo: e.sNo.toString(),
          testName:e.itemName,
          patientName:e.ptnName,
          billNo: e.billno,
          billid: e.billid.toString(),
          remarks: e.remarks,
          dispatchDateTime: e.r_dispatchdate,
          dispatchPlace: e.r_collection_location.toString(),
          recievedDateTime: e.receive_date,
          operatorid: e.operatorid.toString(),
          repType: e.patType,
          datetime: e.orderdatetime,
          chk: true,
          balance: e.balance,
          itemid: e.itemid.toString(),
        })
        this.dispatchreportsave.operatorid = this.userId;
      });
      console.log(this.dispatchreportsave);
    console.log(this.dispatchreportsave);
    this.http.post(ApiConstants.dispatchreportsave, this.dispatchreportsave).subscribe((res:any)=>{
      console.log(res);
      if(res == 1)
      {
        this.msgdialog.success("Data Saved Succesully");
      }
    })
  }
  //as of now using hardcode value for test purpose
  // getdispatchrequestbody(): dispatchReportSaveModel{
  //   return ( this.dispatchreportsave = new dispatchReportSaveModel(
  //     [
  //       {
  //         'slNo': '222',
  //         'testName': 'test',
  //         'datetime': '2022-06-27',
  //         'patientName': 'test',
  //         'billNo': '3222',
  //         'dispatchDateTime': '2022-06-27',
  //         'dispatchPlace': 'string',
  //         'remarks': 'string',
  //         'chk': true,
  //         'billid': '2222',
  //         'operatorid': '1',
  //         'itemid': '22',
  //         'recievedDateTime': '2022-06-27',
  //         'balance': '4343',
  //         'repType': '1'
  //       }
  //     ],
  //     9923,
  //   ));
  // }


}
