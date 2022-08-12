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
import { ActivatedRoute } from "@angular/router";
import { AppointmentSearchDialogComponent } from "../../../registration/submodules/appointment-search/appointment-search-dialog/appointment-search-dialog.component";
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
        type: "string",
      },
      bookingId: {
        type: "string",
      },
      company: {
        type: "dropdown",
        options: [],
        placeholder: "--Select--",
      },
      corporate: {
        type: "dropdown",
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
  age!: string;
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

  constructor(
    public matDialog: MatDialog,
    private formService: QuestionControlService,
    private http: HttpService,
    private cookie: CookieService,
    private datepipe: DatePipe,
    private route: ActivatedRoute,
    private billingService: BillingService,
    private snackbar: MaxHealthSnackBarService
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
                height: "80vh",
                data: {
                  searchResults: res,
                },
              }
            );
          }
        }
        this.apiProcessing = false;
        this.patient = false;
      });
  }

  getPatientDetailsByMaxId() {
    if (!this.formGroup.value.maxid) {
      this.apiProcessing = false;
      this.patient = false;
      return;
    }
    let regNumber = Number(this.formGroup.value.maxid.split(".")[1]);

    if (regNumber != 0) {
      let iacode = this.formGroup.value.maxid.split(".")[0];
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
              this.billingService.setActiveMaxId(
                this.formGroup.value.maxid,
                iacode,
                regNumber.toString()
              );
              this.patientDetails = resultData;
              // this.categoryIcons = this.patientService.getCategoryIconsForPatient(
              //   this.patientDetails
              // );
              // console.log(this.categoryIcons);
              this.setValuesToForm(this.patientDetails);

              this.payDueCheck(resultData.dtPatientPastDetails);
            } else {
              this.snackbar.open("Invalid Max ID", "error");
            }

            //SETTING PATIENT DETAILS TO MODIFIEDPATIENTDETAILOBJ
          },
          (error) => {
            if (error.error == "Patient Not found") {
              this.formGroup.controls["maxid"].setValue(
                iacode + "." + regNumber
              );
              //this.formGroup.controls["maxid"].setErrors({ incorrect: true });
              //this.questions[0].customErrorMessage = "Invalid Max ID";
              this.snackbar.open("Invalid Max ID", "error");
            }
            this.apiProcessing = false;
          }
        );
    } else {
      this.apiProcessing = false;
      this.patient = false;
    }
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
    this.patientName = patientDetails.firstname + " " + patientDetails.lastname;
    this.ssn = patientDetails.ssn;
    this.age = patientDetails.age + " " + patientDetails.ageTypeName;
    this.gender = patientDetails.genderName;
    this.country = patientDetails.nationalityName;
    this.ssn = patientDetails.ssn;
    this.dob =
      "" + this.datepipe.transform(patientDetails.dateOfBirth, "dd-MMM-yyyy");
    this.patient = true;
    this.apiProcessing = false;
    this.questions[0].readonly = true;
    this.questions[1].readonly = true;
    this.questions[2].readonly = true;
  }

  doCategoryIconAction(icon: any) {}

  payDueCheck(dtPatientPastDetails: any) {
    if (
      dtPatientPastDetails[4] &&
      dtPatientPastDetails[4].id > 0 &&
      dtPatientPastDetails[4].data > 0
    ) {
      this.matDialog.open(PaydueComponent, {
        width: "30vw",
        data: {
          dueAmount: dtPatientPastDetails[4].data,
          maxId: this.formGroup.value.maxid,
        },
      });
    }
  }

  appointmentSearch() {
    this.matDialog.open(AppointmentSearchDialogComponent, {
      maxWidth: "100vw",
      width: "98vw",
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
    this.questions[0].elementRef.focus();
  }

  getAllCompany() {
    this.http
      .get(
        BillingApiConstants.getcompanyandpatientsponsordata(
          Number(this.cookie.get("HSPLocationId"))
        )
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe((data) => {
        console.log(data);
        this.complanyList = data as GetCompanyDataInterface[];
        this.questions[3].options = this.complanyList.map((a) => {
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
  // searchResults:{verify:string,isVerified:string,remarks:string,view:string,fileName:string,docName:string,idType:string}[]=[] as any
  ngOnInit(): void {
    console.log(this.data.searchResults);

    // this.searchResults.push({verify:"no",isVerified:"no",remarks:"no",view:"no",fileName:"xyz",docName:"docname",idType:"idtype"});
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
    console.log(event);

    this.tableRows.selection.changed.subscribe((res: any) => {
      this.dialogRef.close({ data: res });
    });
  }
}
