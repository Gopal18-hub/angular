import { DatePipe } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Registrationdetails } from "@core/types/registeredPatientDetial.Interface";
import { VisitHistoryComponent } from "@core/UI/billing/submodules/visit-history/visit-history.component";
import { ApiConstants } from "@shared/constants/ApiConstants";
import { CookieService } from "@shared/services/cookie.service";
import { HttpService } from "@shared/services/http.service";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { Subject, takeUntil } from "rxjs";
import { SearchDialogComponent } from "./search-dialog/search-dialog.component";
import { getrefundreason } from "../../../../core/types/billdetails/getrefundreason.Interface";
import { getPatientPersonalandBillDetails } from "../../../../core/types/billdetails/getpatientpersonalandbilldetails.Interface";
import { BillDetailsApiConstants } from "./BillDetailsApiConstants";
import { billDetailService } from "./billDetails.service";
@Component({
  selector: "out-patients-details",
  templateUrl: "./details.component.html",
  styleUrls: ["./details.component.scss"],
})
export class DetailsComponent implements OnInit {
  constructor(
    public matDialog: MatDialog,
    private formService: QuestionControlService,
    private router: Router,
    private http: HttpService,
    private cookie: CookieService,
    private datepipe: DatePipe,
    private billdetailservice: billDetailService
  ) {}

  @ViewChild("selectedServices") selectedServicesTable: any;
  public refundreasonlist: getrefundreason[] = [];
  public patientbilldetaillist!: getPatientPersonalandBillDetails;
  linkList = [
    {
      title: "Services",
      path: "services",
    },
    {
      title: "Partial/Gen. Credit Bill Settlement",
      path: "cred-bill-settlement",
    },
    {
      title: " Refund After Bill",
      path: "refund-after-bill",
    },
    {
      title: " Refund Credit",
      // path: "",
    },
  ];
  activeLink = this.linkList[0];

  BDetailFormData = {
    type: "object",
    title: "",
    properties: {
      billNo: {
        type: "string",
      },
      maxid: {
        type: "string",
        defaultValue: this.cookie.get("LocationIACode") + ".",
      },
      mobileNo: {
        type: "tel",
        pattern: "^[1-9]{1}[0-9]{9}",
      },
      billDate: {
        type: "date",
        // title: "SSN",
      },
      datevalidation: {
        type: "checkbox",
        required: false,
        options: [{ title: "" }],
        defaultValue: 0,
      },
      fromDate: { 
        type: "date",
        maximum: new Date(),
        defaultValue: new Date(),
        disabled: true,
      },
      toDate: { 
        type: "date",
        maximum: new Date(),
        defaultValue: new Date(),
        disabled: true,
      },
      billAmt: {
        type: "string",
        required: false,
        defaultValue: 0.0,
        readonly: true,
      },
      dipositrAmt: {
        type: "string",
        required: false,
        defaultValue: 0.0,
        readonly: true,
      },
      discAmt: {
        type: "string",
        required: false,
        defaultValue: 0.0,
        readonly: true,
      },
      discAftBill: {
        type: "string",
        required: false,
        defaultValue: 0.0,
        readonly: true,
      },
      refundAmt: {
        type: "string",
        required: false,
        defaultValue: 0.0,
        readonly: true,
      },
      authBy: {
        type: "string",
        required: false,
        readonly: true,
      },
      reason: {
        type: "dropdown",
        required: false,
        readonly: true,
        options: this.refundreasonlist,
      },
      paymentMode: {
        type: "dropdown",
        required: false,
        defaultValue: 0.0,
        readonly: true,
      },
      otpTxt: {
        type: "number",
        required: false,
        defaultValue: 0.0,
        readonly: false,
      },
    },
  };

  patientDetails!: Registrationdetails;
  serviceselectedList: [] = [] as any;
  BServiceForm!: FormGroup;

  questions: any;
  

