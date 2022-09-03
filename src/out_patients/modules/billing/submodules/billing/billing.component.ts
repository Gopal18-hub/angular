import { Component, OnInit, ViewChild, Inject } from "@angular/core";
import { PaymentModeComponent } from "./payment-mode/payment-mode.component";
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

@Component({
  selector: "out-patients-billing",
  templateUrl: "./billing.component.html",
  styleUrls: ["./billing.component.scss"],
})
export class BillingComponent implements OnInit {
  links = [
    {
      title: "Services",
      path: "services",
    },
    {
      title: "Bill",
      path: "bill",
    },
    {
      title: "Credit Details",
      path: "credit-details",
    },
  ];

  formData = {
    title: "",
    type: "object",
    properties: {
      maxid: {
        type: "string",
        defaultValue: this.cookie.get("LocationIACode") + ".",
      },
      mobile: {
        type: "string",
      },
      bookingId: {
        type: "string",
      },
      company: {
        type: "autocomplete",
        options: [],
        placeholder: "--Select--",
      },
      corporate: {
        type: "autocomplete",
        options: [],
        placeholder: "--Select--",
      },
      narration: {
        type: "string",
      },
      b2bInvoice: {
        type: "checkbox",
        options: [{ title: "B2B Invoice" }],
      },
    },
  };
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

  patientDetails!: Registrationdetails;

  apiProcessing: boolean = false;

  complanyList!: GetCompanyDataInterface[];
  coorporateList: { id: number; name: string }[] = [] as any;

  dmsProcessing: boolean = false;

  moment = moment;

  narrationAllowedLocations = ["67", "69"];

