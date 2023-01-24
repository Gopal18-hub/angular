import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { opRegApprovalModel } from "../../../../../out_patients/core/models/opregapprovalModel.Model";
import { environment } from "@environments/environment";
import { HttpService } from "../../../../../shared/services/http.service";
import { opRegHotlistModel } from "../../../../../out_patients/core/models/opreghotlistapprovalModel.Model";
import { approveRejectModel } from "../../../../../out_patients/core/models/approveRejectModel";
import { ApiConstants } from "../../../../../out_patients/core/constants/ApiConstants";
import { approverejectdeleteModel } from "../../../../../out_patients/core/models/approverejectdeleteModel";
import { HotListingService } from "../../../../../out_patients/core/services/hot-listing.service";
import { Router } from "@angular/router";
import { SearchService } from "../../../../../shared/services/search.service";
import { CookieService } from "../../../../../shared/services/cookie.service";
import { FormControl, FormGroup } from "@angular/forms";
import { DatePipe } from "@angular/common";
import { MessageDialogService } from "../../../../../shared/ui/message-dialog/message-dialog.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { VisitHistoryComponent } from "@shared/modules/visit-history/visit-history.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "out-patients-hot-listing-approval",
  templateUrl: "./hot-listing-approval.component.html",
  styleUrls: ["./hot-listing-approval.component.scss"],
})
export class HotListingApprovalComponent implements OnInit {
  link1 = [
    { value: "OP Registration Approval", id: 1 },
    { value: "Hot Listing Approval", id: 2 },
    { value: "OP Refund Approval", id: 3 },
  ];
  link2 = ["View Pending Request", "Approved Requests", "Reject Requests"];
  activeLink1 = this.link1[1];
  activeLink2 = this.link2[0];
  @ViewChild("hotlistingtable") hotlistingtable: any;
  @ViewChild("approvaTable") approvaTable: any;
  @ViewChild("rejecttable") rejecttable: any;

  HotListidList: any = [];
  opApprovalHotList: opRegHotlistModel[] = [];
  opApprovalHotlistacceptList: opRegHotlistModel[] = [];
  opApprovalHotlistrejectList: opRegHotlistModel[] = [];

  showapprovalpending: boolean = false;
  showapprovalaccepting: boolean = false;
  showapprovalreject: boolean = false;
  defaultUI: boolean = false;
  enablehotlistbtn: boolean = false;
  enableDeletebtn: boolean = false;
  showhotlistingspinner: boolean = true;
  from: any;
  to: any;
  today = new Date();
  hotlistingmessage: string = "No records found";
  hotlistingicon: string = "placeholder";

  hotlistingapprovalpageForm = new FormGroup({
    from: new FormControl(""),
    to: new FormControl(""),
  });

  quickLinksRoutes: any = {
    1: "/out-patient-billing",
    2: "/out-patient-billing/details",
    3: "/out-patient-billing/deposit",
  };

