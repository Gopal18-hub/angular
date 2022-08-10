import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";
import { HttpService } from "@shared/services/http.service";
import { ApiConstants } from "@core/constants/ApiConstants";
import { Subject, takeUntil } from "rxjs";
import { DatePipe } from "@angular/common";
import { SearchService } from "../../../../../shared/services/search.service";
import { OprefundPendingInterface } from "../../../../../out_patients/core/types/opRefundapproval/opRefundpendinglist.Interface";
import { OpRefundApprovalListInterface } from "../../../../../out_patients/core/types/opRefundapproval/opRefundpendinglist.Interface";
import { FormControl, FormGroup } from "@angular/forms";
import { SaveOprefundApprovalModel } from "../../../../core/models/saveOprefundapproval.Model";
import { CookieService } from "@shared/services/cookie.service";
import { OprefundDialogComponent } from "./oprefund-dialog/oprefund-dialog.component";
import { MatDialog } from "@angular/material/dialog";
@Component({
  selector: "out-patients-oprefund-approval",
  templateUrl: "./oprefund-approval.component.html",
  styleUrls: ["./oprefund-approval.component.scss"],
})
export class OprefundApprovalComponent implements OnInit {
  private readonly _destroying$ = new Subject<void>();
  from: any;
  to: any;
  today = new Date();
  defaultUI: boolean = false;
  userId: any;
  hsplocationId: any;
  showapprovalspinner: boolean = false;
  isPendingList: boolean = false;
  isApprovedList: boolean = false;
  isRejectedList: boolean = false;
  oprefundmessage: string = "Please search From Date and To Date ";
  oprefundicon: string = "placeholder";
  pendingList: any = [];
  approvedList: any = [];
  oprefundPendingList: OpRefundApprovalListInterface[] = [];
  oprefundApprovedList: OpRefundApprovalListInterface[] = [];
  oprefundRejectedList: OpRefundApprovalListInterface[] = [];
  oprefundapprovalpageForm = new FormGroup({
    from: new FormControl(""),
    to: new FormControl(""),
  });
  @ViewChild("oprefundpending") OprefundPending: any;
  @ViewChild("oprefundapproved") OprefundApproved: any;
  link1 = [
    { value: "OP Registration Approval", id: 1 },
    { value: "Hot Listing Approval", id: 2 },
    { value: "OP Refund Approval", id: 3 },
  ];
  link2 = [
    { value: "View Pending Request", id: 1 },
    { value: "Approved Requests", id: 2 },
    { value: "Reject Requests", id: 3 },
  ];
  //link2 = ["View Pending Request", "Approved Requests", "Reject Requests"];
  activeLink1 = this.link1[2];
  activeLink2 = this.link2[0];

