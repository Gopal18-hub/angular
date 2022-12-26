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
  catchError,
} from "rxjs/operators";
import { of } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { MaxHealthSnackBarService } from "@shared/ui/snack-bar";
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
  snackbarHealthCheckup: any = true;

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
        type: "currency",
      },
    },
  };

  doctorsList: any = [];
  departmentHealthCheckup: any = [];

  constructor(
    private formService: QuestionControlService,
    private http: HttpService,
    private cookie: CookieService,
    public billingService: BillingService,
    public matDialog: MatDialog,
    public messageDialogService: MessageDialogService,
    private router: Router,
    private route: ActivatedRoute,
    private snackbar: MaxHealthSnackBarService
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
    this.billingService.makeBillPayload.ds_insert_bill.tab_d_packagebillList.splice(
      $event.index,
      1
    );
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

    //newly added to remove from array
    let itemid = $event.data.itemid;
    delete this.billingService.healthCheckupselectedItems[itemid];
    this.billingService.doctorList = [];
  }

  detialsForHealthCheckup(res: any) {
    const dialogPopup = this.matDialog.open(
      PackageDoctorModificationComponent,
      {
        width: "50%",
        data: {
          orderSet: res.element,
          items:
            res.element.itemid.toString() in
            this.billingService.healthCheckupselectedItems
              ? this.billingService.healthCheckupselectedItems[
                  res.element.itemid.toString()
                ]
              : [], //[],
          doctorsList: this.billingService.doctorList, //this.doctorsList,
        },
      }
    );
    dialogPopup.afterClosed().subscribe((res1: any) => {
      if (res1 && "data" in res1) {
        this.billingService.healthCheckupselectedItems[res1.itemId.toString()] =
          res1.data;
      }
      if (res1 && res1.itemId) {
        // this.doctorsList = [];
        this.billingService.doctorList = res1.doctorList;
        ////GAV-882
        this.billingService.changeBillTabStatus(false);
        this.billingService.setHCUDetails(res1.itemId, this.billingService.doctorList);
      } else {
        // this.doctorsList = this.doctorsList.map((d: number) => d * 0);
        ////GAV-882
          if (Object.keys(this.billingService.healthCheckupselectedItems).length > 0) {
           this.billingService.changeBillTabStatus(false);
         }
         else{
          this.billingService.changeBillTabStatus(true);
         }
      }
    });
  }

  ngAfterViewInit(): void {
    this.questions[1].elementRef.addEventListener("keypress", (event: any) => {
      if (event.key == "Enter") {
        if (this.formGroup.valid) {
          this.add();
        }
      }
    });
    this.tableRows.stringLinkOutput.subscribe((res: any) => {
      this.detialsForHealthCheckup(res);
    });

    this.formGroup.controls["healthCheckup"].valueChanges
      .pipe(
        // filter((res) => {
        //   return res !== null && res.length >= 3;
        // }),
        distinctUntilChanged(),
        debounceTime(1000),
        tap(() => {}),
        switchMap((value) => {
          if (
            this.formGroup.value.department &&
            this.formGroup.value.department.value
          ) {
            return this.departmentHealthCheckup;
            //return of([]);
          } else {
            if (value !== null && value.length >= 3) {
              return this.http
                .get(
                  BillingApiConstants.gethealthcheckupsonsearch(
                    Number(this.cookie.get("HSPLocationId")),
                    value
                  )
                )
                .pipe(
                  catchError((err) => {
                    this.openSnackbarHealthCheckup(err.error);
                    return of([]);
                  }),
                  finalize(() => {})
                );
            } else {
              return of([]);
            }
          }
        })
      )
      .subscribe(
        (data: any) => {
          if (data.length > 0) {
            this.questions[1].options = data.map((r: any) => {
              return {
                title: r.nameWithDepartment || r.name,
                value: r.id,
                originalTitle: r.name,
                popuptext: r.popuptext,
              };
            });
            this.questions[1] = { ...this.questions[1] };
          } else {
            if (data && data.id && data.id > 0) {
            } else {
              this.questions[1].options = [];
              this.questions[1] = { ...this.questions[1] };
            }
          }
        },
        (err: any) => {
          this.questions[1].options = [];
          this.questions = { ...this.questions };
        }
      );
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
      } else {
        this.departmentHealthCheckup = [];
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
          console.log("department valueChanges res => ", res);
          this.formGroup.controls["healthCheckup"].reset();
          if (Array.isArray(res)) {
            this.departmentHealthCheckup = res;
            this.questions[1].options = res.map((r: any) => {
              return {
                title: r.name,
                value: r.id,
                originalTitle: r.name,
                popuptext: r.popuptext,
              };
            });
          } else {
            this.questions[1].options = [];
          }
          console.log(
            "department valueChanges this.questions => ",
            this.questions
          );
          this.questions = { ...this.questions };
        },
        (error) => {
          this.openSnackbarHealthCheckup(
            "Health Checkup's Not available for " +
              this.formGroup.value.department.title
          );
          this.formGroup.controls["healthCheckup"].reset();
          this.questions[1].options = [];
          this.questions = { ...this.questions };
        }
      );
  }

  openSnackbarHealthCheckup(msg: string) {
    if (this.snackbarHealthCheckup) {
      this.snackbarHealthCheckup = false;
      this.snackbarHealthCheckup = this.snackbar.open(msg, "error");
      setTimeout(() => {
        this.snackbarHealthCheckup = true;
      }, 4000);
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
    this.billingService.doctorList=[];
    this.http
      .get(BillingApiConstants.getHealthCheckupdetails(hid, serviceid))
      .subscribe((res) => {
        res.forEach((item: any, index: number) => {
          //if (item.isConsult == 1 && item.itemServiceID == 25) {
          if (item.itemServiceID == 25) {
            this.doctorsList.push(0);
            this.billingService.doctorList.push(0);
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
    if (this.formGroup.value.healthCheckup.value) {
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
              popuptext: this.formGroup.value.healthCheckup.popuptext,
              itemId: this.formGroup.value.healthCheckup.value,
              priority: priorityId,
              serviceId: 26,
              price: res[0].returnOutPut,
              serviceName: "Health Checkups",
              itemName: this.formGroup.value.healthCheckup.originalTitle,
              qty: 1,
              precaution: "",
              procedureDoctor: "",
              credit: 0,
              cash: 0,
              disc: 0,
              discAmount: 0,
              totalAmount: res[0].returnOutPut + res[0].totaltaX_Value,
              gst: res[0].totaltaX_RATE,
              gstValue: res[0].totaltaX_Value,
              specialisationID: 0,
              doctorID: 0,
              itemCode: res[0].itemCode || "",
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
          this.billingService.makeBillPayload.tab_o_opItemBasePrice.push({
            itemID: this.formGroup.value.healthCheckup.value,
            serviceID: 26,
            price: res[0].returnOutPut + res[0].totaltaX_Value,
            willModify: res[0].ret_value == 1 ? true : false,
          });
          this.getDoctorsList(this.formGroup.value.healthCheckup.value, "26");
        }

        this.data = [...this.billingService.HealthCheckupItems];
        this.formGroup.reset();
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
