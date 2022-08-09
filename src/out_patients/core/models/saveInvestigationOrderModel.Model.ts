export class SaveInvestigationOrderModel {
    objPhyOrder: objPhyOrder[];
    objdtdenialorder: objdtdenialorder[];
    flag: number;
    operatorid: number;
    constructor(
        objPhyOrder: objPhyOrder[],
        objdtdenialorder: objdtdenialorder[],
        flag: number,
        operatorid: number
    ) {
      this.objPhyOrder = objPhyOrder;
      this.objdtdenialorder = objdtdenialorder;
      this.flag = flag;
      this.operatorid = operatorid;
    }
  }
  interface objPhyOrder {
    acDisHideDrug: boolean,
    visitid: number,
    drugid: number,
    acdRemarks: string
  }
  interface objdtdenialorder {
    denialid: number,
    denialremark: string,
    visitid: number,
    nextScheduleDate: string,
    nextflag: true
  }