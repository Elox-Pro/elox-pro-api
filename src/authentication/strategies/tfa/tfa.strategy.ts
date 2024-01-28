import { Injectable } from "@nestjs/common";
import { TfaDTO } from "src/authentication/dtos/tfa.dto";

@Injectable()
export abstract class TfaStrategy {
    abstract send(tfaDto: TfaDTO): Promise<string>;
    abstract verify(token: string): Promise<boolean>;

} 