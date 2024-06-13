import { HttpStatus, INestApplication } from "@nestjs/common"
import { bootstrapTest } from "../test.main";
import { AuthenticationModule } from "@app/authentication/authentication.module";
import { getTestUser } from "../test-helpers/get-test-user.test-helper";
import { CreateRequestFN, createPatch, createPost } from "../test-helpers/create-request.test-helper";
import * as request from "supertest";
import { UserModule } from "@app/user/user.module";
import { FindManyUsersResponseDto } from "@app/user/dtos/find-many-users/find-many-users.response.dto";
import { CompanyModule } from "@app/company/company.module";
import { PrismaService } from "@app/prisma/prisma.service";
import { Company, Role, User } from "@prisma/client";

describe("Add user to company endpoint", () => {
    const url = "/companies/add/user";
    const user = getTestUser();

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
                userId: Date.now(),
                companyId: Date.now()
            });
            expect(res.status).toBe(HttpStatus.BAD_REQUEST);
        });
    });
    describe("User does not exists", () => {
        it("should return HTTP status Bad Request", async () => {
            const company = await findCompany(prisma);
            const res = await patch({
                userId: Date.now(),
                companyId: company.id
            });
            expect(res.status).toBe(HttpStatus.BAD_REQUEST);
        });
    });
    describe("User does not have role allowed", () => {
        it("should return HTTP status Bad Request", async () => {
            const company = await findCompany(prisma);
            const systemUser = await findUserByUsername(prisma, user.username);
            const res = await patch({
                userId: systemUser.id,
                companyId: company.id
            });
            expect(res.status).toBe(HttpStatus.BAD_REQUEST);
        });
    });
    describe("User already exists in company", () => {
        it("should return HTTP status Bad Request", async () => {
            const company = await findCompany(prisma);
            const userOwner = await findFirstCompanyOwner(prisma, company.id);
            const res = await patch({
                userId: userOwner.id,
                companyId: company.id
            });
            expect(res.status).toBe(HttpStatus.BAD_REQUEST);
        });
    });
    describe("Company does not have owner", () => {
        let company: Company;
        it("should create a company with owner", async () => {
            company = await createCompany(prisma);
            expect(company).toBeDefined();
        });
        it("should return HTTP status Bad Request", async () => {
            const userAdmin = await findFirstCompanyAdmin(prisma);
            const res = await patch({
                userId: userAdmin.id,
                companyId: company.id
            });
            expect(res.status).toBe(HttpStatus.BAD_REQUEST);
        });
    });
    describe("User owner added", () => {
        it("should return HTTP status OK", async () => {
            const ownerUser = await createOwner(prisma);
            const company = await findCompany(prisma);
            const res = await patch({
                userId: ownerUser.id,
                companyId: company.id
            });
            expect(res.status).toBe(HttpStatus.OK);
        });
    });
    describe("User admin added", () => {
        it("should return HTTP status OK", async () => {
            const adminUser = await createAdmin(prisma);
            const company = await findCompany(prisma);
            const res = await patch({
                userId: adminUser.id,
                companyId: company.id
            });
            expect(res.status).toBe(HttpStatus.OK);
        });
    });
})

async function findCompany(prisma: PrismaService): Promise<Company> {
    return await prisma.company.findFirst();
}

async function findUserByUsername(prisma: PrismaService, username: string): Promise<User> {
    return await prisma.user.findFirst({
        where: {
            username: username
        }
    });
}

async function findFirstCompanyOwner(prisma: PrismaService, companyId: number): Promise<User> {
    return await prisma.user.findFirst({
        where: {
            companies: {
                some: {
                    id: companyId
                }
            },
            role: Role.COMPANY_OWNER
        }
    });
}

async function createCompany(prisma: PrismaService): Promise<Company> {
    return await prisma.company.create({
        data: {
            name: String(Date.now())
        }
    });
}

async function findFirstCompanyAdmin(prisma: PrismaService): Promise<User> {
    return await prisma.user.findFirst({
        where: {
            role: Role.COMPANY_ADMIN
        }
    });
}

async function createOwner(prisma: PrismaService): Promise<User> {
    return await prisma.user.create({
        data: {
            username: String(Date.now()),
            password: String(Date.now()),
            role: Role.COMPANY_OWNER,
            email: String(Date.now()) + "@gmail.com"
        }
    });
}

async function createAdmin(prisma: PrismaService): Promise<User> {
    return await prisma.user.create({
        data: {
            username: String(Date.now()),
            password: String(Date.now()),
            role: Role.COMPANY_ADMIN,
            email: String(Date.now()) + "@gmail.com"
        }
    });
}