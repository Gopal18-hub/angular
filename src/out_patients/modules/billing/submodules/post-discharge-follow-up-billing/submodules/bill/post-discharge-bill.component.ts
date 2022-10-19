import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QuestionControlService } from '@shared/ui/dynamic-forms/service/question-control.service';
import { PostDischargeServiceService } from '../../post-discharge-service.service';
import { MaxHealthSnackBarService } from '@shared/ui/snack-bar';
import { ApiConstants } from '@core/constants/ApiConstants';
import { HttpService } from '@shared/services/http.service';
import { CookieService } from '@shared/services/cookie.service';
import { MessageDialogService } from '@shared/ui/message-dialog/message-dialog.service';
import { createpostdischargeconsultbill } from '@core/models/createpostdischargeconsultbill.Model';
import { Subject, takeUntil } from 'rxjs';
import { ReportService } from '@shared/services/report.service';
import { isNumeric } from 'tslint';
@Component({
  selector: 'out-patients-post-discharge-bill',
  templateUrl: './post-discharge-bill.component.html',
  styleUrls: ['./post-discharge-bill.component.scss']
})
export class PostDischargeBillComponent implements OnInit {

  config: any = {
    clickedRows: false,
    actionItems: false,
    dateformat: "dd/MM/yyyy",
    selectBox: false,
    removeRow: true,
    displayedColumns: [
      "sno",
      "serviceName",
      "itemName",
      "precaution",
      "procedureDoctor",
      "type",
      "credit",
      "cash",
      "disc",
      "discAmount",
      "totalAmount",
      "gst",
      "gstValue",
    ],
    columnsInfo: {
      sno: {
        title: "S.No.",
        type: "number",
        style: {
          width: "80px",
        },
      },
      serviceName: {
        title: "Services Name",
        type: "string",
        style: {
          width: "150px",
        },
      },
      itemName: {
        title: "Item Name / Doctor Name",
        type: "string",
        style: {
          width: "200px",
        },
      },
      precaution: {
        title: "Precaution",
        type: "string_link",
        style: {
          width: "100px",
        },
      },
      procedureDoctor: {
        title: "Procedure Doctor",
        type: "string",
        style: {
          width: "130px",
        },
      },
      type: {
        title: "Qty / Type",
        type: "string",
        style: {
          width: "190px",
        },
      },
      credit: {
        title: "Credit",
        type: "string",
        style: {
          width: "100px",
        },
      },
      cash: {
        title: "Cash",
        type: "string",
        style: {
          width: "100px",
        },
      },
      disc: {
        title: "Disc %",
        type: "string",
        style: {
          width: "80px",
        },
      },
      discAmount: {
        title: "Disc Amount",
        type: "number",
        style: {
          width: "120px",
        },
      },
      totalAmount: {
        title: "Total Amount",
        type: "number",
        style: {
          width: "130px",
        },
      },
      gst: {
        title: "GST%",
        type: "number",
        style: {
          width: "80px",
        },
      },
      gstValue: {
        title: "GST Value",
        type: "number",
        style: {
          width: "100px",
        },
      },
    },
  };
  billFormData = {
    title: "",
    type: "object",
    properties: {
      coupon: {
        type: "tel",
        readonly: true
      },
      couponvalidate: {
        type: "checkbox",
        options: [{ title: "" }],
      }
    }
  }
  billform!: FormGroup;
  questions: any;
  data: any = [];
  IsValidateCoupon: boolean = false;
  makebillbtn: boolean = false;
  printbill: boolean = true;
  couponcheck: boolean = false;
  postdischagesave!: createpostdischargeconsultbill;
  private readonly _destroying$ = new Subject<void>();
  constructor( 
    private formservice: QuestionControlService,
    public service: PostDischargeServiceService,
    private snackbar: MaxHealthSnackBarService,
    private http: HttpService,
    public cookie: CookieService,
    private msgdialog: MessageDialogService,
    private reportService: ReportService
    ) { }

  ngOnInit(): void {
    let formresult = this.formservice.createForm(
      this.billFormData.properties,
      {}
    );
    this.billform = formresult.form;
    this.questions = formresult.questions; 
    this.data = this.service.billItems;
    let popuptext: any = [];
    this.service.billItems.forEach((item: any, index: number) => {
      item["sno"] = index + 1;
      if (item.popuptext) {
        popuptext.push({
          name: item.itemName,
          description: item.popuptext,
        });
      }
    });
    console.log(this.data);
    if(this.data.length != 0)
    {
      this.questions[0].readonly = false;
    }
    this.service.clearAllItems.subscribe((clearItems) => {
      if (clearItems) {
        this.data = [];
      }
    }); 
    console.log(this.service.billModified);
    if(this.service.billModified)
    {
      this.billform.controls['coupon'].setValue(this.service.activecoupon);
      this.couponcheck = true;
      this.questions[0].readonly = true;
      this.IsValidateCoupon = true;
    }
  }

