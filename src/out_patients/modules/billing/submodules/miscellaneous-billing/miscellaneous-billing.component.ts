import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { Subject } from "rxjs";

@Component({
  selector: "out-patients-miscellaneous-billing",
  templateUrl: "./miscellaneous-billing.component.html",
  styleUrls: ["./miscellaneous-billing.component.scss"],
})
export class MiscellaneousBillingComponent implements OnInit {
  constructor(
    public matDialog: MatDialog,
    private formService: QuestionControlService,
    private router: Router
  ) {}

  // @ViewChild("miscFormData") deposittable: any;
  linkList = ["Bill", "Credit Details"];
  activeLink = this.linkList[1];

  miscFormData = {
    type: "object",
    title: "",
    properties: {
      maxid: {
        type: "string",
      },

      mobileNo: {
        type: "number",
      },
      bookingId: {
        type: "string",
        // title: "SSN",
      },
      company: {
        type: "autocomplete",
        // title: "SSN",
      },
      corporate: {
        type: "autocomplete",
        // title: "SSN",
      },
      narration: {
        type: "string",
        // title: "SSN",
      },

      b2bInvoiceType: {
        type: "checkbox",
        options: [
          {
            title: "B2B Invoice Type",
          },
        ],
      },
    },
  };

  miscBillData = {
    type: "object",
    title: "",
    properties: {
      serviceType: {
        type: "dropdown",
        title: "Service Type",
        required: true,
      },
      item: {
        type: "dropdown",
        title: "Item",
        required: true,
      },
      tffPrice: {
        type: "string",
        title: "Tarrif Price",
        required: true,
      },
      qty: {
        type: "string",
        title: "Qty",
        required: true,
      },
      reqAmt: {
        type: "string",
        title: "Req. Amt.",
        required: true,
      },
      pDoc: {
        type: "dropdown",
        title: "Procedure Doctor",
      },
      remark: {
        type: "dropdown",
        title: "Remarks",
        required: true,
      },
      self: {
        type: "checkbox",
        required: false,
        options: [{ title: "Self" }],
      },
    },
  };

  config: any = {
    selectBox: false,
    clickedRows: true,
    clickSelection: "single",
    displayedColumns: [
      "Sno",
      "ServiceType",
      "ItemDescription",
      "ItemforModify",
      "TarrifPrice",
      "Qty",
      "Price",
      "DoctorName",
      "Disc%",
      "Disc. Amount",
      "Total Amount",
      "GST%",
    ],
    columnsInfo: {
      Sno: {
        title: "Id",
        type: "string",
        style: {
          width: "120px",
        },
      },
      ServiceType: {
        title: "Id",
        type: "string",
        style: {
          width: "120px",
        },
      },
      ItemDescription: {
        title: "Id",
        type: "string",
        style: {
          width: "120px",
        },
      },
      ItemforModify: {
        title: "Id",
        type: "string",
        style: {
          width: "120px",
        },
      },
      TarrifPrice: {
        title: "Id",
        type: "string",
        style: {
          width: "120px",
        },
      },
      Qty: {
        title: "Id",
        type: "string",
        style: {
          width: "120px",
        },
      },
      Price: {
        title: "Id",
        type: "string",
        style: {
          width: "120px",
        },
      },
      DoctorName: {
        title: "Id",
        type: "string",
        style: {
          width: "120px",
        },
      },
      Disc: {
        title: "Id",
        type: "string",
        style: {
          width: "120px",
        },
      },
    },
  };

  serviceselectedList: any;
  miscForm!: FormGroup;
  miscServBillForm!: FormGroup;
  questions: any;
  question: any;
  private readonly _destroying$ = new Subject<void>();

  ngOnInit(): void {
    let formResult = this.formService.createForm(
      this.miscFormData.properties,
      {}
    );
    let serviceFormResult = this.formService.createForm(
      this.miscBillData.properties,
      {}
    );
    this.miscForm = formResult.form;
    this.questions = formResult.questions;
    this.miscServBillForm = serviceFormResult.form;
    this.question = serviceFormResult.questions;
  }
}
