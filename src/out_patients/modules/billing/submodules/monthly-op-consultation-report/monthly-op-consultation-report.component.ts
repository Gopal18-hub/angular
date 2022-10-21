import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ApiConstants } from "@core/constants/ApiConstants";

import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { Subject, takeUntil } from "rxjs";
import { locationmastermodel } from "@core/types/locationmaster.Interface";
import { HttpService } from "@shared/services/http.service";
import { DatePipe } from "@angular/common";
@Component({
  selector: "out-patients-monthly-op-consultation-report",
  templateUrl: "./monthly-op-consultation-report.component.html",
  styleUrls: ["./monthly-op-consultation-report.component.scss"],
})
export class MonthlyOpConsultationReportComponent implements OnInit {
  public locationmaster: locationmastermodel[] = [];
  OpConsultformData = {
    title: "",
    type: "object",
    properties: {
      fromdate: {
        title: "",
        type: "date",
        maximum: new Date(),
        defaultValue: new Date(),
      },
      todate: {
        title: "",
        type: "date",
        maximum: new Date(),
        defaultValue: new Date(),
      },
      Location: {
        type: "autocomplete",
        title: "",
        required: true,
        placeholder: "--Select--",
        defaultValue: this.locationmaster,
      },
    },
  };
  OpConsultform!: FormGroup;
  questions: any;
  msgresponse: any;
  private readonly _destroying$ = new Subject<void>();
  snackbar: any;

  constructor(
    private formService: QuestionControlService,
    private http: HttpService,
    private datepipe: DatePipe
  ) {}

  ngOnInit(): void {
    let formResult = this.formService.createForm(
      this.OpConsultformData.properties,
      {}
    );
    this.OpConsultform = formResult.form;
    this.questions = formResult.questions;
    this.getLocationMasterdropdown();
    // this.OpConsultform.controls["Location"].setErrors({ required: true });
    // this.questions[0].customErrorMessage = "Location Required";
  }
  getLocationMasterdropdown() {
    this.http
      .get(ApiConstants.getLocationMaster)
      .pipe(takeUntil(this._destroying$))
      .subscribe((resultdata: any) => {
        this.locationmaster = resultdata;
        console.log(this.locationmaster);
        this.OpConsultform.controls["Location"].setValue(
          this.locationmaster[0].name
        );
        this.questions[2].options = this.locationmaster.map((l) => {
          return { title: l.name, value: l.id };
        });
        this.OpConsultform.controls["Location"].setValue(
          this.locationmaster[0]["id"]
        );
        this.OpConsultform.controls["Location"].setErrors({
          incorrect: true,
        });
        this.questions[2] = { ...this.questions[2] };
      });
  }

  PerformQuery() {
    this.http
      .get(
        ApiConstants.getopconsultationcount(
          this.datepipe.transform(
            this.OpConsultform.controls["fromdate"].value,
            "YYYY-MM-dd"
          ),
          this.datepipe.transform(
            this.OpConsultform.controls["todate"].value,
            "YYYY-MM-dd"
          ),
          this.OpConsultform.controls["Location"].value.value
        )
      )
      .subscribe((result) => {
        console.log(result);
        if (result) {
          this.msgresponse = "Total No. of OP Consultation: " + result;
        }
        //else {
        //   this.OpConsultform.controls["Location"].setErrors({
        //     incorrect: true,
        //   });
        //   this.questions[2].snackbar = "Location is Required";
        // }
      });
  }
  clickbtn() {
    this.OpConsultform.reset();
    this.msgresponse = "";
    //this.ngOnInit();
    this.OpConsultform.controls["todate"].setValue(new Date());
    this.OpConsultform.controls["fromdate"].setValue(new Date());
  }
  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
