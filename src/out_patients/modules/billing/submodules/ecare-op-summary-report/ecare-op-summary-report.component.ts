import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { CookieService } from "@shared/services/cookie.service";
import { SearchService } from "@shared/services/search.service";
import { Subject, takeUntil } from "rxjs";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { ActivatedRoute, Router } from "@angular/router";
import { LookupService } from "@core/services/lookup.service";
import { MatDialog } from "@angular/material/dialog";
import { SimilarPatientDialog } from "@modules/registration/submodules/op-registration/op-registration.component";
import { HttpService } from "@shared/services/http.service";
import { BillingApiConstants } from "../billing/BillingApiConstant";

@Component({
  selector: "out-patients-ecare-op-summary-report",
  templateUrl: "./ecare-op-summary-report.component.html",
  styleUrls: ["./ecare-op-summary-report.component.scss"],
})
export class EcareOpSummaryReportComponent implements OnInit {
  ecareOpSummaryReportFormData = {
    title: "",
    type: "object",
    properties: {
      maxid: {
        type: "string",
        defaultValue: this.cookie.get("LocationIACode") + ".",
      },
      mobile: {
        title: "Mobile No",
        type: "number",
        pattern: "^[1-9]{1}[0-9]{9}",
      },
      fromdate: {
        type: "date",
      },
      todate: {
        type: "date",
      },
      clinics: {
        type: "autocomplete",
        required: false,
        placeholder: "--Select--",
      },
      doctorName: {
        type: "autocomplete",
        placeholder: "--Select--",
        options: [],
        required: true,
      },
    },
  };

  ecareOpSummaryReportForm!: FormGroup;
  questions: any;
  today: any;
  fromdate: any;
  searchbtn: boolean = true;
  clearbtn: boolean = true;
  apiProcessing: boolean = false;
  showtable: boolean = true;
  locationId = Number(this.cookie.get("HSPLocationId"));
  private readonly _destroying$ = new Subject<void>();

  config: any = {
    clickedRows: false,
    // clickSelection: "single",
    actionItems: false,
    dateformat: "dd/MM/yyyy h:mm a",
    selectBox: false,
    displayedColumns: [
      "visitNumber",
      "visitDateTime",
      "clinicName",
      "doctorName",
      "visitType",
      "printReport",
    ],
    columnsInfo: {
      visitNumber: {
        title: "Visit number",
        type: "string",
        tooltipColumn: "visitNumber",
      },
      visitDateTime: {
        title: "Visit date time",
        type: "date",
        tooltipColumn: "visitDateTime",
      },
      clinicName: {
        title: "Clinic name",
        type: "string",
        tooltipColumn: "clinicName",
      },
      doctorName: {
        title: "Doctor name",
        type: "string",
        tooltipColumn: "doctorName",
      },
      visitType: {
        title: "Visit type",
        type: "string",
        tooltipColumn: "visitType",
      },
      printReport: {
        title: "Print report",
        type: "image",
        disabledSort: true,
        style: {
          width: "10rem",
        },
      },
    },
  };

  tableData: any[] = [
    {
      visitNumber: "SCHS-0000012345678",
      visitDateTime: new Date(),
      clinicName: "SKTSSCHS-ENDOCORNIOLOGY",
      doctorName: "Promod Agrawal",
      visitType: "Op visit",
      printReport: "",
    },
    {
      visitNumber: "SCHS-0000012345678",
      visitDateTime: new Date(),
      clinicName: "SKTSSCHS-ENDOCORNIOLOGY",
      doctorName: "Promod Agrawal",
      visitType: "Op visit",
      printReport: "",
    },
    {
      visitNumber: "SCHS-0000012345678",
      visitDateTime: new Date(),
      clinicName: "SKTSSCHS-ENDOCORNIOLOGY",
      doctorName: "Promod Agrawal",
      visitType: "Op visit",
      printReport: "",
    },
  ];

