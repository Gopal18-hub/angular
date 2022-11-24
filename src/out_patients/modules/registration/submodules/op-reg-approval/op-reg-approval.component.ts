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
import { OpdpendingrequestModel } from "../../../../../out_patients/core/models/OpPendingRequestModel.Model";
import { ModifyDialogComponent } from "../../../../core/modify-dialog/modify-dialog.component";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";

import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "out-patients-op-reg-approval",
  templateUrl: "./op-reg-approval.component.html",
  styleUrls: ["./op-reg-approval.component.scss"],
})
export class OpRegApprovalComponent implements OnInit {
  link1 = [
    { value: "OP Registration Approval", id: 1 },
    { value: "Hot Listing Approval", id: 2 },
    { value: "OP Refund Approval", id: 3 },
  ];
  link2 = ["View Pending Request", "Approved Requests", "Reject Requests"];
  activeLink1 = this.link1[0];
  activeLink2 = this.link2[0];

  opApprovalList: opRegApprovalModel[] = [];
  opApprovalacceptList: opRegApprovalModel[] = [];
  opApprovalrejectList: opRegApprovalModel[] = [];

  approvePostobject: any;
  rejectPostobject: any;
  hsplocationId: any = this.cookie.get("HSPLocationId");
  userId: number = Number(this.cookie.get("UserId"));
  enableapprovebtn: boolean = false;

  showapprovalpending: boolean = false;
  showapprovalaccepting: boolean = false;
  showapprovalreject: boolean = false;
  showapprovalspinner: boolean = true;
  from: any;
  to: any;
  today = new Date();
  defaultUI: boolean = false;
  opappprovalmessage: string = "Please search From Date and To Date ";
  opapprovalimage: string = "placeholder";
  patientDetails: any = [];
  modfiedPatiendDetails: any = [];

  opapprovalpageForm = new FormGroup({
    from: new FormControl(""),
    to: new FormControl(""),
  });

  @ViewChild("approvaltable") approvaltable: any;

  ApprovalidList: any = [];

  approvalconfig: any = {
    clickedRows: true,
    clickSelection: "multiple",
    dateformat: "dd/MM/yyyy",
    datetimeformat: "dd/MM/yyyy HH:mm",
    selectBox: true,
    displayedColumns: [
      "maxid",
      "fullname",
      "gender",
      "dateOfBirth",
      "uMobile",
      "uEmail",
      "unationality",
      "uForeigner",
      "usmsRecNo",
      "operatorName",
      "insertdatetime",
    ],
    columnsInfo: {
      maxid: {
        title: "Max ID",
        type: "string",
        style: {
          width: "120px",
        },
      },
      fullname: {
        title: "Patient Name",
        type: "string",
        tooltipColumn: "modifiedPtnName",
      },
      gender: {
        title: "Gender",
        type: "string",
        style: {
          width: "80px",
        },
      },
      dateOfBirth: {
        title: "DOB",
        type: "date",
        tooltipColumn: "uDateOfBirth",
        style: {
          width: "80px",
        },
      },
      uMobile: {
        title: "Mobile",
        type: "number",
        style: {
          width: "100px",
        },
      },
      uEmail: {
        title: "Email",
        type: "string",
        tooltipColumn: "uEmail",
      },
      unationality: {
        title: "Nationality",
        type: "string",
        style: {
          width: "90px",
        },
      },
      uForeigner: {
        title: "Foreigner",
        type: "checkbox",
        disabledSort: true,
        style: {
          width: "80px",
        },
      },
      usmsRecNo: {
        title: "SMS Number",
        type: "number",
      },
      operatorName: {
        title: "Requested By",
        type: "string",
      },
      insertdatetime: {
        title: "Requested Date",
        type: "datetime",
      },
    },
  };

