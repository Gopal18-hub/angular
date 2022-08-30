import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CookieService } from '@shared/services/cookie.service';
import { QuestionControlService } from '@shared/ui/dynamic-forms/service/question-control.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BillDetailsApiConstants } from '../BillDetailsApiConstants';
import { HttpService } from '@shared/services/http.service';
import { DatePipe } from '@angular/common';
import { getsearchopbills } from "../../../../../core/types/billdetails/getsearchopbill.Interface";
import { Subject, takeUntil } from 'rxjs';
import { MaxHealthSnackBarService } from '@shared/ui/snack-bar';
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
        maximum: new Date(),
        defaultValue: new Date(),
        disabled: true,
      },
      todate: {
        type: "date",
        maximum: new Date(),
        defaultValue: new Date(),
        disabled: true,
      }
    },
  };
  config: any = {
    clickedRows: true,
    clickSelection: "single",
    actionItems: false,
    dateformat: "dd/MM/yyyy",
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
      "ssn"
    ],
    rowLayout: { dynamic: { rowClass: "row['billStatus']" } },
    columnsInfo: {
      sno: {
        title: "S.No",
        type: "string",
        style: {
          width: "4rem"
        }
      },
      billno: {
        title: "Bill No",
        type: "string",
        style: {
          width: "5rem"
        }
      },
      maxId: {
        title: "Max ID",
        type: "string",
        style: {
          width: "4rem"
        }
      },
      datetime: {
        title: "Date and Time",
        type: "date",
        style: {
          width: "6rem"
        }
      },
      patientName: {
        title: "Patient Name",
        type: "string",
        style: {
          width: "6rem"
        }
      },
      mobileNo: {
        title: "Mobile No",
        type: "string",
        style: {
          width: "6rem"
        }
      },
      age: {
        title: "Age",
        type: "string",
        style: {
          width: "3rem"
        }
      },
      gender: {
        title: "Gender",
        type: "string",
        style: {
          width: "5rem"
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
  constructor(
    private cookie: CookieService,
    private http: HttpService,
    private formService: QuestionControlService,
    private datepipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) private formdata: {
      maxid: any,
      mobileno: any,
      check: any,
      fromdate: any,
      todate: any,
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
  }
  ngAfterViewInit(): void {
    console.log(this.formdata);
    this.searchform.controls['maxid'].setValue(this.formdata.maxid);
    this.searchform.controls['mobile'].setValue(this.formdata.mobileno);
    this.searchform.controls['checkbox'].setValue(this.formdata.check);
    this.search();
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
    }
    this.searchform.controls['checkbox'].valueChanges.subscribe(value=>{
      console.log(value);
      if(value == true)
      {
        this.searchform.controls['fromdate'].enable();
        this.searchform.controls['todate'].enable();
      }
      else
      {
        this.searchform.controls['fromdate'].disable();
        this.searchform.controls['todate'].disable();
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
      }
    })
    this.searchform.controls['fromdate'].valueChanges.subscribe( (val) => {
      this.questions[5].minimum = val;
    })
  }
  search()
  {
    const arr = this.searchform.value.maxid.split('.');
    var regno = arr[1];
    var iacode = arr[0];
    if(regno == '' || regno == undefined || regno == null)
    {
      regno = '';
      iacode = ''
    }
    if(this.searchform.value.billno == null || this.searchform.value.billno == '' || this.searchform.value.billno == undefined)
    {
      this.searchform.value.billno = '';
    }
    if(this.searchform.value.mobileno == null || this.searchform.value.mobileno == '' || this.searchform.value.mobileno == undefined)
    {
      this.searchform.value.mobileno = '';
    }
    if(this.searchform.value.checkbox == false || this.searchform.value.checkbox == '' || this.searchform.value.checkbox == null)
    {
      this.searchform.value.fromdate = new Date();
      this.searchform.value.todate = new Date();
      this.searchform.value.checkbox = false;
    }
    this.http.get(BillDetailsApiConstants.getsearchopbills(
      this.searchform.value.billno,
      regno,
      iacode,
      this.searchform.value.mobile,
      this.searchform.value.checkbox,
      this.datepipe.transform(this.searchform.value.fromdate, "YYYY-MM-dd"),
      this.datepipe.transform(this.searchform.value.todate, "YYYY-MM-dd"),
      this.hsplocationId
    ))
    .pipe(takeUntil(this._destroying$))
    .subscribe(res=>{
      console.log(res);
      this.getsearchopbillslist = res;
      for(var i = 0 ; i < res.length; i++)
      {
        this.getsearchopbillslist[i].sno = i + 1;
      }
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
      })
      console.log(this.getsearchopbillslist);
    })
    console.log(this.table);
  }
  clear()
  {
    this.searchform.reset();
    this.searchform.controls['fromdate'].setValue(new Date());
    this.searchform.controls['todate'].setValue(new Date());
    this.searchform.controls['maxid'].setValue(this.cookie.get("LocationIACode") + ".");
    this.getsearchopbillslist = [];
  }
}
