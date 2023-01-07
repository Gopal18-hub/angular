import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { QuestionControlService } from '@shared/ui/dynamic-forms/service/question-control.service';

@Component({
  selector: 'out-patients-dmg-othergrp-doc-popup',
  templateUrl: './dmg-othergrp-doc-popup.component.html',
  styleUrls: ['./dmg-othergrp-doc-popup.component.scss']
})
export class DmgOthergrpDocPopupComponent implements OnInit {

  dmgOtherFormData = {
    title: "",
    type: "object",
    properties: {
      description: {
        type: "textarea",
        readonly: true,
      },
    },
  };
  dmgotherform!: FormGroup;
  questions: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogref: MatDialogRef<DmgOthergrpDocPopupComponent>,
    private formService: QuestionControlService
  ) { }

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.dmgOtherFormData.properties,
      {}
    );
    this.dmgotherform = formResult.form;
    this.questions = formResult.questions;
    this.dmgotherform.controls['description'].setValue(this.data);
  }
  okbtn()
  {
    this.dialogref.close();
  }

}
