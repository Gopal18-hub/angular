import { Component, OnInit } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpService } from '../../../../../../shared/services/http.service';
import { FormControl, FormGroup } from '@angular/forms';
import { AppointmentSearchModel } from '../../../../../../out_patients/core/models/appointmentSearchModel.Model';
//import { DatePipe } from '@angular/common';

@Component({
  selector: 'out-patients-appointment-search-dialog',
  templateUrl: './appointment-search-dialog.component.html',
  styleUrls: ['./appointment-search-dialog.component.scss']
})
export class AppointmentSearchDialogComponent implements OnInit {
  today = new Date();
  todayDate = new Date(this.today.setDate(this.today.getDate()));
  tomorrow =  new Date(this.today.setDate(this.today.getDate() + 1));
  findpatientimage: string | undefined;
  findpatientmessage: string | undefined;
  defaultUI:boolean=false;
  appointmentSearchForm = new FormGroup({
    name: new FormControl(''),
    booknumber: new FormControl(''),
    phone: new FormControl(''),
    startdate: new FormControl('2022-06-12'),
    enddate: new FormControl('2022-06-13'),
    isDateRange: new FormControl(0),
    checked: new FormControl("true"),
  });

  searchAppPatient: boolean = false
  searchResults: AppointmentSearchModel[] = [];
  isChecked: boolean = false;
  isDateDisabled : boolean=false;

  constructor(private http: HttpService) { }
  ngOnInit(): void {}


  config: any = {
    selectBox: false,
    displayedColumns: ['id', 'title', 'firstName', 'lastName', 'doctorName', 'billDatetime', 'nationality',
     'country', 'state', 'city', 'houseNo', 'locality', 'occupation', 'howdidyouknow', 'isdoborAge', 'dob', 
     'age', 'gender', 'mobileno', 'email', 'paymentDate', 'bookingNo', 'transactionNo', 'amount', 'orderInfo',
      'nbBankName', 'iAcode', 'registrationno', 'locationId', 'billid', 'isRefunded', 'refundedReceiptNo',
      'registeredDateTime', 'registeredBy', 'billNo','refundedDateTime','refundReason','sex','maritalStatus'],
    columnsInfo: {
      id: {
        title: 'Id',
        type: 'string'
      },
      title: {
        title: 'Title',
        type: 'string'
      },
      firstName: {
        title: 'First Name',
        type: 'string'
      },
      lastName: {
        title: 'Last Name',
        type: 'string'
      },
      doctorName: {
        title: 'Doctor Name',
        type: 'string'
      },
      billDatetime: {
        title: 'Time Slot',
        type: 'string'
      },
      nationality: {
        title: 'Nationality',
        type: 'string'
      },
      country: {
        title: 'Country',
        type: 'string'
      },
      state: {
        title: 'State',
        type: 'string'
      },
      city: {
        title: 'City',
        type: 'string'
      },
      houseNo: {
        title: 'House No',
        type: 'string'
      },
      locality: {
        title: 'Locality',
        type: 'string'
      },
      occupation: {
        title: 'Occupation',
        type: 'string'
      },
      howdidyouknow: {
        title: 'How Did You Know?',
        type: 'string'
      },
      isdoborAge: {
        title: 'ISDOBORAge',
        type: 'string'
      },
      dob: {
        title: 'DOB',
        type: 'date'
      },
      age: {
        title: 'Age',
        type: 'string'
      },
      gender: {
        title: 'Gender',
        type: 'string'
      },
      mobileno: {
        title: 'Mobiel No.',
        type: 'string'
      },
      email: {
        title: 'Email',
        type: 'string'
      },
      paymentDate: {
        title: 'Payment Date',
        type: 'string'
      },
      bookingNo: {
        title: 'Booking No.',
        type: 'string'
      },
      transactionNo: {
        title: 'Transaction No.',
        type: 'string'
      },
      amount: {
        title: 'Amount',
        type: 'string'
      },
      orderInfo: {
        title: 'Order info',
        type: 'string'
      },
      nbBankName: {
        title: 'NB Bank Name',
        type: 'string'
      },
      iAcode: {
        title: 'IA Code',
        type: 'string'
      },
      registrationno: {
        title: 'Registration No.',
        type: 'string'
      },
      locationId: {
        title: 'Location ID',
        type: 'string'
      },
      billid: {
        title: 'Bill ID',
        type: 'string'
      },
      isRefunded: {
        title: 'Is Refunded',
        type: 'string'
      },
      refundedReceiptNo: {
        title: 'Refund Receipt',
        type: 'string'
      },
      registeredDateTime: {
        title: 'Registered Date Time',
        type: 'string'
      },
      registeredBy: {
        title: 'Registered By',
        type: 'string'
      },
      billNo: {
        title: 'Bill No.',
        type: 'string'
      },
      refundedDateTime: {
        title: 'Refunded Date Time',
        type: 'string'
      },
      refundReason: {
        title: 'Refund Reason',
        type: 'string'
      },
      sex :{
        title: 'Sex',
        type: 'string'
      },
      maritalStatus: {
        title: 'Martial Status',
        type: 'string'
      }
    }
  }
  dateRangeSelected(event: any) {
    if (event.checked) {
      this.appointmentSearchForm.value.isDateRange = 1;
      this.isDateDisabled = false;
    }
    else {
      this.appointmentSearchForm.value.isDateRange = 0;
      this.isDateDisabled =true;

      //this.appointmentSearchForm.value.startdate=this.datePipe.transform(this.appointmentSearchForm.value.startdate,'yyyy-MM-dd')
      //this.appointmentSearchForm.value.startdate=this.datePipe.transform(this.appointmentSearchForm.value.startdate,'yyyy-MM-dd')
    }
  }

  searchAppointment() {
    this.searchResults = [];
    console.log("app search called");
    //this.http.getExternal(ApiConstants.getAppointmentPatientSearch(this.appointmentSearchForm.value.phone,this.appointmentSearchForm.value.name,'',this.appointmentSearchForm.value.isDateRange,this.appointmentSearchForm.value.startdate,this.appointmentSearchForm.value.enddate,'',this.appointmentSearchForm.value.booknumber)).subscribe((response)=>{
    this.getAppointmentSearch().subscribe((response) => { this.searchResults = response; 
      console.log(this.searchResults);
    if(this.searchResults.length==0)
    {
      this.searchAppPatient = false;
      this.defaultUI = true;
      this.findpatientimage = "norecordfound";
      this.findpatientmessage="No Appointment Found"
      
    }
    else{
      this.searchAppPatient = true;
      this.defaultUI = false;
    }
    },(error: any) => {
      console.log(error);
      this.searchResults = [];
      this.defaultUI = true;
      this.searchAppPatient = false;
      this.findpatientmessage = "No records found";
      this.findpatientimage = "norecordfound";
    }
    );  
   
  }
  clear() {
    this.appointmentSearchForm.reset();
  }
  getAppointmentSearch() {
    return this.http.get(environment.PatientApiUrl + 'api/patient/getappointmentpatientssearch?phone=' + this.appointmentSearchForm.value.phone + '&fname=' + this.appointmentSearchForm.value.name + '&lname=' + '' + '&IsDateRange=' + this.appointmentSearchForm.value.isDateRange + '&fromDate=' + this.appointmentSearchForm.value.startdate + '&ToDate=' + this.appointmentSearchForm.value.enddate + '&SearchFrom=' + '' + '&BookingNo=' + this.appointmentSearchForm.value.booknumber)
  }


}