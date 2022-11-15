import { DatePipe } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
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
import { IomPopupComponent } from "../billing/prompts/iom-popup/iom-popup.component";
import { distinctUntilChanged } from "rxjs/operators";
import { OnlineAppointmentComponent } from "../billing/prompts/online-appointment/online-appointment.component";
import { CalculateBillService } from "@core/services/calculate-bill.service";
import { getCorporatemasterdetail } from "@core/types/billdetails/getCorporatemasterdetail.Interface";

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
    public Misc: MiscService,
    public billingService: BillingService,
    private snackbar: MaxHealthSnackBarService,
    private patientService: PatientService,
    private calculateBillService: CalculateBillService,
    private route: ActivatedRoute
  ) {}
  totalDeposit = 0;
  categoryIcons: any;
  apiProcessing = false;
  moment = moment;
  setItemsToBill: any = [];
  expiredPatient = false;
  miscBillCache: any = [];
  isenableNarration: boolean = false;
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
  links: any = [
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
  companyList!: GetCompanyDataInterface[];
  corporateId = "";
  companyId = "";
  coorporateList: any = [];
  creditcorporateList: any = [];

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
        title: "Mobile Number",
        pattern: "^[1-9]{1}[0-9]{9}",
      },
      company: {
        type: "autocomplete",
        options: this.companyList,
        placeholder: "Select",
      },
      corporate: {
        type: "autocomplete",
        options: this.coorporateList,
        placeholder: "Select",
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
    let formResult = this.formService.createForm(
      this.miscFormData.properties,
      {}
    );

    this.miscForm = formResult.form;
    this.questions = formResult.questions;

    this.lastUpdatedBy = this.cookie.get("UserName");
    this.getAllCompany();
    this.getAllCorporate();
    //Enable narration for BLKH & nanavati
    if (
      Number(this.cookie.get("HSPLocationId")) === 67 ||
      Number(this.cookie.get("HSPLocationId")) === 69
    ) {
      this.isenableNarration = true;
    } else {
      this.isenableNarration = false;
    }

    this.getssnandmaxid();
    // this.getAllCompany();
    this.miscForm.controls["company"].disable();
    this.miscForm.controls["corporate"].disable();
    this.setItemsToBill.enableBill = false;
    this.setItemsToBill.enablecompanyId = true;
    this.setItemsToBill.corporateId = 0;
    this.setItemsToBill.companyId = 0;

    this.Misc.misccompanyChangeEvent.subscribe((res: any) => {
      if (res.from != "header") {
        this.miscForm.controls["company"].setValue(res.company, {
          emitEvent: false,
        });
      }
    });
    this.Misc.misccorporateChangeEvent.subscribe((res: any) => {
      if (res.from != "header") {
        this.miscForm.controls["corporate"].setValue(res.corporate, {
          emitEvent: false,
        });
        if (res.from == "disable") {
          this.miscForm.controls["corporate"].disable();
        } else if (this.miscForm.value.company) {
          this.miscForm.controls["corporate"].enable();
        }
      }
    });
  }
  lastUpdatedBy: string = "";
  currentTime: string = new Date().toLocaleString();

  ngAfterViewInit(): void {
    if (this.miscForm.value.maxid == this.questions[0].defaultValue) {
      this.questions[0].elementRef.focus();
    }
    this.formEvents();
  }

  formEvents() {
    if (this.Misc.selectedCompanyVal > 0) {
      this.miscForm.controls["company"].setValue(this.Misc.selectedCompanyVal);
    }
    this.questions[0].elementRef.addEventListener("keypress", (event: any) => {
      if (event.key === "Enter") {
        event.preventDefault();
        this.apiProcessing = true;
        this.getPatientDetailsByMaxId();
      }
    });
    this.questions[1].elementRef.addEventListener("keypress", (event: any) => {
      if (event.key === "Enter") {
        this.apiProcessing = true;
        this.onPhoneModify();
      }
    });
    this.miscForm.controls["company"].valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((res: any) => {
        if (res && res.value) {
          this.Misc.setCompnay(res.value, res, this.miscForm, "header");
          this.companyId = res.value;
          this.setItemsToBill.enablecompanyId = true;
          this.setItemsToBill.companyId = res;
          this.setItemsToBill.companyIdComp = "header";
          this.Misc.setCalculateBillItems(this.setItemsToBill);
          // this.Misc.setPatientDetail(this.patientDetail);
        } else {
          this.Misc.setCompnay(res, res, this.miscForm, "header");
          this.setItemsToBill.companyId = 0;
        }
      });
    this.miscForm.controls["corporate"].valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((res: any) => {
        if (res && res.value) {
          this.Misc.setCorporate(res.value, res, this.miscForm, "header");
          this.corporateId = res.value;
          // this.Misc.setPatientDetail(this.patientDetail);
          this.setItemsToBill.corporateId = res;
          this.setItemsToBill.companyIdComp = "header";
          this.Misc.setCalculateBillItems(this.setItemsToBill);
        } else {
          this.Misc.setCorporate(res, res, this.miscForm, "header");
          this.setItemsToBill.corporateId = 0;
        }
      });
    this.miscForm.controls["b2bInvoiceType"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value: any) => {
        if (value === true) {
          this.setItemsToBill.b2bInvoiceType = "B2B";
        } else {
          this.setItemsToBill.b2bInvoiceType = "B2C";
        }
        this.Misc.setCalculateBillItems(this.setItemsToBill);
        //this.Misc.setPatientDetail(this.patientDetail);
      });
  }

  getRemark() {
    this.setItemsToBill.narration = this.miscForm.value.narration;
    this.Misc.setCalculateBillItems(this.setItemsToBill);
  }

  similarContactPatientList: SimilarSoundPatientResponse[] = [];
  MaxIDExist: boolean = false;

  onPhoneModify() {
    this.matDialog.closeAll();

    if (
      !this.miscForm.value.mobileNo ||
      this.miscForm.value.mobileNo.length != 10
    ) {
      this.snackbar.open("Invalid Mobile No.", "error");
      this.apiProcessing = false;
      // this.patient = false;
      return;
    }

    this.http
      .post(ApiConstants.similarSoundPatientDetail, {
        phone: this.miscForm.value.mobileNo,
      })
      .pipe(takeUntil(this._destroying$))
      .subscribe(
        (resultData: SimilarSoundPatientResponse[]) => {
          this.apiProcessing = false;
          this.similarContactPatientList = resultData;
          if (this.similarContactPatientList.length == 1) {
            this.getAllCompany();
            this.getAllCorporate();
            this.miscForm.controls["company"].enable();
            this.miscForm.controls["corporate"].enable();
            let maxID = this.similarContactPatientList[0].maxid;
            this.miscForm.controls["maxid"].setValue(maxID);
            this.getPatientDetailsByMaxId();
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
                    let maxID = result.data["added"][0].maxid;
                    this.miscForm.controls["maxid"].setValue(maxID);
                    this.getPatientDetailsByMaxId();
                  }
                  this.similarContactPatientList = [];
                });
            }
          }
        },
        (error) => {
          this.messageDialogService.info(error.error);
          this.apiProcessing = false;
        }
      );

    this.apiProcessing = false;
  }
  clearForm() {
    this._destroying$.next(undefined);
    this._destroying$.complete();
    this.setItemsToBill.enableBill = false;
    this.disableBtn = false;
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
    this.categoryIcons = [];
    this.questions[0].questionClasses = "";
    this.expiredPatient = false;

    this.questions[0].elementRef.focus();
    this.miscForm.reset();
    this.miscForm.controls["maxid"].setValue(
      this.cookie.get("LocationIACode") + "."
    );
    this.router.navigate(["bill"], {
      queryParams: {},
      relativeTo: this.route,
    });
    this.activeLink = this.links[0];
  }

  getssnandmaxid() {
    let iacode = this.miscForm.value.maxid.split(".")[0];
    let regNumber = Number(this.miscForm.value.maxid.split(".")[1]);
    this.http
      .get(ApiConstants.getssnandmaxid(iacode, regNumber, this.ssn))
      .pipe(takeUntil(this._destroying$))
      .subscribe((resultData: Registrationdetails) => {});
  }
  async getPatientDetailsByMaxId() {
    let regNumber = Number(this.miscForm.value.maxid.split(".")[1]);
    let iacode = this.miscForm.value.maxid.split(".")[0];
    if (regNumber != 0 && regNumber > 0) {
      const expiredStatus = await this.checkPatientExpired(iacode, regNumber);
      if (expiredStatus) {
        this.expiredPatient = true;
        const dialogRef = this.messageDialogService.error(
          "Patient is an Expired Patient!"
        );
        this.apiProcessing = false;
        this.disableBtn = true;
        await dialogRef.afterClosed().toPromise();
        return;
      }
      this.getAllCompany();
      this.getAllCorporate();
      this.getSimilarSoundDetails(iacode, regNumber);
      this.http
        .get(
          ApiConstants.getregisteredpatientdetailsForMisc(
            iacode,
            regNumber,
            Number(this.cookie.get("HSPLocationId"))
          )
        )
        .pipe(takeUntil(this._destroying$))
        .subscribe(
          (resultData: Registrationdetails) => {
            this.disableBtn = true;
            this.patientDetails = resultData;
            if (
              this.patientDetails.dsPersonalDetails.dtPersonalDetails1.length !=
              0
            ) {
              this.questions[0].readonly = true;
              this.questions[1].readonly = true;
              this.miscForm.controls["company"].enable();
              this.miscForm.controls["corporate"].enable();

              this.patientDetails = resultData;
              this.MaxIDExist = true;

              this.setValuesToMiscForm(this.patientDetails);

              this.dsPersonalDetails = resultData.dsPersonalDetails;
              this.dtPatientPastDetails = resultData.dtPatientPastDetails;

              let cashLimit =
                this.dsPersonalDetails.dtPersonalDetails1[0].cashLimit;
              this.setItemsToBill.cashLimit = cashLimit;
              this.setItemsToBill.enableBill = true;
            }
          },
          (error) => {
            if (error.error == "Patient Not found") {
              this.setMaxIdError(iacode, regNumber);
              this.MaxIDExist = false;
              this.apiProcessing = false;
            }
            // this.snackbar.open("Invalid Max ID", "error");
            // this.disableBtn = false;
          }
        );
    } else if (regNumber === 0 || iacode === 0) {
      this.snackbar.open("Not a valid registration number", "error");
      this.apiProcessing = false;
    } else {
      this.snackbar.open("Invalid Max ID", "error");
      this.disableBtn = false;
      this.apiProcessing = false;
      this.questions[0].readonly = false;
      return;
    }
    this.apiProcessing = false;
  }
  getSimilarSoundDetails(iacode: string, regNumber: number) {
    this.http
      .get(BillingApiConstants.getsimilarsoundopbilling(iacode, regNumber))
      .pipe(takeUntil(this._destroying$))
      .subscribe(
        (resultData: any) => {
          if (resultData && resultData.length > 0) {
            // this.getAllCompany();
            // this.getAllCorporate();
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
          if (error.error == "Patient Not found") {
            this.setMaxIdError(iacode, regNumber);
            this.MaxIDExist = false;
            this.apiProcessing = false;
          }
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
      .toPromise()
      .catch((e) => {
        this.apiProcessing = false;
        //this.snackbar.open(e.error.errors.regiNo, "error");
        this.snackbar.open("Invalid Max ID", "error");
        return false;
      });

    if (res == null || res == undefined) {
      return false;
    }
    if (res)
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
        ApiConstants.getregisteredpatientdetailsForMisc(
          iacode,
          regNumber,
          Number(this.cookie.get("HSPLocationId"))
        )
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe(
        async (resultData: Registrationdetails) => {
          if (resultData) {
            this.patientDetails = resultData;
            this.miscForm.controls["company"].enable();
            this.miscForm.controls["corporate"].enable();
            this.setValuesToMiscForm(this.patientDetails);
            if (
              this.patientDetails.dsPersonalDetails.dtPersonalDetails1.length >
              0
            ) {
              this.setValuesToMiscForm(this.patientDetails);
              if (
                this.patientDetails.dsPersonalDetails.dtPersonalDetails1[0]
                  .pPagerNumber == "ews"
              ) {
                this.miscForm.controls["company"].disable();
                this.miscForm.controls["corporate"].disable();
              }
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
              this.startProcess(patientDetails, resultData, iacode, regNumber);
            }
          } else {
            this.apiProcessing = false;
            this.snackbar.open("Invalid Max ID", "error");
            this.disableBtn = false;
            this.questions[0].readonly = false;
            return;
          }
        },
        (error) => {
          if (error.error == "Patient Not found") {
            this.setMaxIdError(iacode, regNumber);
            this.MaxIDExist = false;
          }
          this.apiProcessing = false;
        }
      );
  }

  async startProcess(
    patientDetails: any,
    resultData: any,
    iacode: any,
    regNumber: any
  ) {
    if (
      resultData.dtPatientPastDetails[0] &&
      resultData.dtPatientPastDetails[0].id > 0 &&
      resultData.dtPatientPastDetails[0].data == 1
    ) {
      this.messageDialogService.info("This Patient is an InPatient");
    } else if (
      resultData.dtPatientPastDetails[4] &&
      resultData.dtPatientPastDetails[4].id > 0 &&
      resultData.dtPatientPastDetails[4].data > 0
    ) {
      const dialogRef = this.matDialog.open(PaydueComponent, {
        width: "30vw",
        data: {
          dueAmount: resultData.dtPatientPastDetails[4].data,
          maxId: this.miscForm.value.maxid,
        },
      });
      const resAction = await dialogRef.afterClosed().toPromise();
      if (resAction) {
        if ("paynow" in resAction && resAction.paynow) {
          this.router.navigate(["/out-patient-billing/details"], {
            queryParams: { maxID: this.miscForm.value.maxid, from: 1 },
          });
          return;
        }
        if ("skipReason" in resAction && resAction.skipReason) {
        }
      }
    } else if (
      resultData.dtPatientPastDetails[2] &&
      resultData.dtPatientPastDetails[2].id > 0 &&
      resultData.dtPatientPastDetails[2].data > 0
    ) {
      //this.Misc.depositDetails(iacode, regNumber);
    }
  }

  ngOnDestroy(): void {
    this.clearForm();
    this.calculateBillService.discountSelectedItems = [];
    this.billingService.totalCost = 0;
    this.Misc.selectedcompanydetails = [];
    this.Misc.selectedcorporatedetails = [];
  }

  //SETTING ERROR FOR MAX ID
  setMaxIdError(iacode: any, regNumber: any) {
    this.miscForm.controls["maxid"].setValue(iacode + "." + regNumber);
    this.miscForm.controls["maxid"].setErrors({ incorrect: true });
    this.questions[0].customErrorMessage = "Invalid Max ID";
  }
  patientName!: string;
  age!: string | undefined;
  gender!: string;
  dob!: string;
  country!: string;
  ssn!: string;
  pan!: string;

  //SETTING THE VALUES TO PATIENT DETAIL
  setValuesToMiscForm(pDetails: Registrationdetails) {
    if (pDetails.dsPersonalDetails.dtPersonalDetails1.length == 0) {
      this.snackbar.open("Invalid Max ID", "error");
      this.disableBtn = false;
      this.apiProcessing = false;
      return;
    }
    let patientDetails = pDetails.dsPersonalDetails.dtPersonalDetails1[0];
    this.Misc.setPatientDetail(patientDetails);
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
        this.snackbar.open("Today is Patient’s birthday", "info");
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
      if (this.companyList) {
        const companyExist: any = this.companyList.find(
          (c: any) => c.id == patientDetails.companyid
        );
        if (companyExist) {
          let res = {
            company: companyExist,
            title: companyExist.name,
            value: patientDetails.companyid,
          };
          this.Misc.setCompnay(
            patientDetails.companyid,
            res,
            this.miscForm,
            "companyexists"
          );
        }
      }
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
  openIOM() {
    this.matDialog.open(IomPopupComponent, {
      width: "70%",
      height: "90%",
      data: {
        company: this.miscForm.value.company.value,
      },
    });
  }
  getAllCompany() {
    this.http
      .get(
        BillingApiConstants.getcompanydetail(
          Number(this.cookie.get("HSPLocationId"))
        )
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe((data: GetCompanyDataInterface[]) => {
        this.companyList = data;
        this.Misc.setCompanyData(data);
        this.miscForm.controls["corporate"].disable();
        this.questions[2].options = this.companyList.map((a) => {
          return { title: a.name, value: a.id, company: a };
        });
        this.questions[2] = { ...this.questions[2] };
      });
  }

  getAllCorporate() {
    this.http
      .get(ApiConstants.getCorporatemasterdetail)
      .pipe(takeUntil(this._destroying$))
      .subscribe((resultData: getCorporatemasterdetail) => {
        this.coorporateList = resultData.oCompanyName;
        this.creditcorporateList = resultData.ohsplocation;

        this.Misc.setCorporateData(resultData.oCompanyName);
        resultData.oCompanyName.unshift({ name: "Select", id: -1 });
        this.questions[3].options = this.coorporateList.map((l: any) => {
          return { title: l.name, value: l.id };
        });
        this.questions[3] = { ...this.questions[3] };
      });
  }

  dipositeDetail!: DipositeDetailModel;

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
      0,
      patientDetail.peMail,
      patientDetail.pCellNo,
      patientDetail.paNno
    );
    // this.Misc.setPatientDetail(this.patientDetail);
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
