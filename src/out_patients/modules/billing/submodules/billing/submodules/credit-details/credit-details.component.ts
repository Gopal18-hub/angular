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

@Component({
  selector: "out-patients-credit-details",
  templateUrl: "./credit-details.component.html",
  styleUrls: ["./credit-details.component.scss"],
})
export class CreditDetailsComponent implements OnInit {
  comapnyFormData = {
    title: "",
    type: "object",
    properties: {
      company: {
        type: "dropdown",
        title: "",
        placeholder: "-Select-",
        emptySelect: true,
      },
      corporate: {
        type: "dropdown",
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

  private readonly _destroying$ = new Subject<void>();
  companyList!: GetCompanyDataInterface[];
  coorporateList: { id: number; name: string }[] = [] as any;
  today: any;

  constructor(private formService: QuestionControlService,
    private http: HttpService, public matDialog: MatDialog,
    public cookie: CookieService,
    private datepipe: DatePipe,) {}

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
    this.getAllCompany();
    this.getAllCorporate();
  }

  getAllCompany() {
    this.http
      .get(
        BillingApiConstants.getcompanydetail(
          Number(this.cookie.get("HSPLocationId"))
        )
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe((data: GetCompanyDataInterface[]) => {
        console.log(data);
        this.companyList = data;
        this.companyQuestions[0].options = data.map((a: any) => {
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
        this.companyQuestions[1].options = this.coorporateList.map((l) => {
          return { title: l.name, value: l.id };
        });
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

  ngAfterViewInit(){
    this.comapnyFormGroup.controls["company"].valueChanges.subscribe(
      (company) => {
        if (company != null || company != 0 ) {
        let iomcompany = this.companyList.filter((iom) => iom.id == company);        
        this.iommessage =   "IOM Validity till : " + this.datepipe.transform(iomcompany[0].iomValidity, "dd-MMM-yyyy");
        }

      });
  }

  openconfiguration(){
    this.matDialog.open(ConfigurationBillingComponent, {
      width: "70%",
      height: "80%",
      data: {
        company: this.comapnyFormGroup.value.company,
      },
    });
  }
}
