import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
import { MiscService } from "@modules/billing/submodules/miscellaneous-billing/MiscService.service";

@Component({
  selector: "out-patients-referral",
  templateUrl: "./referral.component.html",
  styleUrls: ["./referral.component.scss"],
})
export class ReferralComponent implements OnInit {
  arrowIcon = "arrow_drop_down";

  @Input() referralDoctorName: string = "";

  @Output() selectedDoctorEvent: EventEmitter<any> = new EventEmitter();

  constructor(private Miscservice: MiscService) {}

  ngOnInit(): void {
    this.Miscservice.clearAllItems.subscribe((clearItems) => {
      if (clearItems) {
        this.referralDoctorName = "";
      }
    });
  }

  selectedDoctor(data: any) {
    this.referralDoctorName = data.docotr.name;
    this.selectedDoctorEvent.emit({ docotr: data.docotr });
  }
}
