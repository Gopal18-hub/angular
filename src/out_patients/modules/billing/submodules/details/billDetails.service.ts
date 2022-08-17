import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})

export class billDetailService{
    serviceList: any = [];
    patientbilldetaillist: any = [];
}