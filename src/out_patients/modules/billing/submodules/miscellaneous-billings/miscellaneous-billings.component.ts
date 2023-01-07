import { DatePipe } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { ApiConstants } from "@core/constants/ApiConstants";
import { SimilarSoundPatientResponse } from "@core/models/getsimilarsound.Model";
import { patientRegistrationModel } from "@core/models/patientRegistrationModel.Model";
import { GetCompanyDataInterface } from "@core/types/employeesponsor/getCompanydata.Interface";
import { PatientDetail } from "@core/types/patientDetailModel.Interface";
import { VisitHistoryComponent } from "@shared/modules/visit-history/visit-history.component";
import { SimilarPatientDialog } from "@modules/registration/submodules/op-registration/op-registration.component";
import { CookieService } from "@shared/services/cookie.service";
import { DbService } from "@shared/services/db.service";
import { HttpService } from "@shared/services/http.service";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";
import { Subject, takeUntil } from "rxjs";
import { DipositeDetailModel } from "../../../../core/types/dipositeDetailModel.Interface";
import { miscPatientDetail } from "../../../../core/models/miscPatientDetail.Model";
import { Registrationdetails } from "../../../../core/types/registeredPatientDetial.Interface";
import { MiscService } from "../miscellaneous-billing/MiscService.service";
@Component({
  selector: "out-patients-miscellaneous-billings",
  templateUrl: "./miscellaneous-billings.component.html",
  styleUrls: ["./miscellaneous-billings.component.scss"],
})
export class MiscellaneousBillingsComponent implements OnInit {
  constructor(
    public matDialog: MatDialog,
    private formService: QuestionControlService,
    private router: Router,
    private http: HttpService,
    private cookie: CookieService,
    private datepipe: DatePipe,
    private messageDialogService: MessageDialogService,
    private db: DbService,
    private Misc: MiscService
  ) {}
  categoryIcons: any;
  doCategoryIconAction(icon: any) {}
  @ViewChild("selectedServices") selectedServicesTable: any;
  items: any[] = [];
  addItem(newItem: any) {
    console.log(newItem);
    this.items.push(newItem);
  }
  links = [
    {
      title: "Bills",
      path: "misc-bills",
    },
    {
      title: "Credit Details",
      path: "misc-credit-details",
    },
  ];
  activeLink = this.links[0];

  complanyList!: GetCompanyDataInterface[];
  coorporateList: { id: number; name: string }[] = [] as any;
  miscFormData = {
    type: "object",
    title: "",
    properties: {
      maxid: {
        type: "string",
        defaultValue: this.cookie.get("LocationIACode") + ".",
      },

      mobileNo: {
        type: "tel",
        pattern: "^[1-9]{1}[0-9]{9}",
      },
      //

      company: {
        type: "dropdown",
        options: this.complanyList,
        placeholder: "Select",
        // title: "SSN",
      },
      corporate: {
        type: "dropdown",
        options: this.coorporateList,
        placeholder: "Select",
        // title: "SSN",
      },
      narration: {
        type: "string",
        // title: "SSN",
      },

      b2bInvoiceType: {
        type: "checkbox",
        options: [
          {
            title: "B2B Invoice",
          },
        ],
      },
    },
  };

  patientDetails!: Registrationdetails;
  serviceselectedList: [] = [] as any;
  miscForm!: FormGroup;
  questions: any;
  question: any;
  private readonly _destroying$ = new Subject<void>();

  ngOnInit(): void {
    let formResult = this.formService.createForm(
      this.miscFormData.properties,
      {}
    );

    this.miscForm = formResult.form;
    this.questions = formResult.questions;

    this.lastUpdatedBy = this.cookie.get("UserName");
    this.http
      .get(ApiConstants.getcorporatemaster(1))
      .pipe(takeUntil(this._destroying$))
      .subscribe((res: any) => {
        console.log(res, "CorporateMaster");
      });
    this.http
      .get(ApiConstants.getinteractionmaster)
      .pipe(takeUntil(this._destroying$))
      .subscribe((res: any) => {
        console.log(res, "getinteractionmaster");
      });
    this.http
      .get(ApiConstants.getmasterdataformiscellaneous)
      .pipe(takeUntil(this._destroying$))
      .subscribe((res: any) => {
        console.log(res, "getmasterdataformiscellaneous");
      });
    this.http
      .get(ApiConstants.getdataforbillreport(10, 7, 1))
      .pipe(takeUntil(this._destroying$))
      .subscribe((res: any) => {
        console.log(res, "getdataforbillreport");
      });
    this.getAllCompany();
    this.getAllCorporate();
  }
  lastUpdatedBy: string = "";
  currentTime: string = new Date().toLocaleString();

  ngAfterViewInit(): void {
    this.formEvents();
  }

