import { HttpStatus, INestApplication } from "@nestjs/common"
import { bootstrapTest } from "../test.main";
import { AuthenticationModule } from "@app/authentication/authentication.module";
import { getTestUser } from "../test-helpers/get-test-user.test-helper";
import { CreateRequestFN, createPost } from "../test-helpers/create-request.test-helper";
import * as request from "supertest";
import { CompanyModule } from "@app/company/company.module";
import { FindManyUsersResponseDto } from "@app/company/dtos/find-many-users/find-many-users.response.dto";
import { PrismaService } from "@app/prisma/prisma.service";
import { Company } from "@prisma/client";

describe("Find many users that does not belong to company Endpoint", () => {
    const url = "/companies/find-many/users";
    const user = getTestUser();

    let app: INestApplication;
    let post: CreateRequestFN;
    let prisma: PrismaService;
    let company: Company;

    beforeAll(async () => {
        app = await bootstrapTest([
            AuthenticationModule,
            CompanyModule
        ]);
        post = createPost({
            app, url, credentials: {
                username: user.username,
                password: user.password
            }
        });
        prisma = app.get(PrismaService);
        company = await prisma.company.findFirst();
    });

    afterAll(async () => {
        await app.close();
    });

    describe("Without search term", () => {
        let res: request.Response;
        let body: FindManyUsersResponseDto;
        it("should return HTTP status OK", async () => {
            res = await post({
                page: 1,
                limit: 10,
                companyId: company.id
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
            res = await post({
                page: 1,
                limit: 10,
                searchTerm: "admin",
                companyId: company.id
            });
            expect(res.status).toBe(HttpStatus.OK);
            expect(res.body).toBeDefined();
            body = res.body as FindManyUsersResponseDto;
        });
        it("should return users", async () => {
            expect(body.users.length).toBeGreaterThan(0);
        });
    });
})