import { AfterViewInit, Component, OnInit } from "@angular/core";
import { QuestionControlService } from "../../../shared/ui/dynamic-forms/service/question-control.service";
import { FormGroup } from "@angular/forms";
import { ADAuthService } from "../../../auth/core/services/adauth.service";
import { StationModel } from "../../../auth/core/models/stationmodel";
import { LocationModel } from "../../../auth/core/models/locationmodel";
import { UserLocationStationdataModel } from "../../../auth/core/models/userlocationstationdatamodel";
import { CookieService } from "../../../shared/services/cookie.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "auth-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit, AfterViewInit {
  public locationList: LocationModel[] = [];
  public stationList: StationModel[] = [];
  public userId: number = 0;
  public userlocationandstation: UserLocationStationdataModel | undefined;
  public locationdetail: LocationModel | undefined;
  public stationdetail: StationModel | undefined;
  authStatus: boolean = false;
  public username: string = "";
  Authentication: boolean = true;

  loginFormData = {
    title: "",
    type: "object",
    properties: {
      username: {
        type: "string",
        title: "Username",
        required: true,
      },
      password: {
        type: "password",
        title: "Password",
        required: true,
      },
      location: {
        type: "autocomplete",
        title: "Location",
        required: true,
        list: this.locationList,
      },
      station: {
        type: "autocomplete",
        title: "Station",
        required: true,
        list: this.stationList,
      },
    },
  };

  loginForm!: FormGroup;

  questions: any;

  private readonly _destroying$ = new Subject<void>();

  constructor(
    private formService: QuestionControlService,
    private adauth: ADAuthService,
    private cookie: CookieService
  ) {}

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.loginFormData.properties,
      {}
    );
    this.loginForm = formResult.form;
    this.questions = formResult.questions;
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

  ngAfterViewInit(): void {
    this.questions[0].elementRef.addEventListener(
      "blur",
      this.validateUserName.bind(this)
    );

    this.loginForm.controls["username"].valueChanges
      .pipe(takeUntil(this._destroying$))
      .subscribe((value) => {
        if (!value) {
          this.loginForm.controls["password"].setValue("");
          this.loginForm.controls["location"].setValue({ title: "", value: 0 });
          this.loginForm.controls["station"].setValue({ title: "", value: 0 });
          this.questions[0].elementRef.focus();
          this.loginForm.controls["location"].disable();
          this.loginForm.controls["station"].disable();
        }
      });
    this.questions[0].elementRef.focus();
    this.loginForm.controls["location"].disable();
    this.loginForm.controls["station"].disable();
  }

  reLoginForm() {
    this.Authentication = true;
    setTimeout(() => {
      this.questions[0].elementRef.focus();
    }, 1);
  }
  validateUserName() {
    this.username = this.loginForm.value.username;
    this.adauth
      .authenticateUserName(this.username)
      .pipe(takeUntil(this._destroying$))
      .subscribe(
        (data: any) => {
          this.userlocationandstation = data as UserLocationStationdataModel;
          this.locationList = this.userlocationandstation.locations;
          this.stationList = this.userlocationandstation.stations;

          this.questions[3].options = this.stationList.map((s) => {
            return { title: s.stationName, value: s.stationid };
          });

          //changes for UAT defect fix to select station bydefault if only one location
          if (this.locationList.length == 1) {
            this.loginForm.controls["location"].setValue({
              title: this.locationList[0].organizationName,
              value: this.locationList[0].hspLocationId,
            });
          } else {
            this.questions[2].options = this.locationList.map((l) => {
              return { title: l.organizationName, value: l.hspLocationId };
            });
          }

          console.log(this.questions);

          this.userId = Number(this.userlocationandstation.userId);

          this.loginForm.controls["location"].valueChanges
            .pipe(takeUntil(this._destroying$))
            .subscribe((value) => {
              if (value) {
                this.loginForm.controls["station"].enable();
                this.loginForm.controls["station"].setValue(null);
                this.locationdetail = this.locationList.filter(
                  (l) => l.hspLocationId === value.value
                )[0];
                //changes for UAT defect fix to select station bydefault if only one station
                if (this.stationList.length > 1) {
                  this.questions[3].options = this.stationList
                    .filter((e) => e.hspLocationId === value.value)
                    .map((s) => {
                      return { title: s.stationName, value: s.stationid };
                    });
                } else {
                  this.loginForm.controls["station"].setValue({
                    title: this.stationList[0].stationName,
                    value: this.stationList[0].stationid,
                  });
                }
              }
            });

          this.loginForm.controls["station"].valueChanges
            .pipe(takeUntil(this._destroying$))
            .subscribe((value) => {
              this.stationdetail = this.stationList.filter(
                (s) => s.stationid === value.value
              )[0];
            });
          // this.loginForm.controls["password"].enable();
          this.loginForm.controls["location"].enable();
          //this.loginForm.controls["station"].enable();
          this.questions[1].elementRef.focus();
        },
        (error: any) => {
          this.loginForm.controls["username"].setErrors({ incorrect: true });
          this.questions[0].customErrorMessage = error.error;
          // this.loginForm.controls["password"].disable();
          this.loginForm.controls["location"].disable();
          this.loginForm.controls["station"].disable();
        }
      );
  }

  loginSubmit() {
    let status;
    if (this.loginForm.valid) {
      this.adauth
        .authenticate(
          this.loginForm.value.username,
          this.loginForm.value.password
        )
        .pipe(takeUntil(this._destroying$))
        .subscribe(
          (data) => {
            status = data["status"];
            if (status == "Valid") {
              this.authStatus = true;
              this.cookie.set("UserName", this.username);
              this.cookie.set("UserId", this.userId.toString());
              this.cookie.set("LocationIACode", this.locationdetail!.iaCode);
              this.cookie.set(
                "HSPLocationId",
                this.locationdetail!.hspLocationId.toString()
              );
              this.cookie.set(
                "Location",
                this.locationdetail!.organizationName
              );
              this.cookie.set("Station", this.stationdetail!.stationName);
              window.location = data["redirectUrl"];
              this.Authentication = true;
            } else if (status == "InvalidUser") {
              this.authStatus = false;
              this.Authentication = false;
              this.loginForm.reset();
            } else if (status == "UserValidationError") {
              this.authStatus = false;
              this.Authentication = false;
              this.loginForm.reset();
            } else {
              this.authStatus = false;
              this.Authentication = false;
              this.loginForm.reset();
            }
          },
          (error) => {
            this.authStatus = false;
            this.Authentication = false;
            this.loginForm.reset();
          }
        );
      //need to add for display authentication error
      //return this.authStatus;
    } else {
      this.formService.validateAllFormFields(this.loginForm);
    }
  }
}
