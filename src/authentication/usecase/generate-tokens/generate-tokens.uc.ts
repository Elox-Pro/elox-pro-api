import { Injectable } from "@nestjs/common";
import { GenerateTokensDTO } from "src/authentication/dto/generate-tokens.dto";
import { TokensDto } from "src/authentication/dto/tokens.dto";
import { IUseCase } from "src/common/usecase/interfaces/usecase.interface";

@Injectable()
export class GenerateTokensUC implements IUseCase<GenerateTokensDTO, TokensDto> {
    execute(data: GenerateTokensDTO): Promise<TokensDto> {
        throw new Error("Method not implemented.");
    }
}
