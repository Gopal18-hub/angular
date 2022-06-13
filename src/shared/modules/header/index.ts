import { NgModule } from "@angular/core";
import { HeaderComponent } from "./header.component";
import { SubComponent } from "./sub/sub.component";
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

@NgModule({
  declarations: [HeaderComponent, SubComponent],
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
  ],
  exports: [HeaderComponent, SubComponent],
  providers: [],
  bootstrap: [],
})
export class HeaderModule {}
