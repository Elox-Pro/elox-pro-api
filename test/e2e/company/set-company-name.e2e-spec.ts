import { HttpStatus, INestApplication } from "@nestjs/common";
import { bootstrapTest } from "../test.main";
import { AuthenticationModule } from "@app/authentication/authentication.module";
import { getTestUser } from "../test-helpers/get-test-user.test-helper";
import { CreateRequestFN, createPost } from "../test-helpers/create-request.test-helper";
import { CompanyModule } from "@app/company/company.module";
import { PrismaService } from "@app/prisma/prisma.service";
import { Company, Role } from "@prisma/client";
import { getTestCompany, getTestCompany2 } from "../test-helpers/get-test-company.test-helper";

describe("Set company name endpoint", () => {
    const url = "/companies/set-name";
    const user = getTestUser();
    const company1 = getTestCompany();
    const company2 = getTestCompany2();

    let app: INestApplication;
    let post: CreateRequestFN;
    let prisma: PrismaService;

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
    });

    afterAll(async () => {
        await app.close();
    });

    describe("Create company with name", () => {
        describe("Company name already exists", () => {
            it("should return HTTP status Bad Request", async () => {
                const company = await findCompanyByName(prisma, company1.name);
                const res = await post({
                    name: company.name,
                    id: 0
                });
                expect(res.status).toBe(HttpStatus.BAD_REQUEST);
            });
        });
        describe("Company created", () => {
            it("should return HTTP status OK", async () => {
                const res = await post({
                    name: String(Date.now()),
                    id: 0
                });
                expect(res.status).toBe(HttpStatus.OK);
            });
        });
    });

    describe("Update company name", () => {
        describe("Company does not exists", () => {
            it("should return HTTP status Bad Request", async () => {
                const res = await post({
                    name: "Fake company name",
                    id: Date.now()
                });
                expect(res.status).toBe(HttpStatus.BAD_REQUEST);
            });
        });
        describe("Company name is equal", () => {
            it("should return HTTP status Bad Request", async () => {
                const company = await findCompanyByName(prisma, company1.name);
                const res = await post({
                    name: company.name,
                    id: company.id
                });
                expect(res.status).toBe(HttpStatus.BAD_REQUEST);
            });
        });
        describe("Company name already exists", () => {
            it("should return HTTP status Bad Request", async () => {
                const current = await findCompanyByName(prisma, company1.name);
                const saved = await findCompanyByName(prisma, company2.name);
                const res = await post({
                    name: saved.name,
                    id: current.id
                });
                expect(res.status).toBe(HttpStatus.BAD_REQUEST);
            });
        });

        describe("Company updated", () => {
            let id = 0;
            it("should return HTTP status OK", async () => {
                const company = await findCompanyByName(prisma, company1.name);
                id = company.id;
                const res = await post({
                    name: String(Date.now()),
                    id: id
                });
                expect(res.status).toBe(HttpStatus.OK);
            });
            it("should reset company name", async () => {
                const company = await prisma.company.update({
                    where: { id },
                    data: { name: company1.name }
                });
                expect(company.name).toBe(company1.name);
            });
        });
    });
});

async function findCompanyByName(prisma: PrismaService, name: string) {
    return await prisma.company.findUnique({
        where: { name }
    });
}