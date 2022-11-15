import { Component, OnInit, ViewChild } from "@angular/core";
import { environment } from "@environments/environment";
import { HttpService } from "../../../../../../shared/services/http.service";
import { FormControl, FormGroup } from "@angular/forms";
import { AppointmentSearchModel } from "../../../../../../out_patients/core/models/appointmentSearchModel.Model";
import { DatePipe } from "@angular/common";
import { QuestionControlService } from "../../../../../../shared/ui/dynamic-forms/service/question-control.service";
import { MatDialogRef } from "@angular/material/dialog";
import { ApiConstants } from "../../../../../../out_patients/core/constants/ApiConstants";

@Component({
  selector: "out-patients-appointment-search-dialog",
  templateUrl: "./appointment-search-dialog.component.html",
  styleUrls: ["./appointment-search-dialog.component.scss"],
})
export class AppointmentSearchDialogComponent implements OnInit {
  @ViewChild("patientDetail") tableRows: any;
  today = new Date();
  todayDate = this.datepipe.transform(Date.now(), "yyyy-MM-dd");
  tomorrow = this.datepipe.transform(Date.now(), "yyyy-MM-dd");
  findpatientimage: string | undefined;
  findpatientmessage: string | undefined;
  defaultUI: boolean = false;
  // appointmentSearchForm = new FormGroup({
  //   name: new FormControl(""),
  //   booknumber: new FormControl(""),
  //   phone: new FormControl(""),
  //   startdate: new FormControl(this.todayDate),
  //   enddate: new FormControl(this.todayDate),
  //   isDateRange: new FormControl(0),
  //   checked: new FormControl("true"),
  // });

  searchAppPatient: boolean = false;
  searchResults: AppointmentSearchModel[] = [];
  isChecked: boolean = false;
  isDateDisabled: boolean = false;

