export class LocationModel {
  organizationName: string;
  iaCode: string;
  hspLocationId: number;
  ssnPrefix: string;

  // public location: LocationModel[];
  constructor(
    organizationName: string,
    iACode: string,
    hSPLocationId: number,
    ssnPrefix: string
  ) {
    this.organizationName = organizationName;
    this.iaCode = iACode;
    this.hspLocationId = hSPLocationId;
    this.ssnPrefix = ssnPrefix;
  }
}
