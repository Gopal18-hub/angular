import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { BillingApiConstants } from "@modules/billing/submodules/billing/BillingApiConstant";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { HttpService } from "@shared/services/http.service";
import { BillingService } from "@modules/billing/submodules/billing/billing.service";
import { CookieService } from "@shared/services/cookie.service";
import { ConsultationWarningComponent } from "@modules/billing/submodules/billing/prompts/consultation-warning/consultation-warning.component";
import { MatDialog } from "@angular/material/dialog";
import { PostDischargeServiceService } from "../../../../post-discharge-service.service";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  finalize,
  switchMap,
  tap,
} from "rxjs/operators";
import { of } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
@Component({
  selector: "out-patients-post-discharge-consultations",
  templateUrl: "./post-discharge-consultations.component.html",
  styleUrls: ["./post-discharge-consultations.component.scss"],
})
export class PostDischargeConsultationsComponent implements OnInit {
  formData = {
    title: "",
    type: "object",
    properties: {
      specialization: {
        type: "autocomplete",
        placeholder: "--Select--",
        options: [],
      },
      doctorName: {
        type: "autocomplete",
        placeholder: "--Select--",
        options: [],
        required: true,
      },
      clinics: {
        type: "autocomplete",
        required: false,
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
    removeRow: true,
    dateformat: "dd/MM/yyyy",
    selectBox: false,
    displayedColumns: [
      "sno",
      "doctorName",
      "type",
      "scheduleSlot",
      "bookingDate",
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
      doctorName: {
        title: "Doctor Name",
        type: "string",
        style: {
          width: "36%",
        },
      },
      type: {
        title: "Type",
        type: "dropdown",
        options: [],
        style: {
          width: "20%",
        },
      },
      scheduleSlot: {
        title: "Schedule Slot",
        type: "string",
        style: {
          width: "10%",
        },
      },
      bookingDate: {
        title: "Booking Date",
        type: "date",
        style: {
          width: "10%",
        },
      },
      price: {
        title: "Price",
        type: "number",
        style: {
          width: "10%",
        },
      },
    },
    // columnsInfo: {
    //   sno: {
    //     title: "S.No",
    //     type: "string",
    //     style: {
    //       width: "5rem",
    //     },
    //   },
    //   doctorName: {
    //     title: "Doctor Name",
    //     type: "string",
    //     style: {
    //       width: "16rem",
    //     },
    //   },
    //   type: {
    //     title: "Type",
    //     type: "dropdown",
    //     style: {
    //       width: "10rem",
    //     },
    //   },
    //   scheduleSlot: {
    //     title: "Schedule Slot",
    //     type: "string",
    //     style: {
    //       width: "10rem",
    //     },
    //   },
    //   bookingDate: {
    //     title: "Booking Date",
    //     type: "string",
    //     style: {
    //       width: "10rem",
    //     },
    //   },
    //   price: {
    //     title: "Price",
    //     type: "string",
    //     style: {
    //       width: "8rem",
    //     },
    //   },
    // },
  };
  locationId = Number(this.cookie.get("HSPLocationId"));
  excludeClinicsLocations = [67, 69];
  consultationTypes: any = [];
  apiProcessing: boolean = false;
  constructor(
    private formService: QuestionControlService,
    public billingService: BillingService,
    private cookie: CookieService,
    private matDialog: MatDialog,
    private http: HttpService,
    private router: Router,
    private route: ActivatedRoute,
    public service: PostDischargeServiceService,
    private msgdialog: MessageDialogService
  ) {}

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.formData.properties,
      {}
    );
    this.formGroup = formResult.form;
    this.questions = formResult.questions;
    this.service.setBillingFormGroup(this.formGroup, this.questions);
    this.getSpecialization();
    this.data = this.service.consultationItems;
    this.http.get(BillingApiConstants.consultationTypes).subscribe((res) => {
      this.consultationTypes = res;
      this.config.columnsInfo.type.options = res.map((r: any) => {
        return { title: r.name, value: r.id };
      });
    });
    this.service.clearAllItems.subscribe((clearItems) => {
      if (clearItems) {
        this.data = [];
      }
    });

    this.service.consultationItemsAdded.subscribe((added: boolean) => {
      if (added) {
        this.data = [...this.service.consultationItems];
        this.service.calculateTotalAmount();
      }
    });
  }
  ngAfterViewInit(): void {
    this.tableRows.selection.changed.subscribe((res: any) => {
      const source = res.added[0] || res.removed[0];
      this.update(source.type, source.sno, source.doctorId);
    });
    this.formGroup.controls["specialization"].valueChanges.subscribe((res) => {
      console.log(res);
      this.questions[1].options = [];
      if(res != null)
      {
        this.getdoctorlistonSpecializationClinic(res.value);
      }
    });

    this.questions[1].elementRef.addEventListener("keypress", (event: any) => {
      if (event.key == "Enter") {
        if (this.formGroup.valid) {
          this.add();
        }
      }
    });

    this.formGroup.controls["doctorName"].valueChanges
      .pipe(
        filter((res) => {
          return res !== null && res.length >= 3;
        }),
        distinctUntilChanged(),
        debounceTime(1000),
        tap(() => {}),
        switchMap((value) => {
          if (
            this.formGroup.value.specialization &&
            this.formGroup.value.specialization.value
          ) {
            return of([]);
          } else {
            return this.http
              .get(
                BillingApiConstants.getbillingdoctorsonsearch(
                  value,
                  Number(this.cookie.get("HSPLocationId"))
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
              title: r.doctorNameWithSpecialization || r.doctorName,
              value: r.doctorId,
              originalTitle: r.doctorName,
              specialisationid: r.specialisationid,
              clinicID: r.clinicID,
            };
          });
          this.questions[1] = { ...this.questions[1] };
        }
      });

      this.tableRows.controlValueChangeTrigger.subscribe( (res: any) => {
        this.update(res.$event.value, res.data.element.sno, res.data.element.doctorId);
      })
  }
  getSpecialization() {
    if (!this.excludeClinicsLocations.includes(this.locationId)) {
      this.http
        .get(BillingApiConstants.getclinics(this.locationId))
        .subscribe((res) => {
          this.questions[2].options = res.map((r: any) => {
            return { title: r.name, value: r.id };
          });
          this.questions[2] = { ...this.questions[2] };
        });
      this.formGroup.controls["clinics"].valueChanges.subscribe((val: any) => {
        if (val && val.value) {
          this.getdoctorlistonSpecializationClinic(val.value, true);
        }
      });
    } else {
      this.http.get(BillingApiConstants.getspecialization).subscribe((res) => {
        this.questions[0].options = res.map((r: any) => {
          return { title: r.name, value: r.id };
        });
        this.questions[0] = { ...this.questions[0] };
      });
      this.formGroup.controls["specialization"].valueChanges.subscribe(
        (val: any) => {
          if (val && val.value) {
            this.getdoctorlistonSpecializationClinic(val.value);
          }
        }
      );
    }
  }

