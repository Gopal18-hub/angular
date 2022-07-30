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
import { GetExpiredPatientDetailInterface } from "../../../../core/types/expiredPatient/getExpiredpatient.Interface";
import { DatePipe } from "@angular/common";
import { SaveExpiredPatientModel } from "../../../../../out_patients/core/models/saveexpiredpatient.Model";
import { CookieService } from "../../../../../shared/services/cookie.service";

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
        defaultValue: this.cookie.get("LocationIACode") + ".",
      },
      mobileno: {
        type: "number",
        title: "Mobile Number",
        pattern: "^[1-9]{1}[0-9]{9}",
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
  age!: string;
  gender!: string;
  dob!: any;
  dateofbirth: any;
  nationality!: string;
  ssn!: string;
  expiredPatientDetail!: GetExpiredPatientDetailInterface[];
  expiredpatientForm!: FormGroup;
  questions: any;
  disableButton: boolean = true;
  disableClear: boolean = true;
  todayDate = new Date();
  private readonly _destroying$ = new Subject<void>();
  saveApimessage!: string;
  iacode!: string;
  regno!: number;
  checkboxValue!: number;
  validmaxid!: boolean;

  constructor(
    private formService: QuestionControlService,
    private messagedialogservice: MessageDialogService,
    private dialog: MatDialog,
    private http: HttpService,
    private datepipe: DatePipe,
    private cookie: CookieService
  ) {}

  ngOnInit(): void {
    let formResult = this.formService.createForm(
      this.expiredpatientformdata.properties,
      {}
    );
    this.expiredpatientForm = formResult.form;
    this.questions = formResult.questions;
    this.expiredpatientForm.controls["expiryDate"].setValue(this.todayDate);
    this.dateofbirth = this.datepipe.transform(this.dob, "yyyy-Mm-dd");
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
    this.getCheckboxValue();
  }

  onMaxidSearch() {
    this.regno = Number(this.expiredpatientForm.value.maxid.split(".")[1]);
    this.iacode = this.expiredpatientForm.value.maxid.split(".")[0];
    console.log("inside on maxidenter");
    console.log(this.expiredpatientForm.value.maxid);

    // console.log(regno);
    // console.log(iacode);
    this.http
      .get(ApiConstants.expiredpatientdetail(this.regno, this.iacode))
      .pipe(takeUntil(this._destroying$))
      .subscribe(
        (data) => {
          console.log(data);
          this.expiredPatientDetail =
            data as GetExpiredPatientDetailInterface[];
          if (this.expiredPatientDetail != null) {
            if (this.expiredPatientDetail.length != 0) {
              console.log(this.expiredPatientDetail);
              this.validmaxid = true;
              this.disableClear = false;
              this.enableSavedeleteControl();
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
            } else {
              this.validmaxid = false;
              this.disableClear = false;
              this.expiredpatientForm.controls["maxid"].setErrors({
                incorrect: true,
              });
              this.questions[0].customErrorMessage = "Maxid does not exist";
              //this.clearValues();
            }
          } else {
            this.expiredpatientForm.controls["maxid"].setErrors({
              incorrect: true,
            });
            this.questions[0].customErrorMessage("Invalid Maxid");
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }

  // clearValues() {
  //   this.ssn = "";
  //   this.dob = null;
  //   this.expiredpatientForm.reset();
  //   this.expiredpatientForm.controls["expiryDate"].setValue(this.todayDate);
  // }

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
      this.http
        .post(
          ApiConstants.saveexpiredpatientdetail,
          this.getExpiredpatientDetailObj()
        )
        .pipe(takeUntil(this._destroying$))
        .subscribe(
          (resultdata) => {
            console.log(resultdata);
            this.saveApimessage = resultdata;
            if (this.saveApimessage.toString() == "Saved Successfully") {
              this.messagedialogservice.success("Data Saved");
              this.clearData();
              //this.expiredpatientForm.controls["checkbox"].setValue(false);
            }
          },
          (HttpErrorResponse) => {
            console.log(HttpErrorResponse);
            if (HttpErrorResponse.error.text == "Saved Successfully") {
              console.log("inside error success message");
              this.messagedialogservice.success("Data Saved");
              this.clearData();
            }
          }
        );
    }
  }
  saveExpiredPatientObject!: SaveExpiredPatientModel;
  getExpiredpatientDetailObj(): SaveExpiredPatientModel {
    this.iacode = this.expiredpatientForm.controls["maxid"].value.split(".")[0];
    this.regno = this.expiredpatientForm.controls["maxid"].value.split(".")[1];
    return (this.saveExpiredPatientObject = new SaveExpiredPatientModel(
      this.iacode,
      this.regno,
      "firstname",
      this.datepipe.transform(this.dob, "yyyy-MM-ddThh:mm:ss"),
      "2022-06-01T06:02:38.061Z",
      this.datepipe.transform(
        this.expiredpatientForm.value.expiryDate,
        "yyyy-MM-ddThh:mm:ss"
      ),
      this.checkboxValue,
      this.expiredpatientForm.controls["remarks"].value,
      1,
      ""
    ));
  }
  checked = false;
  getCheckboxValue() {
    this.expiredpatientForm.controls["checkbox"].valueChanges.subscribe(
      (value) => {
        console.log(value);
        console.log(this.expiredpatientForm.controls["checkbox"].value);
        if (value == true) {
          this.checked = true;
          this.checkboxValue = 1;
          this.enableSavedeleteControl();
        } else {
          this.checked = false;
          this.checkboxValue = 0;
        }
      }
    );
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
        this.http
          .get(ApiConstants.deleteexpiredpatientdetail(this.regno, this.iacode))
          .pipe(takeUntil(this._destroying$))
          .subscribe((data) => {
            console.log(data);
            this.messagedialogservice.success("Deleted Successfully");
            this.clearData();
          });
      }
    });
  }

  enableSavedeleteControl() {
    if (this.validmaxid && this.checked) {
      this.disableButton = false;
    } else {
      this.disableButton = true;
    }
  }
  clearData() {
    this.name = "";
    this.age = "";
    this.ssn = "";
    this.gender = "";
    this.nationality = "";
    this.dob = "";
    this.disableButton = true;
    this.disableClear = true;
    this.expiredpatientForm.reset();
    this.expiredpatientForm.controls["maxid"].setValue(
      this.cookie.get("LocationIACode") + "."
    );
    this.expiredpatientForm.controls["expiryDate"].setValue(this.todayDate);
  }
}
