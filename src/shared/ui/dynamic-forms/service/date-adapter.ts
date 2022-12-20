import { NativeDateAdapter } from "@angular/material/core";
import * as moment from "moment";
import { Injectable } from "@angular/core";

@Injectable()
export class MaxDateAdapter extends NativeDateAdapter {
  override format(date: Date): string {
    return moment(date).format("DD/MM/YYYY");
  }

  override parse(value: any): Date | null {
    value = value.replace("\u2000", "");
    if (!moment(value, "DD/MM/YYYY", true).isValid()) {
      return this.invalid();
    }
    return moment(value, "DD/MM/YYYY", true).toDate();
  }
}
