import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({ 
    providedIn: 'root' 
})

export class DepositService {
 subject = new Subject<any>();

 transactionamount:any = 0.00;
 MOP:string = "Cash";
 data:any=[];

    setFormList(dataList: any) {
        if(dataList.cashamount > 0)
        {
            this.transactionamount = Number(dataList.cashamount).toFixed(2);
            this.MOP = "Cash";
        }
        else if(dataList.chequeamount > 0){
            this.transactionamount = Number(dataList.chequeamount).toFixed(2);
            this.MOP = "Cheque";
        }
        else if(dataList.creditamount > 0){
            this.transactionamount = Number(dataList.creditamount).toFixed(2);
            this.MOP = "Credit Card";
        }
        else if(dataList.demandamount > 0){
            this.transactionamount = Number(dataList.demandamount).toFixed(2);
            this.MOP = "Demand Draft";
        }
        else if(dataList.onlineamount > 0){
            this.transactionamount = Number(dataList.onlineamount).toFixed(2);
            this.MOP = "Online";
        }
        else if(dataList.paytmamount > 0){
            this.transactionamount = Number(dataList.paytmamount).toFixed(2);
            this.MOP = "PayTM";
        }
        else if(dataList.upiamount > 0)
        {
            this.transactionamount = Number(dataList.upiamount).toFixed(2);
            this.MOP = "UPI";
        }
        else if(dataList.internetamount > 0)
        {
            this.transactionamount = Number(dataList.internetamount).toFixed(2);
            this.MOP = "Internet Banking";
        }
        this.data = [];
        this.data.push({           
                transactionamount :  this.transactionamount, MOP: this.MOP
            
        });
    }

    getFormLsit() {
        return this.data;
    }
}