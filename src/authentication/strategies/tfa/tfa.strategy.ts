import { Injectable } from "@nestjs/common";
import { TfaDto } from "src/authentication/dtos/tfa.dto";

@Injectable()
export abstract class TfaStrategy {
    abstract generate(tfaDto: TfaDto): Promise<boolean>;
    abstract verify(id: string, token: string): Promise<boolean>;
} 