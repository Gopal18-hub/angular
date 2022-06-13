export class LocalityByPincodeModel {
  id: number;
  name: string;
  cityID: number;

  constructor(id: number, name: string, cityID: number) {
    this.id = id;
    this.name = name;
    this.cityID = cityID;
  }
}
