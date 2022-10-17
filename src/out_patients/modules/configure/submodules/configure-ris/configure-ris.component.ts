import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { DynamicFormQuestionComponent } from "@shared/ui/dynamic-forms/dynamic-form-question.component";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { HttpClient } from "@angular/common/http";
import { ApiConstants } from "@core/constants/ApiConstants";
import { Subject, takeUntil } from "rxjs";
import { GetConfigureMessageInterface } from "../../../../core/types/configure/getConfiguremessage.Interface";
import { Generatehl7outboundmessagerisModel } from "../../../../core/models/generatehl7outboundmessage.Model";
@Component({
  selector: "out-patients-configure-ris",
  templateUrl: "./configure-ris.component.html",
  styleUrls: ["./configure-ris.component.scss"],
})
export class ConfigureRisComponent implements OnInit {
  questions: any;
  risconfigureform!: FormGroup;
  risconfigurelist: GetConfigureMessageInterface[] = [];
  recreateList: Generatehl7outboundmessagerisModel[] = [];
  private readonly _destroying$ = new Subject<void>();
  config: any = {
    actionItems: false,
    /// dateformat: "dd/MM/yyyy",
    clickedRows: false,
    selectBox: true,
    // selectCheckBoxPosition: 10,
    clickSelection: "multiple",
    displayedColumns: ["testName", "ssn", "orderdatetime", "messagestatus"],
    columnsInfo: {
      testName: {
        title: "Test Name",
        type: "string",
        style: {
          width: "5rem",
        },
        tooltipColumn: "testName",
      },
      ssn: {
        title: "SSN",
        type: "string",
        style: {
          width: "5rem",
        },
        tooltipColumn: "ssn",
      },
      orderdatetime: {
        title: "Order DateTime",
        type: "string",
        style: {
          width: "5.5rem",
        },
        tooltipColumn: "orderdatetime",
      },
      // ordertime: {
      //   title: "Order Time",
      //   type: "string",
      //   style: {
      //     width: "6rem",
      //   },
      //   tooltipColumn: "",
      // },
      messagestatus: {
        title: "Message Status",
        type: "string",
        style: {
          width: "17rem",
        },
        tooltipColumn: "messagestatus",
      },
    },
  };
  @ViewChild("ristable") risconfiguretable: any;
  constructor(
    private formService: QuestionControlService,
    private http: HttpClient
  ) {}
  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.risconfigureformData.properties,
      {}
    );
    this.risconfigureform = formResult.form;
    this.questions = formResult.questions;
  }
  ngAfterViewInit() {
    this.questions[0].elementRef.addEventListener("keydown", (event: any) => {
      if (event.key == "Enter") {
        this.getdata();
      }
    });
  }
  risconfigureformData = {
    title: "",
    type: "object",
    properties: {
      billno: {
        type: "string",
      },
    },
  };

  dataconfig: any = [
    {
      testname: "xray-abdomen",
      ssn: "6700000009",
      orderdate: "26-05-2002",
      ordertime: "16:10:00",
      messagestatus: "Not created",
    },
    {
      testname: "xray-abdomen",
      ssn: "6700000009",
      orderdate: "26-05-2002",
      ordertime: "16:10:00",
      messagestatus: "Not created",
    },
    {
      testname: "xray-abdomen",
      ssn: "6700000009",
      orderdate: "26-05-2002",
      ordertime: "16:10:00",
      messagestatus: "Not created",
    },
    {
      testname: "xray-abdomen",
      ssn: "6700000009",
      orderdate: "26-05-2002",
      ordertime: "16:10:00",
      messagestatus: "Not created",
    },
    {
      testname: "xray-abdomen",
      ssn: "6700000009",
      orderdate: "26-05-2002",
      ordertime: "16:10:00",
      messagestatus: "Not created",
    },
  ];

  getdata() {
    console.log("getdata");
    this.http
      .get(ApiConstants.gethl7outboundmessageris("RIS", "SKCS3760202"))
      .pipe(takeUntil(this._destroying$))
      .subscribe((data) => {
        console.log(data);
        this.risconfigurelist = data as GetConfigureMessageInterface[];
        // this.risconfigurelist.forEach((item) => {
        //   item.orderdate = item.orderdatetime.split("T")[0];
        //   item.ordertime = item.orderdatetime.split("T")[1];
        // });
      });
  }
  // getRecreateobject():Generatehl7outboundmessagerisModel{
  //   this.risconfigurelist.forEach((item:any,index:any)=>{
  //     this.recreateList.push({
  //       opbillid: number;
  //       id: number;
  //       testName: string;
  //       billid: number;
  //       itemId: number;
  //       orderId: number;
  //       optestorderid: number;
  //       ssn: string;
  //       vistaID: number;
  //       orderdatetime: string;
  //       procedureid: number;
  //       messagestatus: string;
  //       reprocess: boolean;
  //       operatorId: number;
  //       stationid: number;
  //       iaCode: string;
  //       regNo: number;
  //       userID: number;
  //       locationID: number;
  //       visitNo: string;
  //       priority: string;
  //       serviceID: number;
  //     })
  //   })

  //   //return this.recreateList
  // }
  recreateClick() {}

  cleardata() {
    console.log("inside cleardata");
    this.risconfigurelist = [];
    this.risconfigureform.reset();
  }
}
