import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { QuestionControlService } from '@shared/ui/dynamic-forms/service/question-control.service';

@Component({
  selector: 'out-patients-post-discharge-consultations',
  templateUrl: './post-discharge-consultations.component.html',
  styleUrls: ['./post-discharge-consultations.component.scss']
})
export class PostDischargeConsultationsComponent implements OnInit {

  formData = {
    title: "",
    type: "object",
    properties: {
      specialization: {
        type: "dropdown",
      },
      doctorName: {
        type: "dropdown",
      },
    },
  };
  formGroup!: FormGroup;
  questions: any;

  @ViewChild("table") tableRows: any;
  data: any = [];
  config: any = {
    clickedRows: false,
    actionItems: false,
    dateformat: "dd/MM/yyyy",
    selectBox: false,
    displayedColumns: [
      "sno",
      "doctorname",
      "type",
      "schedule_slot",
      "booking_date",
      "price"
    ],
    columnsInfo: {
      sno: {
        title: "S.No",
        type: "string",
        style: {
          width: "5rem"
        }
      },
      doctorname: {
        title: "Doctor Name",
        type: "string",
        style: {
          width: "16rem"
        }
      },
      type: {
        title: "Type",
        type: "dropdown",
        style: {
          width: "10rem"
        }
      },
      schedule_slot: {
        title: "Schedule Slot",
        type: "string",
        style: {
          width: "10rem"
        }
      },
      booking_date: {
        title: "Booking Date",
        type: "string",
        style: {
          width: "10rem"
        }
      },
      price: {
        title: "Price",
        type: "string",
        style: {
          width: "8rem"
        }
      }
    },
  };
  constructor(private formService: QuestionControlService) { }

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.formData.properties,
      {}
    );
    this.formGroup = formResult.form;
    this.questions = formResult.questions;
  }

}
