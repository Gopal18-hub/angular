import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QuestionControlService } from '../../../../../../shared/ui/dynamic-forms/service/question-control.service';

@Component({
  selector: 'out-patients-form-sixty',
  templateUrl: './form-sixty.component.html',
  styleUrls: ['./form-sixty.component.scss']
})
export class FormSixtyComponent implements OnInit {

  form60FormData = {
    title: "",
    type: "object",
    properties: {
      aadharno: {
        type: "number",
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
  constructor( private formService: QuestionControlService) { }

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
    })
  }
}
