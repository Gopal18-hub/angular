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
import { ServicetaxPopupComponent } from "./servicetax-popup/servicetax-popup.component";
import { SaveandDeleteOpOrderRequest } from "@core/models/saveanddeleteoporder.Model";
import { Router } from "@angular/router";

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
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log(this.formGroup);
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
    this.tableRows.controlValueChangeTrigger.subscribe((res: any) => {
      if (res.data.col == "qty") {
        this.update(res.data.element.sno);
      } else if (res.data.col == "specialisation") {
        this.getdoctorlistonSpecializationClinic(
          res.$event.value,
          res.data.index
        );
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
                  67,
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
          67
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
          67,
          // Number(this.cookie.get("HSPLocationId")),
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
  otherserviceId = 0;
  add(priorityId = 1) {
    if (
      // this.formGroup.value.otherService.value == undefined ||
      this.formGroup.value.otherService == null ||
      this.formGroup.value.otherService == ""
    ) {
      this.otherserviceId = 0;
    } else {
      this.otherserviceId = this.formGroup.value.otherService.value;
    }
    this.flag = 0;
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
        BillingApiConstants.checkpriceforzeroitemid(
          this.formGroup.value.procedure.value,
          "67",
          "9"
        )
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe((response) => {
        console.log(response);
        if (response == 1) {
          this.flag++;
          console.log(this.flag);
          if (this.flag == 2) {
            //this.addrow();
          }
        } else {
          this.messageDialogService.info(
            "Price for this service is not defined"
          );
        }
      });
    this.http
      .get(
        BillingApiConstants.checkPatientSexoporder(
          this.formGroup.value.procedure.value,
          this.billingService.patientDemographicdata.gender,
          this.formGroup.value.procedure.serviceid,
          "9"
        )
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe((response) => {
        console.log(response);
        if (response == 1) {
          this.flag++;
          if (this.flag == 2) {
            // this.addrow();
          }
          console.log(this.flag);
        } else {
          this.messageDialogService.info(
            "This service is not allowed for this sex"
          );
        }
      });
    this.http
      .get(
        BillingApiConstants.checkServiceTax(
          this.formGroup.value.procedure.value,
          this.formGroup.value.procedure.serviceid
        )
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe((response) => {
        console.log(response);
        if (response > 0) {
          const dialogref = this.dialog.open(ServicetaxPopupComponent, {
            width: "70vh",
            height: "30vh",
            data: {
              procedure: this.formGroup.value.procedure.title,
            },
          });
          dialogref.afterClosed().subscribe((value) => {
            console.log(value);
            if ((value = "true")) {
              if (this.flag == 2) {
                this.addrow();
              }
            } else if (value == "false") {
              //open popup , on click of ok from that popup
              this.addrow();
            }
          });
        } else {
          this.addrow();
        }
      });

    // if (this.flag == 2) {
    //   this.addrow();
    // }

    // this.http
    //   .get(
    //     BillingApiConstants.getPrice(
    //       priorityId,
    //       this.formGroup.value.procedure.value,
    //       this.formGroup.value.otherService.value,
    //       this.cookie.get("HSPLocationId")
    //     )
    //   )
    //   .subscribe((res: any) => {
    //     this.billingService.addToProcedure({
    //       sno: this.data.length + 1,
    //       procedures: this.formGroup.value.procedure.originalTitle,
    //       qty: 1,
    //       specialisation: "",
    //       doctorName: "",
    //       price: res.amount,
    //       unitPrice: res.amount,
    //       itemid: this.formGroup.value.procedure.value,
    //       priorityId: priorityId,
    //       serviceId: this.formGroup.value.otherService.value,
    //     });

    //     this.data = [...this.billingService.ProcedureItems];
    //     this.formGroup.reset();
    //   });
  }

  addrow(priorityId = 1) {
    this.http
      .get(
        BillingApiConstants.getPrice(
          priorityId,
          this.formGroup.value.procedure.value,
          this.otherserviceId,
          "67"
          //          this.formGroup.value.otherService.value,
          //        this.cookie.get("HSPLocationId")
        )
      )
      .subscribe((res: any) => {
        this.billingService.addToProcedure({
          sno: this.data.length + 1,
          procedures: this.formGroup.value.procedure.originalTitle,
          qty: 1,
          specialisation: 0,
          doctorName: 0,
          price: res.amount,
          unitPrice: res.amount,
          itemid: this.formGroup.value.procedure.value,
          priorityId: priorityId,
          serviceId: this.formGroup.value.procedure.serviceid,
        });

        this.data = [...this.billingService.ProcedureItems];
        this.formGroup.reset();
      });
  }
  getSaveDeleteObject(flag: any): SaveandDeleteOpOrderRequest {
    this.data.forEach((item: any, index: any) => {
      console.log(item.specialisation);
      if (item.specialisation == "") {
        console.log("specialisation is empty");
        item.specialisation;
      }
      if (this.reqItemDetail == "") {
        this.reqItemDetail =
          item.itemid +
          "," +
          item.serviceId +
          "," +
          item.specialisation +
          "," +
          item.doctorName +
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
          item.specialisation +
          "," +
          item.doctorName +
          "," +
          item.priorityId;
      }
    });
    console.log(this.reqItemDetail);

    let maxid = this.billingService.activeMaxId.maxId;
    let userid = Number(this.cookie.get("UserId"));
    let locationid = Number(this.cookie.get("HSPLocationId"));

    return new SaveandDeleteOpOrderRequest(
      flag,
      maxid,
      this.reqItemDetail,
      0,
      60926,
      67
      // userid,
      // locationid
    );
  }
  saveResponsedata: any;
  save() {
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
            this.billingService.ProcedureItems = [];
          }
        });
    }
  }

  view() {
    this.router.navigate([
      "/out-patient-billing/op-order-request/view-request",
    ]);
  }
}
