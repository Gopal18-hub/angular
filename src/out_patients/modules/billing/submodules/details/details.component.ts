import { DatePipe } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Registrationdetails } from "@core/types/registeredPatientDetial.Interface";
import { VisitHistoryComponent } from "@core/UI/billing/submodules/visit-history/visit-history.component";
import { ApiConstants } from "@shared/constants/ApiConstants";
import { CookieService } from "@shared/services/cookie.service";
import { HttpService } from "@shared/services/http.service";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { Subject, takeUntil } from "rxjs";
@Component({
  selector: "out-patients-details",
  templateUrl: "./details.component.html",
  styleUrls: ["./details.component.scss"],
})
export class DetailsComponent implements OnInit {
  constructor(
    public matDialog: MatDialog,
    private formService: QuestionControlService,
    private router: Router,
    private http: HttpService,
    private cookie: CookieService,
    private datepipe: DatePipe
  ) {}

  @ViewChild("selectedServices") selectedServicesTable: any;
  linkList = [
    {
      title: "Bill",
      path: "bill",
    },
    {
      title: "Credit Details",
      path: "credit-details",
    },
  ];
  activeLink = this.linkList[0];

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
      bookingId: {
        type: "string",
        // title: "SSN",
      },
      company: {
        type: "autocomplete",
        // title: "SSN",
      },
      corporate: {
        type: "autocomplete",
        // title: "SSN",
      },
      narration: {
        type: "string",
        // title: "SSN",
      },

      b2bInvoiceType: {
        type: "checkbox",
        options: [
          {
            title: "B2B Invoice Type",
          },
        ],
      },
    },
  };

  patientDetails!: Registrationdetails;
  serviceselectedList: [] = [] as any;
  miscForm!: FormGroup;
  miscServBillForm!: FormGroup;
  questions: any;
  question: any;
  private readonly _destroying$ = new Subject<void>();

  ngOnInit(): void {
    let formResult = this.formService.createForm(
      this.miscFormData.properties,
      {}
    );

    this.miscForm = formResult.form;
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
        // this.getPatientDetailsByMaxId();
      }
    });
  }
  // getPatientDetailsByMaxId() {
  //   let regNumber = Number(this.miscForm.value.maxid.split(".")[1]);

  //   //HANDLING IF MAX ID IS NOT PRESENT
  //   if (regNumber != 0) {
  //     let iacode = this.miscForm.value.maxid.split(".")[0];
  //     this.http
  //       .get(
  //         ApiConstants.getregisteredpatientdetailsForBilling(
  //           iacode,
  //           regNumber,
  //           Number(this.cookie.get("HSPLocationId"))
  //         )
  //       )
  //       .pipe(takeUntil(this._destroying$))
  //       .subscribe(
  //         (resultData: Registrationdetails) => {
  //           // this.clear();
  //           // this.flushAllObjects();
  //           this.patientDetails = resultData;
  //           // this.categoryIcons = this.patientService.getCategoryIconsForPatient(
  //           //   this.patientDetails
  //           // );
  //           // this.MaxIDExist = true;
  //           // console.log(this.categoryIcons);
  //           // this.checkForMaxID();
  //           //RESOPONSE DATA BINDING WITH CONTROLS

  //           this.setValuesToMiscForm(this.patientDetails);

  //           //SETTING PATIENT DETAILS TO MODIFIEDPATIENTDETAILOBJ
  //         },
  //         (error) => {
  //           if (error.error == "Patient Not found") {
  //             // this.messageDialogService.info(error.error);
  //             // this.router.navigate([], {
  //             //   queryParams: {},
  //             //   relativeTo: this.route,
  //             // });
  //             // this.flushAllObjects();
  //             // this.setValuesTo miscForm(this.patientDetails);
  //             this.miscForm.controls["maxid"].setValue(
  //               iacode + "." + regNumber
  //             );
  //             this.miscForm.controls["maxid"].setErrors({ incorrect: true });
  //             this.questions[0].customErrorMessage = "Invalid Max ID";
  //           }
  //           // this.clear();

  //           // this.maxIDChangeCall = false;
  //         }
  //       );
  //   }
  // }

  patientName!: string;
  age!: string;
  gender!: string;
  dob!: string;
  country!: string;
  ssn!: string;
  openhistory() {
    this.matDialog.open(VisitHistoryComponent, { width: "70%", height: "50%" });
  }
}
