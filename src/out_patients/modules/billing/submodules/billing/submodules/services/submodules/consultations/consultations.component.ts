import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { HttpService } from "@shared/services/http.service";
import { BillingApiConstants } from "../../../../BillingApiConstant";
import { CookieService } from "@shared/services/cookie.service";
import { BillingService } from "../../../../billing.service";
import { MatDialog } from "@angular/material/dialog";
import { ConsultationWarningComponent } from "../../../../prompts/consultation-warning/consultation-warning.component";
import {
  debounceTime,
  tap,
  switchMap,
  finalize,
  distinctUntilChanged,
  filter,
  takeUntil,
} from "rxjs/operators";
import { of, Subject } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { DmgPopupComponent } from "../../../../prompts/dmg-popup/dmg-popup.component";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";
import { TwiceConsultationReasonComponent } from "../../../../prompts/twice-consultation-reason/twice-consultation-reason.component";
@Component({
  selector: "out-patients-consultations",
  templateUrl: "./consultations.component.html",
  styleUrls: ["./consultations.component.scss"],
})
export class ConsultationsComponent implements OnInit, AfterViewInit {
  private readonly _destroying$ = new Subject<void>();
  formData = {
    title: "",
    type: "object",
    properties: {
      specialization: {
        type: "autocomplete",
        required: false,
        placeholder: "--Select--",
      },
      doctorName: {
        type: "autocomplete",
        required: true,
        placeholder: "--Select--",
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
    dateformat: "dd/MM/yyyy",
    selectBox: false,
    removeRow: true,
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
        type: "currency",
        style: {
          width: "10%",
        },
      },
    },
  };

  consultationTypes = [];

  locationId = Number(this.cookie.get("HSPLocationId"));

  excludeClinicsLocations = [67, 69];
  userSelectedDMG = 0;

