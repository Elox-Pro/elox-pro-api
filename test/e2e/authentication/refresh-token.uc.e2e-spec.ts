import { HttpStatus, INestApplication } from "@nestjs/common";
import { bootstrapTest } from "../test.main";
import * as request from "supertest";
import { LoginResponseDto } from "@app/authentication/dtos/login.response.dto";
import { JwtTokensDto } from "@app/authentication/dtos/jwt-tokens.dto";
import { RefreshTokenResponseDto } from "@app/authentication/dtos/refresh-token.response.dto";

describe('Refresh Token Use Case', () => {
    let app: INestApplication;

    beforeAll(async () => {
        app = await bootstrapTest();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('POST: authentication/refresh-token', () => {
        const url = '/authentication/refresh-token';
        let tokens: JwtTokensDto;

        it('should generate jwt tokens', async () => {
            const res = await request(app.getHttpServer()).post(
                '/authentication/login'
            ).send({
                "username": "alaska",
                "password": "098lkj!",
                "ipClient": "127.0.01"
            });
            expect(res.status).toBe(HttpStatus.OK);
            expect(res.body).toBeDefined();

            const body = res.body as LoginResponseDto;
            tokens = body.tokens;
            expect(tokens).toBeDefined();
            expect(body.isTFAPending).toBeFalsy();
        });

        it('should refresh tokens', async () => {
            const res = await request(app.getHttpServer()).post(url).send({
                "refreshToken": tokens.refreshToken,
            });
            expect(res.status).toBe(HttpStatus.OK);
            expect(res.body).toBeDefined();

            const body = res.body as RefreshTokenResponseDto;

            expect(body.tokens).toBeDefined();
            expect(body.tokens.accessToken).toBeDefined();
            expect(body.tokens.refreshToken).toBeDefined();
        });

        it('should throw UnauthorizedException', async () => {
            const res = await request(app.getHttpServer()).post(url).send({
                "refreshToken": tokens.refreshToken,
            });
            expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
        });
    });
});