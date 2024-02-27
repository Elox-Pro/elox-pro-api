import { Injectable } from "@nestjs/common";

@Injectable()
export class JwtConfig {
    public readonly SECRET = process.env.JWT_SECRET || 'yonaxaQUq1eol2c3VC1ZjNRf7hC0TbKQ73';
    public readonly AUDIENCE = process.env.JWT_AUDIENCE || 'localhost:3000';
    public readonly ISSUER = process.env.JWT_ISSUER || 'localhost:3000';

    // Define how long the access token should be valid for (in seconds)
    public readonly ACCESS_TOKEN_TTL = parseInt(process.env.JWT_ACCESS_TOKEN_TTL) || 3600;

    // Define how long the refresh token should be valid for (in seconds)
    public readonly REFRESH_TOKEN_TTL = parseInt(process.env.JWT_REFRESH_TOKEN_TTL) || 7200;

    // It defines a predefined time window in seconds before the access token's actual expiry
    // during which the application proactively initiates a refresh process.
    public readonly BUFFER_TIME = parseInt(process.env.JWT_BUFFER_TIME) || 3300;
}