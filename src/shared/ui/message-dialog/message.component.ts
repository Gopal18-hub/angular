import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "maxhealth-success-message",
  templateUrl: "./success.html",
})
export class MessageSuccessComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<MessageSuccessComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  ngOnInit(): void {}
}

@Component({
  selector: "maxhealth-info-message",
  templateUrl: "./info.html",
})
export class MessageInfoComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<MessageInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  ngOnInit(): void {}
}

@Component({
  selector: "maxhealth-error-message",
  templateUrl: "./error.html",
})
export class MessageErrorComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<MessageErrorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  ngOnInit(): void {}
}

@Component({
  selector: "maxhealth-conform-message",
  templateUrl: "./confirm.html",
})
export class MessageConfirmComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<MessageConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  ngOnInit(): void {}
  yes() {
    this.dialogRef.close({ type: "yes" });
  }
  no() {
    this.dialogRef.close({ type: "no" });
  }
}

@Component({
  selector: "maxhealth-warning-message",
  templateUrl: "./warning.html",
})
export class MessageWarningComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<MessageWarningComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  ngOnInit(): void {}
}
