import { Component, OnInit, ViewChild } from "@angular/core";
import { PatientSearchModel } from "../../../auth/core/models/patientsearchmodel";
import { environment } from "@environments/environment";
import { HttpService } from "../../../shared/services/http.service";
import { ApiConstants } from "../../../auth/core/constants/ApiConstants";
import { PatientService } from "../../../out_patients/core/services/patient.service";
import { SearchService } from "../../../shared/services/search.service";
import { DatePipe } from "@angular/common";
import { Router,ActivatedRoute } from "@angular/router";

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
  showspinner: boolean = true;
  findpatientimage: string | undefined;
  findpatientmessage: string | undefined;
  defaultUI: boolean = true;

  @ViewChild("table") table: any

  config: any = {
    clickedRows: true,
    clickSelection: "single",
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
        width:34,
        style: {
          width: "220px",
        },
      },
    },
  };
  constructor(private http: HttpService,
     private patientServie: PatientService,
     private searchService:SearchService,
     private datepipe:DatePipe,
     private router:Router) {}

  ngOnInit(): void {
    this.getAllpatients().subscribe((resultData) => {
      this.showspinner = false;
      this.defaultUI = false;
      resultData = resultData.map((item:any) => {
        item.fullname = item.firstName + ' ' + item.lastName;
        return item;
      })
      this.patientList = resultData;
      this.patientList = this.patientServie.getAllCategoryIcons(this.patientList);      
      this.apiProcessing = true;
      console.log(this.patientList);
      setTimeout(()=>{        
        this.table.selection.changed.subscribe((res:any)=>{ 
          console.log(res);
          this.router.navigate(["out-patients","registration","op-registration"],{queryParams:{maxId:res.added[0].maxid}});
        });
      });
    });
    this.searchService.searchTrigger.subscribe((formdata:any)=>{
      console.log(formdata);
        this.searchPatient(formdata.data);
    });
  }

  getAllpatients() {
    return this.http.getExternal(ApiConstants.searchPatientDefault);
  }

  searchPatient(formdata: any) {
   // this.defaultUI = false;
    this.showspinner = true;
    let dateOfBirth;
    let maxid = formdata["maxID"].split('.')[1];
      if(maxid <= 0 || maxid == undefined || maxid == null || maxid == "")
      {
        this.maxId = "";
      }
      else{
        this.maxId = formdata["maxID"];
      }
      if(formdata["dob"] != undefined || formdata["dob"] != null || formdata["dob"] != "")
      {
        dateOfBirth = this.datepipe.transform(formdata["dob"],'dd/MM/yyyy');
      }
      else{
        dateOfBirth = "";
      }
    if (
      formdata["name"] == "" &&
      formdata["phone"] == "" &&
      dateOfBirth == "" &&
      this.maxId == "" &&
      formdata["healthID"] == "" &&
      formdata["adhaar"] == ""
    ) {
      this.getAllpatients().subscribe(
        (resultData) => {
          this.showspinner = false;  
          resultData = resultData.map((item:any) => {
            item.fullname = item.firstName + ' ' + item.lastName;
            return item;
          })           
          this.patientList = resultData;
          this.patientList = this.patientServie.getAllCategoryIcons(
            this.patientList
          );
          resultData = resultData.map((item:any) => {
            item.fullname = item.firstName + ' ' + item.lastName;
            return item;
          });
          this.apiProcessing = true;
          this.defaultUI = false;
          setTimeout(()=>{        
            this.table.selection.changed.subscribe((res:any)=>{ 
              console.log(res);
              this.router.navigate(["registration","op-registration"],{queryParams:{maxId:res.added[0].maxid}});
            });
          });
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
      dateOfBirth != "" &&
      this.maxId == "" &&
      formdata["healthID"] == "" &&
      formdata["adhaar"] == ""
    ) {
      this.patientList = [];
      this.showspinner = false;
      this.defaultUI = true;
      this.findpatientimage= "placeholder";
      this.findpatientmessage = "Please enter Name / Phone in combination with DOB as search criteria";
          
    } else {  
        this.name = formdata["name"];
        this.mobile = formdata["phone"];
        this.dob = dateOfBirth || "";
        this.aadhaarId = formdata["adhaar"];
        this.healthId = formdata["healthID"];
        this.getAllpatientsBySearch().subscribe(
          (resultData) => {
            this.showspinner = false;
            this.defaultUI = false;
            this.patientList = [];
            resultData = resultData.map((item:any) => {
              item.fullname = item.firstName + ' ' + item.lastName;
              return item;
            })
            this.patientList = resultData;
            this.patientList = this.patientServie.getAllCategoryIcons(
              this.patientList
            );  
            this.apiProcessing = true;
            setTimeout(()=>{        
              this.table.selection.changed.subscribe((res:any)=>{ 
                console.log(res);
                this.router.navigate(["registration","op-registration"],{queryParams:{maxId:res.added[0].maxid}});
              });
            });
            console.log(this.patientList);
          },
          (error) => {
            console.log(error);
            this.patientList = [];
            this.showspinner = false;
            this.defaultUI = true;
            this.findpatientmessage = "No records found";
            this.findpatientimage = "norecordfound";
          }
        );         
    }
  }
  getAllpatientsBySearch() {
    return this.http.get(ApiConstants.searchPatientApi(this.maxId,'', this.name, this.mobile, this.dob, this.aadhaarId, this.healthId));
  }
}
