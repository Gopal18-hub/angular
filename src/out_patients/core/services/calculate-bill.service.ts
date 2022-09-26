import { Injectable } from "@angular/core";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { BillingService } from "../../modules/billing/submodules/billing/billing.service";
import { HttpService } from "@shared/services/http.service";
import { CookieService } from "@shared/services/cookie.service";

@Injectable({
  providedIn: "root",
})
export class CalculateBillService {
  constructor(
    public matDialog: MatDialog,
    private http: HttpService,
    public cookie: CookieService,
    public billingService: BillingService,
    public messageDialogService: MessageDialogService
  ) {}
}
