import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";

@Component({
  selector: "out-patients-oprefund-approval",
  templateUrl: "./oprefund-approval.component.html",
  styleUrls: ["./oprefund-approval.component.scss"],
})
export class OprefundApprovalComponent implements OnInit {
  link1 = [
    "OP Registration Approval",
    "Hot Listing Approval",
    "OP Refund Approval",
  ];
  link2 = ["View Pending Request", "Approved Requests", "Reject Requests"];
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
    private dialogservice: MessageDialogService
  ) {}

  ngOnInit(): void {}

  showmain(link: any) {
    console.log(link);
    if (link == "OP Registration Approval") {
      this.router.navigate(["registration", "op-reg-approval"]);
    } else if (link == "Hot Listing Approval") {
      this.router.navigate(["registration", "hot-listing-approval"]);
    } else if (link == "OP Refund Approval") {
      // this.router.navigate(["out-patient-billing", "op-refund=approval"]);
      this.activeLink1 = link;
      this.activeLink2 != ""
        ? this.showgrid(this.activeLink2)
        : this.showgrid("View Pending Request");
    }
  }
  showgrid(link: any) {
    console.log(link);
    if (link == "View Pending Request") {
      this.activeLink2 = link;
    } else if (link == "Approved Requests") {
      this.activeLink2 = link;
    } else {
      this.activeLink2 = link;
    }
  }

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
