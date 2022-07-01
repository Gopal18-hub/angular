import { Directive, Input, OnInit, ElementRef } from "@angular/core";
import { AuthService } from "../../services/auth.service";

@Directive({
  selector: "[accessControl]",
})
export class AccessControlDirective implements OnInit {
  @Input("masterModule") masterModule!: string;
  @Input("moduleId") moduleId!: string;
  @Input("featureId") featureId!: string;
  @Input("actionId") actionId!: string;

  constructor(private elementRef: ElementRef, private auth: AuthService) {}

  ngOnInit() {
    this.elementRef.nativeElement.style.display = "none";
    this.checkAccess();
  }
  checkAccess() {
    const accessControls: any = this.auth.getAccessControls();
    const exist: any =
      accessControls[this.masterModule][this.moduleId][this.featureId][
        this.actionId
      ];
    this.elementRef.nativeElement.style.display = exist ? "block" : "none";
  }
}
