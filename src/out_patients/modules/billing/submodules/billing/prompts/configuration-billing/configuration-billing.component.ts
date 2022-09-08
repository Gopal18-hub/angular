import {Component, OnInit,Inject, AfterViewInit, ViewChild } from '@angular/core';
import { FormGroup } from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { QuestionControlService } from '@shared/ui/dynamic-forms/service/question-control.service';
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: 'out-patients-configuration-billing',
  templateUrl: './configuration-billing.component.html',
  styleUrls: ['./configuration-billing.component.scss']
})
export class ConfigurationBillingComponent implements OnInit {

  constructor(private formService: QuestionControlService,    public matDialog: MatDialog,
    private dialogRef: MatDialogRef<ConfigurationBillingComponent>,
    public messageDialogService: MessageDialogService,
     @Inject(MAT_DIALOG_DATA) public data : {serviceconfiguration:any,patientdetails:any,companyname:string}) { }
  questions: any;
  Configurationbilling!: FormGroup;
  companyservice:any=[];
  patientservice:any=[];
  tableselectionexists:boolean = false;
  companyselectedservice:any=[];

  private readonly _destroying$ = new Subject<void>();
  @ViewChild("companybillingtable") companybillingtable: any;

 
  companybillingconfig: any = {
    clickedRows: true,
    clickSelection: "multiple",
    selectBox: true,
    displayedColumns: [
      "itemname",
      "servicename"
    ],
    columnsInfo: {
      itemname: {
        title: "Item Name",
        type: "string",
        style: {
          width: "25rem",
        },
      },
      servicename: {
        title: "Service Name",
        type: "string",
        style: {
          width: "10rem",
        },
      },     
    },
  };
  patientbillingconfig: any = {
    selectBox: false,
    displayedColumns: [
      "itemname",
      "servicename"
    ],
    columnsInfo: {
      itemname: {
        title: "Item Name",
        type: "string",
        style: {
          width: "25rem",
        },
      },
      servicename: {
        title: "Service Name",
        type: "string",
        style: {
          width: "10rem",
        },
      },     
    },
  };
  patientname: string | undefined;
  maxid: string | undefined;
  companyname: string | undefined;
  tpa: string | undefined;
  creditlimit: string | undefined;
  
  ngOnInit(): void {
    this.companyservice = this.data.serviceconfiguration;
    this.maxid = this.data.patientdetails.iacode + "."+ this.data.patientdetails.registrationno;
    this.companyname = this.data.companyname;
    this.patientname = this.data.patientdetails.firstname;
    if(this.companyselectedservice)
    this.patientservice = this.companyselectedservice;
  }

  clearconfiguration(){
    this.companyservice = [];
    this.patientservice = [];
    this.maxid = "";
    this.patientname = "";
    this.companyname = "";
    this.tpa = "";
    this.creditlimit = "";
  }
  saveconfiguration(){
    const savedialogRef = this.messageDialogService.confirm(
      "",
      `Do you want to Save Services Configuration!`
    );

    savedialogRef.afterClosed().subscribe((value) => {
    if(value.type == "yes"){
      this.dialogRef.close();
    }
    });
  }

  ngAfterViewInit(){
      this.companybillingtable.selection.changed
    .pipe(takeUntil(this._destroying$))
    .subscribe((res: any) => {
      if (this.companybillingtable.selection.selected.length > 0) {
        this.tableselectionexists = true;
        this.companyselectedservice.push(res.added);
        console.log(this.companyselectedservice);
      }
      else{
        this.tableselectionexists = false;
      }
    });    
  }

}
