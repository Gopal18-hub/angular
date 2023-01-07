import { Component, OnInit, ViewChild, Inject } from "@angular/core";

import { FormGroup } from "@angular/forms";
import { CookieService } from "@shared/services/cookie.service";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { Subject, takeUntil } from "rxjs";
import { DatePipe } from "@angular/common";
import { HttpService } from "@shared/services/http.service";
import { ApiConstants } from "@core/constants/ApiConstants";
import { Registrationdetails } from "../../../../core/types/registeredPatientDetial.Interface";
import { ActivatedRoute } from "@angular/router";

import { GetCompanyDataInterface } from "@core/types/employeesponsor/getCompanydata.Interface";
import { DMSComponent } from "../../../registration/submodules/dms/dms.component";
import { DMSrefreshModel } from "@core/models/DMSrefresh.Model";
import { PatientService } from "@core/services/patient.service";
import { OpOrderRequestService } from "./op-order-request.service";

import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { MaxHealthSnackBarService } from "@shared/ui/snack-bar";
import * as moment from "moment";

import { BillingService } from "../billing/billing.service";
import { BillingApiConstants } from "../billing/BillingApiConstant";
import { AppointmentSearchComponent } from "../billing/prompts/appointment-search/appointment-search.component";
import { PaydueComponent } from "../billing/prompts/paydue/paydue.component";
import { SimilarPatientDialog } from "../billing/billing.component";
import { Router } from "@angular/router";
import { PatientDetails } from "@core/models/patientDetailsModel.Model";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";
import { SearchService } from "@shared/services/search.service";
import { LookupService } from "@core/services/lookup.service";
@Component({
  selector: "out-patients-op-order-request",
  templateUrl: "./op-order-request.component.html",
  styleUrls: ["./op-order-request.component.scss"],
})
export class OpOrderRequestComponent implements OnInit {
  links = [
    {
      title: "Services",
      path: "services",
    },
    {
      title: "View Request",
      path: "view-request",
    },
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
        type: "tel",
        title: "Mobile Number",
        pattern: "^[1-9]{1}[0-9]{9}",
      },
    },
  };
  formGroup!: FormGroup;
  questions: any;

  categoryIcons: any;

  patient: boolean = false;

  patientName!: string;
  age!: string;
  gender!: string;
  dob!: string;
  country!: string;
  ssn!: string;

  private readonly _destroying$ = new Subject<void>();

  patientDetails!: Registrationdetails;

  apiProcessing: boolean = false;

  expiredPatient: boolean = false;

  enableTotalestimate: boolean = false;

  moment = moment;
  noteRemarkdb: any;
  vipdb: any;
  hwcRemarkdb: any;
  hotlistReasondb: any;
  hotlistRemarkdb: any;
  bplcardNo: any;
  bplCardAddress: any;
  patientDetailsforicon!: PatientDetails;

  // messageDialogService: any;

  constructor(
    public matDialog: MatDialog,
    private formService: QuestionControlService,
    private http: HttpService,
    public cookie: CookieService,
    private datepipe: DatePipe,
    private route: ActivatedRoute,
    private billingService: BillingService,
    private snackbar: MaxHealthSnackBarService,
    private router: Router,
    private patientservice: PatientService,
    public opOrderRequestService: OpOrderRequestService,
    private messageDialogService: MessageDialogService,
    private searchService: SearchService,
    private lookupservice: LookupService
  ) {}

  ngOnInit(): void {
    console.log(this.enableTotalestimate);
    this.opOrderRequestService.investigationItems = [];
    this.opOrderRequestService.procedureItems = [];
    this.opOrderRequestService.activeLink.subscribe((data) => {
      console.log(data);
      if (data == true) {
        this.activeLink = this.links[1];
      }
    });
    this.opOrderRequestService.serviceTab.subscribe((data) => {
      if (data == true) {
        console.log("inside service tab subscription");
        this.enableTotalestimate = true;
      } else {
        this.enableTotalestimate = false;
      }
    });
    this.opOrderRequestService.spinner.subscribe((data: boolean) => {
      if (data == true) {
        this.apiProcessing = true;
      } else {
        this.apiProcessing = false;
      }
    });
    this.router
      .navigate(["out-patient-billing/op-order-request/services"])
      .then(() => {
        window.location.reload;
      });
    this.activeLink = this.links[0];
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
    this.searchService.searchTrigger
      .pipe(takeUntil(this._destroying$))
      .subscribe(async (formdata: any) => {
        console.log(formdata.data.SearchTerm);
        this.router.navigate([], {
          queryParams: {},
          relativeTo: this.route,
        });

        const lookupdata = await this.lookupservice.searchPatient(formdata);
        console.log(lookupdata);
        if (lookupdata.length == 1) {
          this.formGroup.value.maxid = lookupdata[0]["maxid"];
          console.log(this.formGroup.value.maxid);
          this.getPatientDetailsByMaxId();
        } else if (lookupdata.length > 1) {
          const similarSoundDialogref = this.matDialog.open(
            SimilarPatientDialog,
            {
              width: "60vw",
              height: "65vh",
              data: {
                searchResults: lookupdata,
              },
            }
          );
          similarSoundDialogref
            .afterClosed()
            .pipe(takeUntil(this._destroying$))
            .subscribe((result: any) => {
              if (result) {
                console.log(result.data["added"][0].maxid);
                let maxID = result.data["added"][0].maxid;
                this.formGroup.controls["maxid"].setValue(maxID);
                this.getPatientDetailsByMaxId();
              }
            });
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
        event.preventDefault();
        this.apiProcessing = true;
        this.patient = false;
        this.searchByMobileNumber();
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
      .subscribe(
        (res: any) => {
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
                  height: "65vh",
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
        },
        (error: any) => {
          console.log(error);
          if (error.status == 400) {
            this.apiProcessing = false;
            this.messageDialogService.error(
              "There is an error occured while processing your transaction, check with administrator"
            );
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
      .catch((error: any) => {
        return error;
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
        const dialogRef = this.messageDialogService.error(
          "Patient is an Expired Patient!"
        );
        await dialogRef.afterClosed().toPromise();
      }
      this.http
        .get(BillingApiConstants.getsimilarsoundopbilling(iacode, regNumber))
        .pipe(takeUntil(this._destroying$))
        .subscribe((resultData: Registrationdetails) => {});
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
              this.opOrderRequestService.setActiveMaxId(
                this.formGroup.value.maxid,
                iacode,
                regNumber.toString()
              );
              this.patientDetails = resultData;
              this.patient = true;
              this.getPatientIcon();
              this.setValuesToForm(this.patientDetails);
            } else {
              this.snackbar.open("Invalid Max ID", "error");
              this.apiProcessing = false;
            }

            //SETTING PATIENT DETAILS TO MODIFIEDPATIENTDETAILOBJ
          },
          (error) => {
            if (error.error == "Patient Not found") {
              this.formGroup.controls["maxid"].setValue(
                iacode + "." + regNumber
              );
              this.apiProcessing = false;
              this.snackbar.open("Invalid Max ID", "error");
            } else {
              this.apiProcessing = false;
              this.snackbar.open("Invalid Max ID", "error");
            }
          }
        );
    } else {
      this.apiProcessing = false;
      this.patient = false;
    }
  }

  setValuesToForm(pDetails: Registrationdetails) {
    console.log(this.formGroup.value.maxid);
    if (pDetails.dsPersonalDetails.dtPersonalDetails1.length == 0) {
      this.snackbar.open("Invalid Max ID", "error");
      this.patient = false;
      this.apiProcessing = false;
      return;
    }
    const patientDetails = pDetails.dsPersonalDetails.dtPersonalDetails1[0];
    this.opOrderRequestService.patientDemographicdata = {
      name: patientDetails.firstname + " " + patientDetails.lastname,
      age: patientDetails.age,
      agetype: patientDetails.ageTypeName,
      gender: patientDetails.genderName,
      dob: patientDetails.dateOfBirth,
      nationality: patientDetails.nationalityName,
      ssn: patientDetails.ssn,
    };
    this.formGroup.controls["maxid"].setValue(this.formGroup.value.maxid);
    this.formGroup.controls["mobile"].setValue(patientDetails.pCellNo);
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
    this.formGroup.markAsDirty();
    this.router.navigate(["out-patient-billing/op-order-request/services"]);
  }

  getPatientIcon() {
    let iacode = this.formGroup.value.maxid.split(".")[0];
    let regNumber = this.formGroup.value.maxid.split(".")[1];
    this.http
      .get(ApiConstants.patientDetails(regNumber, iacode))
      .pipe(takeUntil(this._destroying$))
      .subscribe(
        (resultData: PatientDetails) => {
          console.log(resultData);
          if (resultData != null) {
            this.patientDetailsforicon = resultData;
            this.noteRemarkdb = resultData.notereason;
            this.vipdb = resultData.vipreason;
            this.hwcRemarkdb = resultData.hwcRemarks;
            this.hotlistReasondb = { title: resultData.hotlistreason, value: 0 };
            this.hotlistRemarkdb = resultData.hotlistcomments;
            this.bplcardNo = resultData.bplcardNo;
            this.bplCardAddress = resultData.addressOnCard;
            this.categoryIcons = this.patientservice.getCategoryIconsForPatient(
              this.patientDetailsforicon
            );
          }
          // this.clear();
        },
        (error) => {}
      );
  }
  doCategoryIconAction(categoryIcon: any) {
    const data: any = {
      note: {
        notes: this.noteRemarkdb,
      },
      vip: {
        notes: this.vipdb,
      },
      hwc: {
        notes: this.hwcRemarkdb,
      },
      ppagerNumber: {
        bplCardNo: this.bplcardNo,
        BPLAddress: this.bplCardAddress,
      },
      hotlist: {
        hotlistTitle: this.hotlistReasondb,
        reason: this.hotlistRemarkdb,
      },
    };
    if (
      categoryIcon.tooltip != "CASH" &&
      categoryIcon.tooltip != "INS" &&
      categoryIcon.tooltip != "PSU"
    ) {
      this.patientservice.doAction(categoryIcon.type, data[categoryIcon.type]);
    }
  }

  clear() {
    this.apiProcessing = false;
    this.patient = false;
    this.categoryIcons = [];
    this.questions[0].readonly = false;
    this.questions[1].readonly = false;
    this.formGroup.reset();
    this.patientName = "";
    this.ssn = "";
    this.dob = "";
    this.country = "";
    this.gender = "";
    this.age = "";
    this.expiredPatient = false;

    this.formGroup.controls["maxid"].setValue(
      this.cookie.get("LocationIACode") + "."
    );
    this.questions[0].elementRef.focus();
    this.router.navigate(["out-patient-billing/op-order-request"]).then(() => {
      window.location.reload;
    });
    this.opOrderRequestService.setActiveLink(false);
    this.activeLink = this.links[0];
    console.log(this.opOrderRequestService.investigationFormGroup);
    this.opOrderRequestService.clear();
  }
  ngOnDestroy() {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
