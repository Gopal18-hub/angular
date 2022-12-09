import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { QuestionControlService } from "../../../../../shared/ui/dynamic-forms/service/question-control.service";
import { __values } from "tslib";
import { DatePipe } from "@angular/common";
import { HttpService } from "@shared/services/http.service";
import { ApiConstants } from "../../../../../out_patients/core/constants/ApiConstants";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { DenyOrderListTypeModel } from "@core/models/denyOrderListModel.Model";
import { SaveInvestigationOrderModel } from "@core/models/saveInvestigationOrderModel.Model";
//import { MatDialog } from '@angular/material/dialog';
import { ModifyInvestigationOrderModel } from "@core/models/modifyInvestigationOrderModel.Model";
import { ScheduleDateDialogComponent } from "../schedule-date-dialog/schedule-date-dialog.component";
import { SaveUpdateDialogComponent } from "../save-update-dialog/save-update-dialog.component";
import { SearchService } from "@shared/services/search.service";
import { ActivatedRoute, Router } from "@angular/router";
import { LookupService } from "@core/services/lookup.service";
import { CookieService } from "@shared/services/cookie.service";
import { MatDialog } from "@angular/material/dialog";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";

@Component({
  selector: "out-patients-investigation-orders",
  templateUrl: "./investigation-orders.component.html",
  styleUrls: ["./investigation-orders.component.scss"],
})
export class InvestigationOrdersComponent implements OnInit {
  @ViewChild("invOrderDetailsTable") invOrderDetailsTable: any;
  patientInfo: any;
  investigationForm!: FormGroup;
  from: any;
  to: any;
  today = new Date();
  isShowInvestigation: boolean = true;
  isShowMedical: boolean = false;
  isBtnDisable: boolean = false;
  isBtnDisableClear: boolean = true;
  isDisableCancel: boolean = true;
  isDisableSave: boolean = true;
  isDisableDeniel: boolean = true;
  isDisableBill: boolean = true;
  EnableBill: boolean = false;
  name: any;
  questions: any;
  statusvalue: any = "";
  idValue: any = "maxid";
  private readonly _destroying$ = new Subject<void>();
  maxid = "";
  orderid = "";
  apiProcessing: boolean = false;

  investigationDetails: any;
  public denyOrderTypeList: DenyOrderListTypeModel[] = [];

  invOrderList: any = [];
  invOrderListMain: any;
  invOrderDetails: any = [];
  saveInvestigationOrderModel: SaveInvestigationOrderModel | undefined;
  physicianOrderList: any = [];
  objPhyOrder: any = [];
  objdtdenialorder: any;
  scheduleDate: any = "";
  hsplocationId: any = Number(this.cookie.get("HSPLocationId"));

  selectedRow: any = [];
  selectedInv: any = [];
  tableSelectedRows: any = [];
  denyOthers: boolean = false;

  statusDropdown = [
    { title: "All", value: "All", id: 0 },
    { title: "Billed", value: "Billed", id: 1 },
    { title: "Unbilled", value: "Unbilled", id: 2 },
    { title: "Partially Billed", value: "Partially Billed", id: 3 },
    { title: "Denied", value: "Denied", id: 4 },
  ];

