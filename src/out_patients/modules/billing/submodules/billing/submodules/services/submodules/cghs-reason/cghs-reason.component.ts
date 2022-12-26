import { Component, Inject, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { HttpService } from "@shared/services/http.service";
import { CookieService } from "@shared/services/cookie.service";
import { Subject, takeUntil } from "rxjs";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { BillingStaticConstants } from "../../../../BillingStaticConstant";

@Component({
  selector: "out-patients-cghs-reason",
  templateUrl: "./cghs-reason.component.html",
  styleUrls: ["./cghs-reason.component.scss"],
})
export class CghsReasonComponent implements OnInit {
  cghsFormData = {
    title: "",
    type: "object",
    properties: {
      reason: {
        type: "dropdown",
        placeholder: "---Select---",
        required: true,
      },
    },
  };

  cghsForm!: FormGroup;
  question: any;
  private readonly _destroying$ = new Subject<void>();

  constructor(
    private formService: QuestionControlService,
    private http: HttpService,
    private cookie: CookieService,
    private messageDialogService: MessageDialogService,
    public dialogRef: MatDialogRef<CghsReasonComponent>,
    public matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.cghsFormData.properties,
      {}
    );
    this.cghsForm = formResult.form;
    this.question = formResult.questions;

    this.question[0].options = BillingStaticConstants.cghsReasons;
  }

  saveReason() {
    if (this.cghsForm.valid) {
      this.dialogRef.close({
        data: this.cghsForm.value,
      });
    }
  }

  Close() {
    this.dialogRef.close();
  }
}
