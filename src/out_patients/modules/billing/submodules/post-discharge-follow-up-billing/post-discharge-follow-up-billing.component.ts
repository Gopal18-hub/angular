import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { CookieService } from "@shared/services/cookie.service";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { MatDialog } from "@angular/material/dialog";
import { AppointmentSearchDialogComponent } from "@modules/registration/submodules/appointment-search/appointment-search-dialog/appointment-search-dialog.component";
import { VisitHistoryComponent } from "@shared/modules/visit-history/visit-history.component";
import { ApiConstants } from "@core/constants/ApiConstants";
import { Subject, takeUntil } from "rxjs";
import { HttpService } from "@shared/services/http.service";
import { DMSComponent } from "@modules/registration/submodules/dms/dms.component";
import { Registrationdetails } from "@core/types/registeredPatientDetial.Interface";
import { DMSrefreshModel } from "@core/models/DMSrefresh.Model";
import { GetCompanyDataInterface } from "@core/types/employeesponsor/getCompanydata.Interface";
import { PatientService } from "@core/services/patient.service";
import { ActivatedRoute, Router } from "@angular/router";
import { DatePipe } from "@angular/common";

import { PatientDetails } from "@core/models/patientDetailsModel.Model";
import { IomPopupComponent } from "../billing/prompts/iom-popup/iom-popup.component";
import { BillingApiConstants } from "../billing/BillingApiConstant";
import { MaxHealthSnackBarService } from "@shared/ui/snack-bar";
import { BillingService } from "../billing/billing.service";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";
import { SimilarPatientDialog } from "../billing/billing.component";
import { PostDischargeServiceService } from "./post-discharge-service.service";
@Component({
  selector: "out-patients-post-discharge-follow-up-billing",
  templateUrl: "./post-discharge-follow-up-billing.component.html",
  styleUrls: ["./post-discharge-follow-up-billing.component.scss"],
})
export class PostDischargeFollowUpBillingComponent implements OnInit {
  links: any = [
    {
      title: "Services",
      path: "services",
    },
    {
      title: "Bill",
      path: "bill",
    },
    // {
    //   title: "Credit Details",
    //   path: "credit-details",
    // },
  ];
  activeLink = this.links[0];

  formData = {
    title: "",
    type: "object",
    properties: {
      maxid: {
        type: "string",
        defaultValue: this.cookie.get("LocationIACode") + ".",
      },
      mobile: {
        type: "number",
      },
      bookingId: {
        type: "string",
      },
      company: {
        type: "autocomplete",
        placeholder: "--Select--",
        readonly: true,
        options: [],
      },
      corporate: {
        type: "autocomplete",
        placeholder: "--Select--",
        readonly: true,
        options: [],
      },
      narration: {
        type: "buttonTextarea",
      },
      b2bInvoice: {
        type: "checkbox",
        options: [{ title: "B2B Invoice" }],
      },
    },
  };
  formGroup!: FormGroup;
  questions: any;
  userName: string = "";
  lastUpdatedBy: string = "";
  currentTime: any;
  currentDate: any;
  categoryIcons: any;
  patient: boolean = false;
  patientName!: string;
  age!: string;
  gender!: string;
  dob!: string;
  country!: string;
  ssn!: string;
  dmsProcessing: boolean = false;
  visithistorybtn: boolean = false;
  private readonly _destroying$ = new Subject<void>();
  patientDetails!: Registrationdetails;
  apiProcessing: boolean = false;
  complanyList!: GetCompanyDataInterface[];
  coorporateList: { id: number; name: string }[] = [] as any;
  narrationAllowedLocations = ["67", "69"];
  constructor(
    public cookie: CookieService,
    private formService: QuestionControlService,
    private snackbar: MaxHealthSnackBarService,
    public billingService: BillingService,
    private matdialog: MatDialog,
    private http: HttpService,
    private datepipe: DatePipe,
    private route: ActivatedRoute,
    private patientService: PatientService,
    public messageDialogService: MessageDialogService,
    private router: Router,
    public service: PostDischargeServiceService
  ) {}

