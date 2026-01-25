export class MassageModel {
    Id: number;
    Type:number = 1
    Name: string = "";
    Purpose?: string
    Description: string = "";
    BestFor?: string
    Outcome?: string
    Includes?: string
    Duration: string = ""
    Price: number = 0;

    constructor() {
        this.Id = 0;
    }
}