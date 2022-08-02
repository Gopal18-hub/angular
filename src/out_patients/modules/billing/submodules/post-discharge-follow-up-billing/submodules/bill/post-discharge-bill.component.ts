import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QuestionControlService } from '@shared/ui/dynamic-forms/service/question-control.service';
@Component({
  selector: 'out-patients-post-discharge-bill',
  templateUrl: './post-discharge-bill.component.html',
  styleUrls: ['./post-discharge-bill.component.scss']
})
export class PostDischargeBillComponent implements OnInit {

  config: any = {
    clickedRows: true,
    actionItems: false,
    dateformat: "dd/MM/YYYY HH:mm:ss.ss",
    selectBox: false,
    displayedColumns: [
      "sno",
      "services_name",
      "item_name",
      "precaution",
      "procedure_doctor",
      "qty_type",
      "credit",
      "cash",
      "disc",
      "disc_amount",
      "total_amount",
      "gst",
      "gst_value"
    ],
    columnsInfo: {
      sno: {
        title: "S.No",
        type: "string",
        style: {
          width: "5rem"
        }
      },
      services_name: {
        title: "Services Name",
        type: "string",
      },
      item_name: {
        title: "Items Name/ Doctors Name",
        type: "string",
      },
      precaution: {
        title: "Precaution",
        type: "string",
      },
      procedure_doctor: {
        title: "Procedure Doctor",
        type: "string",
      },
      qty_type: {
        title: "Qty/ Type",
        type: "string",
      },
      credit: {
        title: "Credit",
        type: "string",

      },
      cash: {
        title: "Cash",
        type: "string",
      },
      disc: {
        title: "Disc%",
        type: "string",
      },
      disc_amount: {
        title: "Disc Amount",
        type: "string"
      },
      total_amount: {
        title: "Total Amount",
        type: "string"
      },
      gst: {
        title: "GST%",
        type: "string"
      },
      gst_value: {
        title: "GST Value",
        type: "string"
      }
    },
  };
  billFormData = {
    title: "",
    type: "object",
    properties: {
      coupon: {
        type: "string"
      }
    }
  }
  billform!: FormGroup;
  questions: any;
  constructor( private formservice: QuestionControlService) { }

  ngOnInit(): void {
    let formresult = this.formservice.createForm(
      this.billFormData.properties,
      {}
    );
    this.billform = formresult.form;
    this.questions = formresult.questions;  
  }
}
