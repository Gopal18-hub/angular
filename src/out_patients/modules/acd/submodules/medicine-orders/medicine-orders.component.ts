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
    displayedColumns: ['orderId', 'maxid', 'ptnName', 'docName', 'deptName', 'visitDate', 'mobileNo', 'amnt', 'channel', 'billNo', 'status'],
    rowLayout: { dynamic: { rowClass: "row['status']" } },
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
      amnt: {
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
      status: {
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
    displayedColumns: ['testname', 'doctorname','priority','days','specialization','visitdatetime','remarks'],
    columnsInfo: {
      testname : {
        title: 'Drug Name',
        type: 'string',
        style: {
          width: "20%",
        },
      },
      doctorname : {
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
      visitdatetime : {
        title: 'Visit Date & Time',
        type: 'string',
        style: {
          width: "12%",
        },
      },
    
      remarks : {
        title: 'ACD Remarks',
        type: 'input',
        style: {
          width: "30%",
        },
      },
     
    }
 
    }


  data: any[] = [
    {
      orderid: "7984778",
      maxid: "SKDO.523278",
      patientname: "ALPIKA SINGH",
      docname: "Saptarshi Bhattacharya",
      dept: "Endocrinology",
      visitdate: "05/11/2022 08.48 AM",
      mobile: "9837866912",
      amnt: "1000.00",
      channel: "Cash",
      billno: "",
      status: "Unbilled"
    },
    {
      orderid: "7984778",
      maxid: "SKDO.523278",
      patientname: "ALPIKA SINGH",
      docname: "Saptarshi Bhattacharya",
      dept: "Endocrinology",
      visitdate: "05/11/2022 08.48 AM",
      mobile: "9837866912",
      amnt: "1000.00",
      channel: "Cash",
      billno: "",
      status: "Billed"
    },
    {
      orderid: "7984778",
      maxid: "SKDO.523278",
      patientname: "ALPIKA SINGH",
      docname: "Saptarshi Bhattacharya",
      dept: "Endocrinology",
      visitdate: "05/11/2022 08.48 AM",
      mobile: "9837866912",
      amnt: "1000.00",
      channel: "Cash",
      billno: "",
      status: "Billed"
    },
    {
      orderid: "7984778",
      maxid: "SKDO.523278",
      patientname: "ALPIKA SINGH",
      docname: "Saptarshi Bhattacharya",
      dept: "Endocrinology",
      visitdate: "05/11/2022 08.48 AM",
      mobile: "9837866912",
      amnt: "1000.00",
      channel: "Cash",
      billno: "",
      status: "Partial"
    },
    {
      orderid: "7984778",
      maxid: "SKDO.523278",
      patientname: "ALPIKA SINGH",
      docname: "Saptarshi Bhattacharya",
      dept: "Endocrinology",
      visitdate: "05/11/2022 08.48 AM",
      mobile: "9837866912",
      amnt: "1000.00",
      channel: "Cash",
      billno: "",
      status: "Denied"
    }

  ]
  data1: any[] = [
    {
      testname: "Glycosylated Hemoglobin (HBA1C)",
      doctorname: "Saptarshi Bhattacharya",
      priority: "Routine",
      visitdatetime: "05/11/2022 08.48 AM",
      specialization: "Internal Medicine",
      remarks: ""
    },
    {
      testname: "Glycosylated Hemoglobin (HBA1C)",
      doctorname: "Saptarshi Bhattacharya",
      priority: "Routine",
      visitdatetime: "05/11/2022 08.48 AM",
      specialization: "Internal Medicine",
      remarks: ""
    },
    {
      testname: "Glycosylated Hemoglobin (HBA1C)",
      doctorname: "Saptarshi Bhattacharya",
      priority: "Routine",
      visitdatetime: "05/11/2022 08.48 AM",
      specialization: "Internal Medicine",
      remarks: ""
    },
    {
      testname: "Glycosylated Hemoglobin (HBA1C)",
      doctorname: "Saptarshi Bhattacharya",
      priority: "Routine",
      visitdatetime: "05/11/2022 08.48 AM",
      specialization: "Internal Medicine",
      remarks: ""
    },
    {
      testname: "Glycosylated Hemoglobin (HBA1C)",
      doctorname: "Saptarshi Bhattacharya",
      priority: "Routine",
      visitdatetime: "05/11/2022 08.48 AM",
      specialization: "Internal Medicine",
      remarks: ""
    }
  ]
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
  }

  search() {
    //Deny order lists
    this.http.get(ApiConstants.getediganosticacd("2020-12-11", "2020-12-11", 0, 0, 799041, "SKDD", 7))
      //this.http.get(ApiConstants.getediganosticacd(this.investigationForm.value.fromdate,this.investigationForm.value.todate,this.investigationForm.value.status,this.investigationForm.value.orderid,0,"",0))    
      .pipe(takeUntil(this._destroying$))
      .subscribe((res: any) => {
        this.denyOrderTypeList = res.objACDDenialReasons;
        this.questions[6].options = this.denyOrderTypeList.map((e) => {
          return { title: e.name, value: e.id };
        });
        console.log(this.denyOrderTypeList, "Do")
      })
    //Main Grid both
    this.http.get(ApiConstants.geteprescriptdrugorders("2020-12-11", "2020-12-11", 7, 0))
      //this.http.get(ApiConstants.getediganosticacd(this.investigationForm.value.fromdate,this.investigationForm.value.todate,this.investigationForm.value.status,this.investigationForm.value.orderid,0,"",0))    
      .pipe(takeUntil(this._destroying$))
      .subscribe((res: any) => {
        console.log(res, "geteprescriptdrugorders")
      })

    this.http.get(ApiConstants.getphysicianorderdetailep(123123, "SKDD", 7, 0))
      //this.http.get(ApiConstants.getediganosticacd(this.investigationForm.value.fromdate,this.investigationForm.value.todate,this.investigationForm.value.status,this.investigationForm.value.orderid,0,"",0))    
      .pipe(takeUntil(this._destroying$))
      .subscribe((res: any) => {
        console.log(res, "GetPhysicianOrderDetailEP")

      })
  }

}
