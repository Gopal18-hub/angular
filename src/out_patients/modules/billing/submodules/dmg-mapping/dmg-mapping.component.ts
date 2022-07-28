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
  dob: string = "";
  nationality: string = "";
  ssn: string = "";
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
      breast: {
        type: "checkbox",
        options: [{ title: "Breast" }],
      },
      headandneck: {
        type: "checkbox",
        options: [{ title: "Head & Neck" }],
      },
      gastro: {
        type: "checkbox",
        options: [{ title: "Gastrointestinal" }],
      },
      neuro: {
        type: "checkbox",
        options: [{ title: "Neuro" }],
      },
      thoracic: {
        type: "checkbox",
        options: [{ title: "Thoracic" }],
      },
      urology: {
        type: "checkbox",
        options: [{ title: "Urology" }],
      },
      gynae: {
        type: "checkbox",
        options: [{ title: "Gynae" }],
      },
      muscluoskeletal: {
        type: "checkbox",
        options: [{ title: "Muscluoskeletal" }],
      },
      pediatric: {
        type: "checkbox",
        options: [{ title: "Pediatric" }],
      },
      hemathologyandbmt: {
        type: "checkbox",
        options: [{ title: "Hemathology and BMT" }],
      },
    },
  };

  dmgMappingForm!: FormGroup;
  questions: any;
  //disablebutton: boolean = true;
  disableClear: boolean = true;
  constructor(
    private formService: QuestionControlService,
    private messagedialogservice: MessageDialogService,
    private maticonregistry: MatIconRegistry,
    private domsanitizer: DomSanitizer,
    private cookie: CookieService,
    private zone: NgZone,
    private http: HttpService
  ) {}

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.dmgMappingformData.properties,
      {}
    );
    this.dmgMappingForm = formResult.form;
    this.questions = formResult.questions;
    //  this.maticonregistry.addSvgIcon('searchlens',
    //  this.domsanitizer.bypassSecurityTrustResourceUrl('E:\Clone_105300_newFramework\HIS-ANGULAR.reginabegum.mohamed.abdulla\src\out_patients\src\assets\lens.svg')
    //  );
  }

  ngAfterViewInit() {
    // this.zone.run(() => {
    //   this.questions[0].elementRef.addEventListener(
    //     "change",
    //     this.onMaxidEnter.bind(this)
    //   );
    // });
    this.questions[0].elementRef.addEventListener("keypress", (event: any) => {
      if (event.key === "Enter") {
        event.preventDefault();
        this.onMaxidEnter();
      }
    });
  }

  onMaxidEnter() {
    let iacode = this.dmgMappingForm.controls["maxid"].value.split(".")[0];
    let regno = this.dmgMappingForm.controls["maxid"].value.split(".")[1];
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
          this.dmgPatientDetails = data as PatientDetailsDmgInterface;
          console.log(this.dmgPatientDetails);
          this.ssn = this.dmgPatientDetails.dmgPatientDetailDT[0].ssn;
          this.name = this.dmgPatientDetails.dmgPatientDetailDT[0].patientName;
        } else {
          this.dmgMappingForm.controls["maxid"].setErrors({
            incorrect: true,
          });
          this.questions[0].customErrorMessage = "Invalid Maxid";
        }
      });
  }
  dmgsave() {
    // this.http
    //   .post(ApiConstants.savepatientdmg, this.getSaveDmgObject())
    //   .pipe(takeUntil(this._destroying$))
    //   .subscribe((value) => {
    //     console.log(value);
    //   });
    // this.messagedialogservice.success("DMG mapped to this patient");
  }

  // getSaveDmgObject(): SaveDmgpatientModel {
  //   return new SaveDmgpatientModel{

  //   }
  // }
}
