import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QuestionControlService } from '@shared/ui/dynamic-forms/service/question-control.service';
import { HttpService } from '@shared/services/http.service';
import { CookieService } from '@shared/services/cookie.service';
import { ApiConstants } from '@core/constants/ApiConstants';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'out-patients-disount-reason',
  templateUrl: './disount-reason.component.html',
  styleUrls: ['./disount-reason.component.scss']
})
export class DisountReasonComponent implements OnInit {

  discAmtFormData = {
    title: "",
    type: "object",
    properties: {
      types: {
        type: "dropdown",
        title: "Discount Types",
        options: [
          { title: "In Bill", value: "In Bill" },
          { title: "In Service", value: "In Service" },
          { title: "In Item", value: "In Item" }
        ],
        placeholder: "-Select-"
      },
      head: {
        type: "dropdown",
        title: "Main Head Discount",
        placeholder: "-Select-"
      },
      reason: {
        type: "dropdown",
        title: "Discount reason",
        placeholder: "-Select-"
      },
      percentage: {
        type: "string",
        title: "Dis%",
        defaultValue: "0.00",
        readonly: true,
      },
      amt: {
        type: "string",
        title: "Dis. Amt",
        defaultValue: "0.00",
        readonly: true
      },
      authorise: {
        type: "dropdown",
        placeholder: "-Select-"
      },
      coupon: {
        type: "string",
      },
      empCode: {
        type: "string",
      },


    }
  }
  discAmtFormConfig: any = {
    actionItems: false,
    //dateformat: 'dd/MM/yyyy',
    selectBox: false,
    displayedColumns: ['sno', 'discType', 'service', 'doctor', 'price', 'disc', 'discAmt', 'totalAmt', 'head', 'reason', 'value'],
    clickedRows: true,
    clickSelection: "single",
    columnsInfo: {
      sno: {
        title: 'S.No',
        type: 'string',
        style: {
          width: "5rem",
        },
      },
      discType: {
        title: 'Discount Type',
        type: 'string',
        style: {
          width: "7rem",
        },
      },
      service: {
        title: 'Service Name',
        type: 'string',
        style: {
          width: "7rem",
        },
      },
      doctor: {
        title: 'Item/Doctor Name',
        type: 'string',
        style: {
          width: "9rem",
        },
      },
      price: {
        title: 'Price',
        type: 'string',
        style: {
          width: "4rem",
        },
      },
      disc: {
        title: 'Disc%',
        type: 'string',
        style: {
          width: "4rem",
        },
      },
      discAmt: {
        title: 'Dis. Amount',
        type: 'string',
        style: {
          width: "6rem",
        },
      },
      totalAmt: {
        title: 'Total Amount',
        type: 'string',
        style: {
          width: "7rem",
        },
      },
      head: {
        title: 'Main Head Discount',
        type: 'string',
        style: {
          width: "10rem",
        },
      },
      reason: {
        title: 'Discount Reason',
        type: 'string',
        style: {
          width: "8rem",
        },
      },
      value: {
        title: 'Value Based',
        type: 'string',
        style: {
          width: "8rem",
        },
      },

    }
  }
  discAmtForm!: FormGroup;
  question: any;
  private readonly _destroying$ = new Subject<void>();
  mainHeadList: { id: number; name: number }[] = [] as any;
  authorisedBy: { id: number; name: number }[] = [] as any;
  discReasonList: { id: number; name: string, discountPer: number }[] = [] as any;
  constructor(
    private formService: QuestionControlService,
    private http: HttpService,
    private cookie: CookieService
  ) { }

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.discAmtFormData.properties,
      {}
    );
    this.discAmtForm = formResult.form;
    this.question = formResult.questions;
    this.getDiscountReasonHead();
    this.getBillDiscountReason();
    this.getAuthorisedBy();
  }

  getDiscountReasonHead()
  {
    this.http.get(ApiConstants.getbilldiscountreasonmainhead(Number(this.cookie.get("HSPLocationId"))))
    .pipe(takeUntil(this._destroying$))
    .subscribe((data) => {
      this.mainHeadList = data;
      this.question[1].options = this.mainHeadList.map((a) => {
        return { title: a.name, value: a.id };
      });
    })
  }

  getBillDiscountReason()
  {
    this.http.get(ApiConstants.getbilldiscountreason(Number(this.cookie.get("HSPLocationId"))))
    .pipe(takeUntil(this._destroying$))
    .subscribe((data) => {
      this.discReasonList = data;
      this.question[2].options = this.discReasonList.map((a) => {
        return { title: a.name, value: a.id, discountPer: a.discountPer };
      });
    })
  }

  getAuthorisedBy()
  {
    this.http.get(ApiConstants.getauthorisedby(Number(this.cookie.get("HSPLocationId"))))
    .pipe(takeUntil(this._destroying$))
    .subscribe((data) => {
      this.authorisedBy = data;
      this.question[5].options = this.authorisedBy.map((a) => {
        return { title: a.name, value: a.id };
      });
    })
  }

}



    
    

