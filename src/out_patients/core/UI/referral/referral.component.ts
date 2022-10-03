import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";

@Component({
  selector: "out-patients-referral",
  templateUrl: "./referral.component.html",
  styleUrls: ["./referral.component.scss"],
})
export class ReferralComponent implements OnInit {
  arrowIcon = "arrow_drop_down";

  @Input() referralDoctorName: string = "";

  @Output() selectedDoctorEvent: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  selectedDoctor(data: any) {
    this.referralDoctorName = data.docotr.name;
    this.selectedDoctorEvent.emit({ docotr: data.docotr });
  }
}
