import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QuestionControlService } from '@shared/ui/dynamic-forms/service/question-control.service';
import { PostDischargeServiceService } from '../../post-discharge-service.service';
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
        style: {
          width: "9rem"
        }
      },
      item_name: {
        title: "Items Name/ Doctors Name",
        type: "string",
        style: {
          width: "14rem"
        }
      },
      precaution: {
        title: "Precaution",
        type: "string",
        style: {
          width: "8rem"
        }
      },
      procedure_doctor: {
        title: "Procedure Doctor",
        type: "string",
        style: {
          width: "10rem"
        }
      },
      qty_type: {
        title: "Qty/ Type",
        type: "string",
        style: {
          width: "7rem"
        }
      },
      credit: {
        title: "Credit",
        type: "string",
        style: {
          width: "5rem"
        }
      },
      cash: {
        title: "Cash",
        type: "string",
        style: {
          width: "5rem"
        }
      },
      disc: {
        title: "Disc%",
        type: "string",
        style: {
          width: "5rem"
        }
      },
      disc_amount: {
        title: "Disc Amount",
        type: "string",
        style: {
          width: "7rem"
        }
      },
      total_amount: {
        title: "Total Amount",
        type: "string",
        style: {
          width: "7rem"
        }
      },
      gst: {
        title: "GST%",
        type: "string",
        style: {
          width: "5rem"
        }
      },
      gst_value: {
        title: "GST Value",
        type: "string",
        style: {
          width: "5rem"
        }
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
  data: any = [];
  constructor( 
    private formservice: QuestionControlService,
    public service: PostDischargeServiceService
    ) { }

  ngOnInit(): void {
    let formresult = this.formservice.createForm(
      this.billFormData.properties,
      {}
    );
    this.billform = formresult.form;
    this.questions = formresult.questions; 
    this.data = this.service.billItems;
    this.service.clearAllItems.subscribe((clearItems) => {
      if (clearItems) {
        this.data = [];
      }
    }); 
  }
}
