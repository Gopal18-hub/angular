import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
} from "@angular/core";
import { DatePipe } from "@angular/common";
import { ReportService } from "@shared/services/report.service";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { HttpService } from "@shared/services/http.service";
import { environment } from "@environments/environment";
import { Subject, takeUntil } from "rxjs";
import{MoreThanMonthComponent} from"../../../../../out_patients/modules/billing/submodules/dispatch-report/more-than-month/more-than-month.component"
import { MatDialog } from "@angular/material/dialog";
@Component({
  selector: "reports-single",
  templateUrl: "./single.component.html",
  styleUrls: ["./single.component.scss"],
})
export class SingleComponent implements OnInit, OnChanges {
  @Input() reportConfig: any;
  formGroup: any;
  questions: any;

  private readonly _destroying$ = new Subject<void>();

  constructor(
    private datepipe: DatePipe,
    private reportService: ReportService,
    private formService: QuestionControlService,
    private http: HttpService,
    private dialog:MatDialog
  ) {}

  ngOnInit(): void {
    this.init();
  }

  init() {
    let formResult: any = this.formService.createForm(
      this.reportConfig.filterForm.properties,
      {}
    );
    this.formGroup = formResult.form;
    this.questions = formResult.questions;
  }
  ngAfterViewInit(){
    console.log(this.formGroup);
   
  }

  ngOnChanges(changes: any): void {
    if (changes.reportConfig.previousValue) {
      if (
        changes.reportConfig.currentValue.reportName !=
        changes.reportConfig.previousValue.reportName
      ) {
        this.init();
      }
    } else {
      this.init();
    }
  }

  submit() {
    if (this.formGroup.valid) {
    }
  }

  buttonAction(button: any) {
    var fromdate,todate,diff_in_days;
    debugger;
    if (button.type == "clear") {
      this.formGroup.reset();
      console.log('clear if')
      for (var i = 0; i < this.questions.length; i++) {
        console.log(this.reportConfig.filterForm);
        if (this.questions[i].type == "date") {
          this.formGroup.controls[this.questions[i].key].setValue(new Date());
        }
        
      }
    } else if (button.type == "crystalReport") {

      console.log('crystal report if')
      for (var i = 0; i < this.questions.length; i++) {
       
        if(this.questions[i].type=="date"){
          console.log('date type if')
          if(this.questions[i].label.toLowerCase().includes("from date")){
            fromdate= this.formGroup.controls[this.questions[i].key].value
            console.log(fromdate);
          }
          if(this.questions[i].label.toLowerCase().includes("to date")){
            todate= this.formGroup.controls[this.questions[i].key].value
            console.log(todate);
          }

        }
        console.log(this.reportConfig.filterForm);
        if (this.questions[i].type == "date") {
          console.log(this.questions[i]);
          var temp = this.datepipe.transform(
            this.formGroup.controls[this.questions[i].key].value,
            this.reportConfig.filterForm.format
          );
          this.formGroup.controls[this.questions[i].key].setValue(temp);
        }
      }
      console.log(this.formGroup);
      console.log(fromdate);
      console.log(todate)
      const diffTime = Math.abs(todate - fromdate);
      diff_in_days= Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      console.log(diff_in_days);
      if (diff_in_days > 31) {
       
        console.log('difference 31 if')
        this.dialog.open(MoreThanMonthComponent, {
          width: "30vw",
          height: "30vh",
        });
        return;
      }
     else 
     if (
        button.reportConfig.reportEntity ==
        "DoctorSheduleReportBySpecilialisation"
      ) {
        console.log('else if api' );
        let specilizationName;
        this.http
          .get(`${environment.CommonApiUrl}api/lookup/getallspecialisationname`)
          .pipe(takeUntil(this._destroying$))
          .subscribe((resultData: any) => {
            console.log('specialization repoort')
            if (resultData) {
              if (resultData.length > 0) {
                if (
                  !this.formGroup.value.Cmb_Special ||
                  this.formGroup.value.Cmb_Special == "0"
                ) {
                  this.formGroup.value.Cmb_Special = 0;
                }
                specilizationName = resultData.filter(
                  (e: any) => e.id === this.formGroup.value.Cmb_Special
                )[0].name;
                let Cmb_Special = this.formGroup.value.Cmb_Special;
                let datetype = this.formGroup.value.datetype;
                let dtpEndDate = this.formGroup.value.dtpEndDate;
                let dtpStartDate = this.formGroup.value.dtpStartDate;
                this.reportService.openWindow(
                  button.reportConfig.reportName,
                  button.reportConfig.reportEntity,
                  {
                    Cmb_Special,
                    datetype,
                    dtpEndDate,
                    dtpStartDate,
                    specilizationName,
                  }
                );
              }
            }
          });
      } else if (button.reportConfig.reportEntity == "OpenScrollReport") {
        let openscrolltypename;
        this.http
          .get(`${environment.CommonApiUrl}api/lookup/getopenscrolldata/0`)
          .pipe(takeUntil(this._destroying$))
          .subscribe((resultData: any) => {
            if (resultData) {
              if (resultData.length > 0) {
                console.log('scroll report else')
                if (
                  !this.formGroup.value.cmbopenscrolltype ||
                  this.formGroup.value.cmbopenscrolltype == "0"
                ) {
                  this.formGroup.value.cmbopenscrolltype = 0;
                }
                openscrolltypename = resultData.filter(
                  (e: any) => e.id === this.formGroup.value.cmbopenscrolltype
                )[0].name;
                let user = this.formGroup.value.user;
                let cmbopenscrolltype = this.formGroup.value.cmbopenscrolltype;
                let datetype = this.formGroup.value.datetype;
                let dtpEndDate = this.formGroup.value.dtpEndDate;
                let dtpStartDate = this.formGroup.value.dtpStartDate;
                this.reportService.openWindow(
                  button.reportConfig.reportName,
                  button.reportConfig.reportEntity,
                  {
                    cmbopenscrolltype,
                    datetype,
                    dtpEndDate,
                    dtpStartDate,
                    openscrolltypename,
                    user,
                  }
                );
              }
            }
          });
      } else {
        console.log('last else')
        this.reportService.openWindow(
          button.reportConfig.reportName,
          button.reportConfig.reportEntity,
          this.formGroup.value
        );
      }
    }
  }
}

