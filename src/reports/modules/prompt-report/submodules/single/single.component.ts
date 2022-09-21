import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { DatePipe } from "@angular/common";
import { ReportService } from "@shared/services/report.service";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { HttpService } from "@shared/services/http.service";
import { environment } from "@environments/environment";
import { Subject, takeUntil } from "rxjs";

@Component({
  selector: "reports-single",
  templateUrl: "./single.component.html",
  styleUrls: ["./single.component.scss"],
})
export class SingleComponent implements OnInit, OnChanges {
  @Input() reportConfig: any;
  formGroup: any;
  questions: any;

  private readonly _destroying$ = new Subject<void>();

  constructor(
    private datepipe: DatePipe,
    private reportService: ReportService,
    private formService: QuestionControlService,
    private http: HttpService
  ) {}

  ngOnInit(): void {
    this.init();
  }

  init() {
    let formResult: any = this.formService.createForm(
      this.reportConfig.filterForm.properties,
      {}
    );
    this.formGroup = formResult.form;
    this.questions = formResult.questions;
  }

  ngOnChanges(changes: any): void {
    if (
      changes.reportConfig.currentValue.reportName !=
      changes.reportConfig.previousValue.reportName
    ) {
      this.init();
    }
  }

  submit() {
    if (this.formGroup.valid) {
    }
  }

  buttonAction(button: any) {
    if (button.type == "clear") {
      this.formGroup.reset();
    } else if (button.type == "crystalReport") {
      for (var i = 0; i < this.questions.length; i++) {
        console.log(this.reportConfig.filterForm);
        if (this.questions[i].type == "date") {
          console.log(this.questions[i]);
          var temp = this.datepipe.transform(
            this.formGroup.controls[this.questions[i].key].value,
            this.reportConfig.filterForm.format
          );
          this.formGroup.controls[this.questions[i].key].setValue(temp);
        }
      }
      console.log(this.formGroup);
      if (
        button.reportConfig.reportEntity ==
        "DoctorSheduleReportBySpecilialisation"
      ) {
        let specilizationName;
        this.http
          .get(`${environment.CommonApiUrl}api/lookup/getallspecialisationname`)
          .pipe(takeUntil(this._destroying$))
          .subscribe((resultData: any) => {
            if (resultData) {
              if (resultData.length > 0) {
                if (
                  !this.formGroup.value.Cmb_Special ||
                  this.formGroup.value.Cmb_Special == "0"
                ) {
                  this.formGroup.value.Cmb_Special = 0;
                }
                specilizationName = resultData.filter(
                  (e: any) => e.id === this.formGroup.value.Cmb_Special
                )[0].name;
                let Cmb_Special = this.formGroup.value.Cmb_Special;
                let datetype = this.formGroup.value.datetype;
                let dtpEndDate = this.formGroup.value.dtpEndDate;
                let dtpStartDate = this.formGroup.value.dtpStartDate;
                this.reportService.openWindow(
                  button.reportConfig.reportName,
                  button.reportConfig.reportEntity,
                  {
                    Cmb_Special,
                    datetype,
                    dtpEndDate,
                    dtpStartDate,
                    specilizationName,
                  }
                );
              }
            }
          });
      } else {
        this.reportService.openWindow(
          button.reportConfig.reportName,
          button.reportConfig.reportEntity,
          this.formGroup.value
        );
      }
      if (button.reportConfig.reportEntity == "OpenScrollReport") {
        let openscrolltypename;
        this.http
          .get(`${environment.CommonApiUrl}api/lookup/getopenscrolldata/0`)
          .pipe(takeUntil(this._destroying$))
          .subscribe((resultData: any) => {
            if (resultData) {
              if (resultData.length > 0) {
                if (
                  !this.formGroup.value.cmbopenscrolltype ||
                  this.formGroup.value.cmbopenscrolltype == "0"
                ) {
                  this.formGroup.value.cmbopenscrolltype = 0;
                }
                openscrolltypename = resultData.filter(
                  (e: any) => e.id === this.formGroup.value.cmbopenscrolltype
                )[0].name;
                let user = this.formGroup.value.user;
                let cmbopenscrolltype = this.formGroup.value.cmbopenscrolltype;
                let datetype = this.formGroup.value.datetype;
                let dtpEndDate = this.formGroup.value.dtpEndDate;
                let dtpStartDate = this.formGroup.value.dtpStartDate;
                this.reportService.openWindow(
                  button.reportConfig.reportName,
                  button.reportConfig.reportEntity,
                  {
                    cmbopenscrolltype,
                    datetype,
                    dtpEndDate,
                    dtpStartDate,
                    openscrolltypename,
                    user,
                  }
                );
              }
            }
          });
      } else {
        this.reportService.openWindow(
          button.reportConfig.reportName,
          button.reportConfig.reportEntity,
          this.formGroup.value
        );
      }
    }
  }
}
