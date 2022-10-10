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

@Component({
  selector: "out-patients-investigations",
  templateUrl: "./investigations.component.html",
  styleUrls: ["./investigations.component.scss"],
})
export class OderInvestigationsComponent implements OnInit {
  formGroup!: FormGroup;
  questions: any;
  investigationList: any = [];
  reqItemDetail: string = "";
  variable = true;
  saveResponsedata: any;
  data: any = [];
  flag = 0;
  list: any = [];
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
  private readonly _destroying$ = new Subject<void>();

  constructor(
    private formService: QuestionControlService,
    private http: HttpService,
    private cookie: CookieService,
    public billingService: BillingService,
    public messageDialogService: MessageDialogService,
    private router: Router,
    private route: ActivatedRoute,
    private opOrderRequestService: OpOrderRequestService
  ) {}

  ngOnInit(): void {
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
    this.getServiceTypes();
    this.getSpecialization();
    this.opOrderRequestService.clearAllItems.subscribe((clearItems) => {
      console.log(clearItems);
      if (clearItems) {
        this.data = [];
      }
    });
    console.log(this.opOrderRequestService.patientDemographicdata);
  }

  rowRwmove($event: any) {
    console.log($event);
    this.opOrderRequestService.investigationItems.splice($event.index, 1);
    this.opOrderRequestService.investigationItems =
      this.opOrderRequestService.investigationItems.map(
        (item: any, index: number) => {
          item["sno"] = index + 1;
          return item;
        }
      );
    this.data = [...this.opOrderRequestService.investigationItems];
    //  this.billingService.calculateTotalAmount();
  }

  ngAfterViewInit(): void {
    this.tableRows.controlValueChangeTrigger.subscribe((res: any) => {
      console.log(res);
      if (res.data.col == "specialisation") {
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
      } else if (res.data.col == "priority") {
        this.opOrderRequestService.investigationItems[res.data.index].priority =
          res.$event.value;
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
              ngStyle: {
                color: r.outsourceColor == 2 ? "red" : "",
              },
            };
          });
          this.questions[1] = { ...this.questions[1] };
          console.log(this.questions[1]);
          console.log(this.formGroup.value.investigation.docRequired);
          console.log(this.formGroup.controls["investigation"].value);
        }
      });
    this.formGroup.controls["serviceType"].valueChanges.subscribe(
      (val: any) => {
        if (val) {
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

  getdoctorlistonSpecializationClinic(
    clinicSpecializationId: number,
    index: number
  ) {
    this.http
      .get(
        BillingApiConstants.getdoctorlistonSpecializationClinic(
          false,
          clinicSpecializationId,
          // 67
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
            // ngStyle: {
            //   color:
            //     r.outsourceTest == 1
            //       ? "red"
            //       : "" || r.isNonDiscountItem == 1
            //       ? "pink"
            //       : "",
            // },
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
      const dialofref = this.messageDialogService.info(
        "Please refer to the prescription, in case of diagnosed/provisional/follow up Dengue, select the right CBC"
      );
      dialofref.afterClosed().subscribe((data) => {
        this.genderCheck();
      });
    } else {
      this.genderCheck();
    }

    console.log(this.opOrderRequestService.patientDemographicdata);
    //this.formGroup.reset();
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
            "2"
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
    }
  }

  addrow() {
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
          priority: 1,
          specialisation: "",
          doctorName: "",
          specialisationId: 0,
          doctorId: 0,
          price: res.amount,
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
        });
        console.log(this.opOrderRequestService.investigationItems);
        this.data = [...this.opOrderRequestService.investigationItems];
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
    if (this.data.length > 0) {
      this.http
        .post(
          BillingApiConstants.SaveDeleteOpOrderRequest,
          this.getSaveDeleteObject(1)
        )
        .pipe(takeUntil(this._destroying$))
        .subscribe((data) => {
          console.log(data);
          this.saveResponsedata = data;
          console.log(this.saveResponsedata.success);
          if (this.saveResponsedata.success == true) {
            this.messageDialogService.success("Saved Successfully");
            this.data = [];
            this.opOrderRequestService.investigationItems = [];
            this.formGroup.reset();
            this.config.columnsInfo.doctorName.moreOptions = {};
          }
        });
    }
  }
  view() {
    this.opOrderRequestService.setActiveLink(true);
    this.router.navigate([
      "/out-patient-billing/op-order-request/view-request",
    ]);
    // this.router.navigate(
    //   ["/out-patient-billing/op-order-request/view-request"],
    //   {
    //     queryParamsHandling: "merge",
    //     relativeTo: this.route,
    //   }
    // );
  }
}
