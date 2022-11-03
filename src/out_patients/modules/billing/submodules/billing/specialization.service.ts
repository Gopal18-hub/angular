import { Injectable } from "@angular/core";
import { BillingService } from "./billing.service";
import { HttpService } from "@shared/services/http.service";
import { CookieService } from "@shared/services/cookie.service";
import { BillingApiConstants } from "./BillingApiConstant";

@Injectable({
  providedIn: "root",
})
export class SpecializationService {
  specializationData: any = [];

  specializationDocotorsList: any = {};

  allDoctorsList: any = [];

  constructor(private http: HttpService, private cookie: CookieService) {}

  getSpecialization() {
    this.http.get(BillingApiConstants.getspecialization).subscribe((res) => {
      this.specializationData = res.map((r: any) => {
        return { title: r.name, value: r.id };
      });
    });
  }

  async getdoctorlistonSpecialization(specializationId: number) {
    if (!specializationId) return;
    if (this.specializationDocotorsList[specializationId.toString()]) {
      return this.specializationDocotorsList[specializationId.toString()];
    } else {
      const res = await this.http
        .get(
          BillingApiConstants.getdoctorlistonSpecializationClinic(
            false,
            specializationId,
            Number(this.cookie.get("HSPLocationId"))
          )
        )
        .toPromise();
      let options = res.map((r: any) => {
        return { title: r.doctorName, value: r.doctorId };
      });
      this.specializationDocotorsList[specializationId.toString()] = options;
      return options;
    }
  }

  async getDoctorsListInfo(specializationId: number) {
    if (this.allDoctorsList.length == 0) {
      const res = await this.http
        .get(
          BillingApiConstants.getdoctorlistonSpecializationClinic(
            false,
            specializationId,
            Number(this.cookie.get("HSPLocationId"))
          )
        )
        .toPromise();
      this.allDoctorsList = res.map((r: any) => {
        return {
          title: r.doctorName,
          value: r.doctorId,
          originalTitle: r.doctorName,
          specialisationid: r.specialisationid,
          clinicId: r.clinicID,
        };
      });
      return this.allDoctorsList;
    } else {
      return this.allDoctorsList;
    }
  }
}
