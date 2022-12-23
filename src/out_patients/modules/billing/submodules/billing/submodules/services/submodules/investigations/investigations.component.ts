import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { HttpService } from "@shared/services/http.service";
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
import { BillingStaticConstants } from "../../../../BillingStaticConstant";
import { SpecializationService } from "../../../../specialization.service";
import { CalculateBillService } from "@core/services/calculate-bill.service";

@Component({
  selector: "out-patients-investigations",
  templateUrl: "./investigations.component.html",
  styleUrls: ["./investigations.component.scss"],
})
export class InvestigationsComponent implements OnInit {
  formData = {
    title: "",
    type: "object",
    properties: {
      serviceType: {
        type: "dropdown",
        required: false,
        placeholder: "--Select--",
      },
      investigation: {
        type: "autocomplete",
        required: true,
        placeholder: "--Select--",
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
    dateformat: "dd/MM/yyyy",
    selectBox: false,
    removeRow: true,
    displayedColumns: [
      "sno",
      "investigations",
      "precaution",
      "priority",
      "specialisation",
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
      investigations: {
        title: "Investigations",
        type: "string",
        style: {
          width: "25%",
        },
      },
      precaution: {
        title: "Precaution",
        type: "string_link",
      },
      priority: {
        title: "Priority",
        type: "dropdown",
        options: [],
        style: {
          width: "10%",
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

  precautionExcludeLocations = [69];

  defaultPriorityId = 1;

  zeroPriceExist: boolean = false;
  differentPriorityExist: boolean = false;
  childItems: any = [];

  constructor(
    private formService: QuestionControlService,
    private http: HttpService,
    private cookie: CookieService,
    public billingService: BillingService,
    public messageDialogService: MessageDialogService,
    private router: Router,
    private route: ActivatedRoute,
    private specializationService: SpecializationService,
    private calculateBillService: CalculateBillService
  ) {}

  ngOnInit(): void {
    if (
      this.precautionExcludeLocations.includes(
        Number(this.cookie.get("HSPLocationId"))
      )
    ) {
      this.config.displayedColumns.splice(2, 1);
    }
    let formResult: any = this.formService.createForm(
      this.formData.properties,
      {}
    );
    this.formGroup = formResult.form;
    this.questions = formResult.questions;
    this.billingService.InvestigationItems.forEach(
      (item: any, index: number) => {
        item["sno"] = index + 1;
        this.getdoctorlistonSpecializationClinic(item.specialisation, index);
      }
    );
    this.data = this.billingService.InvestigationItems;
    this.getServiceTypes();
    this.getSpecialization();
    this.billingService.clearAllItems.subscribe((clearItems: any) => {
      if (clearItems) {
        this.data = [];
      }
    });
  }

  rowRwmove($event: any) {
    this.billingService.removeFromBill(
      this.billingService.InvestigationItems[$event.index]
    );
    this.billingService.InvestigationItems.splice($event.index, 1);
    this.billingService.makeBillPayload.ds_insert_bill.tab_o_optestList.splice(
      $event.index,
      1
    );
    this.billingService.makeBillPayload.ds_insert_bill.tab_d_optestorderList.splice(
      $event.index,
      1
    );
    this.billingService.InvestigationItems =
      this.billingService.InvestigationItems.map((item: any, index: number) => {
        item["sno"] = index + 1;
        return item;
      });
    ////GAV-1280  Adding Investigations with same profile
    if ($event.data.billItem.profileId == 1) {
      this.http
        .get(BillingApiConstants.gettestprofileid($event.data.billItem.itemId))
        .subscribe((res: any) => {
          this.childItems = this.childItems.filter(
            (c: any) => !res.includes(c)
          );
        });
    }

    this.data = [...this.billingService.InvestigationItems];
    if (this.data.length == 0) {
      this.defaultPriorityId = 1;
      this.zeroPriceExist = false;
      ////GAV-1280  Adding Investigations with same profile
      this.childItems = [];
      this.billingService.changeBillTabStatus(false);
    } else if (this.data.length == 1) {
      this.defaultPriorityId = this.data[0].priority;
      this.differentPriorityExist = false;
      this.billingService.changeBillTabStatus(false);
    }
    this.billingService.calculateTotalAmount();
    this.checkTableValidation();
  }

  ngAfterViewInit(): void {
    this.tableRows.stringLinkOutput.subscribe((res: any) => {
      if (
        "patient_Instructions" in res.element.billItem &&
        res.element.billItem.patient_Instructions
      ) {
        this.messageDialogService.info(
          res.element.billItem.patient_Instructions
        );
      }
    });

    this.questions[1].elementRef.addEventListener("keypress", (event: any) => {
      if (event.key == "Enter") {
        if (this.formGroup.valid) {
          this.add();
        }
      }
    });
    this.tableRows.controlValueChangeTrigger.subscribe(async (res: any) => {
      if (res.data.col == "specialisation") {
        res.data.element["doctorName"] = "";
        this.getdoctorlistonSpecializationClinic(
          res.$event.value,
          res.data.index
        );
        this.billingService.InvestigationItems[
          res.data.index
        ].billItem.specialisationID = res.$event.value;
        this.checkTableValidation();
      } else if (res.data.col == "doctorName") {
        this.billingService.InvestigationItems[
          res.data.index
        ].billItem.doctorID = res.$event.value;
        const findDoctor = this.config.columnsInfo.doctorName.moreOptions[
          res.data.index
        ].find((doc: any) => doc.value == res.$event.value);
        this.billingService.InvestigationItems[
          res.data.index
        ].billItem.procedureDoctor = findDoctor.title;
        this.checkTableValidation();
      } else if (res.data.col == "priority") {
        if (this.data.length == 1) {
          this.defaultPriorityId = res.$event.value;
        } else {
          if (this.defaultPriorityId != res.$event.value) {
            this.billingService.changeBillTabStatus(true);
            const errorDialog = this.messageDialogService.error(
              "Investigations can not have different priorities"
            );
            await errorDialog.afterClosed().toPromise();
            ////GAV-907
            for (var i = 0; i < this.data.length; i++) {
              if (this.data[i].priority != res.$event.value) {
                this.differentPriorityExist = true;
                break;
              } else {
                this.defaultPriorityId = res.$event.value;
                this.differentPriorityExist = false;
              }
            }
          } else {
            this.differentPriorityExist = false;
            this.checkTableValidation();
          }
        }
        this.updatePriceByChangePriority(
          res.$event.value,
          res.data.element,
          res.data.index
        );
      }
    });
    this.formGroup.controls["investigation"].valueChanges
      .pipe(
        filter((res: any) => {
          return res !== null && res.length >= 3;
        }),
        distinctUntilChanged(),
        debounceTime(1000),
        tap(() => {}),
        switchMap((value: any) => {
          if (
            this.formGroup.value.serviceType &&
            this.formGroup.value.serviceType.value
          ) {
            return of([]);
          } else {
            return this.http
              .get(
                BillingApiConstants.getinvestigationSearch(
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
              title: r.testNameWithService || r.name,
              value: r.id,
              serviceid: r.serviceid,
              originalTitle: r.name,
              docRequired: r.procedureDoctor, ////GAV-1423
              patient_Instructions: r.patient_Instructions,
              item_Instructions:
                BillingStaticConstants.investigationItemBasedInstructions[
                  r.id.toString()
                ],
              precaution: r.precaution,
              popuptext: r.popuptext,
              profileid: r.profileid,
              ngStyle: this.getOutSourceColor(r),
            };
          });
          this.questions[1] = { ...this.questions[1] };
        }
      });
  }
  getOutSourceColor(r: any): any {
    let color = "";
    if (r.outsourceColor == 2) {
      color = "red";
    } else if (r.outsourceColor == 1) {
      color = "orange";
    }
    return { color: color };
  }
  checkTableValidation() {
    this.zeroPriceExist = false;

    console.log(this.data);
    this.data.forEach((item: any) => {
      if (item.price == 0) {
        this.zeroPriceExist = true;
      }
    });
    if (this.zeroPriceExist) {
      this.billingService.changeBillTabStatus(true);
    } else if (this.differentPriorityExist) {
      this.billingService.changeBillTabStatus(true);
    } else {
      setTimeout(() => {
        console.log(this.tableRows.tableForm);
        if (this.tableRows.tableForm.valid) {
          this.billingService.changeBillTabStatus(false);
        } else {
          this.billingService.changeBillTabStatus(true);
        }
      }, 200);
    }
  }

  getSpecialization() {
    this.http
      .get(BillingApiConstants.getInvetigationPriorities)
      .subscribe((res: any) => {
        this.config.columnsInfo.priority.options = res.map((r: any) => {
          return { title: r.name, value: r.id };
        });
      });
    this.config.columnsInfo.specialisation.options =
      this.specializationService.specializationData;
  }

  async getdoctorlistonSpecializationClinic(
    clinicSpecializationId: number,
    index: number
  ) {
    ////GAV-1381 -
    this.config.columnsInfo.doctorName.moreOptions[index] =
      await this.specializationService.getDoctorsOnSpecialization(
        clinicSpecializationId
      );
  }

  getServiceTypes() {
    this.http
      .get(BillingApiConstants.getinvestigationservice)
      .subscribe((res: any) => {
        this.questions[0].options = res.map((r: any) => {
          return { title: r.name, value: r.id };
        });
        this.questions[0] = { ...this.questions[0] };
      });
    this.formGroup.controls["serviceType"].valueChanges.subscribe(
      (val: any) => {
        if (val) {
          this.getInvestigations(val);
        }
      }
    );
  }

  getInvestigations(serviceId: number) {
    this.http
      .get(
        BillingApiConstants.getinvestigation(
          Number(this.cookie.get("HSPLocationId")),
          serviceId
        )
      )
      .subscribe((res: any) => {
        this.formGroup.controls["investigation"].reset();
        this.questions[1].options = res.map((r: any) => {
          return {
            title: r.testNameWithService || r.name,
            value: r.id,
            originalTitle: r.name,
            docRequired: r.procedureDoctor, ////GAV-1423
            patient_Instructions: r.patient_Instructions,
            item_Instructions:
              BillingStaticConstants.investigationItemBasedInstructions[
                r.id.toString()
              ],
            serviceid: r.serviceid,
            popuptext: r.popuptext,
            precaution: r.precaution,
            profileid: r.profileid,
            //ngStyle: {
            //  color: r.outsourceColor == 2 ? "red" : "",
            //},
            ngStyle: this.getOutSourceColor(r),
          };
        });
        this.questions[1] = { ...this.questions[1] };
      });
  }

  updatePriceByChangePriority(priorityId: number, data: any, index: number) {
    this.http
      .post(BillingApiConstants.getcalculateopbill, {
        compId: this.billingService.company,
        priority: priorityId,
        itemId: data.billItem.itemId,
        serviceId: data.billItem.serviceId,
        locationId: this.cookie.get("HSPLocationId"),
        ipoptype: 1,
        bedType: 0,
        bundleId: 0,
      })
      .subscribe((res: any) => {
        if (res.length > 0) {
          this.billingService.InvestigationItems[index].price =
            res[0].returnOutPut + res[0].totaltaX_Value;
          this.billingService.InvestigationItems[index].billItem.price =
            res[0].returnOutPut + res[0].totaltaX_Value;
          this.billingService.InvestigationItems[index].billItem.totalAmount =
            res[0].returnOutPut + res[0].totaltaX_Value;
          ////GAV-1464
          this.billingService.InvestigationItems[index].billItem.itemCode =
            res[0].itemCode;
          this.data = [...this.billingService.InvestigationItems];
          this.billingService.calculateTotalAmount();
          if (res[0].returnOutPut == 0) {
            this.messageDialogService.error(
              "Price Not Defined For " + data.investigations
            );
            this.billingService.changeBillTabStatus(true);
          } else {
            this.checkTableValidation();
          }
        }
      });
  }

  async add() {
    ////GAV-871
    if (this.formGroup.value.investigation.value) {
      this.calculateBillService.blockActions.next(true);
      const priorityId = this.defaultPriorityId;
      let exist = this.billingService.InvestigationItems.findIndex(
        (item: any) => {
          return (
            item.billItem.itemId == this.formGroup.value.investigation.value
          );
        }
      );
      if (exist > -1) {
        this.calculateBillService.blockActions.next(false);
        this.messageDialogService.error(
          "Investigation already added to the service list"
        );
        return;
      }
      if (this.childItems.includes(this.formGroup.value.investigation.value)) {
        this.calculateBillService.blockActions.next(false);
        this.messageDialogService.error(
          "Investigation already exist under the profile added"
        );
        return;
      }

      if (this.formGroup.value.investigation.profileid == 1) {
        this.http
          .get(
            BillingApiConstants.gettestprofileid(
              this.formGroup.value.investigation.value
            )
          )
          .subscribe((res: any) => {
            this.childItems = [...this.childItems, ...res];
          });
      }

      this.checkPatientSex(
        this.formGroup.value.investigation.value,
        this.billingService.activeMaxId.gender,
        this.formGroup.value.serviceType ||
          this.formGroup.value.investigation.serviceid,
        "1",
        priorityId
      );
    }
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
      .subscribe(async (res: any) => {
        if (res == 1) {
          await this.billingService.processInvestigationAdd(
            priorityId,
            this.formGroup.value.serviceType ||
              this.formGroup.value.investigation.serviceid,
            this.formGroup.value.investigation
          );
          if (
            "item_Instructions" in this.formGroup.value.investigation &&
            this.formGroup.value.investigation.item_Instructions
          ) {
            this.messageDialogService.info(
              this.formGroup.value.investigation.item_Instructions
            );
          }

          this.data = [...this.billingService.InvestigationItems];
          this.formGroup.reset();
        } else {
          this.messageDialogService.error(
            "This investigation can not assign for this sex"
          );
          this.formGroup.reset();
        }
        this.calculateBillService.blockActions.next(false);
        this.checkTableValidation();
      });
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
