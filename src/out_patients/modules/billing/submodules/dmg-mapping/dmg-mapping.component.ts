import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { QuestionControlService } from "../../../../../shared/ui/dynamic-forms/service/question-control.service";
import { MessageDialogService } from "../../../../../shared/ui/message-dialog/message-dialog.service";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { CookieService } from "@shared/services/cookie.service";
import { NgZone } from "@angular/core";
import { ApiConstants } from "@core/constants/ApiConstants";
import { HttpService } from "@shared/services/http.service";
import { Subject, takeUntil } from "rxjs";
import { SaveDmgpatientModel } from "../../../../core/models/savedmgpatient.Model";
import { PatientDetailsDmgInterface } from "../../../../../out_patients/core/types/dmgMapping/patientDetailsDmg.Interface";
import { PatientService } from "@core/services/patient.service";
import { DatePipe } from "@angular/common";
import { MatDialog } from "@angular/material/dialog";
import { SimilarPatientDialog } from "@modules/registration/submodules/op-registration/op-registration.component";
import { DmgDialogComponent } from "./dmg-dialog/dmg-dialog.component";
import { SearchService } from "@shared/services/search.service";
import { Router, ActivatedRoute } from "@angular/router";
import { LookupService } from "../../../../../out_patients/core/services/lookup.service";
import { PatientDetails } from "@core/models/patientDetailsModel.Model";
@Component({
  selector: "out-patients-dmg-mapping",
  templateUrl: "./dmg-mapping.component.html",
  styleUrls: ["./dmg-mapping.component.scss"],
})
export class DmgMappingComponent implements OnInit {
  private readonly _destroying$ = new Subject<void>();
  name: string = "";
  age: string = "";
  gender: string = "";
  dob: any;
  nationality: string = "";
  ssn: string = "";
  showCheckboxgrid: boolean = false;
  previouselected!: number;
  categoryIcons: [] = [];
  lastUpdatedBy: string = this.cookie.get("UserName");
  currentTime: string = new Date().toLocaleString();
  userId: any;
  hsplocationId: any;
  apiprocessing: boolean = false;

  dmgPatientDetails!: PatientDetailsDmgInterface;
  dmgMappingformData = {
    title: "",
    type: "object",
    properties: {
      maxid: {
        type: "string",
        defaultValue: this.cookie.get("LocationIACode") + ".",
      },
      mobileno: {
        type: "tel",
        title: "Mobile Number",
        pattern: "^[1-9]{1}[0-9]{9}",
      },
    },
  };

  dmgMappingForm!: FormGroup;
  questions: any;
  disablebutton: boolean = true;
  disableClear: boolean = true;
  constructor(
    private formService: QuestionControlService,
    private messagedialogservice: MessageDialogService,
    private maticonregistry: MatIconRegistry,
    private domsanitizer: DomSanitizer,
    private cookie: CookieService,
    private zone: NgZone,
    private http: HttpService,
    private patientService: PatientService,
    private datepipe: DatePipe,
    private dialog: MatDialog,
    private searchService: SearchService,
    private router: Router,
    private route: ActivatedRoute,
    private lookupservice: LookupService
  ) {}

  ngOnInit(): void {
    //this.lastUpdatedBy = this.cookie.get("UserName");
    // this.userId = Number(this.cookie.get("UserId"));
    this.userId = Number(this.cookie.get("UserId"));
    this.hsplocationId = Number(this.cookie.get("HSPLocationId"));
    let formResult: any = this.formService.createForm(
      this.dmgMappingformData.properties,
      {}
    );
    this.dmgMappingForm = formResult.form;
    this.questions = formResult.questions;
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
            this.dmgMappingForm.controls["maxid"].setValue(
              lookupdata[0]["maxid"]
            );

            // this.dmgMappingForm.value.maxid = lookupdata[0]["maxid"];

            this.onMaxidEnter(this.dmgMappingForm.controls["maxid"].value);
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
                this.dmgMappingForm.controls["maxid"].setValue(maxID);
                this.onMaxidEnter(this.dmgMappingForm.controls["maxid"].value);
              }

