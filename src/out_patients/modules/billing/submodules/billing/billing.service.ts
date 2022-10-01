import { Injectable } from "@angular/core";
import { Subject, Observable } from "rxjs";
import { Registrationdetails } from "@core/types/registeredPatientDetial.Interface";
import { HttpService } from "@shared/services/http.service";
import { BillingApiConstants } from "./BillingApiConstant";
import { BillingStaticConstants } from "./BillingStaticConstant";
import { CookieService } from "@shared/services/cookie.service";
import { CalculateBillService } from "@core/services/calculate-bill.service";
import { IomCompanyBillingComponent } from "./prompts/iom-company-billing/iom-company-billing.component";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { DatePipe } from "@angular/common";

@Injectable({
  providedIn: "root",
})
export class BillingService {
  activeMaxId: any;
  billItems: any = [];
  consultationItems: any = [];
  InvestigationItems: any = [];
  HealthCheckupItems: any = [];
  ProcedureItems: any = [];
  OrderSetItems: any = [];
  ConsumableItems: any = [];
  patientDemographicdata: any = {};
  billItemsTrigger = new Subject<any>();
  configurationservice: [{ itemname: string; servicename: string }] = [] as any;

  clearAllItems = new Subject<boolean>();

  billNoGenerated = new Subject<boolean>();

  servicesTabStatus = new Subject<any>();

  totalCost = 0;

  company: number = 0;
  billtype: string = "cash";

  makeBillPayload: any = BillingStaticConstants.makeBillPayload;

  patientDetailsInfo: any = [];

  selectedHealthPlan: any;

  selectedOtherPlan: any;

  unbilledInvestigations: boolean = false;

  disableBillTabChange = new Subject<boolean>();

  disableBillTab: boolean = false;

  todayPatientBirthday: boolean = false;

  consultationItemsAdded = new Subject<boolean>();

  referralDoctor: any;

  companyChangeEvent = new Subject<any>();
  companyData: any = [];
  iomMessage: string = "";

  constructor(
    private http: HttpService,
    private cookie: CookieService,
    private calculateBillService: CalculateBillService,
    public matDialog: MatDialog,
    private datepipe: DatePipe
  ) {}

  calculateBill() {
    this.calculateBillService.initProcess(this.billItems, this);
  }

  changeBillTabStatus(status: boolean) {
    this.disableBillTab = status;
    this.disableBillTabChange.next(status);
  }

  getBillTabStatus() {
    return this.disableBillTab;
  }

  clear() {
    this.todayPatientBirthday = false;
    this.billItems = [];
    this.consultationItems = [];
    this.InvestigationItems = [];
    this.HealthCheckupItems = [];
    this.ProcedureItems = [];
    this.OrderSetItems = [];
    this.ConsumableItems = [];
    this.totalCost = 0;
    this.activeMaxId = null;
    this.company = 0;
    this.unbilledInvestigations = false;
    this.clearAllItems.next(true);
    this.billNoGenerated.next(false);
    this.servicesTabStatus.next({ clear: true });
    this.makeBillPayload = BillingStaticConstants.makeBillPayload;
  }

