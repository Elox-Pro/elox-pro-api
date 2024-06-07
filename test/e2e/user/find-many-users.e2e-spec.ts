import { HttpStatus, INestApplication } from "@nestjs/common"
import { bootstrapTest } from "../test.main";
import { AuthenticationModule } from "@app/authentication/authentication.module";
import { getTestUser } from "../test-helpers/get-test-user.test-helper";
import { CreateRequestFN, createGet } from "../test-helpers/create-request.test-helper";
import * as request from "supertest";
import { UserModule } from "@app/user/user.module";
import { FindManyUsersResponseDto } from "@app/user/dtos/find-many-users/find-many-users.response.dto";

describe("List Users Endpoint", () => {
    const url = "/users/";
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

    describe("Without search term", () => {
        let res: request.Response;
        let body: FindManyUsersResponseDto;
        it("should return HTTP status OK", async () => {
            res = await get({
                page: 1,
                limit: 10
            });
            expect(res.status).toBe(HttpStatus.OK);
            expect(res.body).toBeDefined();
            body = res.body as FindManyUsersResponseDto;
        });
        it("should return 10 users", async () => {
            expect(body.users.length).toBeGreaterThan(0);
            expect(body.users.length).toEqual(10);
        });
    });
    describe("With search term", () => {
        let res: request.Response;
        let body: FindManyUsersResponseDto;
        it("should return HTTP status OK", async () => {
            res = await get({
                page: 1,
                limit: 10,
                searchTerm: "tim-cook"
            });
            expect(res.status).toBe(HttpStatus.OK);
            expect(res.body).toBeDefined();
            body = res.body as FindManyUsersResponseDto;
        });
        it("should return 1 company", async () => {
            expect(body.users.length).toBeGreaterThan(0);
            expect(body.users.length).toEqual(1);
        });
    });

})