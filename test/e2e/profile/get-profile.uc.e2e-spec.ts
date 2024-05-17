import { HttpStatus, INestApplication } from "@nestjs/common";
import { bootstrapTest } from "../test.main";
import { UserModule } from "@app/user/user.module";
import { FindUserByUserNameResponseDto } from "@app/user/dtos/find-user-by-username/find-user-by-username.response.dto";
import { AuthenticationModule } from "@app/authentication/authentication.module";
import { getTestUser } from "../test-helpers/get-test-user.test-helper";
import { CreateRequestFN, createGet } from "../test-helpers/create-request.test-helper";

describe("Get authenticated profile endpoint", () => {
    const url = "/users/profile";
    const user = getTestUser();

    let app: INestApplication;
    let get: CreateRequestFN;

    beforeAll(async () => {
        app = await bootstrapTest([
            AuthenticationModule,
            UserModule
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

    describe("GET: users/profile", () => {
        it("should return HTTP status OK", async () => {
            const res = await get();
            expect(res.status).toBe(HttpStatus.OK);
            expect(res.body).toBeDefined();
            const body = res.body as FindUserByUserNameResponseDto;
            expect(body.user.username).toBe(user.username);
        });
    });
});