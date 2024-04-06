import { IUseCase } from "@app/common/usecase/usecase.interface";
import { Injectable } from "@nestjs/common";
import { UpdateUserRequestDto } from "../dtos/update-user/update-user.request.dto";
import { PrismaService } from "@app/prisma/prisma.service";
import { UpdateUserResponseDto } from "../dtos/update-user/update-user.response.dto";

@Injectable()
export class UpdateUserUC implements IUseCase<UpdateUserRequestDto, UpdateUserResponseDto> {

    constructor(private prisma: PrismaService) { }

    async execute(request: UpdateUserRequestDto): Promise<UpdateUserResponseDto>{
        throw new Error("Method not implemented.");
    }
}