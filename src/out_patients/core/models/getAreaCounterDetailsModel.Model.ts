export class getAreaCounterDetailsModel{
    areaData: areaData;
    areaWithCounterData: areaWithCounterData;

    constructor(areaData: areaData, areaWithCounterData: areaWithCounterData)
    {
        this.areaData = areaData;
        this.areaWithCounterData = areaWithCounterData;
    }
}
interface areaData{
    areaId: number;
    areaName: string;
}

interface areaWithCounterData{
    areaId: number;
    areaName: string;
    counterId: number;
    counterName: string;
}