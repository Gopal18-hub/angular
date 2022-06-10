export class MasterCountryModel {
  id: number;
  countryName: string;

  constructor(id: number, countryName: string) {
    this.id = id;
    this.countryName = countryName;
  }
}
