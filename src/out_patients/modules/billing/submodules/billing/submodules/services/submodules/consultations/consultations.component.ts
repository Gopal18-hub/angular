import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { HttpService } from "@shared/services/http.service";
import { ApiConstants } from "@core/constants/ApiConstants";
import { BillingApiConstants } from "../../../../BillingApiConstant";
import { CookieService } from "@shared/services/cookie.service";
import { BillingService } from "../../../../billing.service";
@Component({
  selector: "out-patients-consultations",
  templateUrl: "./consultations.component.html",
  styleUrls: ["./consultations.component.scss"],
})
export class ConsultationsComponent implements OnInit, AfterViewInit {
  formData = {
    title: "",
    type: "object",
    properties: {
      specialization: {
        type: "autocomplete",
        required: true,
        placeholder: "--Select--",
      },
      doctorName: {
        type: "autocomplete",
        required: true,
        placeholder: "--Select--",
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
      "doctorName",
      "type",
      "scheduleSlot",
      "bookingDate",
      "price",
    ],
    columnsInfo: {
      sno: {
        title: "S.No.",
        type: "number",
      },
      doctorName: {
        title: "Docotr Name",
        type: "string",
      },
      type: {
        title: "Type",
        type: "dropdown",
        options: [],
      },
      scheduleSlot: {
        title: "Schedule Slot",
        type: "string",
      },
      bookingDate: {
        title: "Booking Date",
        type: "date",
      },
      price: {
        title: "Price",
        type: "number",
      },
    },
  };

  consultationTypes = [];

  constructor(
    private formService: QuestionControlService,
    private http: HttpService,
    private cookie: CookieService,
    private billingService: BillingService
  ) {}

  ngOnInit(): void {
    let formResult: any = this.formService.createForm(
      this.formData.properties,
      {}
    );
    this.formGroup = formResult.form;
    this.questions = formResult.questions;
    this.getSpecialization();
    this.data = this.billingService.consultationItems;
    this.http.get(BillingApiConstants.consultationTypes).subscribe((res) => {
      this.consultationTypes = res;
      this.config.columnsInfo.type.options = res.map((r: any) => {
        return { title: r.name, value: r.id };
      });
    });
  }

  ngAfterViewInit(): void {
    this.tableRows.selection.changed.subscribe((res: any) => {
      const source = res.added[0];
      this.update(source.type, source.sno);
    });
  }

  getSpecialization() {
    this.http.get(BillingApiConstants.getspecialization).subscribe((res) => {
      this.questions[0].options = res.map((r: any) => {
        return { title: r.name, value: r.id };
      });
    });
    this.formGroup.controls["specialization"].valueChanges.subscribe(
      (val: any) => {
        if (val.value) {
          this.getdoctorlistonSpecializationClinic(val.value);
        }
      }
    );
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
        this.questions[1].options = res.map((r: any) => {
          return { title: r.doctorName, value: r.doctorId };
        });
      });
  }

  update(priorityId = 57, sno = 0) {
    this.http
      .get(
        BillingApiConstants.getPrice(
          priorityId,
          this.formGroup.value.doctorName.value,
          25,
          this.cookie.get("HSPLocationId")
        )
      )
      .subscribe((res: any) => {
        if (sno > 0) {
          const index = this.billingService.consultationItems.findIndex(
            (c: any) => c.sno == sno
          );
          this.billingService.consultationItems[index].price = res.amount;
          this.billingService.consultationItems[index].type = priorityId;
          this.data = [...this.billingService.consultationItems];
        }

        this.data = [...this.billingService.consultationItems];
      });
  }

  add(priorityId = 57) {
    if (this.billingService.consultationItems.length == 1) {
      return;
    }
    this.http
      .get(
        BillingApiConstants.getPrice(
          priorityId,
          this.formGroup.value.doctorName.value,
          25,
          this.cookie.get("HSPLocationId")
        )
      )
      .subscribe((res: any) => {
        this.billingService.addToConsultation({
          sno: this.data.length + 1,
          doctorName: this.formGroup.value.doctorName.title,
          type: priorityId,
          scheduleSlot: "",
          bookingDate: "",
          price: res.amount,
        });

        this.data = [...this.billingService.consultationItems];
      });
  }
}
