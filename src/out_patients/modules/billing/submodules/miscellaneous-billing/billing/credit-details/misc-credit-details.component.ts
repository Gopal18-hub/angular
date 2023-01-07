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
  selector: "out-patients-misc-credit-details",
  templateUrl: "./misc-credit-details.component.html",
  styleUrls: ["./misc-credit-details.component.scss"],
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
        placeholder: "--Select--",
        emptySelect: true,
        options: this.companyList,
      },
      corporate: {
        type: "autocomplete",
        title: "Corporate",
        placeholder: "--Select--",
        emptySelect: true,
        options: this.coorporateList,
      },
      companyGSTN: {
        type: "dropdown",
        title: "Company GSTN",
        placeholder: "--Select--",
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

  comapnyFormGroup!: FormGroup;
  generalFormGroup!: FormGroup;
  companyQuestions: any;
  generalQuestions: any;
  iommessage: string = "";
  companyexists: boolean = false;
  corporateexists: boolean = false;
  setItemsToBill: any = [];
  cacheCreditTabdata: any = {};

  constructor(
    private formService: QuestionControlService,
    private http: HttpService,
    public matDialog: MatDialog,
    public cookie: CookieService,
    private datepipe: DatePipe,
    public billingservice: BillingService,
    private dialogService: MessageDialogService,
    public Miscservice: MiscService
  ) {}

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

    // if (this.Miscservice.cacheCreditTabdata.creditCompany) {
    //   this.comapnyFormGroup.controls["company"].setValue(
    //     this.Miscservice.cacheCreditTabdata.creditCompany
    //   );
    // }
    // if (this.Miscservice.cacheCreditTabdata.creditCorporate) {
    //   this.comapnyFormGroup.controls["corporate"].setValue(
    //     this.Miscservice.cacheCreditTabdata.creditCorporate
    //   );
    // }
    // this.Miscservice.companyChangeMiscEvent.subscribe((res: any) => {
    //   if (res.companyIdComp != "MiscCredit") {
    //     if (res.companyId) {
    //       this.cacheCreditTabdata.creditCompany = res.companyId;
    //       this.Miscservice.cacheCreditTab(this.cacheCreditTabdata);
    //       this.comapnyFormGroup.controls["company"].setValue(res.companyId, {
    //         emitEvent: false,
    //       });
    //     }

    //     if (res.corporateId && this.isChannel === 1) {
    //       this.cacheCreditTabdata.creditCorporate = res.corporateId;
    //       this.Miscservice.cacheCreditTab(this.cacheCreditTabdata);
    //       this.comapnyFormGroup.controls["corporate"].setValue(
    //         res.corporateId,
    //         {
    //           emitEvent: false,
    //         }
    //       );
    //     }
    //   }
    // });
    let calcBill0 = this.Miscservice.calculateBill();
    if (calcBill0.b2bInvoiceType == "B2B") {
      this.generalFormGroup.controls["b2bInvoiceType"].setValue(true, {
        emitEvent: true,
      });
    } else if (calcBill0.b2bInvoiceType == "B2C") {
      this.generalFormGroup.controls["b2bInvoiceType"].setValue(false, {
        emitEvent: true,
      });
    }
    this.Miscservice.misccompanyChangeEvent.subscribe((res: any) => {
      if (res.from != "credit") {
        this.companyexists = true;
        this.getAllCompany();
        this.cacheCreditTabdata.creditCompany = res.company;
        this.Miscservice.cacheCreditTab(this.cacheCreditTabdata);
        this.comapnyFormGroup.controls["company"].setValue(res.company, {
          emitEvent: false,
        });
      }
    });

    this.Miscservice.misccorporateChangeEvent.subscribe((res: any) => {
      if (res.from != "credit") {
        this.corporateexists = true;
        this.getAllCorporate();
        this.cacheCreditTabdata.creditCorporate = res.corporate;
        this.Miscservice.cacheCreditTab(this.cacheCreditTabdata);
        this.comapnyFormGroup.controls["corporate"].setValue(res.corporate, {
          emitEvent: false,
        });
        if (res.from == "disable") {
          this.comapnyFormGroup.controls["corporate"].disable();
        } else if (this.comapnyFormGroup.value.company) {
          this.comapnyFormGroup.controls["corporate"].enable();
        }
      }
    });
    this.Miscservice.clearAllItems.subscribe((clearItems) => {
      if (clearItems) {
        this.comapnyFormGroup.reset();
        this.generalFormGroup.reset();
      }
    });
  }

  ngAfterViewInit() {
    let TPA;

    this.generalFormGroup.controls["b2bInvoiceType"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value: any) => {
        if (value === true) {
          this.setItemsToBill.b2bInvoiceType = "B2B";
        } else {
          this.setItemsToBill.b2bInvoiceType = "B2C";
        }
        this.Miscservice.setCalculateBillItems(this.setItemsToBill);
        this.Miscservice.calculateBill();
        //this.Misc.setPatientDetail(this.patientDetail);
      });

    this.comapnyFormGroup.controls["company"].valueChanges.subscribe(
      (res: any) => {
        if (res != "" && res != null) {
          if (res.value != null && res.value != 0 && res.value != undefined) {
            this.setItemsToBill.companyId = res;
            this.setItemsToBill.companyIdComp = "credit";
            this.cacheCreditTabdata.creditCompany = res;
            this.Miscservice.cacheCreditTab(this.cacheCreditTabdata);
            this.Miscservice.setCalculateBillItems(this.setItemsToBill);
            this.companyname = res.value;
            this.companyexists = true;
            this.Miscservice.setCompnay(
              res.value,
              res,
              this.comapnyFormGroup,
              "credit"
            );
          }
        } else {
          this.companyexists = false;
          this.Miscservice.setCompnay(
            res,
            res,
            this.comapnyFormGroup,
            "credit"
          );
        }

        // if (res != null && res != 0 && res != undefined) {
        //   this.companyname = res;
        //   this.companyexists = true;
        //   let iomcompany = this.companyList.filter(
        //     (iom) => iom.id == res.value
        //   );
        //   this.iommessage =
        //     "IOM Validity till : " +
        //     this.datepipe.transform(iomcompany[0].iomValidity, "dd-MMM-yyyy");
        //   TPA = iomcompany[0].isTPA;
        //   if (TPA == 1) {
        //     const iomcompanycorporate = this.matDialog.open(
        //       IomCompanyBillingComponent,
        //       {
        //         width: "25%",
        //         height: "28%",
        //       }
        //     );

        //     iomcompanycorporate
        //       .afterClosed()
        //       .pipe(takeUntil(this._destroying$))
        //       .subscribe((result) => {
        //         if (result.data == "corporate") {
        //           this.isChannel = 1;
        //           this.setItemsToBill.isChannel = this.isChannel;
        //           this.Miscservice.setCalculateBillItems(this.setItemsToBill);
        //           this.comapnyFormGroup.controls["corporate"].enable();
        //           this.comapnyFormGroup.controls["corporate"].setValue(0);
        //         } else {
        //           this.isChannel = 0;
        //           this.setItemsToBill.isChannel = this.isChannel;
        //           this.Miscservice.setCalculateBillItems(this.setItemsToBill);
        //           this.comapnyFormGroup.controls["corporate"].setValue(0);
        //           this.comapnyFormGroup.controls["corporate"].disable();
        //         }
        //       });
        //   } else {
        //     this.comapnyFormGroup.controls["corporate"].setValue(0);
        //     this.comapnyFormGroup.controls["corporate"].disable();
        //   }
        // }
      }
    );

    this.comapnyFormGroup.controls["corporate"].valueChanges.subscribe(
      (res: any) => {
        if (res != "" && res != null) {
          if (res.value != null && res.value != 0 && res.value != undefined) {
            this.setItemsToBill.corporateId = res;
            this.setItemsToBill.companyIdComp = "credit";
            this.Miscservice.setCalculateBillItems(this.setItemsToBill);
            this.cacheCreditTabdata.creditCorporate = res.corporateId;
            this.Miscservice.cacheCreditTab(this.cacheCreditTabdata);

            this.corporateexists = true;
            this.Miscservice.setCorporate(
              res.value,
              res,
              this.comapnyFormGroup,
              "credit"
            );
          }
        } else {
          this.corporateexists = false;
          this.Miscservice.setCorporate(
            res,
            res,
            this.comapnyFormGroup,
            "credit"
          );
        }
      }
    );
  }

  getAllCompany() {
    // let miscBillType = this.Miscservice.getBillType();
    //let miscServiceitemsConfig = this.Miscservice.cacheServitem;
    // if (miscBillType != 3) {
    // this.disableCredit();
    //  this.dialogService.error("Select credit check first");
    // } else
    // if (miscServiceitemsConfig.length == 0) {
    //   this.disableCredit();
    //   this.dialogService.error("There is no items for configuration");
    // } else
    // {
    // let location = 67;
    // let location: number = Number(this.cookie.get("HSPLocationId"));
    // this.enableCredit();
    // this.http
    //   .get(BillingApiConstants.getcompanydetail(location))
    //   .pipe(takeUntil(this._destroying$))
    //   .subscribe((data: GetCompanyDataInterface[]) => {
    //     this.companyList = data;
    //     this.companyQuestions[0].options = this.companyList.map((a: any) => {
    //       return { title: a.name, value: a.id, company: a };
    //     });
    //     this.companyQuestions[0] = { ...this.companyQuestions[0] };
    //   });
    this.companyList = this.Miscservice.companyData;
    this.companyQuestions[0].options = this.companyList.map((a: any) => {
      return { title: a.name, value: a.id, company: a };
    });
    let selectedcompany = this.Miscservice.selectedcompanydetails;
    if (!this.companyexists && selectedcompany) {
      this.comapnyFormGroup.controls["company"].setValue(selectedcompany);
      this.Miscservice.cacheCreditTabdata.creditCompany = selectedcompany;
    }
    this.companyexists = true;
    this.companyQuestions[0] = { ...this.companyQuestions[0] };
    // }
  }

  getAllCorporate() {
    this.coorporateList = this.Miscservice.corporateData;
    this.companyQuestions[1].options = this.coorporateList.map((l) => {
      return { title: l.name, value: l.id };
    });
    let selectedcorporate = this.Miscservice.selectedcorporatedetails;
    if (
      !this.corporateexists &&
      selectedcorporate != null &&
      selectedcorporate.title
    ) {
      this.comapnyFormGroup.controls["corporate"].setValue(selectedcorporate);
      this.comapnyFormGroup.controls["corporate"].enable();
      this.Miscservice.cacheCreditTabdata.creditCorporate = selectedcorporate;
    } else if (this.billingservice.disablecorporatedropdown) {
      this.comapnyFormGroup.controls["corporate"].enable();
    }
    this.companyQuestions[1] = { ...this.companyQuestions[1] };
  }

  openIOM() {
    this.matDialog.open(IomPopupComponent, {
      width: "70%",
      height: "90%",
      data: {
        company: this.comapnyFormGroup.value.company.value,
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
  openmiscconfiguration() {
    let miscBillType = this.Miscservice.getBillType();
    let miscServiceitemsConfig = this.Miscservice.cacheServitem;
    if (miscBillType != 3) {
      //this.disableCredit();
      this.dialogService.error("Select credit check first");
    } else if (miscServiceitemsConfig.length == 0) {
      //  this.disableCredit();
      this.dialogService.error("There is no items for configuration");
    } else if (!this.comapnyFormGroup.value.company.title) {
      this.dialogService.error("Select the Company");
    } else {
      this.matDialog.open(ConfigurationBillingComponent, {
        width: "70%",
        height: "80%",
        data: {
          serviceconfiguration: miscServiceitemsConfig,
          patientdetails: this.Miscservice.patientDetail,
          companyname: this.comapnyFormGroup.value.company.title,
          creditLimit: this.Miscservice.creditLimit,
        },
      });
    }
  }
}
