import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup} from '@angular/forms';
import { QuestionControlService } from '../../../../../shared/ui/dynamic-forms/service/question-control.service';
import { __values } from 'tslib';
import { DatePipe } from "@angular/common";
import { HttpService } from '@shared/services/http.service';
import { ApiConstants } from '../../../../../out_patients/core/constants/ApiConstants';
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { DenyOrderListTypeModel } from "@core/models/denyOrderListModel.Model";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";
import { SaveInvestigationOrderModel } from '@core/models/saveInvestigationOrderModel.Model';
import { ModifyInvestigationOrderModel } from '@core/models/modifyInvestigationOrderModel.Model';
import { MatDialog } from '@angular/material/dialog';
import {ScheduleDateDialogComponent} from '../schedule-date-dialog/schedule-date-dialog.component';
@Component({
  selector: 'out-patients-medicine-orders',
  templateUrl: './medicine-orders.component.html',
  styleUrls: ['./medicine-orders.component.scss']
})
export class MedicineOrdersComponent implements OnInit {
  @ViewChild("medOrderDetailsTable") medOrderDetailsTable: any;
  investigationForm!: FormGroup;
  from: any;
  to: any;
  today = new Date();
  isShowInvestigation: boolean = true;
  isShowMedical: boolean = false;
  isBtnDisable: boolean = false;
  isBtnDisableClear: boolean = true;
  isDateDisable : boolean = false;
  isBtnDenialDisable : boolean = false;
  name: any;
  questions: any;
  private readonly _destroying$ = new Subject<void>();

  medOrderLists : any=[];
  medOrderList : any;
  medOrderDetails : any;
  patientInfo : any;
  tokenNo : any;

  investigationDetails: any;
  public denyOrderTypeList: DenyOrderListTypeModel[] = [];

  objPhyOrder: any=[];
  objdtdenialorder:any;
  physicianOrderList : any =[];

  saveInvestigationOrderModel: SaveInvestigationOrderModel | undefined;
  

  investigationFormData = {
    title: "",
    type: "object",
    properties: {
      datecheckbox: {
        type: "checkbox",
        options: [{ title: "", value: "" }],
        
      },
      fromdate: {
        type: "date",
      },
      todate: {
        type: "date",
      },
      maxid: {
        type: "dropdown",
        placeholder: "Select",
        options: [
          { title: "Max Id", value: "maxId" },
          { title: "Patient Name", value: "patientName" },
          { title: "Doctor Name", value: "doctorName" },
          { title: "Mobile Number", value: "mobile" }
        ],
      },
      input: {
        type: "string",
        placehokder: "BLKH.",
      },

      status: {
        type: "dropdown",
        placeholder: "Select",
        options: [
          { title: "All", value: "All" },
          { title: "Billed", value: "Billed" },
          { title: "Unbilled", value: "Unbilled" },
          { title: "Partially billed", value: "Partially Billed" },
          { title: "Denied", value: "Denied" },
        ],
      },
      denyorder: {
        type: "dropdown",
        placeholder: "Select",
        options: this.denyOrderTypeList,      
      },
      remarks: {
        type: "string",
      }

    }
  }

  medListConfig: any  = {
    actionItems: false,
    dateformat: 'dd/MM/yyyy',
    clickSelection: "single",
    selectBox : false,
    displayedColumns: ['orderId', 'maxid', 'ptnName', 'docName', 'deptName', 'visitDate', 'mobileNo', 'mrpValue', 'channel', 'billNo', 'orderStatus'],
    rowLayout: { dynamic: { rowClass: "row['orderStatus']" } },
    clickedRows: true,
    columnsInfo: {
      orderId: {
        title: 'Order Id',
        type: 'string',
        style: {
          width: "115px",
        },
      },
      maxid: {
        title: 'Max Id',
        type: 'string',
        style: {
          width: "105px",
        },
      },
      ptnName: {
        title: 'Patient Name',
        type: 'string',
        style: {
          width: "135px",
        },
      },
      docName: {
        title: 'Doctor Name',
        type: 'string',
        style: {
          width: "165px",
        },
      },
      deptName: {
        title: 'Department',
        type: 'string',
        style: {
          width: "135px",
        },
      },
      visitDate: {
        title: 'Visit Date',
        type: 'date',
        style: {
          width: "85px",
        },
      },
      mobileNo: {
        title: 'Mobile No.',
        type: 'string',
        style: {
          width: "105px",
        },
      },
      mrpValue: {
        title: 'Amount',
        type: 'string'
      },
      channel: {
        title: 'Channel',
        type: 'string'
      },
      billNo: {
        title: 'Bill No.',
        type: 'string',
        style: {
          width: "130px",
        },
      },
      orderStatus: {
        title: 'Order Status',
        type: 'string',
        style: {
          width: "125px",
        },
      }

    }
 
    }
  medDetailsConfig: any  = {
    actionItems: false,
    dateformat: 'dd/MM/yyyy - hh:mm:ss a',
    selectBox : true,
    displayedColumns: ['drug', 'doctor','priority','days','specialization','visitDatetime','acdRemarks'],
    columnsInfo: {
      drug : {
        title: 'Drug Name',
        type: 'string',
        style: {
          width: "20%",
        },
      },
      doctor : {
        title: 'Schedule',
        type: 'string',
        style: {
          width: "15%",
        },
      },
      priority : {
        title: 'Drug Qty.',
        type: 'string',
        style: {
          width: "8%",
        },
      },
      days : {
        title: 'Days',
        type: 'string',
        style: {
          width: "5%",
        },
      },
      specialization : {
        title: 'Dosage Name',
        type: 'string',
        style: {
          width: "10%",
        },
      },
      visitDatetime : {
        title: 'Visit Date & Time',
        type: 'date',
        style: {
          width: "12%",
        },
      },
    
      acdRemarks : {
        title: 'ACD Remarks',
        type: 'input',
        style: {
          width: "30%",
        },
      },
     
    }
 
    }
  constructor(private formService: QuestionControlService, public datepipe: DatePipe, private http: HttpService,private messageDialogService: MessageDialogService,private matdialog: MatDialog,) {
  }

