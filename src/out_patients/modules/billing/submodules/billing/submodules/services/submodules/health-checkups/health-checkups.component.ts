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
import { ActivatedRoute, Router } from "@angular/router";

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

  doctorsList: any = [];

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
    this.data = this.billingService.HealthCheckupItems;
    this.getDepartments();
    this.billingService.clearAllItems.subscribe((clearItems) => {
      if (clearItems) {
        this.data = [];
      }
    });
  }

  rowRwmove($event: any) {
    this.billingService.removeFromBill(
      this.billingService.HealthCheckupItems[$event.index]
    );
    this.billingService.HealthCheckupItems.splice($event.index, 1);
    this.billingService.HealthCheckupItems =
      this.billingService.HealthCheckupItems.map((item: any, index: number) => {
        item["sno"] = index + 1;
        return item;
      });
    if (this.billingService.HealthCheckupItems.length == 0) {
      this.billingService.servicesTabStatus.next({ clear: true });
    }
    this.data = [...this.billingService.HealthCheckupItems];
    this.billingService.calculateTotalAmount();
  }

  detialsForHealthCheckup(res: any) {
    const dialogPopup = this.matDialog.open(
      PackageDoctorModificationComponent,
      {
        width: "50%",
        data: {
          orderSet: res.element,
          items: [],
          doctorsList: this.doctorsList,
        },
      }
    );
    dialogPopup.afterClosed().subscribe((res1: any) => {
      if (res1.itemId) {
        this.doctorsList = [];
        res1.data.forEach((doctor: any) => {
          if (doctor.doctorName) {
            this.doctorsList.push(doctor.doctorName);
          } else {
            this.doctorsList.push(0);
          }
        });
        this.billingService.setHCUDetails(res1.itemId, this.doctorsList);
      } else {
        this.doctorsList = this.doctorsList.map((d: number) => d * 0);
      }
    });
  }

  ngAfterViewInit(): void {
    this.tableRows.stringLinkOutput.subscribe((res: any) => {
      this.detialsForHealthCheckup(res);
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

  checkPatientSex(
    testId: string,
    gender: string,
    serviceId: string,
    type: string,
    priorityId: number
  ) {
    this.http
      .get(BillingApiConstants.checkPatientSex(testId, gender, serviceId, type))
      .subscribe((res) => {
        if (res == 1) {
          this.proceedToAdd(priorityId);
        } else {
          this.messageDialogService.error(
            "This plan can not assign for this sex"
          );
          this.formGroup.reset();
        }
      });
  }

  getDoctorsList(hid: string, serviceid: string) {
    this.doctorsList = [];
    this.http
      .get(BillingApiConstants.getHealthCheckupdetails(hid, serviceid))
      .subscribe((res) => {
        res.forEach((item: any, index: number) => {
          if (item.isConsult == 1 && item.itemServiceID == 25) {
            this.doctorsList.push(0);
          }
        });
        if (this.doctorsList.length > 0) {
          this.detialsForHealthCheckup({
            element: this.billingService.HealthCheckupItems[0],
          });
        }
      });
  }

  add(priorityId = 1) {
    if (this.billingService.HealthCheckupItems.length == 1) {
      this.messageDialogService.error(
        "Only one health check up will allow per bill"
      );
      return;
    }
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
    this.checkPatientSex(
      this.formGroup.value.healthCheckup.value,
      this.billingService.activeMaxId.gender,
      "26",
      "1",
      priorityId
    );
  }

  proceedToAdd(priorityId: number) {
    this.http
      .post(BillingApiConstants.getcalculateopbill, {
        compId: this.billingService.company,
        priority: priorityId,
        itemId: this.formGroup.value.healthCheckup.value,
        serviceId: 26,
        locationId: this.cookie.get("HSPLocationId"),
        ipoptype: 1,
        bedType: 0,
        bundleId: 0,
      })
      .subscribe((res: any) => {
        if (res.length > 0) {
          this.billingService.addToHealthCheckup({
            sno: this.data.length + 1,
            healthCheckups: this.formGroup.value.healthCheckup.originalTitle,
            price: res[0].returnOutPut,
            itemid: this.formGroup.value.healthCheckup.value,
            serviceid: 26,
            priorityId: priorityId,
            billItem: {
              itemId: this.formGroup.value.healthCheckup.value,
              priority: priorityId,
              serviceId: 26,
              price: res[0].returnOutPut,
              serviceName: "Health Checkups",
              itemName: this.formGroup.value.healthCheckup.originalTitle,
              qty: 1,
              precaution: "n/a",
              procedureDoctor: "n/a",
              credit: 0,
              cash: 0,
              disc: 0,
              discAmount: 0,
              totalAmount: res[0].returnOutPut,
              gst: 0,
              gstValue: 0,
              specialisationID: 0,
              doctorID: 0,
            },
          });
          this.getDoctorsList(this.formGroup.value.healthCheckup.value, "26");
        }

        this.data = [...this.billingService.HealthCheckupItems];
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
