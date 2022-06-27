import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { getmergepatientsearch } from "../../../../../out_patients/core/models/getmergepatientsearch";
import { environment } from "@environments/environment";
import { HttpService } from "../../../../../shared/services/http.service";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormControl, FormGroup } from "@angular/forms";
import { ApiConstants } from "../../../../../out_patients/core/constants/ApiConstants";
import { PatientmergeModel } from "../../../../../out_patients/core/models/patientMergeModel";
import { CookieService } from "../../../../../shared/services/cookie.service";
import { MatCheckbox, MatCheckboxChange } from "@angular/material/checkbox";
import { MatTabLabel } from "@angular/material/tabs";
import { PatientService } from "../../../../../out_patients/core/services/patient.service";
import { SearchService } from "../../../../../shared/services/search.service";
import { MessageDialogService } from "../../../../../shared/ui/message-dialog/message-dialog.service";
import { Router } from "@angular/router";

@Component({
  selector: "out-patients-registration-unmerging",
  templateUrl: "./registration-unmerging.component.html",
  styleUrls: ["./registration-unmerging.component.scss"],
})
export class RegistrationUnmergingComponent implements OnInit {
  unmergingList: getmergepatientsearch[] = [];
  unMergePostModel: PatientmergeModel[] = [];
  isAPIProcess: boolean = false;
  unmergebuttonDisabled: boolean = true;
  showunmergespinner: boolean = true;
  unMergeresponse: string = "";
  maxid: any = "";
  ssn: any = "";
  defaultUI: boolean = true;
  unmergeimage: string = "placeholder";
  unmergemessage: string = "Please search Max ID or SSN";
  unmergeMastercheck = {
    isSelected: false,
  };
  count: number = 0;

  unmergeSearchForm = new FormGroup({
    maxid: new FormControl(""),
    ssn: new FormControl(""),
  });

  @ViewChild("table") table: any;

  config: any = {
    actionItems: true,
    actionItemList: [
      {
        title: "OP Billing",
        // actionType: "link",
        // routeLink: "",
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
    selectBox: true,
    displayedColumns: [
      "maxid",
      "ssn",
      "date",
      "patientName",
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
      patientName: {
        title: "Name",
        type: "string",
        tooltipColumn: "patientFullName",
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
        tooltipColumn: "place",
      },
      phone: {
        title: "Phone",
        type: "number",
      },
      categoryIcons: {
        title: "Category",
        type: "image",
        width: 34,
        style: {
          width: "220px",
        },
      },
    },
  };
  constructor(
    private http: HttpService,
    private cookie: CookieService,
    private patientServie: PatientService,
    private searchService: SearchService,
    private messageDialogService: MessageDialogService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.searchService.searchTrigger.subscribe((formdata) => {
      this.searchPatient(formdata.data);
    });
  }

  unMerge() {
    this.table.selection.selected.map((s: any) => {
      this.unMergePostModel.push({ id: s.id });
    });

    this.unMergePatient(this.unMergePostModel).subscribe(
      (resultdata) => {
        console.log(resultdata);
        this.unMergeresponse = resultdata;
        // this.openModal('unmerge-modal-1');
        this.unmergebuttonDisabled = true;
        this.unmergingList = [];
        this.unMergePostModel = [];
        this.messageDialogService.success(resultdata);
      },
      (error) => {
        console.log(error);
        this.defaultUI = true;
        this.unmergemessage = "No records found";
        this.unmergeimage = "norecordfound";
      }
    );
  }

  searchPatient(formdata: any) {
    this.defaultUI = false;
    // if(formdata['maxID'] == '' && formdata['ssn'] == '' )
    //   return;
    this.maxid = formdata["maxID"];
    this.ssn = formdata["ssn"];
    this.getAllunmergepatient().subscribe(
      (resultData) => {
        this.showunmergespinner = false;
        this.unmergingList = resultData;
        this.isAPIProcess = true;
        this.unmergingList = this.patientServie.getAllCategoryIcons(
          this.unmergingList,
          getmergepatientsearch
        );
        setTimeout(() => {
          this.table.selection.changed.subscribe((res: any) => {
            if (this.table.selection.selected.length >= 1) {
              this.unmergebuttonDisabled = false;
            } else {
              this.unmergebuttonDisabled = true;
            }
          });
        });
      },
      (error: any) => {
        this.defaultUI = true;
        this.unmergemessage = "No records found";
        this.unmergeimage = "norecordfound";
      }
    );
  }

  getAllunmergepatient() {
    return this.http.get(
      ApiConstants.mergePatientSearchApi(this.maxid, this.ssn)
    );
  }

  unMergePatient(unmergeJSONObject: PatientmergeModel[]) {
    let userId = Number(this.cookie.get("UserId"));
    return this.http.post(
      ApiConstants.unmergePatientAPi(userId),
      unmergeJSONObject
    );
  }
}
