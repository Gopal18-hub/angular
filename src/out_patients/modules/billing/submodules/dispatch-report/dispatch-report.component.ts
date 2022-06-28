import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QuestionControlService } from '../../../../../shared/ui/dynamic-forms/service/question-control.service';
import { MessageDialogService } from '../../../../../shared/ui/message-dialog/message-dialog.service';
import { SelectAtleastOneComponent } from './select-atleast-one/select-atleast-one.component';
import { MoreThanMonthComponent } from './more-than-month/more-than-month.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'out-patients-dispatch-report',
  templateUrl: './dispatch-report.component.html',
  styleUrls: ['./dispatch-report.component.scss']
})
export class DispatchReportComponent implements OnInit {

  config: any = {
    actionItems: true,
    dateformat: "dd/MM/yyyy",
    selectBox: true,
    displayedColumns: [
      "sno",
      "testname",
      "datetime",
      "patientname",
      "maxid",
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
      testname: {
        title: "Test Name",
        type: "string",
      },
      datetime: {
        title: "Date Time",
        type: "date",
      },
      patientname: {
        title: "Patient Name",
        type: "string",
      },
      maxid: {
        title: "Max ID",
        type: "number",
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
          { title: "OPD", value: "opd" },
          { title: "Pre-Adt", value: "pre-adt" },
          { title: "Triage", value: "triage" }
        ]
      },
    },
  };
  dispatchhistoryform!: FormGroup;
  questions: any;
  constructor( private formService: QuestionControlService, private msgdialog: MessageDialogService, private matdialog: MatDialog) { }
  today: any;
  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.diapatchHistoryFormData.properties,
      {}
    );
    this.dispatchhistoryform = formResult.form;
    this.questions = formResult.questions;
    // this.dispatchhistoryform.controls["fromdate"].disable();
    // this.dispatchhistoryform.controls["todate"].disable();
    this.today = new Date();
    this.dispatchhistoryform.controls["fromdate"].setValue(this.today);
    this.dispatchhistoryform.controls["todate"].setValue(this.today);
  }
  // enabledate()
  // {
  //   this.dispatchhistoryform.controls["checkbox1"].valueChanges.subscribe( value=> {
  //     if(value == true)
  //     {
  //       console.log(this.dispatchhistoryform.controls["checkbox1"]);
  //       this.dispatchhistoryform.controls["fromdate"].enable();
  //       this.dispatchhistoryform.controls["todate"].enable();
  //     }
  //     else
  //     {
  //       this.dispatchhistoryform.controls["fromdate"].disable();
  //       this.dispatchhistoryform.controls["todate"].disable();
  //     }
  //   });
    
  //   console.log(this.dispatchhistoryform.controls["checkbox1"]);
  // }
  dispatchreportsearch()
  {
    console.log(this.dispatchhistoryform.value);

    // check for 31 popup
    var fdate = new Date(this.dispatchhistoryform.controls["fromdate"].value);
    var tdate = new Date(this.dispatchhistoryform.controls["todate"].value);
    var dif_in_time = tdate.getTime() - fdate.getTime();
    var dif_in_days = dif_in_time / ( 1000 * 3600 *24);
    console.log(dif_in_days);
    if(this.dispatchhistoryform.controls["billedlocation"].value == '' || 
        this.dispatchhistoryform.controls["billedlocation"].value == undefined ||
        this.dispatchhistoryform.controls["radio"].value == '' ||
        this.dispatchhistoryform.controls["radio"].value == undefined)
    {
      this.matdialog.open(SelectAtleastOneComponent, {width: "35vw", height: "35vh"});
    }
    else if(dif_in_days > 31)
    {
      this.matdialog.open(MoreThanMonthComponent, {width: "30vw", height:"30vh"});
      // this.msgdialog.error("Can not process requests for more than one month (31 Days), Please select the dates accordingly.");
    }
    
  }
  clear()
  {
    this.dispatchhistoryform.reset();
    this.dispatchhistoryform.controls["fromdate"].setValue(this.today);
    this.dispatchhistoryform.controls["todate"].setValue(this.today);
  }
  savedialog()
  {
    this.msgdialog.success("Data Saved Succesully");
  }
}
