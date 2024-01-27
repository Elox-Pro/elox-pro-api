import { Injectable, UnauthorizedException } from "@nestjs/common";
import { LoginDTO } from "src/authentication/dto/login.dto";
import { HashingService } from "../../../../src/common/hashing/hashing.service";
import { IUseCase } from "src/common/usecase/interfaces/usecase.interface";
import { PrismaService } from "../../../../src/prisma/prisma.service";
import { LoginResponseDTO } from "src/authentication/dto/login-response.dto";
import { TokensDto } from "src/authentication/dto/tokens.dto";

@Injectable()
export class LoginUC implements IUseCase<LoginDTO, LoginResponseDTO> {

    constructor(
        private prisma: PrismaService,
        private hashingService: HashingService,
    ) { }

    async execute(login: LoginDTO): Promise<LoginResponseDTO> {

        const savedUser = await this.prisma.user.findUnique({
            where: { username: login.username }
        });

        if (!savedUser) {
            throw new UnauthorizedException('Invalid credentials');
        }

        if (!savedUser.emailVerified) {
            throw new UnauthorizedException('Email not verified');
        }

        if (!this.hashingService.compare(login.password, savedUser.password)) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Generate tokens
        // Generate and send TFA

        return new LoginResponseDTO(new TokensDto('', ''), false);
    }
}