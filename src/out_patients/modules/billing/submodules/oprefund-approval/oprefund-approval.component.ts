import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";
import { HttpService } from "@shared/services/http.service";
import { ApiConstants } from "@core/constants/ApiConstants";
import { Subject, takeUntil } from "rxjs";
import { DatePipe } from "@angular/common";
import { SearchService } from "../../../../../shared/services/search.service";
import { OprefundPendingInterface } from "../../../../../out_patients/core/types/opRefundapproval/opRefundpendinglist.Interface";
import { OpRefundApprovalListInterface } from "../../../../../out_patients/core/types/opRefundapproval/opRefundpendinglist.Interface";
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
  showapprovalspinner: boolean = true;
  hotlistingmessage: string = "Please search From Date and To Date ";
  hotlistingicon: string = "placeholder";
  oprefundPendingList!: OprefundPendingInterface;
  oprefundApprovedList!: OpRefundApprovalListInterface;
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
      "name",
      "billno",
      "billdatetime",
      "servicename",
      "itemname",
      "refundamount",
      "requestedby",
    ],
    columnsInfo: {
      maxid: {
        title: "Max Id",
        type: "string",
      },
      ssn: {
        title: "SSN",
        type: "string",
      },
      name: {
        title: "Name",
        type: "string",
      },
      billno: {
        title: "Bill No",
        type: "string",
      },
      billdatetime: {
        title: "Bill Date/Time",
        type: "string",
      },
      servicename: {
        title: "Service Name",
        type: "string",
      },
      itemname: {
        title: "Item Name",
        type: "string",
      },
      refundamount: {
        title: "Refund Amount",
        type: "string",
      },
      requestedby: {
        title: "Requested By",
        type: "string",
      },
    },
  };
  constructor(
    private router: Router,
    private dialogservice: MessageDialogService,
    private http: HttpService,
    private datepipe: DatePipe,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
    // this.searchService.searchTrigger
    //   .pipe(takeUntil(this._destroying$))
    //   .subscribe((formdata: any) => {
    //     this.searchhotlisting(formdata.data);
    //   });
    this.searchService.searchTrigger
      .pipe(takeUntil(this._destroying$))
      .subscribe((formdata: any) => {
        this.searchOpRefundapproval(formdata.data);
      });
  }

  searchOpRefundapproval(formdata: any) {
    this.defaultUI = true;
    this.showapprovalspinner = true;
    this.today = new Date();
    if (formdata["from"] == "" || formdata["to"] == "") {
      this.from =
        formdata["from"] != ""
          ? formdata["from"]
          : this.today.setDate(this.today.getDate() - 23);
      this.from = this.datepipe.transform(this.from, "yyyy-MM-dd");
      this.to = formdata["to"] != "" ? formdata["to"] : new Date();
      this.to = this.datepipe.transform(this.to, "yyyy-MM-dd");
    } else {
      this.from = formdata["from"];
      this.from = this.datepipe.transform(this.from, "yyyy-MM-dd");
      this.to = formdata["to"];
      this.to = this.datepipe.transform(this.to, "yyyy-MM-dd");
    }
    this.showmain(this.link1[0]);
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
      this.http
        .get(ApiConstants.getpendingoprefundapproval)
        .pipe(takeUntil(this._destroying$))
        .subscribe((data) => {
          console.log(data);
          if (data != null) {
            this.oprefundPendingList = data as OprefundPendingInterface;
            console.log(this.oprefundPendingList);
          }
        });
    } else if (link.id == 2) {
      this.activeLink2 = link;
      this.http
        .get(ApiConstants.getapprovedoprefundapproval)
        .pipe(takeUntil(this._destroying$))
        .subscribe((data) => {
          console.log(data);
          if (data != null) {
            this.oprefundApprovedList = data as OpRefundApprovalListInterface;
            console.log(this.oprefundApprovedList);
          }
        });
    } else {
      this.activeLink2 = link;
    }
  }
  getoprefundApproval() {}
  getoprefundPending() {}

  data: any[] = [
    {
      maxid: "BLKH.789456",
      ssn: "789456",
      name: "mehak",
      billno: "blc5600152",
      billdatetime: "99/99/9999-24:51",
      servicename: "investigation",
      itemname: "hcv antibody",
      refundamount: "1500.00",
      requestedby: "Ekta sharmae",
    },
  ];

  oprefundApprove() {
    this.dialogservice.success("Update request Approved");
  }

  oprefundReject() {
    this.dialogservice.success("Update Rejected");
  }
}
