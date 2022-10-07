import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { HttpService } from "@shared/services/http.service";
import { CookieService } from "@shared/services/cookie.service";
import { ApiConstants } from "@core/constants/ApiConstants";
import { Subject, takeUntil } from "rxjs";
import { BillingService } from "../../billing.service";
import { CalculateBillService } from "@core/services/calculate-bill.service";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { StaffDeptDialogComponent } from "@modules/billing/submodules/miscellaneous-billing/billing/staff-dept-dialog/staff-dept-dialog.component";

@Component({
  selector: "out-patients-disount-reason",
  templateUrl: "./disount-reason.component.html",
  styleUrls: ["./disount-reason.component.scss"],
})
export class DisountReasonComponent implements OnInit {
  discAmtFormData = {
    title: "",
    type: "object",
    properties: {
      types: {
        type: "dropdown",
        title: "Discount Types",
        options: [
          { title: "On Bill", value: "On-Bill" },
          { title: "On Service", value: "On-Service" },
          { title: "On Item", value: "On-Item" },
          { title: "On Patient", value: "On-Patient" },
          { title: "On Company", value: "On-Company" },
          { title: "On Campaign", value: "On-Campaign" },
        ],
        placeholder: "-Select-",
      },
      head: {
        type: "dropdown",
        title: "Main Head Discount",
        placeholder: "-Select-",
      },
      reason: {
        type: "dropdown",
        title: "Discount reason",
        placeholder: "-Select-",
      },
      percentage: {
        type: "string",
        title: "Dis%",
        defaultValue: "0.00",
        readonly: true,
      },
      amt: {
        type: "string",
        title: "Dis. Amt",
        defaultValue: "0.00",
        readonly: true,
      },
      authorise: {
        type: "dropdown",
        placeholder: "-Select-",
        required: true,
      },
      coupon: {
        type: "string",
      },
      empCode: {
        type: "string",
      },
    },
  };
  discAmtFormConfig: any = {
    actionItems: false,
    //dateformat: 'dd/MM/yyyy',
    selectBox: false,
    displayedColumns: [
      "sno",
      "discType",
      "service",
      "doctor",
      "price",
      "disc",
      "discAmt",
      "totalAmt",
      "head",
      "reason",
      "value",
    ],
    clickedRows: false,
    clickSelection: "single",
    removeRow: true,
    columnsInfo: {
      sno: {
        title: "S.No",
        type: "string",
        style: {
          width: "5rem",
        },
      },
      discType: {
        title: "Discount Type",
        type: "string",
        style: {
          width: "7rem",
        },
      },
      service: {
        title: "Service Name",
        type: "string",
        style: {
          width: "7rem",
        },
      },
      doctor: {
        title: "Item/Doctor Name",
        type: "string",
        style: {
          width: "9rem",
        },
      },
      price: {
        title: "Price",
        type: "string",
        style: {
          width: "4rem",
        },
      },
      disc: {
        title: "Disc%",
        type: "string",
        style: {
          width: "4rem",
        },
      },
      discAmt: {
        title: "Dis. Amount",
        type: "string",
        style: {
          width: "6rem",
        },
      },
      totalAmt: {
        title: "Total Amount",
        type: "string",
        style: {
          width: "7rem",
        },
      },
      head: {
        title: "Main Head Discount",
        type: "dropdown",
        style: {
          width: "10rem",
        },
      },
      reason: {
        title: "Discount Reason",
        type: "dropdown",
        style: {
          width: "8rem",
        },
        moreOptions: {},
      },
      value: {
        title: "Value Based",
        type: "string",
        style: {
          width: "8rem",
        },
      },
    },
  };
  discAmtForm!: FormGroup;
  question: any;
  private readonly _destroying$ = new Subject<void>();
  mainHeadList: { id: number; name: number }[] = [] as any;
  authorisedBy: { id: number; name: number }[] = [] as any;
  discReasonList: { id: number; name: string; discountPer: number }[] =
    [] as any;

  serviceBasedList: any = {};

  selectedItems: any = [];

  disableAdd: boolean = false;

