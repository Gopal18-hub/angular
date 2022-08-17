import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { HttpService } from "@shared/services/http.service";
import { ApiConstants } from "@core/constants/ApiConstants";
import { BillingApiConstants } from "../../../../BillingApiConstant";
import { CookieService } from "@shared/services/cookie.service";
import { BillingService } from "../../../../billing.service";
import { OrderSetDetailsComponent } from "../../../../prompts/order-set-details/order-set-details.component";
import { MatDialog } from "@angular/material/dialog";
@Component({
  selector: "out-patients-order-set",
  templateUrl: "./order-set.component.html",
  styleUrls: ["./order-set.component.scss"],
})
export class OrderSetComponent implements OnInit {
  formData = {
    title: "",
    type: "object",
    properties: {
      orderSet: {
        type: "autocomplete",
        placeholder: "--Select--",
        required: true,
      },
      items: {
        type: "dropdown",
        placeholder: "--Select--",
        multiple: true,
      },
    },
  };
  formGroup!: FormGroup;
  questions: any;

  @ViewChild("table") tableRows: any;
  data: any = [];
  config: any = {
    clickedRows: false,
    actionItems: false,
    removeRow: true,
    dateformat: "dd/MM/yyyy",
    selectBox: false,
    displayedColumns: [
      "sno",
      "orderSetName",
      "serviceType",
      "serviceItemName",
      "precaution",
      "priority",
      "specialization",
      "doctorName",
      "price",
    ],
    columnsInfo: {
      sno: {
        title: "S.No.",
        type: "number",
        style: {
          width: "80px",
        },
      },
      orderSetName: {
        title: "Order Set Name",
        type: "string_link",
        style: {
          width: "20%",
        },
      },
      serviceType: {
        title: "Service Type",
        type: "string",
      },
      serviceItemName: {
        title: "Service Item Name",
        type: "string",
        style: {
          width: "180px",
        },
      },
      precaution: {
        title: "Precaution",
        type: "string",
      },
      priority: {
        title: "Priority",
        type: "string",
      },
      specialization: {
        title: "Specialization",
        type: "dropdown",
        options: [],
      },
      doctorName: {
        title: "Doctor Name",
        type: "dropdown",
        options: [],
        style: {
          width: "10%",
        },
      },
      price: {
        title: "Price",
        type: "number",
      },
    },
  };

  apiData: any = {};

  constructor(
    private formService: QuestionControlService,
    private http: HttpService,
    private cookie: CookieService,
    public billingService: BillingService,
    public matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.formData.properties,
      {}
    );
    this.formGroup = formResult.form;
    this.questions = formResult.questions;
    this.data = this.billingService.OrderSetItems;
    this.getOrserSetData();
  }

  rowRwmove($event: any) {
    this.billingService.OrderSetItems.splice($event.index, 1);
    this.data = [...this.billingService.OrderSetItems];
    this.billingService.calculateTotalAmount();
  }

  ngAfterViewInit(): void {
    this.tableRows.stringLinkOutput.subscribe((res: any) => {
      console.log(res);
      const itemsFilter = this.apiData.orderSetBreakup.filter((item: any) => {
        return (
          res.element.items.includes(item.testId) &&
          res.element.orderSetId == item.orderSetId
        );
      });
      console.log(itemsFilter);
      this.matDialog.open(OrderSetDetailsComponent, {
        width: "50%",
        height: "50%",
        data: {
          orderSet: res.element,
          items: itemsFilter,
        },
      });
    });
  }

  getOrserSetData() {
    this.http
      .get(
        BillingApiConstants.getOrderSet(
          Number(this.cookie.get("HSPLocationId"))
        )
      )
      .subscribe((res) => {
        this.apiData = res;
        this.questions[0].options = res.orderSetHeader.map((r: any) => {
          return { title: r.orderSetName, value: r.orderSetId };
        });
        this.questions[0] = { ...this.questions[0] };
      });
    this.formGroup.controls["orderSet"].valueChanges.subscribe((val: any) => {
      if (
        val &&
        val.value &&
        this.apiData &&
        "orderSetBreakup" in this.apiData
      ) {
        const filter = this.apiData.orderSetBreakup.filter((item: any) => {
          return item.orderSetId == val.value;
        });
        const selectedItems: any = [];
        this.questions[1].options = filter.map((r: any) => {
          selectedItems.push(r.testId);
          return { title: r.name, value: r.testId };
        });
        this.questions[1].value = selectedItems;
        this.questions[1] = { ...this.questions[1] };
      }
    });
  }
  add(priorityId = 1) {
    const filter: any = this.apiData.orderSetBreakup.filter((item: any) => {
      return item.orderSetId == this.formGroup.value.orderSet.value;
    });

    if (filter[0].serviceid == 25) {
      priorityId = 57;
    }

    this.http
      .get(
        BillingApiConstants.getPrice(
          priorityId,
          this.formGroup.value.orderSet.value,
          filter[0].serviceid,
          this.cookie.get("HSPLocationId")
        )
      )
      .subscribe((res: any) => {
        this.billingService.addToOrderSet({
          sno: this.data.length + 1,
          orderSetName: this.formGroup.value.orderSet.title,
          serviceType: "Investigation",
          serviceItemName: "",
          precaution: "P",
          priority: "Routine",
          specialization: "",
          doctorName: "",
          price: res.amount,
          items: this.formGroup.value.items,
          orderSetId: this.formGroup.value.orderSet.value,
        });

        this.data = [...this.billingService.OrderSetItems];
        this.formGroup.reset();
      });
  }
}