  oprefundConfig: any = {
    actionItems: true,
    selectBox: true,
    //dateformat: "dd/MM/yyyy-hh:mm",
    actionItemList: [
      {
        title: "OP Billing",
        actionType: "link",
        routeLink: "",
      },
      {
        title: "Bill Details",
      },
      {
        title: "Deposits",
      },
      {
        title: "Admission",
      },
      {
        title: "Admission log",
      },
      {
        title: "Visit History",
      },
    ],
    displayedColumns: [
      "maxid",
      "ssn",
      "ptnName",
      "billNo",
      "billDatetime",
      "serviceName",
      "itemName",
      "refundAmt",
      "approvalRequestBy",
      "approvalRequestDateTime",
    ],
    columnsInfo: {
      maxid: {
        title: "Max ID",
        type: "string",
      },
      ssn: {
        title: "SSN",
        type: "string",
      },
      ptnName: {
        title: "Name",
        type: "string",
        tootltipColumn: "ptnName",
      },
      billNo: {
        title: "Bill No",
        type: "string",
      },
      billDatetime: {
        title: "Bill Date/Time",
        type: "date",
        tooltipColumn: "billDatetime",
      },
      serviceName: {
        title: "Service Name",
        type: "string",
      },
      itemName: {
        title: "Item Name",
        type: "string",
        tooltipColumn: "itemName",
      },
      refundAmt: {
        title: "Refund Amount",
        type: "string",
      },
      approvalRequestBy: {
        title: "Requested By",
        type: "string",
        tootltipColumn: "approvalRequestBy",
      },
      approvalRequestDateTime: {
        title: "Requested By",
        type: "string",
        tootltipColumn: "approvalRequestDateTime",
      },
    },
  };
  oprefundapproveConfig: any = {
    actionItems: true,
    selectBox: true,
    //dateformat: "dd/MM/yyyy-hh:mm",
    actionItemList: [
      {
        title: "OP Billing",
        actionType: "link",
        routeLink: "",
      },
      {
        title: "Bill Details",
      },
      {
        title: "Deposits",
      },
      {
        title: "Admission",
      },
      {
        title: "Admission log",
      },
      {
        title: "Visit History",
      },
    ],
    displayedColumns: [
      "maxid",
      "ssn",
      "ptnName",
      "billNo",
      "billDatetime",
      "serviceName",
      "itemName",
      "refundAmt",
      "approvalRequestBy",
      "approvalRequestDateTime",
      "approvalDoneBy",
      "approvalDoneDateTime",
    ],
    columnsInfo: {
      maxid: {
        title: "Max ID",
        type: "string",
      },
      ssn: {
        title: "SSN",
        type: "string",
      },
      ptnName: {
        title: "Name",
        type: "string",
        tootltipColumn: "ptnName",
      },
      billNo: {
        title: "Bill No",
        type: "string",
      },
      billDatetime: {
        title: "Bill Date/Time",
        type: "string",
        tooltipColumn: "billDatetime",
      },
      serviceName: {
        title: "Service Name",
        type: "string",
      },
      itemName: {
        title: "Item Name",
        type: "string",
        tooltipColumn: "itemName",
      },
      refundAmt: {
        title: "Refund Amount",
        type: "string",
      },
      approvalRequestBy: {
        title: "Requested By",
        type: "string",
        tootltipColumn: "approvalRequestBy",
      },
      approvalRequestDateTime: {
        title: "Requested Date",
        type: "string",
      },
      approvalDoneBy: {
        title: "Approved By",
        type: "string",
        tootltipColumn: "approvalDoneBy",
      },
      approvalDoneDateTime: {
        title: "Approved Date/Time",
        type: "string",
        tootltipColumn: "approvalDoneDateTime",
      },
    },
  };
  oprefundrejectConfig: any = {
    actionItems: true,
    selectBox: false,
    actionItemList: [
      {
        title: "OP Billing",
        actionType: "link",
        routeLink: "",
      },
      {
        title: "Bill Details",
      },
      {
        title: "Deposits",
      },
      {
        title: "Admission",
      },
      {
        title: "Admission log",
      },
      {
        title: "Visit History",
      },
    ],
    displayedColumns: [
      "maxid",
      "ssn",
      "ptnName",
      "billNo",
      "billDatetime",
      "serviceName",
      "itemName",
      "refundAmt",
      "approvalRequestBy",
      "approvalRequestDateTime",
      "rejectedBy",
      "rejectedDateTime",
    ],
    columnsInfo: {
      maxid: {
        title: "Max ID",
        type: "string",
        tootltipColumn: "maxid",
      },
      ssn: {
        title: "SSN",
        type: "string",
        tootltipColumn: "ssn",
      },
      ptnName: {
        title: "Name",
        type: "string",
        tootltipColumn: "ptnName",
      },
      billNo: {
        title: "Bill No",
        type: "string",
        tootltipColumn: "billNo",
      },
      billDatetime: {
        title: "Bill Date/Time",
        type: "string",
        tootltipColumn: "billDatetime",
      },
      serviceName: {
        title: "Service Name",
        type: "string",
        tootltipColumn: "serviceName",
      },
      itemName: {
        title: "Item Name",
        type: "string",
        tootltipColumn: "itemName",
      },
      refundAmt: {
        title: "Refund Amount",
        type: "string",
        tootltipColumn: "refundAmt",
      },
      approvalRequestBy: {
        title: "Requested By",
        type: "string",
        tootltipColumn: "approvalRequestBy",
      },
      approvalRequestDateTime: {
        title: "Requested Date/Time",
        type: "string",
        tootltipColumn: "approvalRequestDateTime",
      },
      rejectedBy: {
        title: "Rejected By",
        type: "string",
        tootltipColumn: "rejectedBy",
      },
      rejectedDateTime: {
        title: "Rejected Date/Time",
        type: "string",
        tootltipColumn: "rejectedDateTime",
      },
    },
  };
  constructor(
    private router: Router,
    private dialogservice: MessageDialogService,
    private http: HttpService,
    private datepipe: DatePipe,
    private searchService: SearchService,
    private cookie: CookieService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    //obj= new ActiveXObject("wscript.network");
    this.userId = Number(this.cookie.get("UserId"));
    this.hsplocationId = Number(this.cookie.get("HSPLocationId"));
    this.searchService.searchTrigger
      .pipe(takeUntil(this._destroying$))
      .subscribe((formdata: any) => {
        this.searchOpRefundapproval(formdata.data);
      });
    if (this.from == undefined && this.to == undefined) {
      this.from = this.datepipe.transform(
        new Date().setMonth(new Date().getMonth() - 2),
        "yyyy-MM-dd"
      );
      this.to = this.datepipe.transform(new Date(), "yyyy-MM-dd");
    }
    this.showmain(this.link1[2]);
  }
  ngAfterViewInit(): void {
    // if (this.OprefundPending != undefined) {
    //   console.log(this.OprefundPending.selection.changed);
    // }
    // setTimeout(() => {
    //   this.OprefundPending.selection.changed
    //     .pipe(takeUntil(this._destroying$))
    //     .subscribe((res: any) => {
    //       console.log(res);
    //     });
    // });
  }

