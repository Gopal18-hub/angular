import { NgModule } from "@angular/core";
import { HeaderComponent } from "./header.component";
import { SubComponent, SubNestedComponent } from "./sub/sub.component";
import { ChangelocationComponent } from "./changelocation/changelocation.component";
import { CommonModule } from "@angular/common";
import { MatMenuModule } from "@angular/material/menu";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSelectModule } from "@angular/material/select";
import { MatFormFieldModule } from "@angular/material/form-field";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatDividerModule } from "@angular/material/divider";
import { DynamicFormsModule } from "@shared/v2/ui/dynamic-forms";
import { RedirectComponent } from "./redirect/redirect.component";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { OverlayModule } from "@angular/cdk/overlay";
import { ChangepaswordComponent } from "./changepasword/changepasword.component";
import { SelectimeiComponent } from "./selectIMEI/selectimei.component";
import { PaytmMachineComponent } from "./paytm-machine/paytm-machine.component";
import { MatListModule } from "@angular/material/list";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatBadgeModule } from "@angular/material/badge";

@NgModule({
  declarations: [
    HeaderComponent,
    SubComponent,
    RedirectComponent,
    ChangelocationComponent,
    ChangepaswordComponent,
    SelectimeiComponent,
    SubNestedComponent,
    PaytmMachineComponent,
  ],
  imports: [
    CommonModule,
    MatMenuModule,
    MatButtonModule,
    MatCheckboxModule,
    MatSelectModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    MatInputModule,
    MatIconModule,
    MatDividerModule,
    DynamicFormsModule,
    MatProgressSpinnerModule,
    OverlayModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    MatBadgeModule,
  ],
  exports: [HeaderComponent, SubComponent],
  providers: [],
  bootstrap: [],
})
export class HeaderModule {}
