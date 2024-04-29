import { HttpStatus, INestApplication } from "@nestjs/common";
import { bootstrapTest } from "../test.main";
import { AuthenticationModule } from "@app/authentication/authentication.module";
import { UserModule } from "@app/user/user.module";
import { createJwtCookieSession } from "../test-helpers/create-jwt-cookie-session.test-helper";
import * as request from "supertest";
import { UpdatePhoneRequestDto } from "@app/user/dtos/update-phone/update-phone.request.dto";
import { UpdatePhoneResponseDto } from "@app/user/dtos/update-phone/update-phone.response.dto";

describe("Update phone use case", () => {
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

    describe("PATCH: users/profile/phone", () => {
        const username = "alaska";
        const password = "098lkj!";
        const url = "/users/profile/phone";

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

            const res = await request(app.getHttpServer())
                .patch(url)
                .set('Cookie', cookies)
                .send({
                    phone: "0987654321",
                } as UpdatePhoneRequestDto);

            expect(res.status).toBe(HttpStatus.OK);
            expect(res.body).toBeDefined();
            const body = res.body as UpdatePhoneResponseDto;
            expect(body.OK).toBe(true);
            expect(HttpStatus.OK).toBe(res.status);
        });

    });
});