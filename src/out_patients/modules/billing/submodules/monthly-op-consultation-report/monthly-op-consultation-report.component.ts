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
        title: "",
        type: "dropdown",
        required: true,
        placeholder: "--Select--",
        Option: this.locationmaster,
      },
    },
  };
  OpConsultform!: FormGroup;
  questions: any;
  msgresponse: any;
  private readonly _destroying$ = new Subject<void>();
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
          this.OpConsultform.controls["Location"].value
        )
      )
      .subscribe((result) => {
        console.log(result);
        this.msgresponse = "Total No. of OP Consultation: " + result;
      });
  }
  clickbtn() {
    this.OpConsultform.reset();
    this.msgresponse = "";
    this.ngOnInit();
  }
  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