  calculateTotalAmount() {
    this.totalCost = 0;
    this.consultationItems.forEach((item: any) => {
      this.totalCost += item.price;
    });
    this.InvestigationItems.forEach((item: any) => {
      this.totalCost += item.price;
    });
    this.ProcedureItems.forEach((item: any) => {
      this.totalCost += item.price;
    });
    this.OrderSetItems.forEach((item: any) => {
      this.totalCost += item.price;
    });
    this.HealthCheckupItems.forEach((item: any) => {
      this.totalCost += item.price;
    });
    this.ConsumableItems.forEach((item: any) => {
      this.totalCost += item.totalAmount;
    });
    this.makeBillPayload.ds_insert_bill.tab_insertbill.billAmount =
      this.totalCost;
    this.makeBillPayload.ds_insert_bill.tab_insertbill.collectedAmount =
      this.totalCost;
    this.makeBillPayload.ds_paymode.tab_paymentList = [];
    this.makeBillPayload.ds_paymode.tab_paymentList.push({
      slNo: this.makeBillPayload.ds_paymode.tab_paymentList.length + 1,
      modeOfPayment: "Cash",
      amount: this.totalCost,
      flag: 1,
    });
    this.makeBillPayload.ds_insert_bill.tab_l_receiptList = [];
    this.makeBillPayload.ds_insert_bill.tab_l_receiptList.push({
      opbillid: 0,
      billNo: "",
      amount: this.totalCost,
      datetime: new Date(),
      operatorID: Number(this.cookie.get("UserId")),
      stationID: Number(this.cookie.get("StationId")),
      posted: false,
      hspLocationId: Number(this.cookie.get("HSPLocationId")),
      recNumber: "",
    });
  }

  setHealthPlan(data: any) {
    this.selectedHealthPlan = data;
  }

  setOtherPlan(data: any) {
    this.selectedOtherPlan = data;
  }

  checkServicesAdded() {
    if (
      this.consultationItems.length > 0 ||
      this.InvestigationItems.length > 0 ||
      this.ProcedureItems.length > 0 ||
      this.OrderSetItems.length > 0 ||
      this.ConsumableItems.length > 0 ||
      this.HealthCheckupItems.length > 0
    ) {
      return true;
    }
    return false;
  }

  checkOtherServicesForHealthCheckups() {
    if (
      this.consultationItems.length > 0 ||
      this.InvestigationItems.length > 0 ||
      this.ProcedureItems.length > 0 ||
      this.OrderSetItems.length > 0 ||
      this.ConsumableItems.length > 0
    ) {
      return true;
    }
    return false;
  }

  checkOtherServicesForConsumables() {
    if (
      this.consultationItems.length > 0 ||
      this.InvestigationItems.length > 0 ||
      this.ProcedureItems.length > 0 ||
      this.OrderSetItems.length > 0 ||
      this.HealthCheckupItems.length > 0
    ) {
      return true;
    }
    return false;
  }

  setCompnay(
    companyid: number,
    res: any,
    formGroup: any,
    from: string = "header"
  ) {
    this.company = companyid;
    this.companyChangeEvent.next({ company: res, from });
    this.makeBillPayload.ds_insert_bill.tab_insertbill.company = companyid;
    this.iomMessage =
      "IOM Validity till : " +
      (("iomValidity" in res.company && res.company.iomValidity != "") ||
      res.company.iomValidity != undefined
        ? this.datepipe.transform(res.company.iomValidity, "dd-MMM-yyyy")
        : "");
    if (res.company.isTPA == 1) {
      const iomcompanycorporate = this.matDialog.open(
        IomCompanyBillingComponent,
        {
          width: "25%",
          height: "28%",
        }
      );

      iomcompanycorporate.afterClosed().subscribe((result) => {
        if (result.data == "corporate") {
          formGroup.controls["corporate"].enable();
          formGroup.controls["corporate"].setValue(null);
        } else {
          formGroup.controls["corporate"].setValue(null);
          formGroup.controls["corporate"].disable();
        }
      });
    } else {
      formGroup.controls["corporate"].setValue(null);
      formGroup.controls["corporate"].disable();
    }
  }

  setCompanyData(data: any) {
    this.companyData = data;
  }

  setBilltype(billtype: string) {
    this.billtype = billtype;
  }

  getbilltype() {
    return this.billtype;
  }

  setActiveMaxId(
    maxId: string,
    iacode: string,
    regNumber: string,
    genderName: string = ""
  ) {
    this.activeMaxId = {
      maxId: maxId,
      iacode: iacode,
      regNumber: regNumber,
      gender: genderName,
    };
  }

