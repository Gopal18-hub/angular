import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { HttpService } from "@shared/services/http.service";
import { CookieService } from "@shared/services/cookie.service";
import { ApiConstants } from "@core/constants/ApiConstants";
import { Subject, takeUntil } from "rxjs";
import { BillingService } from "../../billing.service";
import { CalculateBillService } from "@core/services/calculate-bill.service";

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

  constructor(
    private formService: QuestionControlService,
    private http: HttpService,
    private cookie: CookieService,
    private billingService: BillingService,
    private calculateBillService: CalculateBillService
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
      if (!this.serviceBasedList[item.serviceId.toString()]) {
        this.serviceBasedList[item.serviceId.toString()] = {
          id: item.serviceId,
          name: item.serviceName,
          items: [],
        };
      }
      this.serviceBasedList[item.serviceId.toString()].items.push(item);
    });
  }

  ngAfterViewInit() {
    this.discAmtForm.controls["head"].valueChanges.subscribe((val) => {
      const filterData = this.discReasonList.filter(
        (rl: any) => rl.mainhead == val
      );
      this.question[2].options = filterData.map((a) => {
        return { title: a.name, value: a.id, discountPer: a.discountPer };
      });
      this.discAmtFormConfig.columnsInfo.reason.options =
        this.question[2].options;
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
    this.calculateBillService.calculateDiscount();
    this.discAmtForm.reset();
  }

  OnCampaignPrepare() {
    let temp = {
      sno: this.selectedItems.length + 1,
      discType: "",
      service: "",
      doctor: "",
      price: "",
      disc: "",
      discAmt: "",
      totalAmt: "",
      head: "",
      reason: "",
      value: "",
    };
  }

  OnCompanyPrepare() {
    let temp = {
      sno: this.selectedItems.length + 1,
      discType: "",
      service: "",
      doctor: "",
      price: "",
      disc: "",
      discAmt: "",
      totalAmt: "",
      head: "",
      reason: "",
      value: "",
    };
  }

  OnItemPrepare() {
    const existReason: any = this.discReasonList.find(
      (rl: any) => rl.id == this.discAmtForm.value.reason
    );
    const selecetdServices: any = Object.values(this.serviceBasedList);
    for (let i = 0; i < selecetdServices.length; i++) {
      for (let j = 0; j < selecetdServices[i].items.length; j++) {
        let item = selecetdServices[i].items[j];
        let price = item.price * item.qty;
        const discAmt = (price * existReason.discountPer) / 100;
        let temp = {
          sno: this.selectedItems.length + 1,
          discType: "On Item",
          service: selecetdServices[i].name,
          doctor: "",
          price: item.price * item.qty,
          disc: existReason.discountPer,
          discAmt: discAmt,
          totalAmt: price - discAmt,
          head: this.discAmtForm.value.head,
          reason: this.discAmtForm.value.reason,
          value: "",
        };
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
    console.log(selecetdServices);
    for (let i = 0; i < selecetdServices.length; i++) {
      let price = 0;
      selecetdServices[i].items.forEach((item: any) => {
        price += item.price * item.qty;
      });
      const discAmt = (price * existReason.discountPer) / 100;
      let temp = {
        sno: this.selectedItems.length + 1,
        discType: "On Service",
        service: selecetdServices[i].name,
        doctor: "",
        price: price,
        disc: existReason.discountPer,
        discAmt: discAmt,
        totalAmt: price - discAmt,
        head: this.discAmtForm.value.head,
        reason: this.discAmtForm.value.reason,
        value: "",
      };
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

  OnBillItemPrepare() {
    const existReason: any = this.discReasonList.find(
      (rl: any) => rl.id == this.discAmtForm.value.reason
    );
    const discAmt =
      (this.billingService.totalCost * existReason.discountPer) / 100;
    let temp = {
      sno: this.selectedItems.length + 1,
      discType: "On Bill",
      service: "",
      doctor: "",
      price: this.billingService.totalCost,
      disc: existReason.discountPer,
      discAmt: discAmt,
      totalAmt: this.billingService.totalCost - discAmt,
      head: this.discAmtForm.value.head,
      reason: this.discAmtForm.value.reason,
      value: "",
    };
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
