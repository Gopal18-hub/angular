import { AfterViewInit, Component, OnInit } from '@angular/core';
import { QuestionControlService } from '../../../shared/ui/dynamic-forms/service/question-control.service';
import { FormGroup }                 from '@angular/forms';
import { ADAuthService } from '../../../auth/core/services/adauth.service';
import { StationModel } from '../../../auth/core/models/stationmodel';
import { LocationModel } from '../../../auth/core/models/locationmodel';
import { UserLocationStationdataModel } from '../../../auth/core/models/userlocationstationdatamodel';
import { CookieService } from '../../../shared/services/cookie.service';

@Component({
  selector: 'auth-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {

  public locationList:LocationModel[]=[];
  public stationList:StationModel[]=[];
  public userId:number = 0;
  public userlocationandstation :UserLocationStationdataModel | undefined;
  public locationdetail:LocationModel|undefined;
  public stationdetail:StationModel|undefined;
  authStatus:boolean=false;

  loginFormData = {
    title: "",
    type: "object",
    properties : {
      username : {
          type: 'string',
          title: 'Username',
          required: true
      },
      password: {
          type: 'password',
          title: 'Password',
          required: true
      },
      location: {
        type: 'autocomplete',
        title: 'Location',
        required: true,
        list:this.locationList
      },
      station: {
        type: 'autocomplete',
        title: 'Station',
        required: true,
        list:this.stationList
      }
    }
  }

  loginForm!: FormGroup;

  questions: any;

  constructor(private formService: QuestionControlService, private adauth: ADAuthService,
     private cookie:CookieService) { }

  ngOnInit(): void {
      let formResult: any = this.formService.createForm(this.loginFormData.properties, {});
      this.loginForm = formResult.form;
      this.questions  = formResult.questions;
  }

  ngAfterViewInit(): void {
    this.questions[0].elementRef.addEventListener('blur', this.validateUserName.bind(this));
  }

  validateUserName()
  {
     let username = this.loginForm.value.username;
      this.adauth.authenticateUserName(username).subscribe((data:any)=>{
          this.userlocationandstation = data as UserLocationStationdataModel;
          this.locationList = this.userlocationandstation.locations;
          this.stationList = this.userlocationandstation.stations;
          this.questions[2].options = this.locationList.map(l=>{return {title:l.organizationName, value:l.hspLocationId}});
          
          this.questions[3].options = this.stationList.map(s=>{return {title:s.stationName, value:s.stationid} }
            );

          this.userId= Number(this.userlocationandstation.userId);
          this.cookie.set('UserId',this.userId.toString());  
          
          this.loginForm.controls['location'].valueChanges.subscribe(value=>{
            console.log(value);
            this.questions[3].options = this.stationList.filter(e=>e.hspLocationId===value.value)
            .map(s=>{return {title:s.stationName, value:s.stationid} });
              
          });
      });
  }

  onLocationSelection(location:LocationModel){
    this.locationdetail = location;
    this.stationList.filter(e=>e.hspLocationId===location.hspLocationId);
  }

  loginSubmit() {
    let status;
      if(this.loginForm.valid) {
        this.adauth.authenticate(this.loginForm.value.username,
          this.loginForm.value.password).subscribe((data)=> {
              status = data["status"]; 
              if(status == "Valid")    
              {                
                 this.authStatus=true;                                   
                 window.location = data["redirectUrl"];          
              }
              else if(status == "InvalidUser")
              {
                this.authStatus=false;           
              }
              else if(status == "UserValidationError") 
              {
                this.authStatus=false;
              }   
              else 
              {
                this.authStatus=false;
              } 
          },(error)=>{
            this.authStatus=false;
          });
          //need to add for display authentication error
        //return this.authStatus;
      } else {
        this.formService.validateAllFormFields(this.loginForm);
      }
  }

}
