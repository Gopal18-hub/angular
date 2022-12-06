import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CookieService } from '@shared/services/cookie.service';
import { QuestionControlService } from '@shared/ui/dynamic-forms/service/question-control.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BillDetailsApiConstants } from '../BillDetailsApiConstants';
import { HttpService } from '@shared/services/http.service';
import { DatePipe } from '@angular/common';
import { getsearchopbills } from "../../../../../core/types/billdetails/getsearchopbill.Interface";
import { Subject, takeUntil } from 'rxjs';
import { MaxHealthSnackBarService } from '@shared/ui/snack-bar';
import { MoreThanMonthComponent } from '../../dispatch-report/more-than-month/more-than-month.component';
@Component({
  selector: 'out-patients-search-dialog',
  templateUrl: './search-dialog.component.html',
  styleUrls: ['./search-dialog.component.scss']
})
export class SearchDialogComponent implements OnInit {
  searchFormData = {
    title: "",
    type: "object",
    properties: {
      billno: {
        type: "string",
      },
      maxid: {
        type: "string",
        defaultValue: this.cookie.get("LocationIACode") + ".",
      },
      mobile: {
        title: 'Mobile No',
        type: "number",
        // pattern: "^[1-9]{1}[0-9]{9}",
      },
      checkbox: {
        type: "checkbox",
        options: [
          {
            title: "",
            value: false
          },
        ],
        defaultValue: false
      },
      fromdate: {
        type: "date",
        defaultValue: new Date(),
        disabled: true,
      },
      todate: {
        type: "date",
        defaultValue: new Date(),
        disabled: true,
      }
    },
  };
  config: any = {
    clickedRows: true,
    clickSelection: "single",
    actionItems: false,
    dateformat: "dd/MM/yyyy H:mm:ss",
    selectBox: false,
    displayedColumns: [
      "sno",
      "billno",
      "maxId",
      "datetime",
      "patientName",
      "mobileNo",
      "age",
      "gender",
      "billamount",
      "balance",
      "billMadeBy",
      "ssn"
    ],
    rowLayout: { dynamic: { rowClass: "row['billStatus']" } },
    columnsInfo: {
      sno: {
        title: "S.No",
        type: "string",
        style: {
          width: "3rem"
        }
      },
      billno: {
        title: "Bill No",
        type: "string",
        style: {
          width: "4.5rem"
        }
      },
      maxId: {
        title: "Max ID",
        type: "string",
        style: {
          width: "4.5rem"
        }
      },
      datetime: {
        title: "Date and Time",
        type: "date",
        style: {
          width: "6rem"
        },
      },
      patientName: {
        title: "Patient Name",
        type: "string",
        style: {
          width: "6rem"
        },
        tooltipColumn: 'patientName'
      },
      mobileNo: {
        title: "Mobile No",
        type: "tel",
        style: {
          width: "5rem"
        }
      },
      age: {
        title: "Age",
        type: "string",
        style: {
          width: "3.5rem"
        }
      },
      gender: {
        title: "Gender",
        type: "string",
        style: {
          width: "4rem"
        }
      },
      billamount: {
        title: "Bill Amt.",
        type: "string",
        style: {
          width: "5rem"
        }
      },
      balance: {
        title: "Balance",
        type: "string",
        style: {
          width: "5rem"
        }
      },
      billMadeBy: {
        title: "Billed By",
        type: "string",
        style: {
          width: "5rem"
        },
        tooltipColumn: 'billMadeBy'
      },
      ssn: {
        title: "SSN",
        type: "string",
        style: {
          width: "4rem"
        }
      },
    },
  };
  data:any = [];
  searchform!: FormGroup;
  questions: any;
  hsplocationId:any = Number(this.cookie.get("HSPLocationId"));
  public getsearchopbillslist: getsearchopbills[] = [];
  private readonly _destroying$ = new Subject<void>();
  @ViewChild('table') table: any;
  apiProcessing: boolean = false;
  constructor(
    private cookie: CookieService,
    private http: HttpService,
    private formService: QuestionControlService,
    private datepipe: DatePipe,
    private matdialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) private formdata: {
      maxid: any,
      mobileno: any,
      check: any,
      fromdate: any,
      todate: any,
      frombill: any
    },
    private dialogRef: MatDialogRef<SearchDialogComponent>,
    private snackbar: MaxHealthSnackBarService
  ) { }

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.searchFormData.properties,
      {}
    );
    this.searchform = formResult.form;
    this.questions = formResult.questions;
    this.questions[4].maximum = this.searchform.controls['todate'].value;
    this.questions[5].minimum = this.searchform.controls['fromdate'].value;
  }
  ngAfterViewInit(): void {
    console.log(this.formdata);
    if((this.formdata.check != '' && this.formdata.check != null) ||
    (this.formdata.fromdate != '' && this.formdata.fromdate != undefined) ||
    this.formdata.maxid != this.cookie.get('LocationIACode')+'.' ||
    (this.formdata.mobileno != '' && this.formdata.mobileno != null) || 
    (this.formdata.todate != '' && this.formdata.todate != undefined))
    {
      this.searchform.controls['maxid'].setValue(this.formdata.maxid);
      this.searchform.controls['mobile'].setValue(this.formdata.mobileno);
      this.searchform.controls['checkbox'].setValue(this.formdata.check);
      this.search();
    }
    if(this.formdata.check == false)
    {
      this.searchform.controls['fromdate'].disable();
      this.searchform.controls['todate'].disable();
    }
    else if(this.formdata.check == true)
    {
      this.searchform.controls['fromdate'].enable();
      this.searchform.controls['todate'].enable();
      this.searchform.controls['fromdate'].setValue(this.formdata.fromdate);
      this.searchform.controls['todate'].setValue(this.formdata.todate);
      this.search();
    }
    this.searchform.controls['checkbox'].valueChanges.subscribe(value=>{
      if(value == true)
      {
        this.searchform.controls['fromdate'].enable();
        this.searchform.controls['todate'].enable();
        this.getsearchopbillslist = [];
        this.search();
      }
      else
      {
        this.searchform.controls['fromdate'].disable();
        this.searchform.controls['todate'].disable();
        this.getsearchopbillslist = [];
      }
    })
    this.table.selection.changed.subscribe((res:any)=>{
      this.dialogRef.close(res.added[0].billno)
    })
    this.questions[0].elementRef.addEventListener("keypress", (event: any) => {
      if (event.key === "Enter") {
        if(this.searchform.value.billno == '')
        {
          this.snackbar.open('Invalid Bill No');
        }
        else
        {
          this.search();
        }
      }
    })
    this.questions[1].elementRef.addEventListener("keypress", (event: any) => {
      if (event.key === "Enter") {
        if(this.searchform.value.maxid == this.cookie.get("LocationIACode") + "." || 
          this.searchform.value.maxid == ''
        )
        {
          this.snackbar.open('Invalid Max ID');
        }
        else if(!this.searchform.value.maxid.split('.')[0] || !this.searchform.value.maxid.split('.')[1])
        {
          this.snackbar.open('Invalid Max ID');
        }
        else
        {
          this.search();
        }
      }
    })
    this.questions[2].elementRef.addEventListener("keypress", (event: any) => {
      if (event.key === "Enter") {
        if(this.searchform.value.mobile.toString() == '' ||
          this.searchform.value.mobile.toString().length < 10
        )
        {
          this.snackbar.open('Invalid Mobile No');
        }
        else
        {
          this.search();
        }
      }
    })
    
    this.searchform.controls['fromdate'].valueChanges.subscribe( (val) => {
      this.questions[5].minimum = val;
    })
  }
  search()
  {
    if(this.searchform.value.checkbox == true)
    {
      var fdate = new Date(this.searchform.controls["fromdate"].value);
      var tdate = new Date(this.searchform.controls["todate"].value);
      var dif_in_time = tdate.getTime() - fdate.getTime();
      var dif_in_days = dif_in_time / (1000 * 3600 * 24);
      if (dif_in_days > 31) {
        this.matdialog.open(MoreThanMonthComponent, {
          width: "30vw",
          height: "30vh",
        });
      } 
      else
      {
        this.SearchApi();
      }
    }
    else{
      this.SearchApi();
    }
    
  }

  SearchApi()
  {
    this.getsearchopbillslist= [];
    this.apiProcessing = true;
    this.http.get(BillDetailsApiConstants.getsearchopbills(
      this.searchform.value.billno?this.searchform.value.billno:'',
      this.searchform.value.maxid.split('.')[1]?this.searchform.value.maxid.split('.')[1]:'',
      this.searchform.value.maxid.split('.')[1]?this.searchform.value.maxid.split('.')[0]:'',
      this.searchform.value.mobile?this.searchform.value.mobile: '',
      this.searchform.value.checkbox==true?true:false,
      this.searchform.value.checkbox==true?this.datepipe.transform(this.searchform.value.fromdate, "YYYY-MM-dd"):this.datepipe.transform(new Date(), "YYYY-MM-dd"),
      this.searchform.value.checkbox==true?this.datepipe.transform(this.searchform.value.todate, "YYYY-MM-dd"):this.datepipe.transform(new Date(), "YYYY-MM-dd"),
      this.hsplocationId
    ))
    .pipe(takeUntil(this._destroying$))
    .subscribe(res=>{
      if(res && res.length > 0 && res != null) 
      {
        this.getsearchopbillslist = res;
        this.getsearchopbillslist.forEach(e=>{
          if(e.billStatus == 0)
          {
            e.billStatus = 'newbill'
          }
          else if(e.billStatus == 1)
          {
            e.billStatus = 'cancelled'
          }
          else if(e.billStatus == 2)
          {
            e.billStatus = 'partially-cancelled'
          }
          e.balance = e.balance.toFixed(2);
          e.billamount = e.billamount.toFixed(2);
        })
        if(this.formdata.frombill == 1)
        {
          this.getsearchopbillslist = this.getsearchopbillslist.filter(i => {
            return i.balance > 0 && i.billStatus != 'cancelled';
          })
        }
        for(var i = 0 ; i < this.getsearchopbillslist.length; i++)
        {
          this.getsearchopbillslist[i].sno = i + 1;
        }
        this.apiProcessing = false;
        console.log(this.getsearchopbillslist);
      }
      else
      {
        this.apiProcessing = false;
        this.snackbar.open('No Data Available / Invalid Input Data');
      }
    },
    (error) => {
      console.log(error);
      this.apiProcessing = false;
      if(error.error.errors.registrationno)
      {
        this.snackbar.open(error.error.errors.registrationno[0]);
      }
    })
  }
  clear()
  {
    this.searchform.reset();
    this.searchform.controls['fromdate'].setValue(new Date());
    this.searchform.controls['todate'].setValue(new Date());
    this.searchform.controls['maxid'].setValue(this.cookie.get("LocationIACode") + ".");
    this.getsearchopbillslist = [];
  }
  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
