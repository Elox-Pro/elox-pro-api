import { HttpStatus, INestApplication } from "@nestjs/common"
import { bootstrapTest } from "../test.main";
import { AuthenticationModule } from "@app/authentication/authentication.module";
import { getTestUser } from "../test-helpers/get-test-user.test-helper";
import { CreateRequestFN, createGet } from "../test-helpers/create-request.test-helper";
import { CompanyModule } from "@app/company/company.module";
import * as request from "supertest";
import { FindManyCompaniesResponseDto } from "@app/company/dtos/find-many-companies/find-many-companies.response.dto";

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
        describe("Without search term", () => {
            let res: request.Response;
            let body: FindManyCompaniesResponseDto;
            it("should return HTTP status OK", async () => {
                res = await get({
                    page: 1,
                    limit: 10
                });
                expect(res.status).toBe(HttpStatus.OK);
                expect(res.body).toBeDefined();
                body = res.body as FindManyCompaniesResponseDto;
            });
            it("should return 10 companies", async () => {
                expect(body.companies.length).toBeGreaterThan(0);
                expect(body.companies.length).toEqual(10);
            });
        });
        describe("With search term", () => {
            let res: request.Response;
            let body: FindManyCompaniesResponseDto;
            it("should return HTTP status OK", async () => {
                res = await get({
                    page: 1,
                    limit: 10,
                    searchTerm: "Apple"
                });
                expect(res.status).toBe(HttpStatus.OK);
                expect(res.body).toBeDefined();
                body = res.body as FindManyCompaniesResponseDto;
            });
            it("should return 1 company", async () => {
                expect(body.companies.length).toBeGreaterThan(0);
                expect(body.companies.length).toEqual(1);
            });
        });
    });
})