  deleteFromService(billItem: any) {
    const consultationsExist = this.consultationItems.findIndex((item: any) => {
      return item.billItem.itemId == billItem.itemId;
    });
    if (consultationsExist > -1) {
      this.consultationItems.splice(consultationsExist, 1);
      return;
    }

    const investigationsExist = this.InvestigationItems.findIndex(
      (item: any) => {
        return item.billItem.itemId == billItem.itemId;
      }
    );
    if (investigationsExist > -1) {
      this.InvestigationItems.splice(investigationsExist, 1);
      return;
    }

    const proceduresExist = this.ProcedureItems.findIndex((item: any) => {
      return item.billItem.itemId == billItem.itemId;
    });
    if (proceduresExist > -1) {
      this.ProcedureItems.splice(proceduresExist, 1);
      return;
    }

    const ordersetExist = this.OrderSetItems.findIndex((item: any) => {
      return item.billItem.itemId == billItem.itemId;
    });
    if (ordersetExist > -1) {
      this.OrderSetItems.splice(ordersetExist, 1);
      return;
    }

    const helthcheckupExist = this.HealthCheckupItems.findIndex((item: any) => {
      return item.billItem.itemId == billItem.itemId;
    });
    if (helthcheckupExist > -1) {
      this.HealthCheckupItems.splice(helthcheckupExist, 1);
      return;
    }
  }

  addToBill(data: any) {
    this.billItems.push(data);
    this.billItemsTrigger.next({ data: this.billItems });
    this.makeBillPayload.ds_insert_bill.tab_d_opbillList.push({
      opBillId: 0,
      serviceId: data.serviceId,
      itemId: data.itemId,
      amount: data.totalAmount,
      discountamount: 0,
      serviceName: data.serviceName,
      itemName: data.itemName,
      cancelled: false,
      discountType: 0,
      refund: false,
      qty: data.qty.toString(),
      refundId: 0,
      posted: "",
      qtSlno: 1,
      orderID: 0,
      planAmount: 0,
      rfLocationID: 0,
      planDiscount: 0,
      isProfile: false,
      uploaded: 0,
      spItemid: 0,
      oldOPBillId: 0,
      oldorderId: 0,
      consultid: 0,
      discrtype_dr: 0,
      pharma: 1,
      specialisationID: data.specialisationID || 0,
      doctorID: data.doctorID || 0,
      isServiceTax: 0,
      itemcode: "",
      empowerApproverCode: "",
      couponCode: "",
    });
  }

  removeFromBill(data: any) {
    let exist = this.billItems.findIndex((item: any) => {
      return (item.itemId = data.billItem && data.billItem.itemId);
    });
    if (exist > -1) {
      this.billItems.splice(exist, 1);
      this.makeBillPayload.ds_insert_bill.tab_d_opbillList.splice(exist, 1);
    }
  }

  addToConsultation(data: any) {
    this.consultationItems.push(data);
    // this.configurationservice.push({
    //   itemname: data.billItem.itemName,
    //   servicename: "Consultation",
    // });
    if (data.billItem) {
      this.addToBill(data.billItem);
      this.makeBillPayload.ds_insert_bill.tab_o_opdoctorList.push({
        referDoctorId: 0,
        hspLocationId: Number(this.cookie.get("HSPLocationId")),
        opBillId: 0,
        orderNo: "",
      });
      this.makeBillPayload.ds_insert_bill.tab_d_opdoctorList.push({
        orderId: 0,
        doctorId: data.billItem.itemId,
        type: data.billItem.serviceId,
        visited: 0,
        scheduleSlot: "",
        scheduleId: 0,
        amount: data.billItem.price,
        specialisationId: data.specialization || 0,
        hcuId: 0,
        clinicId: data.clinics || 0,
      });
    }

    this.calculateTotalAmount();
  }

