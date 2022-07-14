export class getAreaCounterDetailsModel{
    areaId?: number;
    areaName?: string;
    counterId?: number;
    counterName?: string

    constructor(areaId:number, areaName:string, counterId: number, counterName: string){
        this.areaId = areaId;
        this.areaName = areaName;
        this.counterId = counterId;
        this.counterName = counterName;
    }
}