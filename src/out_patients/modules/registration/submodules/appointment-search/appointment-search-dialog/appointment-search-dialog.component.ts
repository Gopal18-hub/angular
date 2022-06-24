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
  ngOnInit(): void { }


  config: any = {
    selectBox: false,
    displayedColumns: ['id', 'title', 'firstName', 'lastName', 'doctorName', 'refundedDateTime', 'nationality', 'country', 'state', 'city', 'houseNo'],
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
      refundedDateTime: {
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
    if(this.searchResults.length==0)
    {
      this.searchAppPatient = false;
      this.defaultUI=true;
      this.findpatientimage = "norecordfound";
      this.findpatientmessage="No Appointment Found"
    }
    else{
      this.searchAppPatient = true;
      this.defaultUI=false;
    }
    },(error: any) => {
      console.log(error);
      this.searchResults = [];
      this.defaultUI = true;
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