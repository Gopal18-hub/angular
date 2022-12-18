import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    loadChildren: () =>
      import("../../../auth/src/app/app.module").then((m) => m.AuthModule),
  },
  {
    path: "out-patients",
    loadChildren: () =>
      import("../../../out_patients/src/app/app.module").then(
        (m) => m.OutPatientModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {}
