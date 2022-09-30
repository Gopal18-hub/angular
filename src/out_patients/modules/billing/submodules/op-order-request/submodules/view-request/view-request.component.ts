import { Component, OnInit, ViewChild } from "@angular/core";
import { Subject, takeUntil } from "rxjs";
import { FormGroup } from "@angular/forms";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { Router } from "@angular/router";
import { BillingApiConstants } from "@modules/billing/submodules/billing/BillingApiConstant";
import { HttpService } from "@shared/services/http.service";
import { BillingService } from "@modules/billing/submodules/billing/billing.service";
import { CookieService } from "@shared/services/cookie.service";
import { FetchOpOrderrequest } from "../../../../../../core/types/oporderrequest/fetchoporderrequest.Interface";
import { SaveandDeleteOpOrderRequest } from "@core/models/saveanddeleteoporder.Model";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";
@Component({
  selector: "out-patients-view-request",
  templateUrl: "./view-request.component.html",
  styleUrls: ["./view-request.component.scss"],
})
export class OPOrderViewRequest implements OnInit {
  billDataForm = {
    type: "object",
    title: "",
    properties: {
      // self: {
      //   type: "checkbox",
      //   required: false,
      //   options: [{ title: "Self" }],
      // },
      referralDoctor: {
        type: "dropdown",
        required: true,
        title: "Referral Doctor",
        placeholder: "--Select--",
      },
      interactionDetails: {
        type: "dropdown",
        required: true,
        title: "Interaction Details",
        placeholder: "--Select--",
      },
      billAmt: {
        type: "number",
        required: false,
        defaultValue: 0.0,
        readonly: true,
      },
      availDiscCheck: {
        type: "checkbox",
        required: false,
        options: [{ title: "Avail Plan Disc ( - )" }],
      },
      availDisc: {
        type: "number",
        required: false,
        defaultValue: 0.0,
        readonly: true,
      },
      discAmtCheck: {
        type: "checkbox",
        required: false,
        options: [{ title: " Discount  Amount  (  -  ) " }],
      },
      discAmt: {
        type: "number",
        required: false,
        defaultValue: 0.0,
        readonly: true,
      },
      dipositAmtcheck: {
        type: "checkbox",
        required: false,
        options: [{ title: "Deposit Amount ( - )" }],
      },

      dipositAmt: {
        type: "number",
        required: false,
        defaultValue: 0.0,
        readonly: true,
      },
      patientDisc: {
        type: "number",
        required: false,
        defaultValue: 0.0,
        readonly: true,
      },
      compDisc: {
        type: "number",
        required: false,
        defaultValue: 0.0,
        readonly: true,
      },
      planAmt: {
        type: "number",
        required: false,
        defaultValue: 0.0,
        readonly: true,
      },
      coupon: {
        type: "number",
        required: false,
        defaultValue: 0.0,
        readonly: true,
      },
      coPay: {
        type: "number",
        required: false,
        defaultValue: 0.0,
        readonly: true,
      },
      credLimit: {
        type: "number",
        required: false,
        defaultValue: 0.0,
        readonly: true,
      },
      gstTax: {
        type: "number",
        required: false,
        defaultValue: 0.0,
        readonly: true,
      },
      amtPayByPatient: {
        type: "number",
        required: false,
        defaultValue: 0.0,
        readonly: true,
      },
      amtPayByComp: {
        type: "number",
        required: false,
        defaultValue: 0.0,
        readonly: true,
      },
      paymentMode: {
        type: "radio",
        required: true,
        options: [
          { title: "Cash", value: "cash" },
          { title: "Credit", value: "credit" },
          { title: "Gen. OPD", value: "Gen OPD" },
        ],
        defaultValue: "cash",
      },
    },
  };
  @ViewChild("table") tableRows: any;
  data: FetchOpOrderrequest[] = [];
  reqItemDetail = "";
  config: any = {
    clickedRows: false,
    actionItems: false,
    // dateformat: "dd/MM/yyyy",
    selectBox: true,
    //removeRow: true,
    clickSelection: "multiple",
    rowLayout: { dynamic: { rowClass: "row['unclickable']" } },
    displayedColumns: [
      "sno",
      "serviceName",
      "itemName",
      "orderStatus",
      "billno",
      "requestedBy",
      "requestOn",
    ],
    columnsInfo: {
      sno: {
        title: "S.No.",
        type: "number",
        style: {
          width: "80px",
        },
      },
      serviceName: {
        title: "Services Name",
        type: "string",
        style: {
          width: "150px",
        },
        tooltipColumn: "serviceName",
      },
      itemName: {
        title: "Item Name",
        type: "string",
        style: {
          width: "220px",
        },
        tooltipColumn: "itemName",
      },
      orderStatus: {
        title: "Order Status",
        type: "string",
        style: {
          width: "200px",
        },
        tooltipColumn: "orderStatus",
      },
      billno: {
        title: "Bill No.",
        type: "string",
        tooltipColumn: "billno",
        style: {
          width: "130px",
        },
      },
      requestedBy: {
        title: "Requested By",
        type: "string",
        style: {
          width: "130px",
        },
        tooltipColumn: "requestedBy",
      },
      requestOn: {
        title: "Requested On",
        type: "string",
        style: {
          width: "150px",
        },
        tooltipColumn: "requestOn",
      },
    },
  };

