import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { CookieService } from "@shared/services/cookie.service";
import { HttpService } from "@shared/services/http.service";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { Subject, takeUntil } from "rxjs";
import { GstComponent } from "../gst/gst.component";
import { ApiConstants } from "@core/constants/ApiConstants";
import { MiscMasterDataModel } from "@core/types/miscMasterDataModel.Interface";
import { objMiscBillingConfigurationList } from "@core/types/miscMasterDataModel.Interface";
import { objMiscBillingRemarksList } from "@core/types/miscMasterDataModel.Interface";
import { objMiscDoctorsList } from "@core/types/miscMasterDataModel.Interface";
import { ServiceTypeItemModel } from "@core/types/billingServiceItemModel.Interface";
import { TarrifPriceModel } from "@core/types/triffPriceModel.Interface";

@Component({
  selector: "out-patients-bill-detail",
  templateUrl: "./bill-detail.component.html",
  styleUrls: ["./bill-detail.component.scss"],
})
export class BillDetailComponent implements OnInit {
  doctorList!: objMiscDoctorsList[];
  // serviceList!: objMiscBillingConfigurationList;
  remarkList!: objMiscBillingRemarksList[];
  serviceItemsList!: ServiceTypeItemModel[];
  serviceList!: { title: string; value: number }[];
  constructor(
    public matDialog: MatDialog,
    private formService: QuestionControlService,
    private router: Router,
    private http: HttpService,
    private cookie: CookieService
  ) {}

  miscBillData = {
    type: "object",
    title: "",
    properties: {
      serviceType: {
        type: "autocomplete",
        title: "Service Type",
        options: this.serviceList,
        required: true,
      },
      item: {
        type: "autocomplete",
        title: "Item",
        required: true,
        options: this.serviceItemsList,
      },
      tffPrice: {
        type: "number",
        title: "Tarrif Price",
        required: true,
        readonly: true,
      },
      qty: {
        type: "number",
        title: "Qty",
        maximum: 9,
        minimum: 1,
        required: true,
      },
      reqAmt: {
        type: "number",
        title: "Req. Amt.",
        minimum: 1,
        required: true,
      },
      pDoc: {
        type: "autocomplete",
        title: "Procedure Doctor",
        options: this.doctorList,
      },
      remark: {
        type: "autocomplete",
        title: "Remarks",
        required: true,
        options: this.remarkList,
      },
      self: {
        type: "checkbox",
        required: false,
        options: [{ title: "Self" }],
      },
      referralDoctor: {
        type: "dropdown",
        required: true,
        title: "Referral Doctor",
      },
      interactionDetails: {
        type: "dropdown",
        required: true,
        title: "Interaction Details",
      },
      billAmt: {
        type: "number",
        required: false,
        defaultValue: "0.00",
        readonly: true,
      },
      availDiscCheck: {
        type: "checkbox",
        required: false,
        options: [{ title: "Avail Plan Disc ( - )" }],
      },
      availDisc: {
        type: "number",
        required: false,
        defaultValue: "0.00",
        readonly: true,
      },
      discAmtCheck: {
        type: "checkbox",
        required: false,
        options: [{ title: " Discount  Amount  (  -  ) " }],
      },
      discAmt: {
        type: "number",
        required: false,
        defaultValue: "0.00",
        readonly: true,
      },
      dipositAmtcheck: {
        type: "checkbox",
        required: false,
        options: [{ title: "Deposit Amount ( - )" }],
      },

      dipositAmt: {
        type: "number",
        required: false,
        defaultValue: "0.00",
        readonly: false,
      },
      patientDisc: {
        type: "number",
        required: false,
        defaultValue: "0.00",
        readonly: true,
      },
      compDisc: {
        type: "number",
        required: false,
        defaultValue: "0.00",
        readonly: true,
      },
      planAmt: {
        type: "number",
        required: false,
        defaultValue: "0.00",
        readonly: true,
      },
      coupon: {
        type: "number",
        required: false,
        defaultValue: "0.00",
        readonly: true,
      },
      coPay: {
        type: "number",
        required: false,
        defaultValue: "0.00",
        readonly: true,
      },
      credLimit: {
        type: "number",
        required: false,
        defaultValue: "0.00",
        readonly: true,
      },
      gstTax: {
        type: "number",
        required: false,
        defaultValue: "0.00",
        readonly: true,
      },
      amtPayByPatient: {
        type: "number",
        required: false,
        defaultValue: "0.00",
        readonly: true,
      },
      amtPayByComp: {
        type: "number",
        required: false,
        defaultValue: "0.00",
        readonly: true,
      },
      paymentMode: {
        type: "radio",
        required: true,
        options: [
          { title: "Cash", value: "cash" },
          { title: "Credit", value: "credit" },
        ],
        defaultValue: "cash",
      },
    },
  };

