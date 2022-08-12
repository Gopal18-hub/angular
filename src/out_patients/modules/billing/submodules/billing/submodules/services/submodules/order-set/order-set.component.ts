import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { HttpService } from "@shared/services/http.service";
import { ApiConstants } from "@core/constants/ApiConstants";
import { BillingApiConstants } from "../../../../BillingApiConstant";
import { CookieService } from "@shared/services/cookie.service";
import { BillingService } from "../../../../billing.service";
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
        required: true,
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
    displayedColumns: ["sno", "orderSetName"],
    columnsInfo: {
      sno: {
        title: "S.No.",
        type: "number",
      },
      orderSetName: {
        title: "Order Set Name",
        type: "string",
      },
    },
  };

  constructor(
    private formService: QuestionControlService,
    private http: HttpService,
    private cookie: CookieService,
    private billingService: BillingService
  ) {}

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.formData.properties,
      {}
    );
    this.formGroup = formResult.form;
    this.questions = formResult.questions;
    this.getOrserSetData();
  }

  rowRwmove($event: any) {
    this.billingService.OrderSetItems.splice($event.index, 1);
    this.data = [...this.billingService.OrderSetItems];
  }

  getOrserSetData() {
    this.http.get(BillingApiConstants.getOrderSet).subscribe((res) => {
      this.questions[0].options = res.orderSetBreakup.map((r: any) => {
        return { title: r.name, value: r.orderSetId };
      });
    });
  }
  add(priorityId = 1) {
    this.http
      .get(
        BillingApiConstants.getPrice(
          priorityId,
          this.formGroup.value.healthCheckup.value,
          26,
          this.cookie.get("HSPLocationId")
        )
      )
      .subscribe((res: any) => {
        this.billingService.addToOrderSet({
          sno: this.data.length + 1,
          procedures: this.formGroup.value.otherService.title,
          qty: 1,
          specialisation: "",
          doctorName: "",
          price: res.amount,
        });

        this.data = [...this.billingService.OrderSetItems];
      });
  }
}
