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
import { HttpClient } from "@angular/common/http";
import { switchMap } from "rxjs";
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
  maxid!: string;
  showapprovalspinner: boolean = false;
  isPendingList: boolean = false;
  isApprovedList: boolean = false;
  isRejectedList: boolean = false;
  oprefundmessage: string = "No records found";
  oprefundicon: string = "placeholder";
  pendingList: any = [];
  approvedList: any = [];
  risReasonList: any = [];
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
    clickedRows: true,
    // dateformat: "dd/MM/yyyy",
    datetimeformat: "dd/MM/yyyy HH:mm:ss",
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
      "authorisedby",
      "reason",
      "paymentMode",
      "risReason",
    ],
    columnsInfo: {
      maxid: {
        title: "Max ID",
        type: "string",
        style: {
          width: "7rem",
        },
        tooltipColumn: "maxid",
      },
      ssn: {
        title: "SSN",
        type: "string",
        style: {
          width: "7rem",
        },
        tooltipColumn: "ssn",
      },
      ptnName: {
        title: "Name",
        type: "string",
        tooltipColumn: "ptnName",
        style: {
          width: "9rem",
        },
      },
      billNo: {
        title: "Bill No",
        type: "string",
        tooltipColumn: "billNo",
        style: {
          width: "6rem",
        },
      },
      billDatetime: {
        title: "Bill Date/Time",
        type: "datetime",
        tooltipColumn: "billDatetime",
        style: {
          width: "9rem",
        },
      },
      serviceName: {
        title: "Service Name",
        type: "string",
        tooltipColumn: "serviceName",
        style: {
          width: "9rem",
        },
      },
      itemName: {
        title: "Item Name",
        type: "string",
        tooltipColumn: "itemName",
        style: {
          width: "18rem",
        },
      },
      refundAmt: {
        title: "Refund Amount",
        type: "string",
        style: {
          width: "8rem",
        },
        tooltipColumn: "refundAmt",
      },
      approvalRequestBy: {
        title: "Requested By",
        type: "string",
        tooltipColumn: "approvalRequestBy",
        style: {
          width: "13rem",
        },
      },
      approvalRequestDateTime: {
        title: "Requested Date",
        type: "datetime",
        tooltipColumn: "approvalRequestDateTime",
        style: {
          width: "8rem",
        },
      },
      authorisedby: {
        title: "Authorised  by",
        type: "string",
        tooltipColumn: "authorisedby",
        style: {
          width: "11rem",
        },
      },
      reason: {
        title: "Reason",
        type: "string",
        tooltipColumn: "reason",
        style: {
          width: "12rem",
        },
      },
      paymentMode: {
        title: "Payment Mode",
        type: "string",
        tooltipColumn: "paymentMode",
        style: {
          width: "9rem",
        },
      },
      // risReason: {
      //   title: "RISReason",
      //   type: "string",
      //   tooltipColumn: "risReason",
      //   style: {
      //     width: "8rem",
      //   },
      // },
      risReason: {
        title: "RISReason",
        type: "dropdown",
        options: this.risReasonList,
        style: {
          width: "15rem",
        },
      },
    },
  };
  oprefundapproveConfig: any = {
    actionItems: true,
    //selectBox: true,
    // dateformat: "dd/MM/yyyy",
    datetimeformat: "dd/MM/yyyy HH:mm:ss",
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
      "authorisedby",
      "reason",
      "paymentMode",
      "approvalDoneBy",
      "approvalDoneDateTime",
    ],
    columnsInfo: {
      maxid: {
        title: "Max ID",
        type: "string",
        tooltipColumn: "maxid",
        style: {
          width: "8rem",
        },
      },
      ssn: {
        title: "SSN",
        type: "string",
        tooltipColumn: "ssn",
        style: {
          width: "7rem",
        },
      },
      ptnName: {
        title: "Name",
        type: "string",
        tooltipColumn: "ptnName",
        style: {
          width: "9rem",
        },
      },
      billNo: {
        title: "Bill No",
        type: "string",
        tooltipColumn: "billNo",
        style: {
          width: "7rem",
        },
      },
      billDatetime: {
        title: "Bill Date/Time",
        type: "datetime",
        tooltipColumn: "billDatetime",
        style: {
          width: "10rem",
        },
      },
      serviceName: {
        title: "Service Name",
        type: "string",
        tooltipColumn: "serviceName",
        style: {
          width: "10rem",
        },
      },
      itemName: {
        title: "Item Name",
        type: "string",
        tooltipColumn: "itemName",
        style: {
          width: "18rem",
        },
      },
      refundAmt: {
        title: "Refund Amount",
        type: "string",
        tooltipColumn: "refundAmt",
        style: {
          width: "8rem",
        },
      },
      approvalRequestBy: {
        title: "Requested By",
        type: "string",
        tooltipColumn: "approvalRequestBy",
        style: {
          width: "13rem",
        },
      },
      approvalRequestDateTime: {
        title: "Requested Date",
        type: "datetime",
        tooltipColumn: "approvalRequestDateTime",
        style: {
          width: "11rem",
        },
      },
      authorisedby: {
        title: "Authorised  by",
        type: "string",
        tooltipColumn: "authorisedby",
        style: {
          width: "7rem",
        },
      },
      reason: {
        title: "Reason",
        type: "string",
        tooltipColumn: "reason",
        style: {
          width: "12rem",
        },
      },
      paymentMode: {
        title: "Payment Mode",
        type: "string",
        tooltipColumn: "paymentMode",
        style: {
          width: "7rem",
        },
      },
      approvalDoneBy: {
        title: "Approved By",
        type: "string",
        tooltipColumn: "approvalDoneBy",
        style: {
          width: "13rem",
        },
      },
      approvalDoneDateTime: {
        title: "Approved Date",
        type: "datetime",
        tooltipColumn: "approvalDoneDateTime",
        style: {
          width: "9rem",
        },
      },
    },
  };
  oprefundrejectConfig: any = {
    actionItems: true,
    selectBox: false,
    //dateformat: "dd/MM/yyyy",
    datetimeformat: "dd/MM/yyyy HH:mm:ss",
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
      "authorisedby",
      "reason",
      "paymentMode",
      "rejectedBy",
      "rejectedDateTime",
      "risReason",
    ],
    columnsInfo: {
      maxid: {
        title: "Max ID",
        type: "string",
        tooltipColumn: "maxid",
        style: {
          width: "8rem",
        },
      },
      ssn: {
        title: "SSN",
        type: "string",
        tooltipColumn: "ssn",
        style: {
          width: "7rem",
        },
      },
      ptnName: {
        title: "Name",
        type: "string",
        tooltipColumn: "ptnName",
        style: {
          width: "9rem",
        },
      },
      billNo: {
        title: "Bill No",
        type: "string",
        tooltipColumn: "billNo",
        style: {
          width: "7rem",
        },
      },
      billDatetime: {
        title: "Bill Date/Time",
        type: "datetime",
        tooltipColumn: "billDatetime",
        style: {
          width: "10rem",
        },
      },
      serviceName: {
        title: "Service Name",
        type: "string",
        tooltipColumn: "serviceName",
        style: {
          width: "10rem",
        },
      },
      itemName: {
        title: "Item Name",
        type: "string",
        tooltipColumn: "itemName",
        style: {
          width: "18rem",
        },
      },
      refundAmt: {
        title: "Refund Amount",
        type: "string",
        tooltipColumn: "refundAmt",
        style: {
          width: "8rem",
        },
      },
      approvalRequestBy: {
        title: "Requested By",
        type: "string",
        tooltipColumn: "approvalRequestBy",
        style: {
          width: "13rem",
        },
      },
      approvalRequestDateTime: {
        title: "Requested Date",
        type: "datetime",
        tooltipColumn: "approvalRequestDateTime",
        style: {
          width: "11rem",
        },
      },
      authorisedby: {
        title: "Authorised by",
        type: "string",
        tooltipColumn: "authorisedby",
        style: {
          width: "7rem",
        },
      },
      reason: {
        title: "Reason",
        type: "string",
        tooltipColumn: "reason",
        style: {
          width: "12rem",
        },
      },
      paymentMode: {
        title: "Payment Mode",
        type: "string",
        tooltipColumn: "paymentMode",
        style: {
          width: "8rem",
        },
      },
      rejectedBy: {
        title: "Rejected By",
        type: "string",
        tooltipColumn: "rejectedBy",
        style: {
          width: "11rem",
        },
      },
      rejectedDateTime: {
        title: "Rejected Date",
        type: "datetime",
        tooltipColumn: "rejectedDateTime",
        style: {
          width: "10rem",
        },
      },
      risReason: {
        title: "RIS Reason",
        type: "string",
        tooltipColumn: "risReason",
        style: {
          width: "12rem",
        },
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
    private dialog: MatDialog,
    private httpclient: HttpClient
  ) {}

  ngOnInit(): void {
    this.userId = Number(this.cookie.get("UserId"));
    console.log(this.userId);
    this.hsplocationId = Number(this.cookie.get("HSPLocationId"));
    this.risReasonList.push(
      {
        title: "Cancellation Not Received from RIS",
        value: "Cancellation Not Received from RIS",
      },
      {
        title: "Urgent cancellation",
        value: "Urgent cancellation",
      },
      {
        title: "Item Not Acknowledged",
        value: "Item Not Acknowledged",
      }
    );
    this.searchService.searchTrigger
      .pipe(takeUntil(this._destroying$))
      .subscribe((formdata: any) => {
        this.searchOpRefundapproval(formdata.data);
      });
    if (this.from == undefined && this.to == undefined) {
      this.from = this.datepipe.transform(
        new Date().setDate(new Date().getDate() - 1),
        "yyyy-MM-dd"
      );
      this.to = this.datepipe.transform(new Date(), "yyyy-MM-dd");
    }
    this.showmain(this.link1[2]);
  }
  ngAfterViewInit(): void {}
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
    console.log(this.from);
    console.log(this.to);
    this.http
      .get(
        ApiConstants.getpendingoprefundapproval(
          this.from,
          this.to,
          this.hsplocationId
        )
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe((data) => {
        console.log(data);
        if (data != null) {
          this.oprefundPendingList =
            data.opRefundApprovalList as OpRefundApprovalListInterface[];
          this.oprefundPendingList.forEach((item) => {
            item.refundAmt = item.refundAmt.toFixed(2);
            console.log(item.refundAmt);
            // if (item.serviceId == 42) {
            //   item.testStatus = 2;
            // }
            //enable dropdown only for radiology services.
            if (item.serviceId == 42 && item.testStatus > 0) {
              console.log("risreason enable condition");
              console.log(item.serviceId);
              console.log(item.testStatus);
              item.risReason_disabled = false;
            } else {
              console.log(item.serviceId);
              console.log(item.testStatus);
              item.risReason_disabled = true;
            }
          });
          if (this.oprefundPendingList.length > 0) {
            this.showapprovalspinner = false;
            this.defaultUI = true;
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
      .get(
        ApiConstants.getapprovedoprefundapproval(
          this.from,
          this.to,
          this.hsplocationId
        )
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe((data) => {
        console.log(data);
        if (data != null) {
          this.oprefundApprovedList = data as OpRefundApprovalListInterface[];
          this.oprefundApprovedList.forEach((item) => {
            item.refundAmt = item.refundAmt.toFixed(2);
          });
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
    console.log(this.from);
    console.log(this.to);
    this.showapprovalspinner = true;
    this.isApprovedList = false;
    this.isPendingList = false;
    this.isRejectedList = false;
    this.defaultUI = true;
    this.http
      .get(
        ApiConstants.getrejectedoprefundapproval(
          this.from,
          this.to,
          this.hsplocationId
        )
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe((data) => {
        console.log(data);
        if (data != null) {
          this.oprefundRejectedList = data as OpRefundApprovalListInterface[];
          this.oprefundRejectedList.forEach((item) => {
            item.refundAmt = item.refundAmt.toFixed(2);
            console.log(item.refundAmt);
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
    this.pendingTabObject(0, this.activeLink2);

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

    this.pendingTabObject(1, this.activeLink2);
    // this.approvedTabObject(this.activeLink2);
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
  useridList: any = [];
  requesteduser!: boolean;
  pendingTabObject(value: number, activelink: any) {
    if (this.OprefundPending != undefined) {
      this.OprefundPending.selection.selected.forEach((a: any, index: any) => {
        let iacode = a.maxid.split(".")[0];
        let regno = a.maxid.split(".")[1];
        this.maxid = iacode + "." + regno;
        //Approve - 0 , Reject- 1
        if (value == 0) {
          this.flag = 0;
        } else {
          this.flag = 1;
        }
        this.pendingList.push({
          recordId: a.id,
          flag: this.flag,
          hostName: "HostNameTest",
          risReason: a.risReason,
          serviceId: a.serviceId,
          testStatus: a.testStatus,
          iacode: iacode,
          registrationNo: regno,
          billNo: a.billNo,
          itemName: a.itemName,
        });
        this.useridList.push({
          id: a.requestRaisedById,
          maxid: a.maxid,
        });
        console.log(this.pendingList);
      });
      // if (activelink.id == 1) {
      if (this.pendingList.length == 0) {
        console.log("inside list null");
        // this.dialog.open(OprefundDialogComponent, {
        //   width: "25vw",
        //   height: "30vh",
        // });
        this.dialogservice.warning(
          "Please select atleast one item from the list"
        );
      } else {
        this.useridList.forEach((item: any) => {
          console.log(this.userId);
          if (item.id == this.userId) {
            console.log(this.useridList);
            this.dialogservice.error(
              "You are not allowed to approve/reject request generated by yourself." +
                "Max ID: " +
                item.maxid
            );
            this.useridList = [];
            this.pendingList = [];
            return;
          }
        });
        if (this.pendingList.length != 0) {
          this.showapprovalspinner = true;
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
                  this.showapprovalspinner = false;
                  this.useridList = [];
                  this.requesteduser = false;
                  this.pendingList = [];
                  this.defaultUI = false;
                  if (value == 0) {
                    this.dialogservice.success("Update Request Approved");
                  } else if (value == 1) {
                    this.dialogservice.success("Update Rejected");
                  }
                }
              },
              (httperrorResponse) => {
                if (
                  httperrorResponse.error.text == "Records Successfully Done!"
                ) {
                  this.pendingList = [];
                  this.defaultUI = false;
                  this.useridList = [];
                  this.requesteduser = false;
                  this.getoprefundPending();
                  this.showapprovalspinner = false;
                  if (value == 0) {
                    this.dialogservice.success("Update Request Approved");
                  } else if (value == 1) {
                    this.dialogservice.success("Update Rejected");
                  }
                } else {
                  console.log(httperrorResponse);
                  this.pendingList = [];
                  this.defaultUI = false;
                  this.useridList = [];
                  this.requesteduser = false;
                  this.getoprefundPending();
                  this.showapprovalspinner = false;
                  this.dialogservice.error(
                    "There is an error occured while processing your transaction, check with administrator"
                  );
                }
              }
            );
        }
      }
      //  }
    }
  }
  approvedTabObject(activelink: any) {
    console.log(this.OprefundApproved.selection.selected);
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

  ngOnDestroy() {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