  searchOpRefundapproval(formdata: any) {
    console.log("inside searchopreu=fundapproval method");
    // this.defaultUI = true;
    this.showapprovalspinner = true;
    this.today = new Date();
    if (formdata["from"] == "" || formdata["to"] == "") {
      this.from =
        formdata["from"] != ""
          ? formdata["from"]
          : this.today.setDate(this.today.getDate() - 30);
      this.from = this.datepipe.transform(this.from, "yyyy-MM-dd");
      this.to = formdata["to"] != "" ? formdata["to"] : new Date();
      this.to = this.datepipe.transform(this.to, "yyyy-MM-dd");
    } else {
      this.from = formdata["from"];
      this.from = this.datepipe.transform(this.from, "yyyy-MM-dd");
      this.to = formdata["to"];
      this.to = this.datepipe.transform(this.to, "yyyy-MM-dd");
    }
    this.showmain(this.link1[2]);
  }

  showmain(link: any) {
    console.log(link);
    if (link.id == "1") {
      console.log("id 1");
      this.router.navigate(["registration", "op-reg-approval"]);
    } else if (link.id == "2") {
      console.log("id 2");
      this.router.navigate(["registration", "hot-listing-approval"]);
    } else if (link.id == "3") {
      this.activeLink1 = link;
      this.activeLink2.id != null
        ? this.showgrid(this.activeLink2)
        : this.showgrid("View Pending Request");
    }
  }
  showgrid(link: any) {
    console.log(link);
    if (link.id == 1) {
      this.activeLink2 = link;
      this.oprefundRejectedList = [];
      this.oprefundApprovedList = [];
      this.getoprefundPending();
    } else if (link.id == 2) {
      this.activeLink2 = link;
      this.oprefundRejectedList = [];
      this.oprefundPendingList = [];
      this.getoprefundApproved();
    } else {
      this.isApprovedList = false;
      this.isPendingList = false;
      this.activeLink2 = link;
      this.getoprefundRejected();
    }
  }

