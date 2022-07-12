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
import { GetExpiredPatientDetailModel } from "../../../../../out_patients/core/models/getexpiredpatientdetailModel.Model";
import { DatePipe } from "@angular/common";

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
      expiryDate: {
        type: "date",
      },
      remarks: {
        type: "textarea",
      },
    },
  };

  name!: string;
  age!: number;
  gender!: string;
  dob!: any;
  nationality!: string;
  ssn!: string;
  expiredPatientDetail!: GetExpiredPatientDetailModel[];
  expiredpatientForm!: FormGroup;
  questions: any;
  disableButton: boolean = true;
  todayDate = new Date();
  private readonly _destroying$ = new Subject<void>();

  constructor(
    private formService: QuestionControlService,
    private messagedialogservice: MessageDialogService,
    private dialog: MatDialog,
    private http: HttpService,
    private datepipe: DatePipe
  ) {}

  ngOnInit(): void {
    let formResult = this.formService.createForm(
      this.expiredpatientformdata.properties,
      {}
    );
    this.expiredpatientForm = formResult.form;
    this.questions = formResult.questions;
    this.expiredpatientForm.controls["expiryDate"].setValue(this.todayDate);
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
        this.onMaxidSearch();
      }
    });
  }

  onMaxidSearch() {
    console.log("inside on maxidenter");
    console.log(this.expiredpatientForm.value.maxid);
    let regnumber = Number(this.expiredpatientForm.value.maxid.split(".")[1]);
    let iacode = this.expiredpatientForm.value.maxid.split(".")[0];
    console.log(regnumber);
    console.log(iacode);
    this.http
      .get(ApiConstants.expiredpatientdetail(regnumber, iacode))
      .subscribe((data) => {
        console.log(data);
        this.expiredPatientDetail = data;
        if (this.expiredPatientDetail.length != 0) {
          console.log(this.expiredPatientDetail);
          console.log(
            this.datepipe.transform(
              this.expiredPatientDetail[0].dateofBirth,
              "dd/MM/yyyy"
            )
          );
          this.dob = this.datepipe.transform(
            this.expiredPatientDetail[0].dateofBirth,
            "dd/MM/yyyy"
          );
          this.ssn = this.expiredPatientDetail[0].ssn;
          this.expiredpatientForm.controls["expiryDate"].setValue(
            this.expiredPatientDetail[0].expiryDate
          );
          this.expiredpatientForm.controls["remarks"].setValue(
            this.expiredPatientDetail[0].remarks
          );
          this.disableButton = false;
        } else {
          this.clearValues();
        }
      });
  }

  clearValues() {
    this.ssn = "";
    this.dob = null;
    this.expiredpatientForm.reset();
    this.expiredpatientForm.controls["expiryDate"].setValue(this.todayDate);
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
    let dialogRef = this.dialog.open(DeleteexpiredpatientDialogComponent, {
      width: "25vw",
      height: "30vh",
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("The dialog was closed");
      console.log(result);
      if (result == true) {
      }
    });
  }
}
