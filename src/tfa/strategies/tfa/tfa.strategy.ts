import { TfaResponseDto } from "@app/tfa/dtos/tfa/tfa.response.dto";
import { Injectable } from "@nestjs/common";
import { TfaRequestDto } from "../../dtos/tfa/tfa.request.dto";

@Injectable()
export abstract class TfaStrategy {
    abstract execute(tfaDto: TfaRequestDto): Promise<boolean>;
    abstract verify(username: string, token: string): Promise<TfaResponseDto>;
} 