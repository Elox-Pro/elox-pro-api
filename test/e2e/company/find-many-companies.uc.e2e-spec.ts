import { HttpStatus, INestApplication } from "@nestjs/common"
import { bootstrapTest } from "../test.main";
import { AuthenticationModule } from "@app/authentication/authentication.module";
import { AvatarModule } from "@app/avatar/avatar.module";
import { getTestUser } from "../test-helpers/get-test-user.test-helper";
import { CreateRequestFN, createGet } from "../test-helpers/create-request.test-helper";
import { CompanyModule } from "@app/company/company.module";

describe("List Companies Endpoint", () => {
    const url = "/companies/";
    const user = getTestUser();

    let app: INestApplication;
    let get: CreateRequestFN;

    beforeAll(async () => {
        app = await bootstrapTest([
            AuthenticationModule,
            CompanyModule
        ]);
        get = createGet({
            app, url, credentials: {
                username: user.username,
                password: user.password
            }
        });
    });

    afterAll(async () => {
        await app.close();
    });

    describe("GET: companies/", () => {
        it("should return HTTP status OK", async () => {
            const res = await get();
            expect(res.status).toBe(HttpStatus.OK);
            expect(res.body).toBeDefined();
        });
    });
})