import { DatePipe } from "@angular/common";
import {
  Component,
  KeyValueDiffer,
  KeyValueDiffers,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Registrationdetails } from "@core/types/registeredPatientDetial.Interface";
import { VisitHistoryComponent } from "@shared/modules/visit-history/visit-history.component";

import { CookieService } from "@shared/services/cookie.service";
import { HttpService } from "@shared/services/http.service";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { Subject, takeUntil } from "rxjs";
import { SearchDialogComponent } from "./search-dialog/search-dialog.component";
import { getrefundreason } from "../../../../core/types/billdetails/getrefundreason.Interface";
import { getPatientPersonalandBillDetails } from "../../../../core/types/billdetails/getpatientpersonalandbilldetails.Interface";
import { BillDetailsApiConstants } from "./BillDetailsApiConstants";
import { billDetailService } from "./billDetails.service";
import { ApiConstants } from "@core/constants/ApiConstants";
import { PatientDetails } from "@core/models/patientDetailsModel.Model";
import { PatientService } from "@core/services/patient.service";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";
import { MaxHealthSnackBarService } from "@shared/ui/snack-bar";
import * as moment from "moment";
import { PaymentDialogComponent } from './payment-dialog/payment-dialog.component';
import { BillDetailsRefundDialogComponent } from "./refund-dialog/refund-dialog.component";
import { objSendApprovalTableList, sendForBillDetailsApproval } from '../../../../core/models/sendForBillDetailsApproval.Model';
import { PrintRefundReceiptDialogComponent } from './printrefundreceiptdialog/print-refund-receipt-dialog.component';
import { ResendBillEmailDialogComponent } from './resend-bill-email-dialog/resend-bill-email-dialog.component'
import { ReportService } from "@shared/services/report.service";
import { ActivatedRoute } from "@angular/router";
@Component({
  selector: "out-patients-details",
  templateUrl: "./details.component.html",
  styleUrls: ["./details.component.scss"],
})
export class DetailsComponent implements OnInit {
  private check!: KeyValueDiffer<string, any>;
  maxid: any;
  billno: any;
  constructor(
    public matDialog: MatDialog,
    private formService: QuestionControlService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpService,
    public cookie: CookieService,
    private datepipe: DatePipe,
    private billdetailservice: billDetailService,
    private differ: KeyValueDiffers,
    private patientService: PatientService,
    private msgdialog: MessageDialogService,
    private snackbar: MaxHealthSnackBarService,
    private reportService: ReportService
  ) {
    this.route.queryParams
      .pipe(takeUntil(this._destroying$))
      .subscribe(async (value) => {
        console.log(Object.keys(value).length);
        if (Object.keys(value).length > 0) {         
          const lookupdata = await this.loadGrid(value); 
        }
        else{
          this.ngOnInit();
          this.clear();
        }
        });
    this.check = this.differ
      .find(this.billdetailservice.sendforapproval)
      .create();
    
  }
  async loadGrid(formdata: any): Promise<any> {    
     console.log(formdata.maxID);
     this.maxid = formdata.maxID;
  }
  moment = moment;
  @ViewChild("selectedServices") selectedServicesTable: any;
  public refundreasonlist: getrefundreason[] = [];
  public patientbilldetaillist!: getPatientPersonalandBillDetails;
  // for icons
  public patientDetailsforicon!: PatientDetails;
  categoryIcons: [] = [];

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
  paymentmode: any = [];
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
      mobileno: {
        type: "tel",
        // pattern: "^[1-9]{1}[0-9]{9}",
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
        defaultValue: new Date(),
      },
      toDate: {
        type: "date",
        defaultValue: new Date(),
      },
      billAmt: {
        type: "string",
        required: false,
        defaultValue: "0.0",
        readonly: true,
      },
      dipositrAmt: {
        type: "string",
        required: false,
        defaultValue: "0.0",
        readonly: true,
      },
      discAmt: {
        type: "string",
        required: false,
        defaultValue: "0.0",
        readonly: true,
      },
      discAftBill: {
        type: "string",
        required: false,
        defaultValue: "0.0",
        readonly: true,
      },
      refundAmt: {
        type: "string",
        required: false,
        defaultValue: "0.0",
        readonly: true,
      },
      authBy: {
        type: "string",
        required: false,
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
        options: this.paymentmode,
      },
      otpTxt: {
        type: "number",
        required: false,
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
  dmsbtn: boolean = true;
  visithistorybtn: boolean = true;
  doxperurl: any;

  billexist: boolean = true;
  ngOnInit(): void {

    // this.router.navigate(["out-patient-billing/details"]).then(() => {
    //   window.location.reload;
    // });
    let formResult = this.formService.createForm(
      this.BDetailFormData.properties,
      {}
    );
    this.BServiceForm = formResult.form;
    this.questions = formResult.questions;
    this.lastUpdatedBy = this.cookie.get("UserName");
    if(this.maxid != '' && this.maxid != undefined)
    {
      this.BServiceForm.controls['maxid'].setValue(this.maxid);
      this.search();
      this.maxid = '';
    }
    this.BServiceForm.controls['fromDate'].disable();
    this.BServiceForm.controls['toDate'].disable();
    this.BServiceForm.controls['authBy'].disable();
    this.BServiceForm.controls['reason'].disable();
    this.questions[6].minimum = this.BServiceForm.controls['fromDate'].value;
    this.getrefundreason();
    this.paymentmode = this.billdetailservice.paymentmode;
    this.questions[14].options = this.paymentmode.map((l: any) => {
      return { title: l.title, value: l.title };
    });
  }
  lastUpdatedBy: string = "";
  currentTime: string = new Date().toLocaleString();
  

  ngAfterViewInit(): void {
    this.formEvents();
    this.BServiceForm.controls["datevalidation"].valueChanges.subscribe(
      (value) => {
        console.log(value);
        if (value == true) {
          this.BServiceForm.controls["fromDate"].enable();
          this.BServiceForm.controls["toDate"].enable();
        } else {
          this.BServiceForm.controls["fromDate"].disable();
          this.BServiceForm.controls["toDate"].disable();
        }
      }
    );
    console.log(this.billdetailservice.sendforapproval);
    this.BServiceForm.controls['fromDate'].valueChanges.subscribe( (val) => {
      this.questions[6].minimum = val;
    })
    this.BServiceForm.controls['refundAmt'].valueChanges.subscribe((res) => {
      this.sendapprovalcheck();
    })
    this.questions[12].elementRef.addEventListener('blur',this.sendapprovalcheck.bind(this));
    this.BServiceForm.controls['reason'].valueChanges.subscribe((res) => {
      this.sendapprovalcheck();
    })
    this.BServiceForm.controls['paymentMode'].valueChanges.subscribe((res) => {
      this.sendapprovalcheck();
    })
  }
  getrefundreason() {
    this.http
      .get(BillDetailsApiConstants.getrefundreason)
      .pipe(takeUntil(this._destroying$))
      .subscribe((resuldata) => {
        console.log(resuldata);
        this.refundreasonlist = resuldata;
        this.questions[13].options = this.refundreasonlist.map((l) => {
          return { title: l.name, value: l.id };
        });
      });
  }
  sendapprovalcheck()
  {
    console.log(this.BServiceForm.controls['refundAmt'].value, this.BServiceForm.controls['authBy'].value, this.BServiceForm.controls['reason'].value, this.BServiceForm.controls['paymentMode'].value);
    console.log(this.billdetailservice.sendforapproval.length);
    if(this.BServiceForm.controls['authBy'].value != '' && 
    this.BServiceForm.controls['reason'].value != '' &&
    this.BServiceForm.controls['paymentMode'].value != '' &&
    this.BServiceForm.controls['refundAmt'].value > 0)
    {
      this.approvalsend = false;
      this.billdetailservice.authorisedby = this.BServiceForm.controls['authBy'].value;
      this.billdetailservice.reason = this.BServiceForm.controls['reason'].value;
      this.billdetailservice.mop = this.BServiceForm.controls['paymentMode'].value;
    }
    else
    {
      this.approvalsend = true;
    }
  }
  sendforapproval()
  {
    var reas = this.refundreasonlist.filter(i => {
      return i.id == this.BServiceForm.controls['reason'].value;
    });
    this.billdetailservice.sendforapproval.forEach((i:any) => {
      i.authorisedby = this.BServiceForm.controls['authBy'].value,
      i.reason = reas[0].name,
      i.mop = this.BServiceForm.controls['paymentMode'].value
    });
    this.http.post(BillDetailsApiConstants.sendapproval('Gavs', this.cookie.get('HSPLocationId'), this.cookie.get('UserId')), this.approvelist())
    .subscribe(res => {
      console.log(res);
      if(res.length > 0)
      {
        this.msgdialog.success(res[0].returnMessage);
      }
    })
  }
  sendforapprovallist: sendForBillDetailsApproval = new sendForBillDetailsApproval();
  approvelist()
  {
    this.sendforapprovallist.objSendApprovalTableList = [] as Array<objSendApprovalTableList>
    this.billdetailservice.sendforapproval.forEach( (i: any) => {
      console.log(i);
      this.sendforapprovallist.objSendApprovalTableList.push({
        ssn : i.ssn,
        maxid : i.maxid,
        ptnName : i.ptnName,
        billNo : i.billNo,
        operatorName : i.operatorName,
        authorisedby : i.authorisedby,
        reason : i.reason,
        refundAmt : i.refundAmt,
        mop : i.mop,
        serviceId : i.serviceId,
        itemId : i.itemid,
        serviceName : i.serviceName,
        itemName : i.itemName,
        refundAfterAck : i.refundAfterAck,
        itemOrderId : i.itemOrderId
      })
    })
    console.log(this.sendforapprovallist);
    return this.sendforapprovallist;
  }
  formEvents() {
    //ON billno CHANGE
    this.questions[0].elementRef.addEventListener("keypress", (event: any) => {
      if (event.key === "Enter") {
        event.preventDefault();
        console.log("event triggered");
        this.billno = this.BServiceForm.controls['billNo'].value;
        this.getpatientbilldetails();
      }
    });
    this.questions[1].elementRef.addEventListener("keypress", (event: any) => {
      if (event.key === "Enter") {
        event.preventDefault();
        console.log("event triggered");
        this.search();
      }
    });
    this.questions[2].elementRef.addEventListener("keypress", (event: any) => {
      if (event.key === "Enter") {
        event.preventDefault();
        console.log("event triggered");
        this.search();
      }
    });
  }

  getPatientIcon() {
    let iacode = this.BServiceForm.value.maxid.split(".")[0];
    let regNumber = this.BServiceForm.value.maxid.split(".")[1];
    this.http
      .get(ApiConstants.patientDetails(regNumber, iacode))
      .pipe(takeUntil(this._destroying$))
      .subscribe(
        (resultData: PatientDetails) => {
          // this.clear();
          this.patientDetailsforicon = resultData;
          this.categoryIcons = this.patientService.getCategoryIconsForPatient(
            this.patientDetailsforicon
          );
        },
        (error) => {}
      );
  }

  getpatientbilldetails() {
    this.billdetailservice.clear();
    this.http
      .get(BillDetailsApiConstants.getpatientbilldetails(this.BServiceForm.controls["billNo"].value))
      .pipe(takeUntil(this._destroying$))
      .subscribe(
        (resultdata) => {
          console.log(resultdata);
          if (resultdata == null) {
            this.snackbar.open("Invalid Bill No");
          } 
          else 
          {
            this.patientbilldetaillist = resultdata as getPatientPersonalandBillDetails;
            this.billdetailservice.patientbilldetaillist = resultdata;
            console.log(this.patientbilldetaillist.billDetialsForRefund_Table0);
            if (this.patientbilldetaillist.billDetialsForRefund_Table0.length >= 1) 
            {
              this.billdetailservice.billafterrefund = this.patientbilldetaillist.billDetialsForRefund_ServiceDetail;
              this.billdetailservice.serviceList = this.patientbilldetaillist.billDetialsForRefund_ServiceDetail;
              if (this.patientbilldetaillist.billDetialsForRefund_Cancelled[0].cancelled == 1) 
              {
                var errtxt = "Bill Number " + this.BServiceForm.value.billNo + " Has Been Cancelled";
                this.msgdialog.info(errtxt);
              }
              console.log(this.patientbilldetaillist.billDetialsForRefund_ConfigValueToken[1]);
              this.BServiceForm.controls["billNo"].setValue(this.billno);
              this.billFormfill();
              if(this.patientbilldetaillist.billDetialsForRefund_RequestNoGeivePaymentModeRefund[0].authorisedby == '' &&
                this.patientbilldetaillist.billDetialsForRefund_RequestNoGeivePaymentModeRefund[0].reason == '' &&
                this.patientbilldetaillist.billDetialsForRefund_RequestNoGeivePaymentModeRefund[0].paymentMode == ''  
              )
              {
                this.BServiceForm.controls['authBy'].enable();
                this.BServiceForm.controls['reason'].enable();
                this.BServiceForm.controls['paymentMode'].enable();
              }
              else
              {
                this.BServiceForm.controls['authBy'].disable();
                this.BServiceForm.controls['reason'].disable();
                this.BServiceForm.controls['paymentMode'].disable();
              }
              var healthlist = 0;
              var consultlist = 0;  
              this.patientbilldetaillist.billDetialsForRefund_ServiceDetail.forEach( (item: any) => {
                console.log(item);
                if(item.servicename == 'Health Checkups')
                {
                  healthlist++;
                }
                else if(item.servicename == 'Consultations')
                {
                  consultlist++;
                }
              })
              if(healthlist > 0)
              {
                this.phptracksheet = false;
              }
              else
              {
                this.phptracksheet = true;
              }
              if(consultlist > 0 && this.patientbilldetaillist.billDetialsForRefund_Cancelled[0].cancelled == 0)
              {
                this.opprescription = false;
              }
              else
              {
                this.opprescription = true;
              }
              if (this.patientbilldetaillist.billDetialsForRefund_ServiceDetail[0].requestToApproval == 0) 
              {
                this.refundbill == false;
              } 
              else if (this.patientbilldetaillist.billDetialsForRefund_ServiceDetail[0].requestToApproval == 1) 
              {
                this.refundbill == true;
              }
              this.printbill = false;
              this.consumableprint = false;
              this.doxperprint = false;
              console.log(this.billdetailservice.serviceList);
              this.router.navigate(["out-patient-billing/details", "services"]);
            }
          }
        }),
        (error:any) => {
          console.log(error);
        }
  }
  billFormfill() {
    this.billexist = false;
    this.BServiceForm.controls['billNo'].setValue(this.billno);
    console.log(this.patientbilldetaillist.billDetialsForRefund_Table0);
    this.BServiceForm.controls["maxid"].setValue(
      this.patientbilldetaillist.billDetialsForRefund_Table0[0].uhid
    );
    this.dmsbtn = false;
    this.visithistorybtn = false;
    this.getPatientIcon();
    this.BServiceForm.controls["mobileno"].setValue(
      this.patientbilldetaillist.billDetialsForRefund_Table0[0].pcellno
    );
    this.BServiceForm.controls["billDate"].setValue(
      this.patientbilldetaillist.billDetialsForRefund_Table0[0].datetime
    );
    this.patientName =
      this.patientbilldetaillist.billDetialsForRefund_Table0[0].name;
    this.age = this.patientbilldetaillist.billDetialsForRefund_Table0[0].age;
    this.gender = this.patientbilldetaillist.billDetialsForRefund_Table0[0].sex;
    this.dob = this.datepipe.transform(
      this.patientbilldetaillist.billDetialsForRefund_Table0[0].dateOfBirth,
      "dd/MM/YYYY"
    );
    this.country =
      this.patientbilldetaillist.billDetialsForRefund_Table0[0].nationalityName;
    this.ssn = this.patientbilldetaillist.billDetialsForRefund_Table0[0].ssn;
    this.operator =
      this.patientbilldetaillist.billDetialsForRefund_Table0[0].operator;
    this.billdate = this.datepipe.transform(
      this.patientbilldetaillist.billDetialsForRefund_Table0[0].datetime,
      "dd/MM/YYYY"
    );
    this.BServiceForm.controls["billAmt"].setValue(
      this.patientbilldetaillist
        .billDetialsForRefund_DepositRefundAmountDetail[0].billamount
    );
    this.BServiceForm.controls["dipositrAmt"].setValue(
      this.patientbilldetaillist
        .billDetialsForRefund_DepositRefundAmountDetail[0].depositamount
    );
    this.BServiceForm.controls["discAmt"].setValue(
      this.patientbilldetaillist
        .billDetialsForRefund_DepositRefundAmountDetail[0].discountamount
    );
    // this.BServiceForm.controls["discAftBill"].setValue(this.patientbilldetaillist.billDetialsForRefund_DepositRefundAmountDetail[0]);
    // this.BServiceForm.controls["refundAmt"].setValue(this.patientbilldetaillist.billDetialsForRefund_RequestNoGeivePaymentModeRefund[0].refundAmt);
    this.BServiceForm.controls["authBy"].setValue(this.patientbilldetaillist.billDetialsForRefund_RequestNoGeivePaymentModeRefund[0].authorisedby);
    var reasonid = this.refundreasonlist.find( id => {
      return id.name == this.patientbilldetaillist.billDetialsForRefund_RequestNoGeivePaymentModeRefund[0].reason;
    })
    var payid = this.billdetailservice.paymentmode.find( (id: any) => {
      return id.title == this.patientbilldetaillist.billDetialsForRefund_RequestNoGeivePaymentModeRefund[0].paymentMode;
    })
    this.BServiceForm.controls['reason'].setValue(reasonid?.id);
    console.log(payid);
    if(payid != undefined)
    {
      this.BServiceForm.controls['paymentMode'].setValue(payid.title);
      console.log(this.BServiceForm.controls['paymentMode'].value);
    }
    this.sendapprovalcheck();
  }
 
 openhistory() {
    this.matDialog.open(VisitHistoryComponent, {
      width: "70%",
      height: "50%",
      data: {
        maxid: this.BServiceForm.value.maxid,
      },
    });
  }
  search() {
    let dialogref = this.matDialog.open(SearchDialogComponent, {
      maxWidth: "90vw",
      height: "85%",
      data: {
        maxid: this.BServiceForm.value.maxid,
        mobileno: this.BServiceForm.value.mobileno,
        check: this.BServiceForm.value.datevalidation,
        fromdate: this.BServiceForm.value.fromDate,
        todate: this.BServiceForm.value.toDate,
      },
    });
    dialogref.afterClosed().subscribe((res) => {
      console.log(res);
      if (res == "" && res == null && res == undefined) {
        // this.clear();
      } else {
        this.BServiceForm.controls["billNo"].setValue(res);
        this.billno = this.BServiceForm.controls["billNo"].value;
        console.log(this.BServiceForm.controls["billNo"].value)
        this.getpatientbilldetails();
      }
    });
    this.BServiceForm.markAsDirty();
  }
  refunddialog()
  { 
    console.log(this.BServiceForm.value.paymentMode);
    const RefundDialog = this.matDialog.open(BillDetailsRefundDialogComponent, {
      panelClass: 'refund-bill-dialog',
      width: "70vw",
      height: "98vh",
      data: {  
        patientinfo: {
          emailId: ''  , 
          mobileno: this.patientbilldetaillist.billDetialsForRefund_Table0[0].pcellno,
        },  
        refundamount: this.BServiceForm.value.refundAmt,
        mop: this.BServiceForm.value.paymentMode,
        mobile: this.patientbilldetaillist.billDetialsForRefund_Table0[0].pcellno,
        billid: this.patientbilldetaillist.billDetialsForRefund_Table1[0].opBillID,
        billno: this.BServiceForm.value.billNo,
        maxid: this.patientbilldetaillist.billDetialsForRefund_Table0[0].uhid
      }
    });

    RefundDialog.afterClosed()
    .pipe(takeUntil(this._destroying$))
    .subscribe((result) => {
      //if(result == "Success"){        
        console.log("Refund Dialog closed");
      //}    
    });
  }
  clear() {
    this.BServiceForm.reset();
    this.BServiceForm.controls["maxid"].setValue(this.cookie.get("LocationIACode") + ".");
    this.BServiceForm.controls["fromDate"].setValue(new Date());
    this.BServiceForm.controls["toDate"].setValue(new Date());
    this.patientName = "";
    this.age = "";
    this.gender = "";
    this.dob = "";
    this.country = "";
    this.ssn = "";
    this.operator = "";
    this.billdate = "";
    this.otpbtn = true;
    this.managerotpbtn = true;
    this.refundbill = true;
    this.approvalsend = true;
    this.printbill = true;
    this.printrefund = true;
    this.resendbill = true;
    this.consumableprint = true;
    this.phptracksheet = true;
    this.opprescription = true;
    this.doxperprint = true;
    this.clearbtn = true;
    this.dmsbtn = true;
    this.visithistorybtn = true;
    this.billexist = true;
    this.billdetailservice.clear();
    // this.ngOnInit();
  }
  doxperredirect() {
    let iacode = this.BServiceForm.value.maxid.split(".")[0];
    this.doxperurl =
      this.patientbilldetaillist.billDetialsForRefund_ConfigValueToken[1]
        .configValue +
      "patient_id=" +
      this.BServiceForm.value.maxid +
      "&visit_id=" +
      this.patientbilldetaillist.billDetialsForRefund_ServiceDetail[0].visitid +
      "&organisation=" +
      iacode +
      "&token=" +
      this.patientbilldetaillist.billDetialsForRefund_ConfigValueToken[1].token;
    window.open(this.doxperurl, "_blank");
  }
  printrefunddialog()
  {
    const printrefunddialog = this.matDialog.open(PrintRefundReceiptDialogComponent, {
      width: "35vw",
      height: "35vh"
    })
  }
  resendbilldialog()
  {
    const printrefunddialog = this.matDialog.open(ResendBillEmailDialogComponent, {
      width: "35vw",
      height: "40vh"
    })
  }
  reportprint(name: any)
  {
    this.openReportModal(name);
  }
  openReportModal(btnname: string) {
    if(btnname == 'PHPTracksheet')
    {
      this.reportService.openWindow(btnname, btnname, {
        BillNo: this.BServiceForm.value.billNo,
      });
    }
  else if(btnname == 'billingreport')
    {
      this.reportService.openWindow(btnname, btnname, {
        opbillid: this.patientbilldetaillist.billDetialsForRefund_Table1[0].opBillID,
        locationID: this.cookie.get('HSPLocationId')
      });
    }
    
  }
  ngDoCheck(): void {
    const changes = this.check.diff(this.billdetailservice.sendforapproval);
    if (changes) {
      console.log(this.billdetailservice.totalrefund);
      console.log(this.billdetailservice.sendforapproval);
      var approvedlist;
      // this.billdetailservice.patientbilldetaillist.billDetialsForRefund_RequestNoGeivePaymentModeRefund.forEach((i: any) => {
      //   console.log(i);
        this.billdetailservice.patientbilldetaillist.billDetialsForRefund_RequestNoGeivePaymentModeRefund.forEach((j: any) => {
          console.log(j);
          approvedlist = this.billdetailservice.sendforapproval.filter( (e: any) => {
            return e.itemId = j.itemId;
          })
        // })
      })
      console.log(approvedlist);
      console.log(changes);
      this.BServiceForm.controls["refundAmt"].setValue(
        this.billdetailservice.totalrefund.toFixed(2)
      );
      // if (this.billdetailservice.sendforapproval.length > 0) {
      //   this.approvalsend = false;
      // } else if (this.billdetailservice.sendforapproval.length == 0) {
      //   this.approvalsend = true;
      // }
    }
  }
}