  ngOnInit(): void {
    this.router.navigate([
      "/out-patient-billing/post-discharge-follow-up-billing/"
    ]);
    this.getAllCompany();
    this.getAllCorporate();
    let formResult: any = this.formService.createForm(
      this.formData.properties,
      {}
    );
    this.formGroup = formResult.form;
    this.questions = formResult.questions;
    this.userName = this.cookie.get("Name");
    this.lastUpdatedBy = this.cookie.get("UserName");
    this.currentDate = this.datepipe.transform(new Date(), "dd-MM-YYYY");
    this.currentTime = new Date().toLocaleTimeString("en-US", { hour12: true });
    this.currentTime = this.datepipe.transform(new Date(), "HH:MM:ss a");
    // this.route.queryParams.subscribe((params: any) => {
    //   if (params.maxId) {
    //     this.formGroup.controls["maxid"].setValue(params.maxId);
    //     this.apiProcessing = true;
    //     this.patient = false;
    //     this.getPatientDetailsByMaxId();
    //     this.formGroup.markAsDirty();
    //   }
    // });
  }
  iomMessage: any;
  ngAfterViewInit(): void {
    this.formEvents();
    this.formGroup.controls["company"].valueChanges.subscribe((res) => {
      if (res.value) {
        console.log(res);
        var result = this.complanyList.filter((i) => {
          return i.id == res.value;
        });
        console.log(result);
        this.iomMessage =
          "IOM Validity till : " +
          (("iomValidity" in result[0] && result[0].iomValidity != "") ||
          result[0].iomValidity != undefined
            ? this.datepipe.transform(result[0].iomValidity, "dd-MMM-yyyy")
            : "");
      }
      console.log(this.iomMessage);
    });
  }
  formEvents() {
    //ON MAXID CHANGE
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
        event.preventDefault();
        this.searchByMobileNumber();
      }
    });
  }
  getPatientDetailsByMaxId() {
    let regNumber = Number(this.formGroup.value.maxid.split(".")[1]);

    //HANDLING IF MAX ID IS NOT PRESENT
    if (regNumber != 0) {
      let iacode = this.formGroup.value.maxid.split(".")[0];
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
              this.router.navigate(['services'], {
                queryParams: { maxId: this.formGroup.value.maxid },
                relativeTo: this.route,
                queryParamsHandling: "merge",
              });
              this.patientDetails = resultData;

              this.setValuesToMiscForm(this.patientDetails);
              if (this.billingService.todayPatientBirthday) {
                const birthdayDialog = this.messageDialogService.info(
                  "It’s their birthday today"
                );
                await birthdayDialog.afterClosed().toPromise();
              }

              if (
                this.patientDetails.dsPersonalDetails.dtPersonalDetails1
                  .length > 0
              ) {
                this.billingService.setPatientDetails(
                  this.patientDetails.dsPersonalDetails.dtPersonalDetails1[0]
                );
                this.categoryIcons =
                  this.patientService.getCategoryIconsForPatientAny(
                    this.patientDetails.dsPersonalDetails.dtPersonalDetails1[0]
                  );
                const patientDetails =
                  this.patientDetails.dsPersonalDetails.dtPersonalDetails1[0];
                this.service.setActiveMaxId(
                  this.formGroup.value.maxid,
                  iacode,
                  regNumber.toString(),
                  patientDetails.genderName
                );
                // if (patientDetails.nationality != 149) {
                //   const dialogRef = this.messageDialogService.info(
                //     "Please Ensure International Tariff Is Applied!"
                //   );
                //   dialogRef
                //     .afterClosed()
                //     .pipe(takeUntil(this._destroying$))
                //     .subscribe((result) => {
                //       if (!this.orderId) {
                //         this.startProcess(
                //           patientDetails,
                //           resultData,
                //           iacode,
                //           regNumber
                //         );
                //       }
                //     });
                // } else {
                //   if (!this.orderId) {
                //     this.startProcess(
                //       patientDetails,
                //       resultData,
                //       iacode,
                //       regNumber
                //     );
                //   }
                // }
              }
            } else {
              this.apiProcessing = false;
              this.patient = false;
              this.snackbar.open("Invalid Max ID", "error");
            }
          },
          (error) => {
            if (error.error == "Patient Not found") {
              this.formGroup.controls["maxid"].setValue(
                iacode + "." + regNumber
              );
              this.formGroup.controls["maxid"].setErrors({ incorrect: true });
              this.questions[0].customErrorMessage = "Invalid Max ID";
            }
            this.apiProcessing = false;
          }
        );
    } else {
      this.apiProcessing = false;
      this.patient = false;
    }
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
            this.router.navigate([], {
              queryParams: { maxId: this.formGroup.value.maxid },
              relativeTo: this.route,
              queryParamsHandling: "merge",
            });
          } else {
            const similarSoundDialogref = this.matdialog.open(
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
  setValuesToMiscForm(pDetails: Registrationdetails) {
    let patientDetails = pDetails.dsPersonalDetails.dtPersonalDetails1[0];
    console.log(patientDetails.pCellNo);
    this.formGroup.controls["mobile"].setValue(patientDetails.pCellNo);
    this.formGroup.controls['company'].setValue(pDetails.dsPersonalDetails.dtPersonalDetails1[0].companyid);
    this.formGroup.controls['corporate'].setValue(pDetails.dsPersonalDetails.dtPersonalDetails1[0].corporateid);
    this.patientName = patientDetails.firstname + " " + patientDetails.lastname;
    this.ssn = patientDetails.ssn;
    this.age = patientDetails.age + " " + patientDetails.ageTypeName;
    this.gender = patientDetails.genderName;
    this.country = patientDetails.nationalityName;
    this.ssn = patientDetails.ssn;
    this.dob =
      "" + this.datepipe.transform(patientDetails.dateOfBirth, "dd/MM/yyyy");
    this.patient = true;
    this.apiProcessing = false;
    this.questions[0].readonly = true;
    this.questions[1].readonly = true;
  }
  doCategoryIconAction(icon: any) {}
  appointment_popup() {
    console.log("appointment");
    const appointmentSearch = this.matdialog.open(
      AppointmentSearchDialogComponent,
      {
        maxWidth: "100vw",
        width: "98vw",
      }
    );

    appointmentSearch
      .afterClosed()
      .pipe(takeUntil(this._destroying$))
      .subscribe((result) => {
        if (result && result.data) {
          let apppatientDetails = result.data.added[0];
          if (apppatientDetails.iAcode == "") {
            this.snackbar.open("Invalid Max ID", "error");
          } else {
            let maxid =
              apppatientDetails.iAcode + "." + apppatientDetails.registrationno;
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
        this.matdialog.open(DMSComponent, {
          width: "100vw",
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
  visit_history() {
    this.matdialog.open(VisitHistoryComponent, {
      width: "70%",
      height: "50%",
      data: {
        maxid: this.formGroup.value.maxid,
        docid: "",
      },
    });
  }
  openIOM() {
    this.matdialog.open(IomPopupComponent, {
      width: "70%",
      height: "90%",
      data: {
        company: this.formGroup.value.company.value,
      },
    });
  }
  clear() {
    this._destroying$.next(undefined);
    this._destroying$.complete();
    this.apiProcessing = false;
    this.patient = false;
    this.formGroup.reset();
    this.formGroup.controls["maxid"].setValue(
      this.cookie.get("LocationIACode") + "."
    );
    this.patientName = "";
    this.ssn = "";
    this.age = "";
    this.gender = "";
    this.country = "";
    this.dob = "";
    this.categoryIcons = [];
    this.router.navigate(['/out-patient-billing/post-discharge-follow-up-billing']);
    // this.router.navigate(["services"], {
    //   queryParams: {},
    //   relativeTo: this.route,
    // });
    this.questions[0].elementRef.focus();
    this.service.clear();
    this.questions[0].readonly = false;
    this.questions[1].readonly = false;
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
        console.log("company", data);
        this.complanyList = data;
        this.questions[3].options = data.map((a: any) => {
          return { title: a.name, value: a.id };
        });
      });
  }

  getAllCorporate() {
    this.http
      .get(ApiConstants.getCorporate)
      .pipe(takeUntil(this._destroying$))
      .subscribe((resultData: { id: number; name: string }[]) => {
        console.log(resultData);
        this.coorporateList = resultData;
        // this.titleList.unshift({ id: 0, name: "-Select-", sex: 0, gender: "" });
        this.questions[4].options = this.coorporateList.map((l) => {
          return { title: l.name, value: l.id };
        });
      });
  }
}
