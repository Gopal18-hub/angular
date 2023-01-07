export class StationModel {
  id: number;
  name: string;
  stationTypeId: number;
  hsplocationId: number;
  stationType: string;
  departmentId: number;

  constructor(
    id: number,
    name: string,
    stationTypeId: number,
    hsplocationId: number,
    stationType: string,
    departmentId: number
  ) {
    this.id = id;
    this.name = name;
    this.stationTypeId = stationTypeId;
    this.hsplocationId = hsplocationId;
    this.stationType = stationType;
    this.departmentId = departmentId;
  }
}
