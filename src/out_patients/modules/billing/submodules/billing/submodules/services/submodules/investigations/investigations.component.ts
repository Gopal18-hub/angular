import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { QuestionControlService } from "@shared/ui/dynamic-forms/service/question-control.service";
import { HttpService } from "@shared/services/http.service";
import { ApiConstants } from "@core/constants/ApiConstants";
import { BillingApiConstants } from "../../../../BillingApiConstant";
import { CookieService } from "@shared/services/cookie.service";
import { BillingService } from "../../../../billing.service";

@Component({
  selector: "out-patients-investigations",
  templateUrl: "./investigations.component.html",
  styleUrls: ["./investigations.component.scss"],
})
export class InvestigationsComponent implements OnInit {
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
  }

  add(priorityId = 1, sno = 0) {
    this.http
      .get(
        BillingApiConstants.getPrice(
          priorityId,
          this.formGroup.value.doctorName.value,
          41,
          this.cookie.get("HSPLocationId")
        )
      )
      .subscribe((res: any) => {
        if (sno > 0) {
          const index = this.billingService.consultationItems.findIndex(
            (c: any) => c.sno == sno
          );
          this.billingService.removeFromConsultation(index);
          this.data = [...this.billingService.consultationItems];
        }
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
