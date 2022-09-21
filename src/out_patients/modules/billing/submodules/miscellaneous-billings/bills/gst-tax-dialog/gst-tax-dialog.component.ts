import { Component, OnInit, Inject } from "@angular/core";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { FormGroup } from '@angular/forms';
import { QuestionControlService } from '@shared/ui/dynamic-forms/service/question-control.service';
import { Subject, takeUntil } from "rxjs";

@Component({
  selector: 'out-patients-gst-tax-dialog',
  templateUrl: './gst-tax-dialog.component.html',
  styleUrls: ['./gst-tax-dialog.component.scss']
})
export class GstTaxDialogComponent implements OnInit {
  //taxData: any = [];
  gstTaxForm!: FormGroup;
  questions: any;

  private readonly _destroying$ = new Subject<void>();
  constructor(private dialogRef: MatDialogRef<GstTaxDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private formService: QuestionControlService) { }

  cgsT_Value = 0.00
  sgsT_Value = 0.00
  utgsT_Value = 0.00
  igsT_Value = 0.00
  cesS_Value = 0.00
  totaltaX_Value = 0.00
  sac = 0;

  ngOnInit(): void {

    let formResult: any = this.formService.createForm(
      this.gstTaxFormData.properties,
      {}
    );
    this.gstTaxForm = formResult.form;
    this.questions = formResult.questions;


    setTimeout(() => {
      console.log(this.data.gstdata[0], "popup")

      this.cgsT_Value = this.data.gstdata[0].cgsT_Value
      this.sgsT_Value = this.data.gstdata[0].sgsT_Value
      this.utgsT_Value = this.data.gstdata[0].utgsT_Value
      this.igsT_Value = this.data.gstdata[0].igsT_Value
      this.cesS_Value = this.data.gstdata[0].cesS_Value
      this.totaltaX_Value = this.data.gstdata[0].totaltaX_Value
      this.sac = this.data.gstdata[0].saccode
      this.gstTaxForm.controls["code"].setValue(this.sac)

      this.taxData.forEach((e: any) => {
        if (e.services == "CGST") {
          e.percentage = this.cgsT_Value
        }
        if (e.services == "SGST") {
          e.percentage = this.sgsT_Value
        }
        if (e.services == "UTGST") {
          e.percentage = this.utgsT_Value
        }
        if (e.services == "CESS") {
          e.percentage = this.cesS_Value
        }
        if (e.services == "TOTAL TAX") {
          e.percentage = this.totaltaX_Value
        }

      })
    })


  }

  // ngAfterViewInit(): void {
  //   this.data.gstdata.valueChanges.pipe(takeUntil(this._destroying$))
  //     .subscribe((value: any) => {

  //     })
  // }


  gstTaxFormData = {
    title: "",
    type: "object",
    properties: {

      code: {
        type: "string",
        defaultValue: this.sac
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
    { services: "CGST", percentage: this.cgsT_Value, value: '0.00' },
    { services: "SGST", percentage: this.sgsT_Value, value: '0.00' },
    { services: "UTGST", percentage: this.utgsT_Value, value: '0.00' },
    { services: "IGST", percentage: this.igsT_Value, value: '0.00' },
    { services: "CESS", percentage: this.cesS_Value, value: '0.00' },
    { services: "TOTAL TAX", percentage: this.totaltaX_Value, value: '0.00' }

  ]
}



