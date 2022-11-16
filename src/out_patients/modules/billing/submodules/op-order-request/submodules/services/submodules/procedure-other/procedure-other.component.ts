import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { BillingService } from "@modules/billing/submodules/billing/billing.service";
import { BillingApiConstants } from "@modules/billing/submodules/billing/BillingApiConstant";
import { CookieService } from "@shared/services/cookie.service";
import { HttpService } from "@shared/services/http.service";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";
import { MatDialog } from "@angular/material/dialog";
import {
  filter,
  distinctUntilChanged,
  debounceTime,
  tap,
  switchMap,
  of,
  finalize,
  takeUntil,
  Subject,
} from "rxjs";
import { SaveandDeleteOpOrderRequest } from "@core/models/saveanddeleteoporder.Model";
import { Router } from "@angular/router";
import { OpOrderRequestService } from "../../../../../op-order-request/op-order-request.service";

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
      procedure: {
        type: "autocomplete",
        placeholder: "--Select--",
        required: true,
      },
    },
  };
  formGroup!: FormGroup;
  questions: any;
  flag = 0;
  reqItemDetail: string = "";
  otherserviceId = 0;
  saveResponsedata: any;
  locationid = Number(this.cookie.get("HSPLocationId"));
  private readonly _destroying$ = new Subject<void>();

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
        disabledSort: "true",
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
        type: "number",
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
    public messageDialogService: MessageDialogService,
    public dialog: MatDialog,
    private router: Router,
    public opOrderrequestService: OpOrderRequestService
  ) {}

  ngOnInit(): void {
    console.log(this.formGroup);
    let formResult: any = this.formService.createForm(
      this.formData.properties,
      {}
    );
    this.formGroup = formResult.form;
    this.questions = formResult.questions;
    this.opOrderrequestService.setProcedureFormGroup(
      this.formGroup,
      this.questions
    );
    this.data = this.opOrderrequestService.procedureItems;
    this.data.forEach((item: any, index: number) => {
      this.config.columnsInfo.doctorName.moreOptions[index] =
        this.getdoctorlistonSpecializationClinic(item.specialisation, index);
    });
    this.opOrderrequestService.onServiceTab(true);
    this.getOtherService();
    this.getSpecialization();
    this.opOrderrequestService.clearAllItems.subscribe((clearItems) => {
      if (clearItems) {
        this.data = [];
      }
    });
  }

  rowRwmove($event: any) {
    this.opOrderrequestService.procedureItems.splice($event.index, 1);
    this.config.columnsInfo.doctorName.moreOptions[$event.index] = {};
    this.opOrderrequestService.procedureItems =
      this.opOrderrequestService.procedureItems.map(
        (item: any, index: number) => {
          item["sno"] = index + 1;
          return item;
        }
      );

    this.data = [...this.opOrderrequestService.procedureItems];
    this.opOrderrequestService.calculateTotalAmount();
    this.opOrderrequestService.docRequiredStatusvalue();
  }

  ngAfterViewInit(): void {
    this.tableRows.controlValueChangeTrigger.subscribe((res: any) => {
      if (res.data.col == "specialisation") {
        this.opOrderrequestService.procedureItems[
          res.data.index
        ].specialisationId = res.$event.value;
        res.data.element["doctorName"] = "";
        this.opOrderrequestService.procedureItems[res.data.index].doctorId = 0;
        this.opOrderrequestService.docRequiredStatusvalue();
        this.getdoctorlistonSpecializationClinic(
          res.$event.value,
          res.data.index
        );
      } else if (res.data.col == "doctorName") {
        this.opOrderrequestService.procedureItems[res.data.index].doctorId =
          res.$event.value;
        console.log(this.config.columnsInfo.doctorName.value);
        this.opOrderrequestService.docRequiredStatusvalue();
      }
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
            this.formGroup.value.otherService &&
            this.formGroup.value.otherService.value
          ) {
            return of([]);
          } else {
            return this.http
              .get(
                BillingApiConstants.getotherservicebillingSearch(
                  this.locationid,
                  // Number(this.cookie.get("HSPLocationId")),
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
              serviceid: r.serviceID,
              docRequired: r.proceduredoctor,
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

  getdoctorlistonSpecializationClinic(
    clinicSpecializationId: number,
    index: number
  ) {
    this.http
      .get(
        BillingApiConstants.getdoctorlistonSpecializationClinic(
          false,
          clinicSpecializationId,
          this.locationid
          //67
          // Number(this.cookie.get("HSPLocationId"))
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
          this.getProcedures(val.value, val.isBundle);
        }
      }
    );
  }

  getProcedures(serviceId: number, isBundle = 0) {
    this.http
      .get(
        BillingApiConstants.getotherservicebilling(
          this.locationid,
          // 67,
          serviceId,
          isBundle
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
                originalTitle: r.itemName,
                docRequired: r.proceduredoctor,
                serviceid: r.serviceID,
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

  add(priorityId = 1) {
    if (
      this.formGroup.value.otherService == null ||
      this.formGroup.value.otherService == ""
    ) {
      this.otherserviceId = 0;
    } else {
      this.otherserviceId = this.formGroup.value.otherService.value;
    }
    this.flag = 0;
    let exist = this.opOrderrequestService.procedureItems.findIndex(
      (item: any) => {
        return item.itemid == this.formGroup.value.procedure.value;
      }
    );
    if (exist > -1) {
      this.messageDialogService.error(
        "Procedure already added to the service list"
      );
      return;
    }
    if (
      this.formGroup.value.procedure.value != undefined &&
      this.formGroup.value.procedure.serviceid != undefined
    ) {
      this.http
        .get(
          BillingApiConstants.checkPatientSexoporder(
            this.formGroup.value.procedure.value,
            this.opOrderrequestService.patientDemographicdata.gender,
            this.formGroup.value.procedure.serviceid,
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
              "This service is not allowed for this sex"
            );
            this.formGroup.reset();
          }
        });
    } else {
      this.messageDialogService.info("Please Select Procedure");
      this.formGroup.reset();
    }
  }

  addrow(priorityId = 1) {
    this.http
      .get(
        BillingApiConstants.getPrice(
          priorityId,
          this.formGroup.value.procedure.value,
          this.formGroup.value.procedure.serviceid,
          this.cookie.get("HSPLocationId")
        )
      )
      .subscribe((res: any) => {
        console.log(res);
        console.log(this.otherserviceId);
        this.opOrderrequestService.addToProcedure({
          sno: this.data.length + 1,
          procedures: this.formGroup.value.procedure.originalTitle,
          qty: 1,
          specialisation: "",
          doctorName: "",
          price: res.amount.toFixed(2),
          unitPrice: res.amount,
          itemid: this.formGroup.value.procedure.value,
          priorityId: priorityId,
          serviceId: this.formGroup.value.procedure.serviceid,
          specialisationId: 0,
          doctorId: 0,
          doctorName_required: this.formGroup.value.procedure.docRequired
            ? true
            : false,
          specialisation_required: this.formGroup.value.procedure.docRequired
            ? true
            : false,
          docRequired: this.formGroup.value.procedure.docRequired,
        });
        this.data = [...this.opOrderrequestService.procedureItems];
        this.opOrderrequestService.docRequiredStatusvalue();
        this.opOrderrequestService.calculateTotalAmount();
        this.formGroup.reset();
      });
  }
  getSaveDeleteObject(flag: any): SaveandDeleteOpOrderRequest {
    console.log(this.data);
    this.data.forEach((item: any, index: any) => {
      console.log(item.specialisation);
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
    if (this.opOrderrequestService.investigationItems.length > 0) {
      this.opOrderrequestService.investigationItems.forEach((item: any) => {
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
    }
    console.log(this.reqItemDetail);

    let maxid = this.opOrderrequestService.activeMaxId.maxId;
    let userid = Number(this.cookie.get("UserId"));

    return new SaveandDeleteOpOrderRequest(
      flag,
      maxid,
      this.reqItemDetail,
      "0",
      //60926,
      // 67
      userid,
      this.locationid
    );
  }

  save() {
    this.reqItemDetail = "";
    console.log("inside save");
    if (
      this.opOrderrequestService.procedureItems.length > 0 ||
      this.opOrderrequestService.investigationItems.length > 0
    ) {
      this.opOrderrequestService.spinner.next(true);
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
              this.opOrderrequestService.spinner.next(false);
              this.data = [];
              this.opOrderrequestService.procedureItems = [];
              this.opOrderrequestService.investigationItems = [];
              this.opOrderrequestService.calculateTotalAmount();
              this.formGroup.reset();
              this.config.columnsInfo.doctorName.moreOptions = {};
            }
          },
          (error) => {
            this.opOrderrequestService.spinner.next(false);
          }
        );
    }
  }

  view() {
    this.opOrderrequestService.setActiveLink(true);
    this.router.navigate([
      "/out-patient-billing/op-order-request/view-request",
    ]);
  }
}