  OPAppointmentForm!: FormGroup;
  questions: any;
  constructor(
    private http: HttpService,
    private datepipe: DatePipe,
    private formService: QuestionControlService,
    public dialogRef: MatDialogRef<AppointmentSearchDialogComponent>
  ) {}
  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.FormData.properties,
      {}
    );
    this.OPAppointmentForm = formResult.form;
    this.questions = formResult.questions;
    this.searchAppointment();
  }
  ngAfterViewInit() {
    this.getMaxID();
  }

  FormData = {
    title: "",
    type: "object",
    properties: {
      name: {
        type: "string",
        title: "Name",

        defaultValue: "",
        // pattern: "^[A-Za-z]{1}[A-Za-z. '']+"
        // defaultValue: this.cookie.get("LocationIACode") + ".",
      },
      bookingNo: {
        type: "string",
        title: "Book No",
        required: false,
        defaultValue: "",
      },

      phone: {
        type: "number",
        title: "Phone",
        required: false,
        //  pattern: "^[1-9]{1}[0-9]{9}",
        minimum: 1000000000,
        maximum: 9999999999,
        defaultValue: "",
      },
      datevalidation: {
        type: "checkbox",
        required: false,
        options: [{ title: "" }],
        defaultValue: 0,
      },
      fromDate: {
        type: "date",
        title: "From Date",
        defaultValue: this.todayDate,
        required: false,
      },
      toDate: {
        type: "date",
        title: "To Date",
        defaultValue: this.todayDate,
        required: false,
      },
    },
  };

  config: any = {
    selectBox: false,
    clickedRows: true,
    clickSelection: "single",
    displayedColumns: [
      "id",
      "title",
      "firstName",
      "lastName",
      "doctorName",
      "billDatetime",
      "nationality",
      "country",
      "state",
      "city",
      "houseNo",
      "locality",
      "occupation",
      "howdidyouknow",
      "isdoborAge",
      "dob",
      "age",
      "gender",
      "mobileno",
      "email",
      "paymentDate",
      "bookingNo",
      "transactionNo",
      "amount",
      "orderInfo",
      "nbBankName",
      "iAcode",
      "registrationno",
      "locationId",
      "billid",
      "isRefunded",
      "refundedReceiptNo",
      "registeredDateTime",
      "registeredBy",
      "billNo",
      "refundedDateTime",
      "refundReason",
      "sex",
      "maritalStatus",
    ],
    columnsInfo: {
      id: {
        title: "Id",
        type: "string",
        style: {
          width: "120px",
        },
      },
      title: {
        title: "Title",
        type: "string",
        style: {
          width: "120px",
        },
      },
      firstName: {
        title: "First Name",
        type: "string",
        style: {
          width: "120px",
        },
      },
      lastName: {
        title: "Last Name",
        type: "string",
        style: {
          width: "120px",
        },
      },
      doctorName: {
        title: "Doctor Name",
        type: "string",
        style: {
          width: "120px",
        },
        tooltipColumn: "doctorName",
      },
      billDatetime: {
        title: "Time Slot",
        type: "string",
        style: {
          width: "120px",
        },
      },
      nationality: {
        title: "Nationality",
        type: "string",
        style: {
          width: "120px",
        },
      },
      country: {
        title: "Country",
        type: "string",
        style: {
          width: "120px",
        },
      },
      state: {
        title: "State",
        type: "string",
        style: {
          width: "120px",
        },
      },
      city: {
        title: "City",
        type: "string",
        style: {
          width: "120px",
        },
      },
      houseNo: {
        title: "House No",
        type: "string",
        style: {
          width: "120px",
        },
      },
      locality: {
        title: "Locality",
        type: "string",
        style: {
          width: "120px",
        },
      },
      occupation: {
        title: "Occupation",
        type: "string",
        style: {
          width: "120px",
        },
      },
      howdidyouknow: {
        title: "How Did You Know?",
        type: "string",
        style: {
          width: "190px",
        },
      },
      isdoborAge: {
        title: "ISDOBORAge",
        type: "string",
        style: {
          width: "120px",
        },
      },
      dob: {
        title: "DOB",
        type: "date",
        style: {
          width: "120px",
        },
      },
      age: {
        title: "Age",
        type: "string",
        style: {
          width: "120px",
        },
      },
      gender: {
        title: "Gender",
        type: "string",
        style: {
          width: "120px",
        },
      },
      mobileno: {
        title: "Mobiel No.",
        type: "tel",
        style: {
          width: "120px",
        },
      },
      email: {
        title: "Email",
        type: "string",
        style: {
          width: "180px",
        },
      },
      paymentDate: {
        title: "Payment Date",
        type: "string",
        style: {
          width: "120px",
        },
      },
      bookingNo: {
        title: "Booking No.",
        type: "string",
        style: {
          width: "180px",
        },
        tooltipColumn: "bookingNo",
      },
      transactionNo: {
        title: "Transaction No.",
        type: "string",
        style: {
          width: "120px",
        },
      },
      amount: {
        title: "Amount",
        type: "string",
        style: {
          width: "120px",
        },
      },
      orderInfo: {
        title: "Order info",
        type: "string",
        style: {
          width: "120px",
        },
      },
      nbBankName: {
        title: "NB Bank Name",
        type: "string",
        style: {
          width: "120px",
        },
      },
      iAcode: {
        title: "IA Code",
        type: "string",
        style: {
          width: "120px",
        },
      },
      registrationno: {
        title: "Registration No.",
        type: "string",
        style: {
          width: "120px",
        },
        tooltipColumn: "registrationno",
      },
      locationId: {
        title: "Location ID",
        type: "string",
        style: {
          width: "120px",
        },
      },
      billid: {
        title: "Bill ID",
        type: "string",
        style: {
          width: "120px",
        },
      },
      isRefunded: {
        title: "Is Refunded",
        type: "string",
        style: {
          width: "120px",
        },
      },
      refundedReceiptNo: {
        title: "Refund Receipt",
        type: "string",
        style: {
          width: "120px",
        },
      },
      registeredDateTime: {
        title: "Registered Date Time",
        type: "string",
        style: {
          width: "180px",
        },
        tooltipColumn: "registeredDateTime",
      },
      registeredBy: {
        title: "Registered By",
        type: "string",
        style: {
          width: "120px",
        },
      },
      billNo: {
        title: "Bill No.",
        type: "string",
        style: {
          width: "120px",
        },
      },
      refundedDateTime: {
        title: "Refunded Date Time",
        type: "string",
        style: {
          width: "180px",
        },
      },
      refundReason: {
        title: "Refund Reason",
        type: "string",
        style: {
          width: "150px",
        },
      },
      sex: {
        title: "Sex",
        type: "string",
        style: {
          width: "120px",
        },
      },
      maritalStatus: {
        title: "Martial Status",
        type: "string",
        style: {
          width: "125px",
        },
      },
    },
  };
  // dateRangeSelected(event: any) {
  //   if (event.checked) {
  //     this.appointmentSearchForm.value.isDateRange = 1;
  //     this.isDateDisabled = false;
  //   } else {
  //     this.appointmentSearchForm.value.isDateRange = 0;
  //     this.isDateDisabled = true;

  //     //this.appointmentSearchForm.value.startdate=this.datePipe.transform(this.appointmentSearchForm.value.startdate,'yyyy-MM-dd')
  //     //this.appointmentSearchForm.value.startdate=this.datePipe.transform(this.appointmentSearchForm.value.startdate,'yyyy-MM-dd')
  //   }
  // }

  searchAppointment() {
    this.searchResults = [];
    console.log("app search called");
    //this.http.getExternal(ApiConstants.getAppointmentPatientSearch(this.appointmentSearchForm.value.phone,this.appointmentSearchForm.value.name,'',this.appointmentSearchForm.value.isDateRange,this.appointmentSearchForm.value.startdate,this.appointmentSearchForm.value.enddate,'',this.appointmentSearchForm.value.booknumber)).subscribe((response)=>{
    this.getAppointmentSearch().subscribe(
      (response) => {
        this.searchResults = response;
        console.log(this.searchResults);
        if (this.searchResults.length == 0) {
          this.searchAppPatient = false;
          this.defaultUI = true;
          this.findpatientimage = "norecordfound";
          this.findpatientmessage = "No Appointment Found";
        } else {
          this.searchAppPatient = true;
          this.defaultUI = false;
          this.tableRows = this.searchResults;
          this.getMaxID();
        }
      },
      (error: any) => {
        console.log(error);
        this.searchResults = [];
        this.defaultUI = true;
        this.searchAppPatient = false;
        this.findpatientmessage = "No records found";
        this.findpatientimage = "norecordfound";
      }
    );
  }

  // get patternError() {
  //   return this.appointmentSearchForm.controls["phoneNo"].errors?.["pattern"];
  // }

  clear() {
    this.OPAppointmentForm.reset();
  }
  getAppointmentSearch() {
    return this.http.get(
      ApiConstants.appointmentPatientDetail(
        this.OPAppointmentForm.value.phone || "",
        this.OPAppointmentForm.value.name || "",
        this.OPAppointmentForm.value.lastname || "",
        this.OPAppointmentForm.value.datevalidation == false ? 0 : 1,
        this.datepipe.transform(
          this.OPAppointmentForm.value.fromDate,
          "yyyy-MM-dd"
        ) || "",
        this.datepipe.transform(
          this.OPAppointmentForm.value.toDate,
          "yyyy-MM-dd"
        ) || "",
        this.OPAppointmentForm.value.bookingNo
      )
    );
  }
  close() {
    this.OPAppointmentForm.reset();
    this.dialogRef.close();
  }
  getMaxID() {
    console.log("getmaxid called", this.tableRows);
    console.log("getmaxid called", this.tableRows.selection);
    setTimeout(() => {
      this.tableRows.selection.changed.subscribe((res: any) => {
        this.dialogRef.close({ data: res });
      });
    });
  }
  //  'http://localhost:7005/api/patient/getappointmentpatientssearch?fname=Dev&IsDateRange=0&fromDate=2022-03-01&ToDate=2022-03-31&SearchFrom=1' \
}