  hotlistingconfig: any = {
    actionItems: true,
    actionItemList: [
      {
        title: "OP Billing",
        actionType: "custom",
        linkid: 1,
      },
      {
        title: "Bill Details",
        actionType: "custom",
        linkid: 2,
      },
      {
        title: "Deposits",
        actionType: "custom",
        linkid: 3,
      },
      {
        title: "Admission",
        actionType: "custom",
        linkid: 4,
      },
      {
        title: "Admission log",
        actionType: "custom",
        linkid: 5,
      },
      {
        title: "Visit History",
        actionType: "custom",
        linkid: 6,
      },
    ],
    dateformat: "dd/MM/yyyy",
    datetimeformat: "dd/MM/yyyy HH:mm",
    selectBox: true,
    displayedColumns: [
      "maxid",
      "ssn",
      "fullname",
      "age",
      "gender",
      "hotListing_Header",
      "hotListing_Comment",
      "approvalRequestBy",
      "approvalRequestDate",
      "categoryIcons",
    ],
    columnsInfo: {
      maxid: {
        title: "Max ID",
        type: "string",
        style: {
          width: "120px",
        },
      },
      ssn: {
        title: "SSN",
        type: "number",
        style: {
          width: "90px",
        },
      },
      fullname: {
        title: "Name",
        type: "string",
        tooltipColumn: "patientName",
        style: {
          width: "150px",
        },
      },
      age: {
        title: "Age",
        type: "number",
        disabledSort: true,
        style: {
          width: "70px",
        },
      },
      gender: {
        title: "Gender",
        type: "string",
        style: {
          width: "70px",
        },
      },
      hotListing_Header: {
        title: "Hotlisting Reason",
        type: "string",
        tooltipColumn: "hotListing_Header",
        style: {
          width: "230px",
        },
      },
      hotListing_Comment: {
        title: "Remarks",
        type: "string",
        tooltipColumn: "hotListing_Comment",
        style: {
          width: "180px",
        },
      },
      approvalRequestBy: {
        title: "Requested By",
        type: "string",
        style: {
          width: "150px",
        },
      },
      approvalRequestDate: {
        title: "Requested Date",
        type: "datetime",
        style: {
          width: "150px",
        },
      },
      categoryIcons: {
        title: "Category",
        type: "image",
        width: 34,
        style: {
          width: "220px",
        },
        disabledSort: true,
      },
    },
  };

  hotlistingapproveconfig: any = {
    actionItems: true,
    actionItemList: [
      {
        title: "OP Billing",
        actionType: "custom",
        linkid: 1,
      },
      {
        title: "Bill Details",
        actionType: "custom",
        linkid: 2,
      },
      {
        title: "Deposits",
        actionType: "custom",
        linkid: 3,
      },
      {
        title: "Admission",
        actionType: "custom",
        linkid: 4,
      },
      {
        title: "Admission log",
        actionType: "custom",
        linkid: 5,
      },
      {
        title: "Visit History",
        actionType: "custom",
        linkid: 6,
      },
    ],
    dateformat: "dd/MM/yyyy",
    datetimeformat: "dd/MM/yyyy HH:mm",
    selectBox: true,
    displayedColumns: [
      "maxid",
      "ssn",
      "fullname",
      "age",
      "gender",
      "hotListing_Header",
      "hotListing_Comment",
      "approvalRequestBy",
      "approvalRequestDate",
      "approvalRequestDoneByName",
      "approvalRequestDone",
      "categoryIcons",
    ],
    columnsInfo: {
      maxid: {
        title: "Max ID",
        type: "string",
        style: {
          width: "120px",
        },
      },
      ssn: {
        title: "SSN",
        type: "number",
      },
      fullname: {
        title: "Name",
        type: "string",
        tooltipColumn: "patientName",
      },
      age: {
        title: "Age",
        type: "number",
      },
      gender: {
        title: "Gender",
        type: "string",
        disabledSort: true,
      },
      hotListing_Header: {
        title: "Hotlisting Reason",
        type: "string",
        tooltipColumn: "hotListing_Header",
        style: {
          width: "170px",
        },
      },
      hotListing_Comment: {
        title: "Remarks",
        type: "string",
        tooltipColumn: "hotListing_Comment",
        style: {
          width: "120px",
        },
      },
      approvalRequestBy: {
        title: "Requested By",
        type: "string",
        style: {
          width: "150px",
        },
      },
      approvalRequestDate: {
        title: "Requested Date",
        type: "datetime",
        tooltipColumn: "approvalRequestDate",
        style: {
          width: "150px",
        },
      },
      approvalRequestDoneByName: {
        title: "Approved By",
        type: "string",
        style: {
          width: "150px",
        },
      },
      approvalRequestDone: {
        title: "Approved Date",
        type: "datetime",
        tooltipColumn: "approvalRequestDone",
        style: {
          width: "150px",
        },
      },
      categoryIcons: {
        title: "Category",
        type: "image",
        width: 34,
        style: {
          width: "220px",
        },
      },
    },
  };

