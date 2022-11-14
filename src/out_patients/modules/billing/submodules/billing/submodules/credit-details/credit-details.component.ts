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
import { ConfigurationBillingComponent } from "../../prompts/configuration-billing/configuration-billing.component";
import { IomCompanyBillingComponent } from "../../prompts/iom-company-billing/iom-company-billing.component";
import { BillingService } from "../../billing.service";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";
import { distinctUntilChanged } from "rxjs/operators";

@Component({
  selector: "out-patients-credit-details",
  templateUrl: "./credit-details.component.html",
  styleUrls: ["./credit-details.component.scss"],
})
export class CreditDetailsComponent implements OnInit {
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
      },
      corporate: {
        type: "autocomplete",
        title: "Corporate",
        placeholder: "--Select--",
        emptySelect: true,
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
      b2bInvoice: {
        type: "checkbox",
        options: [{ title: "B2B Invoice" }],
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

  constructor(
    private formService: QuestionControlService,
    private http: HttpService,
    public matDialog: MatDialog,
    public cookie: CookieService,
    private datepipe: DatePipe,
    public billingservice: BillingService,
    private dialogService: MessageDialogService
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
    this.billingservice.companyChangeEvent.subscribe((res: any) => {
      console.log(res);
      if (res.from != "credit") {
        this.companyexists = true;
        this.companyname = res.company != null ? res.company.title : "";
        this.getAllCompany();
        this.comapnyFormGroup.controls["company"].setValue(res.company, {
          emitEvent: false,
        });
      }
    });

    this.billingservice.corporateChangeEvent.subscribe((res: any) => {
      if (res.from != "credit") {
        this.corporateexists = true;
        this.getAllCorporate();
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
    this.billingservice.clearAllItems.subscribe((clearItems) => {
      if (clearItems) {
        this.comapnyFormGroup.reset();
        this.generalFormGroup.reset();
      }
    });
  }

  getAllCompany() {
    this.companyList = this.billingservice.companyData;
    console.log(this.companyQuestions[0].options);
    this.companyQuestions[0].options = this.companyList.map((a: any) => {
      return { title: a.name, value: a.id, company: a };
    });
    let selectedcompany = this.billingservice.selectedcompanydetails;
    if (!this.companyexists && selectedcompany && selectedcompany.value) {
      this.comapnyFormGroup.controls["company"].setValue(
        this.billingservice.selectedcompanydetails
      );
      this.companyexists = true;
    }

    this.companyQuestions[0] = { ...this.companyQuestions[0] };
  }

  getAllCorporate() {
    this.coorporateList = this.billingservice.corporateData;
    this.companyQuestions[1].options = this.coorporateList.map((l) => {
      return { title: l.name, value: l.id };
    });
    let selectedcorporate = this.billingservice.selectedcorporatedetails;
    if (
      !this.corporateexists &&
      selectedcorporate != null &&
      selectedcorporate.title
    ) {
      this.comapnyFormGroup.controls["corporate"].setValue(selectedcorporate);
      this.comapnyFormGroup.controls["corporate"].enable();
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

  companyname: string | undefined;
  ngAfterViewInit() {
    let TPA;
    this.comapnyFormGroup.controls["company"].valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((res: any) => {
        if (res != "" && res != null) {
          if (res.value != null && res.value != 0 && res.value != undefined) {
            var comarr = this.companyList.filter((i) => {
              return i.id == res.value;
            });
            this.companyname = comarr[0].name;
            this.companyexists = true;
            this.billingservice.setCompnay(
              res.value,
              res,
              this.comapnyFormGroup,
              "credit"
            );
          }
        } else {
          this.companyexists = false;
          this.billingservice.setCompnay(
            res,
            res,
            this.comapnyFormGroup,
            "credit"
          );
        }
      });

    this.comapnyFormGroup.controls["corporate"].valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((res: any) => {
        if (res != "" && res != null) {
          if (res.value != null && res.value != 0 && res.value != undefined) {
            this.corporateexists = true;
            this.billingservice.setCorporate(
              res.value,
              res,
              this.comapnyFormGroup,
              "credit"
            );
          }
        } else {
          this.corporateexists = false;
          this.billingservice.setCorporate(
            res,
            res,
            this.comapnyFormGroup,
            "credit"
          );
        }
      });
    this.generalFormGroup.controls["b2bInvoice"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((res: any) => {
        if (res) {
          this.billingservice.makeBillPayload.invoiceType = "B2B";
        } else {
          this.billingservice.makeBillPayload.invoiceType = "B2C";
        }
      });
  }

  openconfiguration() {
    let billtype;
    billtype = this.billingservice.billtype;
    let configurationitems: any = this.billingservice.billItems;
    if (billtype != 3) {
      this.dialogService.error("Select credit check first");
    } else if (configurationitems.length == 0) {
      this.dialogService.error("There is no items for configuration");
    } else if (!this.comapnyFormGroup.value.company.title) {
      this.dialogService.error("Select the Company");
    } else {
      this.matDialog.open(ConfigurationBillingComponent, {
        width: "70%",
        height: "80%",
        data: {
          serviceconfiguration: configurationitems,
          patientdetails: this.billingservice.patientDetailsInfo,
          companyname: this.comapnyFormGroup.value.company.title,
          creditLimit: this.billingservice.creditLimit,
        },
      });
    }
  }
}
