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
        type: "number",
        title: "Mobile Number",
        pattern: "^[1-9]{1}[0-9]{9}",
      },
      // breast: {
      //   type: "checkbox",
      //   options: [{ title: "Breast" }],
      // },
      // headandneck: {
      //   type: "checkbox",
      //   options: [{ title: "Head & Neck" }],
      // },
      // gastro: {
      //   type: "checkbox",
      //   options: [{ title: "Gastrointestinal" }],
      // },
      // neuro: {
      //   type: "checkbox",
      //   options: [{ title: "Neuro" }],
      // },
      // thoracic: {
      //   type: "checkbox",
      //   options: [{ title: "Thoracic" }],
      // },
      // urology: {
      //   type: "checkbox",
      //   options: [{ title: "Urology" }],
      // },
      // gynae: {
      //   type: "checkbox",
      //   options: [{ title: "Gynae" }],
      // },
      // muscluoskeletal: {
      //   type: "checkbox",
      //   options: [{ title: "Muscluoskeletal" }],
      // },
      // pediatric: {
      //   type: "checkbox",
      //   options: [{ title: "Pediatric" }],
      // },
      // hemathologyandbmt: {
      //   type: "checkbox",
      //   options: [{ title: "Hemathology and BMT" }],
      // },
      // docName: {
      //   type: "checkbox",
      //   options: {
      //     title: "",
      //     value: "",
      //   },
      // },
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
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.dmgMappingformData.properties,
      {}
    );
    this.dmgMappingForm = formResult.form;
    this.questions = formResult.questions;
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
  onMaxidEnter(maxid: any) {
    // let iacode = this.dmgMappingForm.controls["maxid"].value.split(".")[0];
    //let regno = this.dmgMappingForm.controls["maxid"].value.split(".")[1];
    let iacode = maxid.split(".")[0];
    let regno = maxid.split(".")[1];
    // if (
    //   this.dmgMappingForm.value.maxid !== null ||
    //   this.dmgMappingForm.value.maxid
    // ) {
    //   this.disablebutton = false;
    // } else {
    //   this.disablebutton = true;
    // }
    this.http
      .get(ApiConstants.getpatientdetailsdmg(regno, iacode))
      .pipe(takeUntil(this._destroying$))
      .subscribe((data) => {
        console.log(data);
        if (data != null) {
          this.showCheckboxgrid = true;
          this.disablebutton = false;
          this.disableClear = false;
          this.clearPatientdata();
          this.dmgPatientDetails = data as PatientDetailsDmgInterface;
          console.log(this.dmgPatientDetails);
          this.dmgPatientDetails.dmgMappingDataDT.forEach((item, index) => {
            if (item.isChecked == 1) {
              this.isdmgselected = index;
              this.docId = this.dmgPatientDetails.dmgMappingDataDT[index].docId;
              console.log(this.docId);
            } else {
              this.isdmgselected = -1;
            }
            //  this.dmgPatientDetails.dmgMappingDataDT.forEach((item, index) => {
            this.dmgPatientDetails.dmgMappingDataDT[index].docName =
              item.docName.split(".")[1];
            //});
            console.log(this.dmgPatientDetails.dmgMappingDataDT[index].docName);
          });
          if (this.dmgPatientDetails.dmgPatientDetailDT.length != 0) {
            this.ssn = this.dmgPatientDetails.dmgPatientDetailDT[0].ssn;
            this.name =
              this.dmgPatientDetails.dmgPatientDetailDT[0].patientName;
            this.age = this.dmgPatientDetails.dmgPatientDetailDT[0].age;
            this.gender = this.dmgPatientDetails.dmgPatientDetailDT[0].gender;
            this.nationality =
              this.dmgPatientDetails.dmgPatientDetailDT[0].nationality;
            this.dob = this.datepipe.transform(
              this.dmgPatientDetails.dmgPatientDetailDT[0].dob,
              "dd/MM/yyyy"
            );
            this.dmgMappingForm.controls["maxid"].setValue(
              this.dmgPatientDetails.dmgPatientDetailDT[0].maxId
            );
            // this.dmgMappingForm.controls["mobileno"].setValue(
            //   this.dmgPatientDetails.dmgPatientDetailDT[0].maxId
            // );
            this.categoryIcons = this.patientService.getCategoryIcons(
              this.dmgPatientDetails.dmgPatientDetailDT[0]
            );
            console.log(this.categoryIcons);
          }

          // Assign checkbox grid here
        } else {
          this.disablebutton = true;
          this.disableClear = true;
          this.dmgMappingForm.controls["maxid"].setErrors({
            incorrect: true,
          });
          this.questions[0].customErrorMessage = "Invalid Maxid";
        }
      });
  }

  onMobilenumberEnter() {
    this.http
      .get(
        ApiConstants.getSimilarPatientonMobilenumber(
          this.dmgMappingForm.controls["mobileno"].value
        )
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe((resultdata) => {
        console.log(resultdata);
        if (resultdata != null) {
          const similarpatientDialog = this.dialog.open(SimilarPatientDialog, {
            width: "60vw",
            height: "80vh",
            data: {
              searchResults: resultdata,
            },
          });
          similarpatientDialog.afterClosed().subscribe((resultdata) => {
            console.log(resultdata);
            this.onMaxidEnter(resultdata.data.added[0].maxid);
          });
        }
      });
  }
  iacode!: string;
  regno!: number;
  dmgsave() {
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
            this.showCheckboxgrid = false;
            this.disablebutton = true;
            this.categoryIcons = [];
          }
        }
      );
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
      9923,
      7,
      ""
    );
  }
  // 0,0,this.docId,"",this.regno,this.iacode,9923,7,""
  onChange(group: any, index: number, value: number) {
    console.log(this.previouselected);
    console.log(value);
    if (this.isdmgselected != -1) {
      if (this.isdmgselected != index) {
        this.dmgPatientDetails.dmgMappingDataDT[index].isChecked = 1;
        this.docId = value;
        console.log(this.dmgPatientDetails.dmgMappingDataDT[index].isChecked);
        this.dmgPatientDetails.dmgMappingDataDT[
          this.isdmgselected
        ].isChecked = 0;
      } else {
        this.dmgPatientDetails.dmgMappingDataDT[index].isChecked = 1;
      }
    } else {
      this.dmgPatientDetails.dmgMappingDataDT.forEach((item, i) => {
        this.dmgPatientDetails.dmgMappingDataDT[i].isChecked = 0;
      });
      this.dmgPatientDetails.dmgMappingDataDT[index].isChecked = 1;
      this.docId = value;
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
    this.clearPatientdata();
    this.disablebutton = true;
    this.disableClear = true;
    this.showCheckboxgrid = false;
    this.dmgMappingForm.controls["maxid"].setValue(
      this.cookie.get("LocationIACode") + "."
    );
  }
}