  @ViewChild("table") tableRows: any;
  constructor(
    private formService: QuestionControlService,
    private http: HttpService,
    private cookie: CookieService,
    private billingService: BillingService,
    private calculateBillService: CalculateBillService,
    public dialogRef: MatDialogRef<DisountReasonComponent>,
    public matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.selectedItems = this.calculateBillService.discountSelectedItems;

    let formResult: any = this.formService.createForm(
      this.discAmtFormData.properties,
      {}
    );
    this.discAmtForm = formResult.form;
    this.question = formResult.questions;
    this.getDiscountReasonHead();
    this.getBillDiscountReason();
    this.getAuthorisedBy();
    this.billingService.billItems.forEach((item: any) => {
      if (!this.serviceBasedList[item.serviceName.toString()]) {
        this.serviceBasedList[item.serviceName.toString()] = {
          id: item.serviceId,
          name: item.serviceName,
          items: [],
        };
      }
      this.serviceBasedList[item.serviceName.toString()].items.push(item);
    });
    if (this.selectedItems.length > 0) {
      const tempItem = this.selectedItems[0];
      if (tempItem.discTypeValue == "On-Bill") {
        this.disableAdd = true;
      } else if (tempItem.discTypeValue == "On-Service") {
        if (
          this.selectedItems.length ==
          Object.values(this.serviceBasedList).length
        ) {
          this.disableAdd = true;
        }
      } else if (tempItem.discTypeValue == "On-Item") {
        let totalItems = 0;
        Object.values(this.serviceBasedList).forEach((service: any) => {
          totalItems += service.items.length;
        });
        if (this.selectedItems.length == totalItems) {
          this.disableAdd = true;
        }
      }
    }
  }

  ngAfterViewInit() {
    this.tableRows.controlValueChangeTrigger.subscribe(async (res: any) => {
      if (res.data.col == "head") {
        const filterData = this.discReasonList.filter(
          (rl: any) => rl.mainhead == res.$event.value
        );
        let options = filterData.map((a) => {
          return { title: a.name, value: a.id, discountPer: a.discountPer };
        });
        this.discAmtFormConfig.columnsInfo.reason.moreOptions[res.data.index] =
          options;
      } else if (res.data.col == "reason") {
        const existReason: any = this.discReasonList.find(
          (rl: any) => rl.id == res.$event.value
        );
        let item =
          this.calculateBillService.discountSelectedItems[res.data.index];
        const price = item.price;
        const discAmt = (price * existReason.discountPer) / 100;
        item.disc = existReason.discountPer;
        item.discAmt = discAmt;
        item.totalAmt = price - discAmt;
        this.calculateBillService.discountSelectedItems[res.data.index] = item;
      }
    });
    this.discAmtForm.controls["reason"].valueChanges.subscribe((val) => {
      if (val) {
        const existReason: any = this.discReasonList.find(
          (rl: any) => rl.id == val
        );
        this.discAmtForm.controls["percentage"].setValue(
          existReason.discountPer
        );
        const mainHead: any = this.mainHeadList.find(
          (rl: any) => rl.id == existReason.mainhead
        );
        if (
          mainHead.name.includes("Staff Discount") &&
          existReason.empflag === 1
        ) {
          const dialogref = this.matDialog.open(StaffDeptDialogComponent, {
            width: "55vw",
            height: "80vh",
          });

          dialogref.afterClosed().subscribe((res) => {
            this.discAmtForm.controls["empCode"].setValue(res.data);
            //   this.dialogRef.close({ data: this.selectedAuthorise });
          });
        }
      }
    });
    this.discAmtForm.controls["head"].valueChanges.subscribe((val) => {
      if (val) {
        const filterData = this.discReasonList.filter(
          (rl: any) => rl.mainhead == val
        );
        this.question[2].options = filterData.map((a) => {
          return { title: a.name, value: a.id, discountPer: a.discountPer };
        });
        this.discAmtFormConfig.columnsInfo.reason.options =
          this.question[2].options;
        this.discAmtFormConfig = { ...this.discAmtFormConfig };
      }
    });
  }

  rowRwmove($event: any) {
    this.calculateBillService.discountSelectedItems.splice($event.index, 1);
    this.calculateBillService.discountSelectedItems =
      this.calculateBillService.discountSelectedItems.map(
        (item: any, index: number) => {
          item["sno"] = index + 1;
          return item;
        }
      );
    this.selectedItems = [...this.calculateBillService.discountSelectedItems];
    this.calculateBillService.calculateDiscount();
  }

  prepareData() {
    console.log(this.discAmtForm.value);
    switch (this.discAmtForm.value.types) {
      case "On-Bill":
        this.OnBillItemPrepare();
        break;
      case "On-Service":
        this.OnServiceItemPrepare();
        break;
      case "On-Item":
        this.OnItemPrepare();
        break;
      case "On-Company":
        this.OnCompanyPrepare();
        break;
      case "On-Campaign":
        this.OnCampaignPrepare();
        break;
      default:
        console.log("default");
    }
    this.discAmtForm.reset();
  }

