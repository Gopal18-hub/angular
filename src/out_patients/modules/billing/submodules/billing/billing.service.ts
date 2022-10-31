import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { HttpService } from "@shared/services/http.service";
import { BillingApiConstants } from "./BillingApiConstant";
import { BillingStaticConstants } from "./BillingStaticConstant";
import { CookieService } from "@shared/services/cookie.service";
import { CalculateBillService } from "@core/services/calculate-bill.service";
import { IomCompanyBillingComponent } from "./prompts/iom-company-billing/iom-company-billing.component";
import { MatDialog } from "@angular/material/dialog";
import { DatePipe } from "@angular/common";
import { MessageDialogService } from "@shared/ui/message-dialog/message-dialog.service";
import { ReasonForDueBillComponent } from "./prompts/reason-for-due-bill/reason-for-due-bill.component";
import { PaymentMethods } from "@core/constants/PaymentMethods";
import { threadId } from "worker_threads";
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
  CouponServices: any = [];
  patientDemographicdata: any = {};
  billItemsTrigger = new Subject<any>();
  configurationservice: [{ itemname: string; servicename: string }] = [] as any;

  clearAllItems = new Subject<boolean>();

  billNoGenerated = new Subject<boolean>();

  servicesTabStatus = new Subject<any>();

  totalCost = 0;

  totalCostWithOutGst = 0;

  company: number = 0;
  billtype: number = 1;
  // //GAV-530 Paid Online appointment
  PaidAppointments: any = {};

  makeBillPayload: any = JSON.parse(
    JSON.stringify(BillingStaticConstants.makeBillPayload)
  );

  patientDetailsInfo: any = [];

  selectedHealthPlan: any = null;

  selectedOtherPlan: any = null;

  unbilledInvestigations: boolean = false;

  disableBillTabChange = new Subject<boolean>();

  disableBillTab: boolean = false;

  todayPatientBirthday: boolean = false;

  consultationItemsAdded = new Subject<boolean>();

  referralDoctor: any;
  twiceConsultationReason: any = "";

  companyChangeEvent = new Subject<any>();
  corporateChangeEvent = new Subject<any>();

  companyData: any = [];
  corporateData: any = [];
  selectedcompanydetails: any = {};
  selectedcorporatedetails: any = [];
  iomMessage: string = "";
  activeLink = new Subject<any>();
  disableServiceTab: boolean = false;
  disablecorporatedropdown: boolean = false;
  creditLimit: number = 0;

  maxIdEventFinished = new Subject<any>();

  refreshBillTab = new Subject<any>();

  billingFormGroup: any = { form: "", questions: [] };
  dtCheckedItem: any = [];
  txtOtherGroupDoc: any = "";
  dtFinalGrpDoc: any = {};
  constructor(
    private http: HttpService,
    private cookie: CookieService,
    private calculateBillService: CalculateBillService,
    public matDialog: MatDialog,
    private datepipe: DatePipe,
    private messageDialogService: MessageDialogService
  ) {}

  setBillingFormGroup(formgroup: any, questions: any) {
    this.billingFormGroup.form = formgroup;
    this.billingFormGroup.questions = questions;
  }

  calculateBill(formGroup: any, question: any) {
    this.calculateBillService.initProcess(
      this.billItems,
      this,
      formGroup,
      question
    );
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
    this.totalCostWithOutGst = 0;
    this.activeMaxId = null;
    this.PaidAppointments = null;
    this.company = 0;
    this.unbilledInvestigations = false;
    this.billingFormGroup = { form: "", questions: [] };
    this.referralDoctor = null;
    this.iomMessage = "";
    this.clearAllItems.next(true);
    this.billNoGenerated.next(false);
    this.servicesTabStatus.next({ clear: true });
    this.calculateBillService.clear();
    this.makeBillPayload = JSON.parse(
      JSON.stringify(BillingStaticConstants.makeBillPayload)
    );
    this.companyData = [];
    this.corporateData = [];
    this.selectedcompanydetails = {};
    this.selectedcorporatedetails = [];
    this.selectedHealthPlan = null;
    this.selectedOtherPlan = null;
  }

  calculateTotalAmount() {
    this.totalCost = 0;
    this.totalCostWithOutGst = 0;
    this.billItems.forEach((item: any) => {
      this.totalCost += item.totalAmount;
      this.totalCostWithOutGst += item.price * item.qty;
    });
    this.makeBillPayload.ds_insert_bill.tab_insertbill.billAmount =
      this.totalCost;
  }

  setHealthPlan(data: any) {
    this.http
      .get(
        BillingApiConstants.getselectedhappyfamilyplandetail(
          this.activeMaxId.iacode,
          this.activeMaxId.regNumber,
          data.planId,
          this.cookie.get("HSPLocationId")
        )
      )
      .subscribe((res: any) => {
        this.selectedHealthPlan = res;
      });
  }

  setOtherPlan(data: any) {
    this.selectedOtherPlan = data;
    this.servicesTabStatus.next({ disableAll: true });
  }

  // //GAV-530 Paid Online appointment
  setPaidAppointments(data: any) {
    this.PaidAppointments = data;
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

  updateServiceItemPrice(billItem: any) {
    const consultationsExist = this.consultationItems.findIndex((item: any) => {
      return item.billItem.itemId == billItem.itemId;
    });
    if (consultationsExist > -1) {
      this.consultationItems[consultationsExist].price = billItem.price;
      return;
    }

    const investigationsExist = this.InvestigationItems.findIndex(
      (item: any) => {
        return item.billItem.itemId == billItem.itemId;
      }
    );
    if (investigationsExist > -1) {
      this.InvestigationItems[investigationsExist].price = billItem.price;
      return;
    }

    const proceduresExist = this.ProcedureItems.findIndex((item: any) => {
      return item.billItem.itemId == billItem.itemId;
    });
    if (proceduresExist > -1) {
      this.ProcedureItems[proceduresExist].price = billItem.price;
      return;
    }

    const ordersetExist = this.OrderSetItems.findIndex((item: any) => {
      return item.billItem.itemId == billItem.itemId;
    });
    if (ordersetExist > -1) {
      this.OrderSetItems[ordersetExist].price = billItem.price;
      return;
    }

    const helthcheckupExist = this.HealthCheckupItems.findIndex((item: any) => {
      return item.billItem.itemId == billItem.itemId;
    });
    if (helthcheckupExist > -1) {
      this.HealthCheckupItems[helthcheckupExist].price = billItem.price;
      return;
    }
  }

  refreshPrice() {
    let subItems: any = [];
    this.billItems.forEach((item: any, index: number) => {
      subItems.push({
        serviceID: item.serviceId,
        itemId: item.itemId,
        bundleId: 0,
        priority: item.priority,
      });
    });
    this.http
      .post(
        BillingApiConstants.getPriceBulk(
          this.cookie.get("HSPLocationId"),
          this.company
        ),
        subItems
      )
      .subscribe((res: any) => {
        res.forEach((resItem: any, index: number) => {
          this.billItems[index].price = resItem.returnOutPut;
          this.billItems[index].totalAmount =
            this.billItems[index].qty * resItem.returnOutPut;
          this.updateServiceItemPrice(this.billItems[index]);
        });
        this.calculateTotalAmount();
        this.refreshBillTab.next(true);
      });
  }

  setCreditLimit(data: any) {
    this.creditLimit = data;
  }
  setCompnay(
    companyid: number,
    res: any,
    formGroup: any,
    from: string = "header"
  ) {
    this.company = companyid > 0 ? companyid : 0;
    if (this.billItems.length > 0) {
      this.refreshPrice();
      this.calculateBillService.setCompanyNonCreditItems([]);
      if (
        this.calculateBillService.billFormGroup &&
        this.calculateBillService.billFormGroup.form
      )
        this.calculateBillService.billFormGroup.form.controls[
          "credLimit"
        ].setValue("0.00");
    }
    if (res === "" || res == null) {
      this.companyChangeEvent.next({ company: null, from });
      this.selectedcorporatedetails = [];
      this.selectedcompanydetails = [];
      this.iomMessage = "";
    } else if (res.title) {
      let iscompanyprocess = true;
      //fix for Staff company validation
      if (res.company.isStaffcompany) {
        if (this.patientDetailsInfo.companyid > 0) {
          if (res.value != this.patientDetailsInfo.companyid) {
            iscompanyprocess = false;
            this.resetCompany(res, formGroup, from);
          }
        } else {
          iscompanyprocess = false;
          this.resetCompany(res, formGroup, from);
        }
      }

      if (iscompanyprocess) {
        this.selectedcompanydetails = res;
        this.selectedcorporatedetails = [];
        this.companyChangeEvent.next({ company: res, from });
        this.makeBillPayload.ds_insert_bill.tab_insertbill.companyId =
          companyid;
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

          iomcompanycorporate.afterClosed().subscribe((result: any) => {
            if (result.data == "corporate") {
              formGroup.controls["corporate"].enable();
              formGroup.controls["corporate"].setValue(null);
              this.corporateChangeEvent.next({ corporate: null, from });
              this.disablecorporatedropdown = true;
            } else {
              formGroup.controls["corporate"].setValue(null);
              formGroup.controls["corporate"].disable();
              this.corporateChangeEvent.next({
                corporate: null,
                from: "disable",
              });
            }
          });
        } else {
          this.corporateChangeEvent.next({ corporate: null, from: "disable" });
          formGroup.controls["corporate"].setValue(null);
          formGroup.controls["corporate"].disable();
        }
      }
    }
  }

  //fix for Staff company validation
  async resetCompany(res: any, formGroup: any, from: string = "header") {
    // formGroup.controls["corporate"].setValue(null);
    // this.corporateChangeEvent.next({ corporate: null, from });
    // formGroup.controls["company"].setValue(null);
    // this.corporateChangeEvent.next({ company: null, from });
    const ERNanavatiCompany = await this.messageDialogService.info(
      "Selected Patient is not entitled for " +
        res.title +
        " company.Please Contact HR Dept."
    );
    ERNanavatiCompany.afterClosed().toPromise();
    formGroup.controls["company"].setValue(null);
  }

  setCorporate(
    corporateid: number,
    res: any,
    formGroup: any,
    from: string = "header"
  ) {
    if (res === "" || res == null) {
      this.corporateChangeEvent.next({ corporate: null, from });
      this.selectedcorporatedetails = [];
      this.makeBillPayload.ds_insert_bill.tab_insertbill.corporateid = 0;
    } else {
      this.selectedcorporatedetails = res;
      this.corporateChangeEvent.next({ corporate: res, from });
      if (corporateid) {
        this.makeBillPayload.ds_insert_bill.tab_insertbill.corporateid =
          corporateid;
        this.makeBillPayload.ds_insert_bill.tab_insertbill.corporate =
          res.title;
      } else {
        this.makeBillPayload.ds_insert_bill.tab_insertbill.corporateid = 0;
        this.makeBillPayload.ds_insert_bill.tab_insertbill.corporate = "";
      }
    }
  }

  setCompanyData(data: any) {
    this.companyData = data;
    this.companyChangeEvent.next({ company: null, from: "header" });
  }

  setCorporateData(data: any) {
    this.corporateData = data;
  }

  setBilltype(billtype: number) {
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
  setActiveLink(value: boolean) {
    //  this.disableServiceTab=value;
    this.activeLink.next(value);
  }

  deleteFromService(billItem: any) {
    const consultationsExist = this.consultationItems.findIndex((item: any) => {
      return item.billItem.itemId == billItem.itemId;
    });
    if (consultationsExist > -1) {
      this.consultationItems.splice(consultationsExist, 1);
      this.makeBillPayload.ds_insert_bill.tab_o_opdoctorList.splice(
        consultationsExist,
        1
      );
      this.makeBillPayload.ds_insert_bill.tab_d_opdoctorList.splice(
        consultationsExist,
        1
      );
      return;
    }

    const investigationsExist = this.InvestigationItems.findIndex(
      (item: any) => {
        return item.billItem.itemId == billItem.itemId;
      }
    );
    if (investigationsExist > -1) {
      this.InvestigationItems.splice(investigationsExist, 1);
      this.makeBillPayload.ds_insert_bill.tab_o_optestList.splice(
        investigationsExist,
        1
      );
      this.makeBillPayload.ds_insert_bill.tab_d_optestorderList.splice(
        investigationsExist,
        1
      );
      return;
    }

    const proceduresExist = this.ProcedureItems.findIndex((item: any) => {
      return item.billItem.itemId == billItem.itemId;
    });
    if (proceduresExist > -1) {
      this.ProcedureItems.splice(proceduresExist, 1);
      this.makeBillPayload.ds_insert_bill.tab_o_procedureList.splice(
        proceduresExist,
        1
      );
      this.makeBillPayload.ds_insert_bill.tab_d_procedureList.splice(
        proceduresExist,
        1
      );
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
      this.makeBillPayload.ds_insert_bill.tab_d_packagebillList.splice(
        helthcheckupExist,
        1
      );
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
      pharma: data.priority || 0,
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
      return item.itemId == (data.billItem && data.billItem.itemId);
    });
    if (exist > -1) {
      this.billItems.splice(exist, 1);
      this.makeBillPayload.ds_insert_bill.tab_d_opbillList.splice(exist, 1);
    }
  }

  applyHealthPlandiscount(data: any) {
    if (this.selectedHealthPlan) {
      const findService = this.selectedHealthPlan.odtHealthDiscount.find(
        (serItem: any) => serItem.serviceid == data.billItem.serviceId
      );
      if (findService) {
        const discount = (data.price * findService.discount) / 100;
        data.billItem.gstValue =
          data.billItem.gst > 0 ? (data.price * data.billItem.gst) / 100 : 0;
        data.billItem.totalAmount =
          data.price - discount + data.billItem.gstValue;
        data.billItem.discAmount = discount;
      }
    }
    return data;
  }

  addToConsultation(data: any) {
    data = this.applyHealthPlandiscount(data);
    this.consultationItems.push(data);
    if (data.billItem) {
      this.addToBill(data.billItem);
      this.makeBillPayload.selectedservice.push({
        id: 0,
        flag: true,
      });
      this.makeBillPayload.ds_insert_bill.tab_o_opdoctorList.push({
        referDoctorId: 0,
        hspLocationId: Number(this.cookie.get("HSPLocationId")),
        opBillId: 0,
        orderNo: "",
      });
      this.makeBillPayload.ds_insert_bill.tab_d_opdoctorList.push({
        orderId: 0,
        doctorId: data.billItem.itemId,
        type: data.billItem.priority,
        visited: 0,
        scheduleSlot: "",
        scheduleId: 0,
        amount: data.billItem.price,
        specialisationId: data.specialization || 0,
        hcuId: 0,
        clinicId: data.clinics || 0,
        //ConsultationTypeId: data.billItem.priorityId,
      });
      this.makeBillPayload.dtFinalGrpDoc = this.dtFinalGrpDoc;
      this.makeBillPayload.dtCheckedItem = this.dtCheckedItem;
      this.makeBillPayload.txtOtherGroupDoc = this.txtOtherGroupDoc;
    }
    console.log(this.makeBillPayload);
    this.calculateTotalAmount();
  }

  addToInvestigations(data: any) {
    data = this.applyHealthPlandiscount(data);
    this.InvestigationItems.push(data);
    if (data.billItem) {
      this.addToBill(data.billItem);
      this.makeBillPayload.selectedservice.push({
        id: 1,
        flag: true,
      });
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
    data = this.applyHealthPlandiscount(data);
    this.HealthCheckupItems.push(data);
    this.configurationservice.push({
      itemname: data.healthCheckups,
      servicename: "Health Checkups",
    });
    if (data.billItem) {
      this.addToBill(data.billItem);
    }
    this.makeBillPayload.ds_insert_bill.tab_d_packagebillList.push({
      opBillId: 0,
      orderId: 0,
      serviceId: data.serviceid,
      serviceName: data.billItem.serviceName,
      itemId: data.billItem.itemId,
      itemName: data.billItem.itemName,
      testId: 0,
      testName: "",
      amount: data.billItem.totalAmount,
      planAmount: 0,
      discountType: 0,
      discountAmount: 0,
      planDiscount: 0,
      refund: 0,
      isProfile: 0,
      itemServiceId: 0,
    });
    this.servicesTabStatus.next({ healthCheckup: true });

    this.calculateTotalAmount();
  }

  setHCUDetails(itemId: string, doctorsList: any) {
    this.makeBillPayload.hcudetails = itemId + ":" + doctorsList.join(":");
  }

  addToProcedure(data: any) {
    data = this.applyHealthPlandiscount(data);
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
      });
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
    data = this.applyHealthPlandiscount(data);
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
      twiceConsultationReason: this.twiceConsultationReason,
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

  async makeBill(paymentmethod: any = {}) {
    if ("tabs" in paymentmethod) {
      let toBePaid =
        parseFloat(
          this.makeBillPayload.ds_insert_bill.tab_insertbill.billAmount
        ) -
        (parseFloat(
          this.makeBillPayload.ds_insert_bill.tab_insertbill.depositAmount
        ) +
          parseFloat(
            this.makeBillPayload.ds_insert_bill.tab_insertbill.discountAmount
          ) +
          parseFloat(
            this.calculateBillService.billFormGroup.form.value.amtPayByComp
          ));
      let collectedAmount = paymentmethod.tabPrices.reduce(
        (partialSum: number, a: number) => partialSum + a,
        0
      );
      this.makeBillPayload.ds_insert_bill.tab_insertbill.collectedAmount =
        parseFloat(collectedAmount);
      this.makeBillPayload.ds_insert_bill.tab_insertbill.balance =
        toBePaid - collectedAmount;
      this.makeBillPayload.ds_paymode.tab_paymentList = [];
      paymentmethod.tabs.forEach((payment: any) => {
        if (paymentmethod.paymentForm[payment.key].value.price > 0) {
          this.makeBillPayload.ds_paymode.tab_paymentList.push({
            slNo: this.makeBillPayload.ds_paymode.tab_paymentList.length + 1,
            modeOfPayment:
              paymentmethod.paymentForm[payment.key].value.modeOfPayment,
            amount: parseFloat(
              paymentmethod.paymentForm[payment.key].value.price
            ),
            flag: 1,
          });
          if ("payloadKey" in payment.method) {
            this.makeBillPayload.ds_paymode[payment.method.payloadKey] = [
              PaymentMethods[
                payment.method.payloadKey as keyof typeof PaymentMethods
              ](paymentmethod.paymentForm[payment.key].value),
            ];
          }
        }
      });
      this.makeBillPayload.ds_insert_bill.tab_insertbill.twiceConsultationReason =
        this.twiceConsultationReason;
      this.makeBillPayload.ds_insert_bill.tab_l_receiptList = [];
      this.makeBillPayload.ds_insert_bill.tab_l_receiptList.push({
        opbillid: 0,
        billNo: "",
        amount: parseFloat(collectedAmount),
        datetime: new Date(),
        operatorID: Number(this.cookie.get("UserId")),
        stationID: Number(this.cookie.get("StationId")),
        posted: false,
        hspLocationId: Number(this.cookie.get("HSPLocationId")),
        recNumber: "",
      });

      if (
        this.calculateBillService.discountSelectedItems.length > 0 &&
        parseFloat(
          this.makeBillPayload.ds_insert_bill.tab_insertbill.discountAmount
        ) > 0
      ) {
        this.makeBillPayload.ds_insert_bill.tab_insertbill.disAuthorised =
          this.calculateBillService.discountForm.value.authorise.title;
        this.makeBillPayload.ds_insert_bill.tab_insertbill.authorisedid =
          this.calculateBillService.discountForm.value.authorise.value;
      }

      if (toBePaid > collectedAmount) {
        const lessAmountWarningDialog = this.messageDialogService.confirm(
          "",
          "Do You Want To Save Less Amount ?"
        );
        const lessAmountWarningResult = await lessAmountWarningDialog
          .afterClosed()
          .toPromise();
        if (lessAmountWarningResult) {
          if (lessAmountWarningResult.type == "yes") {
            const reasonInfoDialog = this.matDialog.open(
              ReasonForDueBillComponent,
              {
                width: "40vw",
                height: "50vh",
              }
            );
            const reasonInfoResult = await reasonInfoDialog
              .afterClosed()
              .toPromise();
            if (reasonInfoResult) {
              console.log(reasonInfoResult);
              if (reasonInfoResult.data) {
                this.makeBillPayload.ds_insert_bill.tab_insertbill.auth =
                  reasonInfoResult.data.authorisedby;
                this.makeBillPayload.ds_insert_bill.tab_insertbill.reasonId =
                  reasonInfoResult.data.reason;
                this.makeBillPayload.ds_insert_bill.tab_insertbill.reason =
                  reasonInfoResult.reason;
                this.makeBillPayload.ds_insert_bill.tab_insertbill.remarks =
                  reasonInfoResult.data.remarks;
                this.makeBillPayload.ds_insert_bill.tab_insertbill.balance =
                  toBePaid - collectedAmount;
              }
            } else {
              return;
            }
          } else {
            return;
          }
        } else {
          return;
        }
      }
    }
    this.calculateBillService.blockActions.next(true);
    return this.http
      .post(BillingApiConstants.insert_billdetailsgst(), this.makeBillPayload)
      .toPromise();
  }

  async processProcedureAdd(
    priorityId: number,
    serviceType: string,
    procedure: any
  ) {
    const res = await this.http
      .post(BillingApiConstants.getcalculateopbill, {
        compId: this.company,
        priority: priorityId,
        itemId: procedure.value,
        serviceId: procedure.serviceid,
        locationId: this.cookie.get("HSPLocationId"),
        ipoptype: 1,
        bedType: 0,
        bundleId: 0,
      })
      .toPromise();
    if (res.length > 0) {
      this.addToProcedure({
        sno: this.ProcedureItems.length + 1,
        procedures: procedure.originalTitle,
        qty: 1,
        specialisation: "",
        doctorName: "",
        doctorName_required: procedure.docRequired ? true : false,
        specialisation_required: procedure.docRequired ? true : false,
        price: res[0].returnOutPut,
        unitPrice: res[0].returnOutPut,
        itemid: procedure.value,
        priorityId: priorityId,
        serviceId: procedure.serviceid,
        billItem: {
          popuptext: procedure.popuptext,
          itemId: procedure.value,
          priority: priorityId,
          serviceId: procedure.serviceid,
          price: res[0].returnOutPut,
          serviceName: "Procedure & Others",
          itemName: procedure.originalTitle,
          qty: 1,
          precaution: "",
          procedureDoctor: "",
          credit: 0,
          cash: 0,
          disc: 0,
          discAmount: 0,
          totalAmount: res[0].returnOutPut + res[0].totaltaX_Value,
          gst: res[0].totaltaX_RATE,
          gstValue: res[0].totaltaX_Value,
          specialisationID: 0,
          doctorID: 0,
        },
        gstDetail: {
          gsT_value: res[0].totaltaX_Value,
          gsT_percent: res[0].totaltaX_RATE,
          cgsT_Value: res[0].cgsT_Value,
          cgsT_Percent: res[0].cgst,
          sgsT_value: res[0].sgsT_Value,
          sgsT_percent: res[0].sgst,
          utgsT_value: res[0].utgsT_Value,
          utgsT_percent: res[0].utgst,
          igsT_Value: res[0].igsT_Value,
          igsT_percent: res[0].igst,
          cesS_value: res[0].cesS_Value,
          cesS_percent: res[0].cess,
          taxratE1_Value: res[0].taxratE1_Value,
          taxratE1_Percent: res[0].taxratE1,
          taxratE2_Value: res[0].taxratE2_Value,
          taxratE2_Percent: res[0].taxratE2,
          taxratE3_Value: res[0].taxratE3_Value,
          taxratE3_Percent: res[0].taxratE3,
          taxratE4_Value: res[0].taxratE4_Value,
          taxratE4_Percent: res[0].taxratE4,
          taxratE5_Value: res[0].taxratE5_Value,
          taxratE5_Percent: res[0].taxratE5,
          totaltaX_RATE: res[0].totaltaX_RATE,
          totaltaX_RATE_VALUE: res[0].totaltaX_Value,
          saccode: res[0].saccode,
          taxgrpid: res[0].taxgrpid,
          codeId: res[0].codeId,
        },
        gstCode: {
          tax: res[0].tax,
          taxType: res[0].taxType,
          codeId: res[0].codeId,
          code: res[0].code,
        },
      });
      this.makeBillPayload.tab_o_opItemBasePrice.push({
        itemID: procedure.value,
        serviceID: procedure.serviceid,
        price: res[0].returnOutPut + res[0].totaltaX_Value,
        willModify: res[0].ret_value == 1 ? true : false,
      });
    }
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
          totalAmount: res[0].returnOutPut + res[0].totaltaX_Value,
          gst: res[0].totaltaX_RATE,
          gstValue: res[0].totaltaX_Value,
          specialisationID: 0,
          doctorID: 0,
          patient_Instructions: investigation.patient_Instructions,
        },
        gstDetail: {
          gsT_value: res[0].totaltaX_Value,
          gsT_percent: res[0].totaltaX_RATE,
          cgsT_Value: res[0].cgsT_Value,
          cgsT_Percent: res[0].cgst,
          sgsT_value: res[0].sgsT_Value,
          sgsT_percent: res[0].sgst,
          utgsT_value: res[0].utgsT_Value,
          utgsT_percent: res[0].utgst,
          igsT_Value: res[0].igsT_Value,
          igsT_percent: res[0].igst,
          cesS_value: res[0].cesS_Value,
          cesS_percent: res[0].cess,
          taxratE1_Value: res[0].taxratE1_Value,
          taxratE1_Percent: res[0].taxratE1,
          taxratE2_Value: res[0].taxratE2_Value,
          taxratE2_Percent: res[0].taxratE2,
          taxratE3_Value: res[0].taxratE3_Value,
          taxratE3_Percent: res[0].taxratE3,
          taxratE4_Value: res[0].taxratE4_Value,
          taxratE4_Percent: res[0].taxratE4,
          taxratE5_Value: res[0].taxratE5_Value,
          taxratE5_Percent: res[0].taxratE5,
          totaltaX_RATE: res[0].totaltaX_RATE,
          totaltaX_RATE_VALUE: res[0].totaltaX_Value,
          saccode: res[0].saccode,
          taxgrpid: res[0].taxgrpid,
          codeId: res[0].codeId,
        },
        gstCode: {
          tax: res[0].tax,
          taxType: res[0].taxType,
          codeId: res[0].codeId,
          code: res[0].code,
        },
      });
      this.makeBillPayload.tab_o_opItemBasePrice.push({
        itemID: investigation.value,
        serviceID: serviceType || investigation.serviceid,
        price: res[0].returnOutPut + res[0].totaltaX_Value,
        willModify: res[0].ret_value == 1 ? true : false,
      });
    }
  }

  async processInvestigationWithOutApi(
    priorityId: number,
    serviceType: string,
    investigation: any
  ) {
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
      price: investigation.price,
      billItem: {
        popuptext: investigation.popuptext,
        itemId: investigation.value,
        priority: priorityId,
        serviceId: serviceType || investigation.serviceid,
        price: investigation.price,
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
        totalAmount: investigation.price,
        gst: 0,
        gstValue: 0,
        specialisationID: 0,
        doctorID: 0,
        patient_Instructions: investigation.patient_Instructions,
      },
    });
    this.makeBillPayload.tab_o_opItemBasePrice.push({
      itemID: investigation.value,
      serviceID: serviceType || investigation.serviceid,
      price: investigation.price,
      willModify: false,
    });
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
    this.makeBillPayload.tab_o_opItemBasePrice.push({
      itemID: doctorName.value,
      serviceID: 25,
      price: doctorName.price,
      willModify: false,
    });
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
          totalAmount: res[0].returnOutPut + res[0].totaltaX_Value,
          gst: res[0].totaltaX_RATE,
          gstValue: res[0].totaltaX_Value,
          specialisationID: doctorName.specialisationid,
          doctorID: doctorName.value,
        },
        gstDetail: {
          gsT_value: res[0].totaltaX_Value,
          gsT_percent: res[0].totaltaX_RATE,
          cgsT_Value: res[0].cgsT_Value,
          cgsT_Percent: res[0].cgst,
          sgsT_value: res[0].sgsT_Value,
          sgsT_percent: res[0].sgst,
          utgsT_value: res[0].utgsT_Value,
          utgsT_percent: res[0].utgst,
          igsT_Value: res[0].igsT_Value,
          igsT_percent: res[0].igst,
          cesS_value: res[0].cesS_Value,
          cesS_percent: res[0].cess,
          taxratE1_Value: res[0].taxratE1_Value,
          taxratE1_Percent: res[0].taxratE1,
          taxratE2_Value: res[0].taxratE2_Value,
          taxratE2_Percent: res[0].taxratE2,
          taxratE3_Value: res[0].taxratE3_Value,
          taxratE3_Percent: res[0].taxratE3,
          taxratE4_Value: res[0].taxratE4_Value,
          taxratE4_Percent: res[0].taxratE4,
          taxratE5_Value: res[0].taxratE5_Value,
          taxratE5_Percent: res[0].taxratE5,
          totaltaX_RATE: res[0].totaltaX_RATE,
          totaltaX_RATE_VALUE: res[0].totaltaX_Value,
          saccode: res[0].saccode,
          taxgrpid: res[0].taxgrpid,
          codeId: res[0].codeId,
        },
        gstCode: {
          tax: res[0].tax,
          taxType: res[0].taxType,
          codeId: res[0].codeId,
          code: res[0].code,
        },
      });
      this.consultationItemsAdded.next(true);
      this.makeBillPayload.tab_o_opItemBasePrice.push({
        itemID: doctorName.value,
        serviceID: 25,
        price: res[0].returnOutPut + res[0].totaltaX_Value,
        willModify: res[0].ret_value == 1 ? true : false,
      });
    }
  }

  setReferralDoctor(doctor: any) {
    this.referralDoctor = doctor;
    this.makeBillPayload.ds_insert_bill.tab_insertbill.refDoctorId = doctor.id;
  }
}
