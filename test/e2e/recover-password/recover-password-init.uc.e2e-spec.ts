import { HttpStatus, INestApplication } from "@nestjs/common";
import { bootstrapTest } from "../test.main";
import * as request from "supertest";
import { RecoverPasswordInitResponseDto } from "@app/recover-password/dtos/recover-password-init/recover-password-init.response.dto";

describe('Recover Password Init Use Case', () => {
    let app: INestApplication;

    beforeAll(async () => {
        app = await bootstrapTest();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('POST: recover-password/init', () => {

        const url = '/recover-password/init';

        describe('username not found', () => {
            it('should return HTTP status Unauthorized', async () => {
                return await request(app.getHttpServer()).post(url).send({
                    "username": "idontknow",
                    "ipClient": "127.0.01",
                    "grecaptchaToken": "<TOKEN>",
                }).expect(HttpStatus.UNAUTHORIZED);
            });
        });

        describe('user not verified', () => {
            it('should return HTTP status Unauthorized', async () => {
                return await request(app.getHttpServer()).post(url).send({
                    "username": "croatia",
                    "ipClient": "127.0.01",
                    "grecaptchaToken": "<TOKEN>",
                }).expect(HttpStatus.UNAUTHORIZED);
            });
        });

        describe('the TFA is pending', () => {
            it('should return HTTP status OK', async () => {
                const res = await request(app.getHttpServer()).post(url).send({
                    "username": "alaska",
                    "ipClient": "127.0.01",
                    "grecaptchaToken": "<TOKEN>",
                });
                expect(res.status).toBe(HttpStatus.OK);
                expect(res.body).toBeDefined();
                const body = res.body as RecoverPasswordInitResponseDto;
                expect(body.isTFAPending).toBeTruthy();
            });
        });

        //TODO: Validate the tfa
    })
})