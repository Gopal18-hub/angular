import { Component, OnInit } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { CookieService } from "@shared/services/cookie.service";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { MatDialog } from '@angular/material/dialog';
import { AppointmentSearchDialogComponent } from '@modules/registration/submodules/appointment-search/appointment-search-dialog/appointment-search-dialog.component';
import { VisitHistoryComponent } from '@core/UI/billing/submodules/visit-history/visit-history.component';
import { ApiConstants } from '@core/constants/ApiConstants';
import { Subject, takeUntil } from 'rxjs';
import { HttpService } from '@shared/services/http.service';
import { DMSComponent } from '@modules/registration/submodules/dms/dms.component';
import { Registrationdetails } from '@core/types/registeredPatientDetial.Interface';
import { DMSrefreshModel } from '@core/models/DMSrefresh.Model';
import { GetCompanyDataInterface } from '@core/types/employeesponsor/getCompanydata.Interface';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'out-patients-post-discharge-follow-up-billing',
  templateUrl: './post-discharge-follow-up-billing.component.html',
  styleUrls: ['./post-discharge-follow-up-billing.component.scss']
})
export class PostDischargeFollowUpBillingComponent implements OnInit {
  links = [
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
        readonly: false,
      },
      bookingId: {
        type: "string",
      },
      company: {
        type: "autocomplete",
        options: [],
      },
      corporate: {
        type: "autocomplete",
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
  dmsProcessing: boolean = false;
  private readonly _destroying$ = new Subject<void>();
  patientDetails!: Registrationdetails;
  apiProcessing: boolean = false;
  complanyList!: GetCompanyDataInterface[];
  coorporateList: { id: number; name: string }[] = [] as any;

  
  constructor(
    private cookie: CookieService,
    private formService: QuestionControlService,
    private matdialog: MatDialog,
    private http: HttpService,
    private datepipe: DatePipe,
    private route: ActivatedRoute
  ) { }

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
    } else {
      this.apiProcessing = false;
      this.patient = false;
    }
  }
  setValuesToMiscForm(pDetails: Registrationdetails) {
    let patientDetails = pDetails.dsPersonalDetails.dtPersonalDetails1[0];
    console.log(patientDetails.pCellNo);
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
  }
  doCategoryIconAction(icon: any) {}
  appointment_popup()
  {
    console.log("appointment");
    this.matdialog.open(AppointmentSearchDialogComponent, {
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
  visit_history()
  {
    this.matdialog.open(VisitHistoryComponent, 
      { width: "70%", 
        height: "50%",
        data:{
          maxid: this.formGroup.value.maxid
        } });
  }
  clear() {
    this.apiProcessing = false;
    this.patient = false;
    this.formGroup.reset();
    this.formGroup.controls["maxid"].setValue(this.cookie.get("LocationIACode") + ".");
  }

  getAllCompany() {
    this.http
      .get(ApiConstants.getcompanyandpatientsponsordata)
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
        console.log(resultData)
        this.coorporateList = resultData;
        // this.titleList.unshift({ id: 0, name: "-Select-", sex: 0, gender: "" });
        this.questions[4].options = this.coorporateList.map((l) => {
          return { title: l.name, value: l.id };
        });
      });
  }
}
