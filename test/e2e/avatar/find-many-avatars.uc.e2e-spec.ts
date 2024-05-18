import { HttpStatus, INestApplication } from "@nestjs/common"
import { bootstrapTest } from "../test.main";
import { AuthenticationModule } from "@app/authentication/authentication.module";
import { AvatarModule } from "@app/avatar/avatar.module";
import { FindManyAvatarsResponsetDto } from "@app/avatar/dto/find-many-avatars/find-many-avatars.response.dto";
import { getTestUser } from "../test-helpers/get-test-user.test-helper";
import { CreateRequestFN, createGet } from "../test-helpers/create-request.test-helper";

describe("Find Many Avatar Use Case", () => {
    const url = "/avatars/";
    const user = getTestUser();

    let app: INestApplication;
    let get: CreateRequestFN;

    beforeAll(async () => {
        app = await bootstrapTest([
            AuthenticationModule,
            AvatarModule
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

    describe("GET: avatars/", () => {
        it("should return HTTP status OK", async () => {
            const res = await get();
            expect(res.status).toBe(HttpStatus.OK);
            expect(res.body).toBeDefined();
            const body = res.body as FindManyAvatarsResponsetDto;
            expect(body.avatars.length).toBeGreaterThan(0);
        });
    });
})