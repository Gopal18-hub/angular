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
import { DmgOthergrpDocPopupComponent } from "@modules/billing/submodules/billing/prompts/dmg-othergrp-doc-popup/dmg-othergrp-doc-popup.component";
import { VisitHistoryComponent } from "@shared/modules/visit-history/visit-history.component";
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

  excludeClinicsLocations = [67, 69, 20];
  userSelectedDMG = 0;
  //GAV_1193
  autoVisitHistoryPopupLocations = [69, 8];
  //GAV_1193
  visitHistoryConsultTypeLocations: any = { 69: "", 8: "Follow up" };

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
    this.http
      .get(BillingApiConstants.consultationTypes)
      .subscribe((res: any) => {
        this.consultationTypes = res;
        this.config.columnsInfo.type.options = res.map((r: any) => {
          return { title: r.name, value: r.id };
        });
      });
    this.billingService.clearAllItems.subscribe((clearItems: any) => {
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
    this.billingService.makeBillPayload.ds_insert_bill.tab_o_opdoctorList.splice(
      $event.index,
      1
    );
    this.billingService.makeBillPayload.ds_insert_bill.tab_d_opdoctorList.splice(
      $event.index,
      1
    );
    this.billingService.consultationItems =
      this.billingService.consultationItems.map((item: any, index: number) => {
        item["sno"] = index + 1;
        return item;
      });
    this.billingService.makeBillPayload.dtCheckedItem = [];
    this.billingService.makeBillPayload.dtFinalGrpDoc = {};
    this.billingService.makeBillPayload.txtOtherGroupDoc = "";
    this.billingService.dtCheckedItem = [];
    this.billingService.dtFinalGrpDoc = {};
    this.billingService.txtOtherGroupDoc = "";
    this.data = [...this.billingService.consultationItems];
    this.userSelectedDMG = 0;
    this.billingService.calculateTotalAmount();
    console.log(this.billingService.makeBillPayload);
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
    this.tableRows.controlValueChangeTrigger.subscribe((res: any) => {
      if (res.data.col == "type") {
        this.update(
          res.data.element.type,
          res.data.element.sno,
          res.data.element.doctorId
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
    if (this.billingService.activeMaxId) {
      this.questions[1].elementRef.focus();
    }
    this.formGroup.controls["doctorName"].valueChanges
      .pipe(
        filter((res: any) => {
          return res !== null && res.length >= 3;
        }),
        distinctUntilChanged(),
        debounceTime(1000),
        tap(() => {}),
        switchMap((value: any) => {
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
        .subscribe((res: any) => {
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
      this.http
        .get(BillingApiConstants.getspecialization)
        .subscribe((res: any) => {
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
      .subscribe((res: any) => {
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
          //#region GAV-1054
          this.billingService.consultationItems[index].billItem.price =
            res.amount;
          this.billingService.consultationItems[index].billItem.totalAmount =
            res.amount +
            this.billingService.consultationItems[index].billItem.gstValue;

          let consultType: any = this.consultationTypes.filter(
            (c: any) => c.id === priorityId
          );
          if (consultType && consultType.length > 0) {
            this.billingService.consultationItems[index].billItem.qty =
              consultType[0].name;
          }
          //#endregion GAV-1054
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
        .subscribe(async (result: any) => {
          console.log(result);
          if (result) {
            if (result.data) {
              //need to add result into makebill payload
              this.billingService.twiceConsultationReason =
                result.data.twiceConsultationReason;

              //need to call DMG popup then only getcalculateopbill
              const res = await this.checkOpGropupDoctor();
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
        .subscribe(async (res: any) => {
          //
          if (res == 1) {
            this.checkTwiceConsultation(priorityId);
          } else {
            //need to call DMG popup then only getcalculateopbill
            await this.checkOpGropupDoctor();
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
    let result;
    console.log(this.formGroup.value);
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
    console.log(dsGroupDoc);
    if (dsGroupDoc.dtGrpDoc.length > 0) {
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
          await this.FillOPGroupDoctor(dsGroupDoc, dsGroupDocprevious);
        }
      } else {
        ///
        await this.FillOPGroupDoctor(dsGroupDoc, dsGroupDocprevious);
      }
    }
  }
  async FillOPGroupDoctor(dsGroupDoc: any, dsGroupDocprevious: any) {
    var x = 0;
    var OtherGroupDoc;
    var dmgdata: any[] = [];
    console.log(dsGroupDoc, dsGroupDocprevious);
    if (dsGroupDocprevious.dtGrpDocpre.length > 0) {
      this.userSelectedDMG = dsGroupDocprevious.dtGrpDocpre[0].dmg;
    }
    dsGroupDoc.dtGrpDoc.forEach((i: any) => {
      var Odmgdata: any = {};
      var list = [];
      list = dsGroupDocprevious.dtGrpDocpre.filter((j: any) => {
        return j.dmg == i.docID;
      });
      if (list.length > 0) {
        Odmgdata.id = 1;
        if (i.docID == 25907) {
          x = 1;
          OtherGroupDoc = dsGroupDocprevious.dtGrpDocpre[0].OtherGroupDocRemark;
        }
      } else {
        Odmgdata.id = 0;
      }
      if (this.userSelectedDMG > 0) {
        var list1 = [];
        list1 = dsGroupDoc.dtGrpDoc.filter((k: any) => {
          return k.docID == this.userSelectedDMG;
        });
        if (list1.length > 0) {
          if (i.docID == this.userSelectedDMG) {
            Odmgdata.id = 1;
          }
        } else {
          Odmgdata.id = 0;
        }
      }
      Odmgdata.docID = i.docID;
      Odmgdata.doctorName = i.doctorName;
      Odmgdata.specialization = i.specialization;
      dmgdata.push(Odmgdata);
    });
    console.log(dmgdata);
    if (x == 1) {
      const dialogref = this.matDialog.open(DmgOthergrpDocPopupComponent, {
        width: "30vw",
        height: "40vh",
        data: OtherGroupDoc,
      });
      await dialogref.afterClosed().toPromise();
    }
    var m = 0,
      count = 1;
    if (dsGroupDocprevious.dtGrpDocSpe.length == 0) {
      m = 1;
    }
    var SelectedGroupDoc: any[] = [];
    dsGroupDocprevious.dtGrpDocSpec.forEach((i: any) => {
      var OSelectedGroupDoc: any = {};
      if (i.id > 0) {
        OSelectedGroupDoc.chk = true;
        OSelectedGroupDoc.id = i.id;
        OSelectedGroupDoc.name = i.name;
        OSelectedGroupDoc.dmgid = i.dmgid;
        OSelectedGroupDoc.seq = count;
        OSelectedGroupDoc.counter = i.counter;
        OSelectedGroupDoc.specialisationId = i.specialisationId;
        OSelectedGroupDoc.shortSpec = i.shortSpec;
        OSelectedGroupDoc.active = i.active;
        SelectedGroupDoc.push(OSelectedGroupDoc);
      }
      count++;
    });
    if (dmgdata.length > 0) {
      console.log(this.formGroup.value);
      const dialogref = this.matDialog.open(DmgPopupComponent, {
        width: "70vw",
        height: "80vh",
        data: {
          dmgdata: dmgdata,
          selectedgrpdoc: SelectedGroupDoc,
          specialization: this.formGroup.value.doctorName.specialisationid,
          unitdocid: this.formGroup.value.doctorName.value,
          reason: OtherGroupDoc ? OtherGroupDoc : "",
        },
      });
      await dialogref.afterClosed().toPromise();
    }
  }
  async getCalculateOpBill(
    priorityId = 57,
    consultationtype = "Consultation – CPT 99202"
  ) {
    let consultType: any = {};
    let onlinePaidAppoinment = this.billingService.PaidAppointments
      ? this.billingService.PaidAppointments.paymentstatus == "Yes"
        ? true
        : false
      : false;
    if (!this.billingService.selectedOtherPlan && !onlinePaidAppoinment) {
      consultType = await this.http
        .get(
          BillingApiConstants.getDoctorConsultType(
            Number(this.cookie.get("HSPLocationId")),
            this.formGroup.value.doctorName.value,
            this.billingService.activeMaxId.iacode,
            this.billingService.activeMaxId.regNumber
          )
        )
        .toPromise();
      if (consultType) {
        priorityId = consultType[0].consultId;
        consultationtype = consultType[0].strConsult;
      }
    }
    /////GAV-1193
    if (
      this.autoVisitHistoryPopupLocations.includes(
        Number(this.cookie.get("HSPLocationId"))
      )
    ) {
      if (
        consultType[0].strConsult.includes(
          this.visitHistoryConsultTypeLocations[
            Number(this.cookie.get("HSPLocationId"))
          ]
        ) ||
        (Number(this.cookie.get("HSPLocationId")) == 69 &&
          !this.visitHistoryConsultTypeLocations[69])
      ) {
        this.billingService.visitHistory();
      }
    }

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
              qty: consultationtype,
              precaution: "",
              procedureDoctor: "",
              credit: 0,
              cash: 0,
              disc: 0,
              discAmount: 0,
              totalAmount: res[0].returnOutPut + res[0].totaltaX_Value,
              gst: +res[0].totaltaX_RATE,
              gstValue: res[0].totaltaX_Value,
              specialisationID:
                this.formGroup.value.doctorName.specialisationid,
              doctorID: this.formGroup.value.doctorName.value,
            },
            gstDetail: {
              gsT_value: res[0].totaltaX_Value,
              gsT_percent: res[0].totaltaX_RATE,
              cgsT_Value: res[0].cgsT_Value,
              cgsT_Percent: res[0].cgst,
              sgsT_value: res[0].sgsT_Value,
              sgsT_percent: res[0].sgst,
              utgsT_value: res[0].utgsT_Value,
              utgsT_percent: res[0].utgst,
              igsT_Value: res[0].igsT_Value,
              igsT_percent: res[0].igst,
              cesS_value: res[0].cesS_Value,
              cesS_percent: res[0].cess,
              taxratE1_Value: res[0].taxratE1_Value,
              taxratE1_Percent: res[0].taxratE1,
              taxratE2_Value: res[0].taxratE2_Value,
              taxratE2_Percent: res[0].taxratE2,
              taxratE3_Value: res[0].taxratE3_Value,
              taxratE3_Percent: res[0].taxratE3,
              taxratE4_Value: res[0].taxratE4_Value,
              taxratE4_Percent: res[0].taxratE4,
              taxratE5_Value: res[0].taxratE5_Value,
              taxratE5_Percent: res[0].taxratE5,
              totaltaX_RATE: res[0].totaltaX_RATE,
              totaltaX_RATE_VALUE: res[0].totaltaX_Value,
              saccode: res[0].saccode,
              taxgrpid: res[0].taxgrpid,
              codeId: res[0].codeId,
            },
            gstCode: {
              tax: res[0].tax,
              taxType: res[0].taxType,
              codeId: res[0].codeId,
              code: res[0].code,
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
