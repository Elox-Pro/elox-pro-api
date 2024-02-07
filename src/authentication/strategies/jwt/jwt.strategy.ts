import { Injectable } from "@nestjs/common";
import { JwtRequestDto } from "authentication/dtos/jwt.request.dto";
import { JwtResponseDto } from "authentication/dtos/jwt.response.dto";

@Injectable()
export abstract class JwtStrategy {
    abstract generate(jwtRequest: JwtRequestDto): Promise<JwtResponseDto>;

    abstract verify(token: string): Promise<JwtResponseDto>;
}