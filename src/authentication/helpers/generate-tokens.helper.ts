import { Injectable } from "@nestjs/common";
import { GenerateTokensDTO } from "src/authentication/dtos/generate-tokens.dto";
import { TokensDto } from "src/authentication/dtos/tokens.dto";
import { IUseCase } from "src/common/usecase/usecase.interface";

@Injectable()
export class GenerateTokensUC implements IUseCase<GenerateTokensDTO, TokensDto> {
    execute(data: GenerateTokensDTO): Promise<TokensDto> {
        throw new Error("Method not implemented.");
    }
}
