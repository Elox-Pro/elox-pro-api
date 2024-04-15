import { HttpStatus, INestApplication } from "@nestjs/common"
import { bootstrapTest } from "../test.main";
import { AuthenticationModule } from "@app/authentication/authentication.module";
import { AvatarModule } from "@app/avatar/avatar.module";
import { createJwtCookieSession } from "../test-helpers/create-jwt-cookie-session.test-helper";
import * as request from "supertest";
import { FindManyAvatarsResponsetDto } from "@app/avatar/dto/find-many-avatars/find-many-avatars.response.dto";

describe("Find Many Avatar Use Case", () => {
    let app: INestApplication;

    beforeAll(async () => {
        app = await bootstrapTest([
            AuthenticationModule,
            AvatarModule
        ]);
    });

    afterAll(async () => {
        await app.close();
    });

    describe("GET: avatars/", () => {
        const username = "alaska";
        const password = "098lkj!";

        it("should return HTTP status OK", async () => {

            const cookies = await createJwtCookieSession(app.getHttpServer(), username, password);
            const url = "/avatars/";
            const res = await request(app.getHttpServer())
                .get(url)
                .set("Cookie", cookies)
                .send();

            expect(res.status).toBe(HttpStatus.OK);
            expect(res.body).toBeDefined();
            const body = res.body as FindManyAvatarsResponsetDto;
            expect(body.avatars.length).toBeGreaterThan(0);
        });
    });
})