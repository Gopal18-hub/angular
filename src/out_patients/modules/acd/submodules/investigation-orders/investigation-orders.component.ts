import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QuestionControlService } from '../../../../../shared/ui/dynamic-forms/service/question-control.service';
import { __values } from 'tslib';
import { DatePipe } from "@angular/common";
import { HttpService } from '@shared/services/http.service';
import { ApiConstants } from '../../../../../out_patients/core/constants/ApiConstants';
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { DenyOrderListTypeModel } from "@core/models/denyOrderListModel.Model";
import { SaveInvestigationOrderModel } from "@core/models/saveInvestigationOrderModel.Model";
import { MatDialog } from '@angular/material/dialog';
import { MessageDialogService } from '@shared/ui/message-dialog/message-dialog.service';
import { ModifyInvestigationOrderModel } from '@core/models/modifyInvestigationOrderModel.Model';
//import { ScheduleDateDialogComponent } from '@modules/registration/submodules/appointment-search/appointment-search-dialog/appointment-search-dialog.component';

@Component({
  selector: 'out-patients-investigation-orders',
  templateUrl: './investigation-orders.component.html',
  styleUrls: ['./investigation-orders.component.scss']
})
export class InvestigationOrdersComponent implements OnInit {
  @ViewChild("invOrderDetailsTable") invOrderDetailsTable: any;
  patientInfo : any;
  investigationForm!: FormGroup;
  from: any;
  to: any;
  today = new Date();
  isShowInvestigation: boolean = true;
  isShowMedical: boolean = false;
  isBtnDisable: boolean = false;
  isBtnDisableClear: boolean = true;
  name: any;
  questions: any;
  private readonly _destroying$ = new Subject<void>();

  investigationDetails: any;
  public denyOrderTypeList: DenyOrderListTypeModel[] = [];

  invOrderList : any;
  invOrderDetails : any;

  saveInvestigationOrderModel: SaveInvestigationOrderModel | undefined;

  invOrderLists : any =[];
  physicianOrderList : any =[];

