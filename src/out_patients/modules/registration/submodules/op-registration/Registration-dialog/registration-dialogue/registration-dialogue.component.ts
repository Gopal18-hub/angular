import { Component, Inject, OnInit } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { Router } from "@angular/router";

@Component({
  selector: "out-patients-registration-dialogue",
  templateUrl: "./registration-dialogue.component.html",
  styleUrls: ["./registration-dialogue.component.scss"],
})
export class RegistrationDialogueComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      message1: String;
      message2: string;
      btn1: boolean;
      btn2: boolean;
      bt1Msg: string;
      bt2Msg: string;
    },
    private dialogRef: MatDialogRef<RegistrationDialogueComponent>,
    public matDialog: MatDialog, // private cookie:CookieService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  btn1Functionlity() {
    if (this.data.bt1Msg == "Proceed to Billing") {
      let MaxId = this.data.message2.trim().split(":")[1];
      this.dialogRef.close("Success");
      this.router.navigate(["out-patient-billing"], {
        queryParams: { maxId: MaxId.trim() },
      });
    } else if (this.data.bt1Msg == "Ok") {
      this.dialogRef.close("Success");
    }
  }

  btn2Functionlity() {
    if (this.data.bt2Msg == "Proceed to Deposit") {
      let MaxId = this.data.message2.trim().split(":")[1];
      this.dialogRef.close();
      this.router.navigate(["out-patient-billing", "deposit"], {
        queryParams: { maxID: MaxId.trim() },
      });
    } else if (this.data.bt2Msg == "Cancel") {
      this.dialogRef.close();
    }
  }
}
