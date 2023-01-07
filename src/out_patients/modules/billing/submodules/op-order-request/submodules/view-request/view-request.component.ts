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
  maxid!: string;
  apiprocessing: boolean = false;
  config: any = {
    clickedRows: true,
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
          width: "45px",
        },
        disabledSort: "true",
      },
      serviceName: {
        title: "Services Name",
        type: "string",
        style: {
          width: "125px",
        },
        tooltipColumn: "serviceName",
      },
      itemName: {
        title: "Items Name",
        type: "string",
        style: {
          width: "240px",
        },
        tooltipColumn: "itemName",
      },
      orderStatus: {
        title: "Order Status",
        type: "string",
        style: {
          width: "130px",
        },
        tooltipColumn: "orderStatus",
      },
      billNo: {
        title: "Bill No.",
        type: "string",
        tooltipColumn: "billno",
        style: {
          width: "100px",
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
  flag = 0;

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
    this.opOrderRequestService.onServiceTab(false);
  }
  checkflag: any = 0;
  ngAfterViewInit() {
    this.showtable = true;
    console.log(this.tableRows.selection.selected);
    this.tableRows.selection.changed
      .pipe(takeUntil(this._destroying$))
      .subscribe((data: any) => {
        //console.log(data);
        this.flag = 0;

        //mastercheck
        if (data.removed.length == 0 && data.added.length == this.data.length) {
          console.log("first if");
          this.data.forEach((item: any, index: any) => {
            if (item.orderStatus == "Bill Prepared") {
              this.tableRows.selection.deselect(item);
            } else {
            }
          });
          console.log(this.tableRows.selection.selected);
          //masteruncheck
        } else {
          this.data.forEach((item: any) => {
            if (item.orderStatus == "Bill Prepared") {
              this.flag++;
            }
          });
          console.log(this.flag);
          if (data.removed.length == 0 && data.added.length == this.flag) {
            console.log(this.tableRows.selection.selected);
            console.log("second if");
            this.data.forEach((item: any) => {
              this.tableRows.selection.deselect(item);
            });
          } else if (
            this.tableRows.selection.selected.length !=
              this.tableRows.selection._selectedToEmit.length &&
            this.tableRows.selection.selected.length == this.data.length
          ) {
            console.log(this.tableRows.selection.selected);
            console.log("third else");
            console.log(data);
            this.tableRows.selection.selected.forEach(
              (item: any, index: any) => {
                if (item.orderStatus == "Bill Prepared") {
                  this.tableRows.selection.deselect(item);
                }
              }
            );
            //console.log(data);
          }
        }
        if (this.tableRows.selection.selected.length > 0) {
          this.unchecked = false;
        } else {
          this.unchecked = true;
        }
      });
  }
  disableCheckboxList: any[] = [];
  getViewgridDetails() {
    this.apiprocessing = true;
    this.data = [];
    if (this.opOrderRequestService.activeMaxId != undefined) {
      this.maxid = this.opOrderRequestService.activeMaxId.maxId;
    }
    //let maxid = this.opOrderRequestService.activeMaxId.maxId;
    let locationid = Number(this.cookie.get("HSPLocationId"));
    this.http
      .get(BillingApiConstants.fetchoporderrequest(this.maxid, locationid))
      .pipe(takeUntil(this._destroying$))
      .subscribe(
        (response) => {
          console.log(response);
          this.data = response as FetchOpOrderrequest[];
          this.apiprocessing = false;
          if (this.data != null && this.data != undefined) {
            for (let i = 0; i < this.data.length; i++) {
              this.data[i].sno = i + 1;
              if (this.data[i].orderStatus == "Bill Prepared") {
                this.data[i].disabled = "unclickable";
                // this.data[i].disablecheckbox = true;
                this.checkflag++;
              } else {
                // this.data[i].disablecheckbox = false;
              }
            }
          }
        },
        (error) => {
          this.apiprocessing = false;
        }
      );
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
      if (item.orderStatus == "Bill Prepared") {
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
    this.apiprocessing = true;
    this.http
      .post(
        BillingApiConstants.SaveDeleteOpOrderRequest,
        this.getSaveDeleteObject(2)
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe(
        (data) => {
          console.log(data);
          this.deleteResponsedata = data;
          if (this.deleteResponsedata.success == true) {
            this.messagedialogservice.success("Deleted Successfully");
            this.apiprocessing = false;
            this.data = [];
            this.tableRows.selection.clear();
            // this.showtable = false;
            // setTimeout(() => {
            //   this.showtable = true;
            // }, 1000);
            this.getViewgridDetails();
          }
        },
        (error) => {
          this.apiprocessing = false;
        }
      );
  }
}
