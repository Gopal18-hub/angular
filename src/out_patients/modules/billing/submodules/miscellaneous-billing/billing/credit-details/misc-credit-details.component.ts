import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { HttpService } from "@shared/services/http.service";
import { ApiConstants } from "@core/constants/ApiConstants";
import { BillingApiConstants } from "@modules/billing/submodules/billing/BillingApiConstant";
import { Subject, takeUntil } from "rxjs";
import { DatePipe } from "@angular/common";
import { GetCompanyDataInterface } from "@core/types/employeesponsor/getCompanydata.Interface";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { IomPopupComponent } from "@modules/billing/submodules/billing/prompts/iom-popup/iom-popup.component";
import { CookieService } from "@shared/services/cookie.service";

import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";
import { distinctUntilChanged } from "rxjs/operators";
import { BillingService } from "@modules/billing/submodules/billing/billing.service";
import { ConfigurationBillingComponent } from "@modules/billing/submodules/billing/prompts/configuration-billing/configuration-billing.component";
import { MiscService } from "../../MiscService.service";
import { IomCompanyBillingComponent } from "@modules/billing/submodules/billing/prompts/iom-company-billing/iom-company-billing.component";


@Component({
  selector: 'out-patients-misc-credit-details',
  templateUrl: './misc-credit-details.component.html',
  styleUrls: ['./misc-credit-details.component.scss']
})
export class MiscCreditDetailsComponent implements OnInit {
  private readonly _destroying$ = new Subject<void>();
  companyList!: GetCompanyDataInterface[];
  coorporateList: { id: number; name: string }[] = [] as any;
  today: any;
  company!: string;

  comapnyFormData = {
    title: "",
    type: "object",
    properties: {
      company: {
        type: "autocomplete",
        title: "",
        placeholder: "-Select-",
        emptySelect: true,
      },
      corporate: {
        type: "autocomplete",
        title: "Corporate",
        placeholder: "-Select-",
        emptySelect: true,
      },
      companyGSTN: {
        type: "dropdown",
        title: "Company GSTN",
        placeholder: "-Select-",
        emptySelect: true,
      },
      letterDate: {
        type: "date",
        title: "Letter Date",
      },
      issuedBy: {
        type: "string",
        title: "Issued By",
      },
      employeeNo: {
        type: "string",
        title: "Employee No.",
      },
      companyName: {
        type: "string",
        title: "Company Name",
      },
      tokenNo: {
        type: "string",
        title: "Token No.",
      },
      companyAddress: {
        type: "string",
        title: "Company Address",
      },
    },
  };

  generalFormData = {
    title: "",
    type: "object",
    properties: {
      employeeName: {
        type: "dropdown",
        title: "Employee Name",
        placeholder: "-Select-",
      },
      designation: {
        type: "string",
        title: "Designation",
      },
      reasonForAllowingCredit: {
        type: "textarea",
        title: "Reason for Allowing Credit",
      },
      notes: {
        title: "Notes",
        type: "textarea",
      },
    },
  };

  comapnyFormGroup!: FormGroup;
  generalFormGroup!: FormGroup;
  companyQuestions: any;
  generalQuestions: any;
  iommessage: string = "";
  companyexists: boolean = false;

  constructor(
    private formService: QuestionControlService,
    private http: HttpService,
    public matDialog: MatDialog,
    public cookie: CookieService,
    private datepipe: DatePipe,
    public billingservice: BillingService,
    private dialogService: MessageDialogService,
    private Miscservice: MiscService,

  ) { }

