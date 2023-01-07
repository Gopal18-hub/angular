import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { OpenIDRoutingModule } from "./routes";

import { AuthCallbackComponent } from "./auth-callback/auth-callback.component";
import { SilentRefreshComponent } from "./silent-refresh/silent-refresh.component";

@NgModule({
  declarations: [AuthCallbackComponent, SilentRefreshComponent],
  imports: [CommonModule, OpenIDRoutingModule],
  exports: [],
  providers: [],
  bootstrap: [],
})
export class OpenIDModule {}