  approveconfig: any = {
    dateformat: "dd/MM/yyyy",
    datetimeformat: "dd/MM/yyyy HH:mm",
    selectBox: false,
    displayedColumns: [
      "maxid",
      "fullname",
      "uGender",
      "uDateOfBirth",
      "uMobile",
      "uEmail",
      "unationality",
      "uForeigner",
      "usmsRecNo",
      "operatorName",
      "insertdatetime",
      "approvalDoneBy",
      "approvedDate",
    ],
    columnsInfo: {
      maxid: {
        title: "Max ID",
        type: "string",
        style: {
          width: "120px",
        },
      },
      fullname: {
        title: "Patient Name",
        type: "string",
        tooltipColumn: "fullname",
      },
      uGender: {
        title: "Gender",
        type: "string",
        disabledSort: true,
        style: {
          width: "80px",
        },
      },
      uDateOfBirth: {
        title: "DOB",
        type: "date",
        style: {
          width: "80px",
        },
      },
      uMobile: {
        title: "Mobile",
        type: "number",
        style: {
          width: "100px",
        },
      },
      uEmail: {
        title: "Email",
        type: "string",
        tooltipColumn: "email",
      },
      unationality: {
        title: "Nationality",
        type: "string",
        style: {
          width: "90px",
        },
      },
      uForeigner: {
        title: "Foreigner",
        type: "checkbox",
        disabledSort: true,
        style: {
          width: "80px",
        },
      },
      usmsRecNo: {
        title: "SMS Number",
        type: "number",
      },
      operatorName: {
        title: "Requested By",
        type: "string",
      },
      insertdatetime: {
        title: "Requested Date",
        type: "datetime",
        tooltipColumn: "insertdatetime",
      },
      approvalDoneBy: {
        title: "Approved By",
        type: "string",
      },
      approvedDate: {
        title: "Approved Date",
        type: "datetime",
        tooltipColumn: "approvedDate",
      },
    },
  };

  rejectconfig: any = {
    dateformat: "dd/MM/yyyy",
    datetimeformat: "dd/MM/yyyy HH:mm",
    selectBox: false,
    displayedColumns: [
      "maxid",
      "fullname",
      "uGender",
      "uDateOfBirth",
      "uMobile",
      "uEmail",
      "unationality",
      "uForeigner",
      "usmsRecNo",
      "operatorName",
      "insertdatetime",
      "approvalDoneBy",
      "approvedDate",
    ],
    columnsInfo: {
      maxid: {
        title: "Max ID",
        type: "string",
        style: {
          width: "120px",
        },
      },
      fullname: {
        title: "Patient Name",
        type: "string",
        tooltipColumn: "fullname",
      },
      uGender: {
        title: "Gender",
        type: "string",
        disabledSort: true,
        style: {
          width: "80px",
        },
      },
      uDateOfBirth: {
        title: "DOB",
        type: "date",
        style: {
          width: "80px",
        },
      },
      uMobile: {
        title: "Mobile",
        type: "number",
        style: {
          width: "100px",
        },
      },
      uEmail: {
        title: "Email",
        type: "string",
        tooltipColumn: "email",
      },
      unationality: {
        title: "Nationality",
        type: "string",
        style: {
          width: "90px",
        },
      },
      uForeigner: {
        title: "Foreigner",
        type: "checkbox",
        disabledSort: true,
        style: {
          width: "70px",
        },
      },
      usmsRecNo: {
        title: "SMS Number",
        type: "number",
      },
      operatorName: {
        title: "Requested By",
        type: "string",
      },
      insertdatetime: {
        title: "Requested Date",
        type: "datetime",
        tooltipColumn: "insertdatetime",
      },
      approvalDoneBy: {
        title: "Rejected By",
        type: "string",
      },
      approvedDate: {
        title: "Rejected Date",
        type: "datetime",
        tooltipColumn: "approvedDate",
      },
    },
  };

  private readonly _destroying$ = new Subject<void>();

  constructor(
    private http: HttpService,
    private router: Router,
    private searchService: SearchService,
    public datepipe: DatePipe,
    private cookie: CookieService,
    private messageDialogService: MessageDialogService,
    public matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.searchService.searchTrigger
      .pipe(takeUntil(this._destroying$))
      .subscribe((formdata: any) => {
        this.searchApproval(formdata.data);
      });
    if (this.from == undefined && this.to == undefined) {
      this.from = this.datepipe.transform(
        new Date().setMonth(new Date().getMonth() - 2),
        "yyyy-MM-dd"
      );
      this.to = this.datepipe.transform(new Date(), "yyyy-MM-dd");
    }
    this.showmain(this.link1[0]);
  }

  searchApproval(formdata: any) {
    this.defaultUI = true;
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
    this.showmain(this.link1[0]);
  }

