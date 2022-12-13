import { NgxMatNativeDateAdapter } from "@angular-material-components/datetime-picker";
import * as moment from "moment";
import { Injectable } from "@angular/core";

@Injectable()
export class MaxDateTimeAdapter extends NgxMatNativeDateAdapter {
  override format(date: Date): string {
    return moment(date).format("DD/MM/YYYY HH:mm:ss");
  }

  override parse(value: any): Date | null {
    value = value.replace("\u2000", "");
    if (!moment(value, "DD/MM/YYYY HH:mm:ss", true).isValid()) {
      return this.invalid();
    }
    return moment(value, "DD/MM/YYYY HH:mm:ss", true).toDate();
  }

  // override sameDate(first: D | null, second: D | null): boolean {
  //   if (first && second) {
  //     let firstValid = this.isValid(first);
  //     let secondValid = this.isValid(second);
  //     if (firstValid && secondValid) {
  //       return !this.compareDate(first, second);
  //     }
  //     return firstValid == secondValid;
  //   }
  //   return first == second;
  // }
}