  ngOnInit(): void {
    this.today = new Date();
    let formResult: any = this.formService.createForm(
      this.comapnyFormData.properties,
      {}
    );
    this.comapnyFormGroup = formResult.form;
    this.companyQuestions = formResult.questions;

    let formResult1: any = this.formService.createForm(
      this.generalFormData.properties,
      {}
    );
    this.generalFormGroup = formResult1.form;
    this.generalQuestions = formResult1.questions;
    this.comapnyFormGroup.controls["letterDate"].setValue(this.today);
    this.comapnyFormGroup.controls["corporate"].disable();

    this.getAllCompany();
    this.getAllCorporate();
    let miscBillType = this.Miscservice.getBillType();
    if (miscBillType != 2) {
      this.disableCredit();
    }

    // this.billingservice.companyChangeEvent.subscribe((res: any) => {
    //   this.getAllCompany();
    //   if (res.from != "credit") {
    //     this.comapnyFormGroup.controls["company"].setValue(res.company, {
    //       emitEvent: false,
    //     });
    //   }
    // });

    //Enable Coroarte
    let TPA;
    this.comapnyFormGroup.controls["company"].valueChanges.subscribe(
      (res: any) => {
        let miscBillType = this.Miscservice.getBillType();
        let miscServiceitemsConfig = this.Miscservice.getServiceItemsList();
        //console.log(miscBillType)
        if (miscBillType != 3) {
          this.disableCredit();
          this.dialogService.error("Select credit check first");
        }
        // else if (miscServiceitemsConfig.length == 0) {
        //   this.dialogService.error("There is no items for configuration");
        // }
        else {
          this.enableCredit()
          if (res != null && res != 0 && res != undefined) {
            this.companyname = res;
            this.companyexists = true;
            let iomcompany = this.companyList.filter((iom) => iom.id == res);
            this.iommessage = "IOM Validity till : " + this.datepipe.transform(iomcompany[0].iomValidity, "dd-MMM-yyyy");
            TPA = iomcompany[0].isTPA;
            if (TPA == 1) {
              const iomcompanycorporate = this.matDialog.open(IomCompanyBillingComponent, {
                width: "25%",
                height: "28%",
              });

              iomcompanycorporate.afterClosed()
                .pipe(takeUntil(this._destroying$))
                .subscribe((result) => {
                  if (result.data == "corporate") {
                    this.comapnyFormGroup.controls["corporate"].enable();
                    this.comapnyFormGroup.controls["corporate"].setValue(0);
                  }
                  else {

                    this.comapnyFormGroup.controls["corporate"].setValue(0);
                    this.comapnyFormGroup.controls["corporate"].disable();
                  }
                });
            } else {
              this.comapnyFormGroup.controls["corporate"].setValue(0);
              this.comapnyFormGroup.controls["corporate"].disable();
            }
          }
          else {
            this.companyexists = false;
          }
        }




      });
  }

  getAllCompany() {


    //cHck conditions for Credit

    //MiscBilling
    let miscBillType = this.Miscservice.getBillType();
    let miscServiceitemsConfig = this.Miscservice.getServiceItemsList();
    console.log(miscBillType)
    if (miscBillType != 3) {
      this.dialogService.error("Select credit check first");
    }
    else if (miscServiceitemsConfig.length == 0) {
      this.dialogService.error("There is no items for configuration");
    }
    else {
      // this.matDialog.open(ConfigurationBillingComponent, {
      //   width: "70%",
      //   height: "80%",
      //   data: {
      //     serviceconfiguration: miscServiceitemsConfig,
      //     patientdetails: this.billingservice.getPatientDetails(),
      //     companyname: this.companyname
      //   },
      // });
      let location = 67;
      //let location = Number(this.cookie.get("HSPLocationId"));
      this.http
        .get(BillingApiConstants.getcompanydetail(location))
        .pipe(takeUntil(this._destroying$))
        .subscribe((data: GetCompanyDataInterface[]) => {
          //console.log(data);
          this.companyList = this.Miscservice.companyList;
          console.log(this.companyList, "CL")
          this.companyQuestions[0].options = this.companyList.map((a: any) => {
            return { title: a.name, value: a.id, company: a };
          });
          this.companyQuestions[0] = { ...this.companyQuestions[0] };
        });
    }



  }


  getAllCorporate() {
    this.http
      .get(ApiConstants.getCorporate)
      .pipe(takeUntil(this._destroying$))
      .subscribe((resultData: { id: number; name: string }[]) => {
        this.coorporateList = resultData;
        this.companyQuestions[1].options = this.coorporateList.map((l) => {
          return { title: l.name, value: l.id };
        });
        this.companyQuestions[1] = { ...this.companyQuestions[1] };
      });
  }

  openIOM() {
    this.matDialog.open(IomPopupComponent, {
      width: "70%",
      height: "50%",
      data: {
        company: this.comapnyFormGroup.value.company,
      },
    });
  }

  disableCredit() {
    this.comapnyFormGroup.controls["company"].disable();
  }
  enableCredit() {
    this.comapnyFormGroup.controls["company"].enable();
  }

  companyname: string | undefined;
  ngAfterViewInit() {
    let TPA;
    this.comapnyFormGroup.controls["company"].valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((res: any) => {
        if (res.value != null && res.value != 0 && res.value != undefined) {
          this.companyname = res.value;
          this.companyexists = true;
          this.billingservice.setCompnay(
            res.value,
            res,
            this.comapnyFormGroup,
            "credit"
          );
        } else {
          this.companyexists = false;
        }
      });
  }

  openconfiguration() {

    let billtype;
    billtype = this.billingservice.getbilltype();
    let configurationitems: any = this.billingservice.getconfigurationservice();
    if (billtype != "credit") {
      this.dialogService.error("Select credit check first");
    } else if (configurationitems.length == 0) {
      this.dialogService.error("There is no items for configuration");
    } else {
      this.matDialog.open(ConfigurationBillingComponent, {
        width: "70%",
        height: "80%",
        data: {
          serviceconfiguration: configurationitems,
          patientdetails: this.billingservice.getPatientDetails(),
          companyname: this.companyname,
        },
      });
    }
  }
}

