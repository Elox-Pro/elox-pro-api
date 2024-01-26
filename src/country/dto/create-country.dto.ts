import { IsNumber, IsString } from "class-validator";

export class CreateCountryDTO {

    @IsString()
    readonly name: string;

    @IsString()
    readonly iso2: string;

    @IsNumber()
    readonly e164: number;

}