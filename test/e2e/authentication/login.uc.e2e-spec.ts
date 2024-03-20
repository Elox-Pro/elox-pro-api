import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { bootstrapTest } from '../test.main';
import { LoginResponseDto } from '@app/authentication/dtos/login/login.response.dto';

describe('Login Use Case', () => {
    let app: INestApplication;

    beforeAll(async () => {
        app = await bootstrapTest();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('POST: authentication/login', () => {
        const url = '/authentication/login';
        describe('wrong password', () => {
            it('should return HTTP status bad request', async () => {
                return await request(app.getHttpServer()).post(url).send({
                    "username": "yonax73",
                    "password": "idontknow",
                    "ipClient": "127.0.01"
                }).expect(HttpStatus.BAD_REQUEST);
            });
        });

        describe('wrong username', () => {
            it('should return HTTP status bad request', async () => {
                return await request(app.getHttpServer()).post(url).send({
                    "username": "idontknow",
                    "password": "098lkj!",
                    "ipClient": "127.0.01"
                }).expect(HttpStatus.BAD_REQUEST);
            });
        });

        describe('tfa - Type: NONE', () => {
            it('should return HTTP status OK', async () => {
                const res = await request(app.getHttpServer()).post(url).send({
                    "username": "alaska",
                    "password": "098lkj!",
                    "ipClient": "127.0.01"
                });
                expect(res.status).toBe(HttpStatus.OK);
                expect(res.body).toBeDefined();

                const body = res.body as LoginResponseDto;

                expect(body.tokens).toBeNull();
                expect(body.isTFAPending).toBeFalsy();
            });
        });

        describe('tfa - Type: EMAIL', () => {
            it('should return HTTP status OK', async () => {
                const res = await request(app.getHttpServer()).post(url).send({
                    "username": "brazil",
                    "password": "098lkj!",
                    "ipClient": "127.0.01"
                });

                expect(res.status).toBe(HttpStatus.OK);
                expect(res.body).toBeDefined();

                const body = res.body as LoginResponseDto;

                expect(body.tokens).toBeNull();
                expect(body.isTFAPending).toBeTruthy();
            });
        });
    });

});