  companyData = [];

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
    private patientService: PatientService
  ) {}

  ngOnInit(): void {
    this.getAllCompany();
    this.getAllCorporate();
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
        this.getPatientDetailsByMaxId();
      }
    });
  }

  ngAfterViewInit(): void {
    this.formEvents();
  }

  formEvents() {
    this.questions[0].elementRef.addEventListener("keypress", (event: any) => {
      if (event.key === "Enter") {
        event.preventDefault();
        this.apiProcessing = true;
        this.patient = false;
        this.getPatientDetailsByMaxId();
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
    if (!this.formGroup.value.mobile) {
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
            this.getPatientDetailsByMaxId();
          } else {
            const similarSoundDialogref = this.matDialog.open(
              SimilarPatientDialog,
              {
                width: "60vw",
                height: "62vh",
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
                  this.getPatientDetailsByMaxId();
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
      .toPromise();
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
        const dialogRef = this.messageDialogService.error(
          "Patient is an Expired Patient!"
        );
        this.apiProcessing = false;
        this.patient = false;
        return;
      }
      this.http
        .get(BillingApiConstants.getsimilarsoundopbilling(iacode, regNumber))
        .pipe(takeUntil(this._destroying$))
        .subscribe((resultData: any) => {
          if (resultData.length > 0) {
            this.linkedMaxId(
              resultData[0].iaCode + "." + resultData[0].registrationNo,
              iacode,
              regNumber
            );
          } else {
            this.registrationDetails(iacode, regNumber);
          }
        });
    } else {
      this.apiProcessing = false;
      this.patient = false;
    }
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
        (resultData: Registrationdetails) => {
          console.log(resultData);
          if (resultData) {
            this.billingService.setActiveMaxId(
              this.formGroup.value.maxid,
              iacode,
              regNumber.toString()
            );
            this.patientDetails = resultData;

            this.setValuesToForm(this.patientDetails);

            if (
              this.patientDetails.dsPersonalDetails.dtPersonalDetails1.length >
              0
            ) {
              this.categoryIcons =
                this.patientService.getCategoryIconsForPatientAny(
                  this.patientDetails.dsPersonalDetails.dtPersonalDetails1[0]
                );
              const patientDetails =
                this.patientDetails.dsPersonalDetails.dtPersonalDetails1[0];
              if (patientDetails.nationality != 149) {
                const dialogRef = this.messageDialogService.info(
                  "Please Ensure International Tariff Is Applied!"
                );
                dialogRef
                  .afterClosed()
                  .pipe(takeUntil(this._destroying$))
                  .subscribe((result) => {
                    this.startProcess(
                      patientDetails,
                      resultData,
                      iacode,
                      regNumber
                    );
                  });
              } else {
                this.startProcess(
                  patientDetails,
                  resultData,
                  iacode,
                  regNumber
                );
              }
            }
          } else {
            this.snackbar.open("Invalid Max ID", "error");
          }

          //SETTING PATIENT DETAILS TO MODIFIEDPATIENTDETAILOBJ
        },
        (error) => {
          if (error.error == "Patient Not found") {
            this.formGroup.controls["maxid"].setValue(iacode + "." + regNumber);
            //this.formGroup.controls["maxid"].setErrors({ incorrect: true });
            //this.questions[0].customErrorMessage = "Invalid Max ID";
            this.snackbar.open("Invalid Max ID", "error");
          }
          this.apiProcessing = false;
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
  }

  setValuesToForm(pDetails: Registrationdetails) {
    if (pDetails.dsPersonalDetails.dtPersonalDetails1.length == 0) {
      this.snackbar.open("Invalid Max ID", "error");
      this.patient = false;
      this.apiProcessing = false;
      return;
    }
    const patientDetails = pDetails.dsPersonalDetails.dtPersonalDetails1[0];
    this.formGroup.controls["mobile"].setValue(patientDetails.pCellNo);
    if (patientDetails.companyid) {
      const companyExist: any = this.companyData.find(
        (c: any) => c.id == patientDetails.companyid
      );
      if (companyExist) {
        this.formGroup.controls["company"].setValue({
          title: companyExist.name,
          value: patientDetails.companyid,
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
    this.questions[2].readonly = true;
    this.router.navigate([], {
      queryParams: { maxId: this.formGroup.value.maxid },
      relativeTo: this.route,
    });
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
      .subscribe((res: any) => {
        console.log(res);
      });
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
          maxId: this.formGroup.value.maxid,
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
      `This Record has been mapped with ${maxId}. Do you want to Pick this number for further transaction ?`
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
            this.registrationDetails(iacode, regNumber);
          } else {
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
        let apppatientDetails = result.data.added[0];
        if (apppatientDetails.iAcode == "") {
          this.snackbar.open("Invalid Max ID", "error");
        } else {
          let maxid =
            apppatientDetails.iAcode + "." + apppatientDetails.registrationno;
          this.formGroup.controls["maxid"].setValue(maxid);
          this.apiProcessing = true;
          this.patient = false;
          this.getPatientDetailsByMaxId();
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
    this.apiProcessing = false;
    this.patient = false;
    this.formGroup.reset();
    this.patientName = "";
    this.ssn = "";
    this.dob = "";
    this.country = "";
    this.gender = "";
    this.age = "";
    this.billingService.clear();
    this.questions[0].readonly = false;
    this.questions[1].readonly = false;
    this.questions[2].readonly = false;
    this.formGroup.controls["maxid"].setValue(
      this.cookie.get("LocationIACode") + "."
    );
    this.questions[0].elementRef.focus();
    this.router.navigate([], { queryParams: {}, relativeTo: this.route });
  }

  getAllCompany() {
    this.http
      .get(
        BillingApiConstants.getcompanydetail(
          Number(this.cookie.get("HSPLocationId"))
        )
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe((data: any) => {
        this.companyData = data;
        this.questions[3].options = data.map((a: any) => {
          return { title: a.name, value: a.id };
        });
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
      .get(ApiConstants.getCorporate)
      .pipe(takeUntil(this._destroying$))
      .subscribe((resultData: { id: number; name: string }[]) => {
        this.coorporateList = resultData;
        this.questions[4].options = this.coorporateList.map((l) => {
          return { title: l.name, value: l.id };
        });
      });
  }
}

@Component({
  selector: "out-patients-similar-patient-search",
  templateUrl: "similarPatient-dialog.html",
})
export class SimilarPatientDialog {
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

  config: any = {
    selectBox: false,
    clickedRows: true,
    clickSelection: "single",
    displayedColumns: [
      "maxid",
      "firstName",
      "lastName",
      "phone",
      "address",
      "age",
      "gender",
    ],
    columnsInfo: {
      maxid: {
        title: "Max ID",
        type: "string",
        style: {
          width: "120px",
        },
      },
      firstName: {
        title: "First Name",
        type: "string",
      },
      lastName: {
        title: "Last Name",
        type: "string",
      },
      phone: {
        title: "Phone No. ",
        type: "string",
      },
      address: {
        title: "Address ",
        type: "string",
        style: {
          width: "150px",
        },
        tooltipColumn: "address",
      },
      age: {
        title: "Age ",
        type: "string",
        style: {
          width: "90px",
        },
      },
      gender: {
        title: "Gender",
        type: "string",
        style: {
          width: "70px",
        },
      },
    },
  };
  getMaxID() {
    this.tableRows.selection.changed.subscribe((res: any) => {
      this.dialogRef.close({ data: res });
    });
  }
}