  investigationFormData = {
    title: "",
    type: "object",
    properties: {
      datecheckbox: {
        type: "checkbox",
        options: [{ title: "", value: "" }],
      },
      fromdate: {
        type: "date",
        //readonly: true,
      },
      todate: {
        type: "date",
        //readonly: true,
      },
      maxid: {
        type: "dropdown",
        placeholder: "Select",
        options: [
          { title: "Max Id", value: "maxid" },
          { title: "Patient Name", value: "ptnName" },
          { title: "Doctor Name", value: "docName" },
          { title: "Mobile Number", value: "mobileNo" },
        ],
      },
      input: {
        type: "string",
        defaultValue: this.cookie.get("LocationIACode") + ".",
      },

      status: {
        type: "dropdown",
        placeholder: "Select",
        options: [
          { title: "All", value: "All" },
          { title: "Billed", value: "Billed" },
          { title: "Unbilled", value: "Unbilled" },
          { title: "Partially Billed", value: "Partially Billed" },
          { title: "Denied", value: "Denied" },
        ],
      },
      denyorder: {
        type: "dropdown",
        placeholder: "Select",
        options: this.denyOrderTypeList,
      },
      // remarks: {
      //   type: "buttonTextarea",
      //   title: "Remarks",
      //   disabled: false,
      // },
      remarks: {
        type: "buttonTextarea",
        //title: "Remarks"
      },
    },
  };
  invListConfig: any = {
    actionItems: false,
    dateformat: "dd/MM/yyyy",
    selectBox: false,
    displayedColumns: [
      "orderId",
      "maxid",
      "ptnName",
      "docName",
      "deptName",
      "visitDate",
      "mobileNo",
      "amount",
      "channel",
      "billNo",
      "billdetails",
    ],
    rowLayout: { dynamic: { rowClass: "row['billdetails']" } },
    clickedRows: true,
    clickSelection: "single",
    columnsInfo: {
      orderId: {
        title: "Order Id",
        type: "string",
        style: {
          width: "8%",
        },
      },
      maxid: {
        title: "Max Id",
        type: "string",
        style: {
          width: "8%",
        },
      },
      ptnName: {
        title: "Patient Name",
        type: "string",
        style: {
          width: "11%",
        },
      },
      docName: {
        title: "Doctor Name",
        type: "string",
        style: {
          width: "12%",
        },
      },
      deptName: {
        title: "Department",
        type: "string",
        style: {
          width: "12%",
        },
      },
      visitDate: {
        title: "Visit Date",
        type: "date",
        style: {
          width: "9%",
        },
      },
      mobileNo: {
        title: "Mobile No.",
        type: "tel",
        style: {
          width: "9%",
        },
      },
      amount: {
        title: "Amt",
        type: "currency",
        style: {
          width: "7%",
        },
      },
      channel: {
        title: "Channel",
        type: "string",
        style: {
          width: "7%",
        },
      },
      billNo: {
        title: "Bill No.",
        type: "string",
        style: {
          width: "8%",
        },
      },
      billdetails: {
        title: "Order Status",
        type: "string",
        style: {
          width: "10%",
        },
      },
    },
  };
  invDetailsConfig: any = {
    actionItems: false,
    dateformat: "dd/MM/yyyy hh:mm:ss a",
    selectBox: true,
    displayedColumns: [
      "testName",
      "docName",
      "labItemPriority",
      "visitDateTime",
      "specialization",
      "acdRemarks",
    ],
    rowLayout: { dynamic: { rowClass: "'isBilled'+row['isBilled']" } },
    columnsInfo: {
      testName: {
        title: "Test Name",
        type: "string",
        style: {
          width: "18%",
        },
      },
      docName: {
        title: "Doctor Name",
        type: "string",
        style: {
          width: "15%",
        },
      },
      labItemPriority: {
        title: "Priority",
        type: "string",
        style: {
          width: "8%",
        },
      },
      visitDateTime: {
        title: "Visit Date & Time",
        type: "date",
        style: {
          width: "14%",
        },
      },
      specialization: {
        title: "Specialization",
        type: "string",
        style: {
          width: "15%",
        },
      },
      acdRemarks: {
        title: "ACD Remarks",
        type: "textarea",
        style: {
          width: "30%",
        },
      },
    },
  };
  constructor(
    private formService: QuestionControlService,
    public datepipe: DatePipe,
    private http: HttpService,
    private searchService: SearchService,
    private router: Router,
    private route: ActivatedRoute,
    private lookupService: LookupService,
    public matdialog: MatDialog,
    private cookie: CookieService,
    private messageDialogService: MessageDialogService
  ) {}

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.investigationFormData.properties,
      {}
    );
    this.investigationForm = formResult.form;
    this.questions = formResult.questions;

    this.resetDate();
    this.resetRemarksDeny();
    this.disableBtns();
    this.questions[1].maximum = this.investigationForm.controls["todate"].value;
    this.questions[2].minimum =
      this.investigationForm.controls["fromdate"].value;
    if (this.from == undefined && this.to == undefined) {
      this.from = this.datepipe.transform(new Date(), "yyyy-MM-dd");
      this.to = this.datepipe.transform(new Date(), "yyyy-MM-dd");
    }
    this.investigationForm.controls["maxid"].setValue("maxid");
    this.isDisableBill = false;
    this.patientInfo = "";
    //Deny Order List
    this.http
      .get(ApiConstants.getdenyreasonforacd)
      .pipe(takeUntil(this._destroying$))
      .subscribe((res: any) => {
        this.denyOrderTypeList = res;
        this.questions[6].options = this.denyOrderTypeList.map((e) => {
          return { title: e.name, value: e.id };
        });
      });
    this.searchService.searchTrigger
      .pipe(takeUntil(this._destroying$))
      .subscribe(async (formdata: any) => {
        this.router.navigate([], {
          queryParams: {},
          relativeTo: this.route,
        });
        const lookupdata = await this.lookupService.searchPatient(formdata);
      });
  }
  ngAfterViewInit(): void {
    //Dialog
    this.investigationForm.controls["denyorder"].valueChanges.subscribe(
      (value: any) => {
        if (value === 10) {
          this.matdialog
            .open(ScheduleDateDialogComponent, {
              width: "33vw",
              height: "28vh",
              maxWidth: "33vw",
            })
            .afterClosed()
            .subscribe((res) => {
              // received data from dialog-component
              this.scheduleDate = this.datepipe.transform(
                res.data,
                "YYYY-MM-dd"
              );
            });
        }
        if (value === 1) {
          this.investigationForm.controls["remarks"].enable();
          this.denyOthers = true;
        } else {
          this.denyOthers = false;
          // this.investigationForm.controls["remarks"].disable();
          // this.investigationForm.controls["remarks"].setValue('');
        }
      }
    );
    this.investigationForm.controls["maxid"].valueChanges.subscribe(
      (value: any) => {
        if (value === "maxid") {
          this.investigationForm.controls["input"].setValue(
            this.cookie.get("LocationIACode") + "."
          );
          //this.investigationForm.controls["input"].setValue("test");
        } else {
          this.investigationForm.controls["input"].reset();
        }
        this.invOrderList = [];
        this.invOrderDetails = [];
        this.idValue = value;
        this.investigationForm.controls["status"].reset();
        this.patientInfo = "";
        this.EnableBill = false;
      }
    );

    //Filter
    this.investigationForm.controls["status"].valueChanges.subscribe(
      (value: any) => {
        this.patientInfo = "";
        this.EnableBill = false;
        this.invOrderList = [];
        this.invOrderDetails = [];
        this.statusvalue = value;
      }
    );

    this.investigationForm.controls["fromdate"].valueChanges.subscribe(
      (val) => {
        this.questions[2].minimum = val;
      }
    );
    this.investigationForm.controls["todate"].valueChanges.subscribe((val) => {
      this.questions[1].maximum = val;
    });
  }
  isChecked(event: any) {
    if (!this.investigationForm.controls["datecheckbox"].value) {
      this.investigationForm.controls["datecheckbox"].setValue(false);
    }

    if (this.investigationForm.controls["datecheckbox"].value == false) {
      this.investigationForm.controls["fromdate"].enable();
      this.investigationForm.controls["todate"].enable();
    }
    if (this.investigationForm.controls["datecheckbox"].value == true) {
      this.resetDate();
    }
  }
  search() {
    this.apiProcessing = true;
    this.invOrderList = [];
    this.invOrderDetails = [];
    this.patientInfo = "";
    this.EnableBill = false;

    ////changes for performance impact
    var fdate = new Date(this.investigationForm.controls["fromdate"].value);
    var tdate = new Date(this.investigationForm.controls["todate"].value);
    var dif_in_time = tdate.getTime() - fdate.getTime();
    var dif_in_days = dif_in_time / (1000 * 3600 * 24);
    if (dif_in_days < 3) {
      this.http
        .get(
          ApiConstants.getediganosticacdoninvestigation(
            this.datepipe.transform(
              this.investigationForm.controls["fromdate"].value,
              "yyyy-MM-dd"
            ),
            this.datepipe.transform(
              this.investigationForm.controls["todate"].value,
              "yyyy-MM-dd"
            ),
            this.hsplocationId
          )
        )
        // this.http
        //   .get(
        //     ApiConstants.getediganosticacdoninvestigation(
        //       "2021-01-01",
        //       "2021-01-05",
        //       7
        //     )
        //   )
        .pipe(takeUntil(this._destroying$))
        .subscribe((res: any) => {
          this.invOrderListMain = res.objTempOrderHeader; // Main Grid;
          this.invOrderList = res.objTempOrderHeader;
          this.searchFilter();
        });
    } else {
      ////changes for performance impact
      this.apiProcessing = false;
      this.messageDialogService.error(
        "Can not process requests for more than 3 Days, Please select the dates accordingly."
      );
    }
  }
  searchFilter() {
    let maxid = this.investigationForm.value.input
      ? String(this.investigationForm.value.input.trim()).toUpperCase()
      : "";
    if (!this.statusvalue && !maxid && this.invOrderListMain !== undefined) {
      this.invOrderList = this.invOrderListMain;
    } else if (this.statusvalue === "All") {
      this.invOrderList = [];
      this.invOrderList = this.invOrderListMain;
    } else if (this.statusvalue && maxid) {
      this.invOrderList = [];
      this.invOrderList = this.invOrderListMain.filter(
        (e: any) =>
          e[this.idValue].toUpperCase().includes(maxid) &&
          e.billdetails === this.statusvalue
      );
    } else if (this.statusvalue) {
      this.invOrderList = [];
      this.invOrderList = this.invOrderListMain.filter(
        (e: any) => e.billdetails === this.statusvalue
      );
    } else if (this.idValue && maxid) {
      this.invOrderList = [];
      this.invOrderList = this.invOrderListMain.filter((e: any) =>
        e[this.idValue].toUpperCase().includes(maxid)
      );
    }
    this.invOrderList.forEach((item: any) => {
      if (item.amount !== "" && item.amount !== undefined)
        item.amount = Number(item.amount).toFixed(2);
      //console.log(item.amount)
    });
    this.apiProcessing = false;
  }
  listRowClick(event: any) {
    this.EnableBill = false;
    this.invOrderDetailsTable.selection.clear();
    this.selectedInv = event;
    //this.isDisableCancel = false;
    this.tableSelectedRows = [];
    //this.invOrderDetailsTable.selection.selected = [];
    //this.invOrderDetailsTable.reset();
    this.resetRemarksDeny();
    this.disableBtns();
    let maxId = event.row.maxid;
    let orderid = event.row.orderId;
    this.maxid = maxId;
    this.orderid = orderid;
    this.patientInfo =
      event.row.maxid + " / " + event.row.ptnName + " / " + event.row.mobileNo;

    this.http
      .get(
        ApiConstants.getediganosticacdoninvestigationgrid(
          this.hsplocationId,
          orderid,
          maxId.toString().split(".")[1],
          maxId.toString().split(".")[0]
        )
      )
      // this.http
      //   .get(
      //     ApiConstants.getediganosticacdoninvestigationgrid(
      //       7,
      //       orderid,
      //       maxId.toString().split(".")[1],
      //       maxId.toString().split(".")[0]
      //     )
      //   )
      .pipe(takeUntil(this._destroying$))
      .subscribe((res: any) => {
        this.objPhyOrder = [];
        res.tempOrderBreakup.filter((e: any) => {
          if (e.isBilled == 0) {
            this.EnableBill = true;
          }
        });
        this.invOrderDetails = res.tempOrderBreakup;
        setTimeout(() => {
          this.invOrderDetailsTable.selection.changed
            .pipe(takeUntil(this._destroying$))
            .subscribe((res: any) => {
              if (this.invOrderDetailsTable.selection.selected.length > 0) {
                this.isDisableCancel = true;
                this.isDisableDeniel = true;
                this.tableSelectedRows =
                  this.invOrderDetailsTable.selection.selected;
              } else {
                this.disableBtns();
                this.resetRemarksDeny();
                this.tableSelectedRows = [];
              }
              //console.log(this.invOrderDetailsTable.selection.selected, "res")
            });
        });
      });
  }
  denyBtn() {
    let deniedRow = [];
    let nondeniedRow = [];
    let billedRow = [];
    deniedRow = this.tableSelectedRows.filter((e: any) => e.isBilled === 2);
    nondeniedRow = this.tableSelectedRows.filter((e: any) => e.isBilled === 0);
    billedRow = this.tableSelectedRows.filter((e: any) => e.isBilled === 1);

    if (deniedRow.length > 0) {
      this.messageDialogService.error("Order is already Denied");
      this.resetRemarksDeny();
      this.isDisableSave = false;
    } else if (billedRow.length > 0) {
      this.messageDialogService.error("Order is already Billed");
      this.resetRemarksDeny();
      this.isDisableSave = false;
    } else if (this.tableSelectedRows.length > 0 && nondeniedRow.length > 0) {
      this.isBtnDisable = true;
      this.investigationForm.controls["denyorder"].enable();
      this.investigationForm.controls["remarks"].enable();
      this.isDisableSave = true;
    } else {
      this.investigationForm.controls["denyorder"].disable();
      this.investigationForm.controls["remarks"].disable();
      this.isDisableSave = false;
    }
  }
  getPatientRefundSubmitRequestBody(): SaveInvestigationOrderModel {
    return (this.saveInvestigationOrderModel = new SaveInvestigationOrderModel(
      this.objPhyOrder,
      this.objdtdenialorder,
      0,
      0
    ));
  }
  tablerow(event: any) {
    if (event.column === "sno") {
      if (event.row.sno !== true) {
        this.isDisableCancel = true;
        this.isDisableDeniel = true;
      }
      if (event.row.isBilled === 0 || event.row.isBilled === 2) {
        this.selectedRow.push(event.row);
        this.isDisableCancel = true;
        this.isDisableDeniel = true;
        this.unselectRow();
      } else {
        //console.log(this.selectedRow, "Bill")
        this.messageDialogService.error("Billed order cannot be denied");
        event.row.sno = true;
        // this.isDisableCancel = false;
        // this.isDisableSave = false;
        // this.isDisableDeniel = false;
        let billRow = [];
        billRow = this.selectedRow.filter(
          (e: any) => e.sno === false || e.isBilled === 1
        );
        if (
          this.selectedRow.length === billRow.length ||
          this.selectedRow.length === 0
        ) {
          this.disableBtns();
        }
      }
    }
  }
  unselectRow() {
    setTimeout(() => {
      let unselectRow = this.selectedRow.filter((e: any) => e.sno === true);
      //console.log(unselectRow, "USR")
      if (unselectRow.length === 0) {
        this.disableBtns();
        this.resetRemarksDeny();
      }
    }, -1);
  }
  saveOrUpdate() {
    //let enabledRow = [];
    setTimeout(() => {
      let deniedRow = [];
      let nondeniedRow: any = [];
      let billedRow = [];
      deniedRow = this.tableSelectedRows.filter((e: any) => e.isBilled === 2);
      nondeniedRow = this.tableSelectedRows.filter(
        (e: any) => e.isBilled === 0
      );
      billedRow = this.tableSelectedRows.filter((e: any) => e.isBilled === 1);

      if (deniedRow.length > 0) {
        this.messageDialogService.error("Order is already Denied");
      } else if (billedRow.length > 0) {
        this.messageDialogService.error("Order is already Billed");
      } else if (nondeniedRow.length > 0 && this.tableSelectedRows.length > 0) {
        if (this.investigationForm.value.denyorder === "Select") {
          this.messageDialogService.error(
            "Please select denial reason for open order before Save!"
          );
        }
        if (this.investigationForm.value.denyorder !== "Select") {
          if (
            this.denyOthers == true &&
            !this.investigationForm.value.remarks
          ) {
            this.messageDialogService.error(
              "Please enter denial reason remark for order!"
            );
          } else {
            const dialogref = this.messageDialogService.confirm(
              "",
              "Do you want to save?"
            );

            dialogref
              .afterClosed()
              .pipe(takeUntil(this._destroying$))
              .subscribe((result) => {
                if (result.type == "yes") {
                  this.objPhyOrder = [];
                  this.objdtdenialorder = "";

                  nondeniedRow.forEach((e: any) => {
                    this.objPhyOrder.push({
                      acDisHideDrug: true,
                      visitid: e.visitId,
                      drugid: e.testID,
                      acdRemarks: e.acdRemarks,
                    });
                  });

                  this.objdtdenialorder = {
                    denialid: this.investigationForm.value.denyorder,
                    denialremark: this.investigationForm.value.remarks,
                    visitid: nondeniedRow[0].visitId,
                    nextScheduleDate: this.scheduleDate,
                    nextflag: true,
                  };
                  this.Save();
                }
              });
          }
        }
      } else {
        this.messageDialogService.error("Please select a row to proceed.");
        this.tableSelectedRows = [];
      }
    }, -1);
  }
  getSaveModel(): SaveInvestigationOrderModel {
    return new SaveInvestigationOrderModel(
      this.objPhyOrder,
      this.objdtdenialorder,
      1,
      9233
    );
  }
  Save() {
    this.http
      .post(ApiConstants.SaveAndUpdateDiagnosticOrderBill, this.getSaveModel())
      .pipe(takeUntil(this._destroying$))
      .subscribe((res: any) => {
        if (res === 1) {
          this.tableSelectedRows = [];
          this.messageDialogService.info("Saved Successfully!");
          this.search();
          //this.listRowClick(this.selectedInv);
        }
        this.objPhyOrder = [];
        this.objdtdenialorder = [];
        this.isBtnDisable = false;
        this.disableBtns();
        this.resetRemarksDeny();
      });
  }
  getModifyModel(): ModifyInvestigationOrderModel {
    return new ModifyInvestigationOrderModel(this.physicianOrderList);
  }
  cancelDenial() {
    let deniedRow: any = [];
    let nondeniedRow: any = [];
    let billedRow = [];
    deniedRow = this.tableSelectedRows.filter((e: any) => e.isBilled === 2);
    nondeniedRow = this.tableSelectedRows.filter((e: any) => e.isBilled === 0);
    billedRow = this.tableSelectedRows.filter((e: any) => e.isBilled === 1);

    if (nondeniedRow.length > 0) {
      this.messageDialogService.error(
        "Please deny the order to cancel the denial"
      );
    } else if (billedRow.length > 0) {
      this.messageDialogService.error("Order is already Billed");
    } else {
      if (deniedRow.length > 0 && this.tableSelectedRows.length > 0) {
        const dialogref = this.messageDialogService.confirm(
          "",
          "Do you want to modify?"
        );
        dialogref
          .afterClosed()
          .pipe(takeUntil(this._destroying$))
          .subscribe((result) => {
            if (result.type == "yes") {
              this.physicianOrderList = [];
              deniedRow.forEach((e: any) => {
                if (e.testID !== 0)
                  this.physicianOrderList.push({
                    acDisHideDrug: e.boolColumn,
                    visitid: e.visitId,
                    drugid: e.testID,
                    acdRemarks: e.acdRemarks,
                  });
              });
              // this.http
              //   .post(
              //     ApiConstants.modifyphysicianorderdetail("", 9233),
              //     this.getModifyModel()
              //   )
              this.http
                .post(
                  ApiConstants.modifyphysicianorderdetail(
                    "",
                    Number(this.cookie.get("UserId"))
                  ),
                  this.getModifyModel()
                )
                .pipe(takeUntil(this._destroying$))
                .subscribe((res: any) => {
                  if (res.success === true) {
                    this.messageDialogService.info("Modified Successfully");
                    this.search();
                    this.disableBtns();
                    //this.listRowClick(this.selectedInv);
                    this.tableSelectedRows = [];
                  }
                });
            }
          });
      } else {
        this.messageDialogService.error("Please select a row to proceed");
        this.tableSelectedRows = [];
      }
    }
  }
  createBill() {
    let itemid: any = [];
    // let nonBilledRows = this.tableSelectedRows.filter(
    //   (e: any) => e.isBilled != 0
    // );
    // if (nonBilledRows.length > 0) {
    //   this.messageDialogService.error(
    //     "Create Bill is applicable only for Unbilled items"
    //   );
    //   return;
    // }

    if (this.tableSelectedRows.length <= 0) {
      this.orderid = "";
    }
    this.tableSelectedRows.forEach((e: any) => {
      itemid.push(e.testID);
    });
    if (this.tableSelectedRows.length === this.invOrderDetails.length) {
      itemid = [];
    }
    this.router.navigate(["out-patient-billing"], {
      queryParams: {
        maxId: this.maxid,
        orderid: this.orderid,
        name: "Investigation",
        itemsids: itemid.join(","),
      },
    });
  }
  clearInv() {
    this.investigationForm.reset();
    this.invOrderList = [];
    this.invOrderDetails = [];
    this.resetDate();
    this.resetRemarksDeny();
    this.disableBtns();
    this.EnableBill = false;
    this.investigationForm.controls["maxid"].setValue("maxid");
    this.investigationForm.controls["status"].reset();
    this.investigationForm.controls["input"].setValue(
      this.cookie.get("LocationIACode") + "."
    );
    this.patientInfo = "";
  }
  resetRemarksDeny() {
    this.investigationForm.controls["denyorder"].setValue("Select");
    this.investigationForm.controls["denyorder"].disable();
    this.investigationForm.controls["remarks"].setValue("");
    this.investigationForm.controls["remarks"].disable();
  }
  disableBtns() {
    this.isDisableCancel = false;
    this.isDisableSave = false;
    this.isDisableDeniel = false;
  }
  resetDate() {
    this.investigationForm.controls["fromdate"].disable();
    this.investigationForm.controls["todate"].disable();
    let todaydate = new Date();
    this.investigationForm.controls["fromdate"].setValue(todaydate);
    this.investigationForm.controls["todate"].setValue(todaydate);
  }
}
