import { ThisReceiver } from "@angular/compiler";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { BillingService } from "@modules/billing/submodules/billing/billing.service";
import { BillingApiConstants } from "@modules/billing/submodules/billing/BillingApiConstant";
import { CookieService } from "@shared/services/cookie.service";
import { HttpService } from "@shared/services/http.service";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";
import { SaveandDeleteOpOrderRequest } from "../../../../../../../../core/models/saveanddeleteoporder.Model";
import { ActivatedRoute, Router } from "@angular/router";
import {
  filter,
  distinctUntilChanged,
  debounceTime,
  tap,
  switchMap,
  of,
  finalize,
  pipe,
  takeUntil,
  Subject,
  iif,
} from "rxjs";
import { BillingStaticConstants } from "../../../../../billing/BillingStaticConstant";
import { OpOrderRequestService } from "../../../../../op-order-request/op-order-request.service";
import { SpecializationService } from "@modules/billing/submodules/billing/specialization.service";

@Component({
  selector: "out-patients-investigations",
  templateUrl: "./investigations.component.html",
  styleUrls: ["./investigations.component.scss"],
})
export class OderInvestigationsComponent implements OnInit {
  formGroup!: FormGroup;
  questions: any;
  investigationList: any = [];
  invReferenceList: any = [];
  reqItemDetail: string = "";
  variable = true;
  saveResponsedata: any;
  data: any = [];
  flag = 0;
  list: any = [];
  defaultPriorityId = 1;
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
        // options: this.investigationList,
      },
    },
  };

  @ViewChild("table") tableRows: any;

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
        disabledSort: "true",
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
        type: "number",
      },
    },
  };
  hspLocationid: any = Number(this.cookie.get("HSPLocationId"));
  serviceInvestigatationresponse: any;
  outsource!: boolean;
  precautionExcludeLocations = [69];
  private readonly _destroying$ = new Subject<void>();

  constructor(
    private formService: QuestionControlService,
    private http: HttpService,
    private cookie: CookieService,
    public billingService: BillingService,
    public messageDialogService: MessageDialogService,
    private router: Router,
    private route: ActivatedRoute,
    public opOrderRequestService: OpOrderRequestService,
    private specializationService: SpecializationService,
  ) {}

  ngOnInit(): void {
    this.opOrderRequestService.onServiceTab(true);
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
    this.opOrderRequestService.setInvestigationFormGroup(
      this.formGroup,
      this.questions
    );
    this.data = this.opOrderRequestService.investigationItems;
    this.data.forEach((item: any, index: number) => {
      this.config.columnsInfo.doctorName.moreOptions[index] =
        this.getdoctorlistonSpecializationClinic(item.specialisation, index);
    });
    this.getServiceTypes();
    this.getSpecialization();
    this.opOrderRequestService.clearAllItems.subscribe((clearItems) => {
      console.log(clearItems);
      if (clearItems) {
        this.data = [];
      }
    });
    this.opOrderRequestService.disableSaveButtonStatus.subscribe(
      (value: boolean) => {
        if (value) {
        }
      }
    );
    console.log(this.opOrderRequestService.patientDemographicdata);
  }

  rowRwmove($event: any) {
    console.log($event);
    this.opOrderRequestService.investigationItems.splice($event.index, 1);
    this.config.columnsInfo.doctorName.moreOptions[$event.index] = {};
    this.opOrderRequestService.investigationItems =
      this.opOrderRequestService.investigationItems.map(
        (item: any, index: number) => {
          item["sno"] = index + 1;
          return item;
        }
      );
    if (this.data.length == 0) {
      this.defaultPriorityId = 1;
    }

    this.data = [...this.opOrderRequestService.investigationItems];
    this.opOrderRequestService.calculateTotalAmount();
    this.opOrderRequestService.docRequiredStatusvalue();
  }

  ngAfterViewInit(): void {
    this.tableRows.controlValueChangeTrigger.subscribe(async (res: any) => {
      console.log(res);
      console.log(this.tableRows);
      if (res.data.col == "specialisation") {
        console.log(this.tableRows);
        res.data.element["doctorName"] = "";
        this.opOrderRequestService.investigationItems[
          res.data.index
        ].doctorId = 0;
        this.opOrderRequestService.docRequiredStatusvalue();
        this.opOrderRequestService.investigationItems[
          res.data.index
        ].specialisationId = res.$event.value;
        console.log(this.config.columnsInfo.specialisation.value);
        this.getdoctorlistonSpecializationClinic(
          res.$event.value,
          res.data.index
        );
      } else if (res.data.col == "doctorName") {
        this.opOrderRequestService.investigationItems[res.data.index].doctorId =
          res.$event.value;
        console.log(this.config.columnsInfo.doctorName.value);
        this.opOrderRequestService.docRequiredStatusvalue();
        //this.opOrderRequestService.docRequiredStatusvalue();
        console.log(
          this.opOrderRequestService.getSaveButtonondocrequiredStatus()
        );
      } else if (res.data.col == "priority") {
        if (this.data.length == 1) {
          this.defaultPriorityId = res.$event.value;
        } else {
          if (this.defaultPriorityId != res.$event.value) {
            this.opOrderRequestService.saveOnPriority(true);
            this.opOrderRequestService.docRequiredStatusvalue();
            const errorDialog = this.messageDialogService.error(
              "Investigations can not have different priorities"
            );
            await errorDialog.afterClosed().toPromise();
          } else {
            this.opOrderRequestService.investigationItems[
              res.data.index
            ].priority = res.$event.value;
            this.opOrderRequestService.saveOnPriority(false);
          }
        }
        console.log(this.opOrderRequestService.getSaveButtononPriority());
      }
    });
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
    this.formGroup.controls["investigation"].valueChanges
      .pipe(
        filter((res) => {
          if (res == null) {
            if (this.invReferenceList.length > 0) {
              // this.formGroup.controls["investigation"].reset();
              console.log("inside reference list loop");
              console.log(this.invReferenceList);
              this.questions[1].options = this.invReferenceList.map(
                (a: any) => {
                  return {
                    title: a.name,
                    value: a.id,
                    serviceid: a.serviceid,
                    originalTitle: a.name,
                    docRequired: a.docRequired,
                    precaution: a.precaution,
                    patient_Instructions: a.patient_Instructions,
                    item_Instructions:
                      BillingStaticConstants.investigationItemBasedInstructions[
                        a.id.toString()
                      ],
                    ngStyle: {
                      color: a.outsourceColor == 2 ? "red" : "",
                    },
                  };
                }
              );
              this.questions[1] = { ...this.questions[1] };
            } else {
            }
          }
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
            console.log(value);
            return this.http
              .get(
                BillingApiConstants.getinvestigationSearch(
                  // 67,
                  Number(this.cookie.get("HSPLocationId")),
                  value
                )
              )
              .pipe(finalize(() => {}));
          }
        })
      )
      .subscribe((data: any) => {
        console.log(data);
        if (data.length > 0) {
          this.questions[1].options = data.map((r: any) => {
            return {
              title: r.testNameWithService || r.name,
              value: r.id,
              serviceid: r.serviceid,
              originalTitle: r.name,
              docRequired: r.docRequired,
              precaution: r.precaution,
              patient_Instructions: r.patient_Instructions,
              item_Instructions:
                BillingStaticConstants.investigationItemBasedInstructions[
                  r.id.toString()
                ],
              ngStyle: {
                color: r.outsourceColor == 2 ? "red" : "",
              },
            };
          });
          this.questions[1] = { ...this.questions[1] };
          console.log(this.questions[1]);
          //  console.log(this.formGroup.value.investigation.docRequired);
          console.log(this.formGroup.controls["investigation"].value);
        }
      });
    this.formGroup.controls["serviceType"].valueChanges.subscribe(
      (val: any) => {
        console.log(val);
        if (val) {
          this.formGroup.controls["investigation"].reset();
          this.getInvestigations(val);
        }
      }
    );
  }

  getSpecialization() {
    this.http
      .get(BillingApiConstants.getInvetigationPriorities)
      .subscribe((res) => {
        this.config.columnsInfo.priority.options = res.map((r: any) => {
          return { title: r.name, value: r.id };
        });
      });
    this.http.get(BillingApiConstants.getspecialization).subscribe((res) => {
      this.config.columnsInfo.specialisation.options = res.map((r: any) => {
        return { title: r.name, value: r.id };
      });
    });
  }

  async getdoctorlistonSpecializationClinic(
    clinicSpecializationId: number,
    index: number
  ) {
    // this.http
    //   .get(
    //     BillingApiConstants.getdoctorlistonSpecializationClinic(
    //       false,
    //       clinicSpecializationId,
    //       // 67
    //       Number(this.cookie.get("HSPLocationId"))
    //     )
    //   )
    //   .subscribe((res) => {
    //     let options = res.map((r: any) => {
    //       return { title: r.doctorName, value: r.doctorId };
    //     });
    //     this.config.columnsInfo.doctorName.moreOptions[index] = options;
    //   });
      this.config.columnsInfo.doctorName.moreOptions[index] =
      await this.specializationService.getDoctorsOnSpecialization(
        clinicSpecializationId
      );
  }

  getServiceTypes() {
    this.http
      .get(BillingApiConstants.getinvestigationservice)
      .subscribe((res) => {
        console.log(res);
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
      .subscribe((res) => {
        console.log(res);
        this.investigationList = res;
        this.invReferenceList = res;
        this.formGroup.controls["investigation"].reset();
        this.questions[1].options = this.investigationList.map((r: any) => {
          return {
            title: r.testNameWithService || r.name,
            value: r.id,
            originalTitle: r.name,
            serviceid: r.serviceid,
            precaution: r.precaution,
            docRequired: r.docRequired,
            patient_Instructions: r.patient_Instructions,
            item_Instructions:
              BillingStaticConstants.investigationItemBasedInstructions[
                r.id.toString()
              ],
            ngStyle: {
              color: r.outsourceColor == 2 ? "red" : "",
            },
          };
        });
        console.log(this.questions[1].options);
        console.log(this.questions[1]);
        this.questions[1] = { ...this.questions[1] };
      });
  }

  add(priorityId = 1) {
    this.flag = 0;
    console.log(this.hspLocationid);
    let exist = this.opOrderRequestService.investigationItems.findIndex(
      (item: any) => {
        return item.itemid == this.formGroup.value.investigation.value;
      }
    );
    if (exist > -1) {
      this.messageDialogService.error(
        "Investigation already added to the service list"
      );
      return;
    }

    if (this.formGroup.value.investigation.value == 6085) {
      this.messageDialogService.info(
        "Please refer to the prescription, in case of diagnosed/provisional/follow up Dengue, select the right CBC"
      );
      this.genderCheck();
    } else {
      this.genderCheck();
    }
    console.log(this.opOrderRequestService.patientDemographicdata);
  }
  genderCheck() {
    if (
      this.formGroup.value.investigation.value != undefined &&
      this.formGroup.value.investigation.serviceid != undefined
    ) {
      this.http
        .get(
          BillingApiConstants.checkPatientSex(
            this.formGroup.value.investigation.value,
            this.opOrderRequestService.patientDemographicdata.gender,
            this.formGroup.value.investigation.serviceid,
            "1"
          )
        )
        .pipe(takeUntil(this._destroying$))
        .subscribe((response) => {
          console.log(response);
          if (response == 1) {
            this.flag++;
            if (this.flag == 1) {
              this.addrow();
            }
            console.log(this.flag);
          } else {
            this.messageDialogService.info(
              "This investigation is not allowed for this sex"
            );
            this.formGroup.reset();
          }
        });
    } else {
      this.messageDialogService.info("Please Select Investigation");
      this.formGroup.reset();
    }
  }

  addrow() {
    const priorityid = this.defaultPriorityId;
    this.http
      .get(
        BillingApiConstants.getPrice(
          1, //priority id
          this.formGroup.value.investigation.value,
          this.formGroup.value.serviceType ||
            this.formGroup.value.investigation.serviceid,
          this.cookie.get("HSPLocationId")
          // "67"
        )
      )
      .subscribe((res: any) => {
        console.log(res);
        this.serviceInvestigatationresponse = res;
        console.log(this.formGroup.value.investigation.docRequired);

        this.opOrderRequestService.addToInvestigations({
          sno: this.data.length + 1,
          investigations: this.formGroup.value.investigation.title,
          //precaution: this.formGroup.value.investigation.precaution,
          precaution:
            this.formGroup.value.investigation.precaution == "P"
              ? '<span class="max-health-red-color">P</span>'
              : this.formGroup.value.investigation.precaution,
          priority: this.defaultPriorityId,
          specialisation: "",
          doctorName: "",
          specialisationId: 0,
          doctorId: 0,
          price: res.amount.toFixed(2),
          serviceid:
            this.formGroup.value.serviceType ||
            this.formGroup.value.investigation.serviceid,
          itemid: this.formGroup.value.investigation.value,
          doctorName_required: this.formGroup.value.investigation.docRequired
            ? true
            : false,
          specialisation_required: this.formGroup.value.investigation
            .docRequired
            ? true
            : false,
          patient_Instructions:
            this.formGroup.value.investigation.patient_Instructions,
          billItem: {
            patient_Instructions:
              this.formGroup.value.investigation.patient_Instructions,
            precaution:
              this.formGroup.value.investigation.precaution == "P"
                ? '<span class="max-health-red-color">P</span>'
                : this.formGroup.value.investigation.precaution,
          },
          docRequired: this.formGroup.value.investigation.docRequired,
        });

        console.log(this.opOrderRequestService.investigationItems);
        this.data = [...this.opOrderRequestService.investigationItems];
        this.opOrderRequestService.docRequiredStatusvalue();
        this.opOrderRequestService.calculateTotalAmount();
        console.log(this.data);
        this.formGroup.reset();
      });
  }

  getSaveDeleteObject(flag: any): SaveandDeleteOpOrderRequest {
    this.reqItemDetail = "";
    this.data.forEach((item: any, index: any) => {
      console.log(item.specialisation);
      if (this.reqItemDetail == "") {
        this.reqItemDetail =
          item.itemid +
          "," +
          item.serviceid +
          "," +
          item.specialisationId +
          "," +
          item.doctorId +
          "," +
          item.priority;
      } else {
        this.reqItemDetail =
          this.reqItemDetail +
          "~" +
          item.itemid +
          "," +
          item.serviceid +
          "," +
          item.specialisationId +
          "," +
          item.doctorId +
          "," +
          item.priority;
      }
    });
    if (this.opOrderRequestService.procedureItems.length > 0) {
      this.opOrderRequestService.procedureItems.forEach((item: any) => {
        if (this.reqItemDetail == "") {
          this.reqItemDetail =
            item.itemid +
            "," +
            item.serviceId +
            "," +
            item.specialisationId +
            "," +
            item.doctorId +
            "," +
            item.priorityId;
        } else {
          this.reqItemDetail =
            this.reqItemDetail +
            "~" +
            item.itemid +
            "," +
            item.serviceId +
            "," +
            item.specialisationId +
            "," +
            item.doctorId +
            "," +
            item.priorityId;
        }
      });
    }
    console.log(this.reqItemDetail);
    let maxid = this.opOrderRequestService.activeMaxId.maxId;
    let userid = Number(this.cookie.get("UserId"));
    let locationid = Number(this.cookie.get("HSPLocationId"));

    return new SaveandDeleteOpOrderRequest(
      flag,
      maxid,
      this.reqItemDetail,
      "0",
      // 60926,
      // 67
      userid,
      locationid
    );
  }

  save() {
    console.log(this.data);
    this.reqItemDetail = "";
    console.log("inside save");

    if (
      this.opOrderRequestService.procedureItems.length > 0 ||
      this.opOrderRequestService.investigationItems.length > 0
    ) {
      this.opOrderRequestService.spinner.next(true);
      // if (this.opOrderRequestService.investigationItems.length > 0)
      this.http
        .post(
          BillingApiConstants.SaveDeleteOpOrderRequest,
          this.getSaveDeleteObject(1)
        )
        .pipe(takeUntil(this._destroying$))
        .subscribe(
          (data) => {
            console.log(data);
            this.saveResponsedata = data;
            console.log(this.saveResponsedata.success);
            if (this.saveResponsedata.success == true) {
              this.messageDialogService.success("Saved Successfully");
              this.opOrderRequestService.spinner.next(false);
              this.data = [];

              this.opOrderRequestService.investigationItems = [];
              this.opOrderRequestService.calculateTotalAmount();
              this.formGroup.reset();
              this.opOrderRequestService.procedureItems = [];
              this.config.columnsInfo.doctorName.moreOptions = {};
              this.defaultPriorityId = 1;
            }
          },
          (error) => {
            this.opOrderRequestService.spinner.next(false);
          }
        );
    }
  }
  view() {
    this.opOrderRequestService.setActiveLink(true);
    this.router.navigate([
      "/out-patient-billing/op-order-request/view-request",
    ]);
  }
}
