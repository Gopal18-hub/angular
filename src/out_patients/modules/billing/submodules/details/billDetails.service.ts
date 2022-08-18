import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
@Injectable({
  providedIn: "root",
})

export class billDetailService{
    serviceList: any = [];
    patientbilldetaillist: any = [];
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
}