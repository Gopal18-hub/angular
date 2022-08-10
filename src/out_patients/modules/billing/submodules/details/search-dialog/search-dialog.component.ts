import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CookieService } from '@shared/services/cookie.service';
import { QuestionControlService } from '@shared/ui/dynamic-forms/service/question-control.service';
@Component({
  selector: 'out-patients-search-dialog',
  templateUrl: './search-dialog.component.html',
  styleUrls: ['./search-dialog.component.scss']
})
export class SearchDialogComponent implements OnInit {
  searchFormData = {
    title: "",
    type: "object",
    properties: {
      billno: {
        type: "string",
      },
      maxid: {
        type: "string",
        defaultValue: this.cookie.get("LocationIACode") + ".",
      },
      mobile: {
        type: "number",
        pattern: "^[1-9]{1}[0-9]{9}",
      },
      checkbox: {
        type: "checkbox",
        options: [
          {
            title: "",
          },
        ],
      },
      fromdate: {
        type: "date",
        maximum: new Date(),
      },
      todate: {
        type: "date",
        maximum: new Date(),
      }
    },
  };
  config: any = {
    clickedRows: false,
    // clickSelection: "single",
    actionItems: false,
    dateformat: "dd/MM/yyyy",
    selectBox: false,
    displayedColumns: [
      "sno",
      "billno",
      "maxid",
      "datetime",
      "patientname",
      "mobileno",
      "age",
      "gender",
      "billamt",
      "balance",
      "ssn"
    ],
    columnsInfo: {
      sno: {
        title: "S.No",
        type: "string",
        style: {
          width: "4rem"
        }
      },
      billno: {
        title: "Bill No",
        type: "string",
        style: {
          width: "5rem"
        }
      },
      maxid: {
        title: "Max ID",
        type: "string",
        style: {
          width: "4rem"
        }
      },
      datetime: {
        title: "Date and Time",
        type: "number",
        style: {
          width: "6rem"
        }
      },
      patientname: {
        title: "Patient Name",
        type: "date",
        style: {
          width: "6rem"
        }
      },
      mobileno: {
        title: "Mobile No",
        type: "number",
        style: {
          width: "6rem"
        }
      },
      age: {
        title: "Age",
        type: "number",
        style: {
          width: "3rem"
        }
      },
      gender: {
        title: "Gender",
        type: "number",
        style: {
          width: "5rem"
        }
      },
      billamt: {
        title: "Bill Amt.",
        type: "number",
        style: {
          width: "5rem"
        }
      },
      balance: {
        title: "Balance",
        type: "number",
        style: {
          width: "5rem"
        }
      },
      ssn: {
        title: "SSN",
        type: "string",
        style: {
          width: "4rem"
        }
      },
    },
  };
  data:any = [];
  searchform!: FormGroup;
  questions: any;
  constructor(
    private cookie: CookieService,
    private formService: QuestionControlService
  ) { }

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.searchFormData.properties,
      {}
    );
    this.searchform = formResult.form;
    this.questions = formResult.questions;
  }

}