  OnCampaignPrepare() {
    const existReason: any = this.discReasonList.find(
      (rl: any) => rl.id == this.discAmtForm.value.reason
    );
    const discAmt =
      (this.billingService.totalCost * existReason.discountPer) / 100;
    let temp = {
      sno: this.selectedItems.length + 1,
      discType: "On Campaign",
      discTypeId: 6,
      service: "",
      doctor: "",
      price: this.billingService.totalCost,
      disc: existReason.discountPer,
      discAmt: discAmt,
      totalAmt: this.billingService.totalCost - discAmt,
      head: this.discAmtForm.value.head,
      reason: this.discAmtForm.value.reason,
      value: "0",
      discTypeValue: "On-Campaign",
      reasonTitle: existReason.name,
    };
    this.discAmtFormConfig.columnsInfo.reason.moreOptions[0] =
      this.discAmtFormConfig.columnsInfo.reason.options;
    this.calculateBillService.discountSelectedItems.push(temp);

    this.selectedItems = [...this.calculateBillService.discountSelectedItems];
    this.disableAdd = true;
  }
  OnPatientPrepare() {
    const existReason: any = this.discReasonList.find(
      (rl: any) => rl.id == this.discAmtForm.value.reason
    );
    const discAmt =
      (this.billingService.totalCost * existReason.discountPer) / 100;
    let temp = {
      sno: this.selectedItems.length + 1,
      discType: "On Patient",
      discTypeId: 4,
      service: "",
      doctor: "",
      price: this.billingService.totalCost,
      disc: existReason.discountPer,
      discAmt: discAmt,
      totalAmt: this.billingService.totalCost - discAmt,
      head: this.discAmtForm.value.head,
      reason: this.discAmtForm.value.reason,
      value: "0",
      discTypeValue: "On-Patient",
      reasonTitle: existReason.name,
    };
    this.discAmtFormConfig.columnsInfo.reason.moreOptions[0] =
      this.discAmtFormConfig.columnsInfo.reason.options;
    this.calculateBillService.discountSelectedItems.push(temp);

    this.selectedItems = [...this.calculateBillService.discountSelectedItems];
    this.disableAdd = true;
  }

  OnCompanyPrepare() {
     const existReason: any = this.discReasonList.find(
      (rl: any) => rl.id == this.discAmtForm.value.reason
    );
    const discAmt =
      (this.billingService.totalCost * existReason.discountPer) / 100;
    let temp = {
      sno: this.selectedItems.length + 1,
      discType: "On Company",
      discTypeId: 5,
      service: "",
      doctor: "",
      price: this.billingService.totalCost,
      disc: existReason.discountPer,
      discAmt: discAmt,
      totalAmt: this.billingService.totalCost - discAmt,
      head: this.discAmtForm.value.head,
      reason: this.discAmtForm.value.reason,
      value: "0",
      discTypeValue: "On-Company",
      reasonTitle: existReason.name,
    };
    this.discAmtFormConfig.columnsInfo.reason.moreOptions[0] =
      this.discAmtFormConfig.columnsInfo.reason.options;
    this.calculateBillService.discountSelectedItems.push(temp);

    this.selectedItems = [...this.calculateBillService.discountSelectedItems];
    this.disableAdd = true;
  }

  OnItemPrepare() {
    const existReason: any = this.discReasonList.find(
      (rl: any) => rl.id == this.discAmtForm.value.reason
    );
    const selecetdServices: any = Object.values(this.serviceBasedList);
    let k = 0;
    for (let i = 0; i < selecetdServices.length; i++) {
      for (let j = 0; j < selecetdServices[i].items.length; j++) {
        let item = selecetdServices[i].items[j];
        let price = item.price * item.qty;
        const discAmt = (price * existReason.discountPer) / 100;
        let temp = {
          sno: this.selectedItems.length + 1,
          discType: "On Item",
          discTypeId: 3,
          service: selecetdServices[i].name,
          itemId: item.itemId,
          doctor: item.itemName,
          price: item.price * item.qty,
          disc: existReason.discountPer,
          discAmt: discAmt,
          totalAmt: price - discAmt,
          head: this.discAmtForm.value.head,
          reason: this.discAmtForm.value.reason,
          value: "0",
          discTypeValue: "On-Item",
          reasonTitle: existReason.name,
        };
        this.discAmtFormConfig.columnsInfo.reason.moreOptions[k] =
          this.discAmtFormConfig.columnsInfo.reason.options;
        k++;

        this.calculateBillService.discountSelectedItems.push(temp);
      }
    }

    this.selectedItems = [...this.calculateBillService.discountSelectedItems];
    this.disableAdd = true;
  }