  getoprefundPending() {
    this.showapprovalspinner = true;
    this.isPendingList = false;
    this.isApprovedList = false;
    this.isRejectedList = false;
    this.defaultUI = true;
    this.http
      .get(ApiConstants.getpendingoprefundapproval(this.from, this.to))
      .pipe(takeUntil(this._destroying$))
      .subscribe((data) => {
        console.log(data);
        if (data != null) {
          this.oprefundPendingList =
            data.opRefundApprovalList as OpRefundApprovalListInterface[];
          this.oprefundPendingList.forEach((item) => {
            item.billDatetime = this.datepipe.transform(
              item.billDatetime,
              "dd/MM/yyyy-hh:mm"
            );
            item.approvalRequestDateTime = this.datepipe.transform(
              item.approvalRequestDateTime,
              "dd/MM/yyyy"
            );
            // item.addedDateTime = this.datepipe.transform(
            //   item.addedDateTime,
            //   "dd/MM/yyyy, hh:mm:ss a"
            // );
            // item.updatedDateTime = this.datepipe.transform(
            //   item.updatedDateTime,
            //   "dd/MM/yyyy"
            // );
          });
          //this.oprefundApprovedList = {} as OpRefundApprovalListInterface;
          if (this.oprefundPendingList.length > 0) {
            this.showapprovalspinner = false;
            this.defaultUI = false;
            this.isPendingList = true;
            this.isApprovedList = false;
            this.isRejectedList = false;
            console.log(this.oprefundPendingList);
          } else {
            console.log("no records found");
            this.defaultUI = false;
            this.oprefundmessage = "No records found";
            this.showapprovalspinner = false;
            this.isPendingList = false;
            this.isApprovedList = false;
            this.isRejectedList = false;
          }
        }
      });
  }
  getoprefundApproved() {
    this.showapprovalspinner = true;
    this.isApprovedList = false;
    this.isPendingList = false;
    this.isRejectedList = false;
    this.defaultUI = true;
    this.http
      .get(ApiConstants.getapprovedoprefundapproval(this.from, this.to))
      .pipe(takeUntil(this._destroying$))
      .subscribe((data) => {
        console.log(data);
        if (data != null) {
          this.oprefundApprovedList = data as OpRefundApprovalListInterface[];
          this.oprefundApprovedList.forEach((item) => {
            item.approvalRequestDateTime = this.datepipe.transform(
              item.approvalRequestDateTime,
              "dd/MM/yyyy"
            );
            item.approvalDoneDateTime = this.datepipe.transform(
              item.approvalDoneDateTime,
              "dd/MM/yyyy-hh:mm:ss"
            );
            item.billDatetime = this.datepipe.transform(
              item.billDatetime,
              "dd/MM/yyyy-hh:mm:ss"
            );
            console.log(item.approvalRequestDateTime);
            console.log(item.approvalDoneDateTime);
          });
          // this.oprefundPendingList = [];
          if (this.oprefundApprovedList.length > 0) {
            this.showapprovalspinner = false;
            this.defaultUI = true;
            this.isApprovedList = true;
            this.isPendingList = false;
            this.isRejectedList = false;
            console.log(this.oprefundApprovedList);
          } else {
            console.log("no records found");
            this.showapprovalspinner = false;
            this.oprefundmessage = "No records found";
            this.defaultUI = false;
            this.isApprovedList = false;
            this.isPendingList = false;
            this.isRejectedList = false;
          }
        }
      });
  }

  getoprefundRejected() {
    this.showapprovalspinner = true;
    this.isApprovedList = false;
    this.isPendingList = false;
    this.isRejectedList = false;
    this.defaultUI = true;
    this.http
      .get(ApiConstants.getrejectedoprefundapproval(this.from, this.to))
      .pipe(takeUntil(this._destroying$))
      .subscribe((data) => {
        console.log(data);
        if (data != null) {
          this.oprefundRejectedList = data as OpRefundApprovalListInterface[];
          // this.oprefundPendingList = [];
          this.oprefundRejectedList.forEach((item) => {
            item.billDatetime = this.datepipe.transform(
              item.billDatetime,
              "dd/MM/yyyy-hh:mm:ss"
            );
            item.approvalRequestDateTime = this.datepipe.transform(
              item.approvalRequestDateTime,
              "dd/MM/yyyy"
            );
            item.rejectedDateTime = this.datepipe.transform(
              item.rejectedDateTime,
              "dd/MM/yyyy-hh:mm:ss"
            );
          });
          if (this.oprefundRejectedList.length > 0) {
            this.showapprovalspinner = false;
            this.defaultUI = true;
            this.isRejectedList = true;
            this.isApprovedList = false;
            this.isPendingList = false;
            console.log(this.oprefundApprovedList);
          } else {
            console.log("no records found");
            this.showapprovalspinner = false;
            this.defaultUI = false;
            this.oprefundmessage = "No records found";
            this.isRejectedList = false;
            this.isApprovedList = false;
            this.isPendingList = false;
          }
        }
      });
  }

