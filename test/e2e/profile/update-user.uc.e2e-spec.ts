import { HttpStatus, INestApplication } from "@nestjs/common";
import { bootstrapTest } from "../test.main";
import { AuthenticationModule } from "@app/authentication/authentication.module";
import { UserModule } from "@app/user/user.module";
import { Gender } from "@prisma/client";
import { getTestUser } from "../test-helpers/get-test-user.test-helper";
import { CreateRequestFN, createPatch } from "../test-helpers/create-request.test-helper";

describe("Update user Use Case", () => {
    const url = "/users/profile";
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

    describe("PATCH: users/current", () => {
        it("should return HTTP status OK", async () => {
            const res = await patch({
                firstName: "Yadir E",
                lastName: "Quintero R",
                gender: Gender.MALE
            });
            expect(res.status).toBe(HttpStatus.OK);
        });
    });
});