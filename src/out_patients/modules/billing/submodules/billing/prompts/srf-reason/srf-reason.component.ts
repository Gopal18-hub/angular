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
import { BillingStaticConstants } from "../../BillingStaticConstant";

@Component({
  selector: "out-patients-srf-reason",
  templateUrl: "./srf-reason.component.html",
  styleUrls: ["./srf-reason.component.scss"],
})
export class SrfReasonComponent implements OnInit {
  srfFormData = {
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

  srfForm!: FormGroup;
  question: any;
  private readonly _destroying$ = new Subject<void>();

  constructor(
    private formService: QuestionControlService,
    private http: HttpService,
    private cookie: CookieService,
    private messageDialogService: MessageDialogService,
    public dialogRef: MatDialogRef<SrfReasonComponent>,
    public matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.srfFormData.properties,
      {}
    );
    this.srfForm = formResult.form;
    this.question = formResult.questions;

    this.question[0].options = BillingStaticConstants.srfReasons;
  }

  saveReason() {
    if (this.srfForm.valid) {
      this.dialogRef.close({
        data: this.srfForm.value,
      });
    }
  }

  Close() {
    this.dialogRef.close();
  }
}
