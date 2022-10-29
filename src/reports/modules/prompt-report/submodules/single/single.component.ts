import { Component, OnInit, Input, OnChanges } from "@angular/core";
import { DatePipe } from "@angular/common";
import { ReportService } from "@shared/services/report.service";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { HttpService } from "@shared/services/http.service";
import { Subject } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { environment } from "@environments/environment";
import { CrystalReport } from "@core/constants/CrystalReport";

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
    private http: HttpService,
    private dialog: MatDialog
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
    if (changes.reportConfig.previousValue) {
      if (
        changes.reportConfig.currentValue.reportName !=
        changes.reportConfig.previousValue.reportName
      ) {
        this.init();
      }
    } else {
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
    } else if (button.type == "export") {
      let url = "";
      let tempValues: any = this.formGroup.value.map((va: any) => {
        return typeof va == "string" ? va : va.value;
      });
      tempValues["exportflag"] = 1;
      if (
        typeof CrystalReport[
          button.reportEntity as keyof typeof CrystalReport
        ] == "string"
      ) {
        url =
          CrystalReport[
            button.reportEntity as keyof typeof CrystalReport
          ].toString();
      } else {
        let func: Function = <Function>(
          CrystalReport[button.reportEntity as keyof typeof CrystalReport]
        );
        url = func(tempValues).toString();
      }
      this.downloadFile(url, button.fileName, button.contenType);
    } else if (button.type == "crystalReport") {
      this.reportService.openWindow(
        button.reportConfig.reportName,
        button.reportConfig.reportEntity,
        {
          exportflag: 0,
          ...this.formGroup.value.map((va: any) => {
            return typeof va == "string" ? va : va.value;
          }),
        }
      );
    }
  }

  downloadFile(
    url: string,
    filename: string = "",
    contenType = "application/vnd.ms-excel"
  ) {
    const req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.responseType = "blob";
    req.onload = function () {
      const blob = new Blob([req.response], {
        type: contenType,
      });

      const isIE = false || !!(<any>document).documentMode;
      if (isIE) {
        (<any>window).navigator.msSaveBlob(blob, filename);
      } else {
        const windowUrl = window.URL || (<any>window).webkitURL;
        const href = windowUrl.createObjectURL(blob);
        const a = document.createElement("a");
        a.setAttribute("download", filename);
        a.setAttribute("href", href);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    };
    req.send();
  }
}
