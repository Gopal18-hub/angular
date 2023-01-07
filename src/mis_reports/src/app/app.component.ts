import { Component } from "@angular/core";
import { AuthService } from "@shared/services/auth.service";

@Component({
  selector: "mis-reports-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "MIS Reports";
  isAuthenticated: boolean = false;

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.isAuthenticated = this.auth.isAuthenticated();
  }
}
