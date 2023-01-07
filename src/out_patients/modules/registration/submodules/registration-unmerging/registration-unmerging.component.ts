import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
} from "@angular/core";
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
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { VisitHistoryComponent } from "@shared/modules/visit-history/visit-history.component";
import { MatDialog } from "@angular/material/dialog";
import * as moment from "moment";

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

  quickLinksRoutes: any = {
    1: "/out-patient-billing",
    2: "/out-patient-billing/details",
    3: "/out-patient-billing/deposit",
  };

  @ViewChild("table") table: any;

  config: any = {
    actionItems: true,
    actionItemList: [
      {
        title: "OP Billing",
        actionType: "custom",
        linkid: 1,
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
        actionType: "custom",
        linkid: 6,
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
        tooltipColumn: "place",
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
    private cookie: CookieService,
    private patientServie: PatientService,
    private searchService: SearchService,
    private messageDialogService: MessageDialogService,
    private router: Router,
    private matDialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.searchService.searchTrigger
      .pipe(takeUntil(this._destroying$))
      .subscribe((formdata) => {
        this.searchPatient(formdata.data);
      });
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

  unMerge() {
    this.table.selection.selected.map((s: any) => {
      this.unMergePostModel.push({ id: s.id });
    });

    this.unMergePatient(this.unMergePostModel)
      .pipe(takeUntil(this._destroying$))
      .subscribe(
        (resultdata) => {
          console.log(resultdata);
          if (resultdata["success"]) {
            this.messageDialogService.success(resultdata["message"]);
          } else {
            this.messageDialogService.success(resultdata["message"]);
          }
          this.unMergeresponse = resultdata["message"];
          // this.openModal('unmerge-modal-1');
          this.unmergebuttonDisabled = true;
          this.unmergingList = [];
          this.unMergePostModel = [];
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
    this.getAllunmergepatient()
      .pipe(takeUntil(this._destroying$))
      .subscribe(
        (resultData) => {
          this.showunmergespinner = false;
          resultData = resultData.map((item: any) => {
            item.notereason = item.noteReason;
            item.age= this.onageCalculator(item.dob);
            return item;
          });
          this.unmergingList = resultData;
          this.isAPIProcess = true;
          this.unmergingList = this.patientServie.getAllCategoryIcons(
            this.unmergingList,
            getmergepatientsearch
          );
          setTimeout(() => {
            this.table.selection.changed
              .pipe(takeUntil(this._destroying$))
              .subscribe((res: any) => {
                if (this.table.selection.selected.length >= 1) {
                  this.unmergebuttonDisabled = false;
                } else {
                  this.unmergebuttonDisabled = true;
                }
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

  unMergePatient(unmergeJSONObject: PatientmergeModel[]) {
    let userId = Number(this.cookie.get("UserId"));
    return this.http.post(
      ApiConstants.unmergePatientAPi(userId),
      unmergeJSONObject
    );
  }
}