  addToInvestigations(data: any) {
    this.InvestigationItems.push(data);
    // this.configurationservice.push({
    //   itemname: data.billItem.itemName,
    //   servicename: data.billItem.serviceName,
    // });
    if (data.billItem) {
      this.addToBill(data.billItem);
      this.makeBillPayload.ds_insert_bill.tab_o_optestList.push({
        remarks: "",
        orderDatetime: new Date(),
        doctorId: data.billItem.doctorID || 0,
        priority: data.billItem.priority,
        reorder: false,
        transportationmode: 3,
        refDoctorID: 2015, //hardcoded for now
        startDateTime: new Date(),
        hspLocationID: Number(this.cookie.get("HSPLocationId")),
        registrationNo:
          this.makeBillPayload.ds_insert_bill.tab_insertbill.registrationNo,
        iaCode: this.makeBillPayload.ds_insert_bill.tab_insertbill.iaCode,
        sourceStId: Number(this.cookie.get("StationId")),
        operatorID: Number(this.cookie.get("UserId")),
        orderNo: "",
      });
      this.makeBillPayload.ds_insert_bill.tab_d_optestorderList.push({
        testId: data.billItem.itemId,
        sampleId: 0,
        profileId: 0,
        destId: 0,
        reorder: false,
        testStatus: 0,
        hcuId: 0,
        opbillid: 0,
        orderid: 0,
        opbillno: "",
        destHspLocationId: 0,
        qty: data.billItem.qty,
        investigationDocID: 0,
      });
    }
    this.calculateTotalAmount();
  }
  addToHealthCheckup(data: any) {
    this.HealthCheckupItems.push(data);
    this.configurationservice.push({
      itemname: data.healthCheckups,
      servicename: "Health Checkups",
    });
    if (data.billItem) {
      this.addToBill(data.billItem);
    }
    this.servicesTabStatus.next({ healthCheckup: true });

    this.calculateTotalAmount();
  }

  setHCUDetails(itemId: string, doctorsList: any) {
    this.makeBillPayload.hcudetails = itemId + ":" + doctorsList.join(":");
  }

  addToProcedure(data: any) {
    this.ProcedureItems.push(data);
    this.configurationservice.push({
      itemname: data.procedures,
      servicename: "Procedures",
    });
    if (data.billItem) {
      this.addToBill(data.billItem);

      this.makeBillPayload.ds_insert_bill.tab_o_procedureList.push({
        dateTime: new Date(),
        stationId: Number(this.cookie.get("StationId")),
        operatorId: Number(this.cookie.get("UserId")),
        iaCode: this.makeBillPayload.ds_insert_bill.tab_insertbill.iaCode,
        registrationNo:
          this.makeBillPayload.ds_insert_bill.tab_insertbill.registrationNo,
        hspLocationId: Number(this.cookie.get("HSPLocationId")),
        orderNo: "",
      }),
        this.makeBillPayload.ds_insert_bill.tab_d_procedureList.push({
          orderId: 0,
          procedureId: data.billItem.itemId,
          serviceid: data.billItem.serviceId,
          quantity: data.billItem.qty,
          doctorId: data.billItem.doctorID || 0,
          opBillid: 0,
          refDocId: 0,
        });
    }

    this.calculateTotalAmount();
  }
  addToOrderSet(data: any) {
    this.OrderSetItems.push(data);
    this.configurationservice.push({
      itemname: data.billItem.itemName,
      servicename: data.billItem.serviceName,
    });
    if (data.billItem) {
      this.addToBill(data.billItem);
    }

    this.calculateTotalAmount();
  }
  addToConsumables(data: any) {
    this.ConsumableItems.push(data);
    if (data.billItem) {
      this.addToBill(data.billItem);
    }
    this.servicesTabStatus.next({ consumables: true });
    this.calculateTotalAmount();
  }

  getconfigurationservice() {
    return this.configurationservice;
  }

