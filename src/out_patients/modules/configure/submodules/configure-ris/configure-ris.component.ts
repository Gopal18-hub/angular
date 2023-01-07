import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { DynamicFormQuestionComponent } from "@shared/ui/dynamic-forms/dynamic-form-question.component";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { HttpClient } from "@angular/common/http";
import { ApiConstants } from "@core/constants/ApiConstants";
import { Subject, takeUntil } from "rxjs";
import { GetConfigureMessageInterface } from "../../../../core/types/configure/getConfiguremessage.Interface";
import { Generatehl7outboundmessagerisModel } from "../../../../core/models/generatehl7outboundmessage.Model";
import { CookieService } from "@shared/services/cookie.service";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";
import { MaxHealthSnackBarService } from "@shared/ui/snack-bar";
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
  userId = Number(this.cookie.get("UserId"));
  risconfigureformData = {
    title: "",
    type: "object",
    properties: {
      billno: {
        type: "string",
      },
      billdropdown: {
        type: "dropdown",
        options: [
          {
            title: "Bill No",
            value: 1,
          },
        ],
        //  defaultValue: 1,
      },
    },
  };
  config: any = {
    actionItems: false,
    clickedRows: true,
    selectBox: true,
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

  @ViewChild("ristable") tableRows: any;
  constructor(
    private formService: QuestionControlService,
    private http: HttpClient,
    private cookie: CookieService,
    private dialogService: MessageDialogService,
    private snackbar: MaxHealthSnackBarService
  ) {}
  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.risconfigureformData.properties,
      {}
    );
    this.risconfigureform = formResult.form;
    this.questions = formResult.questions;
    this.risconfigureform.controls["billdropdown"].setValue(1);
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
    //       data.added.length == this.risconfigurelist.length
    //     ) {
    //       console.log("first if");
    //       this.risconfigurelist.forEach((item: any, index: any) => {
    //         if (item.messagestatus == "created") {
    //           this.tableRows.selection.deselect(item);
    //         } else {
    //         }
    //       });
    //       console.log(this.tableRows.selection.selected);
    //       //masteruncheck
    //     } else {
    //       this.risconfigurelist.forEach((item: any) => {
    //         if (item.messagestatus == "created") {
    //           this.flag++;
    //         }
    //       });
    //       console.log(this.flag);
    //       if (data.removed.length == 0 && data.added.length == this.flag) {
    //         console.log(this.tableRows.selection.selected);
    //         console.log("second if");
    //         this.risconfigurelist.forEach((item: any) => {
    //           this.tableRows.selection.deselect(item);
    //         });
    //       } else if (
    //         this.tableRows.selection.selected.length !=
    //           this.tableRows.selection._selectedToEmit.length &&
    //         this.tableRows.selection.selected.length ==
    //           this.risconfigurelist.length
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
    if (
      this.risconfigureform.controls["billno"].value != ""
      //this.risconfigureform.controls["billno"].value != null
    ) {
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
            if (this.risconfigurelist != null) {
              if (this.risconfigurelist.length > 0) {
                this.risconfigurelist.forEach((item, index) => {
                  //COMMENETD FOR NOW, IT WILL BE ENABLED LATER
                  // if (item.messagestatus == "created") {
                  //   item.disablecheckbox = true;
                  // } else {
                  //   item.disablecheckbox = false;
                  // }
                });
              } else {
                this.apiprocessing = false;
              }
            } else {
              this.apiprocessing = false;
            }
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
                this.risconfigurelist = [];
              }
            },
            (error) => {
              console.log(error);
              if (error.error.text == "Done") {
                this.dialogService.success("Order Successfully Generated");
                this.risconfigurelist = [];
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
    this.risconfigurelist = [];
    this.risconfigureform.reset();
    this.risconfigureform.controls["billdropdown"].setValue(1);
  }
}
// "SKCS3760202"
//Unable to save data
