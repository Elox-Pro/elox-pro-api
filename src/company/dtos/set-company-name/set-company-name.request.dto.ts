import { IsNumber, IsString } from "class-validator/types/decorator/decorators";

export class SetCompanyNameRequestDto {
    @IsString()
    readonly name: string;

    @IsNumber()
    readonly id: number;
}