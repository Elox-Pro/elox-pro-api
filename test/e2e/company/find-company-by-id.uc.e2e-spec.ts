import { HttpStatus, INestApplication } from "@nestjs/common"
import { bootstrapTest } from "../test.main";
import { AuthenticationModule } from "@app/authentication/authentication.module";
import { getTestUser } from "../test-helpers/get-test-user.test-helper";
import { createGet } from "../test-helpers/create-request.test-helper";
import { CompanyModule } from "@app/company/company.module";
import * as request from "supertest";
import { FindCompanyByIdResponseDto } from "@app/company/dtos/find-company-by-id/find-company-by-id.response.dto";
import { PrismaService } from "@app/prisma/prisma.service";
import { Company } from "@prisma/client";

describe("Get Company info by Id Endpoint", () => {
    const user = getTestUser();

    let app: INestApplication;
    let prisma: PrismaService;

    beforeAll(async () => {
        app = await bootstrapTest([
            AuthenticationModule,
            CompanyModule
        ]);

        prisma = app.get(PrismaService);
    });

    afterAll(async () => {
        await app.close();
    });

    describe("GET: companies/:id", () => {
        let res: request.Response;
        let body: FindCompanyByIdResponseDto;
        let company: Company;
        it("should return HTTP status OK", async () => {

            company = await prisma.company.findFirst();
            const url = `/companies/${company.id}`;

            const get = createGet({
                app, url, credentials: {
                    username: user.username,
                    password: user.password
                }
            });
            res = await get();
            expect(res.status).toBe(HttpStatus.OK);
        });
        it("should return a company", async () => {
            expect(res.body).toBeDefined();
            body = res.body as FindCompanyByIdResponseDto;
            expect(body.company.id).toEqual(company.id);
        });
    });
});