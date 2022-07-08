import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { QuestionControlService } from "../../../../../shared/ui/dynamic-forms/service/question-control.service";
import { MessageDialogService } from "../../../../../shared/ui/message-dialog/message-dialog.service";
import { MatDialog } from "@angular/material/dialog";
import { SaveexpiredpatientDialogComponent } from "./saveexpiredpatient-dialog/saveexpiredpatient-dialog.component";
import { DeleteexpiredpatientDialogComponent } from "./deleteexpiredpatient-dialog/deleteexpiredpatient-dialog.component";
import { dateInputsHaveChanged } from "@angular/material/datepicker/datepicker-input-base";
import { Subject, takeUntil } from "rxjs";
import { HttpService } from "@shared/services/http.service";
import { ApiConstants } from "@core/constants/ApiConstants";

@Component({
  selector: "out-patients-expired-patient-check",
  templateUrl: "./expired-patient-check.component.html",
  styleUrls: ["./expired-patient-check.component.scss"],
})
export class ExpiredPatientCheckComponent implements OnInit {
  expiredpatientformdata = {
    type: "object",
    title: "",
    properties: {
      maxid: {
        type: "string",
      },
      mobileno: {
        type: "number",
      },
      checkbox: {
        type: "checkbox",
        options: [
          {
            title: "",
          },
        ],
      },
      dateInput: {
        type: "date",
      },
      remarks: {
        type: "textarea",
      },
    },
  };

  expiredpatientForm!: FormGroup;
  questions: any;
  disableButton: boolean = true;
  todayDate = new Date();
  private readonly _destroying$ = new Subject<void>();

  constructor(
    private formService: QuestionControlService,
    private messagedialogservice: MessageDialogService,
    private dialog: MatDialog,
    private http: HttpService
  ) {}

  ngOnInit(): void {
    let formResult = this.formService.createForm(
      this.expiredpatientformdata.properties,
      {}
    );
    this.expiredpatientForm = formResult.form;
    this.questions = formResult.questions;
    this.expiredpatientForm.controls["dateInput"].setValue(this.todayDate);
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

  ngAfterViewInit(): void {
    this.questions[0].elementRef.addEventListener("keypress", (event: any) => {
      // If the user presses the "Enter" key on the keyboard

      if (event.key === "Enter") {
        // Cancel the default action, if needed

        event.preventDefault();

        this.onMaxidEnter();
      }
    });
  }

  onMaxidEnter() {
    console.log("inside on maxidenter");
    console.log(this.expiredpatientForm.value.maxid);
    let regnumber = Number(this.expiredpatientForm.value.maxid.split(".")[1]);
    let iacode = this.expiredpatientForm.value.maxid.split(".")[0];
    this.http
      .get(ApiConstants.expiredpatientdetail)
      .pipe(takeUntil(this._destroying$))
      .subscribe((data) => {
        console.log(data);
      });

    // if (
    //   this.expiredpatientForm.value.maxid != null ||
    //   this.expiredpatientForm.value.maxid != undefined
    // ) {
    //   console.log("inside if maxid method");
    //   this.disableButton = false;
    // } else {
    //   this.disableButton = true;
    // }
  }

  saveExpiredpatient() {
    console.log(this.expiredpatientForm.value);
    this.expiredpatientForm.controls["checkbox"].valueChanges.subscribe(
      (value) => {
        console.log(value);
      }
    );
    if (this.expiredpatientForm.value.checkbox == false) {
      this.dialog.open(SaveexpiredpatientDialogComponent, {
        width: "25vw",
        height: "30vh",
      });
    } else {
      this.messagedialogservice.success("Data Saved");
    }
  }

  deleteExpiredpatient() {
    this.dialog.open(DeleteexpiredpatientDialogComponent, {
      width: "25vw",
      height: "30vh",
    });
  }
}
