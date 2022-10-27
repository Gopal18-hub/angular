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
import { SpecializationService } from "../../../../specialization.service";

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
        title: "Specialisation",
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
        type: "currency",
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
    private route: ActivatedRoute,
    private specializationService: SpecializationService
  ) {}

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.formData.properties,
      {}
    );
    this.formGroup = formResult.form;
    this.questions = formResult.questions;
    this.billingService.OrderSetItems.forEach((item: any, index: number) => {
      this.config.columnsInfo.doctorName.moreOptions[index] =
        this.getdoctorlistonSpecializationClinic(item.specialisation, index);
    });
    this.data = this.billingService.OrderSetItems;
    this.getSpecialization();
    this.getOrserSetData();
    this.billingService.clearAllItems.subscribe((clearItems:any) => {
      if (clearItems) {
        this.data = [];
      }
    });
  }

  rowRwmove($event: any) {
    this.billingService.removeFromBill(
      this.billingService.OrderSetItems[$event.index]
    );
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
      if (res.data.col == "specialisation") {
        res.data.element["doctorName"] = "";
        this.getdoctorlistonSpecializationClinic(
          res.$event.value,
          res.data.index
        );
        this.billingService.OrderSetItems[
          res.data.index
        ].billItem.specialisationID = res.$event.value;
      } else if (res.data.col == "doctorName") {
        this.billingService.OrderSetItems[res.data.index].billItem.doctorID =
          res.$event.value;
        const findDoctor = this.config.columnsInfo.doctorName.moreOptions[
          res.data.index
        ].find((doc: any) => doc.value == res.$event.value);
        this.billingService.OrderSetItems[
          res.data.index
        ].billItem.procedureDoctor = findDoctor.title;
      }
      this.checkTableValidation();
    });
    this.tableRows.stringLinkOutput.subscribe((res: any) => {
      this.matDialog.open(OrderSetDetailsComponent, {
        width: "70vw",
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
    this.config.columnsInfo.specialization.options =
      this.specializationService.specializationData;
  }

  async getdoctorlistonSpecializationClinic(
    clinicSpecializationId: number,
    index: number
  ) {
    this.config.columnsInfo.doctorName.moreOptions[index] =
      await this.specializationService.getdoctorlistonSpecialization(
        clinicSpecializationId
      );
  }

  checkTableValidation() {
    if (this.tableRows.tableForm.valid) {
      this.billingService.changeBillTabStatus(false);
    } else {
      this.billingService.changeBillTabStatus(true);
    }
  }

  getOrserSetData() {
    this.http
      .get(
        BillingApiConstants.getOrderSet(
          Number(this.cookie.get("HSPLocationId"))
        )
      )
      .subscribe((res:any) => {
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
    let selectedSubItems: any = [];

    this.formGroup.value.items.forEach((subItem: any) => {
      const exist = this.apiData.orderSetBreakup.findIndex((set: any) => {
        return set.testId == subItem;
      });
      if (exist > -1) {
        const temp = this.apiData.orderSetBreakup[exist];
        selectedSubItems.push(temp);
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
            serviceType: selectedSubItems[index].serviceType,
            serviceItemName: resItem.procedureName,
            precaution: "P",
            priority: "Routine",
            specialization: "",
            doctorName: "",
            specialization_required: true,
            doctorName_required: true,
            price: resItem.returnOutPut + resItem.totaltaX_Value,
            items: this.formGroup.value.items,
            orderSetId: this.formGroup.value.orderSet.value,
            itemid: this.formGroup.value.items[index],
            apiItems: orderSetItems,
            billItem: {
              itemId: subItems[index].itemId,
              priority: subItems[index].priority,
              serviceId: subItems[index].serviceID,
              price: resItem.returnOutPut,
              serviceName: selectedSubItems[index].serviceType,
              itemName: resItem.procedureName,
              qty: 1,
              precaution: "P",
              procedureDoctor: "",
              credit: 0,
              cash: 0,
              disc: 0,
              discAmount: 0,
              totalAmount: resItem.returnOutPut + resItem.totaltaX_Value,
              gst: resItem.totaltaX_RATE,
              gstValue: resItem.totaltaX_Value,
              specialisationID: 0,
              doctorID: 0,
            },
            gstDetail:{
          gsT_value:resItem.totaltaX_Value,
          gsT_percent:resItem.totaltaX_RATE,
          cgsT_Value:resItem.cgsT_Value,
          cgsT_Percent:resItem.cgst,
          sgsT_value:resItem.sgsT_Value,
          sgsT_percent:resItem.sgst,
          utgsT_value:resItem.utgsT_Value,
          utgsT_percent:resItem.utgst,
          igsT_Value:resItem.igsT_Value,
          igsT_percent:resItem.igst,
          cesS_value:resItem.cesS_Value,
          cesS_percent:resItem.cess,
          taxratE1_Value:resItem.taxratE1_Value,
          taxratE1_Percent:resItem.taxratE1,
          taxratE2_Value:resItem.taxratE2_Value,
          taxratE2_Percent:resItem.taxratE2,
          taxratE3_Value:resItem.taxratE3_Value,
          taxratE3_Percent:resItem.taxratE3,
          taxratE4_Value:resItem.taxratE4_Value,
          taxratE4_Percent:resItem.taxratE4,
          taxratE5_Value:resItem.taxratE5_Value,
          taxratE5_Percent:resItem.taxratE5,
          totaltaX_RATE:resItem.totaltaX_RATE,
          totaltaX_RATE_VALUE:resItem.totaltaX_Value,
          saccode:resItem.saccode,
          taxgrpid:resItem.taxgrpid,
        },
         gstCode:{
              tax:resItem.tax,
              taxType:resItem.taxType,
              codeId:resItem.codeId,
              code:resItem.code,
            }
          };
          this.billingService.addToOrderSet(data1);
          this.billingService.makeBillPayload.tab_o_opItemBasePrice.push({
            itemID: subItems[index].itemId,
            serviceID: subItems[index].serviceID,
            price: resItem.returnOutPut + resItem.totaltaX_Value,
            willModify: resItem.ret_value == 1 ? true : false,
          });
        });

        this.data = [...this.billingService.OrderSetItems];
        this.formGroup.reset();
        this.checkTableValidation();
      });
  }

  goToBill() {
    this.router.navigate(["../bill"], {
      queryParamsHandling: "merge",
      relativeTo: this.route,
    });
  }
}
