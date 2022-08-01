import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { QuestionControlService } from "../../../../../../shared/ui/dynamic-forms/service/question-control.service";
import { BillingForm } from "@core/constants/BillingForm";
import { DepositType, ServiceType } from "@core/types/PatientPersonalDetail.Interface";
import { CookieService } from "@shared/services/cookie.service";

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
  isNSSHLocation: boolean = false;

  servicetypeList: ServiceType[] = [];
  deposittypeList: DepositType[] = [];

  constructor(private formService: QuestionControlService, private cookie: CookieService) { }

  ngOnInit(): void {
    let formResult = this.formService.createForm(
      this.servicedepositformData.properties,
      {}
    );
    this.servicedepositForm = formResult.form;
    this.questions = formResult.questions;
    this.isNSSHLocation = true; // this.cookie.get("LocationIACode") == "NSSH" ? true : false;

    if(this.data.type == "Deposit")
    {
      this.servicetypeList = this.data.servicetypeList;
      this.deposittypeList = this.data.deposittypeList;  
      this.questions[0].options = this.servicetypeList.map((l) => {
        return { title: l.name, value: l.id };
      });
  
      this.questions[1].options = this.deposittypeList.map((l) => {
        return { title: l.advanceType, value: l.id };
      });
    }
    else if(this.data.type == "Refund")
    {
      this.onRefundpage = this.data.refundreceiptpage;
      this.servicetype = this.data.selectedservicedeposittype.serviceTypeName;
      this.deposithead = this.data.selectedservicedeposittype.advanceType;      
    }
   
  }
  ngAfterViewInit(): void{
    this.servicedepositForm.controls["deposithead"].setValue({ title: "-- Select Advance Type --", value: 0 });
    this.servicedepositForm.controls["servicetype"].setValue({ title: "Medical services @0.000", value: 1781 });
  }
}