  showmain(link: any) {
    console.log(link);
    if (link.id == 1) {
      this.activeLink2 != ""
        ? this.showgrid(this.activeLink2)
        : this.showgrid("View Pending Request");
    } else if (link.id == 2) {
      this.router.navigate(["registration", "hot-listing-approval"]);
    } else if (link.id == 3) {
      this.router.navigate(["out-patient-billing", "op-refund-approval"]);
    }
  }
  showgrid(link: any) {
    this.opApprovalList = [];
    this.opApprovalacceptList = [];
    this.opApprovalrejectList = [];
    this.defaultUI = true;
    this.showapprovalspinner = true;
    console.log(link);
    if (
      this.from == "" ||
      this.from == undefined ||
      this.to == "" ||
      this.to == undefined
    ) {
      this.defaultUI = false;
      this.showapprovalspinner = false;
    }

    if (link == "View Pending Request") {
      this.activeLink2 = link;
      this.getopapprovalpending()
        .pipe(takeUntil(this._destroying$))
        .subscribe(
          (resultData) => {
            resultData = resultData.map((item: any) => {
              item.fullname =
                item.modifiedFirstName + " " + item.modifiedLastName;
              return item;
            });

            this.showapprovalspinner = false;
            this.defaultUI = true;
            this.opApprovalList = resultData as opRegApprovalModel[];
            this.showapprovalpending = true;
            this.showapprovalaccepting = false;
            this.showapprovalreject = false;
            this.enableapprovebtn = true;

            if (this.opApprovalList.length == 0) {
              this.enableapprovebtn = false;
              this.defaultUI = false;
              this.opappprovalmessage = "No records found";
              this.opapprovalimage = "norecordfound";
            }
          },
          (error: any) => {
            this.opApprovalList = [];
            this.enableapprovebtn = false;
            this.defaultUI = false;
            this.opappprovalmessage = "No records found";
            this.opapprovalimage = "norecordfound";
            console.log(error);
          }
        );
    } else if (link == "Approved Requests") {
      this.activeLink2 = link;
      this.enableapprovebtn = false;
      this.showapprovalreject = false;
      this.showapprovalpending = false;
      this.getopapprovalaccepted()
        .pipe(takeUntil(this._destroying$))
        .subscribe(
          (resultData) => {
            resultData = resultData.map((item: any) => {
              item.fullname =
                item.modifiedFirstName + " " + item.modifiedLastName;

              return item;
            });
            this.showapprovalspinner = false;
            this.defaultUI = true;
            this.opApprovalacceptList = resultData as opRegApprovalModel[];
            this.showapprovalaccepting = true;
            console.log(this.opApprovalacceptList);
          },
          (error) => {
            this.opApprovalacceptList = [];
            console.log(error);
            this.defaultUI = false;
            this.opappprovalmessage = "No records found";
            this.opapprovalimage = "norecordfound";
          }
        );
    } else if (link == "Reject Requests") {
      this.activeLink2 = link;
      this.enableapprovebtn = false;
      this.getopapprovalrejected().subscribe(
        (resultData) => {
          resultData = resultData.map((item: any) => {
            item.fullname =
              item.modifiedFirstName + " " + item.modifiedLastName;
            return item;
          });
          this.showapprovalspinner = false;
          this.defaultUI = true;
          this.opApprovalrejectList = resultData as opRegApprovalModel[];
          this.showapprovalreject = true;
          this.showapprovalpending = false;
          this.showapprovalaccepting = false;
          console.log(this.opApprovalrejectList);
        },
        (error) => {
          this.opApprovalrejectList = [];
          console.log(error);
          this.defaultUI = false;
          this.opappprovalmessage = "No records found";
          this.opapprovalimage = "norecordfound";
        }
      );
    }
  }
  approvalPendingColumnClick($event: any) {
    this.modifyDialog($event.row);
  }
  approvedRequestColumnClick($event: any) {
    this.modifyDialog($event.row);
  }

  getopapprovalpending() {
    return this.http.get(
      ApiConstants.opapprovalpending(this.from, this.to, this.hsplocationId)
    );
  }
  getopapprovalaccepted() {
    return this.http.get(
      ApiConstants.opapprovalaccepted(this.from, this.to, this.hsplocationId)
    );
  }
  getopapprovalrejected() {
    return this.http.get(
      ApiConstants.opapprovalrejected(this.from, this.to, this.hsplocationId)
    );
  }