  ngOnInit(): void {   
    // this.matdialog.open(ScheduleDateDialogComponent, {
    //   height:"30vh",
    //   width: "30vw",
    //   });
    let formResult: any = this.formService.createForm(
      this.investigationFormData.properties,
      {}
    );
    this.investigationForm = formResult.form;
    this.questions = formResult.questions;
    this.investigationForm.controls["fromdate"].disable();
    this.investigationForm.controls["todate"].disable();
    let todaydate = new Date();
    this.investigationForm.controls["fromdate"].setValue(todaydate);

    this.investigationForm.controls["todate"].setValue(todaydate);
    if (this.from == undefined && this.to == undefined) {
      this.from = this.datepipe.transform(
        new Date().setMonth(new Date().getMonth() - 2),
        "yyyy-MM-dd"
      );
      this.to = this.datepipe.transform(new Date(), "yyyy-MM-dd");
    }
    this.investigationForm.controls["denyorder"].disable();
      //Deny Order List
      this.http.get(ApiConstants.getdenyreasonforacd)    
      .pipe(takeUntil(this._destroying$))
      .subscribe((res: any) => {
        this.denyOrderTypeList = res;
        this.questions[6].options = this.denyOrderTypeList.map((e) => {
          return { title: e.name, value: e.id };
        });
      })
  }
  ngAfterViewInit(): void {
    this.investigationForm.controls["denyorder"].valueChanges.subscribe((value:any)=>{
if(value===10)
{
  this.matdialog.open(ScheduleDateDialogComponent, {
    height:"30vh",
    width: "30vw",
    });

}
   
      
    })}
  search() {
    this.medOrderList=[]    

   //this.http.get(ApiConstants.geteprescriptdrugorders("2020-12-11", "2020-12-11", 7))
     this.http.get(ApiConstants.geteprescriptdrugorders(this.datepipe.transform(this.investigationForm.controls["fromdate"].value, "YYYY-MM-dd"), this.datepipe.transform(this.investigationForm.controls["todate"].value, "YYYY-MM-dd"), 7))
      .pipe(takeUntil(this._destroying$))
      .subscribe((res: any) => {
        this.medOrderLists=[];
        res.objOrderDetails.forEach((e:any)=>        
      {
        if(this.investigationForm.value.maxid === "maxId")
        if(e.maxid === this.investigationForm.value.input)
        {
          this.medOrderLists.push(e);          
        }
        if(this.investigationForm.value.maxid === "patientName")
        if(e.ptnName === this.investigationForm.value.input)
        {
          this.medOrderLists.push(e);
          
        }
        if(this.investigationForm.value.maxid === "doctorName")
        if(e.docName === this.investigationForm.value.input)
        {
          this.medOrderLists.push(e);
          
        }
        if(this.investigationForm.value.maxid === "mobile")
        if(e.mobileNo === this.investigationForm.value.input)
        {
          this.medOrderLists.push(e);
          
        }
        
        if(e.orderStatus === this.investigationForm.value.status)
        {
          this.medOrderLists.push(e);          
        }
       
        if(!this.investigationForm.value.maxid && !this.investigationForm.value.status)
        {
          this.medOrderLists=res.objOrderDetails;
        }
       this.medOrderList=this.medOrderLists;
       console.log(this.medOrderList,"1")
      })
      }) 
      
         
  }

