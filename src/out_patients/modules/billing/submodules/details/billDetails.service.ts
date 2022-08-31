import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
@Injectable({
  providedIn: "root",
})

export class billDetailService{
    serviceList: any = [];
    billafterrefund: any = [];
    patientbilldetaillist: any = [];
    sendforapproval: any = [];
    totalrefund: any;
    paymentmode: any = [
        {title: 'Cash', value: 1},
        {title: 'Cheque', value: 2},
        {title: 'Credit Card', value: 3},
        {title: 'Online Payment', value: 4},
        {title: 'Mobile Payment', value: 5},
        {title: 'UPI', value: 6},
    ]
    constructor(
        private router: Router
    )
    {

    }
    clear()
    {
        this.serviceList = [];
        this.patientbilldetaillist = [];
        this.router.navigate(['out-patient-billing/details'])
        .then(()=>{
            window.location.reload;
        })
    }
    addForApproval(data: any)
    {
        this.sendforapproval.push(data);
    }
    removeForApproval(index:any)
    {
        this.sendforapproval.splice(index, 1);
    }
    calculateTotalRefund()
    {
        this.totalrefund = 0;
        this.sendforapproval.forEach((i: any)=>{
            this.totalrefund += i.amount;
        })
    }
}