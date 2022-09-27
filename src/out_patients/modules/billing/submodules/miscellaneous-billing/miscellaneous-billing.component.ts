import { DatePipe } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ApiConstants } from "@core/constants/ApiConstants";
import { SimilarSoundPatientResponse } from "@core/models/getsimilarsound.Model";
import { patientRegistrationModel } from "@core/models/patientRegistrationModel.Model";
import { GetCompanyDataInterface } from "@core/types/employeesponsor/getCompanydata.Interface";
import { PatientDetail } from "@core/types/patientDetailModel.Interface";
import { VisitHistoryComponent } from "@shared/modules/visit-history/visit-history.component";
import { SimilarPatientDialog } from "@modules/registration/submodules/op-registration/op-registration.component";
import { CookieService } from "@shared/services/cookie.service";
import { DbService } from "@shared/services/db.service";
import { HttpService } from "@shared/services/http.service";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";
import { Subject, takeUntil } from "rxjs";
import { AnyCatcher } from "rxjs/internal/AnyCatcher";
import { DipositeDetailModel } from "../../../../core/types/dipositeDetailModel.Interface";
import { miscPatientDetail } from "../../../../core/models/miscPatientDetail.Model";
import { Registrationdetails } from "../../../../core/types/registeredPatientDetial.Interface";
import { GstComponent } from "./billing/gst/gst.component";
import { MiscService } from "./MiscService.service";
import { MakedepositDialogComponent } from "../deposit/makedeposit-dialog/makedeposit-dialog.component";
import { DMSrefreshModel } from "@core/models/DMSrefresh.Model";
import { DMSComponent } from "@modules/registration/submodules/dms/dms.component";
import { BillingApiConstants } from "../billing/BillingApiConstant";
import { MaxHealthSnackBarService } from "@shared/ui/snack-bar";
import { BillingService } from "../billing/billing.service";
import { PatientService } from "@core/services/patient.service";


import * as moment from "moment";
import { PaydueComponent } from "../billing/prompts/paydue/paydue.component";
import { ShowPlanDetilsComponent } from "../billing/prompts/show-plan-detils/show-plan-detils.component";
import { isTypedRule } from "tslint";
@Component({
  selector: "out-patients-miscellaneous-billing",
  templateUrl: "./miscellaneous-billing.component.html",
  styleUrls: ["./miscellaneous-billing.component.scss"],
})
export class MiscellaneousBillingComponent implements OnInit {
  constructor(
    public matDialog: MatDialog,
    private formService: QuestionControlService,
    private router: Router,
    private http: HttpService,
    public cookie: CookieService,
    private datepipe: DatePipe,
    private messageDialogService: MessageDialogService,
    private db: DbService,
    private Misc: MiscService,
    public billingService: BillingService,
    private snackbar: MaxHealthSnackBarService,
    private patientService: PatientService
  ) { }
  totalDeposit = 0;
  categoryIcons: any;
  apiProcessing = false;
  moment = moment;
  setItemsToBill: any = [];
  expiredPatient = false
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
  @ViewChild("selectedServices") selectedServicesTable: any;
  items: any[] = [];
  addItem(newItem: any) {
    this.items.push(newItem);
  }
  links = [
    {
      title: "Bills",
      path: "bill",
    },
    {
      title: "Credit Details",
      path: "credit-details",
    },
  ];
  activeLink = this.links[0];

  complanyList!: GetCompanyDataInterface[];

  corporateId = '';
  companyId = '';
  coorporateList: { id: number; name: string }[] = [] as any;
  miscFormData = {
    type: "object",
    title: "",
    properties: {
      maxid: {
        type: "string",
        defaultValue: this.cookie.get("LocationIACode") + ".",
      },

      mobileNo: {
        type: "tel",
        pattern: "^[1-9]{1}[0-9]{9}",
      },
      company: {
        type: "autocomplete",
        options: this.complanyList,
        placeholder: "Select"

      },
      corporate: {
        type: "autocomplete",
        options: this.coorporateList,
        placeholder: "Select"

      },
      narration: {
        type: "buttonTextarea",
      },

      b2bInvoiceType: {
        type: "checkbox",
        options: [
          {
            title: "B2B Invoice",
          },
        ],
      },
    },
  };

