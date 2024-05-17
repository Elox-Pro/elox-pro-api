import { HttpStatus, INestApplication } from "@nestjs/common";
import { bootstrapTest } from "../test.main";
import { AuthenticationModule } from "@app/authentication/authentication.module";
import { UserModule } from "@app/user/user.module";
import { createJwtCookieSession } from "../test-helpers/create-jwt-cookie-session.test-helper";
import * as request from "supertest";
import { UpdateUserResponseDto } from "@app/user/dtos/update-user/update-user.response.dto";
import { Gender, UserLang, UserTheme } from "@prisma/client";

describe("Update user Use Case", () => {
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

    describe("PATCH: users/current", () => {
        const username = "alaska";
        const password = "098lkj!";
        const url = "/users/profile";

        let cookies: string;

        it("should authenticate the user", async () => {
            cookies = await createJwtCookieSession(
                app.getHttpServer(),
                username,
                password
            );

            expect(cookies).toBeDefined();
        });

        // it("should return HTTP status Bad Request if TFA Type is SMS", async () => {

        //     const res = await request(app.getHttpServer())
        //         .patch(url)
        //         .set('Cookie', cookies)
        //         .send({
        //             firstName: "Alaska",
        //             lastName: "User",
        //             gender: Gender.MALE,
        //             lang: UserLang.EN,
        //             theme: UserTheme.DARK
        //         });

        //     expect(res.status).toBe(HttpStatus.BAD_REQUEST);
        // });

        it("should return HTTP status OK", async () => {

            const res = await request(app.getHttpServer())
                .patch(url)
                .set('Cookie', cookies)
                .send({
                    firstName: "Alaska",
                    lastName: "User",
                    gender: Gender.MALE,
                    lang: UserLang.EN,
                    theme: UserTheme.DARK
                });

            expect(res.status).toBe(HttpStatus.OK);
            expect(res.body).toBeDefined();
            const body = res.body as UpdateUserResponseDto;
            expect(body.OK).toBe(true);
        });
    });
});