  setPatientDetails(patientdetails: any) {
    this.makeBillPayload.ds_insert_bill.tab_insertbill = {
      registrationNo: patientdetails.registrationno,
      dateTime: new Date(),
      iaCode: patientdetails.iacode,
      title: patientdetails.title,
      firstName: patientdetails.firstname,
      middleName: patientdetails.middlename,
      lastName: patientdetails.lastname,
      age: patientdetails.age,
      agetype: patientdetails.agetype,
      sex: patientdetails.sex,
      mothersMaidenName: patientdetails.mothersMaidenName,
      fathersname: patientdetails.fathersname,
      isFatherHusband: patientdetails.isfatherHusband,
      maritalStatus: patientdetails.maritalstatus,
      billAmount: this.totalCost,
      depositAmount: 0,
      discountAmount: 0,
      refundAmount: 0,
      stationId: Number(this.cookie.get("StationId")),
      billType: 1,
      billNo: "",
      gradeId: 0,
      categoryId: 1,
      companyId: this.company,
      cancelled: false,
      operatorId: Number(this.cookie.get("UserId")),
      collectedAmount: this.totalCost,
      balance: 0,
      disAuthorised: "",
      disReason: "",
      canAuthorised: "",
      canReason: "",
      freeAuthorised: "",
      posted: false,
      settled: false,
      canPosted: 0,
      preDateTime: new Date(),
      cashierId: Number(this.cookie.get("UserId")),
      settledBy: 0,
      settledDateTime: new Date(),
      cancelledDateTime: new Date(),
      cancelledBy: 0,
      doctorId: 1912,
      doctortype: 0,
      moduleid: 0,
      planDiscount: 0,
      planAmount: 0,
      hspLocationId: Number(this.cookie.get("HSPLocationId")),
      canLocationId: 0,
      uploaded: 0,
      refDoctorId: 2015,
      bonusType: true,
      openBal: 0,
      ptsEarned: 0,
      ptsRedeemed: 0,
      closingBal: 0,
      planId: 0,
      membershipNo: "0",
      dateofBirth: patientdetails.dateOfBirth,
      cancelledAmount: 0,
      vip: patientdetails.vip,
      oldOPBillId: 0,
      discrtype_dr: 0,
      companyPaidAmt: 0,
      creditLimit: 0,
      companyDiscount: 0,
      patientDiscount: 0,
      emailId: patientdetails.peMail,
      mobileNo: patientdetails.pCellNo,
      emailWillSend: 0,
      onlineServiceType: 1,
      creditAllowReason: "",
      corporateid: 0,
      corporate: "",
      channel: 0,
      markupnot: "",
      bookingNo: "",
      note: 0,
      noteReason: "",
      couponNo: "",
      srfID: 0,
      donationAmount: 0,
      narrationOnBill: "",
      twiceConsultationReason: "",
      hostID: "GAVS-HIS-4",
      serviceTax: 0,
      authorisedid: 0,
      tpaId: 0,
      auth: 0,
      reasonId: 0,
      reason: "",
      remarks: "",
    };

    this.makeBillPayload.hspLocationId = Number(
      this.cookie.get("HSPLocationId")
    );
    this.makeBillPayload.stationId = Number(this.cookie.get("StationId"));
    this.makeBillPayload.userId = Number(this.cookie.get("UserId"));

    this.patientDetailsInfo = patientdetails;
  }
  getPatientDetails() {
    return this.patientDetailsInfo;
  }

  makeBill() {
    return this.http.post(
      BillingApiConstants.insert_billdetailsgst(),
      this.makeBillPayload
    );
  }