  constructor(
    private cookie: CookieService,
    private formService: QuestionControlService,
    private searchService: SearchService,
    private route: ActivatedRoute,
    private router: Router,
    private lookupService: LookupService,
    public matDialog: MatDialog,
    private http: HttpService
  ) {}

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.ecareOpSummaryReportFormData.properties,
      {}
    );
    this.tableData = this.setimage(this.tableData);
    console.log("ec--", this.tableData);
    this.ecareOpSummaryReportForm = formResult.form;
    console.log(this.ecareOpSummaryReportForm);
    this.questions = formResult.questions;
    this.today = new Date();
    this.ecareOpSummaryReportForm.controls["todate"].setValue(this.today);
    this.fromdate = new Date(this.today);
    this.fromdate.setDate(this.fromdate.getDate() - 20);
    this.ecareOpSummaryReportForm.controls["fromdate"].setValue(this.fromdate);
    this.questions[2].maximum =
      this.ecareOpSummaryReportForm.controls["todate"].value;
    this.questions[3].minimum =
      this.ecareOpSummaryReportForm.controls["fromdate"].value;
    this.getClinics();
    // this.questions[4] = "";
    // this.questions[5] = "";
    this.searchService.searchTrigger
      .pipe(takeUntil(this._destroying$))
      .subscribe(async (formdata: any) => {
        console.log(formdata);
        this.router.navigate([], {
          queryParams: {},
          relativeTo: this.route,
        });
        const lookupdata = await this.lookupService.searchPatient(formdata);
        console.log("lookup--", lookupdata);
        if (lookupdata.length == 1) {
          if (lookupdata[0] && "maxid" in lookupdata[0]) {
            this.ecareOpSummaryReportForm.controls["maxid"].setValue(
              lookupdata[0]["maxid"]
            );
            this.ecareOpSummaryReportForm.value.maxid = lookupdata[0]["maxid"];
            //this.getPatientDetails();
          }
        } else {
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
            .subscribe((result) => {
              if (result) {
                console.log(result.data["added"][0].maxid);
                let maxID = result.data["added"][0].maxid;
                this.ecareOpSummaryReportForm.controls["maxid"].setValue(maxID);
                //this.getPatientDetails();
                this.clearbtn = false;
              }
              //this.similarContactPatientList = [];
            });
        }
      });
  }

  ngAfterViewInit(): void {
    //this.getClinics();
  }

  subScribeClinicChanges() {}

  // subScribeDoctorChanges(){
  //   this.formGroup.controls["doctorName"].valueChanges
  //     .pipe(
  //       filter((res) => {
  //         return res !== null && res.length >= 3;
  //       }),
  //       distinctUntilChanged(),
  //       debounceTime(1000),
  //       tap(() => {}),
  //       switchMap((value) => {
  //         if (
  //           this.formGroup.value.specialization &&
  //           this.formGroup.value.specialization.value
  //         ) {
  //           return of([]);
  //         } else {
  //           return this.http
  //             .get(
  //               BillingApiConstants.getbillingdoctorsonsearch(
  //                 value,
  //                 Number(this.cookie.get("HSPLocationId"))
  //               )
  //             )
  //             .pipe(finalize(() => {}));
  //         }
  //       })
  //     )
  //     .subscribe((data: any) => {
  //       if (data.length > 0) {
  //         this.questions[1].options = data.map((r: any) => {
  //           return {
  //             title: r.doctorNameWithSpecialization || r.doctorName,
  //             value: r.doctorId,
  //             originalTitle: r.doctorName,
  //             specialisationid: r.specialisationid,
  //             clinicID: r.clinicID,
  //           };
  //         });
  //         this.questions[1] = { ...this.questions[1] };
  //       }
  //     });
  // }
  getClinics() {
    this.http
      .get(BillingApiConstants.getclinics(this.locationId))
      .subscribe((res) => {
        this.questions[4].options = res.map((r: any) => {
          return { title: r.name, value: r.id };
        });
        this.questions[4] = { ...this.questions[4] };
      });

    this.ecareOpSummaryReportForm.controls["clinics"].valueChanges.subscribe(
      (val: any) => {
        console.log("changed clicnic", val);
        if (val && val.value) {
          this.getdoctorlistonSpecializationClinic(val.value, true);
        }
      }
    );
  }

  getdoctorlistonSpecializationClinic(
    clinicSpecializationId: number,
    isClinic = false
  ) {
    this.http
      .get(
        BillingApiConstants.getdoctorlistonSpecializationClinic(
          isClinic,
          clinicSpecializationId,
          Number(this.cookie.get("HSPLocationId"))
        )
      )
      .subscribe((res) => {
        this.ecareOpSummaryReportForm.controls["doctorName"].reset();
        this.questions[5].options = res.map((r: any) => {
          return {
            title: r.doctorNameWithSpecialization || r.doctorName,
            value: r.doctorId,
            originalTitle: r.doctorName,
            specialisationid: r.specialisationid,
            clinicID: r.clinicID,
          };
        });
        this.questions[5] = { ...this.questions[5] };
      });
  }

  setimage(tableData: any[]) {
    tableData.forEach((e) => {
      e.printReport = this.getimage();
    });
    return tableData;
  }

  getimage() {
    let returnicon: any = [];
    var tempPager: any = {
      src: "assets/print_Icon.svg",
    };
    returnicon.push(tempPager);
    return returnicon;
  }
  eCareOpSummarySearch() {}
  clear() {}
  printrow(event: any) {}
}
