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
        placehokder: "BLKH.",
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
          width: "115px",
        },
      },
      maxid: {
        title: 'Max Id',
        type: 'string',
        style: {
          width: "105px",
        },
      },
      ptnName: {
        title: 'Patient Name',
        type: 'string',
        style: {
          width: "135px",
        },
      },
      docName: {
        title: 'Doctor Name',
        type: 'string',
        style: {
          width: "165px",
        },
      },
      deptName: {
        title: 'Department',
        type: 'string',
        style: {
          width: "135px",
        },
      },
      visitDate: {
        title: 'Visit Date',
        type: 'date',
        style: {
          width: "85px",
        },
      },
      mobileNo: {
        title: 'Mobile No.',
        type: 'string',
        style: {
          width: "105px",
        },
      },
      mrpValue: {
        title: 'Amount',
        type: 'string'
      },
      channel: {
        title: 'Channel',
        type: 'string'
      },
      billNo: {
        title: 'Bill No.',
        type: 'string',
        style: {
          width: "130px",
        },
      },
      orderStatus: {
        title: 'Order Status',
        type: 'string',
        style: {
          width: "125px",
        },
      }

    }

  }
  medDetailsConfig: any = {
    actionItems: false,
    dateformat: 'dd/MM/yyyy hh:mm:ss a',
    // selectBox: true,
    displayedColumns: ['acDisHideDrug', 'drug', 'doctor', 'priority', 'days', 'specialization', 'visitDatetime', 'acdRemarks'],
    columnsInfo: {
      acDisHideDrug: {
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
    public matdialog: MatDialog,) {
  }

  ngOnInit(): void {
    // this.matdialog.open(ScheduleDateDialogComponent, {
    //   height:"30vh",
    //   width: "30vw",
    //   });
    let formResult: any = this.formService.createForm(
      this.investigationFormData.properties,
      {}
    );
    this.investigationForm = formResult.form;
    this.questions = formResult.questions;
    this.investigationForm.controls["fromdate"].disable();
    this.investigationForm.controls["todate"].disable();
    let todaydate = new Date();

    //this.scheduleDate.setValue("");
    this.investigationForm.controls["fromdate"].setValue(todaydate);
    this.investigationForm.controls["todate"].setValue(todaydate);
    this.investigationForm.controls["maxid"].setValue('maxid');
    //this.investigationForm.controls["status"].setValue('Unbilled');
    if (this.from == undefined && this.to == undefined) {
      // this.from = this.datepipe.transform(
      //   new Date().setMonth(new Date().getMonth() - 2),
      //   "yyyy-MM-dd"
      // );
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
    })
    //Filter
    //Filter
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
  search() {
    this.medOrderList = []
    this.medOrderDetails = [];

    if ((this.statusvalue !== "" || this.investigationForm.value.input !== "") && this.medOrderListMain.length !== 0) {
      this.searchFilter();
    }
    else {
      //this.http.get(ApiConstants.geteprescriptdrugorders("2020-12-11", "2020-12-11", 7))
      this.http.get(ApiConstants.geteprescriptdrugorders(this.datepipe.transform(this.investigationForm.controls["fromdate"].value, "yyyy-MM-dd"), this.datepipe.transform(this.investigationForm.controls["todate"].value, "yyyy-MM-dd"), 7))
        .pipe(takeUntil(this._destroying$))
        .subscribe((res: any) => {
          this.medOrderListMain = res.objOrderDetails;
          this.medOrderList = res.objOrderDetails;
        })
    }
  }
  searchFilter() {
    if (!this.statusvalue && !this.investigationForm.value.input && this.medOrderListMain !== undefined) {
      this.medOrderList = this.medOrderListMain;
      console.log(this.medOrderList);
    }
    else if (this.statusvalue === 'All') {
      this.medOrderList = this.medOrderListMain
    }
    else if (this.statusvalue && this.investigationForm.value.input) {
      this.medOrderList = [];
      this.medOrderList = this.medOrderListMain.filter((e: any) => (e[this.idValue] === this.investigationForm.value.input && e.orderStatus === this.statusvalue));
    }
    else if (this.statusvalue) {
      this.medOrderList = [];
      this.medOrderList = this.medOrderListMain.filter((e: any) => (e.orderStatus === this.statusvalue));
    }
    else if (this.idValue && this.investigationForm.value.input) {
      this.medOrderList = [];
      this.medOrderList = this.medOrderListMain.filter((e: any) => (e[this.idValue] === this.investigationForm.value.input));
    }
  }

  listRowClick(event: any) {

    let maxId = event.row.maxid;
    this.patientInfo = event.row.maxid + " / " + event.row.ptnName + " / " + event.row.mobileNo

    //this.http.get(ApiConstants.getphysicianorderdetailep(123123, "SKDD", 7, 0))
    this.http.get(ApiConstants.getphysicianorderdetailep(maxId.toString().split(".")[1], maxId.toString().split(".")[0], 7, event.row.orderId))
      .pipe(takeUntil(this._destroying$))
      .subscribe((res: any) => {
        this.objPhyOrder = [];
        this.medOrderDetails = res;
        this.medOrderDetails.forEach((e: any, index: number) => {
          if (e.acDisHideDrug === true) {
            e[index].acDisHideDrug = 1;
          }
          if (e.acDisHideDrug === false) {
            e[index].acDisHideDrug = 0;
          }

        })

      })

  }
  denyBtn() {
    this.isBtnDisable = true;
    this.investigationForm.controls["denyorder"].enable();
  }
  //Generate Pharamacy Token
  generateToken() {
    if (this.tokenNo != null) {
      this.messageDialogService.info("Token already generated");
    }

    this.http.get(ApiConstants.GetPrintQueDetail(window.location.hostname))
      .pipe(takeUntil(this._destroying$))
      .subscribe((res: any) => {
        this.tokenNo = res[0].waitnno;


      })
  }
  saveOrUpdate() {
    this.objPhyOrder = [];
    this.objdtdenialorder = "";
    console.log(this.medOrderDetailsTable.selection.selected, "rows")
    //this.physicianOrderList = [];
    if (this.medOrderDetailsTable.selection.selected.length === 0) {
      this.messageDialogService.info("Please select atleast 1 row to proceed.");
    }
    else {
      this.medOrderDetailsTable.selection.selected.forEach((e: any) => {
        //if (e.drugid !== 0)
        this.objPhyOrder.push({
          acDisHideDrug: true,
          visitid: e.visitId,
          drugid: e.drugid,
          acdRemarks: e.acdRemarks
        });
      });
      if (this.investigationForm.value.denyorder && !this.investigationForm.value.remarks) {
        this.messageDialogService.info("Please enter denial reason remark for order!")
      }
      else if (!this.investigationForm.value.denyorder) {
        this.messageDialogService.info("Please select denial reason for open order before close!")
      }
      if (this.investigationForm.value.remarks && this.investigationForm.value.denyorder && this.medOrderDetailsTable.selection.selected[0].visitId) {
        this.objdtdenialorder = {
          denialid: this.investigationForm.value.denyorder,
          denialremark: this.investigationForm.value.remarks,
          visitid: this.medOrderDetailsTable.selection.selected[0].visitId,
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
  getModifyModel(): ModifyInvestigationOrderModel {
    return new ModifyInvestigationOrderModel(
      this.physicianOrderList
    )
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
  Save() {

    this.http.post(ApiConstants.SaveAndUpdateDiagnosticOrderBill, this.getSaveModel())
      .pipe(takeUntil(this._destroying$))
      .subscribe((res: any) => {
        if (res === 1) {
          this.messageDialogService.success("Saved Successfully!");
          this.medOrderDetails = []
        }
        this.objPhyOrder = [];
        this.objdtdenialorder = [];
        this.isBtnDisable = false;
        this.investigationForm.controls["denyorder"].reset();
        this.investigationForm.controls["remarks"].setValue("");
        this.investigationForm.controls["denyorder"].disable();
      })

  }
  cancelDenial() {
    this.physicianOrderList = [];
    if (this.medOrderDetailsTable.selection.selected.length === 0) { this.messageDialogService.info("Please select atleast 1 row to proceed."); }
    else
      this.medOrderDetailsTable.selection.selected.forEach((e: any) => {
        if (e.drugid !== 0)

          this.physicianOrderList.push({
            acDisHideDrug: e.acDisHideDrug,
            visitid: e.visitId,
            drugid: e.drugid,
            acdRemarks: e.acdRemarks
          });
      });
    this.http.post(ApiConstants.modifyphysicianorderdetail(this.tokenNo, 9233), this.getModifyModel())
      .pipe(takeUntil(this._destroying$))
      .subscribe((res: any) => {
        if (res.success === true) {
          this.messageDialogService.success(res.message);
          this.medOrderDetails = [];
        }

      })
  }
  clearMed() {
    //clear Form
    this.investigationForm.reset();
    //Clear Grid
    this.medOrderList = [];
    this.medOrderDetails = [];
    //Reset Diasble Btn
    this.isBtnDisable = false;
    let todaydate = new Date();
    this.investigationForm.controls["fromdate"].setValue(todaydate);
    this.investigationForm.controls["todate"].setValue(todaydate);
    this.investigationForm.controls["fromdate"].disable();
    this.investigationForm.controls["todate"].disable();
    this.investigationForm.controls["denyorder"].disable();
    this.investigationForm.controls["maxid"].setValue('maxid');
    this.investigationForm.controls["status"].reset();
  }

}


