import { Component, OnDestroy } from "@angular/core";
import { NavigationStart, Router } from "@angular/router";
import { Subscription } from 'rxjs';

export let browserRefresh = false;
@Component({
  selector: "auth-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnDestroy{
  subscription!: Subscription;
  title = "Authentication";

  constructor(private router: Router) {
    this.subscription = router.events.subscribe((event) => {
        if (event instanceof NavigationStart) {
          browserRefresh = !router.navigated;
        }
    });
  }
  
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
