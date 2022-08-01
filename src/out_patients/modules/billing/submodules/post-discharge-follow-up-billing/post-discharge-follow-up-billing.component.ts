import { Component, OnInit } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { CookieService } from "@shared/services/cookie.service";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
@Component({
  selector: 'out-patients-post-discharge-follow-up-billing',
  templateUrl: './post-discharge-follow-up-billing.component.html',
  styleUrls: ['./post-discharge-follow-up-billing.component.scss']
})
export class PostDischargeFollowUpBillingComponent implements OnInit {
  links = [
    {
      title: "Services",
      path: "services",
    },
    {
      title: "Bill",
      path: "bill",
    },
    // {
    //   title: "Credit Details",
    //   path: "credit-details",
    // },
  ];
  activeLink = this.links[0];

  formData = {
    title: "",
    type: "object",
    properties: {
      maxid: {
        type: "string",
        defaultValue: this.cookie.get("LocationIACode") + ".",
      },
      mobile: {
        type: "number",
        readonly: false,
      },
      bookingId: {
        type: "string",
      },
      company: {
        type: "dropdown",
        options: [],
      },
      corporate: {
        type: "dropdown",
        options: [],
      },
      narration: {
        type: "string",
      },
      b2bInvoice: {
        type: "checkbox",
        options: [{ title: "B2B Invoice" }],
      },
    },
  };
  formGroup!: FormGroup;
  questions: any;

  categoryIcons: any;

  patient: boolean = true;
  constructor(
    private cookie: CookieService,
    private formService: QuestionControlService
  ) { }

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.formData.properties,
      {}
    );
    this.formGroup = formResult.form;
    this.questions = formResult.questions;
  }
  doCategoryIconAction(icon: any) {}
}
