import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { HttpService } from "@shared/services/http.service";
import { ApiConstants } from "@core/constants/ApiConstants";
import { BillingApiConstants } from "../../../../BillingApiConstant";
import { CookieService } from "@shared/services/cookie.service";
import { BillingService } from "../../../../billing.service";
import {
  debounceTime,
  tap,
  switchMap,
  finalize,
  distinctUntilChanged,
  filter,
} from "rxjs/operators";
import { of } from "rxjs";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";
import { ActivatedRoute, Router } from "@angular/router";
import { SpecializationService } from "../../../../specialization.service";
import { MatDialog } from "@angular/material/dialog";
import { ReasonForGxtTaxComponent } from "@modules/billing/submodules/billing/prompts/reason-for-gxt-tax/reason-for-gxt-tax.component";
import { BillingStaticConstants } from "@modules/billing/submodules/billing/BillingStaticConstant";

@Component({
  selector: "out-patients-procedure-other",
  templateUrl: "./procedure-other.component.html",
  styleUrls: ["./procedure-other.component.scss"],
})
export class ProcedureOtherComponent implements OnInit {
  formData = {
    title: "",
    type: "object",
    properties: {
      otherService: {
        type: "autocomplete",
        placeholder: "--Select--",
        required: false,
      },
      procedure: {
        type: "autocomplete",
        placeholder: "--Select--",
        required: true,
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
      "procedures",
      "qty",
      "specialisation",
      "doctorName",
      "price",
    ],
    columnsInfo: {
      sno: {
        title: "S.No",
        type: "number",
        style: {
          width: "80px",
        },
      },
      procedures: {
        title: "Procedures",
        type: "string",
        style: {
          width: "35%",
        },
      },
      qty: {
        title: "Qty",
        type: "dropdown",
        options: BillingStaticConstants.quantity,
        style: {
          width: "70px",
        },
      },
      specialisation: {
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

  constructor(
    private formService: QuestionControlService,
    private http: HttpService,
    private cookie: CookieService,
    public billingService: BillingService,
    public messageDialogService: MessageDialogService,
    private router: Router,
    private route: ActivatedRoute,
    private specializationService: SpecializationService,
    private matdialog: MatDialog
  ) {}

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.formData.properties,
      {}
    );
    this.formGroup = formResult.form;
    this.questions = formResult.questions;
    this.billingService.ProcedureItems.forEach((item: any, index: number) => {
      this.config.columnsInfo.doctorName.moreOptions[index] =
        this.getdoctorlistonSpecializationClinic(item.specialisation, index);
    });
    this.billingService.ProcedureItems = this.billingService.ProcedureItems.map(
      (item: any, index: number) => {
        item["sno"] = index + 1;
        return item;
      }
    );
    this.data = this.billingService.ProcedureItems;
    this.getOtherService();
    this.getSpecialization();
    this.billingService.clearAllItems.subscribe((clearItems: any) => {
      if (clearItems) {
        this.data = [];
      }
    });
  }

  rowRwmove($event: any) {
    this.billingService.removeFromBill(
      this.billingService.ProcedureItems[$event.index]
    );
    this.billingService.ProcedureItems.splice($event.index, 1);
    this.billingService.makeBillPayload.ds_insert_bill.tab_o_procedureList.splice(
      $event.index,
      1
    );
    this.billingService.makeBillPayload.ds_insert_bill.tab_d_procedureList.splice(
      $event.index,
      1
    );
    this.billingService.ProcedureItems = this.billingService.ProcedureItems.map(
      (item: any, index: number) => {
        item["sno"] = index + 1;
        return item;
      }
    );
    this.data = [...this.billingService.ProcedureItems];
    this.billingService.calculateTotalAmount();
  }

  ngAfterViewInit(): void {
    this.questions[1].elementRef.addEventListener("keypress", (event: any) => {
      if (event.key == "Enter") {
        if (this.formGroup.valid) {
          this.add();
        }
      }
    });
    this.tableRows.controlValueChangeTrigger.subscribe((res: any) => {
      if (res.data.col == "qty") {
        this.update(res.data.element.sno);
      } else if (res.data.col == "specialisation") {
        res.data.element["doctorName"] = "";
        this.getdoctorlistonSpecializationClinic(
          res.$event.value,
          res.data.index
        );
        this.billingService.ProcedureItems[
          res.data.index
        ].billItem.specialisationID = res.$event.value;
        this.checkTableValidation();
      } else if (res.data.col == "doctorName") {
        this.billingService.ProcedureItems[res.data.index].billItem.doctorID =
          res.$event.value;

        ///GAV-1462
        this.billingService.makeBillPayload.ds_insert_bill.tab_d_opbillList.forEach(
          (opbillItem: any, billIndex: any) => {
            if (
              opbillItem.itemId ==
              this.billingService.ProcedureItems[res.data.index].billItem.itemId
            ) {
              this.billingService.makeBillPayload.ds_insert_bill.tab_d_opbillList[
                billIndex
              ].consultid = res.$event.value;
            }
          }
        );

        const findDoctor = this.config.columnsInfo.doctorName.moreOptions[
          res.data.index
        ].find((doc: any) => doc.value == res.$event.value);
        this.billingService.ProcedureItems[
          res.data.index
        ].billItem.procedureDoctor = findDoctor.title;
      }
      this.checkTableValidation();
    });
    this.formGroup.controls["procedure"].valueChanges
      .pipe(
        filter((res: any) => {
          return res !== null && res.length >= 3;
        }),
        distinctUntilChanged(),
        debounceTime(1000),
        tap(() => {}),
        switchMap((value: any) => {
          if (
            this.formGroup.value.otherService &&
            this.formGroup.value.otherService.value
          ) {
            return of([]);
          } else {
            return this.http
              .get(
                BillingApiConstants.getotherservicebillingSearch(
                  Number(this.cookie.get("HSPLocationId")),
                  value
                )
              )
              .pipe(finalize(() => {}));
          }
        })
      )
      .subscribe((data: any) => {
        if (data.length > 0) {
          this.questions[1].options = data.map((r: any) => {
            return {
              title: r.itemNameWithService || r.itemName,
              value: r.itemID,
              originalTitle: r.itemName,
              serviceid: r.serviceID,
              docRequired: r.proceduredoctor,
              popuptext: r.popuptext,
            };
          });
          this.questions[1] = { ...this.questions[1] };
        }
      });
  }

  getSpecialization() {
    this.config.columnsInfo.specialisation.options =
      this.specializationService.specializationData;
  }

  async getdoctorlistonSpecializationClinic(
    clinicSpecializationId: number,
    index: number
  ) {
    ////GAV-1381 - chnage in API
    this.config.columnsInfo.doctorName.moreOptions[index] =
      await this.specializationService.getDoctorsOnSpecialization(
        clinicSpecializationId
      );
  }

  getOtherService() {
    this.http
      .get(
        BillingApiConstants.getotherserviceop(
          Number(this.cookie.get("HSPLocationId"))
        )
      )
      .subscribe((res: any) => {
        this.questions[0].options = res.map((r: any) => {
          return { title: r.name, value: r.id, isBundle: r.isBundle };
        });
        this.questions[0] = { ...this.questions[0] };
      });
    this.formGroup.controls["otherService"].valueChanges.subscribe(
      (val: any) => {
        if (val && val.value) {
          this.getProcedures(val.value, val.isBundle);
        }
      }
    );
  }

  getProcedures(serviceId: number, isBundle = 0) {
    this.http
      .get(
        BillingApiConstants.getotherservicebilling(
          Number(this.cookie.get("HSPLocationId")),
          serviceId,
          isBundle
        )
      )
      .subscribe(
        (res: any) => {
          this.formGroup.controls["procedure"].reset();
          if (Array.isArray(res)) {
            this.questions[1].options = res.map((r: any) => {
              return {
                title: r.itemNameWithService || r.itemName,
                value: r.itemID,
                originalTitle: r.itemName,
                docRequired: r.proceduredoctor,
                serviceid: r.serviceID,
                popuptext: r.popuptext,
              };
            });
          } else {
            this.questions[1].options = [];
          }

          this.questions[1] = { ...this.questions[1] };
        },
        (error: any) => {
          this.formGroup.controls["procedure"].reset();
          this.questions[1].options = [];
          this.questions[1] = { ...this.questions[1] };
        }
      );
  }

  update(sno = 0) {
    if (sno > 0) {
      const index = this.billingService.ProcedureItems.findIndex(
        (c: any) => c.sno == sno
      );
      if (index > -1) {
        this.billingService.ProcedureItems[index].price =
          this.billingService.ProcedureItems[index].unitPrice *
          this.billingService.ProcedureItems[index].qty;
        this.data = [...this.billingService.ProcedureItems];
        const billItemIndexExist = this.billingService.billItems.findIndex(
          (it: any) =>
            it.itemId == this.billingService.ProcedureItems[index].itemid
        );
        if (billItemIndexExist > -1) {
          this.billingService.billItems[billItemIndexExist].qty =
            this.billingService.ProcedureItems[index].qty;
          this.billingService.billItems[billItemIndexExist].totalAmount =
            this.billingService.ProcedureItems[index].unitPrice *
            this.billingService.ProcedureItems[index].qty;
        }
        this.billingService.calculateTotalAmount();
      }
    }
  }

  checkTableValidation() {
    setTimeout(() => {
      if (this.tableRows.tableForm.valid) {
        this.billingService.changeBillTabStatus(false);
      } else {
        this.billingService.changeBillTabStatus(true);
      }
    }, 200);
  }

  async add(priorityId = 1) {
    let exist = this.billingService.ProcedureItems.findIndex((item: any) => {
      return item.itemid == this.formGroup.value.procedure.value;
    });
    if (exist > -1) {
      this.messageDialogService.error(
        "Procedure already added to the service list"
      );
      this.formGroup.reset();
      return;
    }

    let existOrderSet = this.billingService.OrderSetItems.findIndex(
      (item: any) => {
        return item.itemid == this.formGroup.value.procedure.value;
      }
    );
    if (existOrderSet > -1) {
      this.messageDialogService.error(
        "Procedure already added to the service list"
      );
      this.formGroup.reset();
      return;
    }

    await this.billingService.processProcedureAdd(
      priorityId,
      this.formGroup.value.procedure.serviceid,
      this.formGroup.value.procedure
    );

    // this.data = [...this.billingService.ProcedureItems];
    if (
      BillingStaticConstants.excludeCodeIdGSTReason.includes(
        this.billingService.ProcedureItems[0].gstDetail.codeId
      )
    ) {
      this.data = [...this.billingService.ProcedureItems];
      this.checkTableValidation();
    } else if (
      Number(
        this.billingService.ProcedureItems[0].gstDetail.totaltaX_RATE_VALUE
      ) > 0
    ) {
      const gstxdialog = this.messageDialogService.confirm(
        "",
        "GST Tax is applicable on " +
          this.billingService.ProcedureItems[0].billItem.itemName +
          " , Do you want to proceed with GST tax?"
      );
      gstxdialog.afterClosed().subscribe((res: any) => {
        if ("type" in res) {
          if (res.type == "yes") {
            this.data = [...this.billingService.ProcedureItems];
            this.checkTableValidation();
          } else {
            const reasondialog = this.matdialog.open(ReasonForGxtTaxComponent, {
              width: "30vw",
              height: "40vh",
            });
            reasondialog.afterClosed().subscribe(async (res: any) => {
              console.log(res);
              if (res == "cancel") {
                this.billingService.removeFromBill(
                  this.billingService.ProcedureItems[0]
                );
                this.billingService.ProcedureItems = [];
                this.billingService.calculateTotalAmount();
                this.data = [...this.billingService.ProcedureItems];
              } else {
                this.billingService.resetgstfromservices(
                  this.billingService.ProcedureItems,
                  res
                );
                // this.billingService.makeBillPayload.taxReason = res;
                // this.billingService.ProcedureItems[0].gstDetail = {
                //   gsT_value: 0,
                //   gsT_percent: 0,
                //   cgsT_Value: 0,
                //   cgsT_Percent: 0,
                //   sgsT_value: 0,
                //   sgsT_percent: 0,
                //   utgsT_value: 0,
                //   utgsT_percent: 0,
                //   igsT_Value: 0,
                //   igsT_percent: 0,
                //   cesS_value: 0,
                //   cesS_percent: 0,
                //   taxratE1_Value: 0,
                //   taxratE1_Percent: 0,
                //   taxratE2_Value: 0,
                //   taxratE2_Percent: 0,
                //   taxratE3_Value: 0,
                //   taxratE3_Percent: 0,
                //   taxratE4_Value: 0,
                //   taxratE4_Percent: 0,
                //   taxratE5_Value: 0,
                //   taxratE5_Percent: 0,
                //   totaltaX_RATE: 0,
                //   totaltaX_RATE_VALUE: 0,
                //   taxgrpid: 0,
                //   codeId: 0,
                // };
                // this.billingService.ProcedureItems[0].billItem.totalAmount = this.billingService.ProcedureItems[0].billItem.totalAmount - this.billingService.ProcedureItems[0].billItem.gstValue;
                // this.billingService.ProcedureItems[0].billItem.gst = 0;
                // this.billingService.ProcedureItems[0].billItem.gstValue = 0;
                // this.billingService.makeBillPayload.tab_o_opItemBasePrice.forEach((item: any) => {
                //   if(item.itemID == this.billingService.ProcedureItems[0].itemid)
                //   {
                //     item.price = this.billingService.ProcedureItems[0].billItem.totalAmount;
                //   }
                // })
                // this.billingService.makeBillPayload.ds_insert_bill.tab_d_opbillList.forEach((item: any) => {
                //   if(item.itemId == this.billingService.ProcedureItems[0].itemid)
                //   {
                //     item.amount = this.billingService.ProcedureItems[0].billItem.totalAmount;
                //   }
                // })
                // this.billingService.calculateTotalAmount();
                this.data = [...this.billingService.ProcedureItems];
                this.checkTableValidation();
                console.log(this.data);
              }
              console.log(this.billingService.makeBillPayload);
            });
          }
        }
      });
    } else {
      this.data = [...this.billingService.ProcedureItems];
      this.checkTableValidation();
    }
    this.formGroup.reset();
  }

  goToBill() {
    let isValid = this.billingService.checkValidItems();
    if (isValid == true)
      this.router.navigate(["../bill"], {
        queryParamsHandling: "merge",
        relativeTo: this.route,
      });
  }
}
