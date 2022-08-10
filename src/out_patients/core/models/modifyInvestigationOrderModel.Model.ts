export class ModifyInvestigationOrderModel {    
    physicianOrderList:physicianOrderList[];
    constructor(
        physicianOrderList:physicianOrderList[]
    ) {
      this.physicianOrderList=physicianOrderList;
    }
  }
  interface physicianOrderList {
    acDisHideDrug: boolean,
    visitid: number,
    drugid: number,
    acdRemarks: string
  }