import { Component, OnInit } from "@angular/core";
import { ApiConstants } from "../../../../../out_patients/core/constants/ApiConstants";
import { MatDialog } from "@angular/material/dialog";
import { AppointmentSearchDialogComponent } from "./appointment-search-dialog/appointment-search-dialog.component";
ApiConstants;
@Component({
  selector: "out-patients-appointment-search",
  templateUrl: "./appointment-search.component.html",
  styleUrls: ["./appointment-search.component.scss"],
})
export class AppointmentSearchComponent implements OnInit {
  constructor(public matDialog: MatDialog) {}
  ngOnInit(): void {}

  openDialog() {
    this.matDialog.open(AppointmentSearchDialogComponent, { width: "98vw" });
  }
}
