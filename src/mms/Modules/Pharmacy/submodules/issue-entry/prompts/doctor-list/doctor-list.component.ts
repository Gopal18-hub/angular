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
import { MatBottomSheet } from "@angular/material/bottom-sheet";
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
    displayedColumns: ["name", "specialisation"],
    columnsInfo: {
      name: {
        title: "Doctor Name",
        type: "string",
      },
      specialisation: {
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
        // pattern: "^[a-zA-Z0-9 ]*$",
        // capitalizeText: true,
      },
      lastName: {
        type: "pattern_string",
        title: "LastName",
        // pattern: "^[a-zA-Z0-9 ]*$",
        // capitalizeText: true,
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
       // options:this.special
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
  doctorSelected: any;
  addDoctor:boolean=false;
  apiProcessing: boolean = true;
  special=[]
  constructor(
    private formService: QuestionControlService,
    private http: HttpService,
    private router: Router,
    private route: ActivatedRoute,
    private _bottomSheet: MatBottomSheet,
    private cookie: CookieService
  ) {}

  ngOnInit(): void {
    this.doctortype = 1;
    this.formInit();
    this.showInternalDoctor();
  }
  ngAfterViewInit() {
    // this.doctableRows.selection.changed.subscribe((res: any) => {
    //   this.doctorSelected = res["added"][0].name;
    //   this._bottomSheet.dismiss(this.doctorSelected);
    // });
    setTimeout(() => { 
      this.doctableRows.selection.changed.subscribe((res: any) => {
      this.doctorSelected=res["added"][0].name
      this._bottomSheet.dismiss(this.doctorSelected);
    }) },500);
    this.doctorformGroup.controls["searchDoctor"].valueChanges
    .pipe(
      filter((res: any) => {
        return (res !== null && res.length >= 3) || res == "";
      }),
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap((val) => {
        return this.http
          .get(PharmacyApiConstants.getreferraldoctor(this.doctortype, val))
          .pipe(finalize(() => {}));
      })
    )
    .subscribe(
      (data:any) => {
        this.doctorList = data;
      },
      (error:any) => {
        console.error("There was an error!", error);
      }
    );
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
    this.http.get(PharmacyApiConstants.getspecialization).subscribe((res) => {
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
      .get(PharmacyApiConstants.getreferraldoctor(1, ""))
      .pipe(takeUntil(this._destroying$))
      .subscribe((res: any) => {
        this.doctorList = res;
        this.apiProcessing = false;
        setTimeout(() => { 
          this.doctableRows.selection.changed.subscribe((res: any) => {
          this.doctorSelected=res["added"][0].name
          this._bottomSheet.dismiss(this.doctorSelected);
        }) },500);
      });
  }
  showExternalDoctor() {
    this.doctortype = 2;
    this.apiProcessing = true;
   
    this.http
      .get(PharmacyApiConstants.getreferraldoctor(2, ""))
      .pipe(takeUntil(this._destroying$))
      .subscribe((res: any) => {
        this.doctorList = res;
        this.apiProcessing = false;
        setTimeout(() => { 
          this.doctableRows.selection.changed.subscribe((res: any) => {
          this.doctorSelected=res["added"][0].name
          this._bottomSheet.dismiss(this.doctorSelected);
        }) },500);
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
  saveDoctor() {
    this.http
      .post(
        PharmacyApiConstants.referraldoctorsave(
          this.addDoctorfomGroup.value.firstName + " " + this.addDoctorfomGroup.value.lastName,
          this.addDoctorfomGroup.value.mobile,
          this.addDoctorfomGroup.value.speciality,
          this.cookie.get("UserId")
        ),
        {}
      )
      .subscribe((res: any) => {
        this.doctorList=res
        // this.selectedDoctorEvent.emit({
        //   docotr: {
        //     id: res,
        //     name:
        //       this.addDoctorfomGroup.value.firstname +
        //       " " +
        //       this.addDoctorfomGroup.value.lastname,
        //     specialisation: this.addDoctorfomGroup.value.speciality,
        //   },
        // });
       // this.alreadyDoctorsExist = [];
        this.addDoctor = false;
        //this._bottomSheet.dismiss(this.doctorList);
       // this.showExternalDoctor();
      });
  }

  cancelCreateDoctor($event: any) {
    $event.stopPropagation();
    this.addDoctor = false;
  }
}
