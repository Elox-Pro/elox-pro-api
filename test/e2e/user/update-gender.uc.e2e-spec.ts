import { HttpStatus, INestApplication } from "@nestjs/common";
import { bootstrapTest } from "../test.main";
import { AuthenticationModule } from "@app/authentication/authentication.module";
import { UserModule } from "@app/user/user.module";
import { createJwtCookieSession } from "../test-helpers/create-jwt-cookie-session.test-helper";
import * as request from "supertest";
import { UpdateNameRequestDto } from "@app/user/dtos/update-name/update-name.request.dto";
import { UpdateNameResponseDto } from "@app/user/dtos/update-name/update-name.responde.dto";
import { UpdateGenderRequestDto } from "@app/user/dtos/update-gender/update-gender.request.dto";
import { Gender } from "@prisma/client";
import { UpdateGenderResponseDto } from "@app/user/dtos/update-gender/update-gender.response.dto";

describe("Update gender use case", () => {
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

    describe("PATCH: users/profile/gender", () => {
        const username = "alaska";
        const password = "098lkj!";
        const url = "/users/profile/gender";

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
                    gender: Gender.MALE,
                } as UpdateGenderRequestDto);

            expect(res.status).toBe(HttpStatus.OK);
            expect(res.body).toBeDefined();
            const body = res.body as UpdateGenderResponseDto;
            expect(body.OK).toBe(true);
            expect(HttpStatus.OK).toBe(res.status);
        });

    });
});