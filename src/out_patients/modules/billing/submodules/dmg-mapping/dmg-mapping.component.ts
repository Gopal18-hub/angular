import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { QuestionControlService } from "../../../../../shared/ui/dynamic-forms/service/question-control.service";
import { MessageDialogService } from "../../../../../shared/ui/message-dialog/message-dialog.service";
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { CookieService } from "@shared/services/cookie.service";
import { NgZone } from "@angular/core";

@Component({
  selector: "out-patients-dmg-mapping",
  templateUrl: "./dmg-mapping.component.html",
  styleUrls: ["./dmg-mapping.component.scss"],
})
export class DmgMappingComponent implements OnInit {
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
  disablebutton: boolean = true;
  disableClear: boolean = true;
  constructor(
    private formService: QuestionControlService,
    private messagedialogservice: MessageDialogService,
    private maticonregistry: MatIconRegistry,
    private domsanitizer: DomSanitizer,
    private cookie: CookieService,
    private zone: NgZone
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
    this.zone.run(() => {
      this.questions[0].elementRef.addEventListener(
        "change",
        this.onMaxidEnter.bind(this)
      );
    });
  }

  onMaxidEnter() {
    if (
      this.dmgMappingForm.value.maxid !== null ||
      this.dmgMappingForm.value.maxid
    ) {
      this.disablebutton = false;
    } else {
      this.disablebutton = true;
    }
  }
  dmgsave() {
    this.messagedialogservice.success("DMG mapped to this patient");
  }
}