  OnServiceItemPrepare() {
    const existReason: any = this.discReasonList.find(
      (rl: any) => rl.id == this.discAmtForm.value.reason
    );
    const selecetdServices: any = Object.values(this.serviceBasedList);
    for (let i = 0; i < selecetdServices.length; i++) {
      let price = 0;
      selecetdServices[i].items.forEach((item: any) => {
        price += item.price * item.qty;
      });
      const discAmt = (price * existReason.discountPer) / 100;
      let temp = {
        sno: this.selectedItems.length + 1,
        discType: "On Service",
        discTypeId: 2,
        service: selecetdServices[i].name,
        doctor: "",
        price: price,
        disc: existReason.discountPer,
        discAmt: discAmt,
        totalAmt: price - discAmt,
        head: this.discAmtForm.value.head,
        reason: this.discAmtForm.value.reason,
        value: "0",
        discTypeValue: "On-Service",
        reasonTitle: existReason.name,
      };
      this.discAmtFormConfig.columnsInfo.reason.moreOptions[i] =
        this.discAmtFormConfig.columnsInfo.reason.options;
      this.calculateBillService.discountSelectedItems.push(temp);
    }
    this.selectedItems = [...this.calculateBillService.discountSelectedItems];
    this.disableAdd = true;
  }

  clear() {
    this.disableAdd = false;
    this.calculateBillService.discountSelectedItems = [];
    this.selectedItems = [...this.calculateBillService.discountSelectedItems];
  }
  applyDiscount() {
    this.calculateBillService.calculateDiscount();
    this.calculateBillService.discountSelectedItems =
      this.tableRows.dataSource.data;
    this.dialogRef.close({ applyDiscount: true });
  }

  OnBillItemPrepare() {
    const existReason: any = this.discReasonList.find(
      (rl: any) => rl.id == this.discAmtForm.value.reason
    );
    const discAmt =
      (this.billingService.totalCost * existReason.discountPer) / 100;
    let temp = {
      sno: this.selectedItems.length + 1,
      discType: "On Bill",
      discTypeId: 1,
      service: "",
      doctor: "",
      price: this.billingService.totalCost,
      disc: existReason.discountPer,
      discAmt: discAmt,
      totalAmt: this.billingService.totalCost - discAmt,
      head: this.discAmtForm.value.head,
      reason: this.discAmtForm.value.reason,
      value: "0",
      discTypeValue: "On-Bill",
      reasonTitle: existReason.name,
    };
    this.discAmtFormConfig.columnsInfo.reason.moreOptions[0] =
      this.discAmtFormConfig.columnsInfo.reason.options;
    this.calculateBillService.discountSelectedItems.push(temp);

    this.selectedItems = [...this.calculateBillService.discountSelectedItems];
    this.disableAdd = true;
  }

  getDiscountReasonHead() {
    this.http
      .get(
        ApiConstants.getbilldiscountreasonmainhead(
          Number(this.cookie.get("HSPLocationId"))
        )
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe((data) => {
        this.mainHeadList = data;
        this.question[1].options = this.mainHeadList.map((a) => {
          return { title: a.name, value: a.id };
        });
        this.discAmtFormConfig.columnsInfo.head.options =
          this.question[1].options;
      });
  }

  getBillDiscountReason() {
    this.http
      .get(
        ApiConstants.getbilldiscountreason(
          Number(this.cookie.get("HSPLocationId"))
        )
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe((data) => {
        this.discReasonList = data;
        this.question[2].options = this.discReasonList.map((a) => {
          return { title: a.name, value: a.id, discountPer: a.discountPer };
        });
        this.discAmtFormConfig.columnsInfo.reason.options =
          this.question[2].options;
        if (this.selectedItems.length > 0) {
          this.selectedItems.forEach((item: any, index: number) => {
            const filterData = this.discReasonList.filter(
              (rl: any) => rl.mainhead == item.head
            );
            let options = filterData.map((a) => {
              return {
                title: a.name,
                value: a.id,
                discountPer: a.discountPer,
              };
            });
            this.discAmtFormConfig.columnsInfo.reason.moreOptions[index] =
              options;
          });
        }
      });
  }

  getAuthorisedBy() {
    this.http
      .get(
        ApiConstants.getauthorisedby(Number(this.cookie.get("HSPLocationId")))
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe((data) => {
        this.authorisedBy = data;
        this.question[5].options = this.authorisedBy.map((a) => {
          return { title: a.name, value: a.id };
        });
      });
  }
}
