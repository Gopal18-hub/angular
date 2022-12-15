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
import { isTemplateMiddle } from "typescript";

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
        type: "currency",
        title: "Dis. Amt",
        defaultValue: "0.00",
        readonly: true,
      },
      authorise: {
        type: "autocomplete",
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
      //"value",
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
        tooltipColumn: "service",
        style: {
          width: "7rem",
        },
      },
      doctor: {
        title: "Item/Doctor Name",
        type: "string",
        tooltipColumn: "doctor",
        style: {
          width: "9rem",
        },
      },
      price: {
        title: "Price",
        type: "currency",
        style: {
          width: "8rem",
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
        type: "currency",
        style: {
          width: "5.5rem",
        },
      },
      totalAmt: {
        title: "Total Amount",
        type: "currency",
        style: {
          width: "8rem",
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
      // value: {
      //   title: "Value Based",
      //   type: "currency",
      //   style: {
      //     width: "8rem",
      //   },
      // },
    },
  };
  discAmtForm!: FormGroup;
  question: any;
  private readonly _destroying$ = new Subject<void>();
  mainHeadList: { id: number; name: number }[] = [] as any;
  authorisedBy: { id: number; name: number }[] = [] as any;
  discReasonList: { id: number; name: string; discountPer: number }[] =
    [] as any;
  discounttypes: any = [];

  serviceBasedList: any = {};

  selectedItems: any = [];

  disableAdd: boolean = false;

  discretionaryDis: boolean = false;

  @ViewChild("table") tableRows: any;

  dualList: any = [];
  reasontitle: any = "";
  head:any=""
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
    this.dualList = [];
    if ("removeRow" in this.data) {
      this.discAmtFormConfig.removeRow = this.data.removeRow;
    }
    this.selectedItems = this.calculateBillService.discountSelectedItems;
    if ("removeRow" in this.data) {
      if (!this.data.removeRow) {
        this.selectedItems.forEach((sItem: any) => {
          sItem.reason_disabled = true;
          sItem.head_disabled = true;
        });
      }
    }

    let formResult: any = this.formService.createForm(
      this.discAmtFormData.properties,
      {}
    );
    this.discAmtForm = formResult.form;
    this.calculateBillService.setDiscountForm(this.discAmtForm);
    this.question = formResult.questions;
    if (
      "disableHeaderControls" in this.data &&
      this.data.disableHeaderControls
    ) {
      this.discAmtForm.controls["types"].disable();
      this.discAmtForm.controls["head"].disable();
      this.discAmtForm.controls["reason"].disable();
      this.discAmtForm.controls["percentage"].disable();
      this.discAmtForm.controls["amt"].disable();
    }
    if ("disabledRowControls" in this.data && this.data.disabledRowControls) {
      // this.discAmtFormConfig.columnsInfo.head.readonly();
      // this.discAmtFormConfig.columnsInfo.reason.readonly();
      this.discAmtForm.controls["authorise"].disable();
      this.discAmtForm.controls["coupon"].disable();
      this.discAmtForm.controls["empCode"].disable();
    }
    if ("formData" in this.data) {
      this.discAmtForm.patchValue(this.data.formData);
    }
    if ("discounttypes" in this.data) {
      this.discounttypes = this.data.discounttypes;
      this.question[0].options = this.discounttypes;
      this.discAmtForm.controls["types"].setValue("On-Bill");
    }
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
      } else {
        this.selectedItems.forEach((sItem: any) => {
          if ([4, 5].includes(sItem.discTypeId)) {
            this.dualList.push(sItem.discTypeId);
          }
        });
        if (this.dualList.length > 0) {
          const tempDual: any = { "On-Patient": 4, "On-Company": 5 };
          this.question[0].options = this.discounttypes.map((a: any) => {
            if (this.dualList.includes(tempDual[a.value])) {
              return {
                title: a.title,
                value: a.value,
                disabled: true,
              };
            } else if ([4, 5].includes(tempDual[a.value])) {
              return {
                title: a.title,
                value: a.value,
                disabled: false,
              };
            } else {
              return {
                title: a.title,
                value: a.value,
                disabled: true,
              };
            }
          });
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
        item.reasonTitle = existReason.name;
        item.reason = existReason.id;
        item.head = existReason.mainhead;
        this.calculateBillService.discountSelectedItems[res.data.index] = item;
      }
    });
    this.discAmtForm.controls["reason"].valueChanges.subscribe((val: any) => {
      if (val) {
        const existReason: any = this.discReasonList.find(
          (rl: any) => rl.id == val
        );
        this.reasontitle = existReason.name;
        console.log(this.reasontitle);
        if (existReason.valuebasedDisc == 1) {
          this.question[4].readonly = false;
        }
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

          dialogref.afterClosed().subscribe((res: any) => {
            this.discAmtForm.controls["empCode"].setValue(res.data);
          });
        }
      } else {
        this.reasontitle = "";
      }
    });
    this.discAmtForm.controls["head"].valueChanges.subscribe((val: any) => {
      if (val) {
        const filterData = this.discReasonList.filter(
          (rl: any) => rl.mainhead == val
        );
        const existHead = this.mainHeadList.filter(
          (rl: any) => rl.id == val
        );
        this.head=existHead[0].name
        this.question[2].options = filterData.map((a) => {
          return { title: a.name, value: a.id, discountPer: a.discountPer };
        });
        this.discAmtFormConfig.columnsInfo.reason.options =
          this.question[2].options;
        this.discAmtFormConfig = { ...this.discAmtFormConfig };
      }
      else{
        this.head=""
      }
    });

    ///GAV-1348- for reopening popup without clearing data
    if (this.discAmtForm.value.amt) {
      this.question[4].elementRef.focus();
      if (this.discAmtForm.value.reason) {
      }
      this.question[4].readonly = false;
    }
  }

  rowRwmove($event: any) {
    const tempDiscountType =
      this.calculateBillService.discountSelectedItems[$event.index].discTypeId;
    this.calculateBillService.discountSelectedItems.splice($event.index, 1);
    if (this.dualList.includes(tempDiscountType)) {
      this.dualList.splice(this.dualList.indexOf(tempDiscountType), 1);
    }
    this.calculateBillService.discountSelectedItems =
      this.calculateBillService.discountSelectedItems.map(
        (item: any, index: number) => {
          item["sno"] = index + 1;
          return item;
        }
      );
    this.selectedItems = [...this.calculateBillService.discountSelectedItems];
    this.calculateBillService.calculateDiscount();
    if (this.selectedItems.length === 0) {
      this.disableAdd = false;
      this.discAmtForm.reset();
      this.dualList = [];
      this.question[0].options = this.discounttypes;
      this.question[4].readonly = true;
      if (!this.discAmtForm.value.types) {
        this.discAmtForm.controls["types"].setValue("On-Bill");
      }
    } else {
      if (this.dualList.length > 0) {
        const tempDual: any = { "On-Patient": 4, "On-Company": 5 };
        this.question[0].options = this.discounttypes.map((a: any) => {
          if (this.dualList.includes(tempDual[a.value])) {
            return {
              title: a.title,
              value: a.value,
              disabled: true,
            };
          } else {
            return {
              title: a.title,
              value: a.value,
              disabled: false,
            };
          }
        });
      }
    }
  }

  prepareData() {
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
      case "On-Patient":
        this.OnPatientPrepare();
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
    if (this.discretionaryDis) {
      this.discAmtForm.patchValue({
        types: null,
        head: null,
        reason: null,
        percentage: null,
        amt: null,
      });
      this.question[4].readonly = true;
    }
  }

  discretionaryCheck(reason: any, price: number) {
    if (this.discAmtForm.value.amt > 0) {
      reason.discountPer =
        (parseFloat(this.discAmtForm.value.amt) / price) * 100;

      //  reason.discountPer = parseFloat(reason.discountPer.toString()).toFixed(4);
    }
    return reason;
  }

  isDiscretionaryDis(price: number): boolean {
    if (
      this.discAmtForm.value.amt &&
      this.discAmtForm.value.amt > 0 &&
      this.discAmtForm.value.amt <= price
    ) {
      return true;
    } else if (
      this.discAmtForm.value.amt &&
      this.discAmtForm.value.amt > 0 &&
      this.discAmtForm.value.amt > price
    ) {
      return false;
    }
    return true;
  }

  OnCampaignPrepare() {
    let existReason: any = this.discReasonList.find(
      (rl: any) => rl.id == this.discAmtForm.value.reason
    );
    const price = this.billingService.totalCostWithOutGst;
    if (this.isDiscretionaryDis(price)) {
      existReason = this.discretionaryCheck(existReason, price);
      const discAmt = (price * existReason.discountPer) / 100;
      let temp = {
        sno: this.selectedItems.length + 1,
        discType: "On Campaign",
        discTypeId: 6,
        service: "",
        doctor: "",
        price: price,
        disc: existReason.discountPer,
        discAmt: discAmt,
        totalAmt: price - discAmt,
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
      this.question[0].options = this.discounttypes.map((a: any) => {
        return { title: a.title, value: a.value, disabled: true };
      });
      this.discAmtForm.controls["amt"].setErrors(null);
      this.question[4].customErrorMessage = "";
      this.discretionaryDis = true;
    } else {
      this.discretionaryDis = false;
      this.discAmtForm.controls["amt"].setErrors({ incorrect: true });
      this.question[4].customErrorMessage = "Invalid amount";
    }
  }
  OnPatientPrepare() {
    let existReason: any = this.discReasonList.find(
      (rl: any) => rl.id == this.discAmtForm.value.reason
    );
    const price = parseFloat(
      this.calculateBillService.billFormGroup.form.value.amtPayByPatient
    );
    if (this.isDiscretionaryDis(price)) {
      existReason = this.discretionaryCheck(existReason, price);
      const discAmt = (price * existReason.discountPer) / 100;
      let temp = {
        sno: this.selectedItems.length + 1,
        discType: "On Patient",
        discTypeId: 4,
        service: "",
        doctor: "",
        price: price,
        disc: existReason.discountPer,
        discAmt: discAmt,
        totalAmt: price - discAmt,
        head: this.discAmtForm.value.head,
        reason: this.discAmtForm.value.reason,
        value: "0",
        discTypeValue: "On-Patient",
        reasonTitle: existReason.name,
      };
      this.discAmtFormConfig.columnsInfo.reason.moreOptions[
        this.dualList.length
      ] = this.discAmtFormConfig.columnsInfo.reason.options;
      this.calculateBillService.discountSelectedItems.push(temp);
      this.dualList.push(4);

      this.selectedItems = [...this.calculateBillService.discountSelectedItems];
      if (this.dualList.includes(5)) {
        this.disableAdd = true;
      }
      this.question[0].options = this.discounttypes.map((a: any) => {
        if (!this.disableAdd && a.value == "On-Company") {
          return { title: a.title, value: a.value, disabled: false };
        } else {
          return { title: a.title, value: a.value, disabled: true };
        }
      });
      this.discAmtForm.controls["amt"].setErrors(null);
      this.question[4].customErrorMessage = "";
      this.discretionaryDis = true;
    } else {
      this.discretionaryDis = false;
      this.discAmtForm.controls["amt"].setErrors({ incorrect: true });
      this.question[4].customErrorMessage = "Invalid amount";
    }
  }

  OnCompanyPrepare() {
    let existReason: any = this.discReasonList.find(
      (rl: any) => rl.id == this.discAmtForm.value.reason
    );
    const price = parseFloat(
      this.calculateBillService.billFormGroup.form.value.amtPayByComp
    );
    if (this.isDiscretionaryDis(price)) {
      existReason = this.discretionaryCheck(existReason, price);
      const discAmt = (price * existReason.discountPer) / 100;
      let temp = {
        sno: this.selectedItems.length + 1,
        discType: "On Company",
        discTypeId: 5,
        service: "",
        doctor: "",
        price: price,
        disc: existReason.discountPer,
        discAmt: discAmt,
        totalAmt: price - discAmt,
        head: this.discAmtForm.value.head,
        reason: this.discAmtForm.value.reason,
        value: "0",
        discTypeValue: "On-Company",
        reasonTitle: existReason.name,
      };
      this.discAmtFormConfig.columnsInfo.reason.moreOptions[
        this.dualList.length
      ] = this.discAmtFormConfig.columnsInfo.reason.options;
      this.calculateBillService.discountSelectedItems.push(temp);
      this.dualList.push(5);

      this.selectedItems = [...this.calculateBillService.discountSelectedItems];
      if (this.dualList.includes(4)) {
        this.disableAdd = true;
      }
      this.question[0].options = this.discounttypes.map((a: any) => {
        if (!this.disableAdd && a.value == "On-Patient") {
          return { title: a.title, value: a.value, disabled: false };
        } else {
          return { title: a.title, value: a.value, disabled: true };
        }
      });
      this.discAmtForm.controls["amt"].setErrors(null);
      this.question[4].customErrorMessage = "";
      this.discretionaryDis = true;
    } else {
      this.discretionaryDis = false;
      this.discAmtForm.controls["amt"].setErrors({ incorrect: true });
      this.question[4].customErrorMessage = "Invalid amount";
    }
  }

  OnItemPrepare() {
    let existReason: any = this.discReasonList.find(
      (rl: any) => rl.id == this.discAmtForm.value.reason
    );
    let discretionaryDis = true;
    const selecetdServices: any = Object.values(this.serviceBasedList);
    let k = 0;
    for (let i = 0; i < selecetdServices.length; i++) {
      for (let j = 0; j < selecetdServices[i].items.length; j++) {
        let item = selecetdServices[i].items[j];
        let quanity = !isNaN(Number(item.qty)) ? item.qty : 1;
        let price = item.price * quanity;
        if (this.isDiscretionaryDis(price)) {
          discretionaryDis = true;
          existReason = this.discretionaryCheck(existReason, price);
          const discAmt = (price * existReason.discountPer) / 100;
          let temp = {
            sno: this.selectedItems.length + 1,
            discType: "On Item",
            discTypeId: 3,
            service: selecetdServices[i].name,
            itemId: item.itemId,
            doctor: item.itemName,
            price: item.price * quanity,
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

          this.selectedItems = [
            ...this.calculateBillService.discountSelectedItems,
          ];
          this.discretionaryDis = true;
        } else {
          discretionaryDis = false;
          this.discretionaryDis = false;
          break;
        }
      }
      if (!discretionaryDis) {
        break;
      }
    }

    this.disableAdd = discretionaryDis ? true : false;
    if (discretionaryDis) {
      this.discretionaryDis = true;
      this.discAmtForm.controls["amt"].setErrors(null);
      this.question[4].customErrorMessage = "";
      this.question[0].options = this.discounttypes.map((a: any) => {
        return { title: a.title, value: a.value, disabled: true };
      });
    } else {
      this.discAmtForm.controls["amt"].setErrors({ incorrect: true });
      this.question[4].customErrorMessage = "Invalid amount";
    }
  }

  OnServiceItemPrepare() {
    let existReason: any = this.discReasonList.find(
      (rl: any) => rl.id == this.discAmtForm.value.reason
    );
    let discretionaryDis = true;
    const selecetdServices: any = Object.values(this.serviceBasedList);
    for (let i = 0; i < selecetdServices.length; i++) {
      let price = 0;
      selecetdServices[i].items.forEach((item: any) => {
        let quanity = !isNaN(Number(item.qty)) ? item.qty : 1;
        price += item.price * quanity;
      });
      if (this.isDiscretionaryDis(price)) {
        discretionaryDis = true;
        existReason = this.discretionaryCheck(existReason, price);
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

        this.selectedItems = [
          ...this.calculateBillService.discountSelectedItems,
        ];
        this.discretionaryDis = true;
      } else {
        discretionaryDis = false;
        this.discretionaryDis = false;
        break;
      }
    }
    this.disableAdd = discretionaryDis ? true : false;
    if (discretionaryDis) {
      this.discAmtForm.controls["amt"].setErrors(null);
      this.question[4].customErrorMessage = "";
      this.question[0].options = this.discounttypes.map((a: any) => {
        return { title: a.title, value: a.value, disabled: true };
      });
    } else {
      this.discAmtForm.controls["amt"].setErrors({ incorrect: true });
      this.question[4].customErrorMessage = "Invalid amount";
    }
  }

  clear() {
    this.disableAdd = false;
    this.dualList = [];
    this.discAmtForm.reset();
    this.calculateBillService.discountSelectedItems = [];
    this.selectedItems = [...this.calculateBillService.discountSelectedItems];
    if (!this.discAmtForm.value.types) {
      this.discAmtForm.controls["types"].setValue("On-Bill");
    }
    this.question[0].options = this.discounttypes.map((a: any) => {
      return { title: a.title, value: a.value, disabled: false };
    });
    this.question[0].options = this.discounttypes;
    this.question[4].readonly = true;
    this.calculateBillService.calculateDiscount();
  }
  applyDiscount() {
    this.calculateBillService.calculateDiscount();
    this.calculateBillService.discountSelectedItems =
      this.tableRows.dataSource.data;
    this.dialogRef.close({ applyDiscount: true });
  }

  OnBillItemPrepare() {
    let existReason: any = this.discReasonList.find(
      (rl: any) => rl.id == this.discAmtForm.value.reason
    );
    const price = this.billingService.totalCostWithOutGst;
    if (this.isDiscretionaryDis(price)) {
      this.discretionaryDis = true;
      existReason = this.discretionaryCheck(existReason, price);
      const discAmt = (price * existReason.discountPer) / 100;
      let temp = {
        sno: this.selectedItems.length + 1,
        discType: "On Bill",
        discTypeId: 1,
        service: "",
        doctor: "",
        price: price,
        disc: existReason.discountPer,
        discAmt: discAmt,
        totalAmt: price - discAmt,
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
      this.discAmtForm.controls["amt"].setErrors(null);
      this.question[4].customErrorMessage = "";
    } else {
      this.discretionaryDis = false;
      this.discAmtForm.controls["amt"].setErrors({ incorrect: true });
      this.question[4].customErrorMessage = "Invalid amount";
    }
  }

  getDiscountReasonHead() {
    this.http
      .get(
        ApiConstants.getbilldiscountreasonmainhead(
          Number(this.cookie.get("HSPLocationId"))
        )
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe((data: any) => {
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
      .subscribe((data: any) => {
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
      .subscribe((data: any) => {
        this.authorisedBy = data;
        this.question[5].options = this.authorisedBy.map((a) => {
          return { title: a.name, value: a.id };
        });
        this.question[5] = { ...this.question[5] };
      });
  }
}
