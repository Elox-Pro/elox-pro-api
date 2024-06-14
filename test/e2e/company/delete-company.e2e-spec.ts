import { HttpStatus, INestApplication } from "@nestjs/common";
import { getTestUser } from "../test-helpers/get-test-user.test-helper";
import { CreateRequestFN, createDelete } from "../test-helpers/create-request.test-helper";
import { bootstrapTest } from "../test.main";
import { AuthenticationModule } from "@app/authentication/authentication.module";
import { CompanyModule } from "@app/company/company.module";
import { PrismaService } from "@app/prisma/prisma.service";
import { Company } from "@prisma/client";

describe("Delete company endpoint", () => {
    const url = "/companies/delete/company";
    const user = getTestUser();

    let app: INestApplication;
    let deleteReq: CreateRequestFN;
    let prisma: PrismaService;

    beforeAll(async () => {
        app = await bootstrapTest([
            AuthenticationModule,
            CompanyModule
        ]);
        deleteReq = createDelete({
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
            const res = await deleteReq({
                id: Date.now()
            });
            expect(res.status).toBe(HttpStatus.BAD_REQUEST);
        });
    });
    describe("Company has users", () => {
        it("should return HTTP status Bad Request", async () => {
            const company = await findCompany(prisma);
            const res = await deleteReq({
                id: company.id
            });
            expect(res.status).toBe(HttpStatus.BAD_REQUEST);
        });
    });
    describe("Company deleted", () => {
        it("should return HTTP status OK", async () => {
            const company = await createCompany(prisma);
            const res = await deleteReq({
                id: company.id
            });
            expect(res.status).toBe(HttpStatus.OK);
        });
    });
});

async function findCompany(prisma: PrismaService): Promise<Company> {
    return await prisma.company.findFirst();
}

async function createCompany(prisma: PrismaService): Promise<Company> {
    return await prisma.company.create({
        data: {
            name: String(Date.now())
        }
    });
}