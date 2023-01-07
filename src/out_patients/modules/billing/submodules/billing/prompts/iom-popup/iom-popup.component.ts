import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HttpService } from "@shared/services/http.service";
import { BillingApiConstants } from "../../BillingApiConstant";
import { CookieService } from "@shared/services/cookie.service";

//RTFJS.loggingEnabled(false);
//WMFJS.loggingEnabled(false);
//EMFJS.loggingEnabled(false);

@Component({
  selector: "out-patients-iom-popup",
  templateUrl: "./iom-popup.component.html",
  styleUrls: ["./iom-popup.component.scss"],
})
export class IomPopupComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<IomPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpService,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.http
      .get(
        BillingApiConstants.getopcompanyiomlocationwise(
          Number(this.cookieService.get("HSPLocationId")),
          this.data.company
        )
      )
      .subscribe((res: any) => {
        const doc = new (<any>window).RTFJS.Document(
          this.stringToArrayBuffer(res[0]),
          {}
        );
        const meta = doc.metadata();
        const htmlElements = doc.render();
        const div = document.createElement("div");
        div.append(...htmlElements);
        (<any>document.querySelector("#iom-content")).innerHTML = div.innerHTML;

        // doc
        //   .render()
        //   .then(function (htmlElements: any) {
        //     console.log("Meta:");
        //     console.log(meta);
        //     console.log("Html:");
        //     console.log(htmlElements);
        //     const div = document.createElement("div");
        //     div.append(...htmlElements);
        //     (<any>document.querySelector("#iom-content")).innerHTML =
        //       div.innerHTML;
        //     console.log(div);
        //   })
        //   .catch((error: any) => console.error(error));
      });
  }

  close() {
    this.dialogRef.close();
  }

  stringToArrayBuffer(string: string) {
    const buffer = new ArrayBuffer(string.length);
    const bufferView = new Uint8Array(buffer);
    for (let i = 0; i < string.length; i++) {
      bufferView[i] = string.charCodeAt(i);
    }
    return buffer;
  }
}
