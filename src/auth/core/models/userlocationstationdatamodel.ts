import { locationmodel } from "./locationmodel";
import { stationmodel } from "./stationmodel";

export class userlocationstationdatamodel{
    locations:locationmodel[];
    stations:stationmodel[];
    userId:Number;   
    constructor(
        locations:locationmodel[],
        stations:stationmodel[],
        userId:Number,
    )
    {
       this.locations=locations;
       this.stations=stations;
       this.userId =userId; 
    }
}