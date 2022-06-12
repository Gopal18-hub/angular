export class StationModel {
  stationid: number;
  stationName: string;
  hspLocationId: number;
  stationType: string;
  departmentId: number;
  moduleId: number;

  // public station: StationModel[];
  constructor(
    stationid: number,
    stationName: string,
    hSPLocationId: number,
    stationType: string,
    departmentId: number,
    moduleId: number
  ) {
    this.stationid = stationid;
    this.stationName = stationName;
    this.hspLocationId = hSPLocationId;
    this.stationType = stationType;
    this.departmentId = departmentId;
    this.moduleId = moduleId;
  }
}
