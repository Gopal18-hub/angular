import { Component, Inject, OnInit, AfterViewInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { CookieService } from "@shared/services/cookie.service";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { Subject, takeUntil } from "rxjs";
import { ApiConstants } from "@shared/constants/ApiConstants";
import { HttpService } from "@shared/services/http.service";

@Component({
  selector: "out-patients-selectimei",
  templateUrl: "./selectimei.component.html",
  styleUrls: ["./selectimei.component.scss"],
})
export class SelectimeiComponent implements OnInit, AfterViewInit {
  form!: FormGroup;
  questions: any;
  private readonly _destroying$ = new Subject<void>();

  POSIMEIList: any = [];
  POSMachineDetal: any = {};
  constructor(
    private formService: QuestionControlService,
    private cookieService: CookieService,
    private httpService: HttpService,
    public dialogRef: MatDialogRef<SelectimeiComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.data.form.properties,
      {}
    );
    this.form = formResult.form;
    this.questions = formResult.questions;
  }

  ngAfterViewInit(): void {
    this.getPOSMachineMaster();
    this.form.controls["imei"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value) => {
        if (value) {
          this.POSMachineDetal = this.POSIMEIList.filter(
            (s: any) => s.id === value.value
          )[0];
        }
      });
  }

  getPOSMachineMaster() {
    let locationId = Number(this.cookieService.get("HSPLocationId"));
    let stationId = Number(this.cookieService.get("StationId"));
    this.httpService
      .get(ApiConstants.getPOSMachineMaster(locationId, stationId))
      .subscribe((res: any) => {
        if (res && res.length > 0) {
          this.POSIMEIList = res;
          if (this.POSIMEIList.length > 1) {
            this.questions[0].options = this.POSIMEIList.map((l: any) => {
              return { title: l.edcMachineName, value: l.id };
            });
          } else {
            this.form.controls["imei"].setValue({
              title: this.POSIMEIList[0].edcMachineName,
              value: this.POSIMEIList[0].id,
            });
          }
        }
      });
  }

  submit() {
    if (this.form.valid) {
      if (this.form.value != "" && this.form.value != undefined) {
        if (
          this.form.value.imei &&
          this.POSMachineDetal.id == this.form.value.imei.value
        ) {
          this.cookieService.delete("POSIMEI", "/");
          this.cookieService.set("POSIMEI", this.POSMachineDetal.hardwareID, {
            path: "/",
          });
          this.cookieService.delete("MachineName", "/");
          this.cookieService.set(
            "MachineName",
            this.POSMachineDetal.edcMachineName,
            {
              path: "/",
            }
          );
          this.cookieService.delete("MAXMachineName", "/");
          this.cookieService.set("MAXMachineName", this.POSMachineDetal.name, {
            path: "/",
          });
          this.cookieService.delete("MAXMachineId", "/");
          this.cookieService.set("MAXMachineId", this.POSMachineDetal.id, {
            path: "/",
          });
          this.cookieService.delete("MerchantId", "/");
          this.cookieService.set(
            "MerchantId",
            this.POSMachineDetal.merchantID,
            {
              path: "/",
            }
          );
          this.cookieService.delete("MerchantPOSCode", "/");
          this.cookieService.set(
            "MerchantPOSCode",
            this.POSMachineDetal.merchantStorePosCode,
            {
              path: "/",
            }
          );
          this.cookieService.delete("SecurityToken", "/");
          this.cookieService.set(
            "SecurityToken",
            this.POSMachineDetal.securityToken,
            {
              path: "/",
            }
          );
          this.cookieService.delete("PineLabApiUrl", "/");
          this.cookieService.set(
            "PineLabApiUrl",
            this.POSMachineDetal.apiUrlPineLab,
            {
              path: "/",
            }
          );
          this.cookieService.delete("UPIAllowedPaymentMode", "/");
          this.cookieService.set(
            "UPIAllowedPaymentMode",
            this.POSMachineDetal.upI_AllowedPaymentMode,
            {
              path: "/",
            }
          );
        }
      }
      this.dialogRef.close({ data: this.form.value });
    }
  }

  close() {
    this.dialogRef.close();
  }
}
