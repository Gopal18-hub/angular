import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QuestionControlService } from '../../../../../shared/ui/dynamic-forms/service/question-control.service';


@Component({
  selector: 'out-patients-dmg-mapping',
  templateUrl: './dmg-mapping.component.html',
  styleUrls: ['./dmg-mapping.component.scss']
})
export class DmgMappingComponent implements OnInit {

  dmgMappingformData={
    title:"",
    type:"object",
    properties:{
      maxId:{
        type:"string"
      },
      mobileno:{
        type:"number"
      },
      breast:{
        type:"checkbox",
        options: [
          { title: "Breast" }
        ],
      },
      headandneck:{
        type:"checkbox",
        options: [
          { title: "Head & Neck" }
        ],
      },
      gastro:{
        type:"checkbox",
        options: [
          { title: "Gastrointestinal" }
        ],
      },
      neuro:{
        type:"checkbox",
        options: [
          { title: "Neuro" }
        ],
      },
      thoracic:{
        type:"checkbox",
        options: [
          { title: "Thoracic" }
        ],
      },
      urology:{
        type:"checkbox",
        options: [
          { title: "Urology" }
        ],
      },
      gynae:{
        type:"checkbox",
        options: [
          { title: "Gynae" }
        ],
      },
      muscluoskeletal:{
        type:"checkbox",
        options: [
          { title: "Muscluoskeletal" }
        ],
      },
      pediatric:{
        type:"checkbox",
        options: [
          { title: "Pediatric" }
        ],
      },
      hemathologyandbmt:{
        type:"checkbox",
        options: [
          { title: "Hemathology and BMT" }
        ],
      },
     
    
    }
  }

  dmgMappingForm! : FormGroup;
  questions:any;
  constructor(
    private formService: QuestionControlService
    ) { }

  ngOnInit(): void {
    let formResult:any = this.formService.createForm(
      this.dmgMappingformData.properties,
      {}
    )
    this.dmgMappingForm= formResult.form;
    this.questions=formResult.questions;
  }
  

}
