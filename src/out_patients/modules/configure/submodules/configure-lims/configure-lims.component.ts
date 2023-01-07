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
import { MaxHealthSnackBarService } from "@shared/ui/snack-bar";
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
    private dialogService: MessageDialogService,
    private snackbar: MaxHealthSnackBarService
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
    //COMMENETD FOR NOW, IT WILL BE ENABLED LATER
    // this.tableRows.selection.changed
    //   .pipe(takeUntil(this._destroying$))
    //   .subscribe((data: any) => {
    //     this.flag = 0;

    //     //mastercheck
    //     if (
    //       data.removed.length == 0 &&
    //       data.added.length == this.dataconfig.length
    //     ) {
    //       console.log("first if");
    //       this.limsconfigureList.forEach((item: any, index: any) => {
    //         if (item.messagestatus == "created") {
    //           this.tableRows.selection.deselect(item);
    //         } else {
    //         }
    //       });
    //       console.log(this.tableRows.selection.selected);
    //       //masteruncheck
    //     } else {
    //       this.limsconfigureList.forEach((item: any) => {
    //         if (item.messagestatus == "created") {
    //           this.flag++;
    //         }
    //       });
    //       console.log(this.flag);
    //       if (data.removed.length == 0 && data.added.length == this.flag) {
    //         console.log(this.tableRows.selection.selected);
    //         console.log("second if");
    //         this.limsconfigureList.forEach((item: any) => {
    //           this.tableRows.selection.deselect(item);
    //         });
    //       } else if (
    //         this.tableRows.selection.selected.length !=
    //           this.tableRows.selection._selectedToEmit.length &&
    //         this.tableRows.selection.selected.length ==
    //           this.limsconfigureList.length
    //       ) {
    //         console.log(this.tableRows.selection.selected);
    //         console.log("third else");
    //         console.log(data);
    //         this.tableRows.selection.selected.forEach(
    //           (item: any, index: any) => {
    //             if (item.messagestatus == "created") {
    //               this.tableRows.selection.deselect(item);
    //             }
    //           }
    //         );
    //       }
    //     }
    //   });
  }
  getdata() {
    this.apiprocessing = true;
    if (this.limsconfigureform.controls["billno"].value != "") {
      this.http
        .get(
          ApiConstants.gethl7outboundmessageris(
            "LIMS",
            this.limsconfigureform.controls["billno"].value
          )
        )
        .pipe(takeUntil(this._destroying$))
        .subscribe(
          (data) => {
            console.log(data);
            this.apiprocessing = false;
            this.limsconfigureList = data as GetConfigureMessageInterface[];
            if (this.limsconfigureList != null) {
              if (this.limsconfigureList.length > 0) {
                this.limsconfigureList.forEach((item, index) => {
                  //COMMENETD FOR NOW, IT WILL BE ENABLED LATER
                  // if (item.messagestatus == "created") {
                  //   item.disablecheckbox = true;
                  // } else {
                  //   item.disablecheckbox = false;
                  // }
                });
              }
            } else {
              this.apiprocessing = false;
            }

            this.apiprocessing = false;
          },
          (error) => {
            console.log(error);
            this.apiprocessing = false;
          }
        );
    } else {
      this.snackbar.open("Please Enter Bill no");
      this.apiprocessing = false;
    }
  }
  recreateClick() {
    this.recreateList = [];
    if (this.tableRows.selection.selected.length == 0) {
      this.dialogService.info("Please select atleast one item from the list");
      return;
    } else {
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
      if (this.recreateList.length > 0) {
        this.http
          .post(ApiConstants.generatehl7outboundmessageris, this.recreateList)
          .pipe(takeUntil(this._destroying$))
          .subscribe(
            (result) => {
              console.log(result);
              if (result == "Done") {
                this.dialogService.success("Order Successfully Generated");
                this.limsconfigureList = [];
                this.tableRows.selection.clear();
              }
            },
            (error) => {
              console.log(error);
              if (error.error.text == "Done") {
                this.dialogService.success("Order Successfully Generated");
                this.limsconfigureList = [];
                this.tableRows.selection.clear();
              }
            }
          );
      } else {
        this.dialogService.info("Please select atleast one item from the list");
      }
    }
  }

  cleardata() {
    console.log("inside cleardata");
    this.tableRows.selection.clear();
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
