import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QuestionControlService } from '../../../../../shared/ui/dynamic-forms/service/question-control.service';
import { __values } from 'tslib';
import { DatePipe } from "@angular/common";
import { HttpService } from '@shared/services/http.service';
import { ApiConstants } from '../../../../../out_patients/core/constants/ApiConstants';
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { DenyOrderListTypeModel } from "@core/models/denyOrderListModel.Model";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";
import { SaveInvestigationOrderModel } from '@core/models/saveInvestigationOrderModel.Model';
import { ModifyInvestigationOrderModel } from '@core/models/modifyInvestigationOrderModel.Model';
import { MatDialog } from '@angular/material/dialog';
import { ScheduleDateDialogComponent } from '../schedule-date-dialog/schedule-date-dialog.component';

import { SearchService } from '@shared/services/search.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LookupService } from '@core/services/lookup.service';
import { CookieService } from '@shared/services/cookie.service';
import { MaxHealthSnackBarService } from '@shared/ui/snack-bar';
import { SaveUpdateDialogComponent } from '../save-update-dialog/save-update-dialog.component';
@Component({
  selector: 'out-patients-medicine-orders',
  templateUrl: './medicine-orders.component.html',
  styleUrls: ['./medicine-orders.component.scss']
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
  name: any;
  questions: any;
  private readonly _destroying$ = new Subject<void>();

  medOrderLists: any = [];
  medOrderList: any;
  medOrderDetails: any;
  patientInfo: any;
  tokenNo: any = null;

  investigationDetails: any;
  public denyOrderTypeList: DenyOrderListTypeModel[] = [];

  objPhyOrder: any = [];
  objdtdenialorder: any;
  physicianOrderList: any = [];
  scheduleDate: any = "";
  statusvalue: any = '';
  idValue: any = 'maxid';
  medOrderListMain: any;
  saveInvestigationOrderModel: SaveInvestigationOrderModel | undefined;
  hsplocationId: any = Number(this.cookie.get("HSPLocationId"));

  selectedRow: any = [];
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
        readonly: true,
      },
      todate: {
        type: "date",
        readonly: true,
      },
      maxid: {
        type: "dropdown",
        placeholder: "Select",
        options: [
          { title: "Max Id", value: "maxid" },
          { title: "Patient Name", value: "ptnName" },
          { title: "Doctor Name", value: "docName" },
          { title: "Mobile Number", value: "mobileNo" }
        ],
      },
      input: {
        type: "string",
        defaultValue: this.cookie.get("LocationIACode") + "."
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
        type: "string",
      }

    }
  }

  medListConfig: any = {
    actionItems: false,
    dateformat: 'dd/MM/yyyy',
    clickSelection: "single",
    selectBox: false,
    displayedColumns: ['orderId', 'maxid', 'ptnName', 'docName', 'deptName', 'visitDate', 'mobileNo', 'mrpValue', 'channel', 'billNo', 'orderStatus'],
    rowLayout: { dynamic: { rowClass: "row['orderStatus']" } },
    clickedRows: true,
    columnsInfo: {
      orderId: {
        title: 'Order Id',
        type: 'string',
        style: {
          width: "8%",
        },
      },
      maxid: {
        title: 'Max Id',
        type: 'string',
        style: {
          width: "8%",
        },
      },
      ptnName: {
        title: 'Patient Name',
        type: 'string',
        style: {
          width: "11%",
        },
      },
      docName: {
        title: 'Doctor Name',
        type: 'string',
        style: {
          width: "12%",
        },
      },
      deptName: {
        title: 'Department',
        type: 'string',
        style: {
          width: "12%",
        },
      },
      visitDate: {
        title: 'Visit Date',
        type: 'date',
        style: {
          width: "9%",
        },
      },
      mobileNo: {
        title: 'Mobile No.',
        type: 'string',
        style: {
          width: "9%",
        },
      },
      mrpValue: {
        title: 'Amt',
        type: 'string',
        style: {
          width: "5%",
        },
      },
      channel: {
        title: 'Channel',
        type: 'string',
        style: {
          width: "7%",
        },
      },
      billNo: {
        title: 'Bill No.',
        type: 'string',
        style: {
          width: "8%",
        },
      },
      orderStatus: {
        title: 'Order Status',
        type: 'string',
        style: {
          width: "10%",
        },
      }

    }

  }
  medDetailsConfig: any = {
    actionItems: false,
    dateformat: 'dd/MM/yyyy hh:mm:ss a',
    displayedColumns: ['sno', 'drug', 'doctor', 'priority', 'days', 'specialization', 'visitDatetime', 'acdRemarks'],
    rowLayout: { dynamic: { rowClass: "'isBilled'+row['isBilled']" } },
    columnsInfo: {
      sno: {
        title: '',
        type: "checkbox_active",
        disabled: false,
        style: {
          width: "80px",
        },
      },
      drug: {
        title: 'Drug Name',
        type: 'string',
        style: {
          width: "20%",
        },
      },
      doctor: {
        title: 'Schedule',
        type: 'string',
        style: {
          width: "15%",
        },
      },
      priority: {
        title: 'Drug Qty.',
        type: 'string',
        style: {
          width: "8%",
        },
      },
      days: {
        title: 'Days',
        type: 'string',
        style: {
          width: "5%",
        },
      },
      specialization: {
        title: 'Dosage Name',
        type: 'string',
        style: {
          width: "10%",
        },
      },
      visitDatetime: {
        title: 'Visit Date & Time',
        type: 'date',
        style: {
          width: "12%",
        },
      },

      acdRemarks: {
        title: 'ACD Remarks',
        type: 'textarea',
        style: {
          width: "30%",
        },
      },

    }

  }
  constructor(private formService: QuestionControlService, public datepipe: DatePipe,
    private http: HttpService, private messageDialogService: MessageDialogService,
    private searchService: SearchService, private router: Router,
    private route: ActivatedRoute,
    private lookupService: LookupService,
    public matdialog: MatDialog,
    private cookie: CookieService,
    private snackbar: MaxHealthSnackBarService,) {
  }
  ngOnInit(): void {
    this.isDisableCancel = false;
    this.isDisableSave = false;
    this.isDisableDeniel = false;
    this.isDisableBill = false;
    let formResult: any = this.formService.createForm(
      this.investigationFormData.properties,
      {}
    );
    this.investigationForm = formResult.form;
    this.questions = formResult.questions;
    this.resetDate();
    this.resetRemarksDeny();
    this.investigationForm.controls["maxid"].setValue('maxid');
    if (this.from == undefined && this.to == undefined) {
      this.from = this.datepipe.transform(new Date(), "yyyy-MM-dd");
      this.to = this.datepipe.transform(new Date(), "yyyy-MM-dd");
    }

    //Deny Order List
    this.http.get(ApiConstants.getdenyreasonforacd)
      .pipe(takeUntil(this._destroying$))
      .subscribe((res: any) => {
        this.denyOrderTypeList = res;
        this.questions[6].options = this.denyOrderTypeList.map((e) => {
          return { title: e.name, value: e.id };
        });
      })

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
  }
  ngAfterViewInit(): void {
    this.scheduleDate = "";

    this.investigationForm.controls["maxid"].valueChanges.subscribe((value: any) => {
      this.investigationForm.controls["input"].reset();
      this.investigationForm.controls["status"].reset();
    })
    this.investigationForm.controls["denyorder"].valueChanges.subscribe((value: any) => {
      if (value === 10) {
        this.matdialog.open(ScheduleDateDialogComponent).afterClosed().subscribe(res => {
          // received data from dialog-component
          this.scheduleDate = this.datepipe.transform(res.data, "yyyy-MM-dd")
        })
      }
      if (value === 1) {
        this.investigationForm.controls["remarks"].enable();
      }
      else {
        this.investigationForm.controls["remarks"].disable();
        this.investigationForm.controls["remarks"].setValue('');
      }
    })

    this.investigationForm.controls["status"].valueChanges.subscribe((value: any) => {
      this.statusvalue = value;
      this.medOrderList = []
      this.medOrderDetails = []
    })
    this.investigationForm.controls["maxid"].valueChanges.subscribe((value: any) => {
      this.idValue = value;
      this.medOrderList = []
      this.medOrderDetails = []
    })
  }
  isChecked(event: any) {
    if (!this.investigationForm.controls["datecheckbox"].value) {
      this.investigationForm.controls["datecheckbox"].setValue(false)
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
    this.medOrderList = []
    this.medOrderDetails = [];

    //this.http.get(ApiConstants.geteprescriptdrugorders("2020-12-11", "2020-12-11", 7))
    this.http.get(ApiConstants.geteprescriptdrugorders(this.datepipe.transform(this.investigationForm.controls["fromdate"].value, "yyyy-MM-dd"), this.datepipe.transform(this.investigationForm.controls["todate"].value, "yyyy-MM-dd"), this.hsplocationId))
      .pipe(takeUntil(this._destroying$))
      .subscribe((res: any) => {
        this.medOrderListMain = res.objOrderDetails;
        this.medOrderList = res.objOrderDetails;
        this.searchFilter();
      })
  }
  searchFilter() {
    if (!this.statusvalue && !this.investigationForm.value.input && this.medOrderListMain !== undefined) {
      this.medOrderList = this.medOrderListMain;

    }
    else if (this.statusvalue === 'All') {
      this.medOrderList = [];
      this.medOrderList = this.medOrderListMain
    }
    else if (this.statusvalue && this.investigationForm.value.input) {
      this.medOrderList = [];
      this.medOrderList = this.medOrderListMain.filter((e: any) => (e[this.idValue].includes(this.investigationForm.value.input) && e.orderStatus === this.statusvalue));
    }
    else if (this.statusvalue) {
      this.medOrderList = [];
      this.medOrderList = this.medOrderListMain.filter((e: any) => (e.orderStatus === this.statusvalue));
    }
    else if (this.idValue && this.investigationForm.value.input) {
      this.medOrderList = [];
      this.medOrderList = this.medOrderListMain.filter((e: any) => (e[this.idValue].includes(this.investigationForm.value.input)));
    }
  }
  listRowClick(event: any) {
    this.selectedInv = event;
    this.isDisableCancel = false;
    this.resetRemarksDeny();
    let maxId = event.row.maxid;
    this.patientInfo = event.row.maxid + " / " + event.row.ptnName + " / " + event.row.mobileNo

    this.http.get(ApiConstants.getphysicianorderdetailep(maxId.toString().split(".")[1], maxId.toString().split(".")[0], this.hsplocationId, event.row.orderId))
      //this.http.get(ApiConstants.getphysicianorderdetailep(maxId.toString().split(".")[1], maxId.toString().split(".")[0], 7, event.row.orderId))
      .pipe(takeUntil(this._destroying$))
      .subscribe((res: any) => {
        this.objPhyOrder = [];
        this.medOrderDetails = res.physicianOrderDetail;
      })
  }
  denyBtn() {

    let deniedRow = [];
    deniedRow = this.selectedRow.filter((e: any) => (e.isBilled === 2 && e.sno === true))

    if (deniedRow.length > 0) {
      this.snackbar.open("Order is already Denied", "error");
      this.isDisableSave = false;
      this.resetRemarksDeny();
    }
    else if (this.selectedRow.length > 0) {
      this.isBtnDisable = true;
      this.investigationForm.controls["denyorder"].enable();
      this.isDisableSave = true;
    }
  }
  tablerow(event: any) {
    if (event.row.sno !== true) {
      this.isDisableCancel = true;
      this.isDisableDeniel = true;
    }
    if (event.row.isBilled === 0 || event.row.isBilled === 2) {
      this.selectedRow.push(event.row);
      this.isDisableCancel = true;
      this.isDisableDeniel = true;
    }
    else {
      this.snackbar.open("Order cannot denied,As item already bill!Order cannot denied,As item already bill!", "error");
      event.row.sno = true;
      let billRow = [];
      billRow = this.selectedRow.filter((e: any) => (e.sno === false || e.isBilled === 1))
      if ((this.selectedRow.length === billRow.length) || this.selectedRow.length === 0) {
        this.isDisableCancel = false;
        this.isDisableSave = false;
        this.isDisableDeniel = false;
      }
    }
  }
  generateToken() {
    // if (this.tokenNo != null) {
    //   this.messageDialogService.info("Token already generated");
    // }

    //this.http.get(ApiConstants.GetPrintQueDetail(window.location.hostname))    
    this.http.get(ApiConstants.GetPrintQueDetail("172.16.80.51"))
      .pipe(takeUntil(this._destroying$))
      .subscribe((res: any) => {
        this.tokenNo = res[0].waitnno;
      })
  }

  saveOrUpdate() {
    if (this.investigationForm.value.denyorder === "Select") {

      this.snackbar.open("Please select denial reason for open order before Save!", "error")
    }
    if (this.investigationForm.value.denyorder !== "Select") {
      if (this.denyOthers == true && !this.investigationForm.value.remarks) {
        this.snackbar.open("Please enter denial reason remark for order!", "error")
      }
      else {
        let dialogRes;
        const dialogref = this.matdialog.open(SaveUpdateDialogComponent, {
          width: '33vw', height: '40vh', data: {
            message: "Do you want to save?"
          },
        });

        dialogref.afterClosed().subscribe(res => {
          // received data from dialog-component
          dialogRes = res.data;
          if (dialogRes === 'Y') {
            this.objPhyOrder = [];
            this.objdtdenialorder = "";
            let boolColumn = [];
            let deniedRow = [];
            deniedRow = this.selectedRow.filter((e: any) => (e.isBilled === 2 && e.sno === true))
            boolColumn = this.selectedRow.filter((e: any) => (e.sno === true && e.isBilled === 0))
            if (deniedRow.length > 0) {
              this.snackbar.open("Please deselect Order's already denied", "error");
            }
            else if (boolColumn.length === 0) {
              this.snackbar.open("Please select atleast 1 row to proceed.", "error");
            }
            else {
              boolColumn.forEach((e: any) => {
                this.objPhyOrder.push({
                  acDisHideDrug: true,
                  visitid: e.visitId,
                  drugid: e.drugid,
                  acdRemarks: e.acdRemarks
                });
              });

              this.objdtdenialorder = {
                denialid: this.investigationForm.value.denyorder,
                denialremark: this.investigationForm.value.remarks,
                visitid: this.selectedRow[0].visitId,
                nextScheduleDate: this.scheduleDate,
                nextflag: true
              }
              this.Save();

            }
          }
        })
      }
    }

  }
  getSaveModel(): SaveInvestigationOrderModel {
    return new SaveInvestigationOrderModel(
      this.objPhyOrder,
      this.objdtdenialorder,
      1,
      9233
      //Number(this.cookie.get("UserId"))
    );

  }
  Save() {
    this.http.post(ApiConstants.SaveAndUpdateDiagnosticOrderBill, this.getSaveModel())
      .pipe(takeUntil(this._destroying$))
      .subscribe((res: any) => {
        if (res === 1) {
          this.snackbar.open("Saved Successfully!", "success")
          this.selectedRow = [];
          this.listRowClick(this.selectedInv)
        }
        this.objPhyOrder = [];
        this.objdtdenialorder = [];
        this.isBtnDisable = false;
        this.isDisableCancel = false;
        this.isDisableSave = false;
        this.isDisableDeniel = false;
        this.resetRemarksDeny();
      })

  }
  getModifyModel(): ModifyInvestigationOrderModel {
    return new ModifyInvestigationOrderModel(
      this.physicianOrderList
    )
  }

  cancelDenial() {

    let nondeniedRow = [];
    nondeniedRow = this.selectedRow.filter((e: any) => (e.isBilled !== 2 && e.sno === true))

    if (nondeniedRow.length > 0) {
      this.snackbar.open("Please select the order detail to cancel deny", "error");
      this.resetRemarksDeny();
    }
    else {


      let dialogRes;
      const dialogref = this.matdialog.open(SaveUpdateDialogComponent, {
        width: '33vw', height: '40vh', data: {
          message: "Do you want to modify?"
        },
      });

      dialogref.afterClosed().subscribe(res => {
        // received data from dialog-component
        dialogRes = res.data;
        if (dialogRes === 'Y') {
          this.physicianOrderList = [];

          let nondeniedRow = [];
          let deniedRow = [];
          nondeniedRow = this.selectedRow.filter((e: any) => (e.isBilled !== 2 && e.sno === true))
          deniedRow = this.selectedRow.filter((e: any) => (e.isBilled === 2 && e.sno === true))


          if (nondeniedRow.length > 0) {
            this.snackbar.open("Please select only denied Order  to proceed.", "error")
          }
          else {
            deniedRow.forEach((e: any) => {
              if (e.drugid !== 0)
                this.physicianOrderList.push({
                  acDisHideDrug: e.acDisHideDrug,
                  visitid: e.visitId,
                  drugid: e.drugid,
                  acdRemarks: e.acdRemarks
                });
            });
            //this.http.post(ApiConstants.modifyphysicianorderdetail(this.tokenNo, 9233), this.getModifyModel())
            this.http.post(ApiConstants.modifyphysicianorderdetail(this.tokenNo, Number(this.cookie.get("UserId"))), this.getModifyModel())
              .pipe(takeUntil(this._destroying$))
              .subscribe((res: any) => {
                if (res.success === true) {
                  this.snackbar.open("Modified Successfully", "success");
                  this.selectedRow = [];
                  this.listRowClick(this.selectedInv);
                  this.isDisableCancel = false;
                  this.isDisableSave = false;
                  this.isDisableDeniel = false;
                }
              })
          }
        }
      })
    }



  }
  clearMed() {
    this.investigationForm.reset();
    this.medOrderList = [];
    this.medOrderDetails = [];
    this.resetDate();
    this.resetRemarksDeny();
    // this.isDisableCancel = false;
    // this.isDisableSave = false;
    // this.isDisableDeniel = false;
    this.investigationForm.controls["maxid"].setValue('maxid');
    this.investigationForm.controls["status"].reset();
    this.investigationForm.controls["input"].setValue(this.cookie.get("LocationIACode") + ".");

  }
  resetRemarksDeny() {
    this.investigationForm.controls["denyorder"].setValue('Select');
    this.investigationForm.controls["denyorder"].disable();
    this.investigationForm.controls["remarks"].setValue('');
    this.investigationForm.controls["remarks"].disable();
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


