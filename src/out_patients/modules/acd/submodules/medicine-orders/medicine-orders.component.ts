import { Component, OnInit } from '@angular/core';
import { FormGroup} from '@angular/forms';
import { QuestionControlService } from '../../../../../shared/ui/dynamic-forms/service/question-control.service';
import { __values } from 'tslib';
import { DatePipe } from "@angular/common";
import { HttpService } from '@shared/services/http.service';
import { ApiConstants } from '../../../../../out_patients/core/constants/ApiConstants';
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { DenyOrderListTypeModel } from "@core/models/denyOrderListModel.Model";

@Component({
  selector: 'out-patients-medicine-orders',
  templateUrl: './medicine-orders.component.html',
  styleUrls: ['./medicine-orders.component.scss']
})
export class MedicineOrdersComponent implements OnInit {
  investigationForm!: FormGroup;
  from: any;
  to: any;
  today = new Date();
  isShowInvestigation: boolean = true;
  isShowMedical: boolean = false;
  isBtnDisable: boolean = true;
  isBtnDisableClear: boolean = true;
  name: any;
  questions: any;
  private readonly _destroying$ = new Subject<void>();

  medOrderList : any;
  medOrderDetails : any;
  patientInfo : any;

  investigationDetails: any;
  public denyOrderTypeList: DenyOrderListTypeModel[] = [];
  

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
        options: this.denyOrderTypeList,
        // options: [
        //   {title: "Others",value:"others"  },
        //   {title: "Price Issue",value:"price"  },
        //   {title: "PSU Patient",value:"psu"  },
        //   {title: "After Medication",value:"aftermed"  },
        //   {title: "Before next review",value:"befreview"  },
        //   {title: "Show Future Date",value:"future"  },
        //   {title: "At the time of admission",value:"timeofadmission"  },
        //   {title: "Machine not functional",value:"machine"  },
        // ], 
      },
      remarks: {
        type: "string",
      }

    }
  }

  medListConfig: any  = {
    actionItems: false,
    dateformat: 'dd/MM/yyyy',
    selectBox : false,
    displayedColumns: ['orderId', 'maxid', 'ptnName', 'docName', 'deptName', 'visitDate', 'mobileNo', 'mrpValue', 'channel', 'buildingId', 'paymentMode'],
    rowLayout: { dynamic: { rowClass: "row['paymentMode']" } },
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
      buildingId: {
        title: 'Bill No.',
        type: 'string',
        style: {
          width: "130px",
        },
      },
      paymentMode: {
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
    dateformat: 'dd/MM/yyyy',
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
        type: 'string',
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
  constructor(private formService: QuestionControlService, public datepipe: DatePipe, private http: HttpService,) {
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
    //Deny order lists
    this.http.get(ApiConstants.geteprescriptdrugorders("2020-12-11", "2020-12-11", 7))
    // this.http.get(ApiConstants.getediganosticacdoninvestigation(this.datepipe.transform(this.investigationForm.controls["fromdate"].value, "YYYY-MM-dd"), this.datepipe.transform(this.investigationForm.controls["todate"].value, "YYYY-MM-dd"), 7))
      .pipe(takeUntil(this._destroying$))
      .subscribe((res: any) => {
        this.medOrderList = res.objOrderDetails;
        
        console.log(this.medOrderList, "Do")
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

}