  getdoctorlistonSpecializationClinic(
    clinicSpecializationId: number,
    isClinic = false
  ) {
    this.http
      .get(
        BillingApiConstants.getdoctorlistonSpecializationClinic(
          isClinic,
          clinicSpecializationId,
          Number(this.cookie.get("HSPLocationId"))
        )
      )
      .subscribe((res) => {
        this.formGroup.controls["doctorName"].reset();
        this.questions[1].options = res.map((r: any) => {
          return {
            title: r.doctorNameWithSpecialization || r.doctorName,
            value: r.doctorId,
            originalTitle: r.doctorName,
            specialisationid: r.specialisationid,
            clinicID: r.clinicID,
          };
        });
        this.questions[1] = { ...this.questions[1] };
      });
  }

  add(priorityId = 57) {
    if (this.service.consultationItems.length == 1) {
      // this.matDialog.open(ConsultationWarningComponent, {
      //   width: "30vw",
      //   data: {},
      // });
      this.msgdialog.info("Coupon allow only single consultation");
      return;
    }
    this.apiProcessing = true;
    this.http
      .post(BillingApiConstants.getcalculateopbill, {
        compId: this.billingService.company,
        priority: priorityId,
        itemId: this.formGroup.value.doctorName.value,
        serviceId: 25,
        locationId: this.cookie.get("HSPLocationId") || 7,
        ipoptype: 1,
        bedType: 0,
        bundleId: 0,
      })
      .subscribe((res: any) => {
        console.log("Add--", res);
        if (res.length > 0) {
          this.service.addToConsultation({
            sno: this.data.length + 1,
            doctorName: this.formGroup.value.doctorName.originalTitle,
            doctorId: this.formGroup.value.doctorName.value,
            type: priorityId,
            scheduleSlot: "",
            bookingDate: "",
            price: res[0].returnOutPut.toFixed(2),
            specialization: this.formGroup.value.doctorName.specialisationid,
            clinics: this.formGroup.value.clinics
              ? this.formGroup.value.clinics.value
              : 0,
            billItem: {
              itemId: this.formGroup.value.doctorName.value,
              priority: priorityId,
              serviceId: 25,
              price: res[0].returnOutPut.toFixed(2),
              serviceName: "Consultation Charges",
              itemName: this.formGroup.value.doctorName.originalTitle,
              qty: 1,
              type: this.consultationTypes.filter((res: any) => { return res.id == priorityId})[0].name,
              precaution: "",
              procedureDoctor: "",
              credit: Number(0).toFixed(2),
              cash: Number(0).toFixed(2),
              disc: Number(0).toFixed(2),
              discAmount: Number(0).toFixed(2),
              totalAmount: res[0].returnOutPut.toFixed(2),
              gst: Number(0).toFixed(2),
              gstValue: Number(0).toFixed(2),
              specialisationID:
                this.formGroup.value.doctorName.specialisationid,
              doctorID: this.formGroup.value.doctorName.value,
            },
          });
        }
        this.data = [...this.service.consultationItems];
        this.apiProcessing = false;
        this.formGroup.reset();
        console.log(this.service.consultationItems);
      });
  }

