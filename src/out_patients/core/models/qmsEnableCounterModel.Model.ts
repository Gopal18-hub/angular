export class qmsEnableCounterModel{
    hspLocationId: number;
    areaId: number;
    counterId: number;
    userId: number;
    flag: number

    constructor(hspLocationId: number, areaId: number, counterId: number, userId: number, flag: number)
    {
        this.hspLocationId = hspLocationId;
        this.areaId = areaId;
        this.counterId = counterId;
        this.userId = userId;
        this.flag = flag;
    }
}