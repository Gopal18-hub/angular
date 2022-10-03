import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
@Component({
  selector: "out-patients-servicetax-popup",
  templateUrl: "./servicetax-popup.component.html",
  styleUrls: ["./servicetax-popup.component.scss"],
})
export class ServicetaxPopupComponent implements OnInit {
  proceedwithService!: boolean;
  constructor(
    private dialogref: MatDialogRef<ServicetaxPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    console.log(this.data);
  }
  proceed(number: any) {
    if (number == 1) {
      this.proceedwithService = true;
      this.dialogref.close(this.proceedwithService);
    } else if (number == 0) this.proceedwithService = false;
    this.dialogref.close(this.proceedwithService);
  }
}
