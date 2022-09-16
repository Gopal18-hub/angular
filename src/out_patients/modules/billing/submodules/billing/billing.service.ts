import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Registrationdetails } from "@core/types/registeredPatientDetial.Interface";
import { HttpService } from "@shared/services/http.service";
import { BillingApiConstants } from "./BillingApiConstant";
import { CookieService } from "@shared/services/cookie.service";

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
  billItemsTrigger = new Subject<any>();
  configurationservice: [{ itemname: string; servicename: string }] = [] as any;

  clearAllItems = new Subject<boolean>();

  billNoGenerated = new Subject<boolean>();

  servicesTabStatus = new Subject<any>();

  totalCost = 0;

  company: number = 0;
  billtype: string = "cash";

  makeBillPayload: any = {
    ds_insert_bill: {
      tab_insertbill: {},
      tab_d_opbillList: [],
      tab_o_opdoctorList: [],
      tab_d_opdoctorList: [],
      tab_o_optestList: [],
      tab_d_optestorderList: [],
      tab_o_procedureList: [],
      tab_d_procedureList: [],
      tab_d_packagebillList: [],
      tab_d_depositList: [],
      tab_getdepositList: [],
      tab_l_receiptList: [],
    },
    hcudetails: "",
    ds_paymode: {
      tab_paymentList: [],
      tab_cheque: [],
      tab_dd: [],
      tab_credit: [],
      tab_debit: [],
      tab_Mobile: [],
      tab_Online: [],
      tab_UPI: [],
    },
    doctor_sheduleid: 0,
    step_no: {
      id: 0,
      position: 0,
    },
    selectedservice: {
      id: 1,
      flag: true,
    },
    dtHappyFamilyPlanTableSend: {},
    dtHappyFamilyPlanTableDetailSend: {},
    tab_L_ReffralPHP: {},
    srvTaxPer: 0,
    totSerTaxAmt: 0,
    taxReason: "",
    taxProcedureID: 0,
    VisitNumber: "",
    orderType: "",
    dtCPRS: {},
    tab_o_opDiscount: {},
    tab_o_opItemBasePrice: {
      itemID: 0,
      serviceID: 0,
      price: 0,
      willModify: false,
    },
    cmbInteraction: 0,
    htParms: {},
    opBloodGroupFlag: 0,
    dtFinalGrpDoc: {},
    gst: 0,
    gstValue: 0,
    cgst: 0,
    cgstValue: 0,
    sgst: 0,
    sgstValue: 0,
    utgst: 0,
    utgstValue: 0,
    igst: 0,
    igstValue: 0,
    cess: 0,
    cessValue: 0,
    sacCode: "99931600001",
    taxRate1: 0,
    taxRate1Value: 0,
    taxRate2: 0,
    taxRate2Value: 0,
    taxRate3: 0,
    taxRate3Value: 0,
    taxRate4: 0,
    taxRate4Value: 0,
    taxRate5: 0,
    taxRate5Value: 0,
    totaltaX_RATE: 0,
    totaltaX_Value: 0,
    taxGrpId: 0,
    billToCompanyId: 0,
    invoiceType: "B2C",
    finalDSGSTDetails: {
      gst: 0,
      cgst: 0,
      cgstdesc: "",
      cgsT_Value: 0,
      sgst: 0,
      sgstdesc: "",
      sgsT_Value: 0,
      utgst: 0,
      utgstdesc: "",
      utgsT_Value: 0,
      igst: 0,
      igstdesc: "",
      igsT_Value: 0,
      cess: 0,
      cessdesc: "",
      cesS_Value: 0,
      taxratE1: 0,
      taxratE1DESC: "",
      taxratE1_Value: 0,
      taxratE2: 0,
      taxratE2DESC: "",
      taxratE2_Value: 0,
      taxratE3: 0,
      taxratE3DESC: "",
      taxratE3_Value: 0,
      taxratE4: 0,
      taxratE4DESC: "",
      taxratE4_Value: 0,
      taxratE5: 0,
      taxratE5DESC: "",
      taxratE5_Value: 0,
      totaltaX_RATE: 0,
      totaltaX_Value: 0,
      taxgrpid: 0,
      saccode: "",
      sid: 0,
      gsT_value: 0,
    },
    txtOtherGroupDoc: "",
    dtCheckedItem: {},
    cghsBeneficiaryChangeReason: "",
    hspLocationId: 0,
    userId: 0,
    stationId: 0,
  };

  patientDetailsInfo: any = [];

  constructor(private http: HttpService, private cookie: CookieService) {}

  clear() {
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
    this.clearAllItems.next(true);
    this.billNoGenerated.next(false);
    this.servicesTabStatus.next({ clear: true });
    this.makeBillPayload = {
      ds_insert_bill: {
        tab_insertbill: {}, //header information of entire bill
        tab_d_opbillList: [], // Services list
        tab_o_opdoctorList: [], // consultation header
        tab_d_opdoctorList: [], // consultation breakup
        tab_o_optestList: [], // Investigation header
        tab_d_optestorderList: [], // Investigation brakup
        tab_o_procedureList: [], // Procedure header
        tab_d_procedureList: [], // Procedura breakup
        tab_d_packagebillList: [], // Healthcheckup header
        tab_d_depositList: [], // deposite adjustment details
        tab_getdepositList: [], // demopiste actual amount (patient deposit amount)
        tab_l_receiptList: [], //
      },
      hcudetails: "",
      ds_paymode: {
        tab_paymentList: [],
        tab_cheque: [],
        tab_dd: [],
        tab_credit: [],
        tab_debit: [],
        tab_Mobile: [],
        tab_Online: [],
        tab_UPI: [],
      },
      doctor_sheduleid: 0,
      step_no: {
        id: 0,
        position: 0,
      },
      selectedservice: {
        id: 1,
        flag: true,
      },
      dtHappyFamilyPlanTableSend: {},
      dtHappyFamilyPlanTableDetailSend: {},
      tab_L_ReffralPHP: {},
      srvTaxPer: 0,
      totSerTaxAmt: 0,
      taxReason: "",
      taxProcedureID: 0,
      VisitNumber: "",
      orderType: "",
      dtCPRS: {},
      tab_o_opDiscount: {},
      tab_o_opItemBasePrice: {
        itemID: 0,
        serviceID: 0,
        price: 0,
        willModify: false,
      },
      cmbInteraction: 0,
      htParms: {},
      opBloodGroupFlag: 0,
      dtFinalGrpDoc: {},
      gst: 0,
      gstValue: 0,
      cgst: 0,
      cgstValue: 0,
      sgst: 0,
      sgstValue: 0,
      utgst: 0,
      utgstValue: 0,
      igst: 0,
      igstValue: 0,
      cess: 0,
      cessValue: 0,
      sacCode: "99931600001",
      taxRate1: 0,
      taxRate1Value: 0,
      taxRate2: 0,
      taxRate2Value: 0,
      taxRate3: 0,
      taxRate3Value: 0,
      taxRate4: 0,
      taxRate4Value: 0,
      taxRate5: 0,
      taxRate5Value: 0,
      totaltaX_RATE: 0,
      totaltaX_Value: 0,
      taxGrpId: 0,
      billToCompanyId: 0,
      invoiceType: "B2C",
      finalDSGSTDetails: {
        gst: 0,
        cgst: 0,
        cgstdesc: "",
        cgsT_Value: 0,
        sgst: 0,
        sgstdesc: "",
        sgsT_Value: 0,
        utgst: 0,
        utgstdesc: "",
        utgsT_Value: 0,
        igst: 0,
        igstdesc: "",
        igsT_Value: 0,
        cess: 0,
        cessdesc: "",
        cesS_Value: 0,
        taxratE1: 0,
        taxratE1DESC: "",
        taxratE1_Value: 0,
        taxratE2: 0,
        taxratE2DESC: "",
        taxratE2_Value: 0,
        taxratE3: 0,
        taxratE3DESC: "",
        taxratE3_Value: 0,
        taxratE4: 0,
        taxratE4DESC: "",
        taxratE4_Value: 0,
        taxratE5: 0,
        taxratE5DESC: "",
        taxratE5_Value: 0,
        totaltaX_RATE: 0,
        totaltaX_Value: 0,
        taxgrpid: 0,
        saccode: "",
        sid: 0,
        gsT_value: 0,
      },
      txtOtherGroupDoc: "",
      dtCheckedItem: {},
      cghsBeneficiaryChangeReason: "",
      hspLocationId: 0,
      userId: 0,
      stationId: 0,
    };
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

  setCompnay(companyid: number) {
    this.company = companyid;
    this.makeBillPayload.ds_insert_bill.tab_insertbill.company = companyid;
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
      return (item.itemId = data.billItem.itemId);
    });
    if (exist > -1) {
      this.billItems.splice(exist, 1);
    }
  }

  addToConsultation(data: any) {
    this.consultationItems.push(data);
    this.configurationservice.push({
      itemname: data.billItem.itemName,
      servicename: "Consultation",
    });
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
    this.configurationservice.push({
      itemname: data.billItem.itemName,
      servicename: data.billItem.serviceName,
    });
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
}
