import { Component, OnInit, ViewChild, Inject, OnDestroy } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { CookieService } from "@shared/services/cookie.service";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { Subject, takeUntil } from "rxjs";
import { DatePipe } from "@angular/common";
import { HttpService } from "@shared/services/http.service";
import { ApiConstants } from "@core/constants/ApiConstants";
import { Registrationdetails } from "../../../../core/types/registeredPatientDetial.Interface";
import { ActivatedRoute, Router } from "@angular/router";
import { AppointmentSearchComponent } from "./prompts/appointment-search/appointment-search.component";
import { GetCompanyDataInterface } from "@core/types/employeesponsor/getCompanydata.Interface";
import { DMSComponent } from "../../../registration/submodules/dms/dms.component";
import { DMSrefreshModel } from "@core/models/DMSrefresh.Model";
import { BillingApiConstants } from "./BillingApiConstant";
import { PaydueComponent } from "./prompts/paydue/paydue.component";
import { BillingService } from "./billing.service";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { MaxHealthSnackBarService } from "@shared/ui/snack-bar";
import * as moment from "moment";
import { VisitHistoryComponent } from "@shared/modules/visit-history/visit-history.component";
import { IomPopupComponent } from "./prompts/iom-popup/iom-popup.component";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";
import { ShowPlanDetilsComponent } from "./prompts/show-plan-detils/show-plan-detils.component";
import { PatientService } from "@core/services/patient.service";
import { OnlineAppointmentComponent } from "./prompts/online-appointment/online-appointment.component";
import { distinctUntilChanged } from "rxjs/operators";
import { InvestigationWarningComponent } from "./prompts/investigation-warning/investigation-warning.component";
import { UnbilledInvestigationComponent } from "./prompts/unbilled-investigation/unbilled-investigation.component";
import { CalculateBillService } from "@core/services/calculate-bill.service";
import { SearchService } from "@shared/services/search.service";
import { LookupService } from "@core/services/lookup.service";
import { getCorporatemasterdetail } from "@core/types/billdetails/getCorporatemasterdetail.Interface";
import { BillingStaticConstants } from "./BillingStaticConstant";

@Component({
  selector: "out-patients-billing",
  templateUrl: "./billing.component.html",
  styleUrls: ["./billing.component.scss"],
})
export class BillingComponent implements OnInit, OnDestroy {
  links: any = BillingStaticConstants.billingPageTabs;

  formData = BillingStaticConstants.billingHeaderForm;

  formGroup!: FormGroup;
  questions: any;

  categoryIcons: any;

  patient: boolean = false;

  patientName!: string;
  age!: string | undefined;
  gender!: string;
  dob!: string;
  country!: string;
  ssn!: string;

  private readonly _destroying$ = new Subject<void>();

  patientDetails!: any;

  apiProcessing: boolean = false;

  complanyList!: GetCompanyDataInterface[];
  coorporateList: any = [];
  creditcorporateList: any = [];

  dmsProcessing: boolean = false;

  moment = moment;

  narrationAllowedLocations = ["67", "69"];
  qmsManagementLocations = ["3", "8", "5", "12", "20", "17", "18", "21", "29"];

  companyData!: GetCompanyDataInterface[];

  orderId: number = 0;

  expiredPatient: boolean = false;
  secondaryMaxId: boolean = false;
  counterId: number = 0;
  counterName = "";
  enableQMSManagement: boolean = false;
  disableStopQueueBtn: boolean = true;
  queueId: number = 0;
  qmsSeqNo = "";

  constructor(
    public matDialog: MatDialog,
    private formService: QuestionControlService,
    private http: HttpService,
    public cookie: CookieService,
    private datepipe: DatePipe,
    private route: ActivatedRoute,
    public billingService: BillingService,
    private snackbar: MaxHealthSnackBarService,
    private router: Router,
    public messageDialogService: MessageDialogService,
    private patientService: PatientService,
    private calculateBillService: CalculateBillService,
    private searchService: SearchService,
    private lookupService: LookupService
  ) {}

  ngOnInit(): void {
    this.calculateBillService.blockActions.subscribe((status: boolean) => {
      if (status) {
        this.apiProcessing = true;
      } else {
        this.apiProcessing = false;
      }
    });
    if (this.cookie.check("Counter_ID")) {
      if (this.cookie.get("Counter_ID")) {
        this.counterId = Number(this.cookie.get("Counter_ID"));
      }
      if (this.cookie.check("CounterName")) {
        if (this.cookie.get("Counter_ID")) {
          this.counterName = this.cookie.get("CounterName");
        }
      }
    }
    if (
      this.counterId > 0 &&
      this.qmsManagementLocations.includes(this.cookie.get("HSPLocationId"))
    ) {
      this.enableQMSManagement = true;
    }
    let formResult: any = this.formService.createForm(
      this.formData.properties,
      {}
    );
    this.formGroup = formResult.form;
    this.questions = formResult.questions;

    this.route.queryParams.subscribe((params: any) => {
      if (params.maxId) {
        this.formGroup.controls["maxid"].setValue(params.maxId);
        this.apiProcessing = true;
        this.patient = false;
        this.getAllCompany();
        this.getAllCorporate();
        this.getPatientDetailsByMaxId();
      }
      if (params.orderid) {
        this.orderId = Number(params.orderid);
      }
    });
    this.searchService.searchTrigger
      .pipe(takeUntil(this._destroying$))
      .subscribe(async (formdata: any) => {
        await this.loadGrid(formdata);
      });

    this.billingService.billNoGenerated.subscribe((res: boolean) => {
      if (res) {
        this.links[0].disabled = true;
        this.links[2].disabled = true;
      } else {
        this.links[0].disabled = false;
        this.links[2].disabled = false;
      }
    });
    this.billingService.disableBillTabChange.subscribe((res: boolean) => {
      if (res) {
        this.links[1].disabled = true;
      } else {
        this.links[1].disabled = false;
      }
    });
    this.billingService.companyChangeEvent.subscribe((res: any) => {
      if (res.from != "header") {
        this.formGroup.controls["company"].setValue(res.company, {
          emitEvent: false,
        });
      }
    });
    this.billingService.corporateChangeEvent.subscribe((res: any) => {
      if (res.from != "header") {
        this.formGroup.controls["corporate"].setValue(res.corporate, {
          emitEvent: false,
        });
        if (res.from == "disable") {
          this.formGroup.controls["corporate"].disable();
        } else if (this.formGroup.value.company.value) {
          this.formGroup.controls["corporate"].enable();
        }
      }
    });
  }

