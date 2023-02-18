import { Component, OnInit, ViewChild, OnDestroy, Inject } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { QuestionControlService } from "@shared/v2/ui/dynamic-forms/service/question-control.service";
import { HttpService } from "@shared/v2/services/http.service";
import { CookieService } from "@shared/v2/services/cookie.service";
import {
  debounceTime,
  tap,
  switchMap,
  finalize,
  distinctUntilChanged,
  filter,
  catchError,
  takeUntil,
} from "rxjs/operators";
import { of, Subject } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";

import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { PharmacyApiConstants } from "../../../../../../core/constants/pharmacyApiConstant";
import { PatientApiConstants } from "../../../../../../core/constants/patientApiConstant";
import { CommonApiConstants } from "../../../../../../core/constants/commonApiConstant";
import { BillingApiConstants } from "../../../../../../core/constants/billingApiConstant";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { SnackBarService } from "@shared/v2/ui/snack-bar/snack-bar.service";
@Component({
  selector: "doctor-list",
  templateUrl: "./doctor-list.component.html",
  styleUrls: ["./doctor-list.component.scss"],
})
export class DoctorListComponent implements OnInit {
  public doctortype = 1;
  private readonly _destroying$ = new Subject<void>();
  config: any = {
    selectBox: false,
    clickedRows: true,
    clickSelection: "single",
    displayedColumns: ["name", "speciality"],
    columnsInfo: {
      name: {
        title: "Doctor Name",
        type: "string",
      },
      speciality: {
        title: "Specialisation",
        type: "string",
      },
    },
  };

  doctorFormData = {
    title: "",
    type: "object",
    properties: {
      searchDoctor: {
        title: "",
        type: "search",
        placeholder: "Search Docotor",
      },
    },
  };
  addDoctorFormData = {
    title: "",
    type: "object",
    properties: {
      firstName: {
        type: "pattern_string",
        title: "FirstName",
        required: true,
      },
      lastName: {
        type: "pattern_string",
        title: "LastName",
      },
      mobile: {
        type: "tel",
        title: "Mobile No",
        required: true,
        pattern: "^[1-9]{1}[0-9]{9}",
      },
      speciality: {
        type: "dropdown",
        placeholder: "--Select--",
        title: "Speciality",
        required: true,
      },
     
      doctorAddress: {
        title: "Address",
        type: "textarea",
        required: true,
        pattern: "^[A-Za-z0-9]{1}[A-Za-z0-9. '',/|`~!@#$%^&*()-]{1,49}",
      },
     
    },
  };
  doctorform: any;
  doctorsFormData = this.doctorFormData; 
  doctorformGroup!: FormGroup;
  addDoctorform:any;
  addDoctorsFormData=this.addDoctorFormData;
  addDoctorfomGroup!:FormGroup;
  @ViewChild("doctortable") doctableRows: any;
  doctortable: any;
  public doctorList: any = [];
  doctorSelected: any=[];
  addDoctor:boolean=false;
  apiProcessing: boolean = true;
  special=[]
  acceptToCreateNew: boolean = false;
  alreadyDoctorsExist: any = [];
  constructor(
    private formService: QuestionControlService,
    private http: HttpService,
    private router: Router,
    private route: ActivatedRoute,
    private _bottomSheet: MatBottomSheet,
    private cookie: CookieService,
    public snackbarService: SnackBarService
  ) {}