  hotlistingrejectconfig: any = {
    actionItems: true,
    actionItemList: [
      {
        title: "OP Billing",
        actionType: "custom",
        linkid: 1,
      },
      {
        title: "Bill Details",
        actionType: "custom",
        linkid: 2,
      },
      {
        title: "Deposits",
        actionType: "custom",
        linkid: 3,
      },
      {
        title: "Admission",
        actionType: "custom",
        linkid: 4,
      },
      {
        title: "Admission log",
        actionType: "custom",
        linkid: 5,
      },
      {
        title: "Visit History",
        actionType: "custom",
        linkid: 6,
      },
    ],
    dateformat: "dd/MM/yyyy",
    datetimeformat: "dd/MM/yyyy HH:mm",
    selectBox: false,
    displayedColumns: [
      "maxid",
      "ssn",
      "fullname",
      "age",
      "gender",
      "hotListing_Header",
      "hotListing_Comment",
      "approvalRequestBy",
      "approvalRequestDate",
      "approvalRequestDoneByName",
      "approvalRequestDone",
      "categoryIcons",
    ],
    columnsInfo: {
      maxid: {
        title: "Max ID",
        type: "string",
        style: {
          width: "120px",
        },
      },
      ssn: {
        title: "SSN",
        type: "number",
      },
      fullname: {
        title: "Name",
        type: "string",
        tooltipColumn: "patientName",
      },
      age: {
        title: "Age",
        type: "number",
      },
      gender: {
        title: "Gender",
        type: "string",
        disabledSort: true,
      },
      hotListing_Header: {
        title: "Hotlisting Reason",
        type: "string",
        tooltipColumn: "hotListing_Header",
        style: {
          width: "170px",
        },
      },
      hotListing_Comment: {
        title: "Remarks",
        type: "string",
        tooltipColumn: "hotListing_Comment",
        style: {
          width: "120px",
        },
      },

      approvalRequestBy: {
        title: "Requested By",
        type: "string",
        style: {
          width: "150px",
        },
      },
      approvalRequestDate: {
        title: "Requested Date",
        type: "datetime",
        tooltipColumn: "approvalRequestDate",
        style: {
          width: "150px",
        },
      },
      approvalRequestDoneByName: {
        title: "Rejected By",
        type: "string",
        style: {
          width: "150px",
        },
      },
      approvalRequestDone: {
        title: "Rejected Date",
        type: "datetime",
        tooltipColumn: "approvalRequestDone",
        style: {
          width: "150px",
        },
      },
      categoryIcons: {
        title: "Category",
        type: "image",
        width: 34,
        style: {
          width: "220px",
        },
      },
    },
  };

  private readonly _destroying$ = new Subject<void>();

  constructor(
    private http: HttpService,
    private hotList: HotListingService,
    private router: Router,
    private searchService: SearchService,
    private cookie: CookieService,
    public datepipe: DatePipe,
    private messageDialogService: MessageDialogService,
    private matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    // this.today=
    this.searchService.searchTrigger
      .pipe(takeUntil(this._destroying$))
      .subscribe((formdata: any) => {
        this.searchhotlisting(formdata.data);
      });
    if (this.from == undefined && this.to == undefined) {
      this.from = this.datepipe.transform(
        new Date().setDate(new Date().getDate() - 1),
        "yyyy-MM-dd"
      );
      this.to = this.datepipe.transform(new Date(), "yyyy-MM-dd");
    }
    this.showmain(this.link1[1]);
  }
  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

  searchhotlisting(formdata: any) {
    this.today = new Date();
    this.defaultUI = true;
    if (formdata["from"] == "" || formdata["to"] == "") {
      this.from =
        formdata["from"] != ""
          ? formdata["from"]
          : this.today.setDate(this.today.getDate() - 1);
      this.from = this.datepipe.transform(this.from, "yyyy-MM-dd");
      this.to = formdata["to"] != "" ? formdata["to"] : new Date();
      this.to = this.datepipe.transform(this.to, "yyyy-MM-dd");
    } else {
      this.from = formdata["from"];
      this.from = this.datepipe.transform(this.from, "yyyy-MM-dd");
      this.to = formdata["to"];
      this.to = this.datepipe.transform(this.to, "yyyy-MM-dd");
    }
    this.showmain(this.link1[1]);
  }

