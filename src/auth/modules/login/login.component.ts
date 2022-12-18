import { AfterViewInit, Component, OnInit } from "@angular/core";
import { QuestionControlService } from "../../../shared/ui/dynamic-forms/service/question-control.service";
import { FormGroup } from "@angular/forms";
import { ADAuthService } from "../../../auth/core/services/adauth.service";
import { StationModel } from "../../../auth/core/models/stationmodel";
import { LocationModel } from "../../../auth/core/models/locationmodel";
import { UserLocationStationdataModel } from "../../../auth/core/models/userlocationstationdatamodel";
import { CookieService } from "../../../shared/services/cookie.service";
import { AuthService } from "@shared/services/auth.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { environment } from "@environments/environment";
import { ActivatedRoute } from "@angular/router";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";
import { ApplicationLogicService } from "@shared/services/applogic.service";
import { MatDialog } from "@angular/material/dialog";
import { ClearExistingLoginDialogComponent } from "./clear-existing-login-dialog/clear-existing-login-dialog.component";
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
  public password: string = "";
  Authentication: boolean = true;
  userValidationError: string = "";
  public name: string = "";

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

  showLoginForm: boolean = false;

  constructor(
    private formService: QuestionControlService,
    private adauth: ADAuthService,
    private cookie: CookieService,
    private authService: AuthService,
    public matdialog: MatDialog,
    private route: ActivatedRoute,
    private messageDialogService: MessageDialogService,
    private appLogicService: ApplicationLogicService
  ) {}

  async ngOnInit() {
    console.log(this.authService.manager);
    const query = window.location.search.substring(1);
    const pathname = window.location.pathname;
    if (this.route.snapshot.queryParams["ReturnUrl"]) {
      await this.authService.manager.clearStaleState();
      let checkingState = new URLSearchParams(
        new URL(
          decodeURIComponent(this.route.snapshot.queryParams["ReturnUrl"])
        ).search
      );
      let stateId = checkingState.get("state");
      if (localStorage.getItem("oidc." + stateId)) {
        this.showLoginForm = true;
        this.processLoginForm();
      } else {
        this.authService.startAuthentication();
      }
    } else {
      await this.authService.manager.clearStaleState();
      this.authService.startAuthentication();
    }

    //   if (query == null || query == "") {
    //     if (
    //       window.location.href == window.origin + "/" ||
    //       pathname.includes("/login")
    //     )
    //       this.authService.startAuthentication();
    //   } else {
    //     // await this.authService.signOutRedirect();
    //     // await this.authService.startAuthentication();
    //   }
  }

  processLoginForm() {
    let formResult: any = this.formService.createForm(
      this.loginFormData.properties,
      {}
    );
    this.loginForm = formResult.form;
    this.questions = formResult.questions;
    setTimeout(() => {
      this.processEvents();
    }, 500);
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

  processEvents() {
    this.questions[1].elementRef.addEventListener(
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

  ngAfterViewInit(): void {
    if (this.showLoginForm) {
    }
  }

  reLoginForm() {
    this.Authentication = true;
    window.location.reload();
    setTimeout(() => {
      this.questions[0].elementRef.focus();
    }, 1);
  }

  redirectToResetPassword() {
    window.open(environment.passwordResetUrl);
  }

  validateUserName() {
    this.username = this.loginForm.value.username;
    this.password = this.loginForm.value.password;
    this.adauth
      .authenticateAD(this.username, this.password)
      .pipe(takeUntil(this._destroying$))
      .subscribe(
        (data: any) => {
          if (data && !data.success) {
            if (data.errorMessage && data.errorMessage != "") {
              this.loginForm.controls["username"].setErrors({
                incorrect: true,
              });
              this.questions[0].customErrorMessage = data.errorMessage;
              // this.loginForm.controls["password"].disable();
              this.loginForm.controls["location"].disable();
              this.loginForm.controls["station"].disable();
            }
          } else if (data && data.success) {
            this.loginForm.controls["username"].setErrors(null);
            this.questions[0].customErrorMessage = "";
            this.userlocationandstation = data as UserLocationStationdataModel;
            this.locationList = this.userlocationandstation.locations;
            this.stationList = this.userlocationandstation.stations;

            this.questions[3].options = this.stationList.map((s) => {
              return { title: s.stationName, value: s.stationid };
            });

            this.questions[2].options = this.locationList.map((l) => {
              return { title: l.organizationName, value: l.hspLocationId };
            });
            //changes for UAT defect fix to select station bydefault if only one location
            if (this.locationList.length == 1) {
              this.loginForm.controls["location"].setValue({
                title: this.locationList[0].organizationName,
                value: this.locationList[0].hspLocationId,
              });
            }


            this.userId = Number(this.userlocationandstation.userId);
            this.name = this.userlocationandstation.name;

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
            //this.questions[1].elementRef.focus();
          }
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

  clearExistingLogin() {
    const dialogref = this.matdialog.open(ClearExistingLoginDialogComponent, {
      width: "33vw",
      height: "30vh",
      data: {
        message:
          "You have logged in another session. Do you want to delete other active session?",
      },
    });

    dialogref.afterClosed().subscribe((res) => {
      if (res.data == "Y") {
        this.adauth
          .ClearExistingLogin(this.userId)
          .pipe(takeUntil(this._destroying$))
          .subscribe(async (resdata: any) => {

            this.authStatus = true;
              this.cookie.set("UserName", this.username);
              this.cookie.set("UserId", this.userId.toString());
              this.cookie.set("Name", this.name);
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
              this.cookie.set(
                "StationId",
                this.stationdetail!.stationid.toString()
              );
              this.appLogicService.getGSTVistaLiveFlag();
                this.adauth
                .authenticate(
                  this.loginForm.value.username,
                  this.loginForm.value.password
                )
                .pipe(takeUntil(this._destroying$))
                .subscribe(
                  async (data) => {
                    window.location = data["redirectUrl"];
                  },
                  (error) => {
                    this.authStatus = false;
                    this.Authentication = false;
                    this.loginForm.reset();
                  }
                );
              this.Authentication = true;
            //return false;
          });
      } else {
        this.loginForm.reset();
        //return false;
      }
    });
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
          async (data) => {
            status = data["status"];
            if (status == "Valid") {
              this.authStatus = true;
              this.cookie.set("UserName", this.username);
              this.cookie.set("UserId", this.userId.toString());
              this.cookie.set("Name", this.name);
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
              this.cookie.set(
                "StationId",
                this.stationdetail!.stationid.toString()
              );
              this.appLogicService.getGSTVistaLiveFlag();
              window.location = data["redirectUrl"];
              this.Authentication = true;
            } else if (status == "InvalidUser") {
              this.authStatus = false;
              this.Authentication = false;
              this.loginForm.reset();
            } else if (status == "UserValidationError") {
              if (data.userData) {
                if (data.userData["error"]) {
                  console.log(data.userData["error"]);
                  if (data.userData["error"] == "User Already Logged in to the system.")
                      this.clearExistingLogin();
                  else if ((data.userData.user.logged = "Y")) {
                    const errorDialogRef = this.messageDialogService.warning(
                      data.userData["error"]
                    );
                    await errorDialogRef.afterClosed().toPromise();
                    this.loginForm.reset();
                    //Delete ActiveSession
                  } else {
                    this.messageDialogService.warning(data.userData["error"]);
                    this.loginForm.reset();
                    // this.Authentication = false;
                    // this.authStatus = false;
                    // this.userValidationError = data.userData["error"];
                  }
                }
              }
              
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
