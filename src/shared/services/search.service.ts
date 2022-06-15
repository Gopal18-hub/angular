import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class SearchService {
  searchTrigger = new Subject<any>();

  searchFormData: any = {
    global: {
      title: "",
      type: "object",
      properties: {
        maxID: {
          type: "string",
          title: "Max ID",
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
        },
        adhaar: {
          type: "string",
          title: "Aadhaar",
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
        },
        ssn: {
          type: "string",
          title: "SSN",
        },
      },
    },
  };
}