  config: any = {
    selectBox: false,
    clickedRows: false,
    clickSelection: "single",
    displayedColumns: [
      "Sno",
      "ServiceType",
      "ItemDescription",
      "ItemforModify",
      "TariffPrice",
      "Qty",
      "Price",
      "DoctorName",
      "Disc",
      "DiscAmount",
      "TotalAmount",
      "GST",
    ],
    columnsInfo: {
      Sno: {
        title: "S.No.",
        type: "number",
      },
      ServiceType: {
        title: "Service Type",
        type: "string",
        style: {
          width: "120px",
        },
      },
      ItemDescription: {
        title: "Item Description",
        type: "string",
        style: {
          width: "180px",
        },
      },
      ItemforModify: {
        title: "Item For Modify",
        type: "string",
        style: {
          width: "120px",
        },
      },
      TariffPrice: {
        title: "Tariff Price",
        type: "number",
        style: {
          width: "90px",
        },
      },
      Qty: {
        title: "Qty",
        type: "string",
      },
      Price: {
        title: "Price",
        type: "string",
      },
      DoctorName: {
        title: "Doctor Name",
        type: "string",
        style: {
          width: "120px",
        },
      },
      Disc: {
        title: "Disc%",
        type: "string",
      },
      DiscAmount: {
        title: "Disc. Amount",
        type: "string",
        style: {
          width: "120px",
        },
      },
      TotalAmount: {
        title: "Total Amount",
        type: "string",
        style: {
          width: "120px",
        },
      },
      GST: {
        title: "GST%",
        type: "string",
      },
    },
  };

  serviceselectedList: any[] = [];

  miscServBillForm!: FormGroup;
  serviceID!: number;
  location!: number;
  questions: any;
  private readonly _destroying$ = new Subject<void>();

  ngOnInit(): void {
    let serviceFormResult = this.formService.createForm(
      this.miscBillData.properties,
      {}
    );

    this.miscServBillForm = serviceFormResult.form;
    this.questions = serviceFormResult.questions;
  }
  count!: number;
  TotalAmount!: number;
  clearDraftedService() {
    this.miscServBillForm.controls["item"].setValue({
      title: "",
      value: 0,
    });
    this.miscServBillForm.controls["qty"].setValue("");
    this.miscServBillForm.controls["tffPrice"].setValue("");
    this.miscServBillForm.controls["pDoc"].setValue({
      title: "",
      value: 0,
    });
    this.miscServBillForm.controls["remark"].setValue({
      title: "",
      value: 0,
    });

    this.miscServBillForm.controls["reqAmt"].setValue("");
  }
  addService() {
    this.count = this.serviceselectedList.length + 1;
    let ServiceType = this.serviceName;
    let present = false;
    this.serviceselectedList.forEach((element) => {
      if (ServiceType == element.ServiceType) {
        present = true;
        console.log("same service");
      }
    });
    if (!present) {
      this.pushDataToServiceTable();
      this.serviceselectedList = [...this.serviceselectedList];
    }

    this.calculateTotalAmount();
    this.clearSelectedService();
  }
  pushDataToServiceTable() {
    this.serviceselectedList.push({
      Sno: this.count,
      ServiceType: this.serviceName,
      ItemDescription: this.miscServBillForm.value.item.title,
      ItemforModify: this.miscServBillForm.value.item.title,
      TariffPrice: this.miscServBillForm.value.tffPrice,
      Qty: this.miscServBillForm.value.qty,
      Price: this.miscServBillForm.value.tffPrice,
      DoctorName: this.miscServBillForm.value.pDoc.title,
      Disc: 1,
      DiscAmount: 1,
      TotalAmount:
        this.miscServBillForm.value.tffPrice * this.miscServBillForm.value.qty,
      GST: 0,
    });
  }
  clearSelectedService() {
    this.miscServBillForm.controls["serviceType"].setValue({
      title: "",
      value: 0,
    });
  }

