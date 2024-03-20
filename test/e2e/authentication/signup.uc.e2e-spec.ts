import { HttpStatus, INestApplication } from "@nestjs/common";
import { bootstrapTest } from "../test.main";
import * as request from "supertest";

describe('signup Use Case', () => {
    let app: INestApplication;

    beforeAll(async () => {
        app = await bootstrapTest();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('POST: authentication/signup', () => {
        const url = '/authentication/signup';
        describe('successful signup', () => {
            it('should return HTTP status CREATED', async () => {
                return await request(app.getHttpServer()).post(url).send({
                    "username": `user:${Date.now()}`,
                    "email": `yhonax.qrz+${Date.now()}@gmail.com`,
                    "password1": "1234",
                    "password2": "1234",
                    "ipClient": "127.0.01",
                    "grecaptchaToken": "<TOKEN>",
                }).expect(HttpStatus.CREATED);
            });
        });
        describe('wrong username', () => {
            it('should return HTTP status bad request', async () => {
                return await request(app.getHttpServer()).post(url).send({
                    "username": "alaska",
                    "email": "yhonax.qrz@gmail.com",
                    "password1": "1234",
                    "password2": "1234",
                    "ipClient": "127.0.01",
                    "grecaptchaToken": "<TOKEN>",
                }).expect(HttpStatus.BAD_REQUEST);
            });
        });
        describe('wrong email', () => {
            it('should return HTTP status bad request', async () => {
                return await request(app.getHttpServer()).post(url).send({
                    "username": `user:${Date.now()}`,
                    "email": "yhonax.qrz@gmail.com",
                    "password1": "1234",
                    "password2": "1234",
                    "ipClient": "127.0.01",
                    "grecaptchaToken": "<TOKEN>",
                }).expect(HttpStatus.BAD_REQUEST);
            });
        });

        describe('password1 and password2 do not match', () => {
            it('should return HTTP status bad request', async () => {
                return await request(app.getHttpServer()).post(url).send({
                    "username": `user:${Date.now()}`,
                    "email": `yhonax.qrz+${Date.now()}@gmail.com`,
                    "password1": "123",
                    "password2": "1234",
                    "ipClient": "127.0.01",
                    "grecaptchaToken": "<TOKEN>",
                }).expect(HttpStatus.BAD_REQUEST);
            });
        });
    });
});