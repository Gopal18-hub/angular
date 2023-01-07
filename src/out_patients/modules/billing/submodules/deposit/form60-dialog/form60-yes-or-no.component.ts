import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { Subject } from "rxjs";

@Component({
  selector: "out-patients-form60-yes-or-no",
  templateUrl: "./form60-yes-or-no.component.html",
  styleUrls: ["./form60-yes-or-no.component.scss"],
})
export class Form60YesOrNoComponent implements OnInit {
  private readonly _destroying$ = new Subject<void>();
  constructor(private dialogref: MatDialogRef<Form60YesOrNoComponent>) {}

  ngOnInit(): void {}
  click(str: any) {
    if (str == "yes") {
      this.dialogref.close(str);
    } else if (str == "no") {
      this.dialogref.close(str);
    }
  }
  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
