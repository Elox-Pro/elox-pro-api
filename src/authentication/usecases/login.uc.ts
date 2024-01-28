import { Injectable, UnauthorizedException } from "@nestjs/common";
import { LoginDTO } from "src/authentication/dtos/login.dto";
import { IUseCase } from "src/common/usecase/usecase.interface";
import { TokensDto } from "../dtos/tokens.dto";
import { LoginResponseDTO } from "../dtos/login-response.dto";
import { PrismaService } from "../../prisma/prisma.service";
import { HashingService } from "../services/hashing.service";
import { TfaFactory } from "../factories/tfa.factory";
import { TfaDTO } from "../dtos/tfa.dto";

@Injectable()
export class LoginUC implements IUseCase<LoginDTO, LoginResponseDTO> {

    constructor(
        private prisma: PrismaService,
        private hashingService: HashingService,
        private tfaFactory: TfaFactory,
    ) { }

    async execute(login: LoginDTO): Promise<LoginResponseDTO> {

        const savedUser = await this.prisma.user.findUnique({
            where: { username: login.username }
        });

        if (!savedUser) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // if (!savedUser.emailVerified) {
        //     throw new UnauthorizedException('Email not verified');
        // }

        if (!this.hashingService.compare(login.password, savedUser.password)) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const tfa = this.tfaFactory.getTfa(savedUser.tfaType);
        if (tfa) {
            await tfa.send(new TfaDTO({
                email: savedUser.email,
                username: savedUser.username,
            }));
        }

        // Generate tokens
        // Generate and send TFA

        return new LoginResponseDTO(new TokensDto('', ''), false);
    }
}