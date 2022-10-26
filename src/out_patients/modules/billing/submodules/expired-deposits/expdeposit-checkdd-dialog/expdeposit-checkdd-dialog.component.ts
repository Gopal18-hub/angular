import { Component, Inject, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";
import { CookieService } from "@shared/services/cookie.service";
import { HttpService } from "@shared/services/http.service";
import { ApiConstants } from "@core/constants/ApiConstants";
import { UpdateOPExpiredDepositsPatientModel } from "@core/models/UpdateOPExpiredDepositsPatientModel.Model";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { inject } from "@angular/core/testing";
import { Subject, takeUntil } from "rxjs";
import { MaxHealthSnackBarService } from "@shared/ui/snack-bar";
@Component({
  selector: "out-patients-expdeposit-checkdd-dialog",
  templateUrl: "./expdeposit-checkdd-dialog.component.html",
  styleUrls: ["./expdeposit-checkdd-dialog.component.scss"],
})
export class ExpdepositCheckddDialogComponent implements OnInit {
  private readonly _destroying$ = new Subject<void>();
  CheckDDFormData = {
    type: "object",
    title: "",
    properties: {
      checkdd: {
        title: "",
        type: "number",
        required: true,
        placeholder: "Cheque Number",
      },
    },
  };
  CheckDDForm!: FormGroup;
  questions: any;
  constructor(
    private formService: QuestionControlService,
    private messageDialogService: MessageDialogService,
    private cookie: CookieService,
    private http: HttpService,
    private snackbar: MaxHealthSnackBarService,
    private dialogRef: MatDialogRef<ExpdepositCheckddDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(data);
  }

  ngOnInit(): void {
    let formResult = this.formService.createForm(
      this.CheckDDFormData.properties,
      {}
    );
    this.CheckDDForm = formResult.form;
    this.questions = formResult.questions;
  }
  UpdateOPExpiredDepositsPatient!: UpdateOPExpiredDepositsPatientModel;
  UpdateOPExpiredDepositsPatientObj(): UpdateOPExpiredDepositsPatientModel {
    return (this.UpdateOPExpiredDepositsPatient =
      new UpdateOPExpiredDepositsPatientModel(
        this.CheckDDForm.controls["checkdd"].value,
        this.data.id,
        this.cookie.get("UserId"),
        this.data.episode
      ));
  }

  Checkddfun() {
    var digit = this.CheckDDForm.controls["checkdd"].value.length;
    if (digit == 6) {
      // this.Checkddfun();
      console.log(this.CheckDDForm.controls["checkdd"].value);
      this.http
        .post(
          ApiConstants.postUpdateOPExpiredDepositsPatient,
          this.UpdateOPExpiredDepositsPatientObj()
        )
        .pipe(takeUntil(this._destroying$))
        .subscribe((res: any) => {
          console.log(res);
          this.dialogRef.close(res);
        });
    } else {
      this.snackbar.open("Invalid Check/DD", "error");
    }
  }

  ngOnDestroy() {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
