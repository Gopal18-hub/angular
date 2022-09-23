import { Component, OnInit, Inject } from "@angular/core";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { FormGroup } from '@angular/forms';
import { QuestionControlService } from '@shared/ui/dynamic-forms/service/question-control.service';
import { Subject, takeUntil } from "rxjs";
import { GstTaxModel } from "../../../../../../core/models/GstTaxModel.Model";

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


  gstData!: GstTaxModel;

  ngOnInit(): void {

    let formResult: any = this.formService.createForm(
      this.gstTaxFormData.properties,
      {}
    );
    this.gstTaxForm = formResult.form;
    this.questions = formResult.questions;

    setTimeout(() => {
      console.log(this.data.gstdata[0], "popup");
      this.gstData = this.data.gstdata[0];

      this.taxData.forEach((e: any) => {
        if (e.services == "CGST") {
          e.percentage = this.gstData.cgst
          e.value = this.gstData.cgsT_Value
        }
        if (e.services == "SGST") {
          e.percentage = this.gstData.sgst
          e.value = this.gstData.sgsT_Value
        }
        if (e.services == "UTGST") {
          e.percentage = this.gstData.utgst
          e.value = this.gstData.utgsT_Value
        }
        if (e.services == "IGST") {
          e.percentage = this.gstData.igst
          e.value = this.gstData.igsT_Value
        }
        if (e.services == "CESS") {
          e.percentage = this.gstData.cess
          e.value = this.gstData.cesS_Value
        }
        if (e.services == "TOTAL TAX") {
          e.percentage = this.gstData.totaltaX_RATE
          e.value = this.gstData.totaltaX_Value
        }
        if (this.gstData.taxratE1 > 0) {
          e.services = this.gstData.taxratE1DESC
          e.percentage = this.gstData.taxratE1
          e.value = this.gstData.taxratE1_Value

        }
        if (this.gstData.taxratE2 > 0) {
          e.services = this.gstData.taxratE2DESC
          e.percentage = this.gstData.taxratE2
          e.value = this.gstData.taxratE2_Value

        }
        if (this.gstData.taxratE3 > 0) {
          e.services = this.gstData.taxratE3DESC
          e.percentage = this.gstData.taxratE3
          e.value = this.gstData.taxratE3_Value

        }
        if (this.gstData.taxratE4 > 0) {
          e.services = this.gstData.taxratE4DESC
          e.percentage = this.gstData.taxratE4
          e.value = this.gstData.taxratE4_Value

        }
        if (this.gstData.taxratE5 > 0) {
          e.services = this.gstData.taxratE5DESC
          e.percentage = this.gstData.taxratE5
          e.value = this.gstData.taxratE5_Value

        }



      })
      this.gstTaxForm.controls["code"].setValue(this.gstData.saccode)

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
        defaultValue: 0
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
        type: 'string',
        style: {
          width: "14%",
        },
      },
      value: {
        title: 'Value',
        type: 'string',
        style: {
          width: "14%",
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
    { services: "TOTAL TAX", percentage: '0.00', value: '0.00' },
    // { services: "TAXRATE1", percentage: this.totaltaX_Value, value: '0.00' },
    // { services: "TAXRATE2", percentage: this.totaltaX_Value, value: '0.00' },
    // { services: "TAXRATE3", percentage: this.totaltaX_Value, value: '0.00' },
    // { services: "TAXRATE4", percentage: this.totaltaX_Value, value: '0.00' },
    // { services: "TAXRATE5", percentage: this.totaltaX_Value, value: '0.00' }

  ]
}