  formGroup!: FormGroup;
  question: any;

  private readonly _destroying$ = new Subject<void>();

  constructor(
    private formService: QuestionControlService,
    private router: Router,
    private http: HttpService,
    private billingservice: BillingService,
    private cookie: CookieService,
    private messagedialogservice: MessageDialogService
  ) {}

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.billDataForm.properties,
      {}
    );
    this.formGroup = formResult.form;
    this.question = formResult.questions;

    this.getViewgridDetails();
  }
  unchecked: boolean = true;
  ngAfterViewInit() {
    console.log(this.tableRows.selection.selected);
    this.tableRows.selection.changed
      .pipe(takeUntil(this._destroying$))
      .subscribe((data: any) => {
        console.log(data);
        if (this.tableRows.selection.selected.length > 0) {
          this.unchecked = false;
        } else {
          this.unchecked = true;
        }
      });
  }
  getViewgridDetails() {
    this.data = [];
    this.unchecked = true;
    let maxid = this.billingservice.activeMaxId.maxId;
    let locationid = Number(this.cookie.get("HSPLocationId"));
    this.http
      .get(BillingApiConstants.fetchoporderrequest(maxid, 67))
      .pipe(takeUntil(this._destroying$))
      .subscribe((response) => {
        console.log(response);
        this.data = response as FetchOpOrderrequest[];
        for (let i = 0; i < this.data.length; i++) {
          this.data[i].sno = i + 1;
          if (this.data[i].orderStatus == "Bill prepaired ") {
            this.data[i].disabled = "unclickable";
          }
        }
      });
  }
  oporderrequestid: any = "";
  getSaveDeleteObject(flag: any): SaveandDeleteOpOrderRequest {
    this.tableRows.selection.selected.forEach((item: any, index: any) => {
      if (this.reqItemDetail == "") {
        this.reqItemDetail = item.itemId;
      } else {
        this.reqItemDetail = this.reqItemDetail + "~" + item.itemid;
      }

      if (this.oporderrequestid == "") {
        this.oporderrequestid = item.id;
      } else {
        this.oporderrequestid = this.oporderrequestid + "~" + item.id;
      }
    });
    console.log(this.reqItemDetail);

    let maxid = this.billingservice.activeMaxId.maxId;
    let userid = Number(this.cookie.get("UserId"));
    let locationid = Number(this.cookie.get("HSPLocationId"));

    return new SaveandDeleteOpOrderRequest(
      flag,
      maxid,
      this.reqItemDetail,
      0,
      60926,
      67
      // userid,
      // locationid
    );
  }

  columnClick(event: any) {
    console.log(event);
  }
  deleteResponsedata: any;
  delete() {
    console.log(this.tableRows.selection.selected);

    // this.http
    //   .post(
    //     BillingApiConstants.SaveDeleteOpOrderRequest,
    //     this.getSaveDeleteObject(2)
    //   )
    //   .pipe(takeUntil(this._destroying$))
    //   .subscribe((data) => {
    //     console.log(data);
    //     this.deleteResponsedata = data;
    //     if (this.deleteResponsedata.success == true) {
    //       this.messagedialogservice.success("Deleted Successfully");
    //       this.getViewgridDetails();
    //     }
    //   });
  }
}
