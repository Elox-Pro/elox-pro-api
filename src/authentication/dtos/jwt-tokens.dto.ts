export class JwtTokensDto {
    constructor(
        readonly accessToken: string,
        readonly refreshToken: string
    ) {
    }
}