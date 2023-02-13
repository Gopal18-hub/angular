import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { QuestionControlService } from "@shared/v2/ui/dynamic-forms/service/question-control.service";
import { EPOrderStaticConstants } from "../../../../../core/constants/ep-order-static-constant";
import { EPOrderService } from "../../../../../core/services/ep-order.service";
import { CookieService } from "@shared/v2/services/cookie.service";
import { searchFormModel } from "../../../../../core/models/ep-order-searchform.Model";
import { Subject } from "rxjs";
import { DatePipe } from "@angular/common";

@Component({
  selector: "op-pharmacy-ep-order-search-form",
  templateUrl: "./search-form.component.html",
  styleUrls: ["./search-form.component.scss"],
})
export class OpPharmacyEPOrderSearchFormComponent implements OnInit, OnDestroy {
  private readonly _destroying$ = new Subject<void>();
  searchForm: any;
  searchFormData = EPOrderStaticConstants.searchForm;
  searchFormGroup!: FormGroup;
  today: any;

  constructor(
    private formService: QuestionControlService,
    public EPOrderService: EPOrderService,
    private cookie: CookieService,
    public datepipe: DatePipe
  ) {}

  ngOnInit(): void {
    let searchFormResult: any = this.formService.createForm(
      this.searchFormData.properties,
      {}
    );
    this.searchFormGroup = searchFormResult.form;
    this.searchForm = searchFormResult.questions;

    this.setDefaultValue();
    this.searchFormSubmit();
    this.EPOrderService.clearAll.subscribe((clearItems: any) => {
      if (clearItems) {
        this.clear();
      }
    });
  }
  clear(): void {
    this.searchFormGroup.reset();
    this.setDefaultValue();
  }
  todayTemp: any;
  setDefaultValue(): void {
    this.today = new Date();
    this.searchFormGroup.controls["fromDate"].setValue(this.today);
    this.searchFormGroup.controls["toDate"].setValue(this.today);
    this.searchFormGroup.controls["type"].setValue(
      this.searchFormData.properties.type.defaultValue
    );
    this.searchFormGroup.controls["orderStatus"].setValue(
      this.searchFormData.properties.orderStatus.defaultValue
    );

    this.searchForm[3].minimum =
      this.searchFormGroup.controls["fromDate"].value;
    this.searchForm[2].maximum = this.searchFormGroup.controls["toDate"].value;
    this.searchForm[3].maximum = this.today;

    if (this.searchFormGroup.controls["type"].value == "maxid") {
      this.searchFormGroup.controls["value"].setValue(
        this.cookie.get("LocationIACode") + "."
      );
    }
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

  ngAfterViewInit(): void {
    this.searchFormGroup.controls["fromDate"].valueChanges.subscribe(
      (value) => {
        this.searchForm[3].minimum = value;
      }
    );
    this.searchFormGroup.controls["toDate"].valueChanges.subscribe((value) => {
      this.searchForm[2].maximum = value;
    });
    this.searchFormGroup.controls["type"].valueChanges.subscribe((value) => {
      if (value == "") {
        this.searchFormGroup.controls["type"].setValue(
          this.searchFormData.properties.type.defaultValue
        );
      }

      if (value == "maxid") {
        this.searchFormGroup.controls["value"].setValue(
          this.cookie.get("LocationIACode") + "."
        );
      } else {
        this.searchFormGroup.controls["value"].setValue("");
      }
    });

    this.searchFormGroup.controls["orderStatus"].valueChanges.subscribe(
      (value) => {
        if (value == "") {
          this.searchFormGroup.controls["orderStatus"].setValue(
            this.searchFormData.properties.orderStatus.defaultValue
          );
        }
      }
    );
  }

  searchFormSubmit() {
    this.EPOrderService.searchFormData = this.searchFormDetailsRequestBody();
    this.EPOrderService.getEPOrderSearchData(
      this.EPOrderService.searchFormData
    );
    //this.EPOrderService.searchFormData = this.searchFormGroup.controls;
    //this.EPOrderService.updateFormData.next(true);
  }

  searchFormDetailsRequestBody(): string {
    let re =
      "/" +
      this.datepipe.transform(
        this.searchFormGroup.controls["fromDate"].value,
        "yyyy-MM-dd"
      ) +
      "/" +
      this.datepipe.transform(
        this.searchFormGroup.controls["toDate"].value,
        "yyyy-MM-dd"
      ) +
      "/" +
      Number(this.cookie.get("HSPLocationId"));

    let istype = this.searchFormGroup.controls["type"].value
      ? String(this.searchFormGroup.controls["type"].value.trim())
      : "";
    let isvvalue = this.searchFormGroup.controls["value"].value
      ? String(
          this.searchFormGroup.controls["value"].value.trim()
        ).toUpperCase()
      : "";
    let orderStatus = this.searchFormGroup.controls["orderStatus"].value
      ? String(
          this.searchFormGroup.controls["orderStatus"].value.trim()
        ).toUpperCase()
      : "";
    re = re + "/?";
    if (istype && istype != "" && isvvalue && isvvalue != "") {
      if (istype === "maxid") {
        if (isvvalue.toString().split(".")[1]) {
          re = re + "&registrationNo=" + isvvalue.toString().split(".")[1];
          re = re + "&iacode=" + isvvalue.toString().split(".")[0];
        }
      } else if (istype === "mobile") {
        re = re + "&PhoneNumber=" + isvvalue;
      } else if (istype === "name") {
        re = re + "&PtnName=" + isvvalue;
      } else if (istype === "doctor") {
        re = re + "&DocName=" + isvvalue;
      }
    }

    if (orderStatus && orderStatus != "" && orderStatus != "ALL") {
      re = re + "&Status=" + orderStatus;
    }
    return re;
  }
}
