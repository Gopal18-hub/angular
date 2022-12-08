import { Component, Inject, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { HttpService } from "@shared/services/http.service";
import { BillingApiConstants } from "../../BillingApiConstant";
import { CookieService } from "@shared/services/cookie.service";
import { Subject, takeUntil } from "rxjs";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";

@Component({
  selector: "out-patients-reason-for-due-bill",
  templateUrl: "./reason-for-due-bill.component.html",
  styleUrls: ["./reason-for-due-bill.component.scss"],
})
export class ReasonForDueBillComponent implements OnInit {
  reasonForDueBillData = {
    title: "",
    type: "object",
    properties: {
      reason: {
        type: "dropdown",
        placeholder: "---Select---",
        required: true,
      },
      remarks: {
        type: "textarea",
        placeholder: "Write note",
        required: true,
      },
      authorisedby: {
        type: "dropdown",
        placeholder: "---Select---",
        required: true,
      },
    },
  };
  reasonForDueBillForm!: FormGroup;
  question: any;
  private readonly _destroying$ = new Subject<void>();
  constructor(
    private formService: QuestionControlService,
    private http: HttpService,
    private cookie: CookieService,
    private messageDialogService: MessageDialogService,
    public dialogRef: MatDialogRef<ReasonForDueBillComponent>,
    public matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.reasonForDueBillData.properties,
      {}
    );
    this.reasonForDueBillForm = formResult.form;
    this.question = formResult.questions;

    this.getOPReasonsAndAuthorisedBy();
  }

  getOPReasonsAndAuthorisedBy() {
    this.http
      .get(
        BillingApiConstants.getOPReasonsAndAuthorisedBy(
          Number(this.cookie.get("HSPLocationId"))
        )
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe(
        (response: any) => {
          if (response) {
            if (response.reasons) {
              if (response.reasons.length > 0) {
                this.question[0].options = response.reasons.map((r: any) => {
                  return { title: r.reason, value: r.id };
                });
                this.reasonForDueBillForm.controls["reason"].setValue(
                  response.reasons[0].id
                );
              }
            }

            if (response.authorisedBy) {
              if (response.authorisedBy.length > 0) {
                this.question[2].options = response.authorisedBy.map(
                  (r: any) => {
                    return { title: r.name, value: r.id };
                  }
                );
                this.reasonForDueBillForm.controls["authorisedby"].setValue(
                  response.authorisedBy[0].id
                );
              }
            }
          }
        },
        (error: any) => {
          this.messageDialogService.error(error.error);
        }
      );
  }

  authorize() {
    if (this.reasonForDueBillForm.valid) {
      let reason = this.question[0].options.filter(
        (r: any) => r.value === this.reasonForDueBillForm.value.reason
      )[0].title;
      this.dialogRef.close({
        data: this.reasonForDueBillForm.value,
        reason: reason,
      });
    }
  }

  Close() {
    this.dialogRef.close();
  }
}
