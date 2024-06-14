import { HttpStatus, INestApplication } from "@nestjs/common"
import { bootstrapTest } from "../test.main";
import { AuthenticationModule } from "@app/authentication/authentication.module";
import { getTestUser } from "../test-helpers/get-test-user.test-helper";
import { CreateRequestFN, createDelete } from "../test-helpers/create-request.test-helper";
import { CompanyModule } from "@app/company/company.module";
import { PrismaService } from "@app/prisma/prisma.service";
import { Company, Role, User } from "@prisma/client";

describe("Remove user from company endpoint", () => {
    const url = "/companies/remove/user";
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
                userId: Date.now(),
                companyId: Date.now()
            });
            expect(res.status).toBe(HttpStatus.BAD_REQUEST);
        });
    });
    describe("User does not exists", () => {
        it("should return HTTP status Bad Request", async () => {
            const company = await findCompany(prisma);
            const res = await deleteReq({
                userId: Date.now(),
                companyId: company.id
            });
            expect(res.status).toBe(HttpStatus.BAD_REQUEST);
        });
    });
    describe("User does not belong to company", () => {
        it("should return HTTP status Bad Request", async () => {
            const company = await findCompany(prisma);
            const res = await deleteReq({
                userId: user.id,
                companyId: company.id
            });
            expect(res.status).toBe(HttpStatus.BAD_REQUEST);
        });
    });
    describe("User removed", () => {
        it("should return HTTP status OK", async () => {
            const company = await findCompany(prisma);
            const ownerUser = await createOwnerToCompany(prisma, company.id);
            const res = await deleteReq({
                userId: ownerUser.id,
                companyId: company.id
            });
            expect(res.status).toBe(HttpStatus.OK);
        });
    });
})

async function findCompany(prisma: PrismaService): Promise<Company> {
    return await prisma.company.findFirst();
}

async function createOwnerToCompany(prisma: PrismaService, companyId: number): Promise<User> {
    const newOwnerUser = await createUserWithRole(prisma, Role.COMPANY_OWNER);
    await addUserToCompany(prisma, companyId, newOwnerUser.id);
    return newOwnerUser;
}

async function addUserToCompany(prisma: PrismaService, companyId: number, userId: number): Promise<void> {
    await prisma.company.update({
        where: {
            id: companyId
        },
        data: {
            users: {
                connect: {
                    id: userId
                }
            }
        }
    });
}

async function createUserWithRole(prisma: PrismaService, role: Role): Promise<User> {
    return await prisma.user.create({
        data: {
            username: String(Date.now()),
            password: String(Date.now()),
            role: role,
            email: String(Date.now()) + "@gmail.com",
        }
    });
}