  patientDetails!: any;
  serviceselectedList: [] = [] as any;
  miscHeaderDetails: [] = [] as any;
  miscForm!: FormGroup;
  questions: any;
  question: any;
  private readonly _destroying$ = new Subject<void>();
  disableBtn: boolean = false;


  dtPatientPastDetails = [];
  dsPersonalDetails: any = [];

  ngOnInit(): void {
    this.setItemsToBill.enableBill = false;
    this.setItemsToBill.enablecompanyId = true;
    this.setItemsToBill.corporateId = 0;
    this.setItemsToBill.companyId = 0;
    this.Misc.setMiscBillFormData(this.setItemsToBill);
    let formResult = this.formService.createForm(
      this.miscFormData.properties,
      {}
    );

    this.miscForm = formResult.form;
    this.questions = formResult.questions;

    this.lastUpdatedBy = this.cookie.get("UserName");
    this.getssnandmaxid();
    this.miscForm.controls["company"].disable();
    this.miscForm.controls["corporate"].disable();
  }
  lastUpdatedBy: string = "";
  currentTime: string = new Date().toLocaleString();

  ngAfterViewInit(): void {
    this.formEvents();
  }

  formEvents() {
    //ON MAXID CHANGE

    this.questions[0].elementRef.addEventListener("keypress", (event: any) => {
      if (event.key === "Enter") {
        event.preventDefault();
        this.getPatientDetailsByMaxId();

      }
    });
    this.questions[1].elementRef.addEventListener("keypress", (event: any) => {
      if (event.key === "Enter") {
        this.apiProcessing = true;
        this.onPhoneModify();

      }
    });
    this.questions[4].elementRef.addEventListener("keypress", (event: any) => {
      if (event.key === "Enter") {
        this.questions[4].elementRef.focus();
      }
    });
    this.miscForm.controls["company"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value: any) => {

        if (value.value) {
          this.Misc.setCompany(value.value);
          this.companyId = value.value;
          this.setItemsToBill.enablecompanyId = true;
          this.setItemsToBill.companyId = value.value;
          this.Misc.setMiscBillFormData(this.setItemsToBill);
          this.setItemsToBill.companyId = this.miscForm.value.company
          this.Misc.setCalculateBillItems(this.setItemsToBill);
          this.Misc.setPatientDetail(this.patientDetail);
        }
      });
    this.miscForm.controls["corporate"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value: any) => {
        if (value.value) {
          this.corporateId = value.value;
          this.setItemsToBill.corporateId = value.value;
          this.Misc.setMiscBillFormData(this.setItemsToBill);
          this.Misc.setPatientDetail(this.patientDetail);
          this.setItemsToBill.corporateId = this.miscForm.value.corporate;
          this.Misc.setCalculateBillItems(this.setItemsToBill);
        }
      });
    this.miscForm.controls["b2bInvoiceType"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value: any) => {
        //console.log(value, "b2bInvoiceType");
        if (value === true) {
          this.setItemsToBill.b2bInvoiceType = "B2B"
        }
        else {
          this.setItemsToBill.b2bInvoiceType = "B2C"
        }
        this.Misc.setMiscBillFormData(this.setItemsToBill);
      });
    // this.questions[0].elementRef.addEventListener(
    //   "blur",
    //   if (!this.miscForm.value.maxid.value) {
    //     this.setItemsToBill.enableBill = false;
    //     this.Misc.setMiscBillFormData(this.setItemsToBill);
    //   }
    // );
  }

  getRemark() {
    this.patientDetail.narration = this.miscForm.value.narration;
    this.Misc.setPatientDetail(this.patientDetail);
  }
  // onPhoneModify() {
  //   this.getSimilarPatientDetails();
  // }
  similarContactPatientList: SimilarSoundPatientResponse[] = [];
  MaxIDExist: boolean = false;

  onPhoneModify() {
    // subscribe to component event to know when to deleteconst selfDeleteSub = component.instance.deleteSelf

    this.matDialog.closeAll();
    //console.log(this.similarContactPatientList.length);
    //if (!this.MaxIDExist) {
    this.http
      .post(ApiConstants.similarSoundPatientDetail, {
        phone: this.miscForm.value.mobileNo,
      })
      .pipe(takeUntil(this._destroying$))
      .subscribe(
        (resultData: SimilarSoundPatientResponse[]) => {
          this.apiProcessing = false;
          this.similarContactPatientList = resultData;
          //console.log(this.similarContactPatientList);
          if (this.similarContactPatientList.length == 1) {
            this.getAllCompany();
            this.getAllCorporate();
            this.miscForm.controls["company"].enable();
            this.miscForm.controls["corporate"].enable();
            //console.log(this.similarContactPatientList[0]);
            let maxID = this.similarContactPatientList[0].maxid;
            this.miscForm.controls["maxid"].setValue(maxID);
            // this.getPatientDetailsByMaxId();
          } else {
            if (this.similarContactPatientList.length != 0) {
              const similarSoundDialogref = this.matDialog.open(
                SimilarPatientDialog,
                {
                  width: "60vw",
                  height: "80vh",
                  data: {
                    searchResults: this.similarContactPatientList,
                  },
                }
              );
              similarSoundDialogref
                .afterClosed()
                .pipe(takeUntil(this._destroying$))
                .subscribe((result) => {
                  if (result) {
                    //console.log(result.data["added"][0].maxid);
                    let maxID = result.data["added"][0].maxid;
                    this.miscForm.controls["maxid"].setValue(maxID);
                    this.getPatientDetailsByMaxId();
                  }
                  //console.log("seafarers dialog was closed");
                  this.similarContactPatientList = [];
                });
            } else {
              //console.log("no data found");
            }
          }
        },
        (error) => {
          //console.log(error);
          this.messageDialogService.info(error.error);
        }
      );
    // }
  }
  clearForm() {

    this._destroying$.next(undefined);
    this._destroying$.complete();
    this.setItemsToBill.enableBill = false;
    this.Misc.setMiscBillFormData(this.setItemsToBill);
    this.Misc.clearMiscBlling();


    this.patientName = "";
    this.ssn = "";
    this.dob = "";
    this.country = "";
    this.gender = "";
    this.age = "";
    this.billingService.clear();
    this.questions[0].readonly = false;
    this.questions[1].readonly = false;
    this.miscForm.controls["company"].disable();
    this.miscForm.controls["corporate"].disable();
    // this.questions[2].readonly = false;
    this.categoryIcons = [];
    this.questions[0].questionClasses = "";
    this.expiredPatient = false;

    this.questions[0].elementRef.focus();
    this.miscForm.reset();
    this.miscForm.controls["maxid"].setValue(
      this.cookie.get("LocationIACode") + "."
    );
  }

  getssnandmaxid() {
    let iacode = this.miscForm.value.maxid.split(".")[0];
    let regNumber = Number(this.miscForm.value.maxid.split(".")[1]);
    this.http
      .get(
        ApiConstants.getssnandmaxid(
          iacode,
          regNumber,
          this.ssn
        )
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe(
        (resultData: Registrationdetails) => { //console.log(resultData, "SSN")
        })
  }
  async getPatientDetailsByMaxId() {
    let regNumber = Number(this.miscForm.value.maxid.split(".")[1]);
    let iacode = this.miscForm.value.maxid.split(".")[0];
    if ((regNumber != 0) && (regNumber > 0)) {
      const expiredStatus = await this.checkPatientExpired(iacode, regNumber);
      if (expiredStatus) {
        this.expiredPatient = true;
        const dialogRef = this.messageDialogService.error(
          "Patient is an Expired Patient!"
        );
        await dialogRef.afterClosed().toPromise();
      }
      this.getSimilarSoundDetails(iacode, regNumber);
      this.disableBtn = true;
      this.http.get(ApiConstants.getregisteredpatientdetailsForMisc(
        iacode,
        regNumber,
        Number(this.cookie.get("HSPLocationId"))
        //67
      )
      )
        .pipe(takeUntil(this._destroying$)).subscribe((resultData: Registrationdetails) => {
          this.patientDetails = resultData;
          if (this.patientDetails.dsPersonalDetails.dtPersonalDetails1.length != 0) {
            this.questions[0].readonly = true;
            this.questions[1].readonly = true;
            this.getAllCompany();
            this.getAllCorporate();
            this.miscForm.controls["company"].enable();
            this.miscForm.controls["corporate"].enable();
            //this.questions[2].readonly = true;

            this.patientDetails = resultData;
            this.MaxIDExist = true;

            this.setValuesToMiscForm(this.patientDetails);
            this.putCachePatientDetail(this.patientDetails);

            this.dsPersonalDetails = resultData.dsPersonalDetails;
            this.dtPatientPastDetails = resultData.dtPatientPastDetails;

            let cashLimit = this.dsPersonalDetails.dtPersonalDetails1[0].cashLimit;
            this.setItemsToBill.cashLimit = cashLimit;
            this.setItemsToBill.enableBill = true;
            this.Misc.setMiscBillFormData(this.setItemsToBill);
            this.Misc.setCashLimit(cashLimit);

            // this.getDipositedAmountByMaxID();
          } else {
            this.snackbar.open("Invalid Max ID", "error");
            this.disableBtn = false;
          }
        },
          (error) => {
            if (error.error == "Patient Not found") {
              this.setMaxIdError(iacode, regNumber);
              this.MaxIDExist = false;
            }
            this.snackbar.open("Invalid Max ID", "error");
            this.disableBtn = false;
          }
        );
    }
    else if (regNumber === 0 || iacode === 0) {
      this.snackbar.open("Not a valid registration number", "error")
    }
    else {
      this.snackbar.open("Invalid Max ID", "error")
    }




    const expiredStatus = await this.checkPatientExpired(iacode, regNumber);
    if (expiredStatus) {
      this.snackbar.open("Patient is an Expired Patient!", 'error')
      return;
    }






  }
  getSimilarSoundDetails(iacode: string, regNumber: number) {
    this.http
      .get(BillingApiConstants.getsimilarsoundopbilling(iacode, regNumber))
      .pipe(takeUntil(this._destroying$))
      .subscribe(
        (resultData: any) => {
          if (resultData && resultData.length > 0) {
            this.getAllCompany();
            this.getAllCorporate();
            this.miscForm.controls["company"].enable();
            this.miscForm.controls["corporate"].enable();
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
          this.snackbar.open("Invalid Max ID", "error");
          this.apiProcessing = false;
          //this.patient = false;
        }
      );
  }
  async checkPatientExpired(iacode: string, regNumber: number) {
    const res = await this.http
      .get(
        BillingApiConstants.getforegexpiredpatientdetails(
          iacode,
          Number(regNumber)
        )
      )
      .toPromise();
    if (res.length > 0) {
      if (res[0].flagexpired == 1) {
        return true;
      }
    }
    return false;
  }

  linkedMaxId(maxId: string, iacode: string, regNumber: number) {
    const dialogRef = this.messageDialogService.confirm(
      "",
      `This Record has been mapped with ${maxId}. Do you want to Pick this number for further transaction ?`
    );
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this._destroying$))
      .subscribe((result) => {
        if ("type" in result) {
          if (result.type == "yes") {
            this.miscForm.controls["maxid"].setValue(maxId);
            let regNumber = Number(maxId.split(".")[1]);
            let iacode = maxId.split(".")[0];
            this.registrationDetails(iacode, regNumber);
          } else {
            this.registrationDetails(iacode, regNumber);
          }
        }
      });
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
            this.getAllCompany();
            this.getAllCorporate();
            this.miscForm.controls["company"].enable();
            this.miscForm.controls["corporate"].enable();
            this.setValuesToMiscForm(this.patientDetails);
            if (this.billingService.todayPatientBirthday) {
              const birthdayDialog = this.messageDialogService.info(
                "It’s their birthday today"
              );
              await birthdayDialog.afterClosed().toPromise();
            }



            if (
              this.patientDetails.dsPersonalDetails.dtPersonalDetails1.length >
              0
            ) {
              this.setValuesToMiscForm(this.patientDetails);
              this.putCachePatientDetail(this.patientDetails);
              if (
                this.patientDetails.dsPersonalDetails.dtPersonalDetails1[0].pPagerNumber == "ews"
              ) {
                this.miscForm.controls["company"].disable();
                this.miscForm.controls["corporate"].disable();
                // this.links[2].disabled = true;
              }
              // this.billingService.setPatientDetails(
              //   this.patientDetails.dsPersonalDetails.dtPersonalDetails1[0]
              // );
              this.categoryIcons =
                this.patientService.getCategoryIconsForPatientAny(
                  this.patientDetails.dsPersonalDetails.dtPersonalDetails1[0]
                );
              const patientDetails =
                this.patientDetails.dsPersonalDetails.dtPersonalDetails1[0];
              this.billingService.setActiveMaxId(
                this.miscForm.value.maxid,
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
                    //  if (!this.orderId) {
                    this.startProcess(
                      patientDetails,
                      resultData,
                      iacode,
                      regNumber
                    );
                    //}
                  });
              } else {
                //   if (!this.orderId) {
                this.startProcess(
                  patientDetails,
                  resultData,
                  iacode,
                  regNumber
                );
                //  }
              }
            }
          } else {
            this.apiProcessing = false;
            //  this.patient = false;
            this.snackbar.open("Invalid Max ID", "error");
          }

          //SETTING PATIENT DETAILS TO MODIFIEDPATIENTDETAILOBJ
        },
        (error) => {
          if (error.error == "Patient Not found") {
            this.miscForm.controls["maxid"].setValue(iacode + "." + regNumber);
            //this.formGroup.controls["maxid"].setErrors({ incorrect: true });
            //this.questions[0].customErrorMessage = "Invalid Max ID";
            this.snackbar.open("Invalid Max ID", "error");
          }
          this.apiProcessing = false;
          //  this.patient = false;
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
    //   this.getforonlinebilldetails(iacode, regNumber);
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
            this.billingService.addToProcedure({
              sno: 1,
              procedures: "Registration Charge",
              qty: 1,
              specialisation: "30632",
              doctorName: "24",
              price: 0,
              unitPrice: 0,
              itemid: "",
              priorityId: "",
              serviceId: "",
            });
            this.inPatientCheck(resultData.dtPatientPastDetails);
          } else {
            this.inPatientCheck(resultData.dtPatientPastDetails);
          }
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
  payDueCheck(dtPatientPastDetails: any) {
    if (
      dtPatientPastDetails[4] &&
      dtPatientPastDetails[4].id > 0 &&
      dtPatientPastDetails[4].data > 0
    ) {
      const dialogRef = this.matDialog.open(PaydueComponent, {
        width: "30vw",
        data: {
          dueAmount: dtPatientPastDetails[4].data,
          maxId: this.miscForm.value.maxid,
        },
      });
    } else {
      this.planDetailsCheck(dtPatientPastDetails);
    }
  }
  planDetailsCheck(dtPatientPastDetails: any) {
    if (
      dtPatientPastDetails[5] &&
      dtPatientPastDetails[5].id == 6 &&
      dtPatientPastDetails[5].data == 1
    ) {
      const dialogRef = this.matDialog.open(ShowPlanDetilsComponent, {
        width: "40vw",
        data: {
          planDetails: [],
        },
      });
    }
  }

  //SETTING ERROR FOR MAX ID
  setMaxIdError(iacode: any, regNumber: any) {
    this.miscForm.controls["maxid"].setValue(iacode + "." + regNumber);
    this.miscForm.controls["maxid"].setErrors({ incorrect: true });
    this.questions[0].customErrorMessage = "Invalid Max ID";
  }
  patientName!: string;
  age!: string | undefined;;
  gender!: string;
  dob!: string;
  country!: string;
  ssn!: string;
  pan!: string;

  //SETTING THE VALUES TO PATIENT DETAIL
  setValuesToMiscForm(pDetails: Registrationdetails) {
    if (pDetails.dsPersonalDetails.dtPersonalDetails1.length == 0) {
      this.snackbar.open("Invalid Max ID", "error");
      //this.patient = false;
      this.apiProcessing = false;
      return;
    }
    let patientDetails = pDetails.dsPersonalDetails.dtPersonalDetails1[0];
    this.miscForm.controls["mobileNo"].setValue(patientDetails.pCellNo);
    this.patientName = patientDetails.firstname + " " + patientDetails.lastname;
    this.ssn = patientDetails.ssn;
    this.age = this.onageCalculator(patientDetails.dateOfBirth);
    this.gender = patientDetails.genderName;
    this.country = patientDetails.nationalityName;
    this.ssn = patientDetails.ssn;
    this.dob =
      "" + this.datepipe.transform(patientDetails.dateOfBirth, "dd/MM/yyyy");
    this.pan = patientDetails.paNno;
    console.log(this.pan, "miscpan")
    this.setCompany(patientDetails);
    this.setCorporate(patientDetails);

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
      if (diffMonths == 0 && diffDays == 0) {
        this.snackbar.open("It’s their birthday today", "info");
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
  setCompany(patientDetails: PatientDetail) {
    if (patientDetails.companyid != 0) {
      let company = this.filterList(
        this.complanyList,
        patientDetails.companyid
      )[0];
      this.miscForm.controls["company"].setValue({
        title: company.name,
        value: company.id,
      });
    }
  }
  setCorporate(patientDetails: PatientDetail) {
    let corporate = this.filterList(
      this.coorporateList,
      patientDetails.corporateid
    )[0];

    if (patientDetails.corporateid != 0) {
      this.miscForm.controls["corporate"].setValue({
        title: corporate.name,
        value: corporate.id,
      });
    }
  }

  getAllCompany() {
    //let location = 67;
    let location = Number(this.cookie.get("HSPLocationId"));
    this.http
      .get(BillingApiConstants.getcompanydetail(location))
      .pipe(takeUntil(this._destroying$))
      .subscribe((data) => {
        //console.log(data);
        this.complanyList = data as GetCompanyDataInterface[];
        this.questions[2].options = this.complanyList.map((a) => {
          return { title: a.name, value: a.id };
        });
      });
  }

  getAllCorporate() {
    this.http
      .get(ApiConstants.getCorporate)
      .pipe(takeUntil(this._destroying$))
      .subscribe((resultData: { id: number; name: string }[]) => {
        this.coorporateList = resultData;
        // this.titleList.unshift({ id: 0, name: "-Select-", sex: 0, gender: "" });
        this.questions[3].options = this.coorporateList.map((l) => {
          return { title: l.name, value: l.id };
        });
      });
  }

  dipositeDetail!: DipositeDetailModel;
  getDipositedAmountByMaxID() {
    let regNumber = Number(this.miscForm.value.maxid.split(".")[1]);
    let iacode = this.miscForm.value.maxid.split(".")[0];

    this.http
      .get(
        //   ApiConstants.getDipositedAmountByMaxID(
        //     "BLKH", 1020369,
        //     67)
        // )
        //(
        ApiConstants.getregisteredpatientdetailsForMisc(
          iacode,
          regNumber,
          Number(this.cookie.get("HSPLocationId"))
        )
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe(
        (resultData: any) => {
          //console.log(resultData, "fulldepo")

          resultData.forEach((element: any) => {
            this.totalDeposit += element.balanceamount;
          });
          if (this.totalDeposit > 0) {
            this.setItemsToBill.totalDeposit = this.totalDeposit;
            this.Misc.setMiscBillFormData(this.setItemsToBill);
          }
        },
        (error) => {

        }
      );
  }
  openhistory() {
    this.matDialog.open(VisitHistoryComponent, {
      width: "70%",
      height: "50%",
      data: {
        maxid: this.miscForm.value.maxid,
      },
    });
  }

  dms() {

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
          width: "80vw",
          height: "80vh",
          maxWidth: "90vw",
          data: {
            list: resultData,
            maxid: patientDetails.iacode + "." + patientDetails.registrationno,
            firstName: patientDetails.firstname,
            lastName: patientDetails.lastname,
          },
        });
        // this.dmsProcessing = false;
      });
  }
  patientDetail!: miscPatientDetail;
  putCachePatientDetail(patient: Registrationdetails) {
    let patientDetail = patient.dsPersonalDetails.dtPersonalDetails1[0];
    this.patientDetail = new miscPatientDetail(
      patientDetail.registrationno,
      patientDetail.iacode,
      0,
      0,
      0,
      Number(this.cookie.get("HSPLocationId")),
      0,
      0,
      0, //  "this.miscForm.value.company.value",
      Number(this.cookie.get("UserName")),
      0,
      0,
      Number(this.cookie.get("HSPLocationId")),
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0, //this.miscForm.value.corporate.value
      "", //this.miscForm.value.corporate.title
      0,
      0,
      "",
      this.miscForm.value.narration,
      0
    );
    // this.db.putCachePatientDetail(this.patientDetail);

    // //console.log(this.db.getCachePatientDetail());
    this.Misc.setPatientDetail(this.patientDetail);
    localStorage.setItem("patientDetail", this.patientDetail.toString());
  }
  filterList(list: any[], id: any): any {
    return list.filter(function (item) {
      return item.id === id;
    });
  }

  visitHistory() {
    this.matDialog.open(VisitHistoryComponent, {
      width: "70%",
      height: "50%",
      data: {
        maxid: this.miscForm.value.maxid,
        docid: "",
      },
    });
  }

}