  getediganosticacdoninvestigationgrid(iacode: string, regNumber: number) {
    this.http
      .get(
        BillingApiConstants.getediganosticacdoninvestigationgrid(
          this.cookie.get("HSPLocationId"),
          this.orderId,
          regNumber,
          iacode
        )
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe(async (res) => {
        let referalDoctor: any = null;
        if (res.tempOrderBreakup.length > 0) {
          const tempBulkInvPayload: any = [];
          res.tempOrderBreakup.forEach((item: any) => {
            if (item.serviceType == "Investigation") {
              if (!item.isBilled) {
                tempBulkInvPayload.push({
                  title: item.testName,
                  value: item.testID,
                  originalTitle: item.testName,
                  docRequired: item.doctorid ? true : false,
                  patient_Instructions: "",
                  item_Instructions: "",
                  serviceid: item.serviceId,
                  doctorid: item.doctorid,
                  specialization: item.specialization,
                  specializationId: item.specializationId,
                });
                if (item.doctorid)
                  referalDoctor = {
                    id: item.refDocID,
                    name: item.refDocName,
                    specialisation: "",
                  };
              }
            }
          });
          if (tempBulkInvPayload.length > 0) {
            await this.billingService.processInvestigationBulk(
              1,
              tempBulkInvPayload
            );
            setTimeout((res: any) => {
              this.billingService.servicesTabStatus.next({
                goToTab: 1,
              });
            }, 10);

            if (referalDoctor) {
              this.billingService.setReferralDoctor(referalDoctor);
            }
          }

          this.apiProcessing = false;
        }
      });
  }

  ngAfterViewInit(): void {
    this.formEvents();

    // this.formGroup.controls["b2bInvoice"].valueChanges
    //   .pipe(takeUntil(this._destroying$))
    //   .subscribe((res: any) => {
    //     if (res) {
    //       this.billingService.makeBillPayload.invoiceType = "B2B";
    //     } else {
    //       this.billingService.makeBillPayload.invoiceType = "B2C";
    //     }
    //   });
    this.formGroup.controls["company"].valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((res: any) => {
        if (res && res.value) {
          console.log(res);
          if (this.billingService.billtype == 3 && res.company.id > 0) {
            this.billingService.checkcreditcompany(
              res.value,
              res,
              this.formGroup,
              "header"
            );
          } else {
            this.billingService.setCompnay(
              res.value,
              res,
              this.formGroup,
              "header"
            );
          }
        } else {
          this.billingService.setCompnay(res, res, this.formGroup, "header");
        }
      });

    this.formGroup.controls["corporate"].valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((res: any) => {
        if (res && res.value) {
          console.log(res);
          this.billingService.setCorporate(
            res.value,
            res,
            this.formGroup,
            "header"
          );
        } else {
          this.billingService.setCorporate(res, res, this.formGroup, "header");
        }
      });
    if (this.formGroup.value.maxid == this.questions[0].defaultValue) {
      this.questions[0].elementRef.focus();
    }
  }

  ngOnDestroy(): void {
    this.clear();
  }

  formEvents() {
    this.questions[0].elementRef.addEventListener("keypress", (event: any) => {
      if (event.key === "Enter") {
        event.preventDefault();
        if (!this.route.snapshot.queryParams["maxId"]) {
          this.apiProcessing = true;
          this.patient = false;
          this.router.navigate([], {
            queryParams: { maxId: this.formGroup.value.maxid },
            relativeTo: this.route,
            queryParamsHandling: "merge",
          });
        }

        //this.getPatientDetailsByMaxId();
      }
    });
    this.questions[1].elementRef.addEventListener("keypress", (event: any) => {
      if (event.key === "Enter") {
        //if (!this.formGroup.value.maxid) {
        event.preventDefault();
        this.apiProcessing = true;
        this.patient = false;
        this.searchByMobileNumber();
        //}
      }
    });
  }

  searchByMobileNumber() {
    if (
      !this.formGroup.value.mobile ||
      this.formGroup.value.mobile.length != 10
    ) {
      this.snackbar.open("Invalid Mobile No.", "error");
      this.apiProcessing = false;
      this.patient = false;
      return;
    }
    this.http
      .post(ApiConstants.similarSoundPatientDetail, {
        phone: this.formGroup.value.mobile,
      })
      .pipe(takeUntil(this._destroying$))
      .subscribe((res: any) => {
        if (res.length == 0) {
        } else {
          if (res.length == 1) {
            const maxID = res[0].maxid;
            this.formGroup.controls["maxid"].setValue(maxID);
            this.apiProcessing = true;
            this.patient = false;
            //this.getPatientDetailsByMaxId();
            this.router.navigate([], {
              queryParams: { maxId: this.formGroup.value.maxid },
              relativeTo: this.route,
              queryParamsHandling: "merge",
            });
          } else {
            const similarSoundDialogref = this.matDialog.open(
              SimilarPatientDialog,
              {
                width: "60vw",
                height: "80vh",
                data: {
                  searchResults: res,
                },
              }
            );
            similarSoundDialogref
              .afterClosed()
              .pipe(takeUntil(this._destroying$))
              .subscribe((result) => {
                if (result) {
                  let maxID = result.data["added"][0].maxid;
                  this.formGroup.controls["maxid"].setValue(maxID);
                  this.apiProcessing = true;
                  this.patient = false;
                  //this.getPatientDetailsByMaxId();
                  this.router.navigate([], {
                    queryParams: { maxId: this.formGroup.value.maxid },
                    relativeTo: this.route,
                    queryParamsHandling: "merge",
                  });
                }
              });
          }
        }
        this.apiProcessing = false;
        this.patient = false;
      });
  }

  async checkPatientExpired(iacode: string, regNumber: number) {
    const res = await this.http
      .get(
        BillingApiConstants.getforegexpiredpatientdetails(
          iacode,
          Number(regNumber)
        )
      )
      .pipe(takeUntil(this._destroying$))
      .toPromise()
      .catch((reason: any) => {
        return reason;
      });
    if (res == null || res == undefined) {
      return false;
    }
    if (res.length > 0) {
      if (res[0].flagexpired == 1) {
        return true;
      }
    }
    return false;
  }

  async getPatientDetailsByMaxId() {
    if (!this.formGroup.value.maxid) {
      this.apiProcessing = false;
      this.patient = false;
      return;
    }
    let regNumber = Number(this.formGroup.value.maxid.split(".")[1]);

    if (regNumber != 0) {
      let iacode = this.formGroup.value.maxid.split(".")[0];
      const expiredStatus = await this.checkPatientExpired(iacode, regNumber);
      if (expiredStatus) {
        this.expiredPatient = true;
        const dialogRef = this.messageDialogService.warning(
          "This is an expired patient, no transaction is allowed"
        );
        await dialogRef
          .afterClosed()
          .pipe(takeUntil(this._destroying$))
          .toPromise();
      }
      this.getSimilarSoundDetails(iacode, regNumber);
    } else {
      this.apiProcessing = false;
      this.patient = false;
    }
  }

  getSimilarSoundDetails(iacode: string, regNumber: number) {
    this.http
      .get(BillingApiConstants.getsimilarsoundopbilling(iacode, regNumber))
      .pipe(takeUntil(this._destroying$))
      .subscribe(
        (resultData: any) => {
          if (resultData && resultData.length > 0) {
            this.linkedMaxId(
              resultData[0].iaCode + "." + resultData[0].registrationNo,
              iacode,
              regNumber
            );
          } else {
            this.registrationDetails(iacode, regNumber);
          }
        },
        (error) => {
          this.clear();
          this.snackbar.open("Invalid Max ID", "error");
        }
      );
  }

  registrationDetails(iacode: string, regNumber: number) {
    this.http
      .get(
        ApiConstants.getregisteredpatientdetailsForBilling(
          iacode,
          regNumber,
          Number(this.cookie.get("HSPLocationId"))
        )
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe(
        async (resultData: Registrationdetails) => {
          console.log(resultData);
          if (resultData) {
            this.patientDetails = resultData;

            this.setValuesToForm(this.patientDetails);
            if (this.billingService.todayPatientBirthday) {
              const birthdayDialog = this.messageDialogService.info(
                "Today is Patient’s birthday"
              );
              await birthdayDialog.afterClosed().toPromise();
            }

            if (this.orderId) {
              this.getediganosticacdoninvestigationgrid(iacode, regNumber);
            }

            if (
              this.patientDetails.dsPersonalDetails.dtPersonalDetails1.length >
              0
            ) {
              if (
                this.patientDetails.dsPersonalDetails.dtPersonalDetails1[0]
                  .pPagerNumber == "ews"
              ) {
                this.formGroup.controls["company"].disable();
                this.formGroup.controls["corporate"].disable();
                this.links[2].disabled = true;
                const tpacompanyExist: any = this.companyData.filter(
                  (c: any) => c.isTPA == 18
                );
                if (tpacompanyExist && tpacompanyExist.length > 0) {
                  this.formGroup.controls["company"].setValue({
                    title: tpacompanyExist[0].name,
                    value: tpacompanyExist[0].id,
                  });
                }
              }
              this.billingService.setPatientDetails(
                this.patientDetails.dsPersonalDetails.dtPersonalDetails1[0]
              );
              this.categoryIcons =
                this.patientService.getCategoryIconsForPatientAny(
                  this.patientDetails.dsPersonalDetails.dtPersonalDetails1[0]
                );
              const patientDetails =
                this.patientDetails.dsPersonalDetails.dtPersonalDetails1[0];
              this.billingService.setActiveMaxId(
                this.formGroup.value.maxid,
                iacode,
                regNumber.toString(),
                patientDetails.genderName
              );
              if (patientDetails.nationality != 149) {
                const dialogRef = this.messageDialogService.info(
                  "Please Ensure International Tariff Is Applied!"
                );
                dialogRef
                  .afterClosed()
                  .pipe(takeUntil(this._destroying$))
                  .subscribe((result) => {
                    if (!this.orderId) {
                      this.startProcess(
                        patientDetails,
                        resultData,
                        iacode,
                        regNumber
                      );
                    }
                  });
              } else {
                if (!this.orderId) {
                  this.startProcess(
                    patientDetails,
                    resultData,
                    iacode,
                    regNumber
                  );
                }
              }
            }
          } else {
            this.clear();
            this.snackbar.open("Invalid Max ID", "error");
          }

          //SETTING PATIENT DETAILS TO MODIFIEDPATIENTDETAILOBJ
        },
        (error) => {
          if (error.error == "Patient Not found") {
            this.clear();
            // this.formGroup.controls["maxid"].setValue(iacode + "." + regNumber);
            //this.formGroup.controls["maxid"].setErrors({ incorrect: true });
            //this.questions[0].customErrorMessage = "Invalid Max ID";
            this.snackbar.open("Invalid Max ID", "error");
          }
          this.apiProcessing = false;
          this.patient = false;
        }
      );
  }

  startProcess(
    patientDetails: any,
    resultData: any,
    iacode: any,
    regNumber: any
  ) {
    if (!patientDetails.isAvailRegCard) {
      this.questions[0].questionClasses = "bg-vilot";
      this.questions[0] = { ...this.questions[0] };
    }
    if (
      !patientDetails.isAvailRegCard &&
      moment().diff(moment(patientDetails.regdatetime), "days") == 0
    ) {
      this.addRegistrationCharges(resultData);
    } else {
      this.inPatientCheck(resultData.dtPatientPastDetails);
    }
    this.getforonlinebilldetails(iacode, regNumber);
    this.calculateBillService.depositDetails(iacode, regNumber);
  }

  setValuesToForm(pDetails: Registrationdetails) {
    if (pDetails.dsPersonalDetails.dtPersonalDetails1.length == 0) {
      this.clear();
      this.snackbar.open("Invalid Max ID", "error");
      return;
    }
    const patientDetails = pDetails.dsPersonalDetails.dtPersonalDetails1[0];
    this.formGroup.controls["mobile"].setValue(patientDetails.pCellNo);
    if (patientDetails.companyid) {
      const companyExist: any = this.companyData.filter(
        (c: any) => c.id == patientDetails.companyid
      );
      if (companyExist && companyExist.length > 0) {
        let res = {
          company: companyExist[0],
          title: companyExist[0].name,
          value: patientDetails.companyid,
        };
        this.billingService.setCompnay(
          patientDetails.companyid,
          res,
          this.formGroup,
          "companyexists"
        );
      }
    }
    if (patientDetails.corporateid) {
      const corporateExist: any = this.coorporateList.find(
        (c: any) => c.id == patientDetails.corporateid
      );
      if (corporateExist) {
        this.formGroup.controls["corporate"].setValue({
          title: corporateExist.name,
          value: patientDetails.corporateid,
        });
      }
    }
    this.patientName = patientDetails.firstname + " " + patientDetails.lastname;
    this.ssn = patientDetails.ssn;
    this.age = this.onageCalculator(patientDetails.dateOfBirth);
    this.gender = patientDetails.genderName;
    this.country = patientDetails.nationalityName;
    this.ssn = patientDetails.ssn;
    this.dob =
      "" + this.datepipe.transform(patientDetails.dateOfBirth, "dd/MM/yyyy");
    this.patient = true;
    this.apiProcessing = false;
    this.questions[0].readonly = true;
    this.questions[1].readonly = true;
    this.billingService.setBillingFormGroup(this.formGroup, this.questions);

    //this.questions[2].readonly = true;
  }

  onageCalculator(ageDOB = "") {
    if (ageDOB) {
      let dobRef = moment(ageDOB);
      if (!dobRef.isValid()) {
        return;
      }
      const today = moment();
      const diffYears = today.diff(dobRef, "years");
      const diffMonths = today.diff(dobRef, "months");
      const diffDays = today.diff(dobRef, "days");
      if (diffYears >= 60) {
        this.calculateBillService.seniorCitizen = true;
      }
      if (dobRef.date() == today.date() && dobRef.month() == today.month()) {
        this.billingService.todayPatientBirthday = true;
      }
      let returnAge = "";
      if (diffYears > 0) {
        returnAge = diffYears + " Year(s)";
      } else if (diffMonths > 0) {
        returnAge = diffYears + " Month(s)";
      } else if (diffDays > 0) {
        returnAge = diffYears + " Day(s)";
      } else if (diffYears < 0 || diffMonths < 0 || diffDays < 0) {
        returnAge = "N/A";
      } else if (diffDays == 0) {
        returnAge = "1 Day(s)";
      }
      return returnAge;
    }
    return "N/A";
  }

  doCategoryIconAction(categoryIcon: any) {
    const patientDetails: any =
      this.patientDetails.dsPersonalDetails.dtPersonalDetails1[0];
    const data: any = {
      note: {
        notes: patientDetails.noteReason,
      },
      vip: {
        notes: patientDetails.vipreason,
      },
      hwc: {
        notes: patientDetails.hwcRemarks,
      },
      ppagerNumber: {
        bplCardNo: patientDetails.bplcardNo,
        BPLAddress: patientDetails.addressOnCard,
      },
      hotlist: {
        hotlistTitle: { title: patientDetails.hotlistreason, value: 0 },
        reason: patientDetails.hotlistcomments,
      },
    };
    if (
      categoryIcon.tooltip != "CASH" &&
      categoryIcon.tooltip != "INS" &&
      categoryIcon.tooltip != "PSU"
    ) {
      this.patientService.doAction(categoryIcon.type, data[categoryIcon.type]);
    }
  }

  getforonlinebilldetails(iacode: string, regNumber: number) {
    this.http
      .get(
        BillingApiConstants.getforonlinebilldetails(
          iacode,
          regNumber,
          this.cookie.get("HSPLocationId")
        )
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe((res: any) => {
        let items: any = [];
        if (res.dtpatientonlinebillPracto.length > 0) {
          items = res.dtpatientonlinebillPracto;
        }

        if (items.length > 0) {
          const dialogRef = this.matDialog.open(OnlineAppointmentComponent, {
            width: "80vw",
            maxWidth: "90vw",
            data: {
              items: items,
            },
          });
          dialogRef
            .afterClosed()
            .pipe(takeUntil(this._destroying$))
            .subscribe((result: any) => {
              //check for expired patient GAV-936
              //check for mreged max Id
              if (!this.expiredPatient || !this.secondaryMaxId) {
                if (result && result.selected && result.selected.length > 0) {
                  const doctors: any = result.selected;
                  for (let i = 0; i < doctors.length; i++) {
                    // //GAV-530 Paid Online appointment
                    // if (doctors[i].paymentStatus == "No") {
                    this.formGroup.controls["bookingId"].setValue(
                      doctors[i].bookingNo
                    );
                    if (
                      doctors[i].paymentStatus == "Yes" &&
                      doctors[i].billStatus == "No"
                    ) {
                      this.billingService.setPaidAppointments({
                        paymentstatus: doctors[i].paymentStatus,
                        billstatus: doctors[i].billStatus,
                        onlinepaidamount: doctors[i].amount,
                        bookingid: doctors[i].bookingNo,
                        transactionid: doctors[i].transactionNo,
                        mobileno: doctors[i].mobileno,
                      });
                    } else if (doctors[i].paymentStatus == "No") {
                      this.billingService.setPaidAppointments({
                        paymentstatus: doctors[i].paymentStatus,
                      });
                    }

                    this.billingService.procesConsultationAdd(
                      57,
                      doctors[i].specialisationid,
                      {
                        value: doctors[i].doctorID,
                        originalTitle: doctors[i].doctorname,
                        specialisationid: doctors[i].specialisationid,
                      },
                      {
                        value: doctors[i].clinicId,
                      }
                    );
                    //  //GAV-530 Paid Online appointment
                    // } else if (
                    //   doctors[i].paymentStatus == "Yes" &&
                    //   doctors[i].billStatus == "No"
                    // ) {
                    //   this.billingService.procesConsultationAddWithOutApi(
                    //     57,
                    //     doctors[i].specialisationid,
                    //     {
                    //       value: doctors[i].doctorID,
                    //       originalTitle: doctors[i].doctorname,
                    //       specialisationid: doctors[i].specialisationid,
                    //       price: doctors[i].amount,
                    //     },
                    //     {
                    //       value: doctors[i].clinicId,
                    //     }
                    //   );
                    // }
                  }
                }
              }
            });
        }
      });
  }

  async payDueCheck(dtPatientPastDetails: any) {
    if (
      dtPatientPastDetails[4] &&
      dtPatientPastDetails[4].id > 0 &&
      dtPatientPastDetails[4].data > 0
    ) {
      const dialogRef = this.matDialog.open(PaydueComponent, {
        width: "30vw",
        data: {
          dueAmount: dtPatientPastDetails[4].data,
          maxId: this.formGroup.value.maxid,
        },
      });
      const resAction = await dialogRef
        .afterClosed()
        .pipe(takeUntil(this._destroying$))
        .toPromise();
      if (resAction) {
        if ("paynow" in resAction && resAction.paynow) {
          this.router.navigate(["/out-patient-billing/details"], {
            queryParams: { maxID: this.formGroup.value.maxid, from: 1 },
          });
          return;
        }
        if ("skipReason" in resAction && resAction.skipReason) {
        }
      }

      this.planDetailsCheck(dtPatientPastDetails);
    } else {
      this.planDetailsCheck(dtPatientPastDetails);
    }
  }

  async planDetailsCheck(dtPatientPastDetails: any) {
    if (
      dtPatientPastDetails[5] &&
      dtPatientPastDetails[5].id == 6 &&
      dtPatientPastDetails[5].data == 1
    ) {
      let data: any = [];
      this.patientDetails.dtPlanDetail.forEach((plan: any, index: number) => {
        data.push({
          sno: index + 1,
          planType: "Health Plan",
          planName: plan.planName,
          planId: plan.planID,
        });
      });
      const dialogRef = this.matDialog.open(ShowPlanDetilsComponent, {
        width: "40vw",
        data: {
          planDetails: data,
          type: "healthPlan",
        },
      });
      dialogRef
        .afterClosed()
        .pipe(takeUntil(this._destroying$))
        .subscribe((result) => {
          //check added for expired patient check GAV-936
          //check for merged Max Id
          if (!this.expiredPatient || !this.secondaryMaxId) {
            if (result && result.selected && result.selected.length > 0) {
              const selectedPlan = result.selected[0];
              this.formGroup.controls["company"].disable();
              this.formGroup.controls["corporate"].disable();
              this.links[2].disabled = true;
              this.billingService.setHealthPlan(selectedPlan);
              this.messageDialogService.info(
                "You have selected " + selectedPlan.planName
              );
            }
            this.checkServicesLogics();
          }
        });
    } else if (
      dtPatientPastDetails[7] &&
      dtPatientPastDetails[7].id == 8 &&
      dtPatientPastDetails[7].data == 1
    ) {
      if (this.patientDetails.dtOtherPlanDetail.length > 0) {
        let data: any = [];
        this.patientDetails.dtOtherPlanDetail.forEach(
          (plan: any, index: number) => {
            data.push({
              sno: index + 1,
              planType: "Other",
              planName: plan.planName,
              serviceId: plan.serviceId,
              planId: plan.planId,
            });
          }
        );
        const dialogRef = this.matDialog.open(ShowPlanDetilsComponent, {
          width: "50vw",
          data: {
            planDetails: data,
            type: "other",
          },
        });
        dialogRef
          .afterClosed()
          .pipe(takeUntil(this._destroying$))
          .subscribe(async (result) => {
            //check added for expired patient check GAV-936
            //check for merged max Id
            if (!this.expiredPatient || !this.secondaryMaxId) {
              if (result && result.selected && result.selected.length > 0) {
                const selectedPlan = result.selected[0];
                this.billingService.setOtherPlan(selectedPlan);
                this.formGroup.controls["company"].disable();
                this.formGroup.controls["corporate"].disable();
                const planSelectDialog = this.messageDialogService.info(
                  "You have selected " + selectedPlan.planName
                );
                await planSelectDialog.afterClosed().toPromise();
                const ores = await this.http
                  .get(
                    BillingApiConstants.getotherplanretrieve(
                      this.billingService.activeMaxId.iacode,
                      this.billingService.activeMaxId.regNumber,
                      selectedPlan.planId
                    )
                  )
                  .toPromise();
                if (ores.length > 0) {
                  const dialogRefDetails = this.matDialog.open(
                    ShowPlanDetilsComponent,
                    {
                      width: "80vw",
                      maxHeight: "80vh",
                      height: "100%",
                      data: {
                        planDetails: ores,
                        type: "otherPlanDetails",
                      },
                    }
                  );
                  const selectedServices = await dialogRefDetails
                    .afterClosed()
                    .toPromise();
                  if (
                    selectedServices &&
                    selectedServices.selected &&
                    selectedServices.selected.length > 0
                  ) {
                    this.calculateBillService.otherPlanSelectedItems =
                      selectedServices.selected;
                    this.links[0].disabled = true;
                    this.links[2].disabled = true;
                    selectedServices.selected.forEach((slItem: any) => {
                      if (slItem.serviceid == 25) {
                        this.billingService.procesConsultationAddWithOutApi(
                          57,
                          selectedServices.selectedDoctor.specialisationid,
                          {
                            ...selectedServices.selectedDoctor,
                            price: slItem.price,
                          },
                          {
                            value: selectedServices.selectedDoctor.clinicId,
                          }
                        );
                      } else if ([41, 42, 43].includes(slItem.serviceid)) {
                        this.billingService.processInvestigationWithOutApi(
                          1,
                          slItem.serviceid,
                          {
                            title: slItem.itemName,
                            value: slItem.itemid,
                            originalTitle: slItem.itemName,
                            docRequired: false,
                            patient_Instructions: "",
                            item_Instructions: "",
                            serviceid: slItem.serviceid,
                            doctorid: 0,
                            price: slItem.price,
                          }
                        );
                      } else {
                        this.billingService.processProcedureAddWithOutApi(
                          1,
                          slItem.serviceid,
                          {
                            serviceid: slItem.serviceid,
                            value: slItem.itemid,
                            originalTitle: slItem.itemName,
                            docRequired: false,
                            popuptext: false,
                            price: slItem.price,
                          }
                        );
                      }
                    });
                    this.router.navigate(["bill"], {
                      queryParams: { maxId: this.formGroup.value.maxid },
                      relativeTo: this.route,
                      queryParamsHandling: "merge",
                    });
                  }
                }
              }
              this.checkServicesLogics();
            }
          });
      }
    } else {
      this.checkServicesLogics();
    }
  }

  async checkServicesLogics() {
    //check added for expired patient check GAV-936
    //check for mreged Max Id
    if (!this.expiredPatient || !this.secondaryMaxId) {
      if (this.billingService.unbilledInvestigations) {
      } else {
        let checkinvestigations = await this.http
          .get(
            BillingApiConstants.getinvestigationfromphysician(
              this.billingService.activeMaxId.iacode,
              this.billingService.activeMaxId.regNumber,
              this.cookie.get("HSPLocationId")
            )
          )
          .toPromise();
        if (checkinvestigations.length > 0) {
          this.investigationCheck(checkinvestigations);
          return;
        }
      }
    }
  }

  investigationCheck(checkinvestigations: any) {
    let dialogRef = this.matDialog.open(InvestigationWarningComponent, {
      width: "30vw",
      data: {},
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.showlist) {
        let uDialogRef = this.matDialog.open(UnbilledInvestigationComponent, {
          width: "60vw",
          height: "55vh",
          data: {
            investigations: checkinvestigations,
          },
        });
        uDialogRef.afterClosed().subscribe(async (ures: any) => {
          if (ures.process == 1) {
            if (ures.data.length > 0) {
              let referalDoctor: any = null;
              this.apiProcessing = true;
              let gotoTab = 1;
              let investigationExists = false;
              for (let i = 0; i < ures.data.length; i++) {
                const item = ures.data[i];

                if ([41, 42, 43].includes(item.serviceId)) {
                  investigationExists = true;
                  await this.billingService.processInvestigationAdd(
                    1,
                    item.serviceId,
                    {
                      title: item.testName,
                      value: item.testID,
                      originalTitle: item.testName,
                      docRequired: item.docRequired ? true : false,
                      patient_Instructions: item.patient_Instructions,
                      serviceid: item.serviceId,
                      doctorid: item.doctorid,
                      popuptext: item.popuptext,
                      precaution: item.precaution,
                      specializationId: item.specializationId,
                    }
                  );
                } else {
                  gotoTab = 3;
                  await this.billingService.processProcedureAdd(
                    1,
                    item.serviceId,
                    {
                      serviceid: item.serviceId,
                      value: item.testID,
                      originalTitle: item.testName,
                      docRequired: item.docRequired,
                      popuptext: item.popuptext,
                      specializationId: item.specializationId,
                      doctorid: item.doctorid,
                    }
                  );
                }

                if (item.doctorid)
                  referalDoctor = {
                    id: item.doctorid,
                    name: item.docName,
                    specialisation: "",
                  };
              }
              if (referalDoctor) {
                this.billingService.setReferralDoctor(referalDoctor);
              }
              this.apiProcessing = false;
              this.billingService.servicesTabStatus.next({
                goToTab: investigationExists ? 1 : gotoTab,
              });
            }
            this.billingService.unbilledInvestigations = true;
          }
        });
      } else {
        this.billingService.unbilledInvestigations = true;
      }
    });
  }

  inPatientCheck(dtPatientPastDetails: any) {
    if (
      dtPatientPastDetails[0] &&
      dtPatientPastDetails[0].id > 0 &&
      dtPatientPastDetails[0].data == 1
    ) {
      const dialogRef = this.messageDialogService.info(
        "This Patient is an InPatient"
      );
      dialogRef
        .afterClosed()
        .pipe(takeUntil(this._destroying$))
        .subscribe((result) => {
          this.payDueCheck(dtPatientPastDetails);
        });
    } else {
      this.payDueCheck(dtPatientPastDetails);
    }
  }

  linkedMaxId(maxId: string, iacode: string, regNumber: number) {
    const dialogRef = this.messageDialogService.confirm(
      "",
      `This Max ID has been mapped with  ${maxId}, do you want to proceed?`
    );
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this._destroying$))
      .subscribe((result) => {
        if ("type" in result) {
          if (result.type == "yes") {
            this.formGroup.controls["maxid"].setValue(maxId);
            let regNumber = Number(maxId.split(".")[1]);
            let iacode = maxId.split(".")[0];
            this.secondaryMaxId = false;
            this.registrationDetails(iacode, regNumber);
          } else {
            this.secondaryMaxId = true;
            this.registrationDetails(iacode, regNumber);
          }
        }
      });
  }

