import { TFAResponseDto } from "@app/authentication/dtos/tfa/tfa.response.dto";
import { Injectable } from "@nestjs/common";
import { TFARequestDto } from "authentication/dtos/tfa/tfa.request.dto";

@Injectable()
export abstract class TfaStrategy {
    abstract execute(tfaDto: TFARequestDto): Promise<boolean>;
    abstract verify(username: string, token: string): Promise<TFAResponseDto>;
} 