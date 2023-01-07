import { NgModule } from "@angular/core";

import { SignupRoutingModule } from "./routes";
import { SignupComponent } from "./signup.component";

@NgModule({
  declarations: [SignupComponent],
  imports: [SignupRoutingModule],
  exports: [],
  providers: [],
  bootstrap: [],
})
export class SignupModule {}
