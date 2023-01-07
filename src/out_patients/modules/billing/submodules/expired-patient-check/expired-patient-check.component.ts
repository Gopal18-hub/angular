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
import { PatientService } from "../../../../core/services/patient.service";
import { SimilarPatientDialog } from "../../../../modules/registration/submodules/op-registration/op-registration.component";
import { SearchService } from "@shared/services/search.service";
import { Router, ActivatedRoute } from "@angular/router";
import { LookupService } from "../../../../../out_patients/core/services/lookup.service";
import { PatientDetails } from "@core/models/patientDetailsModel.Model";
import { MaxHealthSnackBarService } from "@shared/ui/snack-bar";
interface deleteexpiredResponse {
  success: boolean;
  message: string;
}
@Component({
  selector: "out-patients-expired-patient-check",
  templateUrl: "./expired-patient-check.component.html",
  styleUrls: ["./expired-patient-check.component.scss"],
})
export class ExpiredPatientCheckComponent implements OnInit {
  lastUpdatedBy: string = this.cookie.get("UserName");
  userId = Number(this.cookie.get("UserId"));
  currentTime: string = new Date().toLocaleString();
  apiprocessing: boolean = false;
  expiredpatientformdata = {
    type: "object",
    title: "",
    dateformat: "dd/MM/yyyy",
    properties: {
      maxid: {
        type: "string",
        defaultValue: this.cookie.get("LocationIACode") + ".",
      },
      mobileno: {
        type: "tel",
        title: "Mobile Number",
        // pattern: "^[1-9]{1}[0-9]{9}",
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
        maximum: new Date(),
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
  categoryIcons: any = [];
  expireddate!: any;

  constructor(
    private formService: QuestionControlService,
    private messagedialogservice: MessageDialogService,
    private dialog: MatDialog,
    private http: HttpService,
    private datepipe: DatePipe,
    private cookie: CookieService,
    private patientService: PatientService,
    private searchService: SearchService,
    private router: Router,
    private route: ActivatedRoute,
    private lookupservice: LookupService,
    private snackbar: MaxHealthSnackBarService,
  ) {}

  ngOnInit(): void {
    let formResult = this.formService.createForm(
      this.expiredpatientformdata.properties,
      {}
    );
    this.expiredpatientForm = formResult.form;
    this.questions = formResult.questions;
    this.expiredpatientForm.controls["expiryDate"].setValue(this.todayDate);
    this.searchService.searchTrigger
      .pipe(takeUntil(this._destroying$))
      .subscribe(async (formdata: any) => {
        console.log(formdata);
        this.router.navigate([], {
          queryParams: {},
          relativeTo: this.route,
        });
        const lookupdata = await this.lookupservice.searchPatient(formdata);
        console.log(lookupdata[0]);
        if (lookupdata.length == 1) {
          if (lookupdata[0] && "maxid" in lookupdata[0]) {
            this.expiredpatientForm.controls["maxid"].setValue(
              lookupdata[0]["maxid"]
            );

            // this.dmgMappingForm.value.maxid = lookupdata[0]["maxid"];

            this.onMaxidSearch(this.expiredpatientForm.controls["maxid"].value);
          }
        } else if (lookupdata.length > 1) {
          const similarSoundDialogref = this.dialog.open(
            SimilarPatientDialog,

            {
              width: "60vw",

              height: "65vh",

              data: {
                searchResults: lookupdata,
              },
            }
          );

          similarSoundDialogref

            .afterClosed()

            .pipe(takeUntil(this._destroying$))

            .subscribe((result: any) => {
              if (result) {
                console.log(result.data["added"][0].maxid);

                let maxID = result.data["added"][0].maxid;
                this.expiredpatientForm.controls["maxid"].setValue(maxID);
                this.onMaxidSearch(
                  this.expiredpatientForm.controls["maxid"].value
                );
              }

              //this.similarContactPatientList = [];
            });
        }
      });
  }

  ngAfterViewInit(): void {
    this.questions[0].elementRef.addEventListener("keypress", (event: any) => {
      // If the user presses the "Enter" key on the keyboard
      if (event.key === "Enter") {
        // Cancel the default action, if needed
        event.preventDefault();
        this.onMaxidSearch(this.expiredpatientForm.controls["maxid"].value);
      }
    });
    this.questions[1].elementRef.addEventListener("keypress", (event: any) => {
      if (event.key === "Enter") {
        event.preventDefault();
        if(this.expiredpatientForm.value.mobileno.toString().length == 10)
        {
          this.onMobilenumberEnter();
        }
        else
        {
          this.snackbar.open('Invalid Mobile No', 'error');
        }
        
      }
    });
    this.getCheckboxValue();
  }

  onMaxidSearch(maxid: any) {
    // this.regno = Number(this.expiredpatientForm.value.maxid.split(".")[1]);
    //this.iacode = this.expiredpatientForm.value.maxid.split(".")[0];
    let iacode = maxid.split(".")[0];
    let regno = maxid.split(".")[1];
    console.log("inside on maxidenter");
    console.log(this.expiredpatientForm.value.maxid);
    this.apiprocessing = true;

    // console.log(regno);
    // console.log(iacode);
    this.http
      .get(ApiConstants.expiredpatientdetail(regno, iacode))
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
              this.disableButton = false;
              this.apiprocessing = false;
              //this.enableSavedeleteControl();
              console.log(
                this.datepipe.transform(
                  this.expiredPatientDetail[0].dateofBirth,
                  "dd/MM/yyyy"
                )
              );
              this.name = this.expiredPatientDetail[0].patientName;
              this.age = this.expiredPatientDetail[0].age;
              this.gender = this.expiredPatientDetail[0].gender;
              this.nationality = this.expiredPatientDetail[0].nationality;
              this.dateofbirth = this.expiredPatientDetail[0].dateofBirth;
              this.dob = this.datepipe.transform(
                this.expiredPatientDetail[0].dateofBirth,
                "dd/MM/yyyy"
              );
              this.ssn = this.expiredPatientDetail[0].ssn;
              this.expiredpatientForm.controls["maxid"].setValue(
                this.expiredPatientDetail[0].regno
              );
              this.expiredpatientForm.controls["mobileno"].setValue(
                this.expiredPatientDetail[0].mobileNo
              );
              this.expireddate = this.datepipe.transform(
                this.expiredPatientDetail[0].expiryDate,
                "dd/MM/yyyy"
              );
              console.log(this.expireddate);
              if (this.expireddate == "01/01/1900") {
                this.expiredpatientForm.controls["expiryDate"].setValue(
                  this.todayDate
                );
              } else {
                this.expiredpatientForm.controls["expiryDate"].setValue(
                  this.expiredPatientDetail[0].expiryDate
                );
              }

              this.expiredpatientForm.controls["remarks"].setValue(
                this.expiredPatientDetail[0].remarks
              );
              this.expiredpatientForm.controls["checkbox"].setValue(
                this.expiredPatientDetail[0].flagexpired
              );
              // this.categoryIcons = this.patientService.getCategoryIcons(
              //   this.expiredPatientDetail[0]
              // );
              this.getPatientIcon();
            } else {
              this.validmaxid = false;
              this.apiprocessing = false;
              // this.disableClear = false;
              this.seterroronMaxid();
            }
          } else {
            this.apiprocessing = false;
            this.seterroronMaxid();
          }
        },
        (error) => {
          this.apiprocessing = false;
          console.log(error);
          this.seterroronMaxid();
        }
      );
    // this.questions[0].elementRef.focus();
  }

  patientDetailsforicon!: PatientDetails;
  getPatientIcon() {
    let iacode = this.expiredpatientForm.value.maxid.split(".")[0];
    let regNumber = this.expiredpatientForm.value.maxid.split(".")[1];
    this.http
      .get(ApiConstants.patientDetails(regNumber, iacode))
      .pipe(takeUntil(this._destroying$))
      .subscribe(
        (resultData: PatientDetails) => {
          // this.clear();
          this.patientDetailsforicon = resultData;
          this.categoryIcons = this.patientService.getCategoryIconsForPatient(
            this.patientDetailsforicon
          );
        },
        (error) => {}
      );
  }
  seterroronMaxid() {
    this.clearpatientData();
    this.questions[1].elementRef.focus();
    this.snackbar.open('Invalid Max ID', 'error');
    // this.expiredpatientForm.controls["maxid"].setErrors({
    //   incorrect: true,
    // });
    // this.questions[0].customErrorMessage = "Invalid Maxid";
    this.expiredpatientForm.controls["mobileno"].setValue(null);
    this.questions[0].elementRef.focus();
  }
  onMobilenumberEnter() {
    this.apiprocessing = false;
    this.http
      .post(ApiConstants.similarSoundPatientDetail, {
        phone: this.expiredpatientForm.controls["mobileno"].value,
      })
      .pipe(takeUntil(this._destroying$))
      .subscribe(
        (resultdata) => {
          console.log(resultdata);
          if (resultdata != null) {
            if (resultdata.length > 1) {
              this.apiprocessing = false;
              const similarpatientDialog = this.dialog.open(
                SimilarPatientDialog,
                {
                  width: "60vw",
                  height: "80vh",
                  data: {
                    searchResults: resultdata,
                  },
                }
              );
              similarpatientDialog.afterClosed().subscribe((resultdata) => {
                console.log(resultdata);
                this.onMaxidSearch(resultdata.data.added[0].maxid);
              });
            } else if (resultdata.length == 1) {
              this.apiprocessing = false;
              this.onMaxidSearch(resultdata[0].maxid);
            }
          } else {
            this.apiprocessing = false;
          }
        },
        (error) => {
          this.apiprocessing = false;
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
    // this.expiredpatientForm.controls["checkbox"].valueChanges.subscribe(
    //   (value) => {
    //     console.log(value);
    //   }
    // );
    if (this.expiredpatientForm.value.checkbox == false) {
      this.dialog.open(SaveexpiredpatientDialogComponent, {
        width: "25%",
        height: "36%",
      });
    } else if (this.expiredpatientForm.value.remarks == "") {
      this.messagedialogservice.info("Please enter remarks");
    } else {
      this.apiprocessing = true;
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
              this.messagedialogservice.success("Data saved successfully");
              this.apiprocessing = false;
              this.onMaxidSearch(
                this.expiredpatientForm.controls["maxid"].value
              );
              //this.clearData();
              //this.expiredpatientForm.controls["checkbox"].setValue(false);
            } else {
              this.apiprocessing = false;
            }
          },
          (HttpErrorResponse) => {
            console.log(HttpErrorResponse);
            if (HttpErrorResponse.error.text == "Saved Successfully") {
              console.log("inside error success message");
              this.messagedialogservice.success("Data saved successfully");
              this.apiprocessing = false;
              this.onMaxidSearch(
                this.expiredpatientForm.controls["maxid"].value
              );
              //this.clearData();
            } else {
              this.apiprocessing = false;
            }
          }
        );
    }
  }
  saveExpiredPatientObject!: SaveExpiredPatientModel;
  setDateofbirth() {
    if (this.dateofbirth == " " || this.dateofbirth == null) {
      this.dateofbirth = "1900-01-01T12:00:00";
    }
  }
  getExpiredpatientDetailObj(): SaveExpiredPatientModel {
    console.log(this.dob);
    this.setDateofbirth();
    this.iacode = this.expiredpatientForm.controls["maxid"].value.split(".")[0];
    this.regno = this.expiredpatientForm.controls["maxid"].value.split(".")[1];
    return (this.saveExpiredPatientObject = new SaveExpiredPatientModel(
      this.iacode,
      this.regno,
      "firstname",
      this.dateofbirth,
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
  deleteExpiredpatientResponse!: deleteexpiredResponse;
  deleteExpiredpatient() {
    console.log(this.regno);
    console.log(this.iacode);
    this.iacode = this.expiredpatientForm.controls["maxid"].value.split(".")[0];
    this.regno = this.expiredpatientForm.controls["maxid"].value.split(".")[1];
    if (this.expiredpatientForm.value.checkbox == false) {
      this.dialog.open(SaveexpiredpatientDialogComponent, {
        width: "25%",
        height: "36%",
      });
    } else if (this.expiredpatientForm.value.remarks == "") {
      this.messagedialogservice.info("Please enter remarks");
    } else {
      let dialogRef = this.messagedialogservice.confirm(
        "",
        "Do You Want to Delete Expired Patient Details?"
      );
      // let dialogRef = this.dialog.open(DeleteexpiredpatientDialogComponent, {
      //   width: "25vw",
      //   height: "37vh",
      // });

      dialogRef.afterClosed().subscribe((result) => {
        console.log("The dialog was closed");
        console.log(result);
        if (result.type == "yes") {
          this.apiprocessing = true;
          this.http
            .post(
              ApiConstants.deleteexpiredpatientdetail(
                this.regno,
                this.iacode,
                this.userId
              ),
              null
            )
            .pipe(takeUntil(this._destroying$))
            .subscribe(
              (data) => {
                console.log(data);
                this.deleteExpiredpatientResponse =
                  data as deleteexpiredResponse;
                console.log(this.deleteExpiredpatientResponse.success);
                if (this.deleteExpiredpatientResponse.success == true) {
                  this.messagedialogservice.success(
                    "Patient Expired Details Has Been Deleted"
                  );
                  this.apiprocessing = false;
                } else {
                  this.apiprocessing = false;
                }
                this.onMaxidSearch(
                  this.expiredpatientForm.controls["maxid"].value
                );
                //this.clearData();
              },
              (error) => {
                this.apiprocessing = false;
              }
            );
        }
      });
    }
  }

  enableSavedeleteControl() {
    if (this.validmaxid) {
      this.disableButton = false;
    } else {
      this.disableButton = true;
    }
  }
  clearpatientData() {
    this.name = "";
    this.age = "";
    this.ssn = "";
    this.gender = "";
    this.nationality = "";
    this.dob = "";
    this.dateofbirth = "";
    this.categoryIcons = [];
  }
  clearData() {
    this.clearpatientData();
    this.disableButton = true;
    this.disableClear = true;
    this.expiredpatientForm.reset();
    this.expiredpatientForm.controls["maxid"].setValue(
      this.cookie.get("LocationIACode") + "."
    );
    this.expiredpatientForm.controls["mobileno"].setValue(null);
    this.expiredpatientForm.controls["expiryDate"].setValue(this.todayDate);
  }
  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
