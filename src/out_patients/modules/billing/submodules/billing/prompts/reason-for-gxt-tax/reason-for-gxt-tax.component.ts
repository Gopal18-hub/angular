import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { QuestionControlService } from '@shared/ui/dynamic-forms/service/question-control.service';

@Component({
  selector: 'out-patients-reason-for-gxt-tax',
  templateUrl: './reason-for-gxt-tax.component.html',
  styleUrls: ['./reason-for-gxt-tax.component.scss']
})
export class ReasonForGxtTaxComponent implements OnInit {

  reasonForGxtTaxData = {
    title: "",
    type: "object",
    properties: {
      reason: {
        type: "textarea",
        required: true,
      }
    },
  };
  reasonForGxtTaxForm!: FormGroup;
  question: any;
  constructor(
    private formService: QuestionControlService,
    public dialogref: MatDialogRef<ReasonForGxtTaxComponent>
  ) { 
    let formResult: any = this.formService.createForm(
      this.reasonForGxtTaxData.properties,
      {}
    );
    this.reasonForGxtTaxForm = formResult.form;
    this.question = formResult.questions;
  }

  ngOnInit(): void {
  }

  okbtn()
  {
    this.dialogref.close(this.reasonForGxtTaxForm.value.reason);
  }

  cancelbtn()
  {
    this.dialogref.close('cancel');
  }
}
