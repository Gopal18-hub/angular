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
      serviceType: {
        type: "dropdown",
        required: true,
        placeholder: "--Select--",
      },
      investigation: {
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
      "investigations",
      "precaution",
      "priority",
      "specialisation",
      "doctorName",
      "price",
    ],
    columnsInfo: {
      sno: {
        title: "S.No.",
        type: "number",
      },
      investigations: {
        title: "Investigations",
        type: "string",
      },
      precaution: {
        title: "Precaution",
        type: "string",
      },
      priority: {
        title: "Priority",
        type: "dropdown",
        options: [],
      },
      specialisation: {
        title: "Specialisation",
        type: "dropdown",
        options: [],
      },
      doctorName: {
        title: "Doctor Name",
        type: "dropdown",
        options: [],
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
    this.getServiceTypes();
    this.getSpecialization();
  }

  getSpecialization() {
    this.http.get(BillingApiConstants.getspecialization).subscribe((res) => {
      this.config.columnsInfo.specialisation.options = res.map((r: any) => {
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
        this.config.columnsInfo.doctorName.options = res.map((r: any) => {
          return { title: r.doctorName, value: r.doctorId };
        });
      });
  }

  getServiceTypes() {
    this.http
      .get(BillingApiConstants.getinvestigationservice)
      .subscribe((res) => {
        this.questions[0].options = res.map((r: any) => {
          return { title: r.name, value: r.id };
        });
      });
    this.formGroup.controls["serviceType"].valueChanges.subscribe(
      (val: any) => {
        if (val) {
          this.getInvestigations(val);
        }
      }
    );
  }

  getInvestigations(serviceId: number) {
    this.http
      .get(
        BillingApiConstants.getinvestigation(
          Number(this.cookie.get("HSPLocationId")),
          serviceId
        )
      )
      .subscribe((res) => {
        this.questions[1].options = res.map((r: any) => {
          return { title: r.name, value: r.id };
        });
      });
  }

  add(priorityId = 1) {
    this.http
      .get(
        BillingApiConstants.getPrice(
          priorityId,
          this.formGroup.value.investigation.value,
          41,
          this.cookie.get("HSPLocationId")
        )
      )
      .subscribe((res: any) => {
        // if (sno > 0) {
        //   const index = this.billingService.consultationItems.findIndex(
        //     (c: any) => c.sno == sno
        //   );
        //   this.billingService.removeFromConsultation(index);
        //   this.data = [...this.billingService.consultationItems];
        // }
        this.billingService.addToConsultation({
          sno: this.data.length + 1,
          investigations: this.formGroup.value.investigation.title,
          precaution: "",
          priority: priorityId,
          specialisation: "",
          doctorName: "",
          price: res.amount,
        });

        this.data = [...this.billingService.consultationItems];
      });
  }
}
