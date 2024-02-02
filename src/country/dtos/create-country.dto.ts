import { IsNumber, IsString } from "class-validator";

export class CreateCountryDTO {

    @IsString()
    readonly name: string;

    @IsString()
    readonly iso2: string;

    @IsNumber()
    readonly e164: number;

    constructor(name: string, iso2: string, e164: number) {
        this.name = name;
        this.iso2 = iso2;
        this.e164 = e164;
    }

}