  createduserapprovelist: any = [];
  approvalApproveItem() {
    this.createduserapprovelist = [];
    this.approvaltable.selection.selected.map((s: any) => {
      this.ApprovalidList.push(s.id);
      this.createduserapprovelist.push({
        operatorID: s.operatorID,
        fullname: s.fullname,
        maxid: s.maxid,
      });
    });
    this.createduserapprovelist = this.createduserapprovelist.filter(
      (l: { operatorID: number }) => l.operatorID == this.userId
    );

    if (this.createduserapprovelist.length > 0) {
      var MaxId = this.createduserapprovelist.map((data: any) => data.maxid);
      this.messageDialogService.error(
        "You are not allowed to approve/reject request generated by youself." +
          "Max ID: " +
          MaxId
      );
    } else {
      this.approvePostobject = new approveRejectModel(
        this.ApprovalidList,
        this.userId,
        0
      );
      this.approvalpostapi(this.approvePostobject)
        .pipe(takeUntil(this._destroying$))
        .subscribe(
          (resultdata) => {
            console.log(resultdata);
            if (resultdata["success"]) {
              this.messageDialogService.success("Update Request Approved");
            } else {
              this.messageDialogService.info(resultdata["message"]);
            }

            this.showgrid("View Pending Request");
            this.ApprovalidList = [];
          },
          (error) => {
            console.log(error);
            this.ApprovalidList = [];
            this.defaultUI = true;
            this.opappprovalmessage = "No records found";
            this.opapprovalimage = "norecordfound";
          }
        );
    }
  }

  createduserrejectlist: any = [];
  approvalRejectItem() {
    this.createduserrejectlist = [];
    this.approvaltable.selection.selected.map((s: any) => {
      this.ApprovalidList.push(s.id);
      this.createduserrejectlist.push({
        operatorID: s.operatorID,
        fullname: s.fullname,
        maxid: s.maxid,
      });
    });

    this.createduserrejectlist = this.createduserrejectlist.filter(
      (l: { operatorID: number }) => l.operatorID == this.userId
    );

    if (this.createduserrejectlist.length > 0) {
      var MaxId = this.createduserrejectlist.map((data: any) => data.maxid);
      this.messageDialogService.error(
        "You are not allowed to approve/reject request generated by youself." +
          "Max ID: " +
          MaxId
      );
    } else {
      this.rejectPostobject = new approveRejectModel(
        this.ApprovalidList,
        this.userId,
        1
      );
      this.approvalpostapi(this.rejectPostobject)
        .pipe(takeUntil(this._destroying$))
        .subscribe(
          (resultdata) => {
            if (resultdata["success"]) {
              this.messageDialogService.success("Request is deleted");
            } else {
              this.messageDialogService.info(resultdata["message"]);
            }

            this.showgrid("View Pending Request");
            this.ApprovalidList = [];
          },
          (error) => {
            console.log(error);
            this.ApprovalidList = [];
            this.defaultUI = true;
            this.opappprovalmessage = "No records found";
            this.opapprovalimage = "norecordfound";
          }
        );
    }
  }
  approvalpostapi(approvalJSONObject: approveRejectModel[]) {
    return this.http.post(
      ApiConstants.approvalpostapproveApi,
      approvalJSONObject
    );
  }

