import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { HttpService } from "@shared/services/http.service";
import { ApiConstants } from "@core/constants/ApiConstants";
import { FormControl } from "@angular/forms";
import {
  debounceTime,
  tap,
  switchMap,
  finalize,
  distinctUntilChanged,
  filter,
  takeUntil,
} from "rxjs/operators";

@Component({
  selector: "out-patients-referral-internal-doctor",
  templateUrl: "./internal-doctor.component.html",
  styleUrls: ["./internal-doctor.component.scss"],
})
export class InternalDoctorComponent implements OnInit {
  doctorsList: any = [];

  term = new FormControl("");

  @Output() selectedDoctorEvent: EventEmitter<any> = new EventEmitter();

  constructor(private http: HttpService) {}

  ngOnInit(): void {
    this.getDoctorsList();
    this.term.valueChanges
      .pipe(
        filter((res: any) => {
          return (res !== null && res.length >= 3) || res == "";
        }),
        debounceTime(1000),
        distinctUntilChanged(),
        switchMap((val) => {
          return this.http
            .get(ApiConstants.getreferraldoctor(1, val))
            .pipe(finalize(() => {}));
        })
      )
      .subscribe(
        (data) => {
          this.doctorsList = data;
        },
        (error) => {
          console.error("There was an error!", error);
        }
      );
  }

  getDoctorsList() {
    this.http.get(ApiConstants.getreferraldoctor(1, "")).subscribe((res) => {
      this.doctorsList = res;
    });
  }

  selectedDoctor(docotr: any) {
    this.selectedDoctorEvent.emit({ docotr });
    this.term.reset();
    this.getDoctorsList();
  }
}