  hsplocationId: any = this.cookie.get("HSPLocationId");
  indirectlink: any;
  showmain(link: any) {
    console.log(link);
    if (link.id == 1) {
      this.router.navigate(["registration", "op-reg-approval"]);
    } else if (link.id == 2) {
      this.activeLink1 = link;
      this.activeLink2 != ""
        ? this.showgrid(this.activeLink2)
        : this.showgrid("View Pending Request");
    } else if (link.id == 3) {
      this.router.navigate(["out-patient-billing", "op-refund-approval"]);
    }
  }
  showgrid(link: any) {
    console.log(link);
    this.opApprovalHotList = [];
    this.opApprovalHotlistacceptList = [];
    this.opApprovalHotlistrejectList = [];

    if (
      this.from == "" ||
      this.from == undefined ||
      this.to == "" ||
      this.to == undefined
    ) {
      // this.to = (this.to == "" || this.to == undefined) ?  this.today : this.to;
      // this.to = this.datepipe.transform(this.to, 'yyyy-MM-dd');
      // this.from = (this.from == "" || this.from == undefined) ? this.today.setDate( this.today.getDate() - 30 ) : this.from;
      // this.from = this.datepipe.transform(this.from, 'yyyy-MM-dd');
      this.defaultUI = false;
      this.showhotlistingspinner = false;
    }

    if (link == "View Pending Request") {
      this.activeLink2 = link;
      this.getophotlistingpending()
        .pipe(takeUntil(this._destroying$))
        .subscribe(
          (resultData) => {
            resultData = resultData.map((item: any) => {
              item.fullname = item.firstname + " " + item.lastName;
              return item;
            });
            this.showhotlistingspinner = false;
            this.defaultUI = true;
            this.opApprovalHotList = resultData as opRegHotlistModel[];
            this.opApprovalHotList = this.hotList.getAllCategoryIcons(
              this.opApprovalHotList
            );

            this.enablehotlistbtn = true;
            this.enableDeletebtn = false;
            this.showapprovalpending = true;
            this.showapprovalaccepting = false;
            this.showapprovalreject = false;
            console.log(this.opApprovalHotList);
            setTimeout(() => {
              this.hotlistingtable.actionItemClickTrigger.subscribe(
                (res: any) => {
                  console.log(res);
                  if (res) {
                    if (res.item && res.data) {
                      //if else condition due to queryparam for deposite
                      if (res.item["linkid"] == 1) {
                        if (this.quickLinksRoutes[res.item["linkid"]]) {
                          this.router.navigate(
                            [this.quickLinksRoutes[res.item["linkid"]]],
                            {
                              queryParams: { maxId: res.data["maxid"] },
                            }
                          );
                        }
                      } else if (res.item["linkid"] == 6) {
                        this.matDialog.open(VisitHistoryComponent, {
                          width: "70%",
                          height: "50%",
                          data: {
                            maxid: res.data["maxid"],
                            docid: "",
                          },
                        });
                      } else if (this.quickLinksRoutes[res.item["linkid"]]) {
                        this.router.navigate(
                          [this.quickLinksRoutes[res.item["linkid"]]],
                          {
                            queryParams: { maxID: res.data["maxid"] },
                          }
                        );
                      }
                    }
                  }
                }
              );
            });
          },
          (error) => {
            this.enablehotlistbtn = false;
            this.enableDeletebtn = false;
            this.showapprovalpending = false;
            this.defaultUI = false;
            this.hotlistingmessage = "No records found";
            // this.hotlistingicon = "norecordfound";
            console.log(error);
          }
        );
    } else if (link == "Approved Requests") {
      this.activeLink2 = link;
      this.showapprovalpending = false;
      this.showapprovalaccepting = true;
      this.showapprovalreject = false;
      this.enablehotlistbtn = false;
      this.enableDeletebtn = true;
      this.getophotlistingaccept()
        .pipe(takeUntil(this._destroying$))
        .subscribe(
          (resultData) => {
            resultData = resultData.map((item: any) => {
              item.fullname = item.firstname + " " + item.lastName;
              return item;
            });
            this.defaultUI = true;

            this.showhotlistingspinner = false;
            this.opApprovalHotlistacceptList =
              resultData as opRegHotlistModel[];
            this.opApprovalHotlistacceptList = this.hotList.getAllCategoryIcons(
              this.opApprovalHotlistacceptList
            );

            console.log(this.defaultUI);
            setTimeout(() => {
              this.approvaTable.actionItemClickTrigger.subscribe((res: any) => {
                console.log(res);
                if (res) {
                  if (res.item && res.data) {
                    //if else condition due to queryparam for deposite
                    if (res.item["linkid"] == 1) {
                      if (this.quickLinksRoutes[res.item["linkid"]]) {
                        this.router.navigate(
                          [this.quickLinksRoutes[res.item["linkid"]]],
                          {
                            queryParams: { maxId: res.data["maxid"] },
                          }
                        );
                      }
                    } else if (res.item["linkid"] == 6) {
                      this.matDialog.open(VisitHistoryComponent, {
                        width: "70%",
                        height: "50%",
                        data: {
                          maxid: res.data["maxid"],
                          docid: "",
                        },
                      });
                    } else if (this.quickLinksRoutes[res.item["linkid"]]) {
                      this.router.navigate(
                        [this.quickLinksRoutes[res.item["linkid"]]],
                        {
                          queryParams: { maxID: res.data["maxid"] },
                        }
                      );
                    }
                  }
                }
              });
            });
          },
          (error) => {
            this.enablehotlistbtn = false;
            this.enableDeletebtn = false;
            this.showapprovalaccepting = false;
            this.defaultUI = false;
            this.hotlistingmessage = "No records found";
            // this.hotlistingicon = "norecordfound";
            console.log(error);
          }
        );
    } else if (link == "Reject Requests") {
      this.activeLink2 = link;
      this.showapprovalpending = false;
      this.showapprovalaccepting = false;
      this.showapprovalreject = true;
      this.enablehotlistbtn = false;
      this.enableDeletebtn = false;
      this.getophotlistingreject()
        .pipe(takeUntil(this._destroying$))
        .subscribe(
          (resultData) => {
            resultData = resultData.map((item: any) => {
              item.fullname = item.firstname + " " + item.lastName;
              return item;
            });
            this.showhotlistingspinner = false;
            this.defaultUI = true;
            this.opApprovalHotlistrejectList =
              resultData as opRegHotlistModel[];
            this.opApprovalHotlistrejectList = this.hotList.getAllCategoryIcons(
              this.opApprovalHotlistrejectList
            );

            console.log(this.opApprovalHotlistrejectList);
            setTimeout(() => {
              this.rejecttable.actionItemClickTrigger.subscribe((res: any) => {
                console.log(res);
                if (res) {
                  if (res.item && res.data) {
                    //if else condition due to queryparam for deposite
                    if (res.item["linkid"] == 1) {
                      if (this.quickLinksRoutes[res.item["linkid"]]) {
                        this.router.navigate(
                          [this.quickLinksRoutes[res.item["linkid"]]],
                          {
                            queryParams: { maxId: res.data["maxid"] },
                          }
                        );
                      }
                    } else if (res.item["linkid"] == 6) {
                      this.matDialog.open(VisitHistoryComponent, {
                        width: "70%",
                        height: "50%",
                        data: {
                          maxid: res.data["maxid"],
                          docid: "",
                        },
                      });
                    } else if (this.quickLinksRoutes[res.item["linkid"]]) {
                      this.router.navigate(
                        [this.quickLinksRoutes[res.item["linkid"]]],
                        {
                          queryParams: { maxID: res.data["maxid"] },
                        }
                      );
                    }
                  }
                }
              });
            });
          },
          (error) => {
            this.enablehotlistbtn = false;
            this.enableDeletebtn = false;
            this.showapprovalreject = false;
            this.defaultUI = false;
            this.hotlistingmessage = "No records found";
            // this.hotlistingicon = "norecordfound";
            console.log(error);
          }
        );
    }
  }

