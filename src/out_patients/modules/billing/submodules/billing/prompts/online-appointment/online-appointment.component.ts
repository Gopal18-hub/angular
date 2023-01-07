import { Component, OnInit, Inject, ViewChild } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "out-patients-online-appointment",
  templateUrl: "./online-appointment.component.html",
  styleUrls: ["./online-appointment.component.scss"],
})
export class OnlineAppointmentComponent implements OnInit {
  @ViewChild("table") tableRows: any;
  itemsData: any = [];
  config: any = {
    clickedRows: false,
    actionItems: false,
    dateformat: "dd/MM/yyyy",
    selectBox: true,
    displayedColumns: [
      "doctorname",
      "bookingNo",
      "transactionNo",
      "appointmentDate",
      "paymentStatus",
      "amount",
      "mobileno",
      "specialisationName",
    ],
    columnsInfo: {
      doctorname: {
        title: "Doctor Name",
        type: "string",
        style: {
          width: "15%",
        },
      },
      bookingNo: {
        title: "Booking No",
        type: "string",
      },
      transactionNo: {
        title: "Transaction No.",
        type: "string",
      },
      appointmentDate: {
        title: "Appointment Time",
        type: "date",
      },
      paymentStatus: {
        title: "Paid",
        type: "string",
        style: {
          width: "80px",
        },
      },
      amount: {
        title: "Amount",
        type: "string",
      },
      mobileno: {
        title: "Mobile No",
        type: "tel",
      },
      specialisationName: {
        title: "Specialisation",
        type: "string",
      },
    },
  };

  constructor(
    public dialogRef: MatDialogRef<OnlineAppointmentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.itemsData = this.data.items;
  }

  ngAfterViewInit(): void {
    if(this.itemsData.length == 1)
    {
      this.tableRows.selection.select(this.itemsData[0]);
    }
  }
  close() {
    this.dialogRef.close({ selected: this.tableRows.selection.selected });
  }
}
