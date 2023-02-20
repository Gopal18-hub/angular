import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { QuestionControlService } from "@shared/v2/ui/dynamic-forms/service/question-control.service";
import { OnlineOrderStaticConstants } from "../../../../../core/constants/online-order-static-constant";
import { OnlineOrderService } from "../../../../../core/services/online-order.service";
import { CookieService } from "@shared/v2/services/cookie.service";
import { Subject } from "rxjs";
import { DatePipe } from "@angular/common";
import { SnackBarService } from "@shared/v2/ui/snack-bar/snack-bar.service";

@Component({
  selector: "op-pharmacy-online-order-search-form",
  templateUrl: "./search-form.component.html",
  styleUrls: ["./search-form.component.scss"],
})
export class OpPharmacyOnlineOrderSearchFormComponent
  implements OnInit, OnDestroy
{
  private readonly _destroying$ = new Subject<void>();
  searchForm: any;
  searchFormData = OnlineOrderStaticConstants.searchForm;
  searchFormGroup!: FormGroup;
  today: any;

  constructor(
    private formService: QuestionControlService,
    public OnlineOrderService: OnlineOrderService,
    private cookie: CookieService,
    public snackbarService: SnackBarService,
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
    this.OnlineOrderService.clearAll.subscribe((clearItems: any) => {
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
    // var fdate = new Date(this.searchFormGroup.controls["fromDate"].value);
    // var tdate = new Date(this.searchFormGroup.controls["toDate"].value);
    // var dif_in_time = tdate.getTime() - fdate.getTime();
    // var dif_in_days = dif_in_time / (1000 * 3600 * 24);
    // if (dif_in_days < 30) {
    this.OnlineOrderService.pageIndex = 0;
    this.OnlineOrderService.lastOrderID = 0;
    this.OnlineOrderService.searchFormData =
      this.searchFormDetailsRequestBody();
    this.OnlineOrderService.getOnlineOrderSearchData(
      this.OnlineOrderService.searchFormData
    );
    // } else {
    //   this.snackbarService.showSnackBar(
    //     "Can not process requests for more than 30 Days, Please select the dates accordingly.",
    //     "error",
    //     ""
    //   );
    // }
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
      ? this.searchFormGroup.controls["orderStatus"].value.trim()
      : "";
    re = re + "/?";
    if (orderStatus && orderStatus != "") {
      re = re + "Status=" + orderStatus;
    }
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

    return re;
  }
}