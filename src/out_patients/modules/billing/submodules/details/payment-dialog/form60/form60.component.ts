import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpService } from '@shared/services/http.service';
import { QuestionControlService } from '@shared/ui/dynamic-forms/service/question-control.service';
import { Subject, takeUntil } from 'rxjs';
import { ApiConstants } from 'src/out_patients/core/constants/ApiConstants';
import { getform60masterdataInterface } from 'src/out_patients/core/types/FormSixty.Interface';

@Component({
  selector: 'out-patients-form60',
  templateUrl: './form60.component.html',
  styleUrls: ['./form60.component.scss']
})
export class Form60Component implements OnInit {

  form60FormData = {
    title: "",
    type: "object",
    properties: {
      aadharno: {
        type: "number",
        pattern: "^[2-9]{1}[0-9]{3}\s[0-9]{4}\s[0-9]{4}$"
      },
      appliedforpan: {
        type: "checkbox",
        options: [{
          title: ''
        }]
      },
      dateofapplication: {
        type: "date"
      },
      applicationno: {
        type: "number"
      },
      agriculturalincome: {
        type: "string"
      },
      otherthanagriculturalincome: {
        type: "string"
      },
      iddocumenttype: {
        type: "autocomplete"
      },
      iddocidentityno: {
        type: "number"
      },
      idnameofauthority: {
        type: "string"
      },
      tickforsamedoc: {
        type: "checkbox",
        options: [{
          title: ''
        }]
      },
      addressdocumenttype: {
        type: "autocomplete"
      },
      addressdocidentityno: {
        type: "number"
      },
      addressnameofauthority: {
        type: "string"
      },
      remarks: {
        type: "string"
      }
    },
  };
  form60form!: FormGroup;
  questions: any;
  today: any;

  private readonly _destroying$ = new Subject<void>();
  constructor(
    private formService: QuestionControlService,
    private http: HttpService
  ) { }

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
      // this.questions[6].options = resultData.getForm60MasterDataPOI1.map((l) => {
      //   return { title: l.docName, value: l.id };
      // });
  
      // this.questions[10].options = resultData.getForm60MasterDataPOA1.map((l) => {
      //   return { title: l.docName, value: l.id };
      // });
    });
  }

  saveform60(){

  }

  clearform60(){

  }

}
