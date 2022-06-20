import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DynamicDefaultUiComponent } from './dynamic-default-ui.component';

@NgModule({
    imports: [
      CommonModule,      
    ],
    exports: [],
    declarations: [
    DynamicDefaultUiComponent
  ],
    providers: [],
  })
  export class DynamicDefaultuiModule {}