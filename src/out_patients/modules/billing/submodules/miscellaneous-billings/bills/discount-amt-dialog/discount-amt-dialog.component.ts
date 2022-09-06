import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QuestionControlService } from '@shared/ui/dynamic-forms/service/question-control.service';

@Component({
  selector: 'out-patients-discount-amt-dialog',
  templateUrl: './discount-amt-dialog.component.html',
  styleUrls: ['./discount-amt-dialog.component.scss']
})
export class DiscountAmtDialogComponent implements OnInit {
  discAmtForm!: FormGroup;
  question: any;
  constructor(private formService: QuestionControlService) { }

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.discAmtFormData.properties,
      {}
    );
    this.discAmtForm = formResult.form;
    this.question = formResult.questions;
  }
  discAmtFormData = {
    title: "",
    type: "object",
    properties: {
      types: {
        type: "dropdown",
        title: "Discount Types"
        //readonly: true,
      },
      head: {
        type: "dropdown",
        title: "Main Head Discount"
        //readonly: true,
      },
      reason: {
        type: "dropdown",
        title: "Discount reason"
        //readonly: true,
      },
      percentage: {
        type: "string",
        title: "Disc%"
        //readonly: true,
      },
      amt: {
        type: "string",
        title: "Dis. Amt"
        //readonly: true,
      },
      authorise: {
        type: "dropdown",
        title: "Authorised By"
        //readonly: true,
      },
      coupon: {
        type: "string",
        title: "Coupon Code"
        //readonly: true,
      },
      empCode: {
        type: "string",
        title: "Employee Code"
        //readonly: true,
      },


    }
  }
  discAmtFormConfig: any = {
    actionItems: false,
    //dateformat: 'dd/MM/yyyy',
    selectBox: false,
    displayedColumns: ['sno', 'discType', 'service', 'doctor', 'price', 'disc', 'discAmt', 'totalAmt', 'head', 'reason', 'value'],

    clickedRows: true,
    clickSelection: "single",
    columnsInfo: {
      sno: {
        title: 'S.No',
        type: 'string',
        style: {
          width: "1%",
        },
      },
      discType: {
        title: 'Discount Type',
        type: 'input',
        style: {
          width: "1%",
        },
      },
      service: {
        title: 'Service Name',
        type: 'string',
        style: {
          width: "1%",
        },
      },
      doctor: {
        title: 'Item/Doctor Name',
        type: 'string',
        style: {
          width: "1%",
        },
      },
      price: {
        title: 'Price',
        type: 'input',
        style: {
          width: "1%",
        },
      },
      disc: {
        title: 'Disc%',
        type: 'string',
        style: {
          width: "1%",
        },
      },
      discAmt: {
        title: 'Dis. Amount',
        type: 'string',
        style: {
          width: "1%",
        },
      },
      totalAmt: {
        title: 'Total Amount',
        type: 'input',
        style: {
          width: "1%",
        },
      },
      head: {
        title: 'Main Head Discount',
        type: 'string',
        style: {
          width: "1%",
        },
      },
      reason: {
        title: 'Discount Reason',
        type: 'string',
        style: {
          width: "1%",
        },
      },
      value: {
        title: 'Value Based',
        type: 'input',
        style: {
          width: "1%",
        },
      },

    }
  }
  discAmtData: any = [

    // { services: "CGST", percentage: '0.00', value: '0.00' },
    // { services: "SGST", percentage: '0.00', value: '0.00' },
    // { services: "UTGST", percentage: '0.00', value: '0.00' },
    // { services: "IGST", percentage: '0.00', value: '0.00' },
    // { services: "CESS", percentage: '0.00', value: '0.00' },
    // { services: "TOTAL TAX", percentage: '0.00', value: '0.00' }

  ]

}