              //this.similarContactPatientList = [];
            });
        }
      });
  }

  ngAfterViewInit() {
    this.questions[0].elementRef.addEventListener("keypress", (event: any) => {
      if (event.key === "Enter") {
        event.preventDefault();
        this.onMaxidEnter(this.dmgMappingForm.controls["maxid"].value);
      }
    });
    this.questions[1].elementRef.addEventListener("keypress", (event: any) => {
      if (event.key === "Enter") {
        event.preventDefault();
        this.onMobilenumberEnter();
      }
    });
  }
  isdmgselected!: number;
  docId!: number;
  checkboxList: any = [];
  diseasegroupnamelist: any = [];
  isDmgmapped: boolean = false;
  onMaxidEnter(maxid: any) {
    // let iacode = this.dmgMappingForm.controls["maxid"].value.split(".")[0];
    //let regno = this.dmgMappingForm.controls["maxid"].value.split(".")[1];
    let iacode = maxid.split(".")[0];
    let regno = maxid.split(".")[1];
    this.apiprocessing = true;
    this.http
      .get(ApiConstants.getpatientdetailsdmg(regno, iacode, this.hsplocationId))
      .pipe(takeUntil(this._destroying$))
      .subscribe(
        (data) => {
          console.log(data);
          if (data != null) {
            if (data.dmgPatientDetailDT.length != 0) {
              this.showCheckboxgrid = true;
              this.disableClear = false;
              this.disablebutton = false;
              this.apiprocessing = false;
              this.clearPatientdata();
              this.dmgPatientDetails = data as PatientDetailsDmgInterface;
              console.log(this.dmgPatientDetails);
              this.dmgPatientDetails.dmgMappingDataDT.forEach((item, index) => {
                if (item.isChecked == 1) {
                  this.isdmgselected = index;
                  this.isDmgmapped = true;
                  this.docId =
                    this.dmgPatientDetails.dmgMappingDataDT[index].docId;
                  //this.disablebutton = false;
                  console.log(this.docId);
                } else {
                  this.isdmgselected = -1;
                }
                //  this.dmgPatientDetails.dmgMappingDataDT.forEach((item, index) => {
                this.dmgPatientDetails.dmgMappingDataDT[index].docName =
                  item.docName.split(".")[1];
                //});
                console.log(
                  this.dmgPatientDetails.dmgMappingDataDT[index].docName
                );
              });
              if (this.dmgPatientDetails.dmgPatientDetailDT.length != 0) {
                this.ssn = this.dmgPatientDetails.dmgPatientDetailDT[0].ssn;
                this.name =
                  this.dmgPatientDetails.dmgPatientDetailDT[0].patientName;
                this.age = this.dmgPatientDetails.dmgPatientDetailDT[0].age;
                this.gender =
                  this.dmgPatientDetails.dmgPatientDetailDT[0].gender;
                this.nationality =
                  this.dmgPatientDetails.dmgPatientDetailDT[0].nationality;
                this.dob = this.datepipe.transform(
                  this.dmgPatientDetails.dmgPatientDetailDT[0].dob,
                  "dd/MM/yyyy"
                );
                this.dmgMappingForm.controls["maxid"].setValue(
                  this.dmgPatientDetails.dmgPatientDetailDT[0].maxId
                );
                this.dmgMappingForm.controls["mobileno"].setValue(
                  this.dmgPatientDetails.dmgPatientDetailDT[0].mobileNo
                );
                // this.categoryIcons = this.patientService.getCategoryIcons(
                //   this.dmgPatientDetails.dmgPatientDetailDT[0]
                // );
                this.getPatientIcon();
                console.log(this.categoryIcons);
              }

              // Assign checkbox grid here
            } else {
              this.apiprocessing = false;
              this.setErroronMaxid();
            }
          } else {
            this.apiprocessing = false;
            this.setErroronMaxid();
          }
        },
        (error) => {
          this.apiprocessing = false;
          this.setErroronMaxid();
        }
      );
    // this.questions[0].elementRef.focus();
  }
  patientDetailsforicon!: PatientDetails;
  getPatientIcon() {
    let iacode = this.dmgMappingForm.value.maxid.split(".")[0];
    let regNumber = this.dmgMappingForm.value.maxid.split(".")[1];
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
  setErroronMaxid() {
    this.clearPatientdata();
    this.showCheckboxgrid = false;
    this.questions[1].elementRef.focus();
    this.dmgMappingForm.controls["maxid"].setErrors({
      incorrect: true,
    });
    this.questions[0].customErrorMessage = "Invalid Maxid";
    this.dmgMappingForm.controls["mobileno"].setValue(null);
    this.questions[0].elementRef.focus();
  }

  onMobilenumberEnter() {
    this.http
      .post(ApiConstants.similarSoundPatientDetail, {
        phone: this.dmgMappingForm.controls["mobileno"].value,
      })
      .pipe(takeUntil(this._destroying$))
      .subscribe((resultdata) => {
        console.log(resultdata);
        if (resultdata != null || resultdata.length != 0) {
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
              this.onMaxidEnter(resultdata.data.added[0].maxid);
            });
          } else if (resultdata.length == 1) {
            this.apiprocessing = false;
            this.onMaxidEnter(resultdata[0].maxid);
          } else {
            this.apiprocessing = false;
          }
        } else {
          this.apiprocessing = false;
        }
      });
  }
  iacode!: string;
  regno!: number;

  dmgsave() {
    // this.dmgPatientDetails.dmgMappingDataDT.forEach((item) => {
    //   if (item.isChecked != 1) {
    //     console.log("item is not checked.");
    //     this.isDmgmapped = false;
    //   } else {
    //     this.isDmgmapped = true;
    //     console.log("item is checked.");
    //   }
    // });
    // if (this.isDmgmapped == false) {
    //   this.dialog.open(DmgDialogComponent, { width: "25vw", height: "30vh" });
    // } else {
    if (this.isDmgmapped) {
      this.apiprocessing = true;
      this.http
        .post(ApiConstants.savepatientdmg, this.getSaveDmgObject())
        .pipe(takeUntil(this._destroying$))
        .subscribe(
          (value) => {
            console.log(value);
          },
          (httperrorResponse) => {
            if (httperrorResponse.error.text == "Saved Successfully") {
              this.messagedialogservice.success("DMG mapped to this patient");
              this.apiprocessing = false;
              //this.showCheckboxgrid = false;
              this.categoryIcons = [];
              this.onMaxidEnter(this.dmgMappingForm.controls["maxid"].value);
            } else {
              this.apiprocessing = false;
            }
          }
        );
      this.isDmgmapped = false;
    } else {
      this.dialog.open(DmgDialogComponent, { width: "25vw", height: "30vh" });
    }

    //}
  }

  getSaveDmgObject(): SaveDmgpatientModel {
    this.iacode = this.dmgMappingForm.controls["maxid"].value.split(".")[0];
    this.regno = this.dmgMappingForm.controls["maxid"].value.split(".")[1];
    return new SaveDmgpatientModel(
      0,
      0,
      this.docId,
      "",
      this.regno,
      this.iacode,
      this.userId,
      this.hsplocationId,
      ""
    );
  }
  // 0,0,this.docId,"",this.regno,this.iacode,9923,7,""
  onChange(group: any, index: number, value: number, event: any) {
    console.log(event);
    console.log(this.previouselected);
    console.log(value);
    console.log(index);
    if (event.checked == false) {
      this.isDmgmapped = false;
    } else {
      this.isDmgmapped = true;
    }
    if (this.isdmgselected != -1) {
      if (this.isdmgselected != index) {
        //  this.isDmgmapped = true;
        this.dmgPatientDetails.dmgMappingDataDT[index].isChecked = 1;
        this.docId = value;
        console.log(this.dmgPatientDetails.dmgMappingDataDT[index].isChecked);
        this.dmgPatientDetails.dmgMappingDataDT[
          this.isdmgselected
        ].isChecked = 0;
      } else {
        // this.isDmgmapped = true;
        this.dmgPatientDetails.dmgMappingDataDT[index].isChecked = 1;
      }
    } else {
      this.dmgPatientDetails.dmgMappingDataDT.forEach((item, i) => {
        this.dmgPatientDetails.dmgMappingDataDT[i].isChecked = 0;
      });
      this.dmgPatientDetails.dmgMappingDataDT[index].isChecked = 1;
      this.docId = value;
      // this.isDmgmapped = true;
    }
    console.log(this.docId);
  }

  clearPatientdata() {
    this.ssn = "";
    this.name = "";
    this.age = "";
    this.gender = "";
    this.nationality = "";
    this.dob = "";
    this.categoryIcons = [];
  }
  clearData() {
    //this.dmgMappingForm.reset();
    this.clearPatientdata();
    this.disablebutton = true;
    this.disableClear = true;
    this.showCheckboxgrid = false;
    this.isDmgmapped = false;
    this.dmgMappingForm.controls["maxid"].setValue(
      this.cookie.get("LocationIACode") + "."
    );
    this.dmgMappingForm.controls["mobileno"].setValue(null);
  }
  ngOnDestroy() {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