  ngAfterViewInit(): void{
    this.questions[0].elementRef.addEventListener("keypress", (event: any) => {
      console.log(event);
      if(event.key == 'Enter')
      {
        console.log('event trigger')
        this.validatecoupon();
      }
    })
  }

  rowRwmove($event: any) {
    this.service.deleteFromService(
      this.service.billItems[$event.index]
    );
    this.service.billItems.splice($event.index, 1);
    // this.service.makeBillPayload.ds_insert_bill.tab_d_opbillList.splice(
    //   $event.index,
    //   1
    // );
    this.service.billItems = this.service.billItems.map(
      (item: any, index: number) => {
        item["sno"] = index + 1;
        return item;
      }
    );

    this.refreshTable();
  }

  refreshTable() {
    this.data = [...this.service.billItems];
    this.service.calculateTotalAmount();
    this.billform.reset();
    this.IsValidateCoupon = false;
    this.makebillbtn = false;
    this.questions[0].readonly = true;
    this.couponcheck = false;
    this.service.billModified = false;
  }

  validatecoupon()
  {
    console.log('coupon validate');
    if(!this.billform.value.coupon)
    {
      this.snackbar.open('Please Enter Coupon');
    }
    else{
      console.log(this.service.activeMaxId);
      this.http.get(ApiConstants.validateCoupon(
        this.billform.value.coupon,
        Number(this.cookie.get('HSPLocationId')),
        this.service.activeMaxId.iacode,
        Number(this.service.activeMaxId.regNumber),
        Number(this.data[0].specialisationID)
      ))
      .subscribe(res => {
        console.log(res);
        if(res.length == 0 || res == null)
        {
          const dialogref = this.msgdialog.info("Either Invalid Coupon or already used");
          dialogref.afterClosed().subscribe(() => {
            this.billform.controls['coupon'].reset();
          })
        }
        else
        {
          this.IsValidateCoupon = true;
          this.makebillbtn = true;
          this.questions[0].readonly = true;
          console.log(this.data);
          console.log(this.service.consultationItems);
          this.data[0].price = "0.00";
          this.data[0].totalAmount = "0.00";
          this.service.consultationItems[0].price = "0.00";
          this.service.calculateTotalAmount();
          this.service.modified();
          // this.billform.controls['couponvalidate'].setValue(true);
          this.couponcheck = true;
          this.questions[0].elementRef.blur();
          this.service.setactivecoupon(this.billform.controls['coupon'].value);
        }
      },
      (error) => {
        console.log("error",error);
      })
    }
  }
  billid: any;
  flag: any;
  makebill()
  {
    this.http.post(ApiConstants.savepostdischarge, this.makebillreqbody())
    .pipe(takeUntil(this._destroying$))
    .subscribe((res) => {
      console.log(this.postdischagesave);
      console.log(res);
      if(res[0].successFlag)
      {
        this.service.setBilledStatus();
        this.makebillbtn = false;
        this.config.removeRow = false;
        this.config = { ...this.config };
        const dialogref =  this.msgdialog.success('Visit has been done successfully');
        dialogref.afterClosed().subscribe(() => {
          const yesorno = this.msgdialog.confirm(
            '',
            'Do you want to print report?'
          );
          yesorno.afterClosed().subscribe((res) => {
            if(res && 'type' in res) 
            {
              if(res.type == 'yes')
              {
                this.print();
              }
            }
          })
        })
        this.printbill = false;
        this.billid = res[0].billId;
        this.flag = res[0].returnflagToken;
      }
    })
  }
  makebillreqbody()
  {
    return (this.postdischagesave = new createpostdischargeconsultbill(
      Number(this.service.activeMaxId.regNumber),
      this.service.activeMaxId.iacode,
      Number(this.cookie.get('HSPLocationId')),
      Number(this.billform.controls['coupon'].value),
      Number(this.cookie.get('UserId')),
      Number(this.cookie.get('StationId')),
      10484,
      Number(this.service.consultationItems[0].doctorId),
      Number(this.service.consultationItems[0].specialization)
    ))
  }
  print()
  {
    console.log(this.billid, this.flag);
    this.openReportModal('PostDischargeFollowUpReport')
  }
  openReportModal(btnname: string) {
    this.reportService.openWindow('Post Discharge Follow Up Visit Report - '+ this.billid, btnname, {
      opbillid: this.billid,
      flag: this.flag,
    });
  }
}
