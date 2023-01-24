import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ComponentService } from "../components/component.service";
import { Router } from "@angular/router";
import { FormGroup } from "@angular/forms";
import { QuestionControlService } from "@shared/v2/ui/dynamic-forms/service/question-control.service";
@Component({
  selector: "component-description",
  templateUrl: "./component-description.component.html",
  styleUrls: ["./component-description.component.scss"],
})
export class ComponentdescriptionComponent implements OnInit {
  links = ["Overview", "Html", "ts"];
  activeLink = this.links[0];
  public showoverview: boolean = true;
  public showhtml: boolean = false;
  public showts: boolean = false;
  public importstr: string = "";
  public htmlTag: string = "";
  public config: string = "";
  public compdesc: string = "";
  public tsdesc: string = "";
  public componentInput: boolean = false;
  itemform: any;
  itemFormData = billiItemForm;
  itemformGroup!: FormGroup;
  constructor(
    public componentService: ComponentService,
    private router: Router,
    private formService: QuestionControlService
  ) {}

  ngOnInit(): void {
    this.showoverview = true;
    this.showhtml = false;
    this.showts = false;
    let itemformResult: any = this.formService.createForm(
      this.itemFormData.properties,
      {}
    );
    this.itemformGroup = itemformResult.form;
    this.itemform = itemformResult.questions;

    this.componentService.component.subscribe((res: any) => {
      let componentObj = res.link;
      if (componentObj.label == "Input") {
        this.componentInput = true;
        this.compdesc =
          "Text fields allow users to enter text into a UI. They typically appear in forms and dialogs.";
        this.importstr =
          'import { DynamicFormsModule } from "@shared/v2/ui/dynamic-forms";';
        this.htmlTag =
          '<maxhealth-question class="w-full" [question]="itemform[11]" [form]="itemformGroup" [questions]="itemform[11]" [index]="1"></maxhealth-question>';
        this.config =
          'export const billiItemForm: any = { properties: { firstName: { type: "pattern_string", title: "Full Name", required: true, pattern: "^[a-zA-Z0-9 ]*$", capitalizeText: true, },';
        this.tsdesc =
          "Question Component reference for Angular Material input.";
      } else {
        this.componentInput = false;
        this.compdesc = "";
        this.importstr = "";
        this.htmlTag = "";
        this.config = "";
        this.tsdesc = "";
      }
    });
  }

  showTab(event: any) {
    this.activeLink = event; //link
    this.showoverview = false;
    this.showhtml = false;
    this.showts = false;
    if (event == "Overview") {
      this.showoverview = true;
    } else if (event == "Html") {
      this.showhtml = true;
    } else if (event == "ts") {
      this.showts = true;
    }
  }
}

export const billiItemForm: any = {
  title: "",
  type: "object",
  properties: {
    searchitem: {
      title: "Dropdown ",
      type: "dropdown",
      placeholder: "--Select--",
      required: true,
    },
    apidropdown: {
      title: "Auto Complete ",
      type: "autocomplete",
      placeholder: "--Select--",
      required: false,
    },
    datepicke: {
      title: "Date Picker ",
      type: "date",
      required: false,
    },
    datetimepicke: {
      title: "Date Time Picker ",
      type: "datetime",
      required: false,
    },
    numberi: {
      title: "Number Field",
      type: "number",
      required: false,
      disabled: false,
    },
    checkboxfi: {
      title: "Checkbox Field",
      type: "checkbox",
      required: false,
      options: [{ title: "checkbox option" }],
      disabled: false,
    },
    currencyf: {
      title: "Currency Field",
      type: "currency",
      required: false,
      defaultValue: "0.00",
    },
    radiof: {
      type: "radio",
      required: true,
      title: "Is Validation",
      defaultValue: "yes",
      options: [
        { title: "Yes", value: "yes" },
        { title: "No", value: "no" },
      ],
    },
    emailf: {
      title: "Email Field",
      type: "email",
      required: true,
    },
    colorpickerf: {
      title: "Color Picker Field",
      type: "colorpicker",
      required: false,
    },
    textareaf: {
      title: "Text area Field",
      type: "textarea",
      required: false,
    },
    firstName: {
      type: "pattern_string",
      title: "Full Name",
      required: true,
      pattern: "^[a-zA-Z0-9 ]*$",
      capitalizeText: true,
    },
    lastName: {
      type: "pattern_string",
      title: "Full Name",
      required: false,
      pattern: "^[a-zA-Z0-9 ]*$",
      capitalizeText: true,
      defaultValue: "test",
    },
    middleName: {
      type: "pattern_string",
      title: "Full Name",
      defaultValue: "test",
      disabled: true,
      readonly: true,
    },
    passwordfield: {
      title: "Password Field",
      type: "password",
      required: false,
    },
    remarks: {
      title: "Button Textarea Field",
      type: "buttonTextarea",
    },
    rangefield: {
      title: "Range Field",
      type: "range",
      required: false,
    },
  },
};
