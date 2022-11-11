import {
  Component,
  OnInit,
  Inject,
  Input,
  OnDestroy,
  AfterViewInit,
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { BillingForm } from "@core/constants/BillingForm";
import { QuestionControlService } from "../../../../../../shared/ui/dynamic-forms/service/question-control.service";
import { HttpService } from "@shared/services/http.service";
import { ApiConstants } from "@core/constants/ApiConstants";
import { Subject, Subscription } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { getform60masterdataInterface } from "@core/types/FormSixty.Interface";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";
import { savepatientform60detailsModel } from "@core/models/form60PatientDetailsModel.Model";
import { DatePipe } from "@angular/common";
import { CookieService } from "@shared/services/cookie.service";

@Component({
  selector: "out-patients-form-sixty",
  templateUrl: "./form-sixty.component.html",
  styleUrls: ["./form-sixty.component.scss"],
})
export class FormSixtyComponent implements OnInit, AfterViewInit {
  form60FormData = BillingForm.form60FormData;
  form60form!: FormGroup;
  questions: any;
  today: any;
  validationerrorexists: boolean = true;

  constructor(
    private formService: QuestionControlService,
    private http: HttpService,
    private dialogRef: MatDialogRef<FormSixtyComponent>,
    private matDialog: MatDialog,
    private messageDialogService: MessageDialogService,
    private cookie: CookieService,
    @Inject(MAT_DIALOG_DATA)
    public data: { from60data: any; paymentamount: any; OPIP: number },
    private datepipe: DatePipe
  ) {}

  private readonly _destroying$ = new Subject<void>();

  hsplocationId: any = Number(this.cookie.get("HSPLocationId"));
  stationId: any = Number(this.cookie.get("StationId"));
  operatorID: any = Number(this.cookie.get("UserId"));

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.form60FormData.properties,
      {}
    );
    this.form60form = formResult.form;
    this.questions = formResult.questions;
    this.today = new Date();
    this.form60form.controls["dateofapplication"].setValue(this.today);
    this.form60form.controls["dateofapplication"].disable();
    this.form60form.controls["applicationno"].disable();
    this.getForm60DocumentType();
  }

  ngAfterViewInit(): void {
    this.form60form.controls["appliedforpan"].valueChanges.subscribe(
      (value: any) => {
        console.log(value);
        if (value == true) {
          this.form60form.controls["dateofapplication"].enable();
          this.form60form.controls["applicationno"].enable();
          this.form60form.controls["agriculturalincome"].disable();
          this.form60form.controls["otherthanagriculturalincome"].disable();
        } else {
          this.form60form.controls["dateofapplication"].disable();
          this.form60form.controls["applicationno"].disable();
          this.form60form.controls["agriculturalincome"].enable();
          this.form60form.controls["otherthanagriculturalincome"].enable();
        }
      }
    );
    this.form60form.controls["tickforsamedoc"].valueChanges.subscribe(
      (res: any) => {
        if (res == true) {
          this.form60form.controls["addressdocumenttype"].setValue(
            this.form60form.controls["iddocumenttype"].value
          );
          this.form60form.controls["addressdocidentityno"].setValue(
            this.form60form.controls["iddocidentityno"].value
          );
          this.form60form.controls["addressnameofauthority"].setValue(
            this.form60form.controls["idnameofauthority"].value
          );
          console.log(this.form60form.controls["addressdocumenttype"].value);
        } else {
          this.form60form.controls["addressdocumenttype"].setValue("");
          this.form60form.controls["addressdocidentityno"].setValue("");
          this.form60form.controls["addressnameofauthority"].setValue("");
        }
      }
    );
  }

  getForm60DocumentType() {
    this.http
      .get(ApiConstants.getform60masterdata)
      .pipe(takeUntil(this._destroying$))
      .subscribe((resultData: getform60masterdataInterface) => {
        console.log(resultData);

        let formsixtylistPOI: any = resultData.getForm60MasterDataPOI1;
        let formsixtylistPOA: any = resultData.getForm60MasterDataPOA1;
        this.questions[6].options = formsixtylistPOI.map((l: any) => {
          return { title: l.docName, value: l.id };
        });

        this.questions[10].options = formsixtylistPOA.map((l: any) => {
          return { title: l.docName, value: l.id };
        });
      });
  }

  DocumentIDNumber: string = "";
  form60validation() {
    console.log(this.form60form.value.iddocidentityno);
    this.DocumentIDNumber = this.form60form.value.iddocidentityno;
    if (
      this.form60form.value.appliedforpan &&
      this.form60form.value.applicationno == ""
    ) {
      this.messageDialogService.error("Please enter PAN Application Number");
    } else if (
      !this.form60form.value.appliedforpan &&
      this.form60form.value.agriculturalincome == ""
    ) {
      this.messageDialogService.error("Please enter agriculturer income");
    } else if (
      !this.form60form.value.appliedforpan &&
      this.form60form.value.otherthanagriculturalincome == ""
    ) {
      this.messageDialogService.error(
        "Please enter other than agriculturer income"
      );
    } else if (
      this.questions[6].options.value == 0 ||
      this.questions[6].options.title == ""
    ) {
      this.messageDialogService.error("Please select ID proof");
    } else if (
      (this.form60form.value.iddocidentityno =
        "" || this.form60form.value.idnameofauthority == "")
    ) {
      this.messageDialogService.error(
        "Please select ID proof number/name of authority"
      );
    } else if (
      this.questions[10].options.value == 0 ||
      this.questions[10].options.title == ""
    ) {
      this.messageDialogService.error("Please select Address proof");
    } else if (
      this.form60form.value.addressdocidentityno == "" ||
      this.form60form.value.addressnameofauthority == ""
    ) {
      this.messageDialogService.error(
        "Please select address proof number/name of authority"
      );
    } else {
      this.validationerrorexists = false;
    }

    if (this.form60form.value.agriculturalincome == "") {
      this.form60form.value.agriculturalincome = "0";
    }
    if (this.form60form.value.otherthanagriculturalincome == "") {
      this.form60form.value.otherthanagriculturalincome = "0";
    }
  }

  clearform60() {
    this.form60form.reset();
  }

  saveform60() {
    this.form60validation();
    if (!this.validationerrorexists) {
      console.log(
        "deposit request body" + this.getPatientform60SubmitRequestBody()
      );
      console.log(this.form60savedetails);
      this.http
        .post(
          ApiConstants.saveform60patientdata,
          this.getPatientform60SubmitRequestBody()
        )
        .pipe(takeUntil(this._destroying$))
        .subscribe(
          (resultData) => {
            //this.matDialog.closeAll();
            this.dialogRef.close("Success");
            this.messageDialogService.success(
              "Form60 details have been successfully saved."
            );
          },
          (error) => {
            console.log(error);
            this.messageDialogService.info(error.error);
          }
        );
    }
  }

  form60savedetails: savepatientform60detailsModel | undefined;

  getPatientform60SubmitRequestBody(): savepatientform60detailsModel {
    return (this.form60savedetails = new savepatientform60detailsModel(
      this.data.from60data.iacode,
      this.data.from60data.registrationno,
      this.hsplocationId,
      this.operatorID,
      this.form60form.value.aadharno,
      this.form60form.value.appliedforpan == true ? 1 : 0,
      this.datepipe.transform(
        this.form60form.value.dateofapplication,
        "yyyy-MM-ddThh:mm:ss"
      ) || "1900-01-01T00:00:00",
      this.form60form.value.applicationno == undefined
        ? ""
        : this.form60form.value.applicationno,
      this.form60form.value.agriculturalincome == undefined
        ? 0
        : Number(this.form60form.value.agriculturalincome),
      this.form60form.value.otherthanagriculturalincome == undefined
        ? 0
        : Number(this.form60form.value.otherthanagriculturalincome),
      this.form60form.value.iddocumenttype,
      this.DocumentIDNumber,
      this.form60form.value.idnameofauthority,
      this.form60form.value.addressdocumenttype,
      this.form60form.value.addressdocidentityno,
      this.form60form.value.addressnameofauthority,
      this.form60form.value.remarks,
      Number(this.data.paymentamount.transactionamount),
      this.data.paymentamount.MOP,
      this.data.OPIP,
      0,
      ""
    ));
  }
}
