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
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";
import { SaveInvestigationOrderModel } from "@core/models/saveInvestigationOrderModel.Model";
import { ModifyInvestigationOrderModel } from "@core/models/modifyInvestigationOrderModel.Model";
import { MatDialog } from "@angular/material/dialog";
import { ScheduleDateDialogComponent } from "../schedule-date-dialog/schedule-date-dialog.component";

import { SearchService } from "@shared/services/search.service";
import { ActivatedRoute, Router } from "@angular/router";
import { LookupService } from "@core/services/lookup.service";
import { CookieService } from "@shared/services/cookie.service";
import { SaveUpdateDialogComponent } from "../save-update-dialog/save-update-dialog.component";

@Component({
  selector: "out-patients-medicine-orders",
  templateUrl: "./medicine-orders.component.html",
  styleUrls: ["./medicine-orders.component.scss"],
})
export class MedicineOrdersComponent implements OnInit {
  @ViewChild("medOrderDetailsTable") medOrderDetailsTable: any;
  investigationForm!: FormGroup;
  from: any;
  to: any;
  today = new Date();
  isShowInvestigation: boolean = true;
  isShowMedical: boolean = false;
  isBtnDisable: boolean = false;
  isBtnDisableClear: boolean = true;
  isDateDisable: boolean = false;
  isBtnDenialDisable: boolean = false;
  EnableBill: boolean = false;
  maxid = "";
  orderid = "";
  name: any;
  questions: any;
  private readonly _destroying$ = new Subject<void>();
  apiProcessing: boolean = false;

  medOrderLists: any = [];
  medOrderList: any = [];
  medOrderDetails: any = [];
  patientInfo: any;
  tokenNo: any = null;

  investigationDetails: any;
  public denyOrderTypeList: DenyOrderListTypeModel[] = [];

  objPhyOrder: any = [];
  objdtdenialorder: any;
  physicianOrderList: any = [];
  scheduleDate: any = "";
  statusvalue: any = "";
  idValue: any = "maxid";
  medOrderListMain: any;
  saveInvestigationOrderModel: SaveInvestigationOrderModel | undefined;
  hsplocationId: any = Number(this.cookie.get("HSPLocationId"));

