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
import { LookupService } from "@core/services/lookup.service";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";
import { VisitHistoryComponent } from "@shared/modules/visit-history/visit-history.component";
import { MatDialog } from "@angular/material/dialog";
import * as moment from "moment";

@Component({
  selector: "find-patient",
  templateUrl: "./find-patient.component.html",
  styleUrls: ["./find-patient.component.scss"],
})
export class FindPatientComponent implements OnInit, OnDestroy, AfterViewInit {
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
  quickLinksRoutes: any = {
    1: "/out-patient-billing",
    2: "/out-patient-billing/details",
    3: "/out-patient-billing/deposit",
  };

  @ViewChild("table") tableRows: any;

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
        actionType: "custom",
        linkid: 2,
      },
      {
        title: "Deposits",
        actionType: "custom",
        linkid: 3,
      },
      {
        title: "Admission",
        linkid: 4,
      },
      {
        title: "Admission log",
        linkid: 5,
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
    private cookie: CookieService,
    private lookupService: LookupService,
    private messageDialogService: MessageDialogService,
    public matDialog: MatDialog
  ) {
    this.route.queryParams
      .pipe(takeUntil(this._destroying$))
      .subscribe(async (value) => {
        console.log(Object.keys(value).length);
        if (Object.keys(value).length > 0) {
          this.isAPIProcess = false;
          const lookupdata = await this.loadGrid(value);
          this.processingQueryParams = true;
        } else {
          this.getAllpatients()
            .pipe(takeUntil(this._destroying$))
            .subscribe(
              (resultData) => {
                this.showspinner = false;
                this.defaultUI = false;
                resultData = resultData.map((item: any) => {
                  item.fullname = item.firstName + " " + item.lastName;
                  item.notereason = item.noteReason;
                  item.age = this.onageCalculator(item.dob);
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
                      this.router.navigate(
                        ["registration", "op-registration"],
                        {
                          queryParams: { maxId: res.added[0].maxid },
                        }
                      );
                    });
                  this.tableRows.actionItemClickTrigger.subscribe(
                    (res: any) => {
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
                          } else if (
                            this.quickLinksRoutes[res.item["linkid"]]
                          ) {
                            this.router.navigate(
                              [this.quickLinksRoutes[res.item["linkid"]]],
                              {
                                queryParams: { maxID: res.data["maxid"] },
                              }
                            );
                          }
                        }
                      }
                    }
                  );
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
      });
  }

  ngOnInit(): void {
    //this.defaultUI = false;
    this.searchService.searchTrigger
      .pipe(takeUntil(this._destroying$))
      .subscribe(async (formdata: any) => {
        console.log(formdata);
        this.showspinner = true;
        await this.loadGrid(formdata);
      });
  }

  ngAfterViewInit(): void {}

  async loadGrid(formdata: any): Promise<any> {
    this.isAPIProcess = false;
    this.defaultUI = false;
    if (formdata.data) {
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
          this.processLookupData(lookupdata);
          if (formdata.data["globalSearch"] == 1) {
            if (formdata.data["SearchTerm"]) {
              if (formdata.data["SearchTerm"].includes(".")) {
                let iacode = formdata.data["SearchTerm"].split(".")[0];
                let regino = formdata.data["SearchTerm"].split(".")[1];
                if (regino && iacode) {
                  if (!Number.isNaN(Number(regino)) && iacode.length >= 4) {
                    if (lookupdata[0]["mergeLinked"]) {
                      this.messageDialogService.info(
                        "Max Id :" +
                          lookupdata[0]["maxid"] +
                          " merged with these " +
                          lookupdata[0]["mergeLinked"]
                      );
                    }
                  }
                }
              }
            }
          } else {
            if (formdata.data["maxID"]) {
              if (formdata.data["maxID"].includes(".")) {
                let iacode = formdata.data["maxID"].split(".")[0];
                let regino = formdata.data["maxID"].split(".")[1];
                if (regino && iacode) {
                  if (!Number.isNaN(Number(regino)) && iacode.length >= 4) {
                    if (lookupdata[0]["mergeLinked"]) {
                      this.messageDialogService.info(
                        "Max Id :" +
                          lookupdata[0]["maxid"] +
                          " merged with these " +
                          lookupdata[0]["mergeLinked"]
                      );
                    }
                  }
                }
              }
            }
          }
        }
      }
    } else {
      const lookupdata = await this.lookupService.searchPatient({
        data: formdata,
      });
      if (lookupdata == null || lookupdata == undefined) {
        this.patientList = [];
        this.defaultUI = true;
        this.showspinner = false;
        this.findpatientmessage = "No records found";
        this.findpatientimage = "norecordfound";
      } else {
        this.processLookupData(lookupdata);
      }
    }
  }

  processLookupData(lookupdata: any) {
    const resultData = lookupdata.map((item: any) => {
      item.fullname = item.firstName + " " + item.lastName;
      item.notereason = item.noteReason;
      item.age = this.onageCalculator(item.dob);
      return item;
    });
    this.patientList = resultData;
    this.patientList = this.patientServie.getAllCategoryIcons(this.patientList);
    this.isAPIProcess = true;
    this.showspinner = false;
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

      this.tableRows.actionItemClickTrigger.subscribe((res: any) => {
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
  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
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
        returnAge = diffYears + " Month(s)";
      } else if (diffDays > 0) {
        returnAge = diffYears + " Day(s)";
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
    let hspId = Number(this.cookie.get("HSPLocationId"));
    return this.http.get(ApiConstants.searchPatientApiDefault(hspId));
  }
}
