import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { CookieService } from "./cookie.service";
import { DatePipe } from "@angular/common";
@Injectable({
  providedIn: "root",
})
export class SearchService {
  constructor(private cookie: CookieService, private datepipe: DatePipe) {}
  searchTrigger = new Subject<any>();

  activePageTrigger = new Subject<any>();

  activePage: any;
  fromdate = this.datepipe.transform(
    new Date().setDate(new Date().getDate() - 1),
    "yyyy-MM-dd"
  );

  searchFormData: any = {
    global: {
      title: "",
      type: "object",
      resetFormOnSubmit: true,
      properties: {
        maxID: {
          type: "string",
          title: "Max ID",
          defaultValue: this.cookie.get("LocationIACode") + ".",
        },
        phone: {
          type: "string",
          title: "Mobile No",
        },
        name: {
          type: "string",
          title: "Name",
        },
        dob: {
          type: "date",
          title: "DOB",
          maximum: new Date(),
        },
        healthID: {
          type: "string",
          title: "Health ID",
          readonly: true,
        },
        adhaar: {
          type: "string",
          title: "Aadhaar",
          readonly: true,
        },
      },
    },
    merge: {
      dateFormat: "dd/MM/yyyy",
      title: "",
      type: "object",
      resetFormOnSubmit: true,
      properties: {
        name: {
          type: "string",
          title: "Name",
        },
        phone: {
          type: "string",
          title: "Phone",
        },
        dob: {
          type: "date",
          title: "DOB",
          maximum: new Date(),
        },
        email: {
          type: "string",
          title: "Email",
        },
      },
    },
    opapproval: {
      dateFormat: "dd/MM/yyyy",
      title: "",
      type: "object",
      resetFormOnSubmit: false,
      properties: {
        from: {
          type: "date",
          title: "From",
          defaultValue: this.fromdate,
        },
        to: {
          type: "date",
          title: "To",
          defaultValue: new Date(),
        },
      },
    },
    unmerge: {
      dateFormat: "dd/MM/yyyy",
      title: "",
      type: "object",
      resetFormOnSubmit: true,
      properties: {
        maxID: {
          type: "string",
          title: "Max ID",
          defaultValue: this.cookie.get("LocationIACode") + ".",
        },
        ssn: {
          type: "string",
          title: "SSN",
        },
      },
    },
    employeesponsor: {
      dateFormat: "dd/MM/yyyy",
      title: "",
      type: "object",
      resetFormOnSubmit: true,
      properties: {
        maxid: {
          type: "string",
          title: "Max ID",
          defaultValue: this.cookie.get("LocationIACode") + ".",
        },
        phone: {
          type: "string",
          title: "Phone",
        },
        name: {
          type: "string",
          title: "Name",
        },
        dob: {
          type: "date",
          title: "DOB",
        },
      },
    },
  };

  setActivePage(activePage: any) {
    this.activePage = activePage;
    this.activePageTrigger.next({ activePage: activePage });
  }
  getActivePage() {
    return this.activePage;
  }
}
