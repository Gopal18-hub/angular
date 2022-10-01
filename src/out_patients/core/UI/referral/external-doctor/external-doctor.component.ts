import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
} from "@angular/core";
import { FormGroup } from "@angular/forms";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { HttpService } from "@shared/services/http.service";
import { ApiConstants } from "@core/constants/ApiConstants";
import { BillingApiConstants } from "../../../../modules/billing/submodules/billing/BillingApiConstant";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";

@Component({
  selector: "out-patients-referral-external-doctor",
  templateUrl: "./external-doctor.component.html",
  styleUrls: ["./external-doctor.component.scss"],
})
export class ExternalDoctorComponent implements OnInit {
  @ViewChild("table") tableRows: any;

  config: any = {
    clickedRows: false,
    actionItems: false,
    dateformat: "dd/MM/yyyy",
    selectBox: true,
    clickSelection: "single",
    selectCheckBoxLabel: "",
    displayedColumns: ["name", "mobile", "speciality", "type"],
    columnsInfo: {
      name: {
        title: "Name",
        type: "string",
      },
      mobile: {
        title: "Mobile",
        type: "string",
      },
      speciality: {
        title: "Speciality",
        type: "string",
      },
      type: {
        title: "Type",
        type: "string",
      },
    },
  };

  formData = {
    title: "",
    type: "object",
    properties: {
      firstname: {
        title: "First Name",
        type: "string",
        required: true,
      },
      lastname: {
        title: "Last Name",
        type: "string",
        required: true,
      },
      mobile: {
        title: "Mobile",
        type: "string",
        required: true,
      },
      speciality: {
        type: "dropdown",
        placeholder: "--Select--",
        title: "Speciality",
        required: true,
      },
    },
  };
  formGroup!: FormGroup;
  questions: any;

  addDoctor: boolean = false;

  doctorsList: any = [];

  term: any;

  alreadyDoctorsExist: any = [];

  @Output() selectedDoctorEvent: EventEmitter<any> = new EventEmitter();

  constructor(
    private formService: QuestionControlService,
    private http: HttpService,
    private messageDialogService: MessageDialogService
  ) {}

  ngOnInit(): void {
    this.getDoctorsList();
  }

  getDoctorsList() {
    this.http.get(ApiConstants.getreferraldoctor(2, "")).subscribe((res) => {
      this.doctorsList = res;
    });
  }

  getSpecialization() {
    this.http.get(BillingApiConstants.getspecialization).subscribe((res) => {
      this.questions[3].options = res.map((r: any) => {
        return { title: r.name, value: r.id };
      });
    });
  }

  selectedDoctor(docotr: any) {
    this.selectedDoctorEvent.emit({ docotr });
  }

  selectDoctorFromTable() {
    this.selectedDoctorEvent.emit({
      docotr: this.tableRows.selection.selected[0],
    });
    this.alreadyDoctorsExist = [];
    this.addDoctor = false;
  }

  initiateForm($event: any) {
    $event.stopPropagation();
    this.addDoctor = true;
    let formResult: any = this.formService.createForm(
      this.formData.properties,
      {}
    );
    this.formGroup = formResult.form;
    this.questions = formResult.questions;
    this.getSpecialization();
  }
  createDoctor($event: any) {
    $event.stopPropagation();
    if (this.formGroup.valid) {
      this.http
        .get(
          ApiConstants.getsimilarsoundreferraldoctor(
            this.formGroup.value.speciality,
            this.formGroup.value.firstname,
            this.formGroup.value.lastname,
            this.formGroup.value.mobile
          )
        )
        .subscribe((res: any) => {
          if (res.length > 0) {
            this.alreadyDoctorsExist = res;
            this.messageDialogService.error(
              "Referral Doctor with similar name laready exists. Please validate."
            );
          } else {
          }
        });
    }
  }

  cancelCreateDoctor($event: any) {
    $event.stopPropagation();
    this.addDoctor = false;
  }
}
