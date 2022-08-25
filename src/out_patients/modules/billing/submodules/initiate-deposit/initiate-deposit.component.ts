import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { QuestionControlService } from '@shared/ui/dynamic-forms/service/question-control.service';
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { ApiConstants } from "@core/constants/ApiConstants";
import { CookieService } from "@shared/services/cookie.service";
import { Router, ActivatedRoute } from "@angular/router";
import { MessageDialogService } from '@shared/ui/message-dialog/message-dialog.service';
import { HttpService } from '@shared/services/http.service';
import { InitiateDepositModel } from "@core/models/initiatedepositModel.Model";
import { SearchService } from "../../../../../shared/services/search.service";
import { LookupService } from "@core/services/lookup.service";
import { SimilarPatientDialog } from '@modules/registration/submodules/op-registration/op-registration.component';


@Component({
  selector: 'out-patients-initiate-deposit',
  templateUrl: './initiate-deposit.component.html',
  styleUrls: ['./initiate-deposit.component.scss']
})
export class InitiateDepositComponent implements OnInit, AfterViewInit {

  constructor(public matDialog: MatDialog, private formService:QuestionControlService,
     private cookie: CookieService,
     private route: ActivatedRoute,
     private messageDialogService: MessageDialogService,private http: HttpService, private router: Router,
     private searchService: SearchService,
     private lookupService: LookupService,) { 
      this.route.queryParams
      .pipe(takeUntil(this._destroying$))
      .subscribe(async (value) => {
        console.log(Object.keys(value).length);
        if (Object.keys(value).length > 0) {         
          const lookupdata = await this.loadGrid(value);        
        }
        });
     } 
     async loadGrid(formdata: any): Promise<any> {
      let lookupdata: string | any[]; 
      if(!formdata.data){
        lookupdata = await this.lookupService.searchPatient({
         data: formdata,
       });
      }else{
        lookupdata = await this.lookupService.searchPatient(formdata);
      }     
     
       console.log(lookupdata);
       if (lookupdata.length == 1) {
         if (lookupdata[0] && "maxid" in lookupdata[0]) {          
           this.initiatedepositForm.value.maxid = lookupdata[0]["maxid"];            
           this.iacode = this.initiatedepositForm.value.maxid.split(".")[0];
           this.regNumber = Number(this.initiatedepositForm.value.maxid.split(".")[1]);
           this.getInitatedepositDetailsByMaxId(); 
         }
       }else if (lookupdata.length > 1){
         const similarSoundDialogref = this.matDialog.open( SimilarPatientDialog,
           {
             width: "60vw",
             height: "80vh",
             data: {
               searchResults: lookupdata,
             },
           }
         );

         similarSoundDialogref
           .afterClosed()
           .pipe(takeUntil(this._destroying$))
           .subscribe((result: any) => {
             if (result) {
              console.log(result.data["added"][0].maxid);
              let maxID = result.data["added"][0].maxid;
              this.initiatedepositForm.controls["maxid"].setValue(maxID);
             
                    this.iacode = maxID.split(".")[0];
                    this.regNumber = Number(maxID.split(".")[1]);
                    this.initiatedepositForm.controls["maxid"].setValue(maxID);
                    this.getInitatedepositDetailsByMaxId();
                   
             }
           });
       }
    }
  questions:any;
  patientdeposittype: any;
  lastUpdatedBy: string = "";
  currentTime: string = new Date().toLocaleString();
  regNumber: number = 0;
  iacode: string | undefined;
  name: string | undefined;
  maxid:string = "";
  deposittypeList: [{ title: string; value: string }] = [] as any;
  selectpatientLsit: any = [];
  
  hsplocationId:any =  Number(this.cookie.get("HSPLocationId"));
  stationId:any =  Number(this.cookie.get("StationId"));
  operatorID:any =   Number(this.cookie.get("UserId"));
    
