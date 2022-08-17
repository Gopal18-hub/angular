import { Component, OnInit } from "@angular/core";
import { AuthService } from "@shared/services/auth.service";

@Component({
  selector: "out-patients-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  title = "Out Patients";

  isAuthenticated: boolean = false;

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    this.isAuthenticated = this.auth.isAuthenticated();
  }
}
