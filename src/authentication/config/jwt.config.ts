import { Injectable } from "@nestjs/common";

@Injectable()
export class JwtConfig {
    public readonly SECRET = process.env.JWT_SECRET || 'yonaxaQUq1eol2c3VC1ZjNRf7hC0TbKQ73';
    public readonly AUDIENCE = process.env.JWT_AUDIENCE || 'localhost:3000';
    public readonly ISSUER = process.env.JWT_ISSUER || 'localhost:3000';
    public readonly ACCESS_TOKEN_TTL = parseInt(process.env.ACCESS_TOKEN_TTL) || 3600;
    public readonly REFRESH_TOKEN_TTL = parseInt(process.env.REFRESH_TOKEN_TTL) || 86400;
}