   ngOnInit() {
    this.doctortype = 1;
    this.formInit();
     //this.showExternalDoctor();
     this.showInternalDoctor();
  
  }
  ngAfterViewInit() {
    setTimeout(() => { 
      this.doctableRows.selection.changed.subscribe((res: any) => {
        console.log('dlist',res)
    
      this.http
      .get(
        CommonApiConstants.getdoctordetail(
         res["added"][0].id
        )
      )
      .subscribe((res: any) => {
        console.log('doctadd',res)
       // this.doctorSelected.push(res)
       this.doctorSelected=res
        this._bottomSheet.dismiss(this.doctorSelected);
      });
    }) },1000);
    this.doctorformGroup.controls["searchDoctor"].valueChanges.pipe(
      filter(_ => this.doctorformGroup.controls["searchDoctor"].value.length >= 3), 
      distinctUntilChanged()
    ).subscribe(value => {
      console.log('dl',this.doctorList)
      let a:any=[];
      let doc
      this.doctorList.forEach((val:any)=>{
       a.push( val.name)
       doc= a.find(
        (x: any) =>

          x.name == value 
        
      );
      })
      
      console.log('search va',value)
      console.log('sed', doc)
      this.doctorList = doc;
    });
  
    // this.doctorformGroup.controls["searchDoctor"].valueChanges.pipe(takeUntil(this._destroying$))
    // .subscribe((value) => {
    //   let doc; 
    //   if(value!=null && value.length >=3 || value==""){
    //  doc= this.doctorList.filter(
    //     (x: any) =>

    //       x.name === value 
        
    //   );
    //   console.log('dl',this.doctorList)
    //   console.log('search doc',doc)
    //   this.doctorList = doc;
    //  }
    // });
   
    // this.doctorformGroup.controls["searchDoctor"].valueChanges
    // .pipe(
    //   filter((res: any) => {
    //     return (res !== null && res.length >= 3) || res == "";
    //   }),
    //   debounceTime(1000),
    //   distinctUntilChanged(),
    //   switchMap((val) => {
    //     let doc
    //     doc= this.doctorList.filter(
    //       (x: any) =>
  
    //         x.name === val 
          
    //     );
    //   })
    // )
    // .subscribe(
    //   (data:any) => {
    //     this.doctorList = data;
    //   },
    //   (error:any) => {
    //     console.error("There was an error!", error);
    //   }
    // );
  }
  formInit() {
    let doctorformResult: any = this.formService.createForm(
      this.doctorsFormData.properties,
      {}
    );
    this.doctorformGroup = doctorformResult.form;
    this.doctorform = doctorformResult.questions;
    let adddoctorformResult: any = this.formService.createForm(
      this.addDoctorsFormData.properties,
      {}
    );
    this.addDoctorfomGroup = adddoctorformResult.form;
    this.addDoctorform = adddoctorformResult.questions;
    this.getSpecialization()
  }
  getSpecialization() {
    this.http.get(CommonApiConstants.getspecialization).subscribe((res) => {
      this.special=res
      this.addDoctorform[3].options = res.map((r: any) => {
        return { title: r.name, value: r.id };
      });
    });
  }
  showInternalDoctor() {
    this.doctortype = 1;
    this.apiProcessing = true;
   
    this.http
      .get(CommonApiConstants.getdoctor(1))
      .pipe(takeUntil(this._destroying$))
      .subscribe((res: any) => {
        this.doctorList = res;
        this.apiProcessing = false;
        // setTimeout(() => { 
        //   this.doctableRows.selection.changed.subscribe((res: any) => {
        //  this.doctorSelected.push(res["added"][0])
        //   this._bottomSheet.dismiss(this.doctorSelected);
        // }) },1000);
      });
  }
  showExternalDoctor() {
    this.doctortype = 2;
    this.apiProcessing = true;
   
    this.http
      .get(CommonApiConstants.getdoctor(2))
      .pipe(takeUntil(this._destroying$))
      .subscribe((res: any) => {
        this.doctorList = res;
        this.apiProcessing = false;
        // setTimeout(() => { 
        //   this.doctableRows.selection.changed.subscribe((res: any) => {
        //  this.doctorSelected.push(res["added"][0])
        //   this._bottomSheet.dismiss(this.doctorSelected);
        // }) },1000);
      });
  }
  closeDoctorList() {
    this._bottomSheet.dismiss();
  }
  addNewDoctor(){
    this.addDoctor=true
  }
  docList(){
    this.addDoctor=false
  }
  createDoctor($event: any) {
    alert('working')
    $event.stopPropagation();
   // this.saveDoctor();
    if (this.acceptToCreateNew) {
      this.saveDoctor();
    } else {
      if (this.addDoctorfomGroup.valid) {
        this.http
          .get(
            CommonApiConstants.getsimilarsoundreferraldoctor(
              this.addDoctorfomGroup.value.speciality,
              this.addDoctorfomGroup.value.firstName + " " + this.addDoctorfomGroup.value.lastName,

              this.addDoctorfomGroup.value.mobile,
            )
          )
          .subscribe((res: any) => {
            if (res.length > 0) {
              this.alreadyDoctorsExist = res;
              this.snackbarService.showSnackBar(
                "Referral Doctor with similar name laready exists. Please validate",
                "info",
                ""
              );
              this.addDoctor = false;
            } else {
              this.saveDoctor();
            }
          });
      }
    }
  }
  saveDoctor() {
   
    this.http
      .post(
        CommonApiConstants.saveDoctor(
        ),
        { name: this.addDoctorfomGroup.value.firstName + " " + this.addDoctorfomGroup.value.lastName,
        mobile: this.addDoctorfomGroup.value.mobile,
        speclid: this.addDoctorfomGroup.value.speciality,
        operatorid:  this.cookie.get("UserId"),
        address: this.addDoctorfomGroup.value.doctorAddress}
      )
      .subscribe((res: any) => {
        this.doctorSelected.push(res)
        this._bottomSheet.dismiss(this.doctorSelected);
      });
  }

  cancelCreateDoctor($event: any) {
    $event.stopPropagation();
    this.addDoctor = false;
  }
}
