import { Directive, DoCheck } from "@angular/core";
import { NgModel } from "@angular/forms";

@Directive({
  selector: "[controlDirty]",
})
export class ControlDirtyDirective implements DoCheck {
  constructor(private control: NgModel) {}
  ngDoCheck(): void {
    this.control.control.markAsTouched();
  }
}
