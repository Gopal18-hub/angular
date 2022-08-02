import { DatePipe } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ApiConstants } from "@core/constants/ApiConstants";
import { patientRegistrationModel } from "@core/models/patientRegistrationModel.Model";
import { GetCompanyDataInterface } from "@core/types/employeesponsor/getCompanydata.Interface";
import { PatientDetail } from "@core/types/patientDetailModel.Interface";
import { CookieService } from "@shared/services/cookie.service";
import { HttpService } from "@shared/services/http.service";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { Subject, takeUntil } from "rxjs";

import { Registrationdetails } from "../../../../core/types/registeredPatientDetial.Interface";
import { GstComponent } from "./billing/gst/gst.component";
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

  complanyList!: GetCompanyDataInterface[];
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
      //

      company: {
        type: "autocomplete",
        options: this.complanyList,
        // title: "SSN",
      },
      corporate: {
        type: "autocomplete",
        options: this.coorporateList,
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
        this.getPatientDetailsByMaxId();
      }
    });
    this.getAllCompany();
    this.getAllCorporate();
  }
  getPatientDetailsByMaxId() {
    let regNumber = Number(this.miscForm.value.maxid.split(".")[1]);

    //HANDLING IF MAX ID IS NOT PRESENT
    if (regNumber != 0) {
      let iacode = this.miscForm.value.maxid.split(".")[0];
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
              // this.messageDialogService.info(error.error);
              // this.router.navigate([], {
              //   queryParams: {},
              //   relativeTo: this.route,
              // });
              // this.flushAllObjects();
              // this.setValuesTo miscForm(this.patientDetails);
              this.miscForm.controls["maxid"].setValue(
                iacode + "." + regNumber
              );
              this.miscForm.controls["maxid"].setErrors({ incorrect: true });
              this.questions[0].customErrorMessage = "Invalid Max ID";
            }
            // this.clear();

            // this.maxIDChangeCall = false;
          }
        );
    }
  }

  patientName!: string;
  age!: string;
  gender!: string;
  dob!: string;
  country!: string;
  ssn!: string;

  //SETTING THE VALUES TO PATIENT DETAIL
  setValuesToMiscForm(pDetails: Registrationdetails) {
    let patientDetails = pDetails.dsPersonalDetails.dtPersonalDetails1[0];
    this.miscForm.controls["mobileNo"].setValue(patientDetails.pCellNo);
    this.patientName = patientDetails.firstname + " " + patientDetails.lastname;
    this.ssn = patientDetails.ssn;
    this.age = patientDetails.age + patientDetails.ageTypeName;
    this.gender = patientDetails.genderName;
    this.country = patientDetails.nationalityName;
    this.ssn = patientDetails.ssn;
    this.dob =
      "" + this.datepipe.transform(patientDetails.dateOfBirth, "dd/MM/yyyy");
  }

  getAllCompany() {
    this.http
      .get(ApiConstants.getcompanyandpatientsponsordata)
      .pipe(takeUntil(this._destroying$))
      .subscribe((data) => {
        console.log(data);
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
}
