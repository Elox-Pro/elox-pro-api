export class TokensDto {
    public readonly accessToken: string;
    public readonly refreshToken: string;

    constructor(accessToken: string, refreshToken: string) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }
}