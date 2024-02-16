export class JwtTokensDto {
    constructor(
        readonly accessToken: string,
        readonly refreshToken: string,
        readonly refreshTokenTTL: number,
    ) {
    }
}