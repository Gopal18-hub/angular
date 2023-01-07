import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { ApiConstants } from "@core/constants/ApiConstants";
import { HttpService } from "@shared/services/http.service";
import { CookieService } from "@shared/services/cookie.service";
import { MiscService } from "@modules/billing/submodules/miscellaneous-billing/MiscService.service";
import { ReportService } from "@shared/services/report.service";
import { MaxHealthSnackBarService } from "@shared/ui/snack-bar";
import { async, Subject, takeUntil } from "rxjs";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { StaffDeptDialogComponent } from "@modules/billing/submodules/miscellaneous-billing/billing/staff-dept-dialog/staff-dept-dialog.component";

@Component({
  selector: "out-patients-discount-amt-dialog",
  templateUrl: "./discount-amt-dialog.component.html",
  styleUrls: ["./discount-amt-dialog.component.scss"],
})
export class DiscountAmtDialogComponent implements OnInit {
  discountRows: any[] = [];
  discountAmtSelected = 0;

  billData: any = [];
  discAmtForm!: FormGroup;
  count = 0;
  disc = 0;
  discAmount = 0;
  question: any;
  mainHeadList: { id: number; name: number }[] = [] as any;
  authorisedBy: { id: number; name: number }[] = [] as any;
  discReasonList: { id: number; name: string; discountPer: number }[] =
    [] as any;
  typeID: number = 0;
  typeName: string = "";
  headID: number = 0;
  headName: string = "";
  reasonID: number = 0;
  reasonName: string = "";
  discPercenatge: number = 0;
  location = Number(this.cookie.get("HSPLocationId"));
  //ocation = 67;
  discountPopupData = [];
  private readonly _destroying$ = new Subject<void>();
  constructor(
    private formService: QuestionControlService,
    private http: HttpService,
    private cookie: CookieService,
    private miscPatient: MiscService,
    private reportService: ReportService,
    private snackbar: MaxHealthSnackBarService,
    public matDialog: MatDialog,
    private dialogRef: MatDialogRef<DiscountAmtDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.discAmtFormData.properties,
      {}
    );
    this.discAmtForm = formResult.form;
    this.question = formResult.questions;

