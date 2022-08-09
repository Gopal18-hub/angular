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
          { title: "Partially billed", value: "3" },
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
    dateformat: 'dd/MM/yyyy',
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
        type: 'string',
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
  constructor(private formService: QuestionControlService, public datepipe: DatePipe, private http: HttpService,private matdialog: MatDialog,) {}
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
 
  
  search() {    
    //Main Grid both
   // this.http.get(ApiConstants.getediganosticacdoninvestigation(this.datepipe.transform(this.investigationForm.controls["fromdate"].value, "YYYY-MM-dd"), this.datepipe.transform(this.investigationForm.controls["todate"].value, "YYYY-MM-dd"), 7))
    this.http.get(ApiConstants.getediganosticacdoninvestigation("2021-08-12", "2021-08-14", 7))
      .pipe(takeUntil(this._destroying$))
      .subscribe((res: any) => {
        this.invOrderList = res.objTempOrderHeader;
        console.log(res.objTempOrderHeader, "getediganosticacdoninvestigation")
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
        console.log(res, "getediganosticacdoninvestigationgrid")
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
    console.log(this.invOrderDetailsTable.selection.selected,"selected rows");   
    
    this.invOrderDetailsTable.selection.selected.forEach((e:any) => {
      if(e.drugid !== 0) 
      this.objPhyOrder.push({
        acDisHideDrug: true,
        visitid: e.visitId,
        drugid: e.testID,
        acdRemarks: "test"
      });
    });
    this.objdtdenialorder={
    denialid: this.investigationForm.value.denyorder,
    denialremark: this.investigationForm.value.remarks,
    visitid: this.invOrderDetailsTable.selection.selected[0].visitId,
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
  
  Save()
  {
    console.log(this.getSaveModel(),"model");
    this.http.post(ApiConstants.SaveAndUpdateDiagnosticOrderBill,this.getSaveModel())
    //this.http.get(ApiConstants.getediganosticacd(this.investigationForm.value.fromdate,this.investigationForm.value.todate,this.investigationForm.value.status,this.investigationForm.value.orderid,0,"",0))    
    .pipe(takeUntil(this._destroying$))
    .subscribe((res: any) => {
    console.log(res)
    })
  

  }
 
  appointment_popup()
  {
    // console.log("appointment");
    // this.matdialog.open(ScheduleDateDialogComponent, {
    //   maxWidth: "100vw",
    //   width: "98vw",
    //   });
  }

}
