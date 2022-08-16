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
import { SaveInvestigationOrderModel } from "@core/models/saveInvestigationOrderModel.Model";
//import { MatDialog } from '@angular/material/dialog';
import { MessageDialogService } from '@shared/ui/message-dialog/message-dialog.service';
import { ModifyInvestigationOrderModel } from '@core/models/modifyInvestigationOrderModel.Model';
import { ScheduleDateDialogComponent } from '../schedule-date-dialog/schedule-date-dialog.component';

import { SearchService } from '@shared/services/search.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LookupService } from '@core/services/lookup.service';
import { CookieService } from '@shared/services/cookie.service';
import {
  MatDialog
} from "@angular/material/dialog";
//import { ScheduleDateDialogComponent } from '@modules/registration/submodules/appointment-search/appointment-search-dialog/appointment-search-dialog.component';

@Component({
  selector: 'out-patients-investigation-orders',
  templateUrl: './investigation-orders.component.html',
  styleUrls: ['./investigation-orders.component.scss']
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
  name: any;
  questions: any;
  statusvalue: any = '';
  idValue: any = 'maxid';
  private readonly _destroying$ = new Subject<void>();

  investigationDetails: any;
  public denyOrderTypeList: DenyOrderListTypeModel[] = [];

  invOrderList: any = [];
  invOrderListMain: any;
  invOrderDetails: any;
  saveInvestigationOrderModel: SaveInvestigationOrderModel | undefined;
  physicianOrderList: any = [];
  objPhyOrder: any = [];
  objdtdenialorder: any;
  scheduleDate: any = "";
  hsplocationId: any = Number(this.cookie.get("HSPLocationId"));

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
      },
      todate: {
        type: "date",
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
        //defaultValue: this.cookie.get("LocationIACode") + "."
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
        options: this.denyOrderTypeList
      },
      remarks: {
        type: "string",
      }
    }
  }
  invListConfig: any = {
    actionItems: false,
    dateformat: 'dd/MM/yyyy',
    selectBox: false,
    displayedColumns: ['orderId', 'maxid', 'ptnName', 'docName', 'deptName', 'visitDate', 'mobileNo', 'amount', 'channel', 'billNo', 'billdetails'],
    rowLayout: { dynamic: { rowClass: "row['billdetails']" } },
    clickedRows: true,
    clickSelection: "single",
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
      amount: {
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
      billdetails: {
        title: 'Order Status',
        type: 'string',
        style: {
          width: "10%",
        },
      }

    }

  }
  invDetailsConfig: any = {
    actionItems: false,
    dateformat: 'dd/MM/yyyy hh:mm:ss a',
    // selectBox: true,
    displayedColumns: ['boolColumn', 'testName', 'docName', 'labItemPriority', 'visitDateTime', 'specialization', 'acdRemarks'],
    rowLayout: { dynamic: { rowClass: "'isBilled'+row['isBilled']" } },
    columnsInfo: {
      boolColumn: {
        title: '',
        type: "checkbox_active",
        disabled: false,
        style: {
          width: "80px",
        },
      },
      testName: {
        title: 'Test Name',
        type: 'string',
        style: {
          width: "18%",
        },
      },
      docName: {
        title: 'Doctor Name',
        type: 'string',
        style: {
          width: "15%",
        },
      },
      labItemPriority: {
        title: 'Priority',
        type: 'string',
        style: {
          width: "8%",
        },
      },
      visitDateTime: {
        title: 'Visit Date & Time',
        type: 'date',
        style: {
          width: "14%",
        },
      },
      specialization: {
        title: 'Specialization',
        type: 'string',
        style: {
          width: "10%",
        },
      },
      acdRemarks: {
        title: 'ACD Remarks',
        type: 'textarea',
        style: {
          width: "35%",
        },
      },

    }

  }
  constructor(private formService: QuestionControlService, public datepipe: DatePipe, private http: HttpService,
    private messageDialogService: MessageDialogService,
    private searchService: SearchService, private router: Router,
    private route: ActivatedRoute,
    private lookupService: LookupService,
    public matdialog: MatDialog,
    private cookie: CookieService,
  ) { }
  denyBtn() {
    this.isBtnDisable = true;
    this.investigationForm.controls["denyorder"].enable();
  }

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.investigationFormData.properties,
      {}
    );
    this.investigationForm = formResult.form;
    this.questions = formResult.questions;
    this.investigationForm.controls["fromdate"].disable();
    this.investigationForm.controls["todate"].disable();
    let todaydate = new Date();
    this.investigationForm.controls["fromdate"].setValue(todaydate);
    this.investigationForm.controls["todate"].setValue(todaydate);
    this.investigationForm.controls["maxid"].setValue('maxid');
    //this.investigationForm.controls["status"].setValue('Unbilled');
    if (this.from == undefined && this.to == undefined) {
      this.from = this.datepipe.transform(new Date(), "yyyy-MM-dd");
      this.to = this.datepipe.transform(new Date(), "yyyy-MM-dd");
    }
    this.investigationForm.controls["denyorder"].disable();
    //Deny Order List
    this.http.get(ApiConstants.getdenyreasonforacd)
      .pipe(takeUntil(this._destroying$))
      .subscribe((res: any) => {
        this.denyOrderTypeList = res;
        this.questions[6].options = this.denyOrderTypeList.map((e) => {
          return { title: e.name, value: e.id };
        });
      })
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
    //Dialog
    this.investigationForm.controls["denyorder"].valueChanges.subscribe((value: any) => {
      if (value === 10) {
        this.matdialog.open(ScheduleDateDialogComponent).afterClosed().subscribe(res => {
          // received data from dialog-component
          this.scheduleDate = this.datepipe.transform(res.data, "YYYY-MM-dd")
        })
      }
    })
    this.investigationForm.controls["maxid"].valueChanges.subscribe((value: any) => {
      this.investigationForm.controls["input"].reset();
      this.investigationForm.controls["status"].reset();
    })

    //Filter
    this.investigationForm.controls["status"].valueChanges.subscribe((value: any) => {
      this.invOrderList = []
      this.invOrderDetails = []
      this.statusvalue = value;
    })
    this.investigationForm.controls["maxid"].valueChanges.subscribe((value: any) => {
      this.invOrderList = []
      this.invOrderDetails = []
      this.idValue = value;
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
      let todaydate = new Date();
      this.investigationForm.controls["fromdate"].setValue(todaydate);
      this.investigationForm.controls["todate"].setValue(todaydate);
      this.investigationForm.controls["fromdate"].disable();
      this.investigationForm.controls["todate"].disable();

    }
  }

  search() {
    this.invOrderList = [];
    this.invOrderDetails = [];
    if ((this.statusvalue !== "" || this.investigationForm.value.input !== "") && this.invOrderListMain.length !== 0) {
      this.searchFilter();
    }
    else {
      this.http.get(ApiConstants.getediganosticacdoninvestigation(this.datepipe.transform(this.investigationForm.controls["fromdate"].value, "yyyy-MM-dd"), this.datepipe.transform(this.investigationForm.controls["todate"].value, "yyyy-MM-dd"), this.hsplocationId))
        //this.http.get(ApiConstants.getediganosticacdoninvestigation("2021-01-01", "2021-01-05", 7))
        .pipe(takeUntil(this._destroying$))
        .subscribe((res: any) => {
          this.invOrderListMain = res.objTempOrderHeader // Main Grid;         
          this.invOrderList = res.objTempOrderHeader;
        })
    }
  }
  searchFilter() {
    if (!this.statusvalue && !this.investigationForm.value.input && this.invOrderListMain !== undefined) {
      this.invOrderList = this.invOrderListMain;
      console.log(this.invOrderList);
    }
    else if (this.statusvalue === 'All') {
      this.invOrderList = [];
      this.invOrderList = this.invOrderListMain;
    }
    else if (this.statusvalue && this.investigationForm.value.input) {
      this.invOrderList = [];
      this.invOrderList = this.invOrderListMain.filter((e: any) => (e[this.idValue] === this.investigationForm.value.input && e.billdetails === this.statusvalue))
    }
    else if (this.statusvalue) {
      this.invOrderList = [];
      this.invOrderList = this.invOrderListMain.filter((e: any) => ((e.billdetails === this.statusvalue)));
    }
    else if (this.idValue && this.investigationForm.value.input) {
      this.invOrderList = [];
      this.invOrderList = this.invOrderListMain.filter((e: any) => ((e[this.idValue] === this.investigationForm.value.input)));
    }
  }

  listRowClick(event: any) {
    let maxId = event.row.maxid;
    let orderid = event.row.orderId;
    this.patientInfo = event.row.maxid + " / " + event.row.ptnName + " / " + event.row.mobileNo

    this.http.get(ApiConstants.getediganosticacdoninvestigationgrid(this.hsplocationId, orderid, maxId.toString().split(".")[1], maxId.toString().split(".")[0]))
      //this.http.get(ApiConstants.getediganosticacdoninvestigationgrid(7, orderid, maxId.toString().split(".")[1], maxId.toString().split(".")[0]))
      .pipe(takeUntil(this._destroying$))
      .subscribe((res: any) => {
        this.objPhyOrder = [];
        this.invOrderDetails = res.tempOrderBreakup;
        console.log(this.invOrderDetails, "invOrderDetails")
      })
  }

  getPatientRefundSubmitRequestBody(): SaveInvestigationOrderModel {
    return (this.saveInvestigationOrderModel = new SaveInvestigationOrderModel(
      this.objPhyOrder, this.objdtdenialorder, 0, 0
    ));
  }

  saveOrUpdate() {
    this.objPhyOrder = [];
    this.objdtdenialorder = "";
    //this.physicianOrderList=[];
    if (this.invOrderDetailsTable.selection.selected.length === 0) {
      this.messageDialogService.info("Please select atleast 1 row to proceed.");
    }
    else {
      this.invOrderDetailsTable.selection.selected.forEach((e: any) => {
        //if (e.testID !== 0)
        this.objPhyOrder.push({
          acDisHideDrug: true,
          visitid: e.visitId,
          drugid: e.testID,
          acdRemarks: e.acdRemarks
        });
      });
      if (this.investigationForm.value.denyorder && !this.investigationForm.value.remarks) {
        this.messageDialogService.info("Please enter denial reason remark for order!")
      }
      if (!this.investigationForm.value.denyorder) {
        this.messageDialogService.info("Please select denial reason for open order before close!")
      }
      if (this.investigationForm.value.remarks && this.investigationForm.value.denyorder && this.invOrderDetailsTable.selection.selected[0].visitId) {
        this.objdtdenialorder = {
          denialid: this.investigationForm.value.denyorder,
          denialremark: this.investigationForm.value.remarks,
          visitid: this.invOrderDetailsTable.selection.selected[0].visitId,
          nextScheduleDate: this.scheduleDate,
          nextflag: true
        }
      }
      this.Save();
    }

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

    this.http.post(ApiConstants.SaveAndUpdateDiagnosticOrderBill, this.getSaveModel())
      .pipe(takeUntil(this._destroying$))
      .subscribe((res: any) => {
        if (res === 1) {
          this.messageDialogService.success("Saved Successfully!");
          this.invOrderDetails = []
        }
        this.objPhyOrder = [];
        this.objdtdenialorder = [];
        this.isBtnDisable = false;
        this.investigationForm.controls["denyorder"].reset();
        this.investigationForm.controls["remarks"].setValue("");
        this.investigationForm.controls["denyorder"].disable();
      })


  }
  getModifyModel(): ModifyInvestigationOrderModel {
    return new ModifyInvestigationOrderModel(
      this.physicianOrderList
    )
  }
  cancelDenial() {
    this.physicianOrderList = [];
    if (this.invOrderDetailsTable.selection.selected.length === 0) { this.messageDialogService.info("Please select atleast 1 row to proceed."); }
    else
      this.invOrderDetailsTable.selection.selected.forEach((e: any) => {
        if (e.testID !== 0)

          this.physicianOrderList.push({
            acDisHideDrug: e.boolColumn,
            visitid: e.visitId,
            drugid: e.testID,
            acdRemarks: e.acdRemarks
          });
      });
    this.http.post(ApiConstants.modifyphysicianorderdetail('', 9233), this.getModifyModel())
      .pipe(takeUntil(this._destroying$))
      .subscribe((res: any) => {
        if (res.success === true) {
          this.messageDialogService.success(res.message);
          this.invOrderDetails = [];
        }

      })

  }
  clearInv() {
    //clear Form
    this.investigationForm.reset();
    //Clear Grid
    this.invOrderList = [];
    this.invOrderDetails = [];
    //Reset Diasble Btn
    this.isBtnDisable = false;
    let todaydate = new Date();
    this.investigationForm.controls["fromdate"].setValue(todaydate);
    this.investigationForm.controls["fromdate"].disable();
    this.investigationForm.controls["todate"].setValue(todaydate);
    this.investigationForm.controls["todate"].disable();
    this.investigationForm.controls["denyorder"].disable();
    this.investigationForm.controls["maxid"].setValue('maxid');
    this.investigationForm.controls["status"].reset();
  }
}
