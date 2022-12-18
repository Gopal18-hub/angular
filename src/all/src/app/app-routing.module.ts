import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  // {
  //   path: "auth",
  //   loadChildren: () =>
  //     import("../../../auth/src/app/app.module").then((m) => m.AppModule),
  // },
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
