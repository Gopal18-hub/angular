import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "reports-tabs",
  templateUrl: "./tabs.component.html",
  styleUrls: ["./tabs.component.scss"],
})
export class TabsComponent implements OnInit {
  @Input() reportConfig: any;
  constructor() {}

  ngOnInit(): void {}
}
