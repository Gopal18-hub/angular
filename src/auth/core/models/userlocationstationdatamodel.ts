import { LocationModel } from "./locationmodel";
import { StationModel } from "./stationmodel";

export class UserLocationStationdataModel {
  locations: LocationModel[];
  stations: StationModel[];
  userId: Number;
  name: string;
  constructor(
    locations: LocationModel[],
    stations: StationModel[],
    userId: Number,
    name: string
  ) {
    this.locations = locations;
    this.stations = stations;
    this.userId = userId;
    this.name = name;
  }
}
