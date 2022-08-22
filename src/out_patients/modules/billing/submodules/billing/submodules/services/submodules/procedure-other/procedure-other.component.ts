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
    this.tableRows.selection.changed.subscribe((res: any) => {
      console.log(res);
      const source = res.added[0] || res.removed[0];
      console.log(source);
      this.update(source.sno);
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
            this.formGroup.value.serviceType &&
            this.formGroup.value.serviceType.value
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
            };
          });
          this.questions[1] = { ...this.questions[1] };
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

  getdoctorlistonSpecializationClinic(clinicSpecializationId: number) {
    this.http
      .get(
        BillingApiConstants.getdoctorlistonSpecializationClinic(
          false,
          clinicSpecializationId,
          Number(this.cookie.get("HSPLocationId"))
        )
      )
      .subscribe((res) => {
        this.config.columnsInfo.doctorName.options = res.map((r: any) => {
          return { title: r.doctorName, value: r.doctorId };
        });
      });
  }

  getOtherService() {
    this.http.get(BillingApiConstants.getotherservice).subscribe((res) => {
      this.questions[0].options = res.map((r: any) => {
        return { title: r.name, value: r.id };
      });
      this.questions[0] = { ...this.questions[0] };
    });
    this.formGroup.controls["otherService"].valueChanges.subscribe(
      (val: any) => {
        if (val && val.value) {
          this.getProcedures(val.value);
        }
      }
    );
  }

  getProcedures(serviceId: number) {
    this.http
      .get(
        BillingApiConstants.getotherservicebilling(
          Number(this.cookie.get("HSPLocationId")),
          serviceId
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
                originalTitle: r.itenmName,
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
      }
    }
  }

  add(priorityId = 1) {
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
        BillingApiConstants.getPrice(
          priorityId,
          this.formGroup.value.procedure.value,
          this.formGroup.value.otherService.value,
          this.cookie.get("HSPLocationId")
        )
      )
      .subscribe((res: any) => {
        this.billingService.addToProcedure({
          sno: this.data.length + 1,
          procedures: this.formGroup.value.procedure.originalTitle,
          qty: 1,
          specialisation: "",
          doctorName: "",
          price: res.amount,
          unitPrice: res.amount,
          itemid: this.formGroup.value.procedure.value,
          priorityId: priorityId,
          serviceId: this.formGroup.value.otherService.value,
        });

        this.data = [...this.billingService.ProcedureItems];
        this.formGroup.reset();
      });
  }
}