  formEvents() {
    //ON MAXID CHANGE
    this.questions[0].elementRef.addEventListener("keypress", (event: any) => {
      // If the user presses the "Enter" key on the keyboard

      if (event.key === "Enter") {
        // Cancel the default action, if needed

        event.preventDefault();
        console.log("event triggered");
        this.getPatientDetailsByMaxId();
      }
    });
    this.questions[1].elementRef.addEventListener("keydown", (event: any) => {
      // If the user presses the "TAB" key on the keyboard

      if (event.key === "Tab") {
        // Cancel the default action, if needed

        // event.preventDefault();

        this.onPhoneModify();
      }
    });

    this.miscForm.controls["company"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value: any) => {
        console.log(value);
        if (value.value) {
          // this.patientDetail = value.title;
          this.patientDetail.companyId = value.value;
          this.Misc.setPatientDetail(this.patientDetail);
        }
      });
    this.miscForm.controls["corporate"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value: any) => {
        console.log(value);
        if (value.value) {
          this.patientDetail.corporateName = value.title;
          this.patientDetail.corporateid = value.value;
          this.Misc.setPatientDetail(this.patientDetail);
        }
      });
    this.questions[4].elementRef.addEventListener(
      "blur",
      this.getRemark.bind(this)
    );
  }

  getRemark() {
    this.patientDetail.narration = this.miscForm.value.narration;
    this.Misc.setPatientDetail(this.patientDetail);
  }
  onPhoneModify() {
    this.getSimilarPatientDetails();
  }
  similarContactPatientList: SimilarSoundPatientResponse[] = [];
  MaxIDExist: boolean = false;

  getSimilarPatientDetails() {
    // subscribe to component event to know when to deleteconst selfDeleteSub = component.instance.deleteSelf

    this.matDialog.closeAll();
    console.log(this.similarContactPatientList.length);
    if (!this.MaxIDExist) {
      this.http
        .get(
          ApiConstants.getSimilarPatientonMobilenumber(
            this.miscForm.value.mobileNo
          )
        )
        .pipe(takeUntil(this._destroying$))
        .subscribe(
          (resultData: SimilarSoundPatientResponse[]) => {
            this.similarContactPatientList = resultData;
            console.log(this.similarContactPatientList);
            if (this.similarContactPatientList.length == 1) {
              console.log(this.similarContactPatientList[0]);
              let maxID = this.similarContactPatientList[0].maxid;
              this.miscForm.controls["maxid"].setValue(maxID);
              this.getPatientDetailsByMaxId();
            } else {
              if (this.similarContactPatientList.length != 0) {
                const similarSoundDialogref = this.matDialog.open(
                  SimilarPatientDialog,
                  {
                    width: "60vw",
                    height: "80vh",
                    data: {
                      searchResults: this.similarContactPatientList,
                    },
                  }
                );
                similarSoundDialogref
                  .afterClosed()
                  .pipe(takeUntil(this._destroying$))
                  .subscribe((result) => {
                    if (result) {
                      console.log(result.data["added"][0].maxid);
                      let maxID = result.data["added"][0].maxid;
                      this.miscForm.controls["maxid"].setValue(maxID);
                      this.getPatientDetailsByMaxId();
                    }
                    console.log("seafarers dialog was closed");
                    this.similarContactPatientList = [];
                  });
              } else {
                console.log("no data found");
              }
            }
          },
          (error) => {
            console.log(error);
            this.messageDialogService.info(error.error);
          }
        );
    }
  }

  getPatientDetailsByMaxId() {
    let regNumber = Number(this.miscForm.value.maxid.split(".")[1]);

    //HANDLING IF MAX ID IS NOT PRESENT
    if (regNumber != 0) {
      let iacode = this.miscForm.value.maxid.split(".")[0];
      this.http
        .get(
          ApiConstants.getregisteredpatientdetailsForMisc(
            iacode,
            regNumber,
            Number(this.cookie.get("HSPLocationId"))
          )
        )
        .pipe(takeUntil(this._destroying$))
        .subscribe(
          (resultData: Registrationdetails) => {
            this.patientDetails = resultData;
            if (
              this.patientDetails.dsPersonalDetails.dtPersonalDetails1.length !=
              0
            ) {
              this.patientDetails = resultData;
              this.MaxIDExist = true;
              this.setValuesToMiscForm(this.patientDetails);
              this.putCachePatientDetail(this.patientDetails);
            } else {
              this.setMaxIdError(iacode, regNumber);
            }
            // this.categoryIcons = this.patientService.getCategoryIconsForPatient(
            //   this.patientDetails
            // );
            // this.MaxIDExist = true;
            // console.log(this.categoryIcons);
            // this.checkForMaxID();
            //RESOPONSE DATA BINDING WITH CONTROLS

            //SETTING PATIENT DETAILS TO MODIFIEDPATIENTDETAILOBJ
          },
          (error) => {
            if (error.error == "Patient Not found") {
              // this.messageDialogService.info(error.error);
              // this.router.navigate([], {
              //   queryParams: {},
              //   relativeTo: this.route,
              // });
              // this.flushAllObjects();
              // this.setValuesTo miscForm(this.patientDetails);
              this.setMaxIdError(iacode, regNumber);
              this.MaxIDExist = false;
            }
            // this.clear();

            // this.maxIDChangeCall = false;
          }
        );
    }
  }

  //SETTING ERROR FOR MAX ID
  setMaxIdError(iacode: any, regNumber: any) {
    this.miscForm.controls["maxid"].setValue(iacode + "." + regNumber);
    this.miscForm.controls["maxid"].setErrors({ incorrect: true });
    this.questions[0].customErrorMessage = "Invalid Max ID";
  }
  patientName!: string;
  age!: string;
  gender!: string;
  dob!: string;
  country!: string;
  ssn!: string;

  //SETTING THE VALUES TO PATIENT DETAIL
  setValuesToMiscForm(pDetails: Registrationdetails) {
    let patientDetails = pDetails.dsPersonalDetails.dtPersonalDetails1[0];
    this.miscForm.controls["mobileNo"].setValue(patientDetails.pCellNo);
    this.patientName = patientDetails.firstname + " " + patientDetails.lastname;
    this.ssn = patientDetails.ssn;
    this.age = patientDetails.age + patientDetails.ageTypeName;
    this.gender = patientDetails.genderName;
    this.country = patientDetails.nationalityName;
    this.ssn = patientDetails.ssn;
    this.dob =
      "" + this.datepipe.transform(patientDetails.dateOfBirth, "dd/MM/yyyy");
    this.setCorporate(patientDetails);
  }

  setCompany(patientDetails: PatientDetail) {
    if (patientDetails.companyid != 0) {
      let company = this.filterList(
        this.complanyList,
        patientDetails.corporateid
      )[0];
      this.miscForm.controls["company"].setValue({
        title: company.name,
        value: company.id,
      });
    }
  }
  setCorporate(patientDetails: PatientDetail) {
    let corporate = this.filterList(
      this.coorporateList,
      patientDetails.corporateid
    )[0];

    if (patientDetails.corporateid != 0) {
      this.miscForm.controls["corporate"].setValue({
        title: corporate.name,
        value: corporate.id,
      });
    }
  }

  getAllCompany() {
    this.http
      .get(ApiConstants.getcompanyandpatientsponsordata)
      .pipe(takeUntil(this._destroying$))
      .subscribe((data) => {
        console.log(data);
        this.complanyList = data as GetCompanyDataInterface[];
        this.questions[2].options = this.complanyList.map((a) => {
          return { title: a.name, value: a.id };
        });
      });
  }

  getAllCorporate() {
    this.http
      .get(ApiConstants.getCorporate)
      .pipe(takeUntil(this._destroying$))
      .subscribe((resultData: { id: number; name: string }[]) => {
        this.coorporateList = resultData;
        // this.titleList.unshift({ id: 0, name: "-Select-", sex: 0, gender: "" });
        this.questions[3].options = this.coorporateList.map((l) => {
          return { title: l.name, value: l.id };
        });
      });
  }

  dipositeDetail!: DipositeDetailModel;
  getDipositedAmountByMaxID(iacode: string, regNumber: number) {
    this.http
      .get(
        ApiConstants.getregisteredpatientdetailsForMisc(
          iacode,
          regNumber,
          Number(this.cookie.get("HSPLocationId"))
        )
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe(
        (resultData: DipositeDetailModel) => {
          //add in discount
        },
        (error) => {
          // this.clear();
          // this.maxIDChangeCall = false;
        }
      );
  }
  openhistory() {
    this.matDialog.open(VisitHistoryComponent, {
      width: "70%",
      height: "50%",
      data: {
        maxid: this.miscForm.value.maxid,
      },
    });
  }

  patientDetail!: miscPatientDetail;
  putCachePatientDetail(patient: Registrationdetails) {
    let patientDetail = patient.dsPersonalDetails.dtPersonalDetails1[0];
    this.patientDetail = new miscPatientDetail(
      patientDetail.registrationno,
      patientDetail.iacode,
      0,
      0,
      0,
      Number(this.cookie.get("HSPLocationId")),
      0,
      0,
      0, //  "this.miscForm.value.company.value",
      Number(this.cookie.get("UserName")),
      0,
      0,
      Number(this.cookie.get("HSPLocationId")),
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0, //this.miscForm.value.corporate.value
      "", //this.miscForm.value.corporate.title
      0,
      0,
      "",
      this.miscForm.value.narration
    );
    // this.db.putCachePatientDetail(this.patientDetail);

    // console.log(this.db.getCachePatientDetail());
    this.Misc.setPatientDetail(this.patientDetail);
    localStorage.setItem("patientDetail", this.patientDetail.toString());
  }
  filterList(list: any[], id: any): any {
    return list.filter(function (item) {
      return item.id === id;
    });
  }

  //Sep 03

  visitHistory() {
    this.matDialog.open(VisitHistoryComponent, {
      width: "70%",
      height: "50%",
      data: {
        maxid: this.miscForm.value.maxid,
        docid: "",
      },
    });
  }
}