  modifyDialog(modfiedapprovalPatiendDetailsForPopUp: OpdpendingrequestModel) {
    console.log(modfiedapprovalPatiendDetailsForPopUp);
    this.patientDetails = [];
    this.modfiedPatiendDetails = [];
    if (modfiedapprovalPatiendDetailsForPopUp.operatorID == this.userId) {
      var MaxId = modfiedapprovalPatiendDetailsForPopUp.maxid;
      this.messageDialogService.error(
        "You are not allowed to approve/reject request generated by youself." +
          "Max ID: " +
          MaxId
      );
    } else {
      this.patientDetails.push({
        firstname: modfiedapprovalPatiendDetailsForPopUp.firstName,
        middleName: modfiedapprovalPatiendDetailsForPopUp.middleName,
        lastName: modfiedapprovalPatiendDetailsForPopUp.lastName,
        sexName: modfiedapprovalPatiendDetailsForPopUp.gender,
        dateOfBirth: modfiedapprovalPatiendDetailsForPopUp.dateOfBirth,
        age: modfiedapprovalPatiendDetailsForPopUp.age,
        ageTypeName: modfiedapprovalPatiendDetailsForPopUp.ageType,
        pemail: modfiedapprovalPatiendDetailsForPopUp.email,
        pphone: modfiedapprovalPatiendDetailsForPopUp.mobile,
        nationalityName: modfiedapprovalPatiendDetailsForPopUp.nationality,
        foreigner: modfiedapprovalPatiendDetailsForPopUp.foreigner,
        id: modfiedapprovalPatiendDetailsForPopUp.id,
      });

      this.modfiedPatiendDetails.push({
        firstname: modfiedapprovalPatiendDetailsForPopUp.modifiedFirstName,
        middleName: modfiedapprovalPatiendDetailsForPopUp.modifiedMiddleName,
        lastName: modfiedapprovalPatiendDetailsForPopUp.modifiedLastName,
        title: modfiedapprovalPatiendDetailsForPopUp.uGender,
        dateOfBirth: modfiedapprovalPatiendDetailsForPopUp.uDateOfBirth,
        age: modfiedapprovalPatiendDetailsForPopUp.uAge,
        ageTypeName: modfiedapprovalPatiendDetailsForPopUp.uAgeType,
        pemail: modfiedapprovalPatiendDetailsForPopUp.uEmail,
        pphone: modfiedapprovalPatiendDetailsForPopUp.uMobile,
        nationality: modfiedapprovalPatiendDetailsForPopUp.unationality,
        foreigner: modfiedapprovalPatiendDetailsForPopUp.uForeigner,
      });

      const modifyDetailDialogref = this.matDialog.open(ModifyDialogComponent, {
        width: "30vw",
        height: "96vh",
        data: {
          patientDetails: this.patientDetails[0],
          modifiedDetails: this.modfiedPatiendDetails[0],
          submitButton: true,
          submitButtononApproved: this.showapprovalaccepting ? true : false,
        },
      });

      modifyDetailDialogref
        .afterClosed()
        .pipe(takeUntil(this._destroying$))
        .subscribe((result) => {
          console.log(result.data);
          var resultArr = result.data.split(",");
          var firstvaluekey = String(resultArr[0].split(":")[0]).trim();
          console.log(resultArr[1].trim());
          if (firstvaluekey.startsWith("Accepted")) {
            if (resultArr[1].split(":")[0].trim() == "id") {
              this.ApprovalidList.push(resultArr[1].split(":")[1]);
              this.approvePostobject = new approveRejectModel(
                this.ApprovalidList,
                this.userId,
                0
              );
              this.approvalpostapi(this.approvePostobject)
                .pipe(takeUntil(this._destroying$))
                .subscribe(
                  (resultdata) => {
                    console.log(resultdata);
                    if (resultdata["success"]) {
                      this.messageDialogService.success(
                        "Update Request Approved"
                      );
                    } else {
                      this.messageDialogService.info(resultdata["message"]);
                    }

                    this.showgrid("View Pending Request");
                    this.ApprovalidList = [];
                  },
                  (error) => {
                    console.log(error);
                    this.ApprovalidList = [];
                    this.defaultUI = true;
                    this.opappprovalmessage = "No records found";
                    this.opapprovalimage = "norecordfound";
                  }
                );
            }
          } else if (firstvaluekey.startsWith("reject")) {
            if (resultArr[1].split(":")[0].trim() == "id") {
              this.ApprovalidList.push(resultArr[1].split(":")[1]);
              this.rejectPostobject = new approveRejectModel(
                this.ApprovalidList,
                this.userId,
                1
              );
              this.approvalpostapi(this.rejectPostobject)
                .pipe(takeUntil(this._destroying$))
                .subscribe(
                  (resultdata) => {
                    if (resultdata["success"]) {
                      this.messageDialogService.success("Request is Rejected");
                    } else {
                      this.messageDialogService.info(resultdata["message"]);
                    }

                    this.showgrid("View Pending Request");
                    this.ApprovalidList = [];
                  },
                  (error) => {
                    console.log(error);
                    this.ApprovalidList = [];
                    this.defaultUI = true;
                    this.opappprovalmessage = "No records found";
                    this.opapprovalimage = "norecordfound";
                  }
                );
            }
          }
        });
    }
  }
}
