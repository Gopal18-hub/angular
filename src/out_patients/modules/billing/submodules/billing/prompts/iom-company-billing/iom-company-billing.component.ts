import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QuestionControlService } from '@shared/ui/dynamic-forms/service/question-control.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";

@Component({
  selector: 'out-patients-iom-company-billing',
  templateUrl: './iom-company-billing.component.html',
  styleUrls: ['./iom-company-billing.component.scss']
})
export class IomCompanyBillingComponent implements OnInit {

    
  iomcompanybillingFormData = {
    title: "",
    type: "object",
    properties: {     
      mainradio: {
        type: "radio",
        required: false,
        options: [
          { title: "Individual", value: "individual" },
          { title: "Corporate", value: "corporate" },
        ],
        defaultValue: "individual",
      }
    },
  }
  iomcompanybillingform!: FormGroup;
  questions: any;

  constructor(private formService: QuestionControlService,
    private dialogRef: MatDialogRef<IomCompanyBillingComponent>,) { }

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.iomcompanybillingFormData.properties,
      {}
    );
    this.iomcompanybillingform = formResult.form;
    this.questions = formResult.questions;
  }

  iomok(){
    this.dialogRef.close({
      data: this.iomcompanybillingform.controls["mainradio"].value     
    });
  }
 iomclose(){
  this.dialogRef.close();
}
}