  private readonly _destroying$ = new Subject<void>();
  patientName: any;
  age: any;
  gender: any;
  dob: any;
  country: any;
  ssn: any;
  operator: any;
  billdate: any;


  // BTN
  otpbtn: boolean = true;
  managerotpbtn: boolean = true;
  refundbill: boolean = true;
  approvalsend: boolean = true;
  printbill: boolean = true;
  printrefund: boolean = true;
  resendbill: boolean = true;
  consumableprint: boolean = true;
  phptracksheet: boolean = true;
  opprescription: boolean = true;
  doxperprint: boolean = true;
  clearbtn: boolean = true;
  ngOnInit(): void {
    this.router.navigate(['out-patient-billing/details'])
    .then(()=>{
      window.location.reload;
    })
    let formResult = this.formService.createForm(
      this.BDetailFormData.properties,
      {}
    );

    this.BServiceForm = formResult.form;
    this.questions = formResult.questions;
    this.lastUpdatedBy = this.cookie.get("UserName");
    this.getrefundreason();
  }
  lastUpdatedBy: string = "";
  currentTime: string = new Date().toLocaleString();

  ngAfterViewInit(): void {
    this.formEvents();
  }
  getrefundreason()
  {
    this.http.get(BillDetailsApiConstants.getrefundreason)
    .pipe(takeUntil(this._destroying$))
    .subscribe((resuldata)=>{
      console.log(resuldata);
      this.refundreasonlist = resuldata;
      this.questions[13].options = this.refundreasonlist.map(l=>{
        return { title: l.name, value: l.id}
      })
    })
  }
  formEvents() {
    //ON MAXID CHANGE
    this.questions[0].elementRef.addEventListener("keypress", (event: any) => {
      // If the user presses the "Enter" key on the keyboard

      if (event.key === "Enter") {
        // Cancel the default action, if needed

        event.preventDefault();
        console.log("event triggered");
        this.getpatientbilldetails();
        // this.getPatientDetailsByMaxId();
      }
    });
  }

  getpatientbilldetails()
  {
    this.http.get(BillDetailsApiConstants.getpatientbilldetails(this.BServiceForm.controls["billNo"].value))
    .pipe(takeUntil(this._destroying$))
    .subscribe((resultdata) => {
      console.log(resultdata);
      this.patientbilldetaillist = resultdata as getPatientPersonalandBillDetails;
      this.billdetailservice.patientbilldetaillist = resultdata;
      console.log(this.patientbilldetaillist.billDetialsForRefund_Table0);
      if(this.patientbilldetaillist.billDetialsForRefund_Table0.length == 1)
      {
        this.billdetailservice.serviceList = this.patientbilldetaillist.billDetialsForRefund_ServiceDetail;
        console.log(this.billdetailservice.serviceList);
        this.router.navigate(['out-patient-billing/details','services']);
        this.billFormfill();
      }
    })
  }
  billFormfill()
  {
    console.log(this.patientbilldetaillist.billDetialsForRefund_Table0);
    this.BServiceForm.controls["maxid"].setValue(this.patientbilldetaillist.billDetialsForRefund_Table0[0].uhid);
    this.BServiceForm.controls["mobileNo"].setValue(this.patientbilldetaillist.billDetialsForRefund_Table0[0].pcellno);
    this.BServiceForm.controls["billDate"].setValue(this.patientbilldetaillist.billDetialsForRefund_Table0[0].datetime);
    this.patientName = this.patientbilldetaillist.billDetialsForRefund_Table0[0].name;
    this.age = this.patientbilldetaillist.billDetialsForRefund_Table0[0].age;
    this.gender = this.patientbilldetaillist.billDetialsForRefund_Table0[0].sex;
    this.dob = this.datepipe.transform(this.patientbilldetaillist.billDetialsForRefund_Table0[0].datetime, "dd/MM/YYYY");
    this.country = 'India';
    this.ssn = this.patientbilldetaillist.billDetialsForRefund_Table0[0].ssn;
    this.operator = this.patientbilldetaillist.billDetialsForRefund_Table0[0].operator;
    this.billdate = this.datepipe.transform(this.patientbilldetaillist.billDetialsForRefund_Table0[0].datetime, "dd/MM/YYYY");
    this.BServiceForm.controls["billAmt"].setValue(this.patientbilldetaillist.billDetialsForRefund_DepositRefundAmountDetail[0].billamount);
    this.BServiceForm.controls["dipositrAmt"].setValue(this.patientbilldetaillist.billDetialsForRefund_DepositRefundAmountDetail[0].depositamount);
    this.BServiceForm.controls["discAmt"].setValue(this.patientbilldetaillist.billDetialsForRefund_DepositRefundAmountDetail[0].discountamount);
    this.BServiceForm.controls["discAftBill"].setValue(this.patientbilldetaillist.billDetialsForRefund_DepositRefundAmountDetail[0].companyPaidAmt);
    this.BServiceForm.controls["refundAmt"].setValue(this.patientbilldetaillist.billDetialsForRefund_RequestNoGeivePaymentModeRefund[0].refundAmt);
    this.BServiceForm.controls["authBy"].setValue(this.patientbilldetaillist.billDetialsForRefund_RequestNoGeivePaymentModeRefund[0].authorisedby);
    // this.BServiceForm.controls["billDate"].setValue();
  }
  // getPatientDetailsByMaxId() {
  //   let regNumber = Number(this.miscForm.value.maxid.split(".")[1]);

