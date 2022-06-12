import { LocationModel } from "./locationmodel";
import { StationModel } from "./stationmodel";

export class UserLocationStationdataModel{
    locations:LocationModel[];
    stations:StationModel[];
    userId:Number;   
    constructor(
        locations:LocationModel[],
        stations:StationModel[],
        userId:Number,
    )
    {
       this.locations=locations;
       this.stations=stations;
       this.userId =userId; 
    }
}