  onApprove() {
    this.pendingObject(0, this.activeLink2);

    console.log(this.OprefundPending.selection.selected);

    //this.dialogservice.success("Update request Approved");
  }
  rejectList: any = [];
  onReject(link: any) {
    // if (this.pendingList.length == 0 || this.approvedList.length == 0) {
    //   console.log("inside list null");
    //   this.dialog.open(OprefundDialogComponent, {
    //     width: "25vw",
    //     height: "30vh",
    //   });
    // } else {
    //   this.pendingObject(1);
    //   this.approvedObject();
    // }
    //console.log(this.OprefundApproved.selection.selected);

    this.pendingObject(1, this.activeLink2);
    this.approvedObject(this.activeLink2);
  }
  getpendingoprefundobject(): SaveOprefundApprovalModel {
    return new SaveOprefundApprovalModel(
      this.pendingList,
      this.userId,
      this.hsplocationId
    );
  }
  getapproveoprefundobject(): SaveOprefundApprovalModel {
    return new SaveOprefundApprovalModel(
      this.approvedList,
      this.userId,
      this.hsplocationId
    );
  }
  flag!: number;
  pendingObject(value: number, activelink: any) {
    if (this.OprefundPending != undefined) {
      this.OprefundPending.selection.selected.forEach((a: any, index: any) => {
        let iacode = a.maxid.split(".")[0];
        let regno = a.maxid.split(".")[1];
        if (value == 0) {
          this.flag = 0;
        } else {
          this.flag = 1;
        }
        this.pendingList.push({
          recordId: a.id,
          flag: this.flag,
          hostName: "HostNameTest",
          risReason: "",
          serviceId: 0,
          testStatus: 0,
          iacode: iacode,
          registrationNo: regno,
          billNo: a.billNo,
          itemName: a.itemName,
        });
        console.log(this.pendingList);
      });
      if (activelink.id == 1) {
        if (this.pendingList.length == 0) {
          console.log("inside list null");
          this.dialog.open(OprefundDialogComponent, {
            width: "25vw",
            height: "30vh",
          });
        } else {
          this.http
            .post(
              ApiConstants.oprefundapprovereject,
              this.getpendingoprefundobject()
            )
            .pipe(takeUntil(this._destroying$))
            .subscribe(
              (data) => {
                console.log(data);
                if (data == "Records Successfully Done!") {
                  this.getoprefundPending();
                }
              },
              (httperrorResponse) => {
                if (
                  httperrorResponse.error.text == "Records Successfully Done!"
                ) {
                  this.pendingList = [];
                  this.defaultUI = false;
                  this.getoprefundPending();
                  this.dialogservice.success("Update Request Approved");
                }
              }
            );
        }
      }
    }
  }
  approvedObject(activelink: any) {
    this.OprefundApproved.selection.selected.forEach((a: any, index: any) => {
      let iacode = a.maxid.split(".")[0];
      let regno = a.maxid.split(".")[1];
      this.approvedList.push({
        recordId: a.id,
        flag: 1,
        hostName: "HostNameTest",
        risReason: "",
        serviceId: 0,
        testStatus: 0,
        iacode: iacode,
        registrationNo: regno,
        billNo: a.billNo,
        itemName: a.itemName,
      });
      console.log(this.approvedList);
    });
    if (activelink.id == 2) {
      if (this.approvedList.length == 0) {
        console.log("inside list null");
        this.dialog.open(OprefundDialogComponent, {
          width: "25vw",
          height: "30vh",
        });
      } else {
        this.http
          .post(
            ApiConstants.oprefundapprovereject,
            this.getapproveoprefundobject()
          )
          .pipe(takeUntil(this._destroying$))
          .subscribe(
            (data) => {
              console.log(data);
              if (data == "Records Successfully Done!") {
                this.getoprefundApproved();
                console.log("subscrfibeyy data");
              }
            },
            (httperrorResponse) => {
              console.log(httperrorResponse);
              if (
                httperrorResponse.error.text == "Records Successfully Done!"
              ) {
                console.log("inside error");
                this.approvedList = [];
                this.defaultUI = false;

                this.getoprefundApproved();
                this.dialogservice.success("Update Rejected");
              }
            }
          );
      }
    }
  }
}