  hotlistApproveItem() {
    if (this.hotlistingtable.selection.selected.length > 0) {
      this.hotlistingtable.selection.selected.map((s: any) => {
        this.HotListidList.push({ id: s.id });
      });
      let userId = Number(this.cookie.get("UserId"));
      this.hotlistingpostapi(this.HotListidList, userId, 1)
        .pipe(takeUntil(this._destroying$))
        .subscribe(
          (resultdata) => {
            console.log(resultdata);
            if (resultdata["success"]) {
              this.messageDialogService.success(resultdata["message"]);
            } else {
              this.messageDialogService.info(resultdata["message"]);
            }

            this.showgrid("View Pending Request");
            this.HotListidList = [];
          },
          (error) => {
            console.log(error);
            this.HotListidList = [];
            this.defaultUI = false;
            this.hotlistingmessage = "No records found";
            // this.hotlistingicon = "norecordfound";
          }
        );
    } else {
      this.messageDialogService.info("No record selected to approve/reject");
    }
  }

  hotlistRejectItem() {
    if (this.hotlistingtable.selection.selected.length > 0) {
      this.hotlistingtable.selection.selected.map((s: any) => {
        this.HotListidList.push({ id: s.id });
      });
      let userId = Number(this.cookie.get("UserId"));
      this.hotlistingpostapi(this.HotListidList, userId, 2)
        .pipe(takeUntil(this._destroying$))
        .subscribe(
          (resultdata) => {
            console.log(resultdata);
            this.messageDialogService.success("Update Request Rejected");
            this.showgrid("View Pending Request");
            this.HotListidList = [];
          },
          (error) => {
            console.log(error);
            this.HotListidList = [];
            this.defaultUI = false;
            this.hotlistingmessage = "No records found";
            // this.hotlistingicon = "norecordfound";
          }
        );
    } else {
      this.messageDialogService.info("No record selected to approve/reject");
    }
  }

