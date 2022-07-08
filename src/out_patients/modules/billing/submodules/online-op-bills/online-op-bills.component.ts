import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { QuestionControlService } from '@shared/ui/dynamic-forms/service/question-control.service';
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";


@Component({
  selector: 'out-patients-online-op-bills',
  templateUrl: './online-op-bills.component.html',
  styleUrls: ['./online-op-bills.component.scss']
})
export class OnlineOpBillsComponent implements OnInit {

  constructor(public matDialog: MatDialog, private formService:QuestionControlService) { }
  
  @ViewChild("onlineopbillstable") onlineopbillstable: any;
  onlineopbillsformdata = {
    type:"object",
    title:"",
    properties:{
      fromdate:{
        type:"date",
      },
      todate:{
        type:"date",
      },
      specialisation:{
        type:"dropdown",        
      },
    }
  }
  onlineopbillsconfig: any = {
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

  onlineopbillsForm !: FormGroup;
  questions:any;
  
  private readonly _destroying$ = new Subject<void>();

 
  ngOnInit(): void {
    let formResult = this.formService.createForm(
      this.onlineopbillsformdata.properties,{}
    );
    this.onlineopbillsForm=formResult.form;
    this.questions=formResult.questions;
  }

}