  async processInvestigationAdd(
    priorityId: number,
    serviceType: string,
    investigation: any
  ) {
    const res = await this.http
      .post(BillingApiConstants.getcalculateopbill, {
        compId: this.company,
        priority: priorityId,
        itemId: investigation.value,
        serviceId: serviceType || investigation.serviceid,
        locationId: this.cookie.get("HSPLocationId"),
        ipoptype: 1,
        bedType: 0,
        bundleId: 0,
      })
      .toPromise();
    if (res.length > 0) {
      this.addToInvestigations({
        sno: this.InvestigationItems.length + 1,
        investigations: investigation.title,
        precaution:
          investigation.precaution == "P"
            ? '<span class="max-health-red-color">P</span>'
            : investigation.precaution,
        priority: priorityId,
        priority_required: false,
        specialisation: "",
        doctorName: investigation.doctorid || "",
        specialisation_required: investigation.docRequired ? true : false,
        doctorName_required: investigation.docRequired ? true : false,
        price: res[0].returnOutPut,
        billItem: {
          popuptext: investigation.popuptext,
          itemId: investigation.value,
          priority: priorityId,
          serviceId: serviceType || investigation.serviceid,
          price: res[0].returnOutPut,
          serviceName: "Investigations",
          itemName: investigation.title,
          qty: 1,
          precaution:
            investigation.precaution == "P"
              ? '<span class="max-health-red-color">P</span>'
              : investigation.precaution,
          procedureDoctor: "",
          credit: 0,
          cash: 0,
          disc: 0,
          discAmount: 0,
          totalAmount: res[0].returnOutPut,
          gst: 0,
          gstValue: 0,
          specialisationID: 0,
          doctorID: 0,
          patient_Instructions: investigation.patient_Instructions,
        },
      });
    }
  }

  procesConsultationAddWithOutApi(
    priorityId: number,
    specialization: any,
    doctorName: any,
    clinics: any
  ) {
    this.addToConsultation({
      sno: this.ConsumableItems.length + 1,
      doctorName: doctorName.originalTitle,
      doctorId: doctorName.value,
      type: priorityId,
      scheduleSlot: "",
      bookingDate: "",
      price: doctorName.price,
      specialization: specialization,
      clinics: clinics ? clinics.value : 0,
      billItem: {
        itemId: doctorName.value,
        priority: priorityId,
        serviceId: 25,
        price: doctorName.price,
        serviceName: "Consultation Charges",
        itemName: doctorName.originalTitle,
        qty: 1,
        precaution: "",
        procedureDoctor: "",
        credit: 0,
        cash: 0,
        disc: 0,
        discAmount: 0,
        totalAmount: doctorName.price,
        gst: 0,
        gstValue: 0,
        specialisationID: doctorName.specialisationid,
        doctorID: doctorName.value,
      },
    });
    this.consultationItemsAdded.next(true);
  }

  async procesConsultationAdd(
    priorityId: number,
    specialization: any,
    doctorName: any,
    clinics: any
  ) {
    const res = await this.http
      .post(BillingApiConstants.getcalculateopbill, {
        compId: this.company,
        priority: priorityId,
        itemId: doctorName.value,
        serviceId: 25,
        locationId: this.cookie.get("HSPLocationId"),
        ipoptype: 1,
        bedType: 0,
        bundleId: 0,
      })
      .toPromise();
    if (res.length > 0) {
      this.addToConsultation({
        sno: this.ConsumableItems.length + 1,
        doctorName: doctorName.originalTitle,
        doctorId: doctorName.value,
        type: priorityId,
        scheduleSlot: "",
        bookingDate: "",
        price: res[0].returnOutPut,
        specialization: specialization,
        clinics: clinics ? clinics.value : 0,
        billItem: {
          itemId: doctorName.value,
          priority: priorityId,
          serviceId: 25,
          price: res[0].returnOutPut,
          serviceName: "Consultation Charges",
          itemName: doctorName.originalTitle,
          qty: 1,
          precaution: "",
          procedureDoctor: "",
          credit: 0,
          cash: 0,
          disc: 0,
          discAmount: 0,
          totalAmount: res[0].returnOutPut,
          gst: 0,
          gstValue: 0,
          specialisationID: doctorName.specialisationid,
          doctorID: doctorName.value,
        },
      });
      this.consultationItemsAdded.next(true);
    }
  }

  setReferralDoctor(doctor: any) {
    this.referralDoctor = doctor;
  }
}
