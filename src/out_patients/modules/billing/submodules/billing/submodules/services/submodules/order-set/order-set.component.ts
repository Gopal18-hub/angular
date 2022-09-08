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
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";
import { ActivatedRoute, Router } from "@angular/router";

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
        style: {
          width: "120px",
        },
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
        style: {
          width: "100px",
        },
      },
      priority: {
        title: "Priority",
        type: "string",
        style: {
          width: "100px",
        },
      },
      specialization: {
        title: "Specialization",
        type: "dropdown",
        options: [],
        style: {
          width: "17%",
        },
      },
      doctorName: {
        title: "Doctor Name",
        type: "dropdown",
        options: [],
        style: {
          width: "17%",
        },
        moreOptions: {},
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
    public matDialog: MatDialog,
    public messageDialogService: MessageDialogService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.formData.properties,
      {}
    );
    this.formGroup = formResult.form;
    this.questions = formResult.questions;
    this.data = this.billingService.OrderSetItems;
    this.getSpecialization();
    this.getOrserSetData();
    this.billingService.clearAllItems.subscribe((clearItems) => {
      if (clearItems) {
        this.data = [];
      }
    });
  }

  rowRwmove($event: any) {
    console.log($event.index);
    this.billingService.OrderSetItems.splice($event.index, 1);
    this.billingService.OrderSetItems = this.billingService.OrderSetItems.map(
      (item: any, index: number) => {
        item["sno"] = index + 1;
        return item;
      }
    );
    this.data = [...this.billingService.OrderSetItems];
    this.billingService.calculateTotalAmount();
  }

  ngAfterViewInit(): void {
    this.tableRows.controlValueChangeTrigger.subscribe((res: any) => {
      if (res.data.col == "specialization") {
        this.getdoctorlistonSpecializationClinic(
          res.$event.value,
          res.data.index
        );
      }
    });
    this.tableRows.stringLinkOutput.subscribe((res: any) => {
      this.matDialog.open(OrderSetDetailsComponent, {
        width: "50%",
        //height: "50%",
        data: {
          orderSet: res.element,
          items: res.element.apiItems,
          gridData: this.data,
        },
      });
    });
  }

  getSpecialization() {
    this.http.get(BillingApiConstants.getspecialization).subscribe((res) => {
      this.config.columnsInfo.specialization.options = res.map((r: any) => {
        return { title: r.name, value: r.id };
      });
    });
  }

  getdoctorlistonSpecializationClinic(
    clinicSpecializationId: number,
    index: number
  ) {
    this.http
      .get(
        BillingApiConstants.getdoctorlistonSpecializationClinic(
          false,
          clinicSpecializationId,
          Number(this.cookie.get("HSPLocationId"))
        )
      )
      .subscribe((res) => {
        let options = res.map((r: any) => {
          return { title: r.doctorName, value: r.doctorId };
        });
        this.config.columnsInfo.doctorName.moreOptions[index] = options;
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
    let exist = this.billingService.OrderSetItems.findIndex((item: any) => {
      return this.formGroup.value.items.includes(item.itemid);
    });
    if (exist > -1) {
      this.messageDialogService.error(
        "Order Set already added to the service list"
      );
      return;
    }

    let subItems: any = [];

    this.formGroup.value.items.forEach((subItem: any) => {
      const exist = this.apiData.orderSetBreakup.findIndex((set: any) => {
        return set.testId == subItem;
      });
      if (exist > -1) {
        const temp = this.apiData.orderSetBreakup[exist];
        subItems.push({
          serviceID: temp.serviceid,
          itemId: temp.testId,
          bundleId: 0,
          priority: temp.serviceid == 25 ? 57 : 1,
        });
      }
    });

    const orderSetItems: any = this.apiData.orderSetBreakup.filter(
      (item: any) => {
        return item.orderSetId == this.formGroup.value.orderSet.value;
      }
    );

    // if (filter[0].serviceid == 25) {
    //   priorityId = 57;
    // }

    this.http
      .post(
        BillingApiConstants.getPriceBulk(this.cookie.get("HSPLocationId")),
        subItems
      )
      .subscribe((res: any) => {
        const existDataCount = this.data.length;
        res.forEach((resItem: any, index: number) => {
          const data1 = {
            sno: existDataCount + index + 1,
            orderSetName: this.formGroup.value.orderSet.title,
            serviceType: "Investigation",
            serviceItemName: resItem.procedureName,
            precaution: "P",
            priority: "Routine",
            specialization: "",
            doctorName: "",
            specialization_required: true,
            doctorName_required: true,
            price: resItem.returnOutPut,
            items: this.formGroup.value.items,
            orderSetId: this.formGroup.value.orderSet.value,
            itemid: this.formGroup.value.items[index],
            apiItems: orderSetItems,
            billItem: {
              itemId: subItems[index].itemId,
              priority: subItems[index].priority,
              serviceId: subItems[index].serviceID,
              price: resItem.returnOutPut,
              serviceName: this.formGroup.value.orderSet.title,
              itemName: resItem.procedureNames,
              qty: 1,
              precaution: "n/a",
              procedureDoctor: "n/a",
              credit: 0,
              cash: 0,
              disc: 0,
              discAmount: 0,
              totalAmount: resItem.returnOutPut,
              gst: 0,
              gstValue: 0,
            },
          };
          this.billingService.addToOrderSet(data1);
        });

        this.data = [...this.billingService.OrderSetItems];
        this.formGroup.reset();
      });
  }

  goToBill() {
    this.router.navigate(["../bill"], {
      queryParamsHandling: "merge",
      relativeTo: this.route,
    });
  }
}