  listRowClick(event:any)
  {
    let maxId = event.row.maxid;   
    this.patientInfo = event.row.maxid +" / "+ event.row.ptnName+" / "+ event.row.mobileNo
   
    //this.http.get(ApiConstants.getphysicianorderdetailep(123123, "SKDD", 7, 0))
      this.http.get(ApiConstants.getphysicianorderdetailep(maxId.toString().split(".")[1],maxId.toString().split(".")[0],7,event.row.orderId))    
      .pipe(takeUntil(this._destroying$))
      .subscribe((res: any) => {
        this.medOrderDetails=res;
        console.log(res, "getphysicianorderdetailep")
      })
      
  }
  denyBtn()
  {    
    this.isBtnDisable= true;
    this.investigationForm.controls["denyorder"].enable();
  }
  //Generate Pharamacy Token
  generateToken()
  {
    this.http.get(ApiConstants.GetPrintQueDetail("MAX-STAGING2"))    
    .pipe(takeUntil(this._destroying$))
    .subscribe((res: any) => { 
     this.tokenNo = res[0].waitnno     ;
      console.log(res, "GetPrintQueDetail")
      if(!this.tokenNo)
      {
        this.messageDialogService.info("Token already generated");
      }
    })
  }
  saveOrUpdate()
  {    
    this.objPhyOrder=[];
    this.objdtdenialorder="";
    this.physicianOrderList=[];
    console.log(this.medOrderDetailsTable.selection.selected,"selected rows");      
    this.medOrderDetailsTable.selection.selected.forEach((e:any) => {
      if(e.drugid !== 0) 
      this.isBtnDenialDisable = false;
      if(this.investigationForm.value.denyorder && !this.investigationForm.value.remarks)
      {
      this.messageDialogService.info("Please enter denial reason remark for order!")
      }
      if(!this.investigationForm.value.denyorder)
      {
        this.messageDialogService.info("Please select denial reason for open order before close!")      
      }      
      if(this.investigationForm.value.remarks && this.investigationForm.value.denyorder){
      this.objPhyOrder.push({
        acDisHideDrug: true,
        visitid: e.visitId,
        drugid: e.drugid,
        acdRemarks: e.acdRemarks
      });
      this.physicianOrderList.push({
        acDisHideDrug: true,
        visitid: e.visitId,
        drugid: e.drugid,
        acdRemarks: e.acdRemarks
      });
    }
    });
   
    this.objdtdenialorder={
    denialid: this.investigationForm.value.denyorder,
    denialremark: this.investigationForm.value.remarks,
    visitid: this.medOrderDetailsTable.selection.selected[0].visitId,
    nextScheduleDate: "",
    nextflag: true      
    }    
    this.Save();
  }
  getSaveModel(): SaveInvestigationOrderModel {
    return new SaveInvestigationOrderModel(
      this.objPhyOrder,
      this.objdtdenialorder,
      1,
      9233
    );
  
  }
  getModifyModel():ModifyInvestigationOrderModel{
    return new ModifyInvestigationOrderModel(
      this.physicianOrderList
    )
  }
  isChecked(event:any)

  {
    if(!this.investigationForm.controls["datecheckbox"].value)
    {
      this.investigationForm.controls["datecheckbox"].setValue(false)
    }
   
    if(this.investigationForm.controls["datecheckbox"].value == false)
    {
      this.investigationForm.controls["fromdate"].enable();
      this.investigationForm.controls["todate"].enable();
    }
    if(this.investigationForm.controls["datecheckbox"].value == true)
    {
      let todaydate = new Date();
      this.investigationForm.controls["fromdate"].setValue(todaydate);  
      this.investigationForm.controls["todate"].setValue(todaydate);
      this.investigationForm.controls["fromdate"].disable();
      this.investigationForm.controls["todate"].disable();
      
    }

   
  
  }  
  Save()
  {    
    console.log(this.getSaveModel(),"model");
    this.http.post(ApiConstants.SaveAndUpdateDiagnosticOrderBill,this.getSaveModel())    
    .pipe(takeUntil(this._destroying$))
    .subscribe((res: any) => {
    if(res === 1)
    {
      this.messageDialogService.success("Saved Successfully!");
    }
    this.objPhyOrder=[];
    this.objdtdenialorder=[];
    this.isBtnDisable = false;
    this.investigationForm.controls["denyorder"].reset();
    this.investigationForm.controls["remarks"].setValue("");
    this.investigationForm.controls["denyorder"].disable();
    }) 

  }
  cancelDenial()
  {
    this.physicianOrderList=[];
    if(this.medOrderDetailsTable.selection.selected.length === 0){this.messageDialogService.info("Please select atleast 1 row to proceed.");}
    else
    this.medOrderDetailsTable.selection.selected.forEach((e:any) => {
      if(e.drugid !== 0) 
      
      this.physicianOrderList.push({
        acDisHideDrug: true,
        visitid: e.visitId,
        drugid: e.drugid,
        acdRemarks: e.acdRemarks
      });
    });
    this.http.post(ApiConstants.modifyphysicianorderdetail(this.tokenNo,9233),this.getModifyModel())
    .pipe(takeUntil(this._destroying$))
    .subscribe((res: any) => {
    if(res.success === true)
    {
      this.messageDialogService.success(res.message);
    }
   
    }) 
  }
  clearMed()
  {
    //clear Form
    this.investigationForm.reset();
    //Clear Grid
    this.medOrderList=[];
    this.medOrderDetails=[];
    //Reset Diasble Btn
    this.isBtnDisable = false;
    let todaydate = new Date();
    this.investigationForm.controls["fromdate"].setValue(todaydate);
    this.investigationForm.controls["todate"].setValue(todaydate);
    this.investigationForm.controls["denyorder"].disable();
  }

}