  addRegistrationCharges(resultData: any) {
    const dialogRef = this.messageDialogService.confirm(
      "",
      `Registration charges is not billed for this patient. Do you want to Bill ?`
    );
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this._destroying$))
      .subscribe((result) => {
        if ("type" in result) {
          if (result.type == "yes") {
            //check added for expired patient check GAV-936
            //check for mergedMaxId
            if (!this.expiredPatient || !this.secondaryMaxId) {
              this.billingService.processProcedureAdd(1, "24", {
                serviceid: 24,
                value: 30632,
                originalTitle: "Registration Charges",
                docRequired: false,
                popuptext: "",
              });
            }
            this.inPatientCheck(resultData.dtPatientPastDetails);
          } else {
            this.inPatientCheck(resultData.dtPatientPastDetails);
          }
        }
      });
  }

  appointmentSearch() {
    const appointmentSearch = this.matDialog.open(AppointmentSearchComponent, {
      maxWidth: "100vw",
      width: "98vw",
      data: {
        phoneNumber: this.formGroup.value.mobile,
      },
    });

    appointmentSearch
      .afterClosed()
      .pipe(takeUntil(this._destroying$))
      .subscribe((result) => {
        if (result && result.data) {
          let apppatientDetails = result.data.added[0];
          if (apppatientDetails.maxId.split(".")[1] == "") {
            this.clear();
            this.snackbar.open("Invalid Max ID", "error");
          } else {
            let maxid = apppatientDetails.maxId;
            // apppatientDetails.iAcode + "." + apppatientDetails.registrationno;
            this.formGroup.controls["maxid"].setValue(maxid);
            this.apiProcessing = true;
            this.patient = false;
            //this.getPatientDetailsByMaxId();
            this.router.navigate([], {
              queryParams: { maxId: this.formGroup.value.maxid },
              relativeTo: this.route,
              queryParamsHandling: "merge",
            });
          }
        }
      });
  }
  dms() {
    if (this.dmsProcessing) return;
    this.dmsProcessing = true;
    const patientDetails =
      this.patientDetails.dsPersonalDetails.dtPersonalDetails1[0];
    this.http
      .get(
        ApiConstants.PatientDMSDetail(
          patientDetails.iacode,
          patientDetails.registrationno
        )
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe((resultData: DMSrefreshModel[]) => {
        this.matDialog.open(DMSComponent, {
          width: "100vw",
          maxWidth: "90vw",
          maxHeight: "80vh",
          data: {
            list: resultData,
            maxid: patientDetails.iacode + "." + patientDetails.registrationno,
            firstName: patientDetails.firstname,
            lastName: patientDetails.lastname,
          },
        });
        this.dmsProcessing = false;
      });
  }

  visitHistory() {
    this.matDialog.open(VisitHistoryComponent, {
      width: "70%",
      height: "50%",
      data: {
        maxid: this.formGroup.value.maxid,
        docid: "",
      },
    });
  }

  clear() {
    this._destroying$.next(undefined);
    this._destroying$.complete();
    this.apiProcessing = false;
    this.patient = false;
    this.secondaryMaxId = false;
    this.formGroup.reset();
    this.patientName = "";
    this.ssn = "";
    this.dob = "";
    this.country = "";
    this.gender = "";
    this.age = "";
    this.billingService.clear();
    this.calculateBillService.dsTaxCode = {};
    this.questions[0].readonly = false;
    this.questions[1].readonly = false;
    this.questions[2].readonly = false;
    this.expiredPatient = false;
    this.categoryIcons = [];
    this.questions[0].questionClasses = "";
    this.formGroup.controls["maxid"].setValue(
      this.cookie.get("LocationIACode") + "."
    );
    this.questions[0].elementRef.focus();
    this.router.navigate(["services"], {
      queryParams: {},
      relativeTo: this.route,
    });
    this.questions[0].elementRef.focus();
    this.formGroup.controls["company"].enable();
    this.formGroup.controls["corporate"].enable();
    this.links[0].disabled = false;
    this.links[1].disabled = false;
    this.links[2].disabled = false;
  }

  getAllCompany() {
    this.http
      .get(
        BillingApiConstants.getcompanydetail(
          Number(this.cookie.get("HSPLocationId"))
        )
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe((data: any[]) => {
        this.companyData = data;
        this.formGroup.controls["corporate"].disable();
        this.billingService.setCompanyData(data);
        data.unshift({ name: "Select", id: -1 });
        this.questions[3].options = data.map((a: any) => {
          return { title: a.name, value: a.id, company: a };
        });
        this.questions[3] = { ...this.questions[3] };
      });
  }

  openIOM() {
    this.matDialog.open(IomPopupComponent, {
      width: "70%",
      height: "90%",
      data: {
        company: this.formGroup.value.company.value,
      },
    });
  }

  getAllCorporate() {
    this.http
      .get(ApiConstants.getCorporatemasterdetail)
      .pipe(takeUntil(this._destroying$))
      .subscribe((resultData: getCorporatemasterdetail) => {
        this.coorporateList = resultData.oCompanyName;
        this.creditcorporateList = resultData.ohsplocation;

        this.billingService.setCorporateData(resultData.oCompanyName);
        this.billingService.setcreditcorporateData(resultData.ohsplocation);
        resultData.oCompanyName.unshift({ name: "Select", id: -1 });
        this.questions[4].options = this.coorporateList.map((l: any) => {
          return { title: l.name, value: l.id };
        });
        this.questions[4] = { ...this.questions[4] };
      });
  }

  async getNextQueue() {
    let queuedetail = await this.http
      .get(
        BillingApiConstants.getnextqueueno(
          Number(this.cookie.get("HSPLocationId")),
          Number(this.cookie.get("StationId")),
          this.counterId
        )
      )
      .toPromise();

    if (queuedetail) {
      this.queueId = queuedetail[0].id;
      this.qmsSeqNo = queuedetail[0].seqNo;
      if (this.queueId) {
        this.disableStopQueueBtn = false;
      }
    }
  }

  async doneQueue() {
    let res = await this.http
      .post(BillingApiConstants.donequeueno(this.queueId, this.counterId), {})
      .toPromise();

    if (res) {
      this.queueId = 0;
      this.qmsSeqNo = "";
      this.disableStopQueueBtn = true;
    }
  }

  async loadGrid(formdata: any): Promise<any> {
    let lookupdata: string | any[];
    if (!formdata.data) {
      lookupdata = await this.lookupService.searchPatient({
        data: formdata,
      });
    } else {
      lookupdata = await this.lookupService.searchPatient(formdata);
    }
    if (lookupdata.length == 1) {
      if (lookupdata[0] && "maxid" in lookupdata[0]) {
        this.formGroup.controls["maxid"].setValue(lookupdata[0]["maxid"]);
        this.apiProcessing = true;
        this.patient = false;
        this.getAllCompany();
        this.getAllCorporate();
        this.getPatientDetailsByMaxId();
      }
    } else if (lookupdata.length > 1) {
      const similarSoundDialogref = this.matDialog.open(SimilarPatientDialog, {
        width: "60vw",
        height: "80vh",
        data: {
          searchResults: lookupdata,
        },
      });

      similarSoundDialogref
        .afterClosed()
        .pipe(takeUntil(this._destroying$))
        .subscribe(async (result: any) => {
          if (result) {
            console.log(result.data["added"][0].maxid);
            let maxID = result.data["added"][0].maxid;
            this.formGroup.controls["maxid"].setValue(maxID);
            this.apiProcessing = true;
            this.patient = false;
            this.getAllCompany();
            this.getAllCorporate();
            this.getPatientDetailsByMaxId();
          }
        });
    }
  }
}

@Component({
  selector: "out-patients-similar-patient-search",
  templateUrl: "similarPatient-dialog.html",
})
export class SimilarPatientDialog {
  config: any = BillingStaticConstants.similarPatientTableConfig;
  @ViewChild("patientDetail") tableRows: any;
  constructor(
    private dialogRef: MatDialogRef<SimilarPatientDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  ngOnInit(): void {
    console.log(this.data.searchResults);
  }
  ngAfterViewInit() {
    this.getMaxID();
  }

  getMaxID() {
    this.tableRows.selection.changed.subscribe((res: any) => {
      this.dialogRef.close({ data: res });
    });
  }
}
