import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
} from "@angular/core";
import { PatientSearchModel } from "../../../../../out_patients/core/models/patientSearchModel";
import { environment } from "@environments/environment";
import { HttpService } from "../../../../../shared/services/http.service";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ApiConstants } from "../../../../../out_patients/core/constants/ApiConstants";
import { PatientService } from "../../../../../out_patients/core/services/patient.service";
import { SearchService } from "../../../../../shared/services/search.service";
import { Router, ActivatedRoute } from "@angular/router";
import { DatePipe } from "@angular/common";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { CookieService } from "@shared/services/cookie.service";

@Component({
  selector: "find-patient",
  templateUrl: "./find-patient.component.html",
  styleUrls: ["./find-patient.component.scss"],
})
export class FindPatientComponent implements OnInit, OnDestroy {
  patientList: PatientSearchModel[] = [];
  isAPIProcess: boolean = false;
  processingQueryParams: boolean = false;
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

  @ViewChild("table") tableRows: any;

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
    dateformat: "dd/MM/yyyy",
    selectBox: false,
    displayedColumns: [
      "maxid",
      "ssn",
      "date",
      "fullname",
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
        style: {
          width: "120px",
        },
      },
      ssn: {
        title: "SSN",
        type: "number",
      },
      date: {
        title: "Reg Date",
        type: "date",
      },
      fullname: {
        title: "Name",
        type: "string",
        tooltipColumn: "patientName",
      },
      age: {
        title: "Age",
        type: "number",
        disabledSort: true,
      },
      gender: {
        title: "Gender",
        type: "string",
        disabledSort: true,
      },
      dob: {
        title: "DOB",
        type: "date",
      },
      place: {
        title: "Address",
        type: "string",
        tooltipColumn: "completeAddress",
        disabledSort: true,
      },
      phone: {
        title: "Phone",
        type: "number",
        disabledSort: true,
      },
      categoryIcons: {
        title: "Category",
        type: "image",
        width: 34,
        style: {
          width: "220px",
        },
        disabledSort: true,
      },
    },
  };

  private readonly _destroying$ = new Subject<void>();

  constructor(
    private http: HttpService,
    private patientServie: PatientService,
    private searchService: SearchService,
    private router: Router,
    private route: ActivatedRoute,
    private datepipe: DatePipe,
    private cookie: CookieService
  ) {
    this.route.queryParams
      .pipe(takeUntil(this._destroying$))
      .subscribe((value) => {
        this.isAPIProcess = false;
        this.searchPatient(value);
        this.processingQueryParams = true;
      });
  }

  ngOnInit(): void {
    //this.defaultUI = false;

    if (!this.processingQueryParams) {
      this.getAllpatients()
        .pipe(takeUntil(this._destroying$))
        .subscribe(
          (resultData) => {
            this.showspinner = false;
            resultData = resultData.map((item: any) => {
              item.fullname = item.firstName + " " + item.lastName;
              item.notereason = item.noteReason;
              return item;
            });
            this.patientList = resultData as PatientSearchModel[];
            this.patientList = this.patientServie.getAllCategoryIcons(
              this.patientList
            );

            this.isAPIProcess = true;
            console.log(this.patientList);
            setTimeout(() => {
              this.tableRows.selection.changed
                .pipe(takeUntil(this._destroying$))
                .subscribe((res: any) => {
                  console.log(res);
                  this.router.navigate(["registration", "op-registration"], {
                    queryParams: { maxId: res.added[0].maxid },
                  });
                });
            });
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

    this.searchService.searchTrigger
      .pipe(takeUntil(this._destroying$))
      .subscribe((formdata: any) => {
        console.log(formdata);
        this.isAPIProcess = false;
        this.searchPatient(formdata.data);
      });
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

  searchPatient(formdata: any) {
    this.defaultUI = false;
    this.showspinner = true;
    let hspId = Number(this.cookie.get("HSPLocationId"));
    if (formdata["globalSearch"] == 1) {
      this.http
        .get(ApiConstants.globalSearchApi(formdata["SearchTerm"], hspId))
        .pipe(takeUntil(this._destroying$))
        .subscribe(
          (resultData) => {
            this.showspinner = false;

            resultData = resultData.map((item: any) => {
              item.fullname = item.firstName + " " + item.lastName;
              item.notereason = item.noteReason;
              return item;
            });
            this.patientList = resultData;
            this.patientList = this.patientServie.getAllCategoryIcons(
              this.patientList
            );
            this.isAPIProcess = true;
            this.defaultUI = false;
            setTimeout(() => {
              this.tableRows.selection.changed
                .pipe(takeUntil(this._destroying$))
                .subscribe((res: any) => {
                  console.log(res);
                  this.router.navigate(["registration", "op-registration"], {
                    queryParams: { maxId: res.added[0].maxid },
                  });
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
    } else {
      let dateOfBirth;
      if (
        formdata["maxID"] != undefined &&
        formdata["maxID"] != "" &&
        formdata["maxID"] != null
      ) {
        let maxid = formdata["maxID"].split(".")[1];
        if (maxid <= 0 || maxid == undefined || maxid == null || maxid == "") {
          this.maxId = "";
        } else {
          this.maxId = formdata["maxID"];
        }
      } else {
        this.maxId = "";
      }

      if (
        formdata["dob"] != undefined &&
        formdata["dob"] != null &&
        formdata["dob"] != ""
      ) {
        dateOfBirth = this.datepipe.transform(formdata["dob"], "dd/MM/yyyy");
      } else {
        dateOfBirth = "";
      }
      if (
        (formdata["name"] == "" ||
          formdata["name"] == undefined ||
          formdata["name"] == null) &&
        (formdata["phone"] == "" ||
          formdata["phone"] == undefined ||
          formdata["phone"] == null) &&
        dateOfBirth == "" &&
        this.maxId == "" &&
        (formdata["healthID"] == "" ||
          formdata["healthID"] == undefined ||
          formdata["healthID"] == null) &&
        (formdata["adhaar"] == "" ||
          formdata["adhaar"] == undefined ||
          formdata["adhaar"] == null)
      ) {
        this.getAllpatients()
          .pipe(takeUntil(this._destroying$))
          .subscribe(
            (resultData) => {
              this.showspinner = false;

              resultData = resultData.map((item: any) => {
                item.fullname = item.firstName + " " + item.lastName;
                item.notereason = item.noteReason;
                return item;
              });
              this.patientList = resultData;
              this.patientList = this.patientServie.getAllCategoryIcons(
                this.patientList
              );
              this.isAPIProcess = true;
              this.defaultUI = false;
              setTimeout(() => {
                this.tableRows.selection.changed
                  .pipe(takeUntil(this._destroying$))
                  .subscribe((res: any) => {
                    console.log(res);
                    this.router.navigate(["registration", "op-registration"], {
                      queryParams: { maxId: res.added[0].maxid },
                    });
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
        formdata["dob"] != "" &&
        this.maxId == "" &&
        formdata["healthID"] == "" &&
        formdata["adhaar"] == ""
      ) {
        this.patientList = [];
        this.showspinner = false;
        this.defaultUI = true;
        this.findpatientimage = "placeholder";
        this.findpatientmessage =
          "Please enter Name / Phone in combination with DOB as search criteria";
      } else {
        this.name = formdata["name"];
        this.mobile = formdata["phone"];
        this.dob = dateOfBirth || "";
        this.aadhaarId = formdata["adhaar"];
        this.healthId = formdata["healthID"];
        this.getAllpatientsBySearch()
          .pipe(takeUntil(this._destroying$))
          .subscribe(
            (resultData) => {
              this.showspinner = false;
              this.patientList = [];
              resultData = resultData.map((item: any) => {
                item.fullname = item.firstName + " " + item.lastName;
                return item;
              });
              this.patientList = resultData;
              this.patientList = this.patientServie.getAllCategoryIcons(
                this.patientList
              );

              this.isAPIProcess = true;
              setTimeout(() => {
                this.tableRows.selection.changed
                  .pipe(takeUntil(this._destroying$))
                  .subscribe((res: any) => {
                    console.log(res);
                    this.router.navigate(["registration", "op-registration"], {
                      queryParams: { maxId: res.added[0].maxid },
                    });
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
