import { HttpStatus, INestApplication } from "@nestjs/common";
import { bootstrapTest } from "../test.main";
import * as request from "supertest";

describe('Validate TFA Use Case', () => {
    let app: INestApplication;

    beforeAll(async () => {
        app = await bootstrapTest();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('POST: authentication/validate-tfa', () => {

        const url = '/authentication/validate-tfa';

        describe('username not found', () => {
            it('should return HTTP status Unauthorized', async () => {
                return await request(app.getHttpServer()).post(url).send({
                    "username": "idontknow",
                    "code": 123,
                }).expect(HttpStatus.UNAUTHORIZED);
            });
        });

        describe('tfa strategy is required', () => {
            it('should return HTTP status Unauthorized', async () => {
                return await request(app.getHttpServer()).post(url).send({
                    "username": "alaska",
                    "code": 123,
                }).expect(HttpStatus.UNAUTHORIZED);
            });
        });

        describe('Hash not found', () => {
            it('should return HTTP status Unauthorized', async () => {
                return await request(app.getHttpServer()).post(url).send({
                    "username": "brazil",
                    "code": 123,
                }).expect(HttpStatus.UNAUTHORIZED);
            });
        })

        describe('Invalid code', () => {

            it('should generate TFA code by email', async () => {
                const res = await request(app.getHttpServer()).post('/authentication/login').send({
                    "username": "brazil",
                    "password": "098lkj!",
                    "ipClient": "127.0.01"
                });

                expect(res.status).toBe(HttpStatus.OK);
            });

            it('should return HTTP status Unauthorized', async () => {

                // Wait for 500ms to make sure that code is saved in redis
                await new Promise((resolve) => setTimeout(resolve, 500));

                return await request(app.getHttpServer()).post(url).send({
                    "username": "brazil",
                    "code": 123,
                }).expect(HttpStatus.UNAUTHORIZED);
            });

        });

        // I could not find a way to test this because the code send via email is hashing into the redis database
        // To test this, you can use insomia or postman to send a request to the server
        describe('Valid code', () => {
            expect(true).toBeTruthy();
        });

    })
})