  calculateTotalAmount() {
    this.TotalAmount = 0;
    this.serviceselectedList.forEach((element) => {
      this.TotalAmount += element.TotalAmount;
    });
    this.miscServBillForm.controls["billAmt"].setValue(this.TotalAmount);
  }
  ngAfterViewInit(): void {
    this.formEvents();
  }

  formEvents() {
    this.getMasterMiscDetail();

    this.miscServBillForm.controls["serviceType"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value: any) => {
        console.log(value);
        if (value.value) {
          this.serviceID = value.value;
          this.serviceName = value.title;
        }
        this.setServiceItemList();
      });
    // this.questions[0].elementRef.addEventListener(
    //   "change",
    //   this.setServiceItemList.bind(this)
    // );
    this.questions[1].elementRef.addEventListener(
      "blur",
      this.getTarrifPrice.bind(this)
    );
  }

  gst: { service: string; percentage: number; value: number }[] = [
    { service: "CGST", percentage: 0.0, value: 0.0 },
    { service: "SGST", percentage: 0.0, value: 0.0 },
    { service: "UTGST", percentage: 0.0, value: 0.0 },
    { service: "IGST", percentage: 0.0, value: 0.0 },
    { service: "CESS", percentage: 0.0, value: 0.0 },
    { service: "TOTAL TAX", percentage: 0.0, value: 0.0 },
  ];
  openGSTDialog() {
    this.matDialog.open(GstComponent, {
      width: "24vw",
      height: "56vh",

      data: {
        gstDetails: this.gst,
      },
    });
  }
  serviceName!: string;
  setServiceItemList() {
    console.log("setServiceItemList");

    this.clearDraftedService();
    console.log(this.miscServBillForm.value.serviceType.title);
    if (this.miscServBillForm.value.serviceType) {
      this.serviceID = this.miscServBillForm.value.serviceType.value;
      this.serviceName = this.miscServBillForm.value.serviceType.title;
      this.location = Number(this.cookie.get("HSPLocationId"));
      this.getServiceItemBySerivceID();
    }
  }
  miscMasterDataList!: MiscMasterDataModel;

  getMasterMiscDetail() {
    this.http
      .get(ApiConstants.getMasterMiscDetail)
      .pipe(takeUntil(this._destroying$))
      .subscribe((data) => {
        console.log(data);
        this.miscMasterDataList = data as MiscMasterDataModel;
        this.questions[0].options =
          this.miscMasterDataList.objMiscBillingConfigurationList.map((a) => {
            return { title: a.name, value: a.serviceid };
          });
        this.questions[5].options =
          this.miscMasterDataList.objMiscDoctorsList.map((a) => {
            return { title: a.name, value: a.id };
          });
        this.questions[6].options =
          this.miscMasterDataList.objMiscBillingRemarksList.map((a) => {
            return { title: a.name, value: a.id };
          });
      });
  }

  getServiceItemBySerivceID() {
    this.http
      .get(
        ApiConstants.getServiceitemsByServiceID(this.serviceID, this.location)
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe((data) => {
        console.log(data);
        this.serviceItemsList = data as ServiceTypeItemModel[];
        this.questions[1].options = this.serviceItemsList.map((a) => {
          return { title: a.itemname, value: a.itemId };
        });
      });
  }

  itemID!: number;
  terrifDetail!: TarrifPriceModel;
  getTarrifPrice() {
    if (this.miscServBillForm.value.item.value) {
      this.http
        .get(
          ApiConstants.getTarrifByServiceID(
            1,
            this.miscServBillForm.value.item.value,
            this.serviceID,
            Number(this.cookie.get("HSPLocationId"))
          )
        )
        .pipe(takeUntil(this._destroying$))
        .subscribe((data) => {
          console.log(data);
          this.terrifDetail = data as TarrifPriceModel;
          this.miscServBillForm.controls["tffPrice"].setValue(
            this.terrifDetail.amount
          );
        });
    }
  }
  filterList(list: any[], control: any): any {
    // this.genderList.filter(
    //   (g) => g.id === this.OPRegForm.controls[control"].value
    // )[0].name;
    list.filter(function (item) {
      return item.name === control.value;
    });
  }
}
