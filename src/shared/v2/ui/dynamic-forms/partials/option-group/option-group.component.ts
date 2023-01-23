import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-option-group",
  templateUrl: "./option-group.component.html",
  styleUrls: ["./option-group.component.scss"],
})
export class OptionGroupComponent implements OnInit {
  @Input() opt: any;

  constructor() {}

  ngOnInit() {}
}
