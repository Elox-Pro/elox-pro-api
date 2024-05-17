import { HttpStatus, INestApplication } from "@nestjs/common";
import { bootstrapTest } from "../test.main";
import { AuthenticationModule } from "@app/authentication/authentication.module";
import { UserModule } from "@app/user/user.module";
import { createJwtCookieSession } from "../test-helpers/create-jwt-cookie-session.test-helper";
import * as request from "supertest";
import { UpdateGenderRequestDto } from "@app/user/dtos/update-gender/update-gender.request.dto";
import { Gender } from "@prisma/client";
import { UpdateGenderResponseDto } from "@app/user/dtos/update-gender/update-gender.response.dto";
import { getTestUser } from "../test-helpers/get-test-user.test-helper";
import { CreateRequestFN, createPatch } from "../test-helpers/create-request.test-helper";

describe("Update gender use case", () => {
    const url = "/users/profile/gender";
    const user = getTestUser();

    let app: INestApplication;
    let patch: CreateRequestFN;

    beforeAll(async () => {
        app = await bootstrapTest([
            AuthenticationModule,
            UserModule
        ]);
        patch = createPatch({
            app, url, credentials: {
                username: user.username,
                password: user.password
            }
        });
    });

    afterAll(async () => {
        await app.close();
    });
    describe("PATCH: users/profile/gender", () => {
        it("should return HTTP status OK", async () => {
            const res = await patch({ gender: Gender.MALE });
            expect(res.status).toBe(HttpStatus.OK);
        });
    });
});