import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
@Injectable({
  providedIn: "root",
})

export class billDetailService{
    serviceList: any = [];
    patientbilldetaillist: any = [];
    sendforapproval: any = [];
    totalrefund: any;
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