import { HttpStatus, INestApplication } from "@nestjs/common";
import { bootstrapTest } from "../test.main";
import { AuthenticationModule } from "@app/authentication/authentication.module";
import { getTestUser } from "../test-helpers/get-test-user.test-helper";
import { CreateRequestFN, createPatch, createPost } from "../test-helpers/create-request.test-helper";
import { CompanyModule } from "@app/company/company.module";
import { PrismaService } from "@app/prisma/prisma.service";
import { getTestCompany, getTestCompany2 } from "../test-helpers/get-test-company.test-helper";

describe("Set company name endpoint", () => {
    const url = "/companies/update/name";
    const user = getTestUser();
    const company1 = getTestCompany();
    const company2 = getTestCompany2();

    let app: INestApplication;
    let patch: CreateRequestFN;
    let prisma: PrismaService;

    beforeAll(async () => {
        app = await bootstrapTest([
            AuthenticationModule,
            CompanyModule
        ]);
        patch = createPatch({
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

    describe("Company does not exists", () => {
        it("should return HTTP status Bad Request", async () => {
            const res = await patch({
                name: "Fake company name",
                id: Date.now()
            });
            expect(res.status).toBe(HttpStatus.BAD_REQUEST);
        });
    });
    describe("Company name is equal", () => {
        it("should return HTTP status Bad Request", async () => {
            const company = await findCompanyByName(prisma, company1.name);
            const res = await patch({
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
            const res = await patch({
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
            const res = await patch({
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

async function findCompanyByName(prisma: PrismaService, name: string) {
    return await prisma.company.findUnique({
        where: { name }
    });
}