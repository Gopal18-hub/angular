import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog,  MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BillingForm } from '@core/constants/BillingForm';
import { QuestionControlService } from '../../../../../../shared/ui/dynamic-forms/service/question-control.service';
import { HttpService } from '@shared/services/http.service';
import { ApiConstants } from "@core/constants/ApiConstants";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { getform60masterdataInterface } from  "@core/types/FormSixty.Interface";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";

@Component({
  selector: 'out-patients-form-sixty',
  templateUrl: './form-sixty.component.html',
  styleUrls: ['./form-sixty.component.scss']
})
export class FormSixtyComponent implements OnInit {

  form60FormData = BillingForm.form60FormData;
  form60form!: FormGroup;
  questions: any;
  today: any;
  constructor( private formService: QuestionControlService,private http: HttpService,
    private matdialog: MatDialog, private messageDialogService: MessageDialogService) { }
  
  private readonly _destroying$ = new Subject<void>();

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
    this.form60form.controls["iddocumenttype"].setValue({ title: "<--Select-->", value: 0 });
    this.form60form.controls["addressdocumenttype"].setValue({ title: "<--Select-->", value: 0 });

  }

  ngAfterViewInit(): void{
    this.form60form.controls["appliedforpan"].valueChanges.subscribe((value:any)=>{
      console.log(value);
      if(value == true)
      {
        this.form60form.controls["dateofapplication"].enable();
        this.form60form.controls["applicationno"].enable();
        this.form60form.controls["agriculturalincome"].disable();
        this.form60form.controls["otherthanagriculturalincome"].disable();
      }
      else{
        this.form60form.controls["dateofapplication"].disable();
        this.form60form.controls["applicationno"].disable();
        this.form60form.controls["agriculturalincome"].enable();
        this.form60form.controls["otherthanagriculturalincome"].enable();
      }
    });
    this.form60form.controls["tickforsamedoc"].valueChanges.subscribe((res:any)=>{
      if(res == true)
      {
        this.form60form.controls["addressdocumenttype"].setValue({value:this.form60form.controls["iddocumenttype"].value});
        this.form60form.controls["addressdocidentityno"].setValue(this.form60form.controls["iddocidentityno"].value);
        this.form60form.controls["addressnameofauthority"].setValue(this.form60form.controls["idnameofauthority"].value);
        console.log(this.form60form.controls["addressdocumenttype"].value);
      }
      else{
        this.form60form.controls["addressdocumenttype"].setValue('');
        this.form60form.controls["addressdocidentityno"].setValue('');
        this.form60form.controls["addressnameofauthority"].setValue('');
      }
    });
 
  }

  getForm60DocumentType(){
    this.http
    .get(ApiConstants.getform60masterdata)
    .pipe(takeUntil(this._destroying$))
    .subscribe((resultData: getform60masterdataInterface) => {
      console.log(resultData);

      let formsixtylistPOI : any = resultData.getForm60MasterDataPOI1;
      let formsixtylistPOA : any = resultData.getForm60MasterDataPOA1;
      this.questions[6].options = formsixtylistPOI.map((l:any) => {
        return { title: l.docName, value: l.id };
      });
  
      this.questions[10].options = formsixtylistPOA.map((l:any) => {
        return { title: l.docName, value: l.id };
      });
    
    });
  }

  saveform60(){
  if(this.form60form.value.appliedforpan && this.form60form.value.applicationno == ""){
    this.messageDialogService.error("Please enter PAN Application Number");
  }
  else if(!this.form60form.value.appliedforpan  && this.form60form.value.agriculturalincome == ""){
    this.messageDialogService.error("Please enter agriculturer income");
  }
  else if(!this.form60form.value.appliedforpan  && this.form60form.value.otherthanagriculturalincome == ""){
    this.messageDialogService.error("Please enter other than agriculturer income");
  }
  }

  clearform60(){
    this.form60form.reset();
  }
}
