import { Component, HostListener, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService } from "@shared/services/auth.service";

@Component({
  selector: "out-patients-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  title = "Out Patients";

  isAuthenticated: boolean = false;

  @HostListener("window:keydown.Alt.r", ["$event"])
  navigateToRegister($event: any) {
    this.router.navigate(["/registration"]);
  }

  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit(): void {
    this.isAuthenticated = this.auth.isAuthenticated();
  }
}
