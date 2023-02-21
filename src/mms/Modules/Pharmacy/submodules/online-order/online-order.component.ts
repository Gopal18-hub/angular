import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { webSocket, WebSocketSubject } from "rxjs/webSocket";

@Component({
  selector: "mms-online-order",
  templateUrl: "./online-order.component.html",
  styleUrls: ["./online-order.component.scss"],
})
export class OnlineOrderComponent implements OnInit, OnDestroy {
  subject: any;
  data: any;
  constructor() {}

  ngOnInit(): void {}

  private readonly _destroying$ = new Subject<void>();
  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