  //   //HANDLING IF MAX ID IS NOT PRESENT
  //   if (regNumber != 0) {
  //     let iacode = this.miscForm.value.maxid.split(".")[0];
  //     this.http
  //       .get(
  //         ApiConstants.getregisteredpatientdetailsForBilling(
  //           iacode,
  //           regNumber,
  //           Number(this.cookie.get("HSPLocationId"))
  //         )
  //       )
  //       .pipe(takeUntil(this._destroying$))
  //       .subscribe(
  //         (resultData: Registrationdetails) => {
  //           // this.clear();
  //           // this.flushAllObjects();
  //           this.patientDetails = resultData;
  //           // this.categoryIcons = this.patientService.getCategoryIconsForPatient(
  //           //   this.patientDetails
  //           // );
  //           // this.MaxIDExist = true;
  //           // console.log(this.categoryIcons);
  //           // this.checkForMaxID();
  //           //RESOPONSE DATA BINDING WITH CONTROLS

  //           this.setValuesToMiscForm(this.patientDetails);

  //           //SETTING PATIENT DETAILS TO MODIFIEDPATIENTDETAILOBJ
  //         },
  //         (error) => {
  //           if (error.error == "Patient Not found") {
  //             // this.messageDialogService.info(error.error);
  //             // this.router.navigate([], {
  //             //   queryParams: {},
  //             //   relativeTo: this.route,
  //             // });
  //             // this.flushAllObjects();
  //             // this.setValuesTo miscForm(this.patientDetails);
  //             this.miscForm.controls["maxid"].setValue(
  //               iacode + "." + regNumber
  //             );
  //             this.miscForm.controls["maxid"].setErrors({ incorrect: true });
  //             this.questions[0].customErrorMessage = "Invalid Max ID";
  //           }
  //           // this.clear();

  //           // this.maxIDChangeCall = false;
  //         }
  //       );
  //   }
  // }

  
  openhistory() {
    this.matDialog.open(VisitHistoryComponent, {
      width: "70%",
      height: "50%",
      data: {
        maxid: this.BServiceForm.value.maxid,
      },
    });
  }
  search()
  {
    this.matDialog.open(SearchDialogComponent, {
      width: "80%",
      height: "85%",
    });
  }
  clear()
  {
    this.BServiceForm.reset();
    this.BServiceForm.controls["maxid"].setValue(this.cookie.get("LocationIACode") + ".");
    this.billdetailservice.clear();
  }
}
