import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QuestionControlService } from '@shared/ui/dynamic-forms/service/question-control.service';
@Component({
  selector: 'out-patients-gst-tax',
  templateUrl: './gst-tax.component.html',
  styleUrls: ['./gst-tax.component.scss']
})
export class GstTaxComponent implements OnInit {

  config: any = {
    actionItems: false,
    //dateformat: 'dd/MM/yyyy',
    selectBox: false,
    displayedColumns: ['service', 'percentage', 'value'],
    clickedRows: true,
    clickSelection: "single",
    columnsInfo: {
      service: {
        title: 'Service',
        type: 'string',
      },
      percentage: {
        title: 'Percentage',
        type: 'input',
      },
      value: {
        title: 'Value',
        type: 'string',
      },
    }
  }
  gstTaxFormData = {
    title: "",
    type: "object",
    properties: {
      saccode: {
        type: "string",
      },
    }
  }
  gstTaxForm!: FormGroup;
  question: any;
  constructor(
    private formService: QuestionControlService
  ) { }

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.gstTaxFormData.properties,
      {}
    );
    this.gstTaxForm = formResult.form;
    this.question = formResult.questions;
  }

}
