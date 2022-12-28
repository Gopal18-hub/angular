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
import { InstantiateExpr } from "@angular/compiler";
import { VisitHistoryComponent } from "@shared/modules/visit-history/visit-history.component";
import { DepositService } from "@core/services/deposit.service";

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
  healthCheckupselectedItems: any = {};
  doctorList: any = [];
  clearAllItems = new Subject<boolean>();

  billNoGenerated = new Subject<boolean>();

  servicesTabStatus = new Subject<any>();

  totalCost = 0;

  totalCostWithOutGst = 0;
  billNo = "";
  company: number = 0;
  billtype: number = 1;
  // //GAV-530 Paid Online appointment
  PaidAppointments: any;

  makeBillPayload: any = JSON.parse(
    JSON.stringify(BillingStaticConstants.makeBillPayload)
  );

  consumablePayload: any = JSON.parse(
    JSON.stringify(BillingStaticConstants.consumablePayload)
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
  isNeedToCheckSRF: any = 0;
  twiceConsultationReason: any = "";

  companyChangeEvent = new Subject<any>();
  corporateChangeEvent = new Subject<any>();
  cerditCompanyBilltypeEvent = new Subject<any>();
  pancardpaymentmethod = new Subject<any>();

  companyData: any = [];
  corporateData: any = [];
  creditcorporateData: any = [];
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

  channelDetail: any = [];
  constructor(
    private http: HttpService,
    private cookie: CookieService,
    private calculateBillService: CalculateBillService,
    public matDialog: MatDialog,
    private datepipe: DatePipe,
    private messageDialogService: MessageDialogService,
    private depositservice: DepositService
  ) {}

  setBillingFormGroup(formgroup: any, questions: any) {
    this.billingFormGroup.form = formgroup;
    this.billingFormGroup.questions = questions;
  }

  async calculateBill(formGroup: any, question: any) {
    await this.calculateBillService.initProcess(
      this.billItems,
      this,
      formGroup,
      question
    );
  }

  //check For approval or SRF GAV-1355
  checkApprovalSRF() {
    return (
      this.isNeedToCheckSRF &&
      this.makeBillPayload.ds_insert_bill.tab_insertbill.srfID == 0 &&
      this.makeBillPayload.ds_insert_bill.tab_insertbill.companyId != 0
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
    this.isNeedToCheckSRF = 0;
    this.iomMessage = "";
    this.clearAllItems.next(true);
    this.billNoGenerated.next(false);
    this.servicesTabStatus.next({ clear: true });
    this.calculateBillService.clear();
    this.billNo = "";
    this.makeBillPayload = JSON.parse(
      JSON.stringify(BillingStaticConstants.makeBillPayload)
    );
    this.consumablePayload = JSON.parse(
      JSON.stringify(BillingStaticConstants.consumablePayload)
    );
    this.companyData = [];
    this.corporateData = [];
    this.creditcorporateData = [];
    this.selectedcompanydetails = {};
    this.selectedcorporatedetails = [];
    this.selectedHealthPlan = null;
    this.selectedOtherPlan = null;
    this.dtCheckedItem = [];
    this.dtFinalGrpDoc = {};
    this.txtOtherGroupDoc = "";
  }

  calculateTotalAmount() {
    let quanity;
    this.totalCost = 0;
    this.totalCostWithOutGst = 0;
    this.billItems.forEach((item: any) => {
      quanity = !isNaN(Number(item.qty)) ? item.qty : 1;
      this.totalCost += item.totalAmount;
      this.totalCostWithOutGst += item.price * quanity;
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

  checkOtherServicesForHealthCheckups(tabId: number) {
    if (
      this.consultationItems.length > 0 ||
      this.InvestigationItems.length > 0 ||
      this.OrderSetItems.length > 0 ||
      this.ConsumableItems.length > 0
    ) {
      return true;
    } ////GAV-902 Registration Charges with Health Checkup
    else if (this.ProcedureItems.length > 0) {
      if (this.ProcedureItems.length > 1) {
        return true;
      } else if (
        this.ProcedureItems.length == 1 &&
        !BillingStaticConstants.allowService[tabId].includes(
          this.ProcedureItems[0].itemid
        )
      ) {
        return true;
      }
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
      if (item.serviceId != 68) {
        subItems.push({
          serviceID: item.serviceId,
          itemId: item.itemId,
          bundleId: 0,
          priority: item.priority,
        });
      }
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
        if (this.billItems && this.billItems.length > 0) {
          res.forEach((resItem: any, index: number) => {
            //GAV-1070
            let quanity = !isNaN(Number(this.billItems[index].qty))
              ? this.billItems[index].qty
              : 1;
            this.billItems[index].price = resItem.returnOutPut;
            this.billItems[index].totalAmount = quanity * resItem.returnOutPut;
            this.updateServiceItemPrice(this.billItems[index]);
            ////GAV-1464
            this.billItems[index].itemCode = resItem.itemCode || "";
            ////GAV-1464
            this.makeBillPayload.ds_insert_bill.tab_d_opbillList.forEach(
              (opbillItem: any, billIndex: any) => {
                if (opbillItem.itemId == this.billItems[index].itemId) {
                  this.makeBillPayload.ds_insert_bill.tab_d_opbillList[
                    billIndex
                  ].itemcode = resItem.itemCode;
                }
              }
            );
          });
          this.calculateTotalAmount();
          this.refreshBillTab.next(true);
        }
      });
  }

  setCreditLimit(data: any) {
    this.creditLimit = data;
  }
  async setCompnay(
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
      ) {
        this.calculateBillService.billFormGroup.form.controls[
          "credLimit"
        ].setValue("0.00");
        ///GAV-1473
        this.calculateBillService.billFormGroup.form.controls["coPay"].setValue(
          "0.00"
        );
        // For GAV-1355 SRF Popup
        await this.calculateBillService.serviceBasedCheck();
      }
    }
    if (res === "" || res == null) {
      this.companyChangeEvent.next({ company: null, from });

      this.selectedcorporatedetails = [];
      this.selectedcompanydetails = [];
      this.makeBillPayload.ds_insert_bill.tab_insertbill.companyId = 0;
      this.iomMessage = "";
      if (formGroup.controls["corporate"]) {
        formGroup.controls["corporate"].setValue(null);
        formGroup.controls["corporate"].disable();
      }
    } else if (res.title && res.title != "Select") {
      let iscompanyprocess = true;
      //fix for Staff company validation
      if (res.company.isStaffcompany && from != "companyexists") {
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
              this.makeBillPayload.isIndivisualOrCorporate = true;
              formGroup.controls["corporate"].enable();
              const corporateExist: any = this.corporateData.find(
                (c: any) => c.id == this.patientDetailsInfo.corporateid
              );
              if (
                corporateExist &&
                this.company == this.patientDetailsInfo.companyid
              ) {
                formGroup.controls["corporate"].setValue({
                  title: corporateExist.name,
                  value: this.patientDetailsInfo.corporateid,
                });
              } else {
                formGroup.controls["corporate"].setValue(null);
              }
              //reseting value even value is available - GAV-1406
              // formGroup.controls["corporate"].setValue(null);
              // this.corporateChangeEvent.next({ corporate: null, from });
              this.disablecorporatedropdown = true;
            } else {
              formGroup.controls["corporate"].setValue(null);
              this.makeBillPayload.isIndivisualOrCorporate = false;
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
    } else if (res.value == -1) {
      this.iomMessage = "";
      this.selectedcompanydetails = res;
      this.selectedcorporatedetails = [];
      this.companyChangeEvent.next({ company: res, from });
    }
  }

  //check company credit
  checkcreditcompany(
    companyid: number,
    res: any,
    formGroup: any,
    from: string = "header"
  ) {
    if (Number(this.patientDetailsInfo.creditFlag) == 0) {
      let creditallowcompany = this.companyData.find(
        (c: any) => c.id == res.company.id && c.creditAllow == 0
      );
      if (creditallowcompany.length == 1) {
        if (this.creditcorporateData.length > 0) {
          let locationfilter = this.creditcorporateData.find(
            (c: any) => c.hspLocationId == 67
          );
          if (locationfilter.length > 0) {
            const locationbasedcompany = this.messageDialogService.error(
              "As per Policy this corporate does not have the credit facility on this location"
            );
            locationbasedcompany.afterClosed().toPromise();
            this.cerditCompanyBilltypeEvent.next({ billtype: 1 });
            formGroup.controls["company"].setValue(null);
          } else {
            const dialogref = this.messageDialogService.confirm(
              "",
              `As per Policy this corporate does not have the credit facility. Still you want to give the cashless facility ?`
            );
            dialogref.afterClosed().subscribe((res: any) => {
              if (res == "yes") {
              } else {
                this.cerditCompanyBilltypeEvent.next({ billtype: 1 });
              }
            });
          }
        } else {
          const dialogref = this.messageDialogService.confirm(
            "",
            `As per Policy this corporate does not have the credit facility. Still you want to give the cashless facility ?`
          );
          dialogref.afterClosed().subscribe((res: any) => {
            if (res == "yes") {
            } else {
              this.cerditCompanyBilltypeEvent.next({ billtype: 1 });
            }
          });
        }
      }
    } else {
      this.http
        .get(
          BillingApiConstants.getcompanydetailcreditallow(
            res.company.id,
            "OP",
            // Number(this.cookie.get("HSPLocationId")),
            // Number(this.cookie.get("UserId"))))
            67,
            60925
          )
        )
        .subscribe((data) => {
          if (data == 0) {
            const creditbasedcompany = this.messageDialogService.error(
              "Credit not allow for this company.Please contact marketing, if credit need to be extended for this company."
            );
            creditbasedcompany.afterClosed().toPromise();
            formGroup.controls["company"].setValue(null);
            this.cerditCompanyBilltypeEvent.next({ billtype: 1 });
          } else {
            this.setCompnay(companyid, res, formGroup, from);
          }
        });
    }
  }

  //fix for Staff company validation
  async resetCompany(res: any, formGroup: any, from: string = "header") {
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

  setcreditcorporateData(data: any) {
    this.creditcorporateData = data;
  }

  setBilltype(billtype: number) {
    this.billtype = billtype;
  }

  setBillNumber(billNo: any) {
    this.billNo = billNo;
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
    let quantity = "1";
    this.billItems.push(data);
    this.billItemsTrigger.next({ data: this.billItems });
    if (!isNaN(Number(data.qty.toString()))) {
      quantity = data.qty.toString();
    }
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
      qty: quantity,
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
      itemcode: data.itemCode || "",
      empowerApproverCode: "",
      couponCode: "",
    });
    this.resetDiscount();
  }

  resetDiscount() {
    if (this.calculateBillService.discountSelectedItems.length > 0) {
      this.calculateBillService.validCoupon = false;
      this.billItems.forEach((item: any) => {
        item.disc = 0;
        item.discAmount = 0;
        let quantity = !isNaN(Number(item.qty)) ? item.qty : 1;
        const price = item.price * quantity;
        item.gstValue = item.gst > 0 ? (item.gst * price) / 100 : 0;
        item.totalAmount = price + item.gstValue;
        item.discountType = 0;
        item.discountReason = 0;
      });
      this.calculateBillService.setDiscountSelectedItems([]);
      if (this.calculateBillService.discountForm)
        this.calculateBillService.discountForm.reset();
      this.calculateBillService.calculateDiscount();
      this.makeBillPayload.tab_o_opDiscount = [];
      ////GAV-1427
      this.makeBillPayload.ds_insert_bill.tab_d_opbillList.forEach(
        (opbillItem: any, billIndex: any) => {
          this.billItems.forEach((item: any, index: any) => {
            if (opbillItem.itemId == item.itemId) {
              this.makeBillPayload.ds_insert_bill.tab_d_opbillList[
                billIndex
              ].amount = item.totalAmount;
            }
          });

          this.makeBillPayload.ds_insert_bill.tab_d_opbillList[
            billIndex
          ].discountamount = 0;
          this.makeBillPayload.ds_insert_bill.tab_d_opbillList[
            billIndex
          ].discountType = 0;
          this.makeBillPayload.ds_insert_bill.tab_d_opbillList[
            billIndex
          ].oldOPBillId = 0;
        }
      );
      if (
        this.calculateBillService.billFormGroup &&
        this.calculateBillService.billFormGroup.form
      ) {
        this.calculateBillService.billFormGroup.form.patchValue({
          coupon: "",
          compDisc: "0.00",
          patientDisc: "0.00",
          discAmtCheck: false,
        });
      }
    }
  }

  removeFromBill(data: any) {
    let exist = this.billItems.findIndex((item: any) => {
      return item.itemId == (data.billItem && data.billItem.itemId);
    });
    if (exist > -1) {
      this.billItems.splice(exist, 1);
      this.resetDiscount();
      this.makeBillPayload.ds_insert_bill.tab_d_opbillList.splice(exist, 1);
    }
  }

  applyHealthPlandiscount(data: any) {
    if (this.selectedHealthPlan) {
      const findService = this.selectedHealthPlan.odtHealthDiscount.find(
        (serItem: any) =>
          (serItem.serviceid == data.billItem.serviceId &&
            serItem.isserviceiditemid == 0) ||
          (serItem.isserviceiditemid == 1 &&
            serItem.serviceid == data.billItem.serviceId &&
            serItem.itemid == data.billItem.itemId)
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
      this.dtCheckedItem.forEach((item: any) => {
        this.makeBillPayload.dtCheckedItem.push(item);
      });
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
  setPatientChannelDetail(channeldetail: any) {
    this.channelDetail = channeldetail;
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
      ////1412 - on Patient share or Company Share
      let totalDiscount: any = 0;
      if (
        this.makeBillPayload.tab_o_opDiscount &&
        this.makeBillPayload.tab_o_opDiscount.length > 0
      ) {
        this.makeBillPayload.tab_o_opDiscount.forEach((billDiscount: any) => {
          if (billDiscount.disType == "4" || billDiscount.disType == "5") {
            totalDiscount += billDiscount.disAmt;
          }
        });
      }

      let toBePaid =
        parseFloat(
          this.makeBillPayload.ds_insert_bill.tab_insertbill.billAmount
        ) -
        (parseFloat(
          this.makeBillPayload.ds_insert_bill.tab_insertbill.depositAmount
        ) +
          ////1412 - on Patient share or Company Share
          parseFloat(totalDiscount) +
          // parseFloat(
          //   this.makeBillPayload.ds_insert_bill.tab_insertbill.discountAmount
          // ) +
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

      let cashlimit = this.makeBillPayload.ds_paymode.tab_paymentList.filter(
        (mode: any) => mode.modeOfPayment == "Cash" && mode.amount >= 200000
      );
      if (cashlimit.length > 0) {
        const modeconfirm = this.messageDialogService.info(
          "Total cash amount cannot exceed Rs.199999"
        );
        modeconfirm.afterClosed().toPromise();
        return;
      }

      // for form60
      let tobepaidby: number = 0,
        paymentmode: string = "";
      if (this.depositservice.isform60exists) {
        this.makeBillPayload.ds_paymode.tab_paymentList.forEach(
          (payment: any) => {
            if (Number(payment.amount) > 0) {
              tobepaidby += Number(payment.amount);
              paymentmode = paymentmode + " ," + payment.modeOfPayment;
            }
          }
        );
        this.depositservice.depositformsixtydetails.transactionAmount =
          tobepaidby;
        this.depositservice.depositformsixtydetails.mop = paymentmode;
        this.depositservice.saveform60();
      }

      this.makeBillPayload.ds_insert_bill.tab_insertbill.twiceConsultationReason =
        this.twiceConsultationReason;
      this.makeBillPayload.ds_insert_bill.tab_l_receiptList = [];
      this.makeBillPayload.ds_insert_bill.tab_insertbill.narrationOnBill =
        this.billingFormGroup.form.value.narration || "";
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
          "Do you want to pay with due amount of Rs." +
            (toBePaid - collectedAmount).toFixed(2) +
            "?"
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
    if (this.ConsumableItems.length > 0) {
      return this.consumableMakeBill();
    } else {
      return this.http
        .post(BillingApiConstants.insert_billdetailsgst(), this.makeBillPayload)
        .toPromise();
    }
  }

  consumableMakeBill() {
    this.consumablePayload = JSON.parse(
      JSON.stringify(BillingStaticConstants.consumablePayload)
    );
    this.consumablePayload.registrationno =
      this.makeBillPayload.ds_insert_bill.tab_insertbill.registrationNo;
    this.consumablePayload.iacode =
      this.makeBillPayload.ds_insert_bill.tab_insertbill.iaCode;
    this.consumablePayload.dtOOpBill = {
      billtype: this.makeBillPayload.ds_insert_bill.tab_insertbill.billType,
      billamount: this.makeBillPayload.ds_insert_bill.tab_insertbill.billAmount,
      depositeamount:
        this.makeBillPayload.ds_insert_bill.tab_insertbill.depositAmount,
      discountamount:
        this.makeBillPayload.ds_insert_bill.tab_insertbill.discountAmount,
      companyid: this.makeBillPayload.ds_insert_bill.tab_insertbill.companyId,
      collectedAmount:
        this.makeBillPayload.ds_insert_bill.tab_insertbill.collectedAmount,
      balance: this.makeBillPayload.ds_insert_bill.tab_insertbill.balance,
      discountReason:
        this.makeBillPayload.ds_insert_bill.tab_insertbill.disReason,
      refDoctorid:
        this.makeBillPayload.ds_insert_bill.tab_insertbill.refDoctorId,
      creditLimit:
        this.makeBillPayload.ds_insert_bill.tab_insertbill.creditLimit,
      srvTaxOnBill: 0,
      tpa: this.makeBillPayload.ds_insert_bill.tab_insertbill.tpaId,
      paidByTPA: 0,
      interactionID: this.makeBillPayload.cmbInteraction,
      corporateid:
        this.makeBillPayload.ds_insert_bill.tab_insertbill.corporateid,
      corporate: this.makeBillPayload.ds_insert_bill.tab_insertbill.corporate,
      channel: this.makeBillPayload.ds_insert_bill.tab_insertbill.channel,
    };
    let consumableDetails: any = [];
    this.ConsumableItems.forEach((cDI: any, cDIIndex: number) => {
      this.consumablePayload.dtOTBillDetails.push({
        slNo: cDIIndex,
        surgeryName: cDI.surgeryName,
        priority: cDI.priority.toString(),
        credit: cDI.credit,
        cash: cDI.cash,
        surgeryid: 0,
        priorityId: "",
        discountAmount:
          this.makeBillPayload.ds_insert_bill.tab_d_opbillList[cDIIndex]
            .discountamount,
        taxAmt: cDI.taxAmount,
        taxPer: 0,
        totalAmt: cDI.totalAmount,
        disReasonID: (this.billItems[cDIIndex].discountReason || 0).toString(),
        empowerApproverCode:
          this.makeBillPayload.ds_insert_bill.tab_d_opbillList[cDIIndex]
            .empowerApproverCode,
        couponCode:
          this.makeBillPayload.ds_insert_bill.tab_d_opbillList[cDIIndex]
            .couponCode,
        serviceid: cDI.billItem.serviceId,
      });
      let filteredItems = cDI.items.filter(
        (i: any) => i.orderid === cDI.orderId
      );
      filteredItems.forEach((item: any, itemIndex: number) => {
        let existInUnSelected = null;
        if (
          cDI.orderId.toString() in
          this.calculateBillService.consumablesUnselectedItems
        ) {
          existInUnSelected =
            this.calculateBillService.consumablesUnselectedItems[
              cDI.orderId
            ].find((uI: any) => {
              return uI.itemid == item.itemid;
            });
        }

        if (existInUnSelected) {
          consumableDetails.push({
            orderid: item.orderid,
            itemid: item.itemid,
            itemName: item.itemName,
            quantity: item.quantity,
            amount: item.amount,
            inclusion: true,
            procedureid: existInUnSelected.procedure.procedureid,
            procedureName: existInUnSelected.procedure.procedureName,
            reason: existInUnSelected.reason,
            procedureBillid: existInUnSelected.procedure.procedureBillid,
            procedureAmt: existInUnSelected.procedure.procedureAmt,
          });
        } else {
          consumableDetails.push({
            orderid: item.orderid,
            itemid: item.itemid,
            itemName: item.itemName,
            quantity: item.quantity,
            amount: item.amount,
            inclusion: false,
            procedureid: 0,
            procedureName: "",
            reason: "",
            procedureBillid: 0,
            procedureAmt: 0,
          });
        }
      });
    });
    this.consumablePayload.ds_paymode = this.makeBillPayload.ds_paymode;
    this.consumablePayload.htParms = this.makeBillPayload.htParms;
    this.consumablePayload.tab_d_deposit_Dto =
      this.makeBillPayload.ds_insert_bill.tab_d_depositList;
    this.consumablePayload.dtConsumableDetail = consumableDetails;
    this.consumablePayload.hspLocationId = this.cookie.get("HSPLocationId");
    this.consumablePayload.userId = this.makeBillPayload.userId;
    this.consumablePayload.stationId = this.makeBillPayload.stationId;
    return this.http
      .post(
        BillingApiConstants.opConsumableBillCreate(),
        this.consumablePayload
      )
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
        specialisation: procedure.specializationId || "",
        doctorName: procedure.doctorid || "",
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
          itemCode: res[0].itemCode,
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

  async processProcedureAddWithOutApi(
    priorityId: number,
    serviceType: string,
    procedure: any
  ) {
    this.addToProcedure({
      sno: this.ProcedureItems.length + 1,
      procedures: procedure.originalTitle,
      qty: 1,
      specialisation: "",
      doctorName: "",
      doctorName_required: procedure.docRequired ? true : false,
      specialisation_required: procedure.docRequired ? true : false,
      price: procedure.price,
      unitPrice: procedure.price,
      itemid: procedure.value,
      priorityId: priorityId,
      serviceId: procedure.serviceid,
      billItem: {
        popuptext: procedure.popuptext,
        itemId: procedure.value,
        priority: priorityId,
        serviceId: procedure.serviceid,
        price: procedure.price,
        serviceName: "Procedure & Others",
        itemName: procedure.originalTitle,
        qty: 1,
        precaution: "",
        procedureDoctor: "",
        credit: 0,
        cash: 0,
        disc: 0,
        discAmount: 0,
        totalAmount: procedure.price,
        gst: 0,
        gstValue: 0,
        specialisationID: 0,
        doctorID: 0,
        itemCode: "",
      },
      gstDetail: {},
      gstCode: {},
    });
    this.makeBillPayload.tab_o_opItemBasePrice.push({
      itemID: procedure.value,
      serviceID: procedure.serviceid,
      price: procedure.price,
      willModify: false,
    });
  }

  async processInvestigationBulk(priorityId: number, investigations: any = []) {
    const investigationItems: any = [];
    investigations.forEach((inv: any) => {
      investigationItems.push({
        serviceID: inv.serviceid,
        itemId: inv.value,
        bundleId: 0,
        priority: priorityId,
      });
    });
    const res: any = await this.http
      .post(
        BillingApiConstants.getPriceBulk(
          this.cookie.get("HSPLocationId"),
          this.company
        ),
        investigationItems
      )
      .toPromise();

    if (res.length > 0) {
      res.forEach((rItem: any, index: number) => {
        const investigation = investigations[index];
        this.addToInvestigations({
          sno: this.InvestigationItems.length + 1,
          investigations: investigation.title,
          precaution:
            investigation.precaution == "P"
              ? '<span class="max-health-red-color">P</span>'
              : investigation.precaution,
          priority: priorityId,
          priority_required: false,
          // specialisation: investigation.specializationId || "",
          doctorName: investigation.doctorid || "",
          specialisation_required: investigation.docRequired ? true : false,
          doctorName_required: investigation.docRequired ? true : false,
          price: rItem.returnOutPut,
          billItem: {
            popuptext: investigation.popuptext,
            itemId: investigation.value,
            priority: priorityId,
            serviceId: investigation.serviceid,
            price: rItem.returnOutPut,
            serviceName: "Investigations",
            itemName: investigation.title,
            qty: 1,
            precaution:
              investigation.precaution == "P"
                ? '<span class="max-health-red-color">P</span>'
                : investigation.precaution,
            procedureDoctor: investigation.docName || "",
            credit: 0,
            cash: 0,
            disc: 0,
            discAmount: 0,
            totalAmount: rItem.returnOutPut + rItem.totaltaX_Value,
            gst: rItem.totaltaX_RATE,
            gstValue: rItem.totaltaX_Value,
            specialisationID: investigation.specializationId || 0,
            doctorID: investigation.doctorid || 0,
            patient_Instructions: investigation.patient_Instructions,
            profileId: investigation.profileid || 0, ////GAV-1280  Adding Investigations with same profile
            itemCode: investigation.itemCode || "",
          },
          gstDetail: {
            gsT_value: rItem.totaltaX_Value,
            gsT_percent: rItem.totaltaX_RATE,
            cgsT_Value: rItem.cgsT_Value,
            cgsT_Percent: rItem.cgst,
            sgsT_value: rItem.sgsT_Value,
            sgsT_percent: rItem.sgst,
            utgsT_value: rItem.utgsT_Value,
            utgsT_percent: rItem.utgst,
            igsT_Value: rItem.igsT_Value,
            igsT_percent: rItem.igst,
            cesS_value: rItem.cesS_Value,
            cesS_percent: rItem.cess,
            taxratE1_Value: rItem.taxratE1_Value,
            taxratE1_Percent: rItem.taxratE1,
            taxratE2_Value: rItem.taxratE2_Value,
            taxratE2_Percent: rItem.taxratE2,
            taxratE3_Value: rItem.taxratE3_Value,
            taxratE3_Percent: rItem.taxratE3,
            taxratE4_Value: rItem.taxratE4_Value,
            taxratE4_Percent: rItem.taxratE4,
            taxratE5_Value: rItem.taxratE5_Value,
            taxratE5_Percent: rItem.taxratE5,
            totaltaX_RATE: rItem.totaltaX_RATE,
            totaltaX_RATE_VALUE: rItem.totaltaX_Value,
            saccode: rItem.saccode,
            taxgrpid: rItem.taxgrpid,
            codeId: rItem.codeId,
          },
          gstCode: {
            tax: rItem.tax,
            taxType: rItem.taxType,
            codeId: rItem.codeId,
            code: rItem.code,
          },
        });
        this.makeBillPayload.tab_o_opItemBasePrice.push({
          itemID: investigation.value,
          serviceID: investigation.serviceid,
          price: rItem.returnOutPut + rItem.totaltaX_Value,
          willModify: rItem.ret_value == 1 ? true : false,
        });
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
        specialisation: investigation.specializationId || "",
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
          procedureDoctor: investigation.docName || "",
          credit: 0,
          cash: 0,
          disc: 0,
          discAmount: 0,
          totalAmount: res[0].returnOutPut + res[0].totaltaX_Value,
          gst: res[0].totaltaX_RATE,
          gstValue: res[0].totaltaX_Value,
          specialisationID: investigation.specializationId || 0,
          doctorID: investigation.doctorid || 0,
          patient_Instructions: investigation.patient_Instructions,
          profileId: investigation.profileid || 0, ////GAV-1280  Adding Investigations with same profile
          itemCode: res[0].itemCode || "", /////GAV-1464
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
      specialisation: investigation.specializationId || "",
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
        profileId: investigation.profileid || 0, ////GAV-1280  Adding Investigations with same profile
        itemCode: "", ////GAV-1464
      },
      gstDetail: {},
      gstCode: {},
    });
    this.makeBillPayload.tab_o_opItemBasePrice.push({
      itemID: investigation.value,
      serviceID: serviceType || investigation.serviceid,
      price: investigation.price,
      willModify: false,
    });
  }

  async procesConsultationAddWithOutApi(
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
        itemCode: "", //GAV-1464
      },
      gstDetail: {},
      gstCode: {},
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
    let consultType: any = {};
    let consultationtype = "Consultation – CPT 99202";
    let onlinePaidAppoinment = this.PaidAppointments
      ? this.PaidAppointments.paymentstatus == "Yes"
        ? true
        : false
      : false;
    if (!this.selectedOtherPlan && !onlinePaidAppoinment) {
      consultType = await this.http
        .get(
          BillingApiConstants.getDoctorConsultType(
            Number(this.cookie.get("HSPLocationId")),
            doctorName.value,
            this.activeMaxId.iacode,
            this.activeMaxId.regNumber
          )
        )
        .toPromise();
      if (consultType) {
        priorityId = consultType[0].consultId;
        consultationtype = consultType[0].strConsult;

        //#region GAV-777
        if (
          consultType[0].strConsult.includes("Follow up") &&
          Number(this.cookie.get("HSPLocationId")) == 69
        ) {
          this.visitHistory();
        }
        //#endregion
      }
    }
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
          qty: consultationtype,
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
          itemCode: res[0].itemCode || "",
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

  resetgstfromservices(service: any, reason: any) {
    this.makeBillPayload.taxReason = reason;
    service[0].gstDetail = {
      gsT_value: 0,
      gsT_percent: 0,
      cgsT_Value: 0,
      cgsT_Percent: 0,
      sgsT_value: 0,
      sgsT_percent: 0,
      utgsT_value: 0,
      utgsT_percent: 0,
      igsT_Value: 0,
      igsT_percent: 0,
      cesS_value: 0,
      cesS_percent: 0,
      taxratE1_Value: 0,
      taxratE1_Percent: 0,
      taxratE2_Value: 0,
      taxratE2_Percent: 0,
      taxratE3_Value: 0,
      taxratE3_Percent: 0,
      taxratE4_Value: 0,
      taxratE4_Percent: 0,
      taxratE5_Value: 0,
      taxratE5_Percent: 0,
      totaltaX_RATE: 0,
      totaltaX_RATE_VALUE: 0,
      taxgrpid: 0,
      codeId: 0,
    };
    service[0].billItem.totalAmount =
      service[0].billItem.totalAmount - service[0].billItem.gstValue;
    service[0].billItem.gst = 0;
    service[0].billItem.gstValue = 0;
    this.makeBillPayload.tab_o_opItemBasePrice.forEach((item: any) => {
      if (item.itemID == service[0].itemid) {
        item.price = service[0].billItem.totalAmount;
      }
    });
    this.makeBillPayload.ds_insert_bill.tab_d_opbillList.forEach(
      (item: any) => {
        if (item.itemId == service[0].itemid) {
          item.amount = service[0].billItem.totalAmount;
        }
      }
    );
    this.calculateTotalAmount();
  }

  setpaymenthodpancardfocus() {
    this.pancardpaymentmethod.next(true);
  }

  // ///GAV-777 visit history popup for Nanvati location
  visitHistory() {
    this.matDialog.open(VisitHistoryComponent, {
      width: "70%",
      height: "50%",
      data: {
        maxid: this.activeMaxId.maxId,
        docid: "",
      },
    });
  }
  //gav 1428
  checkValidItems() {
    let nonPricedItems = [];
    nonPricedItems = this.billItems.filter((e: any) => e.price == 0);
    if (nonPricedItems.length > 0) {
      this.messageDialogService.error(
        "Please remove Non Priced Items in the list to proceed billing"
      );
      return false;
    } else {
      return true;
    }
  }
}
