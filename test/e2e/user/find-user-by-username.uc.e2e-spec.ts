import { HttpStatus, INestApplication } from "@nestjs/common";
import { bootstrapTest } from "../test.main";
import { UserModule } from "@app/user/user.module";
import * as request from "supertest";
import { createJwtCookieSession } from "../test-helpers/create-jwt-cookie-session.test-helper";
import { FindUserByUserNameResponseDto } from "@app/user/dtos/find-user-by-username/find-user-by-username.response.dto";
import { AuthenticationModule } from "@app/authentication/authentication.module";


describe("Find User By Username Use Case", () => {
    let app: INestApplication;

    beforeAll(async () => {
        app = await bootstrapTest([
            AuthenticationModule,
            UserModule
        ]);

    });

    afterAll(async () => {
        await app.close();
    });


    describe("GET: users/current", () => {

        const username = "alaska";
        const password = "098lkj!";

        // await authenticateUser(app.getHttpServer(), username, password);
        // it('should authenticated alaska user', async () => {
        //     const res = await request(app.getHttpServer()).post(
        //         "/authentication/login"
        //     ).send({
        //         "username": username,
        //         "password": password,
        //         "ipClient": "127.0.01",
        //         "grecaptchaToken": "<TOKEN>"
        //     });
        //     expect(res.status).toBe(HttpStatus.OK);
        //     expect(res.body).toBeDefined();

        //     const body = res.body as LoginResponseDto;

        //     expect(body.tokens).toBeUndefined();
        //     expect(body.isTFAPending).toBeFalsy();
        // });

        it("should return HTTP status OK", async () => {

            // let res = await request(app.getHttpServer()).post(
            //     "/authentication/login"
            // ).send({
            //     "username": username,
            //     "password": password,
            //     "ipClient": "127.0.01",
            //     "grecaptchaToken": "<TOKEN>"
            // })
            // expect(res.status).toBe(HttpStatus.OK);
            // expect(res.body).toBeDefined();

            // let body = res.body as LoginResponseDto;

            // expect(body.tokens).toBeUndefined();
            // expect(body.isTFAPending).toBeFalsy();

            // const cookies = res.headers['set-cookie']
            // console.log('cookies', cookies)
            const cookies = await createJwtCookieSession(app.getHttpServer(), username, password);

            const url = "/users/current";

            const res = await request(app.getHttpServer())
                .get(url)
                .set('Cookie', cookies)
                .send();
            expect(res.status).toBe(HttpStatus.OK);
            expect(res.body).toBeDefined();
            const body2 = res.body as FindUserByUserNameResponseDto;
            expect(body2.user.username).toBe(username);
        });
    });
});