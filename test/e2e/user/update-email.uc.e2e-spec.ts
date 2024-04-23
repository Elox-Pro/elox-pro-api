import { HttpStatus, INestApplication } from "@nestjs/common";
import { bootstrapTest } from "../test.main";
import { AuthenticationModule } from "@app/authentication/authentication.module";
import { UserModule } from "@app/user/user.module";
import { createJwtCookieSession } from "../test-helpers/create-jwt-cookie-session.test-helper";
import * as request from "supertest";
import { UpdateEmailRequestDto } from "@app/user/dtos/update-email/update-email-request.dto";
import { UpdateEmailResponseDto } from "@app/user/dtos/update-email/update-email-response.dto";

describe("Update email use case", () => {
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

    describe("PATCH: users/profile/email", () => {
        const username = "alaska";
        const password = "098lkj!";
        const url = "/users/profile/email";

        let cookies: string;

        it("should authenticate the user", async () => {
            cookies = await createJwtCookieSession(
                app.getHttpServer(),
                username,
                password
            );

            expect(cookies).toBeDefined();
        });

        it("should return HTTP status OK", async () => {

            const ramdon = Math.floor(Math.random() * 9000) + 1000;

            const res = await request(app.getHttpServer())
                .patch(url)
                .set('Cookie', cookies)
                .send({
                    email: `yhonax.qrz+${ramdon}@gmail.com`,
                    ipClient: `127.0.0.1`
                } as UpdateEmailRequestDto);

            expect(res.status).toBe(HttpStatus.OK);
            expect(res.body).toBeDefined();
            const body = res.body as UpdateEmailResponseDto;
            expect(body.isTFAPending).toBe(true);
            expect(HttpStatus.OK).toBe(res.status);
        });

        it("should return HTTP status BAD REQUEST", async () => {
            const res = await request(app.getHttpServer())
                .patch(url)
                .set('Cookie', cookies)
                .send({
                    email: "yhonax.qrz@gmail.com",
                    ipClient: `127.0.0.1`
                } as UpdateEmailRequestDto);

            expect(res.status).toBe(HttpStatus.BAD_REQUEST);
        });

    });
});