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
import { DepositService } from "@core/services/deposit.service";

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
    private datepipe: DatePipe,
    private depositservice: DepositService,
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
    if(this.depositservice.isform60exists){
         this.updateexistingform60info();
    }
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
          this.form60form.controls["agriculturalincome"].setValue("");
          this.form60form.controls["otherthanagriculturalincome"].setValue("");
        } else {
          this.form60form.controls["dateofapplication"].disable();
          this.form60form.controls["applicationno"].disable();
          this.form60form.controls["agriculturalincome"].enable();
          this.form60form.controls["otherthanagriculturalincome"].enable();
          this.form60form.controls["applicationno"].setValue("");
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
    this.validationerrorexists = true;
    if( this.form60form.value.aadharno == "" ||  this.form60form.value.aadharno == null ){
      this.questions[0].elementRef.focus();
      this.messageDialogService.error("Please enter Aadhar No.");    
    }
    else if (
      this.form60form.value.appliedforpan &&
      this.form60form.value.applicationno == ""
    ) {
      this.messageDialogService.error("Please enter PAN Application Number");
    } else if (
      !this.form60form.value.appliedforpan &&
     ( this.form60form.value.agriculturalincome == "" || Number(this.form60form.value.agriculturalincome) <= 0)
    ) {
      this.messageDialogService.error("Please enter agriculturer income");
    } else if (
      !this.form60form.value.appliedforpan &&
      (this.form60form.value.otherthanagriculturalincome == "" || Number(this.form60form.value.otherthanagriculturalincome) <= 0)
    ) {
      this.messageDialogService.error(
        "Please enter other than agriculturer income"
      );
    } else if (
      this.form60form.value.iddocumenttype == "" ||
      this.form60form.value.iddocumenttype == null
    ) {
      this.messageDialogService.error("Please select ID proof");
    } else if (
      (this.form60form.value.iddocidentityno =
        "" || this.form60form.value.idnameofauthority == "" 
        || this.form60form.value.iddocidentityno == null
         || this.form60form.value.idnameofauthority == null)
    ) {
      this.messageDialogService.error(
        "Please select ID proof number/name of authority"
      );
    } else if (
      this.form60form.value.addressdocumenttype == "" || 
      this.form60form.value.addressdocumenttype == null
    ) {
      this.messageDialogService.error("Please select Address proof");
    } else if (
      this.form60form.value.addressdocidentityno == "" ||
      this.form60form.value.addressdocidentityno == null ||
      this.form60form.value.addressnameofauthority == "" ||
      this.form60form.value.addressnameofauthority == null
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
    this.depositservice.clearformsixtydetails();    
    this.form60form.controls["dateofapplication"].setValue(this.today);
  }

  saveform60() {
    this.form60validation();
    if (!this.validationerrorexists) {
      this.depositservice.clearformsixtydetails();
      this.getPatientform60SubmitRequestBody();
      this.dialogRef.close("Success");
      this.messageDialogService.success(
        "Form60 details have been successfully saved."
      );
    }
  }

  form60savedetails: savepatientform60detailsModel | undefined;

  getPatientform60SubmitRequestBody(): savepatientform60detailsModel {
   this.form60savedetails = new savepatientform60detailsModel(
      this.data.from60data.iacode,
      this.data.from60data.registrationno,
      this.hsplocationId,
      this.operatorID,
      this.form60form.value.aadharno,
      this.form60form.value.appliedforpan == true ? 1 : 0,
      this.datepipe.transform(
        this.form60form.value.dateofapplication,
        "yyyy-MM-ddThh:mm:ss"
      ) || this.today,
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
      "",
      this.form60form.value.tickforsamedoc
    );
    this.depositservice.setdepositformsixtydata(this.form60savedetails);
    return this.form60savedetails;
  }

  updateexistingform60info(){
    let formsixtylist = this.depositservice.depositformsixtydetails;
    this.form60form.controls["aadharno"].setValue(formsixtylist.adhaarNo);
    this.form60form.controls["appliedforpan"].setValue(formsixtylist.isAppliedForPAN);
    this.form60form.controls["dateofapplication"].setValue(formsixtylist.panAppliedDate);
    this.form60form.controls["applicationno"].setValue(formsixtylist.panApplicationNo);
    this.form60form.controls["agriculturalincome"].setValue(formsixtylist.agriculturalIncome);
    this.form60form.controls["otherthanagriculturalincome"].setValue(formsixtylist.otherIncome);
    this.form60form.controls["iddocumenttype"].setValue(formsixtylist.idDoc);
    this.form60form.controls["iddocidentityno"].setValue(formsixtylist.idDocNumber);
    this.form60form.controls["idnameofauthority"].setValue(formsixtylist.idNameOfAuthority);
    this.form60form.controls["tickforsamedoc"].setValue(formsixtylist.tickforsamedoc);
    this.form60form.controls["addressdocumenttype"].setValue(formsixtylist.addressDoc);
    this.form60form.controls["addressdocidentityno"].setValue(formsixtylist.addressDocNumber);
    this.form60form.controls["addressnameofauthority"].setValue(formsixtylist.addressNameOfAuthority);
    this.form60form.controls["remarks"].setValue(formsixtylist.remarks);

    if(formsixtylist.isAppliedForPAN){
      this.form60form.controls["dateofapplication"].enable();
          this.form60form.controls["applicationno"].enable();
          this.form60form.controls["agriculturalincome"].disable();
          this.form60form.controls["otherthanagriculturalincome"].disable();
          this.form60form.controls["agriculturalincome"].setValue("");
          this.form60form.controls["otherthanagriculturalincome"].setValue("");
    }else{
      this.form60form.controls["dateofapplication"].disable();
      this.form60form.controls["applicationno"].disable();
      this.form60form.controls["agriculturalincome"].enable();
      this.form60form.controls["otherthanagriculturalincome"].enable();
      this.form60form.controls["applicationno"].setValue("");
    }
  }
}
