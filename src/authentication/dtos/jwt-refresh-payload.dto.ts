export class JwtRefreshPayloadDto {
    constructor(
        /**
         * The sub is the username
         */
        readonly sub: string,

        readonly refreshTokenId: string
    ) { }
}