  hotlistDeleteItem() {
    if (this.approvaTable.selection.selected.length > 0) {
      this.approvaTable.selection.selected.map((s: any) => {
        this.HotListidList.push({ id: s.id });
      });
      let userId = Number(this.cookie.get("UserId"));
      this.hotlistingpostapi(this.HotListidList, userId, 3)
        .pipe(takeUntil(this._destroying$))
        .subscribe(
          (resultdata) => {
            console.log(resultdata);
            this.messageDialogService.success("Update Request Deleted");
            this.showgrid("Approved Requests");
            this.HotListidList = [];
          },
          (error) => {
            console.log(error);
            this.HotListidList = [];
            this.defaultUI = false;
            this.hotlistingmessage = "No records found";
            // this.hotlistingicon = "norecordfound";
          }
        );
    } else {
      this.messageDialogService.info("No approved record selected for delete");
    }
  }

  hotlistingpostapi(
    hotlistingJSONObject: approverejectdeleteModel[],
    userid: number,
    flag: number
  ) {
    return this.http.post(
      ApiConstants.hotlistingpostapproveApi(userid, flag),
      hotlistingJSONObject
    );
  }

  getophotlistingpending() {
    return this.http.get(
      ApiConstants.ophotlistingpending(this.from, this.to, this.hsplocationId)
    );
  }
  getophotlistingaccept() {
    return this.http.get(
      ApiConstants.ophotlistingaccept(this.from, this.to, this.hsplocationId)
    );
  }
  getophotlistingreject() {
    return this.http.get(
      ApiConstants.ophotlistingreject(this.from, this.to, this.hsplocationId)
    );
  }
}