  constructor(
    private formService: QuestionControlService,
    private http: HttpService,
    private cookie: CookieService,
    public billingService: BillingService,
    private matDialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private messageDialogService: MessageDialogService
  ) {}

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.formData.properties,
      {}
    );
    this.formGroup = formResult.form;
    this.questions = formResult.questions;
    this.getSpecialization();
    this.data = this.billingService.consultationItems;
    this.http.get(BillingApiConstants.consultationTypes).subscribe((res) => {
      this.consultationTypes = res;
      this.config.columnsInfo.type.options = res.map((r: any) => {
        return { title: r.name, value: r.id };
      });
    });
    this.billingService.clearAllItems.subscribe((clearItems) => {
      if (clearItems) {
        this.data = [];
      }
    });
    //this.showDmgPopup();
    this.billingService.consultationItemsAdded.subscribe((added: boolean) => {
      if (added) {
        this.data = [...this.billingService.consultationItems];
        this.billingService.calculateTotalAmount();
      }
    });
  }

  rowRwmove($event: any) {
    this.billingService.removeFromBill(
      this.billingService.consultationItems[$event.index]
    );
    this.billingService.consultationItems.splice($event.index, 1);
    this.billingService.consultationItems =
      this.billingService.consultationItems.map((item: any, index: number) => {
        item["sno"] = index + 1;
        return item;
      });
    this.data = [...this.billingService.consultationItems];
    this.billingService.calculateTotalAmount();
  }

  showDmgPopup() {
    this.matDialog.open(DmgPopupComponent, {
      data: {},
      width: "60%",
    });
  }

  ngAfterViewInit(): void {
    this.tableRows.selection.changed.subscribe((res: any) => {
      const source = res.added[0] || res.removed[0];
      this.update(source.type, source.sno, source.doctorId);
    });
    this.questions[1].elementRef.addEventListener("keypress", (event: any) => {
      if (event.key == "Enter") {
        if (this.formGroup.valid) {
          this.add();
        }
      }
    });
    if (this.billingService.activeMaxId) {
      this.questions[1].elementRef.focus();
    }
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
          const index = this.billingService.consultationItems.findIndex(
            (c: any) => c.sno == sno
          );
          this.billingService.consultationItems[index].price = res.amount;
          this.billingService.consultationItems[index].type = priorityId;
          this.data = [...this.billingService.consultationItems];
        }

        this.data = [...this.billingService.consultationItems];
        this.billingService.calculateTotalAmount();
      });
  }

  //Twice consultation popup
  async checkTwiceConsultation(priorityId = 57) {
    const twiceConsultationWarningDialog = this.messageDialogService.confirm(
      "",
      "You can not bill the same doctor consultation on the same date of this patient. Still do you want to continue ?"
    );
    const twiceConsultationWarningResult = await twiceConsultationWarningDialog
      .afterClosed()
      .toPromise();
    if (
      twiceConsultationWarningResult &&
      twiceConsultationWarningResult.type == "yes"
    ) {
      const twiceConsultationReasonRef = this.matDialog.open(
        TwiceConsultationReasonComponent,
        {
          width: "28vw",
          // height: "45vh",
          data: {
            title: "",
            form: {
              title: "",
              type: "object",
              properties: {
                twiceConsultationReason: {
                  type: "textarea",
                  //title: "HWC Remarks",
                  required: true,
                  pattern: "^S*$",
                },
              },
            },
            layout: "single",
            buttonLabel: "Save",
          },
        }
      );
      twiceConsultationReasonRef
        .afterClosed()
        .pipe(takeUntil(this._destroying$))
        .subscribe((result) => {
          console.log(result);
          if (result) {
            if (result.data) {
              //need to add result into makebill payload
              this.billingService.twiceConsultationReason =
                result.data.twiceConsultationReason;

              //need to call DMG popup then only getcalculateopbill

              this.getCalculateOpBill(priorityId);
            } else {
              return;
            }
          } else {
            return;
          }
          console.log("twice consultation Reason dialog was closed");
        });
    } else {
      return;
    }
  }

  //api call to check whether patient had consultation with same doscotr on same date or not
  //api call returns number 0 or 1 if 1 then twice consultation reason is mandatory
  //and only after adding reason user can add consultation with type as Followup
  checkFollowupConsultation(priorityId = 57) {
    if (this.billingService.activeMaxId) {
      console.log(
        this.billingService.activeMaxId.iacode +
          this.billingService.activeMaxId.regNumber
      );
      console.log(this.formGroup.value);
      this.http
        .get(
          BillingApiConstants.getFollowupConsultation(
            this.billingService.activeMaxId.iacode,
            this.billingService.activeMaxId.regNumber,
            this.formGroup.value.doctorName.specialisationid,
            this.formGroup.value.doctorName.value,
            Number(this.cookie.get("HSPLocationId"))
          )
        )
        .subscribe((res: any) => {
          //
          if (res == 1) {
            this.checkTwiceConsultation(priorityId);
          } else {
            //need to call DMG popup then only getcalculateopbill
            this.checkOpGropupDoctor();
            this.getCalculateOpBill(priorityId);
          }
        });
    }
  }

  async add(priorityId = 57) {
    if (this.billingService.consultationItems.length == 1) {
      this.matDialog.open(ConsultationWarningComponent, {
        width: "30vw",
        data: {},
      });
      return;
    }
    this.checkFollowupConsultation(priorityId);
  }

  //API call for group doctor Check
  async checkOpGropupDoctor() {
    let dsGroupDoc = await this.http
      .get(
        BillingApiConstants.checkopgroupdoctor(
          this.formGroup.value.doctorName.value,
          this.locationId
        )
      )
      .toPromise();

    let dsGroupDocprevious = await this.http
      .get(
        BillingApiConstants.getlastgrpdocselected(
          this.billingService.activeMaxId.regNumber,
          this.billingService.activeMaxId.iacode,
          this.locationId,
          this.formGroup.value.doctorName.value
        )
      )
      .toPromise();

    if (dsGroupDoc) {
      if (
        dsGroupDoc.isOPGroupDoctor[0].isOPGroupDoctor == 1 &&
        this.userSelectedDMG == 0
      ) {
        const DMGInforef = this.messageDialogService.info(
          "Please select organ (DMG)"
        );
        await DMGInforef.afterClosed().toPromise();
        if (dsGroupDoc.dtGrpDoc.length > 0) {
          ///
        }
      } else {
        ///
      }
    }
  }

  getCalculateOpBill(priorityId = 57) {
    this.http
      .post(BillingApiConstants.getcalculateopbill, {
        compId: this.billingService.company,
        priority: priorityId,
        itemId: this.formGroup.value.doctorName.value,
        serviceId: 25,
        locationId: this.cookie.get("HSPLocationId"),
        ipoptype: 1,
        bedType: 0,
        bundleId: 0,
      })
      .subscribe((res: any) => {
        if (res.length > 0) {
          this.billingService.addToConsultation({
            sno: this.data.length + 1,
            doctorName: this.formGroup.value.doctorName.originalTitle,
            doctorId: this.formGroup.value.doctorName.value,
            type: priorityId,
            scheduleSlot: "",
            bookingDate: "",
            price: res[0].returnOutPut,
            specialization: this.formGroup.value.doctorName.specialisationid,
            clinics: this.formGroup.value.clinics
              ? this.formGroup.value.clinics.value
              : 0,
            billItem: {
              itemId: this.formGroup.value.doctorName.value,
              priority: priorityId,
              serviceId: 25,
              price: res[0].returnOutPut,
              serviceName: "Consultation Charges",
              itemName: this.formGroup.value.doctorName.originalTitle,
              qty: 1,
              precaution: "",
              procedureDoctor: "",
              credit: 0,
              cash: 0,
              disc: 0,
              discAmount: 0,
              totalAmount: res[0].returnOutPut,
              gst: 0,
              gstValue: 0,
              specialisationID:
                this.formGroup.value.doctorName.specialisationid,
              doctorID: this.formGroup.value.doctorName.value,
            },
          });
        }
        this.data = [...this.billingService.consultationItems];
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
