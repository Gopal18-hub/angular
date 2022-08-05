import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QuestionControlService } from '../../../../../shared/ui/dynamic-forms/service/question-control.service';
import { __values } from 'tslib';
import { DatePipe } from "@angular/common";
import { HttpService } from '@shared/services/http.service';
import { ApiConstants } from '../../../../../out_patients/core/constants/ApiConstants';
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { DenyOrderListTypeModel } from "@core/models/denyOrderListModel.Model";


@Component({
  selector: 'out-patients-investigation-orders',
  templateUrl: './investigation-orders.component.html',
  styleUrls: ['./investigation-orders.component.scss']
})
export class InvestigationOrdersComponent implements OnInit {
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

  invOrderList : any;
  invOrderDetails : any;


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
  invListConfig: any = {
    actionItems: false,
    dateformat: 'dd/MM/yyyy',
    selectBox: false,
    displayedColumns: ['orderId', 'maxid', 'ptnName', 'docName', 'deptName', 'visitDate', 'mobileNo', 'mrpValue', 'channel', 'buildingId', 'paymentMode'],
    rowLayout: { dynamic: { rowClass: "row['status']" } },
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
      mrpValue: {
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
      buildingId: {
        title: 'Bill No.',
        type: 'string',
        style: {
          width: "8%",
        },
      },
      paymentMode: {
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
    displayedColumns: ['drug', 'doctor', 'priority', 'visitDateTime', 'specialization', 'acdRemarks'],
    columnsInfo: {
      drug: {
        title: 'Test Name',
        type: 'string',
        style: {
          width: "18%",
        },
      },
      doctor: {
        title: 'Doctor Name',
        type: 'string',
        style: {
          width: "15%",
        },
      },
      priority: {
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
        console.log(res, "getediganosticacd")
      })
    //Main Grid both
    this.http.get(ApiConstants.geteprescriptdrugorders("2021-08-12", "2021-08-14", 7, 0))
      //this.http.get(ApiConstants.getediganosticacd(this.investigationForm.value.fromdate,this.investigationForm.value.todate,this.investigationForm.value.status,this.investigationForm.value.orderid,0,"",0))    
      .pipe(takeUntil(this._destroying$))
      .subscribe((res: any) => {
        this.invOrderList = res.objOrderDetails;
        console.log(res.objOrderDetails, "geteprescriptdrugorders")
      })

  }

  listRowClick(event:any)
  {
    let maxId = event.row.maxid;   
   
    //this.http.get(ApiConstants.getphysicianorderdetailep(123123, "SKDD", 7, 0))
      this.http.get(ApiConstants.getphysicianorderdetailep(maxId.toString().split(".")[1],maxId.toString().split(".")[0],7,event.row.orderId))    
      .pipe(takeUntil(this._destroying$))
      .subscribe((res: any) => {
        this.invOrderDetails=res;
        console.log(res, "GetPhysicianOrderDetailEP")

      })
  }

}