  initiatedepositformdata = {
    type:"object",
    title:"",
    properties:{
      maxid:{
        type:"string",
        defaultValue: this.cookie.get("LocationIACode") + ".",
      },
      mobileno:{
        type:"number",
      //  pattern: "^[1-9]{1}[0-9]{9}",
      },
      selectpatient:{
        type:"dropdown",   
        options: this.selectpatientLsit,    
      },
      emailid:{
        type:"string",
        pattern:  "^[A-Za-z0-9._%+-]{1}[A-Za-z0-9._%+-]+@(([a-zA-Z-0-9]+\\.+[a-zA-Z]{2,4}))$",
      },     
      mobilenoinput:{
        type:"string",  
        pattern: "^[1-9]{1}[0-9]{9}",
      },
      deposittype:{
        type:"dropdown",  
        options: this.deposittypeList,
        required: false,
        emptySelect: true,
        placeholder: "Select",   
      },
      depositamount:{
        type:"string",      
      },
      remarks:{
        type:"textarea",      
      },
    }
  }
  initiatedepositForm !: FormGroup;

  private readonly _destroying$ = new Subject<void>();
  
  hspLocationid: any = Number(this.cookie.get("HSPLocationId"));
  ngOnInit(): void {
    let formResult = this.formService.createForm(
      this.initiatedepositformdata.properties,{}
    );
    this.initiatedepositForm=formResult.form;
    this.questions=formResult.questions;
    
    this.lastUpdatedBy = this.cookie.get("UserName"); 
    
    this.searchService.searchTrigger
    .pipe(takeUntil(this._destroying$))
    .subscribe(async (formdata: any) => {
      await this.loadGrid(formdata);
    });

  }

  ngAfterViewInit(): void {
    this.questions[0].elementRef.addEventListener("keypress", (event: any) => {
      // If the user presses the "Enter" key on the keyboard

      if (event.key === "Enter") {
        event.preventDefault();
        if (this.initiatedepositForm.value.maxid == "") {
          this.messageDialogService.error("Blank Registration Number is not Allowed");
        }
        else {
          this.iacode = this.initiatedepositForm.value.maxid.split(".")[0];
          this.regNumber = Number(this.initiatedepositForm.value.maxid.split(".")[1]);
          if ((this.iacode != "" && this.iacode != "0") && (this.regNumber != 0 && !Number.isNaN(Number(this.regNumber)))) {
           
            this.getInitatedepositDetailsByMaxId();

          } else {
            this.initiatedepositForm.controls["maxid"].setErrors({ incorrect: true });
            this.questions[0].customErrorMessage = "Invalid Max ID";
          }
        }
      }
    });

    this.initiatedepositForm.controls["selectpatient"].valueChanges
    .pipe(takeUntil(this._destroying$))
    .subscribe((value: any) => {
      if (value) {
        let selectedmaxid = this.selectpatientLsit.filter((l: { maxID: any; }) => l.maxID === value);
     
        if(selectedmaxid.length > 0){
          this.maxid =  selectedmaxid[0].maxID;
          this.name = selectedmaxid[0].patientName;
          this.initiatedepositForm.controls["emailid"].setValue(selectedmaxid[0].emailID);
          this.initiatedepositForm.controls["mobilenoinput"].setValue(selectedmaxid[0].mobileNo);
          
        }
        
      } 
    });

    this.questions[1].elementRef.addEventListener("keydown", (event: any) => {
      console.log(event);
      if (event.key === "Enter" || event.key === "Tab") {
        event.preventDefault();
        this.getInitatedepositDetailsByMaxId();
      }
    });
    this.getDepositType();
  }
  
  resetinitiatedeposit(){
    this.name="";
    this.maxid="";
    this.initiatedepositForm.reset();
    this.selectpatientLsit = [];
    this.initiatedepositForm.controls["maxid"].setValue(this.cookie.get("LocationIACode") + ".");
  }

