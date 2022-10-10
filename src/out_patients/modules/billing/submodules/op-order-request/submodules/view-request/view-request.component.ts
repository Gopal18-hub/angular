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
import { OpOrderRequestService } from "../../op-order-request.service";
@Component({
  selector: "out-patients-view-request",
  templateUrl: "./view-request.component.html",
  styleUrls: ["./view-request.component.scss"],
})
export class OPOrderViewRequest implements OnInit {
  @ViewChild("table") tableRows: any;
  data: FetchOpOrderrequest[] = [];
  reqItemDetail!: string;
  oporderrequestid!: string;
  config: any = {
    clickedRows: false,
    actionItems: false,
    // dateformat: "dd/MM/yyyy",
    selectBox: true,
    //removeRow: true,
    clickSelection: "multiple",
    rowLayout: { dynamic: { rowClass: "row['disabled']" } },
    displayedColumns: [
      "sno",
      "serviceName",
      "itemName",
      "orderStatus",
      "billNo",
      "reqBy",
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
      billNo: {
        title: "Bill No.",
        type: "string",
        tooltipColumn: "billno",
        style: {
          width: "130px",
        },
      },
      reqBy: {
        title: "Requested By",
        type: "string",
        style: {
          width: "130px",
        },
        tooltipColumn: "reqBy",
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
  showtable: boolean = true;
  unchecked: boolean = true;
  private readonly _destroying$ = new Subject<void>();

  constructor(
    private formService: QuestionControlService,
    private router: Router,
    private http: HttpService,
    private billingservice: BillingService,
    private cookie: CookieService,
    private messagedialogservice: MessageDialogService,
    private opOrderRequestService: OpOrderRequestService
  ) {}

  ngOnInit(): void {
    this.getViewgridDetails();
  }

  ngAfterViewInit() {
    this.showtable = true;
    console.log(this.tableRows.selection.selected);
    this.tableRows.selection.changed
      .pipe(takeUntil(this._destroying$))
      .subscribe((data: any) => {
        console.log(data);
        if (this.unchecked == true) {
          this.data.forEach((item) => {
            if (item.orderStatus == "Bill Prepaired") {
              setTimeout(() => {
                this.tableRows.selection.deselect(item);
              }, 10);
            }
          });
        } else if (
          this.unchecked == false &&
          this.tableRows.selection.selected.length == this.data.length
        ) {
          console.log(this.tableRows.selection.selected);
          this.tableRows.selection.selected.forEach((item: any) => {
            setTimeout(() => {
              this.tableRows.selection.deselect(item);
            }, 10);
          });
        }

        if (this.tableRows.selection.selected.length > 0) {
          this.unchecked = false;
        } else {
          this.unchecked = true;
        }
      });
  }
  getViewgridDetails() {
    this.data = [];
    //this.unchecked = true;
    let maxid = this.opOrderRequestService.activeMaxId.maxId;
    let locationid = Number(this.cookie.get("HSPLocationId"));
    this.http
      .get(BillingApiConstants.fetchoporderrequest(maxid, locationid))
      .pipe(takeUntil(this._destroying$))
      .subscribe((response) => {
        console.log(response);
        this.data = response as FetchOpOrderrequest[];
        for (let i = 0; i < this.data.length; i++) {
          this.data[i].sno = i + 1;
          if (this.data[i].orderStatus == "Bill Prepaired") {
            this.data[i].disabled = "unclickable";
          }
        }
      });
  }

  getSaveDeleteObject(flag: any): SaveandDeleteOpOrderRequest {
    this.reqItemDetail = "";
    this.oporderrequestid = "";
    this.tableRows.selection.selected.forEach((item: any, index: any) => {
      if (this.reqItemDetail == "") {
        this.reqItemDetail = item.itemId.toString();
      } else {
        this.reqItemDetail = this.reqItemDetail + "~" + item.itemId;
      }

      if (this.oporderrequestid == "") {
        this.oporderrequestid = item.id.toString();
      } else {
        this.oporderrequestid = this.oporderrequestid + "," + item.id;
      }
    });
    console.log(this.reqItemDetail);
    console.log(this.oporderrequestid);

    let maxid = this.opOrderRequestService.activeMaxId.maxId;
    let userid = Number(this.cookie.get("UserId"));
    let locationid = Number(this.cookie.get("HSPLocationId"));

    return new SaveandDeleteOpOrderRequest(
      flag,
      maxid,
      this.reqItemDetail,
      this.oporderrequestid,
      // 60926,
      //67
      userid,
      locationid
    );
  }

  columnClick(event: any) {
    console.log(event);
    console.log(this.tableRows.selection);
    this.data.forEach((item: any, index: any) => {
      if (item.orderStatus == "Bill Prepaired") {
        console.log(this.tableRows.selection);
        setTimeout(() => {
          this.tableRows.selection.deselect(item);
        }, 10);
      }
    });
  }
  deleteResponsedata: any;
  delete() {
    console.log(this.tableRows.selection.selected);
    console.log(this.getSaveDeleteObject(2));

    this.http
      .post(
        BillingApiConstants.SaveDeleteOpOrderRequest,
        this.getSaveDeleteObject(2)
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe((data) => {
        console.log(data);
        this.deleteResponsedata = data;
        if (this.deleteResponsedata.success == true) {
          this.messagedialogservice.success("Deleted Successfully");
          this.data = [];
          this.tableRows.selection.clear();
          // this.showtable = false;
          // setTimeout(() => {
          //   this.showtable = true;
          // }, 1000);
          this.getViewgridDetails();
        }
      });
  }
}
