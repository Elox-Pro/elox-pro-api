import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { bootstrapTest } from '../test.main';
import { LoginResponseDto } from '@app/authentication/dtos/login/login.response.dto';
import { AuthenticationModule } from '@app/authentication/authentication.module';
import { getTestUser } from '../test-helpers/get-test-user.test-helper';
import { PrismaService } from '@app/prisma/prisma.service';
import { resetUser } from '../test-helpers/reset-user.test-helper';
import { createPost } from '../test-helpers/create-request.test-helper';

describe('Login Use Case', () => {
    const url = '/authentication/login';
    const user = getTestUser();

    let app: INestApplication;
    let prisma: PrismaService;
    let post: (data: any) => Promise<request.Response>;

    beforeAll(async () => {

        app = await bootstrapTest([
            AuthenticationModule
        ]);

        prisma = app.get(PrismaService);

        post = createPost({ app, url });
    });

    afterAll(async () => {
        await resetUser(prisma, user);
        await app.close();
    });

    describe('POST: authentication/login', () => {
        describe('wrong password', () => {
            it('should return HTTP status bad request', async () => {
                const res = await post({
                    "username": user.username,
                    "password": "idontknow",
                    "grecaptchaToken": "<TOKEN>",
                })
                expect(res.status).toBe(HttpStatus.BAD_REQUEST);
            });
        });

        describe('wrong username', () => {
            it('should return HTTP status bad request', async () => {
                const res = await post({
                    "username": "idontknow",
                    "password": user.password,
                    "grecaptchaToken": "<TOKEN>"
                });
                expect(res.status).toBe(HttpStatus.BAD_REQUEST);
            });
        });

        describe('tfa - Type: NONE', () => {
            it('should return HTTP status OK', async () => {
                const res = await post({
                    "username": user.username,
                    "password": user.password,
                    "grecaptchaToken": "<TOKEN>"
                });

                expect(res.status).toBe(HttpStatus.OK);
                expect(res.body).toBeDefined();

                const body = res.body as LoginResponseDto;

                expect(body.tokens).toBeUndefined();
                expect(body.isTFAPending).toBeFalsy();
            });
        });

        // describe('tfa - Type: EMAIL', () => {
        //     it('should return HTTP status OK', async () => {
        //         const res = await request(app.getHttpServer()).post(url).send({
        //             "username": "brazil",
        //             "password": "098lkj!",
        //             "ipClient": "127.0.01",
        //             "grecaptchaToken": "<TOKEN>"
        //         });

        //         expect(res.status).toBe(HttpStatus.OK);
        //         expect(res.body).toBeDefined();

        //         const body = res.body as LoginResponseDto;

        //         expect(body.tokens).toBeUndefined();
        //         expect(body.isTFAPending).toBeTruthy();
        //     });
        // });
    });

});
