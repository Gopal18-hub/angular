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
  apiprocessing: boolean = false;
  flag = 0;
  risconfigurelist: GetConfigureMessageInterface[] = [];
  recreateList: Generatehl7outboundmessagerisModel[] = [];
  private readonly _destroying$ = new Subject<void>();
  config: any = {
    actionItems: false,
    /// dateformat: "dd/MM/yyyy",
    clickedRows: true,
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
  @ViewChild("ristable") tableRows: any;
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
    this.tableRows.selection.changed
      .pipe(takeUntil(this._destroying$))
      .subscribe((data: any) => {
        this.flag = 0;

        //mastercheck
        if (
          data.removed.length == 0 &&
          data.added.length == this.risconfigurelist.length
        ) {
          console.log("first if");
          this.risconfigurelist.forEach((item: any, index: any) => {
            if (item.messagestatus == "created") {
              this.tableRows.selection.deselect(item);
            } else {
            }
          });
          console.log(this.tableRows.selection.selected);
          //masteruncheck
        } else {
          this.risconfigurelist.forEach((item: any) => {
            if (item.messagestatus == "created") {
              this.flag++;
            }
          });
          console.log(this.flag);
          if (data.removed.length == 0 && data.added.length == this.flag) {
            console.log(this.tableRows.selection.selected);
            console.log("second if");
            this.risconfigurelist.forEach((item: any) => {
              this.tableRows.selection.deselect(item);
            });
          } else if (
            this.tableRows.selection.selected.length !=
              this.tableRows.selection._selectedToEmit.length &&
            this.tableRows.selection.selected.length ==
              this.risconfigurelist.length
          ) {
            console.log(this.tableRows.selection.selected);
            console.log("third else");
            console.log(data);
            this.tableRows.selection.selected.forEach(
              (item: any, index: any) => {
                if (item.messagestatus == "created") {
                  this.tableRows.selection.deselect(item);
                }
              }
            );
            //console.log(data);
          }
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
      testName: "xray-abdomen",
      ssn: "6700000009",
      orderdatetime: "26-05-2002",
      //ordertime: "16:10:00",
      messagestatus: "Not created",
      disablecheckbox: false,
    },
    {
      testName: "xray-abdomen",
      ssn: "6700000009",
      orderdatetime: "26-05-2002",
      //ordertime: "16:10:00",
      messagestatus: "created",
      disablecheckbox: true,
    },
    {
      testName: "xray-abdomen",
      ssn: "6700000009",
      orderdatetime: "26-05-2002",
      // ordertime: "16:10:00",
      messagestatus: "Not created",
      disablecheckbox: false,
    },
    {
      testName: "xray-abdomen",
      ssn: "6700000009",
      orderdatetime: "26-05-2002",
      // ordertime: "16:10:00",
      messagestatus: "created",
      disablecheckbox: true,
    },
    {
      testName: "xray-abdomen",
      ssn: "6700000009",
      orderdatetime: "26-05-2002",
      //ordertime: "16:10:00",
      messagestatus: "Not created",
      disablecheckbox: false,
    },
  ];

  getdata() {
    console.log("getdata");
    this.apiprocessing = true;
    this.http
      .get(
        ApiConstants.gethl7outboundmessageris(
          "RIS",
          this.risconfigureform.controls["billno"].value
        )
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe(
        (data) => {
          console.log(data);
          this.apiprocessing = false;
          this.risconfigurelist = data as GetConfigureMessageInterface[];
        },
        (error) => {
          console.log(error);
        }
      );
  }
  getRecreateobject() {
    this.tableRows.selection.selected.forEach((item: any, index: any) => {
      this.recreateList.push({
        opbillid: item.billid,
        id: item.id,
        testName: item.testName,
        billid: item.billid,
        itemId: item.itemId,
        orderId: item.orderId,
        optestorderid: item.optestorderid,
        ssn: item.ssn,
        vistaID: item.vistaID,
        orderdatetime: item.orderdatetime,
        procedureid: item.procedureid,
        messagestatus: item.messagestatus,
        reprocess: item.reprocess,
        operatorId: item.operatorId,
        stationid: item.stationid,
        iaCode: item.iaCode,
        regNo: item.regNo,
        userID: item.userID,
        locationID: item.locationID,
        visitNo: item.visitNo,
        priority: item.priority,
        serviceID: item.serviceID,
      });
    });
    return this.recreateList;
  }
  recreateClick() {
    console.log(this.getRecreateobject());
    this.http
      .post(
        ApiConstants.generatehl7outboundmessageris,
        this.getRecreateobject()
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe(
        (result) => {
          console.log(result);
        },
        (error) => {
          console.log(error);
        }
      );
  }

  cleardata() {
    console.log("inside cleardata");
    this.risconfigurelist = [];
    this.risconfigureform.reset();
  }
}
// "SKCS3760202"
