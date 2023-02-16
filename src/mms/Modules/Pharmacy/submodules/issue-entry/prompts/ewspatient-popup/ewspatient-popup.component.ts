import { Component, Inject, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { IssueEntryService } from "../../../../../../core/services/issue-entry.service";
@Component({
  selector: "mms-ewspatient-popup",
  templateUrl: "./ewspatient-popup.component.html",
  styleUrls: ["./ewspatient-popup.component.scss"],
})
export class EwspatientPopupComponent implements OnInit {
  bplCardNo: string = "";
  addressOnCard: string = "";
  lastBillNo: string = "";
  lastBillDate: string = "";
  lastBillStation: string = "";
  lastBillAmount: string = "";
  constructor(
    private _matSnackBar: MatSnackBar,
    public issueEntryService: IssueEntryService
  ) {}

  ngOnInit(): void {
    this.bplCardNo = this.issueEntryService.bplCardNo;
    this.addressOnCard = this.issueEntryService.addressonCard;
    this.lastBillNo = this.issueEntryService.lastBillNo;
    this.lastBillDate = this.issueEntryService.lastBillDate;
    this.lastBillStation = this.issueEntryService.lastBillStation;
    this.lastBillAmount = this.issueEntryService.lastBillAmount;
  }
  closeEwsPopup() {
    this._matSnackBar.dismiss();
  }
  submit() {}
}
