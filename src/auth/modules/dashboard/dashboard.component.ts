import { Component, OnInit } from "@angular/core";
import { PatientSearchModel } from "../../../auth/core/models/patientsearchmodel";
import { environment } from "@environments/environment";
import { HttpService } from "../../../shared/services/http.service";
import { ApiConstants } from "../../../auth/core/constants/ApiConstants";
import { PatientService } from "../../../out_patients/core/services/patient.service";
import { SearchService } from "../../../shared/services/search.service";

@Component({
  selector: "auth-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  patientList: PatientSearchModel[] = [];
  apiProcessing: boolean = false;
  name = '';
  dob = '';
  maxId = '';
  healthId = '';
  aadhaarId = '';
  mobile = '';


  config: any = {
    actionItems: true,
    actionItemList: [
      {
        title: "OP Billing",
        //actionType: "link",
        //routeLink: "",
      },
      {
        title: "Bill Details",
      },
      {
        title: "Deposits",
      },
      {
        title: "Admission",
      },
      {
        title: "Admission log",
      },
      {
        title: "Visit History",
      },
    ],
    dateformat: 'dd/MM/yyyy',
    selectBox: false,
    displayedColumns: [
      "maxid",
      "ssn",
      "date",
      "firstName",
      "age",
      "gender",
      "dob",
      "place",
      "phone",
      "categoryIcons",
    ],
    columnsInfo: {
      maxid: {
        title: "Max ID",
        type: "number",
      },
      ssn: {
        title: "SSN",
        type: "number",
      },
      date: {
        title: "Reg.Date",
        type: "date",
      },
      firstName: {
        title: "Name",
        type: "string",
        tooltipColumn: "patientName",
      },
      age: {
        title: "Age",
        type: "number",
      },
      gender: {
        title: "Gender",
        type: "string",
      },
      dob: {
        title: "DOB",
        type: "date",
      },
      place: {
        title: "Address",
        type: "string",
        tooltipColumn: "completeAddress",
      },
      phone: {
        title: "Phone",
        type: "number",
      },
      categoryIcons: {
        title: "Category",
        type:'image',
        width:34
      },
    },
  };
  constructor(private http: HttpService,
     private patientServie: PatientService,
     private searchService:SearchService) {}

  ngOnInit(): void {
    this.getAllpatients().subscribe((resultData) => {
      this.patientList = resultData;
      this.patientList = this.patientServie.getAllCategoryIcons(this.patientList);

      this.apiProcessing = true;
      console.log(this.patientList);
    });
    this.searchService.searchTrigger.subscribe((formdata:any)=>{
      console.log(formdata);
        this.searchPatient(formdata.data);
    });
  }

  getAllpatients() {
    return this.http.getExternal(ApiConstants.searchPatientDefault);
  }

  searchPatient(formdata:any)
  {
    if (formdata['name'] == '' && formdata['phone'] == '' 
    && formdata['dob'] == '' && formdata['maxID'] == ''
    && formdata['healthID'] == '' && formdata['adhaar'] == '')
    {
      this.getAllpatients().subscribe((resultData) => {
        this.patientList = resultData;
        this.patientList = this.patientServie.getAllCategoryIcons(this.patientList);
  
        this.apiProcessing = true;
        console.log(this.patientList);
      });
    }
    else if(formdata['name'] == '' && formdata['phone'] == '' 
    && formdata['dob'] != '' && formdata['maxID'] == ''
    && formdata['healthID'] == '' && formdata['adhaar'] == '')
    {
      return;
    }
    else{
      let maxid = formdata["maxID"].split('.')[1];
      if(maxid <= 0 || maxid == "" || maxid == undefined)
      {
        this.getAllpatients().subscribe(
          (resultData) => {           
            this.patientList = resultData as PatientSearchModel[];
            this.patientList = this.patientServie.getAllCategoryIcons(
              this.patientList
            );
    
            this.apiProcessing = true;
            console.log(this.patientList);
          },
          (error) => {
            console.log(error);
            this.patientList = [];          
          }
        );
      }else{
        this.maxId = formdata['maxID'];
        this.name = formdata['name'];
        this.mobile = formdata['phone'];
        this.dob = formdata['dob'];
        this.aadhaarId = formdata['adhaar'];
        this.healthId = formdata['healthID'];
        this.getAllpatientsBySearch().subscribe((resultData) => {
          this.patientList = resultData;
          this.patientList = this.patientServie.getAllCategoryIcons(this.patientList);
    
          this.apiProcessing = true;
          console.log(this.patientList);
        });
      }     
    }

  }

  getAllpatientsBySearch() {
    return this.http.get(ApiConstants.searchPatientApi(this.maxId,'', this.name, this.mobile, this.dob, this.aadhaarId, this.healthId));
  }
}
