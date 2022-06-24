import { AfterViewInit, Component, OnInit } from "@angular/core";
import { PatientSearchModel } from "../../../../../out_patients/core/models/patientSearchModel";
import { environment } from "@environments/environment";
import { HttpService } from "../../../../../shared/services/http.service";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ApiConstants } from "../../../../../out_patients/core/constants/ApiConstants";
import { PatientService } from "../../../../../out_patients/core/services/patient.service";
import { SearchService } from "../../../../../shared/services/search.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "find-patient",
  templateUrl: "./find-patient.component.html",
  styleUrls: ["./find-patient.component.scss"],
})
export class FindPatientComponent implements OnInit {
  patientList: PatientSearchModel[] = [];
  isAPIProcess: boolean = false;
  processingQueryParams : boolean= false;
  name = "";
  dob = "";
  maxId = "";
  healthId = "";
  aadhaarId = "";
  mobile = "";
  showspinner: boolean = true;
  findpatientimage: string | undefined;
  findpatientmessage: string | undefined;
  defaultUI: boolean = true;

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
    dateformat: "dd/MM/yyyy",
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
        title: "Reg Date",
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
        type: "image",
        width: 34,
      },
    },
  };
  constructor(
    private http: HttpService,
    private patientServie: PatientService,
    private searchService: SearchService,
    private route:ActivatedRoute
  ) {
    this.route.queryParams.subscribe((value)=>{
      this.isAPIProcess = false;
      this.searchPatient(value);
      this.processingQueryParams = true;
    });
  }

  ngOnInit(): void {
    this.defaultUI = false;
 
    if(!this.processingQueryParams)
    {
      this.getAllpatients().subscribe(
        (resultData) => {
          this.showspinner = false;
          this.patientList = resultData as PatientSearchModel[];
          this.patientList = this.patientServie.getAllCategoryIcons(
            this.patientList
          );
  
          this.isAPIProcess = true;
          console.log(this.patientList);
        },
        (error) => {
          console.log(error);
          this.patientList = [];
          this.defaultUI = true;
          this.findpatientmessage = "No records found";
          this.findpatientimage = "norecordfound";
        }
      );
    }
   

    this.searchService.searchTrigger.subscribe((formdata: any) => {
      console.log(formdata);
      this.isAPIProcess = false;
      this.searchPatient(formdata.data);
    });
  }

  searchPatient(formdata: any) {
    this.defaultUI = false;
    this.showspinner = true;
    if (
      formdata["name"] == "" &&
      formdata["phone"] == "" &&
      formdata["dob"] == "" &&
      formdata["maxID"] == "" &&
      formdata["healthID"] == "" &&
      formdata["adhaar"] == ""
    ) {
      this.getAllpatients().subscribe(
        (resultData) => {
          this.showspinner = false;         
          this.patientList = resultData;
          this.patientList = this.patientServie.getAllCategoryIcons(
            this.patientList
          );

          this.isAPIProcess = true;
          this.defaultUI = false;
          console.log(this.patientList);
        },
        (error) => {
          console.log(error);
          this.patientList = [];
          this.defaultUI = true;
          this.findpatientmessage = "No records found";
          this.findpatientimage = "norecordfound";
        }
      );
    } else if (
      formdata["name"] == "" &&
      formdata["phone"] == "" &&
      formdata["dob"] != "" &&
      formdata["maxID"] == "" &&
      formdata["healthID"] == "" &&
      formdata["adhaar"] == ""
    ) {
      return;
    } else {
      let maxid = formdata["maxID"].split('.')[1];
      if(maxid <= 0 || maxid == "" || maxid == undefined)
      {
        this.getAllpatients().subscribe(
          (resultData) => {
            this.showspinner = false;
            this.patientList = resultData as PatientSearchModel[];
            this.patientList = this.patientServie.getAllCategoryIcons(
              this.patientList
            );
    
            this.isAPIProcess = true;
            console.log(this.patientList);
          },
          (error) => {
            console.log(error);
            this.patientList = [];
            this.defaultUI = true;
            this.findpatientmessage = "No records found";
            this.findpatientimage = "norecordfound";
          }
        );
      }else{
        this.maxId = formdata["maxID"];
        this.name = formdata["name"];
        this.mobile = formdata["phone"];
        this.dob = formdata["dob"];
        this.aadhaarId = formdata["adhaar"];
        this.healthId = formdata["healthID"];
        this.getAllpatientsBySearch().subscribe(
          (resultData) => {
            this.showspinner = false;
            this.patientList = [];
            this.patientList = resultData;
            this.patientList = this.patientServie.getAllCategoryIcons(
              this.patientList
            );
  
            this.isAPIProcess = true;
            console.log(this.patientList);
          },
          (error) => {
            console.log(error);
            this.patientList = [];
            this.defaultUI = true;
            this.findpatientmessage = "No records found";
            this.findpatientimage = "norecordfound";
          }
        );
      }     
    }
  }

  getAllpatients() {
    return this.http.get(ApiConstants.searchPatientApiDefault);
  }

  getAllpatientsBySearch() {
    return this.http.get(
      ApiConstants.searchPatientApi(
        this.maxId,
        "",
        this.name,
        this.mobile,
        this.dob,
        this.aadhaarId,
        this.healthId
      )
    );
  }
}
