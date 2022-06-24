import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QuestionControlService } from '../../../../../shared/ui/dynamic-forms/service/question-control.service';
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
  constructor( private formService: QuestionControlService ) { }

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.diapatchHistoryFormData.properties,
      {}
    );
    this.dispatchhistoryform = formResult.form;
    this.questions = formResult.questions;
    this.dispatchhistoryform.controls["fromdate"].disable();
    this.dispatchhistoryform.controls["todate"].disable();
  }
  enabledate()
  {
    this.dispatchhistoryform.controls["checkbox1"].valueChanges.subscribe( value=> {
      if(value == true)
      {
        console.log(this.dispatchhistoryform.controls["checkbox1"]);
        this.dispatchhistoryform.controls["fromdate"].enable();
        this.dispatchhistoryform.controls["todate"].enable();
      }
      else
      {
        this.dispatchhistoryform.controls["fromdate"].disable();
        this.dispatchhistoryform.controls["todate"].disable();
      }
    });
    
    console.log(this.dispatchhistoryform.controls["checkbox1"]);
  }
  clear()
  {
    this.dispatchhistoryform.reset();
  }

}
