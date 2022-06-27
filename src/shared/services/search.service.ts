import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { CookieService } from "./cookie.service";

@Injectable({
  providedIn: "root",
})
export class SearchService {
  constructor(private cookie: CookieService) { }
  searchTrigger = new Subject<any>();

  searchFormData: any = {
    global: {
      title: "",
      type: "object",
      properties: {
        maxID: {
          type: "string",
          title: "Max ID",
          defaultValue: this.cookie.get("LocationIACode") + '.',
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
        healthID: {
          type: "string",
          title: "Health ID",
          readonly:true,
        },
        adhaar: {
          type: "string",
          title: "Aadhaar",
          readonly:true,
        },
      },
    },
    merge: {
      dateFormat: "dd/MM/yyyy",
      title: "",
      type: "object",
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
      properties: {
        from: {
          type: "date",
          title: "From",
        },
        to: {
          type: "date",
          title: "To",
        },
      },
    },
    unmerge: {
      dateFormat: "dd/MM/yyyy",
      title: "",
      type: "object",
      properties: {
        maxID: {
          type: "string",
          title: "Max ID",
          defaultValue: this.cookie.get("LocationIACode") + '.',
        },
        ssn: {
          type: "string",
          title: "SSN",
        },
      },
    },
  };
}
