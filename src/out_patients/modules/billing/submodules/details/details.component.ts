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
import { DMSrefreshModel } from "@core/models/DMSrefresh.Model";
import { DMSComponent } from "@modules/registration/submodules/dms/dms.component";
import { OpPrescriptionDialogComponent } from './op-prescription-dialog/op-prescription-dialog.component'
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
        defaultValue: "0.00",
        readonly: true,
      },
      dipositrAmt: {
        type: "string",
        required: false,
        defaultValue: "0.00",
        readonly: true,
      },
      discAmt: {
        type: "string",
        required: false,
        defaultValue: "0.00",
        readonly: true,
      },
      discAftBill: {
        type: "string",
        required: false,
        defaultValue: "0.00",
        readonly: true,
      },
      refundAmt: {
        type: "string",
        required: false,
        defaultValue: "0.00",
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
    this.BServiceForm.controls['paymentMode'].disable();
    this.questions[6].minimum = this.BServiceForm.controls['fromDate'].value;
    this.getrefundreason();
    this.paymentmode = this.billdetailservice.paymentmode;
    this.questions[14].options = this.paymentmode.map((l: any) => {
      return { title: l.title, value: l.title };
    });
    
    this.BServiceForm.controls['paymentMode'].setValue(this.paymentmode[0].title);
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
        if(res[0].successFlag == true)
        {
          this.msgdialog.success(res[0].returnMessage);
        }
        else
        {
          this.msgdialog.info(res[0].returnMessage);
        }
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
        if(this.BServiceForm.value.maxid == this.cookie.get("LocationIACode") + ".")
        {
          this.snackbar.open('Invalid Max ID');
        }
        else if(this.BServiceForm.value.maxid == '')
        {
          this.snackbar.open('Invalid Max ID');
        }
        else
        { 
          this.search();
        }
        
      }
    });
    this.questions[2].elementRef.addEventListener("keypress", (event: any) => {
      if (event.key === "Enter") {
        event.preventDefault();
        console.log("event triggered");
        if(this.BServiceForm.value.mobileno.toString().length < 10)
        {
          this.snackbar.open('Invalid Mobile No');
        }
        else
        {
          this.search();
        }
        
      }
    });
  }

  getPatientIcon() {
    let iacode = this.BServiceForm.value.maxid.split(".")[0];
    let regNumber = this.BServiceForm.value.maxid.split(".")[1];
    this.http
      .get(ApiConstants.getregisteredpatientdetailsForBilling(iacode, regNumber, Number(this.cookie.get("HSPLocationId"))))
      .pipe(takeUntil(this._destroying$))
      .subscribe(
        (resultData: Registrationdetails) => {
          console.log(resultData);
          // this.clear();
          this.patientDetails = resultData;
          console.log(this.patientDetails)
          // this.patientDetailsforicon = this.patientDetails.dsPersonalDetails.dtPersonalDetails1;
          // this.categoryIcons = this.patientService.getCategoryIconsForPatient(
          //   this.patientDetailsforicon
          // );
        },
        (error) => {}
      );
  }

  getpatientbilldetails() {
    this.billdetailservice.clear();
    this.BServiceForm.controls['refundAmt'].setValue('0.00');
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
            this.questions[0].readonly = true;
            this.questions[1].readonly = true;
            this.questions[2].readonly = true;
            this.patientbilldetaillist = resultdata as getPatientPersonalandBillDetails;
            this.patientbilldetaillist.billDetialsForRefund_ServiceDetail.forEach(item => {
              item.amount = item.amount.toFixed(2);
              item.discountamount = item.discountamount.toFixed(2);
              item.planAmount = item.planAmount.toFixed(2);
            })
            console.log(this.patientbilldetaillist)
            this.billdetailservice.patientbilldetaillist = resultdata;
            console.log(this.patientbilldetaillist.billDetialsForRefund_Table0);
            var printrefundflag = 0;
            this.patientbilldetaillist.billDetialsForRefund_ServiceDetail.forEach(k => {
              if(k.cancelled == 1)
              {
                printrefundflag++;
              }
            })
            if(printrefundflag > 0)
            {
              this.printrefund = false;
            }
            else{
              this.printrefund = true;
            }
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
                // this.BServiceForm.controls['authBy'].enable();
                // this.BServiceForm.controls['reason'].enable();
                // this.BServiceForm.controls['paymentMode'].enable();
              }
              else
              {
                this.BServiceForm.controls['authBy'].disable();
                this.BServiceForm.controls['reason'].disable();
                this.BServiceForm.controls['paymentMode'].disable();
              }
              var healthlist = 0;
              var consultlist = 0; 
              var consumablelist = 0; 
              this.patientbilldetaillist.billDetialsForRefund_ServiceDetail.forEach( (item: any) => {
                console.log(item);
                if(item.servicename == 'Health Checkups')
                {
                  console.log('health')
                  healthlist++;
                }
                else if(item.servicename == 'Consultations')
                {
                  console.log('consultation')
                  consultlist++;
                }
                else if(item.servicename == "Consumable")
                {
                  console.log('consumable')
                  consumablelist++;
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
              if(consumablelist > 0)
              {
                this.consumableprint = false;
              }
              else
              {
                this.consumableprint = true;
              }
              if(consultlist > 0)
              {
                this.doxperprint = false;
              }
              else{
                this.doxperprint = true;
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
    this.BServiceForm.markAsDirty();
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
        .billDetialsForRefund_DepositRefundAmountDetail[0].billamount.toFixed(2)
    );
    this.BServiceForm.controls["dipositrAmt"].setValue(
      this.patientbilldetaillist
        .billDetialsForRefund_DepositRefundAmountDetail[0].depositamount.toFixed(2)
    );
    this.BServiceForm.controls["discAmt"].setValue(
      this.patientbilldetaillist
        .billDetialsForRefund_DepositRefundAmountDetail[0].discountamount.toFixed(2)
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
  dms() {
    console.log(this.patientDetails)
    const patientDetails =
      this.patientDetails.dsPersonalDetails.dtPersonalDetails1[0];
    this.http
      .get(
        ApiConstants.PatientDMSDetail(
          patientDetails.iacode,
          patientDetails.registrationno
        )
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe((resultData: DMSrefreshModel[]) => {
        this.matDialog.open(DMSComponent, {
          width: "100vw",
          maxWidth: "90vw",
          height: '90vh',
          data: {
            list: resultData,
            maxid: patientDetails.iacode + "." + patientDetails.registrationno,
            firstName: patientDetails.firstname,
            lastName: patientDetails.lastname,
          },
        });
        // this.dmsProcessing = false;
      });
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
      if (res) {
        this.BServiceForm.controls["billNo"].setValue(res);
        this.billno = this.BServiceForm.controls["billNo"].value;
        console.log(this.BServiceForm.controls["billNo"].value)
        this.getpatientbilldetails();
      } else {
        // console.log('res')
        // this.clear();
      }
    });
    this.BServiceForm.markAsDirty();
  }
  refunddialog()
  { 
    console.log(this.patientbilldetaillist.billDetialsForRefund_Table0[0].age.split(' ')[0]);
    if(this.patientbilldetaillist.billDetialsForRefund_Table0[0].age.split(' ')[0] > '65')
    {
      var dialogref = this.msgdialog.info('Patient is Senior Citizen.');
      dialogref.afterClosed()
      .subscribe(res => {
        this.refunddialogopen();
      })
    }
    else
    {
      this.refunddialogopen();
    }
  }
  refunddialogopen()
  {
    var reas = this.refundreasonlist.filter(i => {
      return i.id == this.BServiceForm.controls['reason'].value;
    });
    console.log(this.BServiceForm.value.paymentMode);
      const RefundDialog = this.matDialog.open(BillDetailsRefundDialogComponent, {
      panelClass: 'refund-bill-dialog',
      width: "70vw",
      height: "98vh",
      data: {  
        patientinfo: {
          emailId: this.patientbilldetaillist.billDetialsForRefund_Table0[0].emailId, 
          mobileno: this.patientbilldetaillist.billDetialsForRefund_Table0[0].pcellno,
        },  
        refundamount: this.BServiceForm.value.refundAmt,
        authby: this.BServiceForm.controls['authBy'].value,
        reasonname: reas[0].name,
        reasonid: reas[0].id,
        mop: this.BServiceForm.controls['paymentMode'].value,
        mobile: this.patientbilldetaillist.billDetialsForRefund_Table0[0].pcellno,
        billid: this.patientbilldetaillist.billDetialsForRefund_Table1[0].opBillID,
        billno: this.BServiceForm.value.billNo,
        maxid: this.patientbilldetaillist.billDetialsForRefund_Table0[0].uhid,
        email: this.patientbilldetaillist.billDetialsForRefund_Table0[0].emailId
      }
    });
    RefundDialog.afterClosed()
    .pipe(takeUntil(this._destroying$))
    .subscribe((result) => {
      //if(result == "Success"){        
        console.log(result);
        if(result == 'success')
        {
          var billno = this.BServiceForm.controls['billNo'].value;
          this.clear();
          this.billdetailservice.clear();
          this.BServiceForm.controls['billNo'].setValue(billno);
          this.getpatientbilldetails();
        }
      //}    
    });
  }
  clear() {
    this.BServiceForm.reset();
    this.questions[0].readonly = false;
    this.questions[1].readonly = false;
    this.questions[2].readonly = false;
    this.BServiceForm.controls['paymentMode'].setValue(this.paymentmode[0].title);
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
    console.log(this.patientbilldetaillist.billDetialsForRefund_ConfigValueToken);
    console.log(this.BServiceForm.controls['maxid'].value);
    var maxid = this.BServiceForm.controls['maxid'].value;
    var visitid = this.patientbilldetaillist.billDetialsForRefund_ServiceDetail[0].id;
    var token = this.patientbilldetaillist.billDetialsForRefund_ConfigValueToken[0].token;
    var config = this.patientbilldetaillist.billDetialsForRefund_ConfigValueToken[0].configValue.split('?')[0];
    var iacode = maxid.split(".")[0];
    var location = this.cookie.get('Location').split('%');
    console.log(location[0].split(' ')[0])
    this.doxperurl = config+'?patient_id='+maxid+'&visit_id='+visitid+'&organisation='+location[0].split(' ')[0]+'&token='+token;
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
    else if(btnname == 'ConsumabaleEntryDetailsReport')
    {
      this.reportService.openWindow(btnname, btnname, {
        billno: this.BServiceForm.value.billNo,
        locationID: this.cookie.get('HSPLocationId'),
        MAXID: this.BServiceForm.value.maxid
      });
    }
    else if(btnname == 'PrintOPPrescriptionReport')
    {
      const dialogref = this.matDialog.open(OpPrescriptionDialogComponent, {
        width: '30vw',
        height: '35vh'
      })
      dialogref.afterClosed().subscribe( res => {
        console.log(res);
        if(res == 'yes')
        {
          this.reportService.openWindow(btnname, btnname, {
          opbillid: this.patientbilldetaillist.billDetialsForRefund_Table1[0].opBillID,
          locationID: this.cookie.get('HSPLocationId'),
          });
        }
      })
      
    }
    
  }
  ngDoCheck(): void {
    const changes = this.check.diff(this.billdetailservice.sendforapproval);
    if (changes) {
      console.log(this.billdetailservice.totalrefund);
      console.log(this.billdetailservice.sendforapproval);
      var approvedlist;
      if(this.billdetailservice.totalrefund > 0 &&
        this.patientbilldetaillist.billDetialsForRefund_RequestNoGeivePaymentModeRefund[0].authorisedby == '' &&
        this.patientbilldetaillist.billDetialsForRefund_RequestNoGeivePaymentModeRefund[0].reason == '' &&
        this.patientbilldetaillist.billDetialsForRefund_RequestNoGeivePaymentModeRefund[0].paymentMode == '' 
      )
      {
        this.BServiceForm.controls['authBy'].enable();
        this.BServiceForm.controls['reason'].enable();
        this.BServiceForm.controls['paymentMode'].enable();
      }
      else if(this.billdetailservice.totalrefund == 0 &&
        this.patientbilldetaillist.billDetialsForRefund_RequestNoGeivePaymentModeRefund[0].authorisedby == '' &&
        this.patientbilldetaillist.billDetialsForRefund_RequestNoGeivePaymentModeRefund[0].reason == '' &&
        this.patientbilldetaillist.billDetialsForRefund_RequestNoGeivePaymentModeRefund[0].paymentMode == '' 
      )
      {
        this.BServiceForm.controls['authBy'].disable();
        this.BServiceForm.controls['reason'].disable();
        this.BServiceForm.controls['paymentMode'].disable();
        this.BServiceForm.controls['authBy'].setValue('');
        this.BServiceForm.controls['reason'].setValue('');
        this.BServiceForm.controls['paymentMode'].setValue(this.paymentmode[0].title);
      }
      var forenablerefundbill: any;
      if(this.billdetailservice.sendforapproval.length > 0)
      {
        this.billdetailservice.sendforapproval.forEach((j: any) => {
          console.log(j);
          forenablerefundbill = this.patientbilldetaillist.billDetialsForRefund_RequestNoGeivePaymentModeRefund.filter(k => {
            return k.itemId == j.itemid;
          })
        })
        
        console.log(forenablerefundbill);
  
        forenablerefundbill.forEach((k: any) => {
          if(k.notApproved == 1 && this.patientbilldetaillist.billDetialsForRefund_Cancelled[0].cancelled == 0)
          {
            this.refundbill = false;
            this.approvalsend = true;
          }
          else if(k.notApproved == 0 && this.patientbilldetaillist.billDetialsForRefund_Cancelled[0].cancelled == 0)
          {
            this.refundbill = true;
            this.approvalsend = false;
          }
        })
      }
      else
      {
        this.refundbill = true;
      }
      
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
      this.sendapprovalcheck();
      // if (this.billdetailservice.sendforapproval.length > 0) {
      //   this.approvalsend = false;
      // } else if (this.billdetailservice.sendforapproval.length == 0) {
      //   this.approvalsend = true;
      // }
    }
  }
}
