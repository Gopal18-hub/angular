import { Component, OnInit, SimpleChanges } from "@angular/core";
import { FormReport } from "../../../../core/constants/FormReport";
import { ActivatedRoute, Router } from "@angular/router";
import { Subject } from "rxjs";
import { filter, takeUntil } from "rxjs/operators";
import { FormGroup } from "@angular/forms";
@Component({
  selector: "reports-basic",
  templateUrl: "./basic.component.html",
  styleUrls: ["./basic.component.scss"],
})
export class BasicComponent implements OnInit {
  private readonly _destroying$ = new Subject<void>();

  formGroup!: FormGroup;
  questions: any;

  reportConfig: any;
  reportName: string = "";

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this._destroying$))
      .subscribe((params: any) => {
        if (
          params.reportName &&
          FormReport[params.reportName as keyof typeof FormReport]
        ) {
          this.reportName = params.reportName;
          this.reportConfig =
            FormReport[params.reportName as keyof typeof FormReport];
        } else {
        }
      });
  }
}
