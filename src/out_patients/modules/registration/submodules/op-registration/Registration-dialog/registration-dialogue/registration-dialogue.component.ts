import { Component, Inject, OnInit } from "@angular/core";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";

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
    public matDialog: MatDialog
  ) // private cookie:CookieService,
  {}

  ngOnInit(): void {}

  btn1Functionlity() {
    if (this.data.bt1Msg == "Ok") {
      this.dialogRef.close("Success");
    }
  }

  btn2Functionlity() {
    if (this.data.bt2Msg == "Cancel") {
      this.dialogRef.close();
    }
  }
}
