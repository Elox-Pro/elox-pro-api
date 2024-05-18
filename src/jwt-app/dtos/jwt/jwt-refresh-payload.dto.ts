export class JwtRefreshPayloadDto {
    constructor(
        /**
         * The username
         */
        readonly username: string,

        readonly refreshTokenId: string
    ) {
    }
}