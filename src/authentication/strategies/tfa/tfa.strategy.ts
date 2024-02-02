import { Injectable } from "@nestjs/common";
import { TfaDto } from "authentication/dtos/tfa.dto";

@Injectable()
export abstract class TfaStrategy {
    abstract execute(tfaDto: TfaDto): Promise<boolean>;
    abstract verify(id: string, token: string): Promise<boolean>;
} 