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
        actionType: "link",
        routeLink: "/patient-history",
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
    private messageDialogService: MessageDialogService
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
        await this.loadGrid(formdata);
      });
  }

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
    });
  }
  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

  getAllpatients() {
    let hspId = Number(this.cookie.get("HSPLocationId"));
    return this.http.get(ApiConstants.searchPatientApiDefault(hspId));
  }
}
