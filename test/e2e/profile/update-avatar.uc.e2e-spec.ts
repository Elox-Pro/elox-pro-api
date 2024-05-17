import { HttpStatus, INestApplication } from "@nestjs/common";
import { bootstrapTest } from "../test.main";
import { AuthenticationModule } from "@app/authentication/authentication.module";
import { UserModule } from "@app/user/user.module";
import { getTestUser } from "../test-helpers/get-test-user.test-helper";
import { CreateRequestFN, createPatch } from "../test-helpers/create-request.test-helper";

describe("Update avatar use case", () => {
    const url = "/users/profile/avatar";
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

    describe("PATCH: users/profile/avatar", () => {
        it("should return HTTP status OK", async () => {
            const res = await patch({
                avatarUrl: "https://api.dicebear.com/8.x/bottts-neutral/svg?seed=Simon"
            });
            expect(res.status).toBe(HttpStatus.OK);
        });
    });
});