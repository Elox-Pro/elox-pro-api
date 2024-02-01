import { Injectable } from "@nestjs/common";
import { JwtInputDto } from "src/authentication/dtos/jwt-input.dto";
import { JwtOutputDto } from "src/authentication/dtos/jwt-output.dto";

@Injectable()
export abstract class JwtStrategy {
    abstract generate(jwtInputDto: JwtInputDto): Promise<JwtOutputDto>;

    abstract verify(token: string): Promise<JwtOutputDto>;
}