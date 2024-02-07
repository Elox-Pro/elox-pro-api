import { Controller, HttpStatus, HttpCode, Body, Get } from "@nestjs/common";
import { GetProfileUC } from "../usecases/get-profile.uc";
import { GetProfileRequestDto } from "../dtos/get-profile.request.dto";
import { GetProfileResponseDto } from "../dtos/get-profile.response.dto";

@Controller('user')
export class UserController {

    constructor(
        private getProfileUC: GetProfileUC,
    ) { }

    @HttpCode(HttpStatus.OK)
    @Get('/profile')
    getProfile(@Body() dto: GetProfileRequestDto): Promise<GetProfileResponseDto> {
        return this.getProfileUC.execute(dto);
    }

}