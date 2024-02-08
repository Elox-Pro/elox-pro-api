export class JwtRefreshPayloadDto {
    constructor(
        readonly userId: number,
        readonly refreshTokenId: string
    ) { }
}