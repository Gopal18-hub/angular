import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { BillingService } from "@modules/billing/submodules/billing/billing.service";
import { BillingApiConstants } from "@modules/billing/submodules/billing/BillingApiConstant";
import { CookieService } from "@shared/services/cookie.service";
import { HttpService } from "@shared/services/http.service";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";
import {
  filter,
  distinctUntilChanged,
  debounceTime,
  tap,
  switchMap,
  of,
  finalize,
} from "rxjs";

@Component({
  selector: "out-patients-procedure-other",
  templateUrl: "./procedure-other.component.html",
  styleUrls: ["./procedure-other.component.scss"],
})
export class OrderProcedureOtherComponent implements OnInit {
  formData = {
    title: "",
    type: "object",
    properties: {
      otherService: {
        type: "autocomplete",
        placeholder: "--Select--",
        required: false,
      },
    },
  };
  formGroup!: FormGroup;
  questions: any;
  flag = 0;

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
        type: "number",
      },
    },
  };

  constructor(
    private formService: QuestionControlService,
    private http: HttpService,
    private cookie: CookieService,
    public billingService: BillingService,
    public messageDialogService: MessageDialogService
  ) {}

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.formData.properties,
      {}
    );
    this.formGroup = formResult.form;
    this.questions = formResult.questions;
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
    this.tableRows.controlValueChangeTrigger.subscribe((res: any) => {
      if (res.data.col == "qty") {
        this.update(res.data.element.sno);
      } else if (res.data.col == "specialisation") {
        this.getdoctorlistonSpecializationClinic(
          res.$event.value,
          res.data.index
        );
      }
    });
  }

  getSpecialization() {
    this.http.get(BillingApiConstants.getspecialization).subscribe((res) => {
      this.config.columnsInfo.specialisation.options = res.map((r: any) => {
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

  getOtherService() {
    this.http
      .get(
        BillingApiConstants.getotherserviceop(
          Number(this.cookie.get("HSPLocationId"))
        )
      )
      .subscribe((res) => {
        console.log(res);
        this.questions[0].options = res.map((r: any) => {
          return { title: r.name, value: r.id };
        });
        this.questions[0] = { ...this.questions[0] };
      });
    this.formGroup.controls["otherService"].valueChanges.subscribe(
      (val: any) => {
        if (val && val.value) {
        }
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
      }
    }
  }

  add(priorityId = 1) {
    this.flag = 0;
    let exist = this.billingService.ProcedureItems.findIndex((item: any) => {
      return item.itemid == this.formGroup.value.procedure.value;
    });
    if (exist > -1) {
      this.messageDialogService.error(
        "Procedure already added to the service list"
      );
      return;
    }
    this.http
      .get(
        BillingApiConstants.checkpriceforzeroitemid(
          this.formGroup.value.investigation.value,
          "67",
          "9"
        )
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe((response) => {
        console.log(response);
        if (response == 1) {
          this.flag++;
          console.log(this.flag);
          if (this.flag == 2) {
            this.addrow();
          }
        } else {
          this.messageDialogService.info(
            "Price for this service is not defined"
          );
        }
      });
    this.http
      .get(
        BillingApiConstants.checkPatientSex(
          this.formGroup.value.investigation.value,
          this.billingService.patientDemographicdata.gender,
          this.formGroup.value.serviceType,
          "9"
        )
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe((response) => {
        console.log(response);
        if (response == 1) {
          this.flag++;
          if (this.flag == 2) {
            this.addrow();
          }
          console.log(this.flag);
        } else {
          this.messageDialogService.info(
            "This service is not allowed for this sex"
          );
        }
      });

    if (this.flag == 2) {
      this.addrow();
    }

    // this.http
    //   .get(
    //     BillingApiConstants.getPrice(
    //       priorityId,
    //       this.formGroup.value.procedure.value,
    //       this.formGroup.value.otherService.value,
    //       this.cookie.get("HSPLocationId")
    //     )
    //   )
    //   .subscribe((res: any) => {
    //     this.billingService.addToProcedure({
    //       sno: this.data.length + 1,
    //       procedures: this.formGroup.value.procedure.originalTitle,
    //       qty: 1,
    //       specialisation: "",
    //       doctorName: "",
    //       price: res.amount,
    //       unitPrice: res.amount,
    //       itemid: this.formGroup.value.procedure.value,
    //       priorityId: priorityId,
    //       serviceId: this.formGroup.value.otherService.value,
    //     });

    //     this.data = [...this.billingService.ProcedureItems];
    //     this.formGroup.reset();
    //   });
  }
  _destroying$(
    _destroying$: any
  ): import("rxjs").OperatorFunction<any, unknown> {
    throw new Error("Method not implemented.");
  }
  addrow() {}
  save() {}
  view() {}
}
function takeUntil(
  _destroying$: any
): import("rxjs").OperatorFunction<any, unknown> {
  throw new Error("Function not implemented.");
}
