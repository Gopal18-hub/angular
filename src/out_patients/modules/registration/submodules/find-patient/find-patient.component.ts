import { AfterViewInit, Component, OnInit } from "@angular/core";
import { PatientSearchModel } from "../../../../../out_patients/core/models/patientSearchModel";
import { environment } from "@environments/environment";
import { HttpService } from "../../../../../shared/services/http.service";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ApiConstants } from "../../../../../out_patients/core/constants/ApiConstants";
import { PatientService } from "../../../../../out_patients/core/services/patient.service";

@Component({
  selector: "find-patient",
  templateUrl: "./find-patient.component.html",
  styleUrls: ["./find-patient.component.scss"],
})
export class FindPatientComponent implements OnInit {
  patientList: PatientSearchModel[] = [];
  isAPIProcess: boolean = false;

  config: any = {
    actionItems: true,
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
        title: "MAX ID",
        type: "number",
      },
      ssn: {
        title: "SSN",
        type: "number",
      },
      date: {
        title: "Regn.Date",
        type: "date",
      },
      firstName: {
        title: "Name",
        type: "string",
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
        title: "Date of Birth",
        type: "date",
      },
      place: {
        title: "Address",
        type: "string",
      },
      phone: {
        title: "Phone No.",
        type: "number",
      },
      categoryIcons: {
        title: "Category",
        type: "image",
        width: 34,
      },
    },
  };
  constructor(private http: HttpService, private patient: PatientService) {}

  ngOnInit(): void {
    this.getAllpatients().subscribe((resultData) => {
      this.patientList = resultData;
      this.patientList = this.patient.getAllCategoryIcons(this.patientList);

      this.isAPIProcess = true;
      console.log(this.patientList);
    });
  }

  getAllpatients() {
    return this.http.get(ApiConstants.searchPatientApiDefault);
  }
}