  rowRwmove($event: any) {
    this.service.removeFromBill(
      this.service.consultationItems[$event.index]
    );
    this.service.consultationItems.splice($event.index, 1);
    this.service.consultationItems =
      this.service.consultationItems.map((item: any, index: number) => {
        item["sno"] = index + 1;
        return item;
      });
    this.data = [...this.service.consultationItems];
    this.service.calculateTotalAmount();
  }

  update(priorityId = 57, sno = 0, doctorId: number) {
    this.http
      .get(
        BillingApiConstants.getPrice(
          priorityId,
          doctorId,
          25,
          this.cookie.get("HSPLocationId")
        )
      )
      .subscribe((res: any) => {
        if (sno > 0) {
          const index = this.service.consultationItems.findIndex(
            (c: any) => c.sno == sno
          );
          this.service.consultationItems[index].price = res.amount.toFixed(2);
          this.service.consultationItems[index].type = priorityId;
          this.service.billItems[0].price = res.amount.toFixed(2);
          this.service.billItems[0].priority = priorityId;
          this.service.billItems[0].totalAmount = res.amount.toFixed(2);
          this.service.billItems[0].type = this.consultationTypes.filter((res: any) => { return res.id == priorityId})[0].name,
          this.data = [...this.service.consultationItems];
        }

        this.data = [...this.service.consultationItems];
        this.service.calculateTotalAmount();
      });
  }

  goToBill() {
    this.router.navigate(["/out-patient-billing/post-discharge-follow-up-billing/bill"], {
      queryParamsHandling: "merge",
      relativeTo: this.route,
    });
  }
}
