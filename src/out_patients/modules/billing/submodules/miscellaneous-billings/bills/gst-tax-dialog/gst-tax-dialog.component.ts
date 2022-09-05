import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QuestionControlService } from '@shared/ui/dynamic-forms/service/question-control.service';

@Component({
  selector: 'out-patients-gst-tax-dialog',
  templateUrl: './gst-tax-dialog.component.html',
  styleUrls: ['./gst-tax-dialog.component.scss']
})
export class GstTaxDialogComponent implements OnInit {
  //taxData: any = [];
  gstTaxForm!: FormGroup;
  questions: any;
  constructor(private formService: QuestionControlService) { }

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.gstTaxFormData.properties,
      {}
    );
    this.gstTaxForm = formResult.form;
    this.questions = formResult.questions;
  }
  gstTaxFormData = {
    title: "",
    type: "object",
    properties: {

      code: {
        type: "string",
        //readonly: true,
      },


    }
  }

  taxConfig: any = {
    actionItems: false,
    //dateformat: 'dd/MM/yyyy',
    selectBox: false,
    displayedColumns: ['services', 'percentage', 'value'],

    clickedRows: true,
    clickSelection: "single",
    columnsInfo: {
      services: {
        title: 'Services',
        type: 'string',
        style: {
          width: "9%",
        },
      },
      percentage: {
        title: 'Percentage',
        type: 'input',
        style: {
          width: "20%",
        },
      },
      value: {
        title: 'Value',
        type: 'string',
        style: {
          width: "10%",
        },
      },
    }
  }

  taxData: any = [

    { services: "CGST", percentage: '0.00', value: '0.00' },
    { services: "SGST", percentage: '0.00', value: '0.00' },
    { services: "UTGST", percentage: '0.00', value: '0.00' },
    { services: "IGST", percentage: '0.00', value: '0.00' },
    { services: "CESS", percentage: '0.00', value: '0.00' },
    { services: "TOTAL TAX", percentage: '0.00', value: '0.00' }

  ]
}



