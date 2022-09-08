import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Registrationdetails } from "@core/types/registeredPatientDetial.Interface";

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

  totalCost = 0;

  company: number = 0;
  billtype: string = "cash";

  makeBillPayload = {
    ds_insert_bill: {
      tab_insertbill: {
        registrationNo: 123458,
        dateTime: "2022-06-14T12:08:31.275Z",
        iaCode: "SKDD",
        title: "Ms.",
        firstName: "DIVYA123",
        middleName: "MALIK",
        lastName: "RANJAN",
        age: 52,
        agetype: 1,
        sex: 2,
        mothersMaidenName: "",
        fathersname: "",
        isFatherHusband: true,
        maritalStatus: 2,
        billAmount: 6760.0,
        depositAmount: 0,
        discountAmount: 0,
        refundAmount: 0,
        stationId: 10475,
        billType: 1,
        billNo: "",
        gradeId: 0,
        categoryId: 1,
        companyId: 0,
        cancelled: false,
        operatorId: 9923,
        collectedAmount: 6760.0,
        balance: 0,
        disAuthorised: "",
        disReason: "",
        canAuthorised: "",
        canReason: "",
        freeAuthorised: "",
        posted: false,
        settled: false,
        canPosted: 0,
        preDateTime: "2022-06-14T12:08:31.275Z",
        cashierId: 9923,
        settledBy: 0,
        settledDateTime: "2022-06-14T12:08:31.275Z",
        cancelledDateTime: "2022-06-14T12:08:31.275Z",
        cancelledBy: 0,
        doctorId: 1912,
        doctortype: 0,
        moduleid: 0,
        planDiscount: 0,
        planAmount: 0,
        hspLocationId: 7,
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
        dateofBirth: "1970-01-13T12:08:31.275Z",
        cancelledAmount: 0,
        vip: false,
        oldOPBillId: 0,
        discrtype_dr: 0,
        companyPaidAmt: 0,
        creditLimit: 0,
        companyDiscount: 0,
        patientDiscount: 0,
        emailId: "DIVYAMRANJAN@YHOO.CO.IN",
        mobileNo: "9899408978",
        emailWillSend: 0,
        onlineServiceType: 7,
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
        narrationOnBill: "Testing",
        twiceConsultationReason: "",
        hostID: "GAVS-HIS-4",
        serviceTax: 0,
        authorisedid: 0,
        tpaId: 0,
        auth: 0,
        reasonId: 0,
        reason: "",
        remarks: "",
      },
      tab_d_opbillList: [
        {
          opBillId: 0,
          serviceId: 42,
          itemId: 38239,
          amount: 6760.0,
          discountamount: 0,
          serviceName: "Investigations",
          itemName: "3D CT of Chest",
          cancelled: false,
          discountType: 0,
          refund: false,
          qty: "1",
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
          specialisationID: 0,
          doctorID: 0,
          isServiceTax: 0,
          itemcode: "",
          empowerApproverCode: "",
          couponCode: "",
        },
      ],
      tab_o_opdoctorList: [],
      tab_d_opdoctorList: [
        {
          orderId: 0,
          doctorId: 0,
          type: 0,
          visited: 0,
          scheduleSlot: "",
          scheduleId: 0,
          amount: 0,
          specialisationId: 0,
          hcuId: 0,
          clinicId: 0,
        },
      ],
      tab_o_optestList: [
        {
          remarks: "test from API",
          orderDatetime: "2022-06-14T12:08:31.275Z",
          doctorId: 0,
          priority: 1,
          reorder: false,
          transportationmode: 3,
          refDoctorID: 2015,
          startDateTime: "2022-06-14T12:08:31.275Z",
          hspLocationID: 7,
          registrationNo: 123458,
          iaCode: "SKDD",
          sourceStId: 10475,
          operatorID: 9923,
          orderNo: "",
        },
      ],
      tab_d_optestorderList: [
        {
          testId: 38239,
          sampleId: 1,
          profileId: 0,
          destId: 10530,
          reorder: false,
          testStatus: 1,
          hcuId: 0,
          opbillid: 0,
          orderid: 0,
          opbillno: "",
          destHspLocationId: 7,
          qty: 1,
          investigationDocID: 0,
        },
      ],
      tab_o_procedureList: [
        {
          dateTime: "2022-06-14T12:08:31.275Z",
          stationId: 0,
          operatorId: 0,
          iaCode: "",
          registrationNo: 0,
          hspLocationId: 0,
          orderNo: "",
        },
      ],
      tab_d_procedureList: [
        {
          orderId: 0,
          procedureId: 0,
          serviceid: 0,
          quantity: 0,
          doctorId: 0,
          opBillid: 0,
          refDocId: 0,
        },
      ],
      tab_d_packagebillList: [
        {
          opBillId: 0,
          orderId: 0,
          serviceId: 0,
          serviceName: "",
          itemId: 0,
          itemName: "",
          testId: 0,
          testName: "",
          amount: 0,
          planAmount: 0,
          discountType: 0,
          discountAmount: 0,
          planDiscount: 0,
          refund: 0,
          isProfile: 0,
          itemServiceId: 0,
        },
      ],
      tab_d_depositList: [
        {
          cashtranid: 0,
          billid: 0,
          balance: 0,
          blockopid: 0,
          hsplocationId: 0,
        },
      ],
      tab_getdepositList: [
        {
          id: 0,
          amount: 0,
          balanceamount: 0,
          datetime: "2022-06-14T12:08:31.275Z",
        },
      ],
      tab_l_receiptList: [
        {
          opbillid: 0,
          billNo: "",
          amount: 6760.0,
          datetime: "2022-06-14T12:08:31.275Z",
          operatorID: 9923,
          stationID: 10475,
          posted: false,
          hspLocationId: 7,
          recNumber: "",
        },
      ],
    },
    hcudetails: "",
    ds_paymode: {
      tab_paymentList: [
        {
          slNo: 1,
          modeOfPayment: "Cash",
          amount: 6760.0,
          flag: 1,
        },
      ],
      tab_cheque: [
        {
          chequeNo: "string",
          chequeDate: "2022-06-14T12:08:31.275Z",
          bankName: "string",
          branchName: "string",
          city: "string",
          flag: 0,
        },
      ],
      tab_dd: [
        {
          ddNumber: "string",
          ddDate: "2022-06-14T12:08:31.275Z",
          bankName: "string",
          branchName: "string",
          flag: 0,
        },
      ],
      tab_credit: [
        {
          ccNumber: "string",
          cCvalidity: "2022-06-14T12:08:31.275Z",
          cardType: 0,
          approvalno: "string",
          cType: 0,
          flag: 0,
          approvalcode: "string",
          terminalID: "string",
          acquirer: "string",
          flagman: "string",
          cardholdername: "string",
          bankname: "string",
        },
      ],
      tab_debit: [
        {
          ccNumber: "string",
          cCvalidity: "2022-06-14T12:08:31.275Z",
          cardType: 0,
          approvalno: "string",
          cType: 0,
          flag: 0,
        },
      ],
      tab_Mobile: [
        {
          mobileNo: "string",
          mmid: "string",
          senderName: "string",
          bankName: "string",
          branchName: "string",
          beneficiaryMobile: "string",
          transactionRef: "string",
          flag: 0,
        },
      ],
      tab_Online: [
        {
          transactionId: "string",
          bookingId: "string",
          cardValidation: "string",
          flag: 0,
          onlineContact: "string",
        },
      ],
      tab_UPI: [
        {
          ccNumber_UPI: "string",
          cCvalidity_UPI: "2022-06-14T12:08:31.275Z",
          cardType_UPI: 0,
          approvalno_UPI: "string",
          cType_UPI: 0,
          flag: 0,
          approvalcode_UPI: "string",
          terminalID_UPI: "string",
          acquirer_UPI: "string",
          flagman_UPI: "string",
          cardholdername_UPI: "string",
          bankname_UPI: "string",
        },
      ],
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
      itemID: 38239,
      serviceID: 42,
      price: 6760.0,
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
      cgstdesc: "string",
      cgsT_Value: 0,
      sgst: 0,
      sgstdesc: "string",
      sgsT_Value: 0,
      utgst: 0,
      utgstdesc: "string",
      utgsT_Value: 0,
      igst: 0,
      igstdesc: "string",
      igsT_Value: 0,
      cess: 0,
      cessdesc: "string",
      cesS_Value: 0,
      taxratE1: 0,
      taxratE1DESC: "string",
      taxratE1_Value: 0,
      taxratE2: 0,
      taxratE2DESC: "string",
      taxratE2_Value: 0,
      taxratE3: 0,
      taxratE3DESC: "string",
      taxratE3_Value: 0,
      taxratE4: 0,
      taxratE4DESC: "string",
      taxratE4_Value: 0,
      taxratE5: 0,
      taxratE5DESC: "string",
      taxratE5_Value: 0,
      totaltaX_RATE: 0,
      totaltaX_Value: 0,
      taxgrpid: 0,
      saccode: "string",
      sid: 0,
      gsT_value: 0,
    },
    txtOtherGroupDoc: "",
    dtCheckedItem: {},
    cghsBeneficiaryChangeReason: "",
    hspLocationId: 7,
    userId: 9923,
    stationId: 10475,
  };

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

  setCompnay(companyid: number) {
    this.company = companyid;
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

  addToBill(data: any) {
    this.billItems.push(data);
    this.billItemsTrigger.next({ data: this.billItems });
  }

  removeFromBill(data: any) {}

  addToConsultation(data: any) {
    this.consultationItems.push(data);
    this.configurationservice.push({
      itemname: data.billItem.itemName,
      servicename: "Consultation",
    });
    this.calculateTotalAmount();
  }
  removeFromConsultation(index: number) {
    this.consultationItems.splice(index, 0);
    this.calculateTotalAmount();
  }
  addToInvestigations(data: any) {
    this.InvestigationItems.push(data);
    this.configurationservice.push({
      itemname: data.billItem.itemName,
      servicename: data.billItem.serviceName,
    });
    this.calculateTotalAmount();
  }
  removeFromInvestigations() {}
  addToHealthCheckup(data: any) {
    this.HealthCheckupItems.push(data);
    this.configurationservice.push({
      itemname: data.healthCheckups,
      servicename: "Health Checkups",
    });

    this.calculateTotalAmount();
  }
  removeFromHealthCheckup() {}
  addToProcedure(data: any) {
    this.ProcedureItems.push(data);
    this.configurationservice.push({
      itemname: data.procedures,
      servicename: "Procedures",
    });

    this.calculateTotalAmount();
  }
  removeFromProcedure() {}
  addToOrderSet(data: any) {
    this.OrderSetItems.push(data);
    this.configurationservice.push({
      itemname: data.billItem.itemName,
      servicename: data.billItem.serviceName,
    });

    this.calculateTotalAmount();
  }
  removeFromORderSet() {}
  addToConsumables() {}
  removeFromConsumables() {}

  getconfigurationservice() {
    return this.configurationservice;
  }

  patientDetailsInfo: any = [];
  setPatientDetails(patientdetails: Registrationdetails) {
    this.patientDetailsInfo =
      patientdetails.dsPersonalDetails.dtPersonalDetails1;
  }
  getPatientDetails() {
    return this.patientDetailsInfo[0];
  }
}
