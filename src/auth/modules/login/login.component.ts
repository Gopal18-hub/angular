import { AfterViewInit, Component, OnInit } from "@angular/core";
import { QuestionControlService } from "../../../shared/ui/dynamic-forms/service/question-control.service";
import { FormGroup } from "@angular/forms";
import { ADAuthService } from "../../../auth/core/services/adauth.service";
import { StationModel } from "../../../auth/core/models/stationmodel";
import { LocationModel } from "../../../auth/core/models/locationmodel";
import { UserLocationStationdataModel } from "../../../auth/core/models/userlocationstationdatamodel";
import { CookieService } from "../../../shared/services/cookie.service";

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

  ngAfterViewInit(): void {
    this.questions[0].elementRef.addEventListener(
      "blur",
      this.validateUserName.bind(this)
    );
    this.questions[0].elementRef.focus();
    //this.loginForm.controls["password"].disable();
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
    this.adauth.authenticateUserName(this.username).subscribe(
      (data: any) => {
        this.userlocationandstation = data as UserLocationStationdataModel;
        this.locationList = this.userlocationandstation.locations;
        this.stationList = this.userlocationandstation.stations;
        this.questions[3].options = this.stationList.map((s) => {
          return { title: s.stationName, value: s.stationid };
        });

        this.questions[2].options = this.locationList.map((l) => {
          return { title: l.organizationName, value: l.hspLocationId };
        });

        console.log(this.questions);

        this.userId = Number(this.userlocationandstation.userId);

        this.loginForm.controls["location"].valueChanges.subscribe((value) => {
          if (value) {
            this.loginForm.controls["station"].enable();
            this.locationdetail = this.locationList.filter(
              (l) => l.hspLocationId === value.value
            )[0];
            this.questions[3].options = this.stationList
              .filter((e) => e.hspLocationId === value.value)
              .map((s) => {
                return { title: s.stationName, value: s.stationid };
              });
          }
        });

        this.loginForm.controls["station"].valueChanges.subscribe((value) => {
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
