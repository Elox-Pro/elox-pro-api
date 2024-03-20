export class JwtTokensDto {
    constructor(
        readonly accessToken: string,
        readonly refreshToken: string,

        /**
         * Access token TTL in seconds
         */
        readonly accessTokenTTL: number,

        /**
         * Refresh token TTL in seconds
         */
        readonly refreshTokenTTL: number,


    ) {
    }
}