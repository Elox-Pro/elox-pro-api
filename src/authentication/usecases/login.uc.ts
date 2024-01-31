import { Injectable, UnauthorizedException } from "@nestjs/common";
import { LoginDto } from "src/authentication/dtos/login.dto";
import { IUseCase } from "src/common/usecase/usecase.interface";
import { TokensDto } from "../dtos/tokens.dto";
import { LoginResponseDTO } from "../dtos/login-response.dto";
import { PrismaService } from "../../prisma/prisma.service";
import { HashingStrategy } from "../strategies/hashing/hashing.strategy";
import { TfaFactory } from "../factories/tfa.factory";
import { TfaDto } from "../dtos/tfa.dto";

@Injectable()
export class LoginUC implements IUseCase<LoginDto, LoginResponseDTO> {

    constructor(
        private prisma: PrismaService,
        private hashingService: HashingStrategy,
        private tfaFactory: TfaFactory,
    ) { }

    async execute(login: LoginDto): Promise<LoginResponseDTO> {

        const savedUser = await this.prisma.user.findUnique({
            where: { username: login.username }
        });

        if (!savedUser) {
            throw new UnauthorizedException('Invalid credentials');
        }

        if (!this.hashingService.compare(login.password, savedUser.password)) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const tfaStrategy = this.tfaFactory.getTfaStrategy(savedUser.tfaType);
        if (tfaStrategy) {
            // TODO: queue this job
            await tfaStrategy.generate(new TfaDto(savedUser, login.ipClient));
            return new LoginResponseDTO(null, true);
        }

        // Generate tokens
        return new LoginResponseDTO(new TokensDto(null, null), false);
    }
}