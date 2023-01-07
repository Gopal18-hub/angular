export class AddressonCityModel {
  localityId: number;
  locality: string;
  districtId: number;
  districtName: string;
  stateId: number;
  stateName: string;
  pinCode: number;

  constructor(
    localityId: number,
    locality: string,
    districtId: number,
    districtName: string,
    stateId: number,
    stateName: string,
    pinCode: number
  ) {
    this.localityId = localityId;
    this.locality = locality;
    this.districtId = districtId;
    this.districtName = districtName;
    this.stateId = stateId;
    this.stateName = stateName;
    this.pinCode = pinCode;
  }
}
