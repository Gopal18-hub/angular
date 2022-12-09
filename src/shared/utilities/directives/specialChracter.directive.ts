import { Directive, HostListener, ElementRef, Input } from "@angular/core";
@Directive({
  selector: "[specialIsAlphaNumeric]",
})
export class SpecialCharacterDirective {
  @Input() regexStr: string = "";
  @Input() capitalizeText: boolean = false;

  constructor(private el: ElementRef) {}

  @HostListener("keypress", ["$event"]) onKeyPress(event: any) {
    let result = new RegExp(this.regexStr).test(event.key);
    if (result) {
      if (this.capitalizeText)
        this.el.nativeElement.value =
          this.el.nativeElement.value.toCapitalize();
      return true;
    } else {
      return false;
    }
  }

  @HostListener("paste", ["$event"]) blockPaste(event: KeyboardEvent) {
    this.validateFields(event);
  }

  validateFields(event: any) {
    setTimeout(() => {
      let temp = this.el.nativeElement.value
        .replace(/[^A-Za-z ]/g, "")
        .replace(/\s/g, "");
      if (this.capitalizeText) {
        temp = temp.toCapitalize();
      }
      this.el.nativeElement.value = temp;
      event.preventDefault();
    }, 100);
  }
}
