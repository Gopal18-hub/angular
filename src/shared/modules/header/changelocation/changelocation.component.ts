import { Component, OnInit, Inject, AfterViewInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { ADAuthService } from "../../../../auth/core/services/adauth.service";
import { StationModel } from "../../../../auth/core/models/stationmodel";
import { LocationModel } from "../../../../auth/core/models/locationmodel";
import { UserLocationStationdataModel } from "../../../../auth/core/models/userlocationstationdatamodel";
import { CookieService } from "@shared/services/cookie.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ApplicationLogicService } from "@shared/services/applogic.service";

@Component({
  selector: "out-patients-changelocation",
  templateUrl: "./changelocation.component.html",
  styleUrls: ["./changelocation.component.scss"],
})
export class ChangelocationComponent implements OnInit, AfterViewInit {
  form!: FormGroup;

  questions: any;
  private readonly _destroying$ = new Subject<void>();

  public locationList: LocationModel[] = [];
  public stationList: StationModel[] = [];
  public userId: number = 0;
  public userlocationandstation: UserLocationStationdataModel | undefined;
  public locationdetail: LocationModel | undefined;
  public stationdetail: StationModel | undefined;

  constructor(
    public dialogRef: MatDialogRef<ChangelocationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formService: QuestionControlService,
    private adauth: ADAuthService,
    private cookieService: CookieService,
    private appLogicService: ApplicationLogicService
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
    this.getUserLocationandStation();
    //  this.form.controls["station"].disable();
    this.form.controls["location"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value) => {
        if (value) {
          //  this.form.controls["station"].enable();
          this.form.controls["station"].setValue(null);
          this.locationdetail = this.locationList.filter(
            (l) => l.hspLocationId === value.value
          )[0];
          //changes for UAT defect fix to select station bydefault if only one station
          if (this.stationList.length > 1) {
            this.questions[1].options = this.stationList
              .filter((e) => e.hspLocationId === value.value)
              .map((s) => {
                return { title: s.stationName, value: s.stationid };
              });
          } else {
            this.form.controls["station"].setValue({
              title: this.stationList[0].stationName,
              value: this.stationList[0].stationid,
            });
          }
        }
      });

    this.form.controls["station"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value) => {
        if (value) {
          this.stationdetail = this.stationList.filter(
            (s) => s.stationid === value.value
          )[0];
        }
      });
  }

  submit() {
    if (this.form.valid) {
      console.log(this.form.value);
      if (this.form.value != "" && this.form.value != undefined) {
        if (this.form.value.location) {
          console.log(this.form.value.location.title);
          console.log(this.form.value.location.value);
          let selectedACode = this.locationList.filter(
            (e) => e.hspLocationId === this.form.value.location.value
          )[0].iaCode;
          console.log(selectedACode);
          this.cookieService.delete("Location", "/");
          this.cookieService.set("Location", this.form.value.location.title, {
            path: "/",
          });
          this.cookieService.delete("HSPLocationId", "/");
          this.cookieService.set(
            "HSPLocationId",
            this.form.value.location.value,
            {
              path: "/",
            }
          );
          this.cookieService.delete("LocationIACode", "/");
          this.cookieService.set("LocationIACode", selectedACode, {
            path: "/",
          });
        }
        if (this.form.value.station) {
          console.log(this.form.value.station.title);
          console.log(this.form.value.station.value);
          this.cookieService.delete("Station", "/");
          this.cookieService.set("Station", this.form.value.station.title, {
            path: "/",
          });
          this.cookieService.delete("StationId", "/");
          this.cookieService.set("StationId", this.form.value.station.value, {
            path: "/",
          });
        }
        this.appLogicService.getGSTVistaLiveFlag();
        ////on location chnage deleting PayTm Machine details
        this.cookieService.delete("PayTmMachineMerchantkey", "/");
        this.cookieService.delete("PayTmMachineMID", "/");
        this.cookieService.delete("PayTmMachineDebugMode", "/");
        this.cookieService.delete("PayTmMachineStopBits", "/");
        this.cookieService.delete("PayTmMachineDataBits", "/");
        this.cookieService.delete("PayTmMachineParity", "/");
        this.cookieService.delete("PayTmMachineBaudRate", "/");
        this.cookieService.delete("PayTmMachinePortName", "/");
        this.cookieService.delete("PayTmMachinePOSId", "/");

        ////on location change deleting POS Machine details
        this.cookieService.delete("POSIMEI", "/");
        this.cookieService.delete("MachineName", "/");
        this.cookieService.delete("MAXMachineName", "/");
        this.cookieService.delete("MAXMachineId", "/");
        this.cookieService.delete("MerchantId", "/");
        this.cookieService.delete("MerchantPOSCode", "/");
        this.cookieService.delete("SecurityToken", "/");
        this.cookieService.delete("PineLabApiUrl", "/");
        this.cookieService.delete("UPIAllowedPaymentMode", "/");
      }
      this.dialogRef.close({ data: this.form.value });
    }
  }
  close() {
    this.dialogRef.close();
  }
  getUserLocationandStation() {
    let locationId = Number(this.cookieService.get("HSPLocationId"));
    let stationId = Number(this.cookieService.get("StationId"));
    this.adauth
      .authenticateUserName(this.cookieService.get("UserName"))
      .pipe(takeUntil(this._destroying$))
      .subscribe(
        (data: any) => {
          this.userlocationandstation = data as UserLocationStationdataModel;
          this.locationList = this.userlocationandstation.locations;
          this.stationList = this.userlocationandstation.stations;
          this.questions[1].options = this.stationList.map((s) => {
            return { title: s.stationName, value: s.stationid };
          });

          this.questions[0].options = this.locationList.map((l) => {
            return { title: l.organizationName, value: l.hspLocationId };
          });
          this.form.controls["location"].setValue({
            title: this.cookieService.get("Location"),
            value: locationId,
          });

          this.form.controls["station"].setValue({
            title: this.cookieService.get("Station"),
            value: stationId,
          });

          // if (this.locationList.length == 1) {
          //   this.form.controls["location"].setValue({
          //     title: this.locationList[0].organizationName,
          //     value: this.locationList[0].hspLocationId,
          //   });
          // }
        },
        (error: any) => {
          // this.form.controls["station"].disable();
        }
      );
  }
}
