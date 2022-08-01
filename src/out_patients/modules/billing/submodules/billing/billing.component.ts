import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { PaymentModeComponent } from "./payment-mode/payment-mode.component";
import { FormGroup } from "@angular/forms";
import { CookieService } from "@shared/services/cookie.service";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { Subject, takeUntil } from "rxjs";
import { DatePipe } from "@angular/common";
import { HttpService } from "@shared/services/http.service";
import { ApiConstants } from "@core/constants/ApiConstants";
import { Registrationdetails } from "../../../../core/types/registeredPatientDetial.Interface";

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
        type: "number",
        readonly: true,
      },
      bookingId: {
        type: "string",
      },
      company: {
        type: "dropdown",
        options: [],
      },
      corporate: {
        type: "dropdown",
        options: [],
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

  constructor(
    public matDialog: MatDialog,
    private formService: QuestionControlService,
    private http: HttpService,
    private cookie: CookieService,
    private datepipe: DatePipe
  ) {}

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.formData.properties,
      {}
    );
    this.formGroup = formResult.form;
    this.questions = formResult.questions;
  }

  ngAfterViewInit(): void {
    this.formEvents();
  }

  formEvents() {
    //ON MAXID CHANGE
    this.questions[0].elementRef.addEventListener("keypress", (event: any) => {
      // If the user presses the "Enter" key on the keyboard

      if (event.key === "Enter") {
        // Cancel the default action, if needed

        event.preventDefault();
        console.log("event triggered");
        this.apiProcessing = true;
        this.patient = false;
        this.getPatientDetailsByMaxId();
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
          (resultData: Registrationdetails) => {
            console.log(resultData);
            // this.clear();
            // this.flushAllObjects();
            this.patientDetails = resultData;
            // this.categoryIcons = this.patientService.getCategoryIconsForPatient(
            //   this.patientDetails
            // );
            // this.MaxIDExist = true;
            // console.log(this.categoryIcons);
            // this.checkForMaxID();
            //RESOPONSE DATA BINDING WITH CONTROLS

            this.setValuesToMiscForm(this.patientDetails);

            //SETTING PATIENT DETAILS TO MODIFIEDPATIENTDETAILOBJ
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
    }
  }

  setValuesToMiscForm(pDetails: Registrationdetails) {
    let patientDetails = pDetails.dsPersonalDetails.dtPersonalDetails1[0];
    console.log(patientDetails.pCellNo);
    this.formGroup.controls["mobile"].setValue(patientDetails.pCellNo);
    this.patientName = patientDetails.firstname + " " + patientDetails.lastname;
    this.ssn = patientDetails.ssn;
    this.age = patientDetails.age + patientDetails.ageTypeName;
    this.gender = patientDetails.sexName;
    this.country = patientDetails.nationalityName;
    this.ssn = patientDetails.ssn;
    this.dob =
      "" + this.datepipe.transform(patientDetails.dateOfBirth, "dd-MMMM-yyyy");
    this.patient = true;
    this.apiProcessing = false;
  }

  doCategoryIconAction(icon: any) {}
}
