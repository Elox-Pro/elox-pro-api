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

        it("should return HTTP status OK", async () => {

            const cookies = await createJwtCookieSession(app.getHttpServer(), username, password);
            const url = "/users/current";
            const res = await request(app.getHttpServer())
                .get(url)
                .set('Cookie', cookies)
                .send();

            expect(res.status).toBe(HttpStatus.OK);
            expect(res.body).toBeDefined();
            const body = res.body as FindUserByUserNameResponseDto;
            expect(body.user.username).toBe(username);
        });
    });
});