  objPhyOrder: any=[];
  objdtdenialorder:any;

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
          { title: "All", value: "0" },
          { title: "Billed", value: "1" },
          { title: "Unbilled", value: "2" },
          { title: "Partially Billed", value: "3" },
          { title: "Denied", value: "4" },
        ],
      },
      denyorder: {
        type: "dropdown",
        placeholder: "Select",
        options: this.denyOrderTypeList        
      },
      remarks: {
        type: "string",
      }
    }
  }
  invListConfig: any = {
    actionItems: false,
    dateformat: 'dd/MM/yyyy',
    selectBox: false,
    displayedColumns: ['orderId', 'maxid', 'ptnName', 'docName', 'deptName', 'visitDate', 'mobileNo', 'amount', 'channel', 'billNo', 'billdetails'],
    rowLayout: { dynamic: { rowClass: "row['billdetails']" } },
    clickedRows: true,
    clickSelection: "single",
    columnsInfo: {
      orderId: {
        title: 'Order Id',
        type: 'string',
        style: {
          width: "8%",
        },
      },
      maxid: {
        title: 'Max Id',
        type: 'string',
        style: {
          width: "8%",
        },
      },
      ptnName: {
        title: 'Patient Name',
        type: 'string',
        style: {
          width: "11%",
        },
      },
      docName: {
        title: 'Doctor Name',
        type: 'string',
        style: {
          width: "12%",
        },
      },
      deptName: {
        title: 'Department',
        type: 'string',
        style: {
          width: "12%",
        },
      },
      visitDate: {
        title: 'Visit Date',
        type: 'date',
        style: {
          width: "9%",
        },
      },
      mobileNo: {
        title: 'Mobile No.',
        type: 'string',
        style: {
          width: "9%",
        },
      },
      amount: {
        title: 'Amt',
        type: 'string',
        style: {
          width: "5%",
        },
      },
      channel: {
        title: 'Channel',
        type: 'string',
        style: {
          width: "7%",
        },
      },
      billNo: {
        title: 'Bill No.',
        type: 'string',
        style: {
          width: "8%",
        },
      },
      billdetails: {
        title: 'Order Status',
        type: 'string',
        style: {
          width: "10%",
        },
      }

    }

  }
  invDetailsConfig: any = {
    actionItems: false,
    dateformat: 'dd/MM/yyyy hh:mm:ss a',
    selectBox: true,
    displayedColumns: ['testName', 'docName', 'labItemPriority', 'visitDateTime', 'specialization', 'acdRemarks'],
    columnsInfo: {
      testName: {
        title: 'Test Name',
        type: 'string',
        style: {
          width: "18%",
        },
      },
      docName: {
        title: 'Doctor Name',
        type: 'string',
        style: {
          width: "15%",
        },
      },
      labItemPriority: {
        title: 'Priority',
        type: 'string',
        style: {
          width: "8%",
        },
      },
      visitDateTime: {
        title: 'Visit Date & Time',
        type: 'date',
        style: {
          width: "14%",
        },
      },
      specialization: {
        title: 'Specialization',
        type: 'string',
        style: {
          width: "10%",
        },
      },
      acdRemarks: {
        title: 'ACD Remarks',
        type: 'input',
        style: {
          width: "35%",
        },
      },

    }

  }
  constructor(private formService: QuestionControlService, public datepipe: DatePipe, private http: HttpService,private matdialog: MatDialog,private messageDialogService: MessageDialogService) {}
  denyBtn()
  {    
    this.isBtnDisable= true;
    this.investigationForm.controls["denyorder"].enable();
  }

  ngOnInit(): void {    
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
      // this.from = this.datepipe.transform(
      //   new Date().setMonth(new Date().getMonth() - 2),
      //   "yyyy-MM-dd"
      // );
      this.from = this.datepipe.transform(new Date(), "yyyy-MM-dd");
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
  
    
    this.investigationForm.controls["maxid"].valueChanges.subscribe((value:any)=>{
      this.investigationForm.controls["input"].reset();
      this.investigationForm.controls["status"].reset();})
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
  
  search() {    
    //Main Grid both
    this.invOrderLists=[];
    this.invOrderList=[];
   this.http.get(ApiConstants.getediganosticacdoninvestigation(this.datepipe.transform(this.investigationForm.controls["fromdate"].value, "YYYY-MM-dd"), this.datepipe.transform(this.investigationForm.controls["todate"].value, "YYYY-MM-dd"), 7))
    //this.http.get(ApiConstants.getediganosticacdoninvestigation("2021-01-01", "2021-01-05", 7))
      .pipe(takeUntil(this._destroying$))
      .subscribe((res: any) => {
        this.invOrderList = res.objTempOrderHeader;
        
        res.objTempOrderHeader.forEach((e:any)=>        
        {
          if(this.investigationForm.value.maxid === "maxId")
          if(e.maxid === this.investigationForm.value.input)
          {
            this.invOrderLists.push(e);          
          }
          if(this.investigationForm.value.maxid === "patientName")
          if(e.ptnName === this.investigationForm.value.input)
          {
            this.invOrderLists.push(e);
            
          }
          if(this.investigationForm.value.maxid === "doctorName")
          if(e.docName === this.investigationForm.value.input)
          {
            this.invOrderLists.push(e);
            
          }
          if(this.investigationForm.value.maxid === "mobile")
          if(e.mobileNo === this.investigationForm.value.input)
          {
            this.invOrderLists.push(e);            
          }
          
          if(e.orderStatus === this.investigationForm.value.status)
          {
            this.invOrderLists.push(e);          
          }
         
          if(!this.investigationForm.value.maxid && !this.investigationForm.value.status)
          {
            this.invOrderLists=res.objTempOrderHeader;
          }
         this.invOrderList=this.invOrderLists;
         
        })

      })
  }

  listRowClick(event:any)
  {
    let maxId = event.row.maxid;   
    let orderid = event.row.orderId;
    this.patientInfo = event.row.maxid +" / "+ event.row.ptnName+" / "+ event.row.mobileNo  
    
      this.http.get(ApiConstants.getediganosticacdoninvestigationgrid(7,orderid,maxId.toString().split(".")[1],maxId.toString().split(".")[0]))    
      .pipe(takeUntil(this._destroying$))
      .subscribe((res: any) => {
        this.invOrderDetails=res.tempOrderBreakup;
        
        this.objPhyOrder.push({
          acDisHideDrug: true,
          visitid: 0,
          drugid: 0,
          acdRemarks: "Test"
        });

      })
  }

  getPatientRefundSubmitRequestBody(): SaveInvestigationOrderModel {  
    return (this.saveInvestigationOrderModel = new SaveInvestigationOrderModel(
     this.objPhyOrder,this.objdtdenialorder,0,0
    ));
  }
 
  saveOrUpdate()
  {    
    this.objPhyOrder=[];
    this.objdtdenialorder="";
    //this.physicianOrderList=[];
   
    this.invOrderDetailsTable.selection.selected.forEach((e:any) => {
      if(e.drugid !== 0) 
      this.objPhyOrder.push({
        acDisHideDrug: true,
        visitid: e.visitId,
        drugid: e.testID,
        acdRemarks: e.acdRemarks
      });
    });
    if(this.investigationForm.value.denyorder && !this.investigationForm.value.remarks)
    {
    this.messageDialogService.info("Please enter denial reason remark for order!")
    }
    if(!this.investigationForm.value.denyorder)
    {
      this.messageDialogService.info("Please select denial reason for open order before close!")      
    }
    
    if(this.investigationForm.value.remarks && this.investigationForm.value.denyorder){
      this.objdtdenialorder={
        denialid: this.investigationForm.value.denyorder,
        denialremark: this.investigationForm.value.remarks,
        visitid: this.invOrderDetailsTable.selection.selected[0].visitId,
        nextScheduleDate: "",
        nextflag: true      
        }    
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
  
  Save()
  {
    
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
  getModifyModel():ModifyInvestigationOrderModel{
    return new ModifyInvestigationOrderModel(
      this.physicianOrderList
    )
  }
  cancelDenial()
  {
    this.physicianOrderList=[];
    if(this.invOrderDetailsTable.selection.selected.length === 0){this.messageDialogService.info("Please select atleast 1 row to proceed.");}
    else
    this.invOrderDetailsTable.selection.selected.forEach((e:any) => {
      if(e.testID !== 0) 
      
      this.physicianOrderList.push({
        acDisHideDrug: true,
        visitid: e.visitId,
        drugid: e.testID,
        acdRemarks: e.acdRemarks
      });
    });
    this.http.post(ApiConstants.modifyphysicianorderdetail('',9233),this.getModifyModel())
    .pipe(takeUntil(this._destroying$))
    .subscribe((res: any) => {
    if(res.success === true)
    {
      this.messageDialogService.success(res.message);  
    }
   
    }) 
    
  }
  clearInv()
  {
    //clear Form
    this.investigationForm.reset();
    //Clear Grid
    this.invOrderList=[];
    this.invOrderDetails=[];
    //Reset Diasble Btn
    this.isBtnDisable = false;
    let todaydate = new Date();
    this.investigationForm.controls["fromdate"].setValue(todaydate);
    this.investigationForm.controls["todate"].setValue(todaydate);
    this.investigationForm.controls["denyorder"].disable();
  }
}
