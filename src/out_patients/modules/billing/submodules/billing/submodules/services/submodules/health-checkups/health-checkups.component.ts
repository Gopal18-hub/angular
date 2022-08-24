import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { HttpService } from "@shared/services/http.service";
import { ApiConstants } from "@core/constants/ApiConstants";
import { BillingApiConstants } from "../../../../BillingApiConstant";
import { CookieService } from "@shared/services/cookie.service";
import { BillingService } from "../../../../billing.service";
import { MatDialog } from "@angular/material/dialog";
import { PackageDoctorModificationComponent } from "../../../../prompts/package-doctor-modification/package-doctor-modification.component";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";
import {
  debounceTime,
  tap,
  switchMap,
  finalize,
  distinctUntilChanged,
  filter,
} from "rxjs/operators";
import { of } from "rxjs";

@Component({
  selector: "out-patients-health-checkups",
  templateUrl: "./health-checkups.component.html",
  styleUrls: ["./health-checkups.component.scss"],
})
export class HealthCheckupsComponent implements OnInit {
  formData = {
    title: "",
    type: "object",
    properties: {
      department: {
        type: "autocomplete",
        placeholder: "--Select--",
        required: false,
      },
      healthCheckup: {
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
    displayedColumns: ["sno", "healthCheckups", "price"],
    columnsInfo: {
      sno: {
        title: "S.No",
        type: "number",
        style: {
          width: "80px",
        },
      },
      healthCheckups: {
        title: "Health Checkups",
        type: "string_link",
        style: {
          width: "50%",
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
    public matDialog: MatDialog,
    public messageDialogService: MessageDialogService
  ) {}

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.formData.properties,
      {}
    );
    this.formGroup = formResult.form;
    this.questions = formResult.questions;
    this.data = this.billingService.HealthCheckupItems;
    this.getDepartments();
    this.billingService.clearAllItems.subscribe((clearItems) => {
      if (clearItems) {
        this.data = [];
      }
    });
  }

  rowRwmove($event: any) {
    this.billingService.HealthCheckupItems.splice($event.index, 1);
    this.billingService.HealthCheckupItems =
      this.billingService.HealthCheckupItems.map((item: any, index: number) => {
        item["sno"] = index + 1;
        return item;
      });
    this.data = [...this.billingService.HealthCheckupItems];
    this.billingService.calculateTotalAmount();
  }

  ngAfterViewInit(): void {
    this.tableRows.stringLinkOutput.subscribe((res: any) => {
      console.log(res);
      this.matDialog.open(PackageDoctorModificationComponent, {
        width: "50%",
        height: "50%",
        data: {
          orderSet: res.element,
          items: [],
        },
      });
    });

    this.formGroup.controls["healthCheckup"].valueChanges
      .pipe(
        filter((res) => {
          return res !== null && res.length >= 3;
        }),
        distinctUntilChanged(),
        debounceTime(1000),
        tap(() => {}),
        switchMap((value) => {
          if (
            this.formGroup.value.department &&
            this.formGroup.value.department.value
          ) {
            return of([]);
          } else {
            return this.http
              .get(
                BillingApiConstants.gethealthcheckupsonsearch(
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
              title: r.nameWithDepartment || r.name,
              value: r.id,
              originalTitle: r.name,
            };
          });
          this.questions[1] = { ...this.questions[1] };
        }
      });
  }

  getDepartments() {
    this.http.get(BillingApiConstants.departmentlookup).subscribe((res) => {
      this.questions[0].options = res.map((r: any) => {
        return { title: r.name, value: r.id };
      });
      this.questions[0] = { ...this.questions[0] };
    });
    this.formGroup.controls["department"].valueChanges.subscribe((val: any) => {
      if (val && val.value) {
        this.gethealthcheckups(val.value);
      }
    });
  }

  gethealthcheckups(departmentId: any) {
    this.http
      .get(
        BillingApiConstants.gethealthcheckups(
          Number(this.cookie.get("HSPLocationId")),
          departmentId
        )
      )
      .subscribe(
        (res) => {
          this.formGroup.controls["healthCheckup"].reset();
          if (Array.isArray(res)) {
            this.questions[1].options = res.map((r: any) => {
              return { title: r.name, value: r.id, originalTitle: r.name };
            });
          } else {
            this.questions[1].options = [];
          }

          this.questions[1] = { ...this.questions[1] };
        },
        (error) => {
          this.formGroup.controls["healthCheckup"].reset();
          this.questions[1].options = [];
          this.questions[1] = { ...this.questions[1] };
        }
      );
  }

  add(priorityId = 1) {
    let exist = this.billingService.HealthCheckupItems.findIndex(
      (item: any) => {
        return item.itemid == this.formGroup.value.healthCheckup.value;
      }
    );
    if (exist > -1) {
      this.messageDialogService.error(
        "Health Checkup Item already added to the service list"
      );
      return;
    }
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
        this.billingService.addToHealthCheckup({
          sno: this.data.length + 1,
          healthCheckups: this.formGroup.value.healthCheckup.originalTitle,
          price: res.amount,
          itemid: this.formGroup.value.healthCheckup.value,
          serviceid: 26,
          priorityId: priorityId,
        });

        this.data = [...this.billingService.HealthCheckupItems];
        this.formGroup.reset();
      });
  }
}