  selectedRow: any = [];
  tableSelectedRows: any = [];
  isDisableCancel: boolean = true;
  isDisableSave: boolean = true;
  isDisableDeniel: boolean = true;
  isDisableBill: boolean = true;
  selectedInv: any = [];
  denyOthers: boolean = false;

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
      remarks: {
        type: "buttonTextarea",
      },
    },
  };

  medListConfig: any = {
    actionItems: false,
    dateformat: "dd/MM/yyyy",
    clickSelection: "single",
    selectBox: false,
    displayedColumns: [
      "orderId",
      "maxid",
      "ptnName",
      "docName",
      "deptName",
      "visitDate",
      "mobileNo",
      "mrpValue",
      "channel",
      "billNo",
      "orderStatus",
    ],
    rowLayout: { dynamic: { rowClass: "row['orderStatus']" } },
    clickedRows: true,
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
          width: "7%",
        },
      },
      mobileNo: {
        title: "Mobile No.",
        type: "tel",
        style: {
          width: "8%",
        },
      },
      mrpValue: {
        title: "Amt",
        type: "currency",
        style: {
          width: "8%",
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
      orderStatus: {
        title: "Order Status",
        type: "string",
        style: {
          width: "10%",
        },
      },
    },
  };
  medDetailsConfig: any = {
    actionItems: false,
    selectBox: true,
    dateformat: "dd/MM/yyyy hh:mm:ss a",
    displayedColumns: [
      "drug",
      "scheduleName",
      "priority",
      "days",
      "specialization",
      "visitDatetime",
      "acdRemarks",
    ],
    rowLayout: { dynamic: { rowClass: "'isBilled'+row['isBilled']" } },
    columnsInfo: {
      drug: {
        title: "Drug Name",
        type: "string",
        style: {
          width: "20%",
        },
      },
      scheduleName: {
        title: "Schedule",
        type: "string",
        style: {
          width: "15%",
        },
      },
      priority: {
        title: "Drug Qty.",
        type: "string",
        style: {
          width: "8%",
        },
      },
      days: {
        title: "Days",
        type: "string",
        style: {
          width: "5%",
        },
      },
      specialization: {
        title: "Dosage Name",
        type: "string",
        style: {
          width: "10%",
        },
      },
      visitDatetime: {
        title: "Visit Date & Time",
        type: "date",
        style: {
          width: "15%",
        },
      },

      acdRemarks: {
        title: "ACD Remarks",
        type: "textarea",
        style: {
          width: "26%",
        },
      },
    },
  };
  ipAddress = "";
  findIP: any;
  constructor(
    private formService: QuestionControlService,
    public datepipe: DatePipe,
    private http: HttpService,
    private messageDialogService: MessageDialogService,
    private searchService: SearchService,
    private router: Router,
    private route: ActivatedRoute,
    private lookupService: LookupService,
    public matdialog: MatDialog,
    private cookie: CookieService
  ) {}
  ngOnInit(): void {
    this.isDisableBill = false;
    this.patientInfo = "";
    let formResult: any = this.formService.createForm(
      this.investigationFormData.properties,
      {}
    );
    this.investigationForm = formResult.form;
    this.questions = formResult.questions;
    this.resetDate();
    this.resetRemarksDeny();
    this.disableBtns();
    this.investigationForm.controls["maxid"].setValue("maxid");
    this.questions[1].maximum = this.investigationForm.controls["todate"].value;
    this.questions[2].minimum =
      this.investigationForm.controls["fromdate"].value;
    if (this.from == undefined && this.to == undefined) {
      this.from = this.datepipe.transform(new Date(), "yyyy-MM-dd");
      this.to = this.datepipe.transform(new Date(), "yyyy-MM-dd");
    }

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

    //Global Search MaxID
    this.searchService.searchTrigger
      .pipe(takeUntil(this._destroying$))
      .subscribe(async (formdata: any) => {
        console.log(formdata);
        this.router.navigate([], {
          queryParams: {},
          relativeTo: this.route,
        });
        const lookupdata = await this.lookupService.searchPatient(formdata);
        console.log(lookupdata);
      });
    this.getIPAddress();
  }
  getIPAddress() {
    this.http.get("http://api.ipify.org/?format=json").subscribe((res: any) => {
      this.ipAddress = res.ip;
      console.log(this.ipAddress, "ipAddress");
    });
  }
  ngAfterViewInit(): void {
    this.scheduleDate = "";

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
        this.investigationForm.controls["status"].reset();
        this.medOrderList = [];
        this.medOrderDetails = [];
        this.idValue = value;
        this.patientInfo = "";
        this.EnableBill = false;
      }
    );
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
                "yyyy-MM-dd"
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

    this.investigationForm.controls["status"].valueChanges.subscribe(
      (value: any) => {
        this.statusvalue = value;
        this.medOrderList = [];
        this.medOrderDetails = [];
        this.patientInfo = "";
        this.EnableBill = false;
      }
    );
    // this.investigationForm.controls["maxid"].valueChanges.subscribe((value: any) => {
    //   this.idValue = value;
    //   this.medOrderList = []
    //   this.medOrderDetails = []
    // })
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
    this.medOrderList = [];
    this.medOrderDetails = [];
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
          ApiConstants.geteprescriptdrugorders(
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
        //    ApiConstants.geteprescriptdrugorders("2020-12-11", "2020-12-11", 7)
        //   )
        .pipe(takeUntil(this._destroying$))
        .subscribe((res: any) => {
          this.medOrderListMain = res.objOrderDetails;
          this.medOrderList = res.objOrderDetails;
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
    if (!this.statusvalue && !maxid && this.medOrderListMain !== undefined) {
      this.medOrderList = this.medOrderListMain;
    } else if (this.statusvalue === "All") {
      this.medOrderList = [];
      this.medOrderList = this.medOrderListMain;
    } else if (this.statusvalue && maxid) {
      this.medOrderList = [];
      this.medOrderList = this.medOrderListMain.filter(
        (e: any) =>
          e[this.idValue].toUpperCase().includes(maxid) &&
          e.orderStatus === this.statusvalue
      );
    } else if (this.statusvalue) {
      this.medOrderList = [];
      this.medOrderList = this.medOrderListMain.filter(
        (e: any) => e.orderStatus === this.statusvalue
      );
    } else if (this.idValue && maxid) {
      this.medOrderList = [];
      this.medOrderList = this.medOrderListMain.filter((e: any) =>
        e[this.idValue].toUpperCase().includes(maxid)
      );
    }
    this.medOrderList.forEach((item: any) => {
      if (item.mrpValue !== "" && item.mrpValue !== undefined)
        item.mrpValue = Number(item.mrpValue).toFixed(2);
      console.log(item.mrpValue);
    });
    this.apiProcessing = false;
  }
  listRowClick(event: any) {
    this.EnableBill = false;
    this.medOrderDetailsTable.selection.clear();
    this.selectedInv = event;
    //this.isDisableCancel = false;
    this.resetRemarksDeny();
    this.disableBtns();
    this.tableSelectedRows = [];
    let maxId = event.row.maxid;
    this.maxid = event.row.maxid;
    this.orderid = event.row.orderId;
    this.patientInfo =
      event.row.maxid + " / " + event.row.ptnName + " / " + event.row.mobileNo;

    this.http
      .get(
        ApiConstants.getphysicianorderdetailep(
          maxId.toString().split(".")[1],
          maxId.toString().split(".")[0],
          this.hsplocationId,
          event.row.orderId
        )
      )
      // this.http
      //   .get(
      //     ApiConstants.getphysicianorderdetailep(
      //       maxId.toString().split(".")[1],
      //       maxId.toString().split(".")[0],
      //       7,
      //       event.row.orderId
      //     )
      //   )
      .pipe(takeUntil(this._destroying$))
      .subscribe((res: any) => {
        this.objPhyOrder = [];
        res.physicianOrderDetail.filter((e: any) => {
          if (e.isBilled == 0) {
            this.EnableBill = true;
          }
        });
        this.medOrderDetails = res.physicianOrderDetail;
        this.selectedRow = [];
        setTimeout(() => {
          this.medOrderDetailsTable.selection.changed
            .pipe(takeUntil(this._destroying$))
            .subscribe((res: any) => {
              if (this.medOrderDetailsTable.selection.selected.length > 0) {
                this.isDisableCancel = true;
                this.isDisableDeniel = true;
                this.tableSelectedRows =
                  this.medOrderDetailsTable.selection.selected;
              } else {
                this.disableBtns();
                this.resetRemarksDeny();
                this.tableSelectedRows = [];
              }
              console.log(this.medOrderDetailsTable.selection.selected, "res");
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
        this.messageDialogService.error("Billed order cannot be denied");
        event.row.sno = true;
        let billRow = [];
        billRow = this.selectedRow.filter(
          (e: any) => e.sno === false || e.isBilled === 1
        );
        if (
          this.selectedRow.length === billRow.length ||
          this.selectedRow.length === 0
        ) {
          this.isDisableCancel = false;
          this.isDisableSave = false;
          this.isDisableDeniel = false;
        }
      }
    }
  }
  unselectRow() {
    setTimeout(() => {
      let unselectRow = this.selectedRow.filter((e: any) => e.sno === true);
      console.log(unselectRow, "USR");
      if (unselectRow.length === 0) {
        this.disableBtns();
        this.resetRemarksDeny();
      }
    }, -1);
  }
  generateToken() {
    // if (this.tokenNo != null) {
    //   this.messageDialogService.("Token already generated");
    // }
    if (this.tableSelectedRows.length > 0) {
      //   this.http.get(ApiConstants.GetPrintQueDetail(window.location.hostname));
      this.http
        .get(ApiConstants.GetPrintQueDetail("172.16.80.51"))
        .pipe(takeUntil(this._destroying$))
        .subscribe((res: any) => {
          this.tokenNo = res[0].waitnno;
        });
    } else {
      this.messageDialogService.error("Please select a row to generate token!");
    }
  }

  saveOrUpdate() {
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
                      drugid: e.drugid,
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
      //9233
      Number(this.cookie.get("UserId"))
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
                if (e.drugid !== 0)
                  this.physicianOrderList.push({
                    acDisHideDrug: e.acDisHideDrug,
                    visitid: e.visitId,
                    drugid: e.drugid,
                    acdRemarks: e.acdRemarks,
                  });
              });
              // this.http.post(
              //   ApiConstants.modifyphysicianorderdetail(this.tokenNo, 9233),
              //   this.getModifyModel()
              // );
              this.http
                .post(
                  ApiConstants.modifyphysicianorderdetail(
                    this.tokenNo,
                    Number(this.cookie.get("UserId"))
                  ),
                  this.getModifyModel()
                )
                .pipe(takeUntil(this._destroying$))
                .subscribe((res: any) => {
                  if (res.success === true) {
                    this.tableSelectedRows = [];
                    this.messageDialogService.info("Modified Successfully");
                    this.search();
                    //this.listRowClick(this.selectedInv);
                    this.disableBtns();
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
    //     "Kindly select only Unbilled items to create the bill"
    //   );
    //   return;
    // }
    if (this.tableSelectedRows.length <= 0) {
      this.orderid = "";
    }
    this.tableSelectedRows.forEach((e: any) => {
      itemid.push(e.testID);
    });
    if (this.tableSelectedRows.length === this.medOrderDetails.length) {
      itemid = [];
    }
    this.router.navigate(["out-patient-billing"], {
      queryParams: {
        maxId: this.maxid,
        orderid: this.orderid,
        name: "Medicine",
        itemsids: itemid.join(","),
      },
    });
  }
  clearMed() {
    this.investigationForm.reset();
    this.medOrderList = [];
    this.medOrderDetails = [];
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
