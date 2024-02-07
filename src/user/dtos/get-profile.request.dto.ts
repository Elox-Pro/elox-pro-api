import { IsNotEmpty, IsString } from "class-validator";

export class GetProfileRequestDto {

    @IsString()
    @IsNotEmpty()
    public readonly username: string;
}