import { NgModule } from "@angular/core";
import { ReportsRoutingModule } from "./routes";
import { ReportsComponent } from "./reports.component";
import { MatTabsModule } from "@angular/material/tabs";
import { CommonModule } from "@angular/common";
import { MatInputModule } from "@angular/material/input";
import { MaxHealthTableModule } from "@shared/ui/table";
import { DynamicFormsModule } from "@shared/ui/dynamic-forms";
import { MatButtonModule } from "@angular/material/button";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CashScrollComponent } from "./cash-scroll/cash-scroll.component";
import { CashScrollModifyComponent } from './cash-scroll/submodules/cash-scroll-modify/cash-scroll-modify.component';
import { CashScrollNewComponent } from './cash-scroll/submodules/cash-scroll-new/cash-scroll-new.component';
@NgModule({
  declarations: [ReportsComponent,CashScrollComponent, CashScrollModifyComponent, CashScrollNewComponent,],
  imports: [CommonModule, ReportsRoutingModule, MatTabsModule,
    MatInputModule,MaxHealthTableModule,DynamicFormsModule,FormsModule,ReactiveFormsModule,MatButtonModule],
  exports: [],
  providers: [],
  bootstrap: [],
})
export class ReportsModule {}
