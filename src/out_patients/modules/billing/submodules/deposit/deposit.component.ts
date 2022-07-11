import { Component, OnInit, ViewChild } from '@angular/core';
import { RefundDialogComponent } from './refund-dialog/refund-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DepositDialogComponent } from './deposit-dialog/deposit-dialog.component';
import { FormGroup } from '@angular/forms';
import { QuestionControlService } from '@shared/ui/dynamic-forms/service/question-control.service';
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { Router } from "@angular/router";
import { FormSixtyComponent } from '@core/UI/billing/submodules/form60/form-sixty.component';

@Component({
  selector: 'out-patients-deposit',
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.scss']
})
export class DepositComponent implements OnInit {

  constructor(public matDialog: MatDialog, private formService:QuestionControlService, private router: Router) { }
  
  @ViewChild("deposittable") deposittable: any;

  depositformdata = {
    type:"object",
    title:"",
    properties:{
      maxid:{
        type:"string",
       // title: "Max ID"
      },
      mobileno:{
        type:"number",
        //title: "Mobile No."
      },
      checkbox:{
        type:"checkbox",
        options:[{
          title:""
        }]
      },
      dateInput:{
        type:"date"
      },     
      totaldeposit:{
        type:"string",
       // title:"Total Deposit",
        defaultValue: "2000.00",
        readonly:true
      },
      avalaibledeposit:{
        type:"string",
       // title:"Avalaible Deposit",
        defaultValue: "1000.00",
        readonly:true
      },
      totalrefund:{
        type:"string",
       // title:"Total Refund",
        defaultValue: "0.00",
        readonly:true
      },
      remarks:{
        type:"textarea",
      //  title:"Remarks",
        defaultValue: "Write Remarks",
        readonly:true
      },
      panno: {
        type: "string"
      },     
      mainradio: {
        type: "radio",
        required: false,
        options: [
          { title: "Form 60", value: "form60" },
          { title: "Pan card No.", value: "pancardno" },
        ]
      },
    }
  }

  depositconfig: any = {
    clickedRows: true,
    clickSelection: "multiple",
    dateformat: "dd/MM/yyyy",
    selectBox: true,
    displayedColumns: [
      "deposittype",
      "receiptno",
      "datetime",
      "deposit",
      "usedop",
      "usedip",
      "refund",
      "balance",
      "taxpercentage",
      "totaltaxvalue",
      "deposithead",
      "servicetype",
      "operatornameid",    
    ],
    columnsInfo: {
      deposittype: {
        title: "Deposit Type",
        type: "string",
      },
      receiptno: {
        title: "Receipt No.",
        type: "number",
      },
      datetime: {
        title: "Date & Time",
        type: "date",
      },
      deposit: {
        title: "Deposit",
        type: "string",
        tooltipColumn: "modifiedPtnName",
      },
      usedop: {
        title: "Used(OP)",
        type: "string",
      },
      usedip: {
        title: "Used(IP)",
        type: "number",
      },
      refund: {
        title: "Refund",
        type: "string",
        tooltipColumn: "uEmail",
      },
      balance: {
        title: "Balance",
        type: "string",
      },
      taxpercentage: {
        title: "Tax %",
        type: "checkbox",
      },
      totaltaxvalue: {
        title: "Total Tax Value",
        type: "number",
      },
      deposithead: {
        title: "Deposit Head",
        type: "string",
      },
      servicetype: {
        title: "Service Type",
        type: "string",
      },
      operatornameid: {
        title: "Operator Name & ID",
        type: "string",
      },
    },
  };

  depositForm !: FormGroup;
  questions:any;
  
  private readonly _destroying$ = new Subject<void>();

  ngOnInit(): void {
    let formResult = this.formService.createForm(
      this.depositformdata.properties,{}
    );
    this.depositForm=formResult.form;
    this.questions=formResult.questions;
  }
  openrefunddialog()
  {
    this.matDialog.open(RefundDialogComponent, { 
      width: "70vw", 
      height: "98vh", 
      data:{
        Mobile: 9898989898, 
        Mail: "mail@gmail.com"
      }});
  }
  openDepositdialog(){
    this.matDialog.open(DepositDialogComponent,{width:'70vw',height:'98vh'});
  }

  openinitiatedeposit(){
    this.router.navigate(["out-patient-billing", "initiate-deposit"]);
  }
  ngAfterViewInit(): void{
    this.depositForm.controls["mainradio"].valueChanges.subscribe((value:any)=>{
      if(value == "form60")
      {
        this.matDialog.open(FormSixtyComponent, {width: "50vw", height: "98vh"});
        this.depositForm.controls["panno"].disable();
      }
      else{
        this.depositForm.controls["panno"].enable();
      }
    });
  }

}
