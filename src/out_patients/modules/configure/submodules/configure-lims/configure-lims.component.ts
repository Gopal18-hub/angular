import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { GetConfigureMessageInterface } from "@core/types/configure/getConfiguremessage.Interface";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { ApiConstants } from "@core/constants/ApiConstants";
import { HttpClient } from "@angular/common/http";
import { Subject, takeUntil } from "rxjs";
import { Generatehl7outboundmessagerisModel } from "@core/models/generatehl7outboundmessage.Model";
import { CookieService } from "@shared/services/cookie.service";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";
@Component({
  selector: "out-patients-configure-lims",
  templateUrl: "./configure-lims.component.html",
  styleUrls: ["./configure-lims.component.scss"],
})
export class ConfigureLimsComponent implements OnInit {
  questions: any;
  limsconfigureform!: FormGroup;
  limsconfigureList: GetConfigureMessageInterface[] = [];
  apiprocessing: boolean = false;
  recreateList: Generatehl7outboundmessagerisModel[] = [];
  private readonly _destroying$ = new Subject<void>();
  userId = Number(this.cookie.get("UserId"));
  flag = 0;
  @ViewChild("limstable") tableRows: any;
  limsconfigureformData = {
    title: "",
    type: "object",
    properties: {
      billno: {
        type: "string",
      },
    },
  };
  config: any = {
    actionItems: false,
    /// dateformat: "dd/MM/yyyy",
    clickedRows: true,
    selectBox: true,
    // selectCheckBoxPosition: 10,
    clickSelection: "multiple",
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
    private http: HttpClient,
    private cookie: CookieService,
    private dialogService: MessageDialogService
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
          data.added.length == this.dataconfig.length
        ) {
          console.log("first if");
          this.dataconfig.forEach((item: any, index: any) => {
            if (item.messagestatus == "created") {
              this.tableRows.selection.deselect(item);
            } else {
            }
          });
          console.log(this.tableRows.selection.selected);
          //masteruncheck
        } else {
          this.dataconfig.forEach((item: any) => {
            if (item.messagestatus == "created") {
              this.flag++;
            }
          });
          console.log(this.flag);
          if (data.removed.length == 0 && data.added.length == this.flag) {
            console.log(this.tableRows.selection.selected);
            console.log("second if");
            this.dataconfig.forEach((item: any) => {
              this.tableRows.selection.deselect(item);
            });
          } else if (
            this.tableRows.selection.selected.length !=
              this.tableRows.selection._selectedToEmit.length &&
            this.tableRows.selection.selected.length == this.dataconfig.length
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
  getdata() {
    this.apiprocessing = true;
    this.http
      .get(
        ApiConstants.gethl7outboundmessageris(
          "1",
          this.limsconfigureform.controls["billno"].value
        )
      )
      .pipe(takeUntil(this._destroying$))
      .subscribe(
        (data) => {
          console.log(data);
          this.limsconfigureList = data as GetConfigureMessageInterface[];
          this.apiprocessing = false;
        },
        (error) => {
          this.apiprocessing = false;
        }
      );
  }
  recreateClick() {
    this.recreateList = [];
    this.tableRows.selection.selected.forEach((item: any, index: any) => {
      this.recreateList.push({
        opbillid: item.billid,
        serviceId: item.serviceID,
        itemId: item.itemId,
        orderId: item.orderId,
        operatorid: this.userId,
      });
    });
    console.log(this.recreateList);
    this.http
      .post(ApiConstants.generatehl7outboundmessageris, this.recreateList)
      .pipe(takeUntil(this._destroying$))
      .subscribe(
        (result) => {
          console.log(result);
          if (result == "done") {
            this.dialogService.success("Order Successfully Generated");
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }

  cleardata() {
    console.log("inside cleardata");
    this.limsconfigureList = [];
    this.limsconfigureform.reset();
  }
  dataconfig: any = [
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
      orderdate: "26-05-2002",
      //ordertime: "16:10:00",
      messagestatus: "Not created",
      disablecheckbox: false,
    },
  ];
}
// "SKCS3760202"
