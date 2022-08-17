import { Component, HostListener } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "out-patients-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "Out Patients";

  @HostListener("window:keydown.Alt.r", ["$event"])
  navigateToRegister($event: any) {
    this.router.navigate(["/"]);
  }

  constructor(private router: Router) {}
}
