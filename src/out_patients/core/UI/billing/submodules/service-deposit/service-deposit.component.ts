import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { QuestionControlService } from "../../../../../../shared/ui/dynamic-forms/service/question-control.service";
import { BillingForm } from "@core/constants/BillingForm";
import { DepositType, ServiceType } from "@core/types/PatientPersonalDetail.Interface";
import { CookieService } from "@shared/services/cookie.service";
import { HttpService } from '@shared/services/http.service';
import { ApiConstants } from "@core/constants/ApiConstants";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { DepositService } from "@core/services/deposit.service";

@Component({
  selector: "max-service-deposit",
  templateUrl: "./service-deposit.component.html",
  styleUrls: ["./service-deposit.component.scss"],
})
export class ServiceDepositComponent implements OnInit {

  @Input() data!: any;
  
  servicedepositformData = BillingForm.servicedepositFormData;
  servicedepositForm!: FormGroup;
  questions: any;
  onRefundpage: boolean = false;
  servicetype: string = "Selected Service Type";
  deposithead: string = "Selected Deposit Head";

  servicetypeList: ServiceType[] = [];
  deposittypeList: DepositType[] = [];
  hspLocationid:any = Number(this.cookie.get("HSPLocationId"));

  constructor(private formService: QuestionControlService, private cookie: CookieService, 
    private http: HttpService, private depositservice: DepositService ) { }

  private readonly _destroying$ = new Subject<void>();
  ngOnInit(): void {
    let formResult = this.formService.createForm(
      this.servicedepositformData.properties,
      {}
    );
    this.servicedepositForm = formResult.form;
    this.questions = formResult.questions;
    
     if(this.data.type == "Deposit")
    {
      this.servicetypeList = this.data.servicetypeList;
      this.questions[0].options = this.servicetypeList.map((l) => {
        return { title: l.name, value: l.id };
      });
  
      this.getDepositType();
    }
    else if(this.data.type == "Refund")
    {
      this.onRefundpage = this.data.refundreceiptpage;
      this.servicetype = this.data.selectedservicedeposittype.serviceTypeName;
      this.deposithead = this.data.selectedservicedeposittype.advanceType;      
    }   
    this.depositservice.clearAllItems.subscribe((clearItems) => {
      if (clearItems) {
        this.servicedepositForm.reset();
      this.servicedepositForm.controls["deposithead"].setValue(0);
      this.servicedepositForm.controls["servicetype"].setValue(1781);
      }
    });
  }

  ngAfterViewInit(): void{
    this.servicedepositForm.controls["servicetype"].setValue(1781);
    this.servicedepositForm.controls["deposithead"].setValue(0);
  }
  getDepositType() {
    this.http
      .get(ApiConstants.getadvancetype(this.hspLocationid))
      .pipe(takeUntil(this._destroying$))
      .subscribe((resultData: any) => {
        this.deposittypeList = resultData;
        console.log(resultData);
        let defalutSelector:any;
        this.questions[1].options = this.deposittypeList.map((l) => {
          if(l.advanceType=="Deposit"){
            defalutSelector={ title: l.advanceType, value: l.id };
          }
          return { title: l.advanceType, value: l.id };
        });
        this.questions[1]={...this.questions[1]}
        if(defalutSelector){
            this.servicedepositForm.controls["deposithead"].setValue(defalutSelector.value);
        }
       // this.questions[1].options.push({ title: "Select Advance Type", value:0});
      
      });
  }
}




