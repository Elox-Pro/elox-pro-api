import { HttpStatus, INestApplication } from "@nestjs/common";
import { bootstrapTest } from "../test.main";
import { AuthenticationModule } from "@app/authentication/authentication.module";
import { getTestUser } from "../test-helpers/get-test-user.test-helper";
import { CreateRequestFN, createPost } from "../test-helpers/create-request.test-helper";
import { CompanyModule } from "@app/company/company.module";
import { PrismaService } from "@app/prisma/prisma.service";
import { Role } from "@prisma/client";

describe("Create company endpoint", () => {
    const url = "/companies/create";
    const user = getTestUser();

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

    describe("POST: companies/create", () => {
        describe("Company already exists", () => {
            it("should return HTTP status Bad request", async () => {
                const company = await findCompany(prisma);
                const res = await post({
                    name: company.name,
                    username: "IDoNotKnow"
                });
                expect(res.status).toBe(HttpStatus.BAD_REQUEST);
            });
        });
        describe("User does not exists", () => {
            it("should return HTTP status Bad request", async () => {
                const res = await post({
                    name: String(Date.now()),
                    username: "IDoNotKnow"
                });
                expect(res.status).toBe(HttpStatus.BAD_REQUEST);
            });
        });
        describe("User is not a company owner", () => {
            it("should return HTTP status Bad request", async () => {
                const res = await post({
                    name: String(Date.now()),
                    username: user.username
                });
                expect(res.status).toBe(HttpStatus.BAD_REQUEST);
            });
        });
        describe("Company created", () => {
            it("should return HTTP status CREATED", async () => {
                const owner = await findOwner(prisma);
                const res = await post({
                    name: String(Date.now()),
                    username: owner.username
                });
                expect(res.status).toBe(HttpStatus.CREATED);
            });
        });
    });
});

async function findCompany(prisma) {
    return await prisma.company.findFirst();
}

async function findOwner(prisma) {
    const user = await prisma.user.findFirst({
        where: {
            role: Role.COMPANY_OWNER
        }
    });

    if (!user) {
        console.error("Owner not found");
        throw new Error("Owner not found");
    }

    return user;
}