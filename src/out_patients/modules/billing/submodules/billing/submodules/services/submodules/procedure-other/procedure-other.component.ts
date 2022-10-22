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
        options: [
          { title: 1, value: 1 },
          { title: 2, value: 2 },
          { title: 3, value: 3 },
          { title: 4, value: 4 },
          { title: 5, value: 5 },
        ],
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
    private specializationService: SpecializationService
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
    this.data = this.billingService.ProcedureItems;
    this.getOtherService();
    this.getSpecialization();
    this.billingService.clearAllItems.subscribe((clearItems) => {
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
      } else if (res.data.col == "doctorName") {
        this.billingService.ProcedureItems[res.data.index].billItem.doctorID =
          res.$event.value;
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
        filter((res) => {
          return res !== null && res.length >= 3;
        }),
        distinctUntilChanged(),
        debounceTime(1000),
        tap(() => {}),
        switchMap((value) => {
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
    this.config.columnsInfo.doctorName.moreOptions[index] =
      await this.specializationService.getdoctorlistonSpecialization(
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
      .subscribe((res) => {
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
        (res) => {
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
        (error) => {
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
    if (this.tableRows.tableForm.valid) {
      this.billingService.changeBillTabStatus(false);
    } else {
      this.billingService.changeBillTabStatus(true);
    }
  }

  async add(priorityId = 1) {
    let exist = this.billingService.ProcedureItems.findIndex((item: any) => {
      return item.itemid == this.formGroup.value.procedure.value;
    });
    if (exist > -1) {
      this.messageDialogService.error(
        "Procedure already added to the service list"
      );
      return;
    }
    await this.billingService.processProcedureAdd(
      priorityId,
      this.formGroup.value.procedure.serviceid,
      this.formGroup.value.procedure
    );

    this.data = [...this.billingService.ProcedureItems];
    this.formGroup.reset();
    this.checkTableValidation();
  }

  goToBill() {
    this.router.navigate(["../bill"], {
      queryParamsHandling: "merge",
      relativeTo: this.route,
    });
  }
}
