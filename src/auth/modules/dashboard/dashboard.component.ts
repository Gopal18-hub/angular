import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { PatientSearchModel } from "../../../auth/core/models/patientsearchmodel";
import { environment } from "@environments/environment";
import { HttpService } from "../../../shared/services/http.service";
import { ApiConstants } from "../../../auth/core/constants/ApiConstants";
import { PatientService } from "../../../out_patients/core/services/patient.service";
import { SearchService } from "../../../shared/services/search.service";
import { DatePipe } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { LookupService } from "../../../out_patients/core/services/lookup.service";
import { CookieService } from "@shared/services/cookie.service";
import { VisitHistoryComponent } from "@shared/modules/visit-history/visit-history.component";
import { MatDialog } from "@angular/material/dialog";
import * as moment from "moment";

@Component({
  selector: "auth-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.scss"],
})
export class DashboardComponent implements OnInit {
  patientList: PatientSearchModel[] = [];
  apiProcessing: boolean = false;
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

  @ViewChild("table") table: any;
  quickLinksRoutes: any = {
    1: "/out-patients/out-patient-billing",
    2: "/out-patients/out-patient-billing/details",
    3: "/out-patients/out-patient-billing/deposit",
  };

  config: any = {
    clickedRows: true,
    clickSelection: "single",
    actionItems: true,
    actionItemList: [
      {
        title: "OP Billing",
        linkid: 1,
        actionType: "custom",
      },
      {
        title: "Bill Details",
        linkid: 2,
        actionType: "custom",
      },
      {
        title: "Deposits",
        linkid: 3,
        actionType: "custom",
      },
      {
        title: "Admission",
        linkid: 4,
        actionType: "custom",
      },
      {
        title: "Admission log",
        linkid: 5,
        actionType: "custom",
      },
      {
        title: "Visit History",
        linkid: 6,
        actionType: "custom",
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
        title: "Reg.Date",
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
    private datepipe: DatePipe,
    private router: Router,
    private lookupService: LookupService,
    private cookieService: CookieService,
    public matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getAllpatients()
      .pipe(takeUntil(this._destroying$))
      .subscribe((resultData) => {
        this.showspinner = false;
        this.defaultUI = false;
        resultData = resultData.map((item: any) => {
          item.fullname = item.firstName + " " + item.lastName;
          item.notereason = item.noteReason;
          item.age= this.onageCalculator(item.dob);
          return item;
        });
        this.patientList = resultData;
        this.patientList = this.patientServie.getAllCategoryIcons(
          this.patientList
        );
        this.apiProcessing = true;
        console.log(this.patientList);
        setTimeout(() => {
          this.table.selection.changed.subscribe((res: any) => {
            console.log(res);
            this.router.navigate(
              ["out-patients", "registration", "op-registration"],
              { queryParams: { maxId: res.added[0].maxid } }
            );
          });
          this.table.actionItemClickTrigger.subscribe((res: any) => {
            console.log(res);
            if (res) {
              if (res.item && res.data) {
                //if else condition due to queryparam for deposite
                if (res.item["linkid"] == 1) {
                  if (this.quickLinksRoutes[res.item["linkid"]]) {
                    this.router.navigate(
                      [this.quickLinksRoutes[res.item["linkid"]]],
                      {
                        queryParams: { maxId: res.data["maxid"] },
                      }
                    );
                  }
                } else if (res.item["linkid"] == 6) {
                  this.matDialog.open(VisitHistoryComponent, {
                    width: "70%",
                    height: "50%",
                    data: {
                      maxid: res.data["maxid"],
                      docid: "",
                    },
                  });
                } else if (this.quickLinksRoutes[res.item["linkid"]]) {
                  this.router.navigate(
                    [this.quickLinksRoutes[res.item["linkid"]]],
                    {
                      queryParams: { maxID: res.data["maxid"] },
                    }
                  );
                }
              }
            }
          });
        });
      });
    this.searchService.searchTrigger
      .pipe(takeUntil(this._destroying$))
      .subscribe(async (formdata: any) => {
        this.apiProcessing = false;
        console.log(formdata);
        await this.loadGrid(formdata);
      });
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

  async loadGrid(formdata: any): Promise<any> {
    this.apiProcessing = false;
    this.defaultUI = false;
    const lookupdata = await this.lookupService.searchPatient(formdata);
    if (lookupdata == null || lookupdata == undefined) {
      this.patientList = [];
      this.defaultUI = true;
      this.showspinner = false;
      this.findpatientmessage = "No records found";
      this.findpatientimage = "norecordfound";
    } else {
      if (
        !formdata.data["name"] &&
        !formdata.data["phone"] &&
        formdata.data["dob"]
      ) {
        this.patientList = [];
        this.defaultUI = true;
        this.showspinner = false;
        this.findpatientmessage =
          "Please enter Name / Phone in combination with DOB as search criteria";
        this.findpatientimage = "placeholder";
      } else {
        const resultData = lookupdata.map((item: any) => {
          item.fullname = item.firstName + " " + item.lastName;
          item.notereason = item.noteReason;
          item.age= this.onageCalculator(item.dob);
          return item;
        });
        this.patientList = resultData;
        this.patientList = this.patientServie.getAllCategoryIcons(
          this.patientList
        );
        this.apiProcessing = true;
        this.showspinner = false;
        this.defaultUI = false;
        setTimeout(() => {
          this.table.selection.changed
            .pipe(takeUntil(this._destroying$))
            .subscribe((res: any) => {
              console.log(res);
              this.router.navigate(
                ["out-patients", "registration", "op-registration"],
                {
                  queryParams: { maxId: res.added[0].maxid },
                }
              );
            });
          this.table.actionItemClickTrigger.subscribe((res: any) => {
            console.log(res);
            if (res) {
              if (res.item && res.data) {
                //if else condition due to queryparam for deposite
                if (res.item["linkid"] == 1) {
                  if (this.quickLinksRoutes[res.item["linkid"]]) {
                    this.router.navigate(
                      [this.quickLinksRoutes[res.item["linkid"]]],
                      {
                        queryParams: { maxId: res.data["maxid"] },
                      }
                    );
                  }
                } else if (res.item["linkid"] == 6) {
                  this.matDialog.open(VisitHistoryComponent, {
                    width: "70%",
                    height: "50%",
                    data: {
                      maxid: res.data["maxid"],
                      docid: "",
                    },
                  });
                } else if (this.quickLinksRoutes[res.item["linkid"]]) {
                  this.router.navigate(
                    [this.quickLinksRoutes[res.item["linkid"]]],
                    {
                      queryParams: { maxID: res.data["maxid"] },
                    }
                  );
                }
              }
            }
          });
        });
      }
    }
  }
  onageCalculator(ageDOB = "") {
    if (ageDOB) {
      let dobRef = moment(ageDOB);
      if (!dobRef.isValid()) {
        return;
      }
      const today = moment();
      const diffYears = today.diff(dobRef, "years");
      const diffMonths = today.diff(dobRef, "months");
      const diffDays = today.diff(dobRef, "days");
     
      let returnAge = "";
      if (diffYears > 0) {
        returnAge = diffYears + " Year(s)";
      } else if (diffMonths > 0) {
        returnAge = diffMonths + " Month(s)";
      } else if (diffDays > 0) {
        returnAge = diffDays + " Day(s)";
      } else if (diffYears < 0 || diffMonths < 0 || diffDays < 0) {
        returnAge = "N/A";
      } else if (diffDays == 0) {
        returnAge = "1 Day(s)";
      }
      return returnAge;
    }
    return "N/A";
  }
  getAllpatients() {
    let hpId = Number(this.cookieService.get("HSPLocationId"));
    return this.http.getExternal(ApiConstants.searchPatientDefault(hpId));
  }
}
