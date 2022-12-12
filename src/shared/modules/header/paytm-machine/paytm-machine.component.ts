import { Component, Inject, OnInit, AfterViewInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { CookieService } from "@shared/services/cookie.service";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { Subject, takeUntil } from "rxjs";
import { ApiConstants } from "@shared/constants/ApiConstants";
import { HttpService } from "@shared/services/http.service";

@Component({
  selector: "out-patients-paytm-machine",
  templateUrl: "./paytm-machine.component.html",
  styleUrls: ["./paytm-machine.component.scss"],
})
export class PaytmMachineComponent implements OnInit, AfterViewInit {
  form!: FormGroup;
  questions: any;
  private readonly _destroying$ = new Subject<void>();

  PayTmMachineList: any = [];
  PayTmMachineDetail: any = {};

  constructor(
    private formService: QuestionControlService,
    private cookieService: CookieService,
    private httpService: HttpService,
    public dialogRef: MatDialogRef<PaytmMachineComponent>,
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
    this.getPayTmMachineMaster();
    this.form.controls["posId"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value) => {
        if (value) {
          this.PayTmMachineDetail = this.PayTmMachineList.filter(
            (s: any) => s.posId === value
          )[0];
        }
      });
  }

  getPayTmMachineMaster() {
    let locationId = Number(this.cookieService.get("HSPLocationId"));
    let stationId = Number(this.cookieService.get("StationId"));
    this.httpService
      .get(ApiConstants.getPayTmMachineMaster(locationId, stationId))
      .subscribe((res: any) => {
        if (res && res.length > 0) {
          this.PayTmMachineList = res;
          this.questions[0].options = this.PayTmMachineList.map((l: any) => {
            return {
              title: l.posId,
              value: l.posId,
            };
          });
          if (this.PayTmMachineList.length == 1) {
            this.form.controls["posId"].setValue(
              this.PayTmMachineList[0].posId
            );
          }
        }
      });
  }

  close() {
    this.dialogRef.close();
  }

  submit() {
    if (this.form.valid) {
      if (this.form.value != "" && this.form.value != undefined) {
        if (
          this.form.value.posId &&
          this.PayTmMachineDetail.posId == this.form.value.posId
        ) {
          this.cookieService.delete("PayTmMachinePOSId", "/");
          this.cookieService.set(
            "PayTmMachinePOSId",
            this.PayTmMachineDetail.posId,
            {
              path: "/",
            }
          );
          this.cookieService.delete("PayTmMachinePortName", "/");
          this.cookieService.set(
            "PayTmMachinePortName",
            this.PayTmMachineDetail.portName,
            {
              path: "/",
            }
          );
          this.cookieService.delete("PayTmMachineBaudRate", "/");
          this.cookieService.set(
            "PayTmMachineBaudRate",
            this.PayTmMachineDetail.baudRate,
            {
              path: "/",
            }
          );
          this.cookieService.delete("PayTmMachineParity", "/");
          this.cookieService.set(
            "PayTmMachineParity",
            this.PayTmMachineDetail.parity,
            {
              path: "/",
            }
          );
          this.cookieService.delete("PayTmMachineDataBits", "/");
          this.cookieService.set(
            "PayTmMachineDataBits",
            this.PayTmMachineDetail.dataBits,
            {
              path: "/",
            }
          );
          this.cookieService.delete("PayTmMachineStopBits", "/");
          this.cookieService.set(
            "PayTmMachineStopBits",
            this.PayTmMachineDetail.stopBits,
            {
              path: "/",
            }
          );
          this.cookieService.delete("PayTmMachineDebugMode", "/");
          this.cookieService.set(
            "PayTmMachineDebugMode",
            this.PayTmMachineDetail.debugMode,
            {
              path: "/",
            }
          );
          this.cookieService.delete("PayTmMachineMID", "/");
          this.cookieService.set(
            "PayTmMachineMID",
            this.PayTmMachineDetail.mid,
            {
              path: "/",
            }
          );
          this.cookieService.delete("PayTmMachineMerchantkey", "/");
          this.cookieService.set(
            "UPIAllowedPaymentMode",
            this.PayTmMachineDetail.merchantkey,
            {
              path: "/",
            }
          );
        }
      }
      this.dialogRef.close({ data: this.form.value });
    }
  }
}
