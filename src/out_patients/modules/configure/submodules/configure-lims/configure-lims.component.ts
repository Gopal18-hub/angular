import { Component, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { GetConfigureMessageInterface } from "@core/types/configure/getConfiguremessage.Interface";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { ApiConstants } from "@core/constants/ApiConstants";
import { HttpClient } from "@angular/common/http";
import { Subject, takeUntil } from "rxjs";
@Component({
  selector: "out-patients-configure-lims",
  templateUrl: "./configure-lims.component.html",
  styleUrls: ["./configure-lims.component.scss"],
})
export class ConfigureLimsComponent implements OnInit {
  questions: any;
  limsconfigureform!: FormGroup;
  limsconfigureList: GetConfigureMessageInterface[] = [];
  private readonly _destroying$ = new Subject<void>();
  config: any = {
    actionItems: false,
    /// dateformat: "dd/MM/yyyy",
    clickedRows: false,
    selectBox: true,
    // selectCheckBoxPosition: 10,
    clickSelection: "single",
    displayedColumns: ["testname", "ssn", "orderdatetime", "messagestatus"],
    columnsInfo: {
      testname: {
        title: "Test Name",
        type: "string",
        style: {
          width: "5rem",
        },
        tooltipColumn: "testname",
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
      //   tooltipColumn: "ordertime",
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
  constructor(
    private formService: QuestionControlService,
    private http: HttpClient
  ) {}
  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.limsconfigureformData.properties,
      {}
    );
    this.limsconfigureform = formResult.form;
    this.questions = formResult.questions;
  }
  ngAfterViewInit() {
    this.http
      .get(ApiConstants.getconfiguremessage("LIMS", "SKCS3760202"))
      .pipe(takeUntil(this._destroying$))
      .subscribe((data) => {
        console.log(data);
        this.limsconfigureList = data as GetConfigureMessageInterface[];
        // this.limsconfigureList.forEach((item) => {
        //   item.orderdate = item.orderdatetime.split("T")[0];
        //   item.ordertime = item.orderdatetime.split("T")[1];
        // });
      });
  }
  limsconfigureformData = {
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
}