    this.checkdiscountamountforparticularautharisation();
    this.http
      .get(ApiConstants.getbilldiscountreasonmainhead(this.location))
      .pipe(takeUntil(this._destroying$))
      .subscribe((data) => {
        this.mainHeadList = data;
        this.question[1].options = this.mainHeadList.map((a) => {
          return { title: a.name, value: a.id };
        });
      });
    this.http
      .get(ApiConstants.getbilldiscountreason(this.location))
      .pipe(takeUntil(this._destroying$))
      .subscribe((data) => {
        this.discReasonList = data;

        this.question[2].options = this.discReasonList.map((a) => {
          return { title: a.name, value: a.id, discountPer: a.discountPer };
          this.discPercenatge = a.discountPer;
        });
      });
    this.http
      .get(ApiConstants.getauthorisedby(this.location))
      .pipe(takeUntil(this._destroying$))
      .subscribe((data) => {
        this.authorisedBy = data;
        this.question[5].options = this.authorisedBy.map((a) => {
          return { title: a.name, value: a.id };
        });
      });
  }
  selectedAuthorise: any;
  discAmtFormData = {
    title: "",
    type: "object",
    properties: {
      types: {
        type: "dropdown",
        title: "Discount Types",
        options: [
          { title: "On Bill", value: "On Bill" },
          { title: "On Service", value: "On Service" },
          { title: "On Items", value: "On Item" },
        ],
        placeholder: "Select",
        //readonly: true,
      },
      head: {
        type: "autocomplete",
        title: "Main Head Discount",
        placeholder: "Select",
        //readonly: true,
      },
      reason: {
        type: "autocomplete",
        title: "Discount reason",
        placeholder: "Select",
        //readonly: true,
      },
      percentage: {
        type: "string",
        title: "Disc%",
        defaultValue: "0.00",
        //readonly: true,
      },
      amt: {
        type: "string",
        title: "Dis. Amt",
        defaultValue: "0.00",
        //readonly: true,
      },
      authorise: {
        type: "dropdown",
        title: "Authorised By",
        placeholder: "Select",
        //readonly: true,
      },
      coupon: {
        type: "string",
        title: "Coupon Code",
        //readonly: true,
      },
      empCode: {
        type: "string",
        title: "Employee Code",
        //readonly: true,
      },
    },
  };
  discAmtFormConfig: any = {
    actionItems: false,
    //dateformat: 'dd/MM/yyyy',
    selectBox: false,
    displayedColumns: [
      "sno",
      "discType",
      "service",
      "doctor",
      "price",
      "disc",
      "discAmt",
      "totalAmt",
      "head",
      "reason",
      "value",
    ],
    clickedRows: true,
    clickSelection: "single",
    columnsInfo: {
      sno: {
        title: "S.No",
        type: "string",
        style: {
          width: "1%",
        },
      },
      discType: {
        title: "Discount Type",
        type: "string",
        style: {
          width: "1%",
        },
      },
      service: {
        title: "Service Name",
        type: "string",
        style: {
          width: "1%",
        },
      },
      doctor: {
        title: "Item/Doctor Name",
        type: "string",
        style: {
          width: "1%",
        },
      },
      price: {
        title: "Price",
        type: "string",
        style: {
          width: "1%",
        },
      },
      disc: {
        title: "Disc%",
        type: "string",
        style: {
          width: "1%",
        },
      },
      discAmt: {
        title: "Dis. Amount",
        type: "string",
        style: {
          width: "1%",
        },
      },
      totalAmt: {
        title: "Total Amount",
        type: "string",
        style: {
          width: "1%",
        },
      },
      head: {
        title: "Main Head Discount",
        type: "string",
        style: {
          width: "1%",
        },
      },
      reason: {
        title: "Discount Reason",
        type: "string",
        style: {
          width: "1%",
        },
      },
      value: {
        title: "Value Based",
        type: "string",
        style: {
          width: "1%",
        },
      },
    },
  };
  discAmtData: any = [
    // { services: "CGST", percentage: '0.00', value: '0.00' },
    // { services: "SGST", percentage: '0.00', value: '0.00' },
    // { services: "UTGST", percentage: '0.00', value: '0.00' },
    // { services: "IGST", percentage: '0.00', value: '0.00' },
    // { services: "CESS", percentage: '0.00', value: '0.00' },
    // { services: "TOTAL TAX", percentage: '0.00', value: '0.00' }
  ];
  listRowClick(e: any) {
    this.discountAmtSelected = e.row.discAmt;
  }

  ngAfterViewInit(): void {
    this.discAmtForm.controls["types"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value: any) => {
        //console.log(value);
        if (value.value) {
          this.typeID = value.value;
          this.typeName = value.title;
        }
      });

    this.discAmtForm.controls["head"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value: any) => {
        //console.log(value);
        if (value.value) {
          this.headID = value.value;
          this.headName = value.title;
        }
        //this.setServiceItemList();
      });

    this.discAmtForm.controls["reason"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value: any) => {
        this.disc = value.discountPer;
        //console.log(value);
        if (value.value) {
          this.reasonID = value.value;
          this.reasonName = value.title;
          this.discAmtForm.controls["percentage"].setValue(this.disc);
          let billAMt = this.data.data;
          this.discAmount = Number((this.disc / 100) * billAMt);
          this.discAmtForm.controls["amt"].setValue(this.discAmount);
          if (this.reasonName.includes("Staff")) {
            this.employeeCode();
          }
        }
      });

    this.discAmtForm.controls["amt"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value: any) => {
        console.log(value);
        this.billData = this.miscPatient.cacheServitem;
        console.log(this.billData, "BD");
      });

    this.discAmtForm.controls["authorise"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value: any) => {
        //this.selectedAuthorise = value;
        this.selectedAuthorise.totalDiscount = value;
        this.miscPatient.setCalculateBillItems(this.selectedAuthorise);
      });

    // this.question[7].elementRef.addEventListener("keypress", (event: any) => {
    //   if (event.key === "Enter") { this.employeeCode }
    // })
  }
  clear() {
    this.count = this.discountRows.length + 1;
    console.log("Enter" + this.count);
    this.addDiscountRow();
    this.discountRows = [...this.discountRows];
  }
  checkdiscountamountforparticularautharisation() {
    this.http
      .get(
        // (
        //   ApiConstants.checkdiscountamountforparticularautharisation(89,
        //     67, 4000
        //   )
        ApiConstants.checkdiscountamountforparticularautharisation(
          this.discAmtForm.value.authorise.value,
          this.location,
          this.discAmount
        )
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe((data) => {
        console.log(data, "author");
      });
  }
  addDiscountRow() {
    this.pushTable();

    this.discAmtForm.reset();
  }
  pushTable() {
    this.discountRows.push({
      sno: this.count,
      discType: this.discAmtForm.value.types,
      service: this.billData[0].ServiceType,
      doctor: this.billData[0].ItemDescription,
      price: this.billData[0].Price,
      disc: this.disc,
      discAmt: this.discAmount,
      totalAmt: this.data.data,
      head: this.discAmtForm.value.head.title,
      reason: this.discAmtForm.value.reason.title,
      value: this.disc,
    });
  }

  applyDiscount() {
    this.dialogRef.close({ data: this.discAmount });
  }

  employeeCode() {
    // this.matDialog.open(StaffDeptDialogComponent, {
    //   width: '55vw', height: '80vh', data: {

    //   },
    // });
    const dialogref = this.matDialog.open(StaffDeptDialogComponent, {
      width: "55vw",
      height: "80vh",
      data: {
        //  data: this.billAmnt
      },
    });

    dialogref.afterClosed().subscribe((res) => {
      this.discAmtForm.controls["empCode"].setValue(res.data);
      this.dialogRef.close({ data: this.selectedAuthorise });
    });
  }
}
