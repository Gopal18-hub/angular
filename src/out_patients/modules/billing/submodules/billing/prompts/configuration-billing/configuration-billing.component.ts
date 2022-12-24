import {
  Component,
  OnInit,
  Inject,
  AfterViewInit,
  ViewChild,
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { CalculateBillService } from "@core/services/calculate-bill.service";
import { BillingService } from "../../billing.service";

@Component({
  selector: "out-patients-configuration-billing",
  templateUrl: "./configuration-billing.component.html",
  styleUrls: ["./configuration-billing.component.scss"],
})
export class ConfigurationBillingComponent implements OnInit {
  constructor(
    private formService: QuestionControlService,
    public matDialog: MatDialog,
    private dialogRef: MatDialogRef<ConfigurationBillingComponent>,
    public messageDialogService: MessageDialogService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      serviceconfiguration: any;
      patientdetails: any;
      companyname: string;
      creditLimit: string;
    },
    private calculateBillService: CalculateBillService,
    private billingService: BillingService
  ) {}
  questions: any;
  Configurationbilling!: FormGroup;
  companyservice: any = [];
  patientservice: any = [];
  tableselectionexists: boolean = false;
  companyselectedservice: any = [];

  private readonly _destroying$ = new Subject<void>();
  @ViewChild("companybillingtable") companybillingtable: any;

  companybillingconfig: any = {
    clickedRows: true,
    clickSelection: "multiple",
    selectBox: true,
    displayedColumns: ["itemName", "serviceName"],
    columnsInfo: {
      itemName: {
        title: "Item Name",
        type: "string",
        style: {
          width: "25rem",
        },
      },
      serviceName: {
        title: "Service Name",
        type: "string",
        style: {
          width: "10rem",
        },
      },
    },
  };
  patientbillingconfig: any = {
    selectBox: false,
    displayedColumns: ["itemName", "serviceName"],
    columnsInfo: {
      itemName: {
        title: "Item Name",
        type: "string",
        style: {
          width: "25rem",
        },
      },
      serviceName: {
        title: "Service Name",
        type: "string",
        style: {
          width: "10rem",
        },
      },
    },
  };
  patientname: string | undefined;
  maxid: string | undefined;
  companyname: string | undefined;
  tpa: string | undefined;
  creditLimit: string | undefined;

  ngOnInit(): void {
    this.companyservice = this.data.serviceconfiguration;
    if (this.calculateBillService.companyNonCreditItems.length > 0) {
      this.patientservice = this.calculateBillService.companyNonCreditItems;
    }
    this.maxid =
      this.data.patientdetails.iacode +
      "." +
      this.data.patientdetails.registrationno;
    this.companyname = this.data.companyname;
    this.patientname =
      this.data.patientdetails.firstname +
      " " +
      this.data.patientdetails.lastname;
    this.creditLimit = this.data.creditLimit;
  }

  clearconfiguration() {
    this.companyservice = [];
    this.patientservice = [];
    this.calculateBillService.companyNonCreditItems = [];
    this.maxid = "";
    this.patientname = "";
    this.companyname = "";
    this.tpa = "";
    this.creditLimit = "";
  }
  saveconfiguration() {
    const saveDialogRef = this.messageDialogService.confirm(
      "",
      `Do you want to Save Services Configuration!`
    );
    saveDialogRef.afterClosed().subscribe((value) => {
      if (value && value.type == "yes") {
        this.calculateBillService.setCompanyNonCreditItems(
          this.companybillingtable.selection.selected
        );
        /////GAV-1474
        this.billingService.resetDiscount();
        this.dialogRef.close();
      }
    });
  }

  ngAfterViewInit() {
    this.companybillingtable.selection.changed
      .pipe(takeUntil(this._destroying$))
      .subscribe((res: any) => {
        if (this.companybillingtable.selection.selected.length > 0) {
          this.tableselectionexists = true;
          this.companyselectedservice.push(res.added);
        } else {
          this.tableselectionexists = false;
        }
      });
  }
}
