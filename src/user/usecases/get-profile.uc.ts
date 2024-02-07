import { IUseCase } from "@app/common/usecase/usecase.interface";
import { GetProfileRequestDto } from "../dtos/get-profile.request.dto";
import { GetProfileResponseDto } from "../dtos/get-profile.response.dto";
import { Injectable } from "@nestjs/common";
import { PrismaService } from "@app/prisma/prisma.service";

@Injectable()
export class GetProfileUC implements IUseCase<GetProfileRequestDto, GetProfileResponseDto> {

    constructor(private prisma: PrismaService) { }

    execute(data: GetProfileRequestDto): Promise<GetProfileResponseDto> {
        throw new Error("Method not implemented.");
    }
}