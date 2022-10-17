import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpService } from "@shared/services/http.service";
import { BillingApiConstants } from "../billing/BillingApiConstant";
import { CookieService } from "@shared/services/cookie.service";
import { CalculateBillService } from '@core/services/calculate-bill.service';
@Injectable({
  providedIn: 'root'
})
export class PostDischargeServiceService {
  totalCost = 0;
  consultationItems: any = [];
  billItems: any = [];
  activeLink = new Subject<any>();
  activeMaxId: any;
  activecoupon: any;
  consultationItemsAdded = new Subject<boolean>();
  clearAllItems = new Subject<boolean>();
  billItemsTrigger = new Subject<any>();
  billedtrigger = new Subject<any>();
  billModified!: boolean;
  billingFormGroup: any = { form: "", questions: [] };
  constructor(
    private http: HttpService,
    private cookie: CookieService,
    private calculateBillService: CalculateBillService,
  ) { }
  setBillingFormGroup(formgroup: any, questions: any) {
    this.billingFormGroup.form = formgroup;
    this.billingFormGroup.questions = questions;
  }
  calculateTotalAmount() {
    this.totalCost = 0;
    this.consultationItems.forEach((item: any) => {
      this.totalCost += item.price;
    });
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
    this.activeLink.next(value);
  }

  deleteFromService(billItem: any) {
    const consultationsExist = this.consultationItems.findIndex((item: any) => {
      return item.billItem.itemId == billItem.itemId;
    });
    if (consultationsExist > -1) {
      this.consultationItems.splice(consultationsExist, 1);
      return;
    }
  }
  addToConsultation(data: any) {
    this.consultationItems.push(data);
    if (data.billItem) {
      this.addToBill(data.billItem);
      // this.makeBillPayload.ds_insert_bill.tab_o_opdoctorList.push({
      //   referDoctorId: 0,
      //   hspLocationId: Number(this.cookie.get("HSPLocationId")),
      //   opBillId: 0,
      //   orderNo: "",
      // });
      // this.makeBillPayload.ds_insert_bill.tab_d_opdoctorList.push({
      //   orderId: 0,
      //   doctorId: data.billItem.itemId,
      //   type: data.billItem.serviceId,
      //   visited: 0,
      //   scheduleSlot: "",
      //   scheduleId: 0,
      //   amount: data.billItem.price,
      //   specialisationId: data.specialization || 0,
      //   hcuId: 0,
      //   clinicId: data.clinics || 0,
      // });
    }

    this.calculateTotalAmount();
  }
  procesConsultationAddWithOutApi(
    priorityId: number,
    specialization: any,
    doctorName: any,
    clinics: any
  ) {
    this.addToConsultation({
      sno: this.consultationItems.length + 1,
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
    // this.makeBillPayload.tab_o_opItemBasePrice.push({
    //   itemID: doctorName.value,
    //   serviceID: 25,
    //   price: doctorName.price,
    //   willModify: false,
    // });
  }

  async procesConsultationAdd(
    priorityId: number,
    specialization: any,
    doctorName: any,
    clinics: any
  ) {
    const res = await this.http
      .post(BillingApiConstants.getcalculateopbill, {
        compId: 0,
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
        sno: this.consultationItems.length + 1,
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
      // this.makeBillPayload.tab_o_opItemBasePrice.push({
      //   itemID: doctorName.value,
      //   serviceID: 25,
      //   price: res[0].returnOutPut,
      //   willModify: res[0].ret_value == 1 ? true : false,
      // });
    }
  }
  checkServicesAdded() {
    if (this.consultationItems.length > 0) {
      return true;
    }
    return false;
  }
  calculateBill() {
    this.calculateBillService.initProcess(this.billItems, this);
  }
  addToBill(data: any) {
    this.billItems.push(data);
    this.billItemsTrigger.next({ data: this.billItems });
    // this.makeBillPayload.ds_insert_bill.tab_d_opbillList.push({
    //   opBillId: 0,
    //   serviceId: data.serviceId,
    //   itemId: data.itemId,
    //   amount: data.totalAmount,
    //   discountamount: 0,
    //   serviceName: data.serviceName,
    //   itemName: data.itemName,
    //   cancelled: false,
    //   discountType: 0,
    //   refund: false,
    //   qty: data.qty.toString(),
    //   refundId: 0,
    //   posted: "",
    //   qtSlno: 1,
    //   orderID: 0,
    //   planAmount: 0,
    //   rfLocationID: 0,
    //   planDiscount: 0,
    //   isProfile: false,
    //   uploaded: 0,
    //   spItemid: 0,
    //   oldOPBillId: 0,
    //   oldorderId: 0,
    //   consultid: 0,
    //   discrtype_dr: 0,
    //   pharma: 1,
    //   specialisationID: data.specialisationID || 0,
    //   doctorID: data.doctorID || 0,
    //   isServiceTax: 0,
    //   itemcode: "",
    //   empowerApproverCode: "",
    //   couponCode: "",
    // });
  }
  removeFromBill(data: any) {
    let exist = this.billItems.findIndex((item: any) => {
      return (item.itemId = data.billItem && data.billItem.itemId);
    });
    if (exist > -1) {
      this.billItems.splice(exist, 1);
      // this.makeBillPayload.ds_insert_bill.tab_d_opbillList.splice(exist, 1);
    }
  }
  clear() {
    // this.todayPatientBirthday = false;
    this.billItems = [];
    this.consultationItems = [];
    this.totalCost = 0;
    this.activeMaxId = null;
    this.billingFormGroup = { form: "", questions: [] };
    this.clearAllItems.next(true);
    // this.billNoGenerated.next(false);
    // this.servicesTabStatus.next({ clear: true });
    this.calculateBillService.clear();
    this.billModified = false;
    this.billedtrigger.next(false);
    // this.makeBillPayload = JSON.parse(
    //   JSON.stringify(BillingStaticConstants.makeBillPayload)
    // );
    // console.log(this.makeBillPayload);
  }
  modified()
  {
    this.billModified = true;
  }
  setactivecoupon(coupon: any)
  {
    this.activecoupon = coupon;
  }
  setBilledStatus()
  {
    this.billedtrigger.next(true);
  }
}
