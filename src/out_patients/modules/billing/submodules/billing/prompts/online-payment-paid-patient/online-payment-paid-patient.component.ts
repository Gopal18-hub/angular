import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CookieService } from '@shared/services/cookie.service';
import { HttpService } from '@shared/services/http.service';
import { QuestionControlService } from '@shared/ui/dynamic-forms/service/question-control.service';
import { BillingApiConstants } from '../../BillingApiConstant';
import { BillingService } from '../../billing.service';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'out-patients-online-payment-paid-patient',
  templateUrl: './online-payment-paid-patient.component.html',
  styleUrls: ['./online-payment-paid-patient.component.scss']
})
export class OnlinePaymentPaidPatientComponent implements OnInit {

  onlineSearchFormData = {
    title: "",
    type: "object",
    properties: {
      name: {
        type: "string",
      },
      bookingno: {
        type: "string",
      },
      mobile: {
        type: "number",
      },
      checkbox: {
        type: "checkbox",
        options: [
          {
            title: "",
            value: false
          },
        ],
        defaultValue: true
      },
      fromdate: {
        type: "date",
        defaultValue: new Date(),
        disabled: false,
      },
      todate: {
        type: "date",
        defaultValue: new Date(),
        disabled: false,
      }
    },
  };
  config: any = {
    selectBox: false,
    clickedRows: true,
    clickSelection: "single",
    displayedColumns: [
      "maxId",
      "patinetName",
      "doctorName",
      "specializationName",
      "appointmentDate",
      "mobile",
      "age",
      "sex",
      "place",
      "ssn",
      "bookingNo",
      "bookingAmount",
      "transactionNo",
      "paymentStatus",
    ],
    columnsInfo: {
      maxId: {
        title: "Max ID",
        type: "string",
        style: {
          width: "8rem",
        },
      },
      patinetName: {
        title: "Patient Name",
        type: "string",
        style: {
          width: "10rem",
        },
      },
      doctorName: {
        title: "Doctor Name",
        type: "string",
        style: {
          width: "10rem",
        },
      },
      specializationName: {
        title: "Specialization Name",
        type: "string",
        style: {
          width: "13rem",
        },
      },
      appointmentDate: {
        title: "Appointment Date",
        type: "string",
        style: {
          width: "13rem",
        },
      },
      mobile: {
        title: "Mobile",
        type: "string",
        style: {
          width: "7rem",
        },
        tooltipColumn: "mobile",
      },
      age: {
        title: "Age",
        type: "string",
        style: {
          width: "5rem",
        },
      },
      sex: {
        title: "Sex",
        type: "string",
        style: {
          width: "5rem",
        },
      },
      place: {
        title: "Place",
        type: "string",
        style: {
          width: "7rem",
        },
      },
      ssn: {
        title: "SSN",
        type: "string",
        style: {
          width: "5rem",
        },
      },
      bookingNo: {
        title: "Booking ID",
        type: "string",
        style: {
          width: "10rem",
        },
      },
      bookingAmount: {
        title: "Booking Amount",
        type: "string",
        style: {
          width: "13rem",
        },
      },
      transactionNo: {
        title: "Transaction No",
        type: "string",
        style: {
          width: "13rem",
        },
      },
      paymentStatus: {
        title: "Payment Status",
        type: "string",
        style: {
          width: "10rem",
        },
      },
    },
  };
  onlinesearchform!: FormGroup;
  questions: any;
  data: any = [];
  apiProcessing: boolean = false;
  @ViewChild('table') tableRows: any;
  constructor(
    private cookie: CookieService,
    private http: HttpService,
    private formService: QuestionControlService,
    private datepipe: DatePipe,
    private BillingService: BillingService,
    private dialogRef: MatDialogRef<OnlinePaymentPaidPatientComponent>
  ) { }

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.onlineSearchFormData.properties,
      {}
    );
    this.onlinesearchform = formResult.form;
    this.questions = formResult.questions;
    this.questions[4].maximum = this.onlinesearchform.controls['todate'].value;
    this.questions[5].minimum = this.onlinesearchform.controls['fromdate'].value;
    this.search();
  }

  ngAfterViewInit(): void {
    this.onlinesearchform.controls['checkbox'].valueChanges.subscribe(value=>{
      if(value == true)
      {
        this.onlinesearchform.controls['fromdate'].enable();
        this.onlinesearchform.controls['todate'].enable();
        this.data = [];
        this.search();
      }
      else
      {
        this.onlinesearchform.controls['fromdate'].disable();
        this.onlinesearchform.controls['todate'].disable();
        this.data = [];
      }
    })
    this.tableRows.selection.changed.subscribe((res: any) => {
      this.dialogRef.close({ data: res });
    });
  }
  search()
  {
    this.data = [];
    this.apiProcessing = true;
    this.http.get(
      BillingApiConstants.getbillingappointmentsearch(
        this.onlinesearchform.value.mobile || '',
        this.onlinesearchform.value.name || "",
        this.onlinesearchform.value.lastname || "",
        this.onlinesearchform.value.checkbox == true ? true : false,
        this.datepipe.transform(
          this.onlinesearchform.value.fromdate,
          "yyyy-MM-dd"
        ) || "",
        this.datepipe.transform(
          this.onlinesearchform.value.todate,
          "yyyy-MM-dd"
        ) || "",
        this.onlinesearchform.value.bookingno
          ? this.onlinesearchform.value.bookingno
          : "",
        this.cookie.get("HSPLocationId")
      )
    )
    .subscribe((res) => {
      this.apiProcessing = false;
      console.log(res);
      console.log(this.BillingService.activeMaxId)
      this.data = res.filter((i: any) => {
        return i.maxId == this.BillingService.activeMaxId.maxId && i.paymentStatus == 'Y'
      });
    },
    (error) => {
      this.apiProcessing = false;
    })
  }

  clear()
  {
    this.onlinesearchform.reset();
    this.onlinesearchform.controls['fromdate'].setValue(new Date());
    this.onlinesearchform.controls['todate'].setValue(new Date());
    this.data = [];
  }

}
