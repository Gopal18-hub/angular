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
import { textChangeRangeIsUnchanged } from "typescript";

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
        type: "string",
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
  private readonly _destroying$ = new Subject<void>();

  constructor(
    private formService: QuestionControlService,
    private http: HttpService,
    private cookie: CookieService,
    public billingService: BillingService,
    public messageDialogService: MessageDialogService
  ) {}

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.formData.properties,
      {}
    );
    this.formGroup = formResult.form;
    this.questions = formResult.questions;
    this.data = this.billingService.InvestigationItems;
    this.getServiceTypes();
    this.getSpecialization();
    this.billingService.clearAllItems.subscribe((clearItems) => {
      if (clearItems) {
        this.data = [];
      }
    });
    console.log(this.billingService.patientDemographicdata);
  }

  rowRwmove($event: any) {
    this.billingService.InvestigationItems.splice($event.index, 1);
    this.billingService.InvestigationItems =
      this.billingService.InvestigationItems.map((item: any, index: number) => {
        item["sno"] = index + 1;
        return item;
      });
    this.data = [...this.billingService.InvestigationItems];
    this.billingService.calculateTotalAmount();
  }

  ngAfterViewInit(): void {
    this.tableRows.controlValueChangeTrigger.subscribe((res: any) => {
      console.log(res);
      // col: "specialisation"
      if (res.data.col == "specialisation") {
        this.getdoctorlistonSpecializationClinic(
          res.$event.value,
          res.data.index
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
            };
          });
          this.questions[1] = { ...this.questions[1] };
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
          67
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
  outsource!: boolean;
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
        // this.formGroup.controls["investigation"].reset();
        this.questions[1].options = this.investigationList.map((r: any) => {
          return {
            title: r.testNameWithService || r.name,
            value: r.id,
            originalTitle: r.name,
          };
        });
        this.investigationList.forEach((item: any) => {
          if (item.outsourceTest == 1) {
            this.outsource = true;
          }
        });
        console.log(this.questions[1].options);
        this.questions[1] = { ...this.questions[1] };
      });
  }
  priceDefined = true;
  genderDefined = true;
  modalityDefined = true;
  flag = 0;
  add(priorityId = 1) {
    this.flag = 0;
    this.priceDefined = true;
    this.genderDefined = true;
    this.modalityDefined = true;
    console.log(this.hspLocationid);
    let exist = this.billingService.InvestigationItems.findIndex(
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
    this.http
      .get(
        BillingApiConstants.checkpriceforzeroitemid(
          //"5842",
          // this.serviceInvestigatationresponse.itemcode,
          this.formGroup.value.investigation.value,
          "67",
          "2"
        )
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe((response) => {
        console.log(response);
        if (response == 1) {
          this.flag++;
          console.log(this.flag);
          if (this.flag == 2) {
            this.addrow();
          }
        } else {
          this.messageDialogService.info(
            "Price for this service is not defined"
          );
        }
        console.log(this.priceDefined);
      });
    if (this.formGroup.value.investigation.value == 6085) {
      this.messageDialogService.info(
        "Please refer to the prescription, in case of diagnosed/provisional/follow up Dengue, select the right CBC"
      );
    }

    console.log(this.billingService.patientDemographicdata);

    this.http
      .get(
        BillingApiConstants.checkPatientSex(
          this.formGroup.value.investigation.value,
          this.billingService.patientDemographicdata.gender,
          this.formGroup.value.serviceType,
          "2"
        )
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe((response) => {
        console.log(response);
        if (response == 1) {
          this.flag++;
          if (this.flag == 2) {
            this.addrow();
          }
          console.log(this.flag);
        } else {
          this.messageDialogService.info(
            "This investigation is not allowed for this sex"
          );
        }
        console.log(this.genderDefined);
      });
    if (this.flag == 2) {
      this.addrow();
    }

    //this.formGroup.reset();
  }
  list: any = [];
  addrow() {
    this.http
      .get(
        BillingApiConstants.getPrice(
          1, //priority id
          this.formGroup.value.investigation.value,
          this.formGroup.value.serviceType ||
            this.formGroup.value.investigation.serviceid,
          "67"
        )
      )
      .subscribe((res: any) => {
        console.log(res);
        this.serviceInvestigatationresponse = res;
        this.billingService.addToInvestigations({
          sno: this.data.length + 1,
          investigations: this.formGroup.value.investigation.title,
          precaution: "",
          priority: 1,
          specialisation: "",
          doctorName: "",
          price: res.amount,
          serviceid:
            this.formGroup.value.serviceType ||
            this.formGroup.value.investigation.serviceid,
          itemid: this.formGroup.value.investigation.value,
        });
        this.data = [...this.billingService.InvestigationItems];
      });
  }

  getSaveDeleteObject(flag: any): SaveandDeleteOpOrderRequest {
    this.data.forEach((item: any, index: any) => {
      if (this.reqItemDetail == "") {
        if (item.investigation == undefined || item.investigation == "") {
          item.investigation = "";
        }
        if (item.specialisation == undefined || item.investigation == "") {
          item.specialisation = "";
        }
        if (item.doctorname == undefined || item.investigation == "") {
          item.doctorname = "";
        }
        this.reqItemDetail =
          item.investigation +
          "," +
          item.precaution +
          "," +
          item.priority +
          "," +
          item.specialisation +
          "," +
          item.doctorname +
          "," +
          item.price +
          "," +
          item.serviceid;
      } else {
        this.reqItemDetail =
          this.reqItemDetail +
          "," +
          (item.investigation,
          item.precaution,
          item.priority,
          item.specialisation,
          item.doctorname,
          item.price,
          item.serviceid);
      }
    });

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
        });
    }
  }
  view() {}
}
