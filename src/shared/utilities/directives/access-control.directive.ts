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
    this.elementRef.nativeElement.style.pointerEvents = "none";
    this.elementRef.nativeElement.style.opacity = 0.4;
    this.checkAccess();
  }
  checkAccess() {
    
    const accessControls: any = this.permission.getAccessControls();
    const exist: any =
      accessControls[this.masterModule][this.moduleId][this.featureId][
        this.actionId
      ];
    if(exist){
      this.elementRef.nativeElement.style.pointerEvents = "initial";
      this.elementRef.nativeElement.style.opacity = 1;
    }else{
      this.elementRef.nativeElement.style.pointerEvents = "none";
      this.elementRef.nativeElement.style.opacity = 0.4;
    }
    //this.elementRef.nativeElement.style.display = exist ? "block" : "none";
  }
}