  getInitatedepositDetailsByMaxId(){
    if ((this.initiatedepositForm.value.maxid == "" || this.initiatedepositForm.value.maxid == null) && 
    (this.initiatedepositForm.value.mobileno == "" || this.initiatedepositForm.value.mobileno == null)) {
      this.messageDialogService.error("Please enter either MAX ID or Phone Number for search");
    }
    else
    {   
       let maxiddeposit = this.initiatedepositForm.value.maxid == undefined ? "" :this.initiatedepositForm.value.maxid;
       let phoneno =   this.initiatedepositForm.value.mobileno == undefined ? "" : this.initiatedepositForm.value.mobileno;
    this.http
    .get(ApiConstants.getsearchpatientdeceased(maxiddeposit,phoneno, "N", "Y"))
    .pipe(takeUntil(this._destroying$))
    .subscribe(
      (resultData) => { 
        if(resultData.length > 0){

        this.selectpatientLsit = resultData;
        this.questions[2].options = this.selectpatientLsit.map((l: { maxID: any; }) => {
          return { title: l.maxID, value: l.maxID };
        });
        
        if(resultData.length == 1 && maxiddeposit){
          this.initiatedepositForm.controls["maxid"].setValue(resultData[0].maxID);   
        }
              
          this.maxid =  resultData[0].maxID;
          this.name = resultData[0].patientName;
          this.initiatedepositForm.controls["emailid"].setValue(resultData[0].emailID);
          this.initiatedepositForm.controls["mobilenoinput"].setValue(resultData[0].mobileNo);
          this.initiatedepositForm.controls["selectpatient"].setValue(resultData[0].maxID);
          
           
      }else{
        this.messageDialogService.error("Please enter valid MAX ID or Phone Number for search");
      }     
    },
      (error) => {
        this.initiatedepositForm.controls["maxid"].setErrors({ incorrect: true });
        this.questions[0].customErrorMessage = "Invalid Max ID";
      });
      
  }
  }

  getDepositType() {
    this.deposittypeList.push({ title: "OP", value: "OP" });
    this.deposittypeList.push({ title: "IP", value: "IP" });
    this.deposittypeList.push({ title: "Emergency", value: "ER"});
    this.deposittypeList.push({ title: "Pre-Admission", value: "PA" });
  }

  saveinitaitedeposit(){
    let initiatedeposit:any=[];

    initiatedeposit = this.initiatedepositForm.value;
    if(this.maxid == ""){
      this.messageDialogService.error("Please enter either MAX ID or Phone Number for search");
    }
    else if(initiatedeposit.selectpatient == "")
    {
      this.messageDialogService.error("Please select patient from patient drop down !!");
    }
    else if(initiatedeposit.emailid == ""){
      this.messageDialogService.error("Please fill Email Id !!");
    }
    else if(initiatedeposit.emailid.trim().toUpperCase() == "INFO@MAXHEALTHCARE.COM"){
      this.messageDialogService.error("Please fill valid Email Id " + initiatedeposit.emailid + " Not allowed to save !!");
    }
    else if(initiatedeposit.mobilenoinput == ""){
      this.messageDialogService.error("Please fill Mobile No. !!");
    }
    else if(initiatedeposit.mobilenoinput.length != 10){
      this.messageDialogService.error("10 digit mobile to be put, please check the mobile number again. Please do not use any 0 or country code before the mobile number");
    }
    else if(initiatedeposit.deposittype == "" || initiatedeposit.deposittype == undefined){
      this.messageDialogService.error("Please select Deposit Type !!");
    }
    else if(initiatedeposit.depositamount == "" || initiatedeposit.depositamount == 0){
      this.messageDialogService.error("Please fill Deposit Amount !!");
    }
    else if(initiatedeposit.remarks == ""){
      this.messageDialogService.error("Please fill Remarks !!");
      this.questions[7].elementRef.focus();
    }
    else{
      console.log(this.getPatientInitiateDeposit());
      this.http
      .post(ApiConstants.postInitiateDeposit, this.getPatientInitiateDeposit())
      .pipe(takeUntil(this._destroying$))
      .subscribe(
        (resultData) => {
          this.messageDialogService.success(resultData.message.split("!")[0]);
          this.initiatedepositForm.controls["depositamount"].setValue('');
          this.initiatedepositForm.controls["remarks"].setValue('');
          this.initiatedepositForm.controls["deposittype"].setValue({ title: "", value: 0});
        },
        (error) => {
          console.log(error);                   
            this.messageDialogService.success(error.error);            
         
        }
      );
    }
  }
  patientInitiateDepositdetails: InitiateDepositModel | undefined;
  
  getPatientInitiateDeposit(): InitiateDepositModel {  
    return (this.patientInitiateDepositdetails = new InitiateDepositModel(
      "N",
      this.maxid.split(".")[0],
      Number(this.maxid.split(".")[1]),
      this.initiatedepositForm.value.deposittype,
      this.initiatedepositForm.value.depositamount,
      this.initiatedepositForm.value.emailid,
      this.initiatedepositForm.value.mobilenoinput,
      this.operatorID,
      this.stationId,
      this.hspLocationid,
      this.initiatedepositForm.value.remarks,
      0,
      0
    ));
  }
}
