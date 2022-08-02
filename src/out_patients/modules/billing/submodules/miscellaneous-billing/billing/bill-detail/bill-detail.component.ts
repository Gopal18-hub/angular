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
        type: "string",
        title: "Tarrif Price",
        required: true,
      },
      qty: {
        type: "string",
        title: "Qty",
        maximum: 9,
        minimum: 1,
        required: true,
      },
      reqAmt: {
        type: "string",
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
        type: "string",
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
        type: "string",
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

  serviceselectedList!: any[];

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

  addService() {
    this.serviceselectedList.push({
      Sno: 0,
      ServiceType: "eee",
      ItemDescription: "weee",
      ItemforModify: "dndj",
      TariffPrice: 1,
      Qty: 1,
      Price: 1,
      DoctorName: "abc",
      Disc: 1,
      DiscAmount: 1,
      TotalAmount: 1,
      GST: 0,
    });
  }
  // .elementRef.addEventListener(
  //   "blur",
  //   this.setServiceItemList.bind(this)
  // );
  ngAfterViewInit(): void {
    this.formEvents();
  }

  formEvents() {
    this.getMasterMiscDetail();

    // this.miscServBillForm.controls["serviceType"].statusChanges
    //   .pipe(takeUntil(this._destroying$))
    //   .subscribe((value: any) => {
    //     this.setServiceItemList();
    //   });
    this.questions[0].elementRef.addEventListener(
      "blur",
      this.setServiceItemList.bind(this)
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
}
