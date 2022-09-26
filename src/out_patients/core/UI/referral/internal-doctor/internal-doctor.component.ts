import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { HttpService } from "@shared/services/http.service";
import { ApiConstants } from "@core/constants/ApiConstants";

@Component({
  selector: "out-patients-referral-internal-doctor",
  templateUrl: "./internal-doctor.component.html",
  styleUrls: ["./internal-doctor.component.scss"],
})
export class InternalDoctorComponent implements OnInit {
  doctorsList: any = [];

  term: any;

  @Output() selectedDoctorEvent: EventEmitter<any> = new EventEmitter();

  constructor(private http: HttpService) {}

  ngOnInit(): void {
    this.getDoctorsList();
  }

  getDoctorsList() {
    this.http.get(ApiConstants.getreferraldoctor(1, "")).subscribe((res) => {
      this.doctorsList = res;
    });
  }

  selectedDoctor(docotr: any) {
    this.selectedDoctorEvent.emit({ docotr });
  }
}
