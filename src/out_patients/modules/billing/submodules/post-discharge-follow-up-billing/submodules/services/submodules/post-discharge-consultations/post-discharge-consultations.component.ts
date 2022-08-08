import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BillingApiConstants } from '@modules/billing/submodules/billing/BillingApiConstant';
import { QuestionControlService } from '@shared/ui/dynamic-forms/service/question-control.service';
import { HttpService } from '@shared/services/http.service';
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
        type: "autocomplete",
        placeholder: "--Select--",
        options: [],
      },
      doctorName: {
        type: "autocomplete",
        placeholder: "--Select--",
        options: [],
      },
    },
  };
  formGroup!: FormGroup;
  questions: any;

  @ViewChild("table") tableRows: any;
  data: any = [
    {'sno':'1', 'doctorname':'Ravi Kant Behl', 'type':'CPT99202','schedule_slot':'Selected Slot','booking_date':'09/08/2022','price':'1200.0'},
    {'sno':'2', 'doctorname':'Ravi Kant Behl', 'type':'CPT99202','schedule_slot':'Selected Slot','booking_date':'09/08/2022','price':'1200.0'},
    {'sno':'3', 'doctorname':'Ravi Kant Behl', 'type':'CPT99202','schedule_slot':'Selected Slot','booking_date':'09/08/2022','price':'1200.0'},
    {'sno':'4', 'doctorname':'Ravi Kant Behl', 'type':'CPT99202','schedule_slot':'Selected Slot','booking_date':'09/08/2022','price':'1200.0'},
    {'sno':'5', 'doctorname':'Ravi Kant Behl', 'type':'CPT99202','schedule_slot':'Selected Slot','booking_date':'09/08/2022','price':'1200.0'}
  ];
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
  constructor(
    private formService: QuestionControlService,
    private http: HttpService
    ) { }

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.formData.properties,
      {}
    );
    this.formGroup = formResult.form;
    this.questions = formResult.questions;
    this.formGroup.controls["doctorName"].disable();
    this.getSpecialization();
  }
  ngAfterViewInit(): void
  {
    this.formGroup.controls["specialization"].valueChanges.subscribe(res => {
      console.log(res);
      this.questions[1].options = [];
      this.formGroup.controls["doctorName"].enable();
      this.getdoctorlistonSpecializationClinic(res.value);
    })
  }
  getSpecialization() {
    this.http.get(BillingApiConstants.getspecialization).subscribe((res) => {
      console.log(res);
      this.questions[0].options = res.map((r: any) => {
        return { title: r.name, value: r.id };
      });
    });
  }

  getdoctorlistonSpecializationClinic(clinicSpecializationId: number) {
    this.http
      .get(
        BillingApiConstants.getdoctorlistonSpecializationClinic(
          false,
          clinicSpecializationId,
          1
        )
      )
      .subscribe((res) => {
        console.log(res);
        this.questions[1].options = res.map((r: any) => {
          return { title: r.doctorName, value: r.doctorId };
        });
      });
  }

}
