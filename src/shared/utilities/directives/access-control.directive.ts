import { Directive, Input, OnInit, ElementRef } from "@angular/core";
import { PermissionService } from "../../services/permission.service";

@Directive({
  selector: "[accessControl]",
})
export class AccessControlDirective implements OnInit {
  @Input("masterModule") masterModule!: string;
  @Input("moduleId") moduleId!: string;
  @Input("featureId") featureId!: string;
  @Input("actionId") actionId!: string;

  constructor(
    private elementRef: ElementRef,
    private permission: PermissionService
  ) {}

  ngOnInit() {
    this.elementRef.nativeElement.style.display = "none";
    this.checkAccess();
  }
  checkAccess() {
    const accessControls: any = this.permission.getAccessControls();
    const exist: any =
      accessControls[this.masterModule][this.moduleId][this.featureId][
        this.actionId
      ];
    this.elementRef.nativeElement.style.display = exist ? "block" : "none";
  }
}
