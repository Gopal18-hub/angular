import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subject } from "rxjs";
import { webSocket, WebSocketSubject } from "rxjs/webSocket";

@Component({
  selector: "mms-ep-order",
  templateUrl: "./ep-order.component.html",
  styleUrls: ["./ep-order.component.scss"],
})
export class EPOrderComponent implements OnInit, OnDestroy {
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
