import { Injectable } from "@nestjs/common";
import { TFAResponseDto } from "authentication/dtos/tfa.response.dto";

@Injectable()
export abstract class TfaStrategy {
    abstract execute(tfaDto: TFAResponseDto): Promise<boolean>;
    abstract verify(username: string, token: string): Promise<boolean>;
} 