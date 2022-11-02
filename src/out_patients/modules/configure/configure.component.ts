import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { DynamicFormQuestionComponent } from "@shared/ui/dynamic-forms/dynamic-form-question.component";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { SearchService } from "@shared/services/search.service";
import { LookupService } from "@core/services/lookup.service";
import { Subject, takeUntil } from "rxjs";
import { Router, ActivatedRoute } from "@angular/router";
@Component({
  selector: "out-patients-configure",
  templateUrl: "./configure.component.html",
  styleUrls: ["./configure.component.scss"],
})
export class ConfigureComponent implements OnInit {
  private readonly _destroying$ = new Subject<void>();
  questions: any;
  risconfigureform!: FormGroup;
  config: any = {
    actionItems: false,
    /// dateformat: "dd/MM/yyyy",
    clickedRows: false,
    selectBox: true,
    // selectCheckBoxPosition: 10,
    clickSelection: "single",
    displayedColumns: [
      "testname",
      "ssn",
      "orderdate",
      "ordertime",
      "messagestatus",
    ],
    columnsInfo: {
      testname: {
        title: "Test Name",
        type: "string",
        style: {
          width: "10rem",
        },
        tooltipColumn: "testname",
      },
      ssn: {
        title: "SSN",
        type: "string",
        style: {
          width: "6rem",
        },
        tooltipColumn: "ssn",
      },
      orderdate: {
        title: "Order Date",
        type: "string",
        style: {
          width: "5.5rem",
        },
        tooltipColumn: "orderdate",
      },
      ordertime: {
        title: "Order Time",
        type: "string",
        style: {
          width: "9rem",
        },
        tooltipColumn: "ordertime",
      },
      messagestatus: {
        title: "Message Status",
        type: "string",
        style: {
          width: "9.5rem",
        },
        tooltipColumn: "messagestatus",
      },
    },
  };
  constructor(
    private formService: QuestionControlService,
    private searchService: SearchService,
    private lookupService: LookupService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.risconfigureformData.properties,
      {}
    );
    this.risconfigureform = formResult.form;
    this.questions = formResult.questions;
    this.searchService.searchTrigger
      .pipe(takeUntil(this._destroying$))
      .subscribe(async (formdata: any) => {
        console.log(formdata);
        this.router.navigate([], {
          queryParams: {},
          relativeTo: this.route,
        });
        const lookupdata = await this.lookupService.searchPatient(formdata);
      });
  }
  risconfigureformData = {
    title: "",
    type: "object",
    properties: {
      billno: {
        type: "string",
      },
    },
  };
  ngOnDestroy() {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
