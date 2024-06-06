import { HttpStatus, INestApplication } from "@nestjs/common";
import { bootstrapTest } from "../test.main";
import { AuthenticationModule } from "@app/authentication/authentication.module";
import { getTestUser } from "../test-helpers/get-test-user.test-helper";
import { CreateRequestFN, createPost } from "../test-helpers/create-request.test-helper";
import { CompanyModule } from "@app/company/company.module";
import { PrismaService } from "@app/prisma/prisma.service";

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


    describe("Company already exists", () => {
        it("should return HTTP status Bad request", async () => {
            const company = await findCompany(prisma);
            const res = await post({
                name: company.name
            });
            expect(res.status).toBe(HttpStatus.BAD_REQUEST);
        });
    });
    describe("Company created", () => {
        it("should return HTTP status CREATED", async () => {
            const res = await post({
                name: String(Date.now())
            });
            expect(res.status).toBe(HttpStatus.CREATED);
        });
    });
});

async function findCompany(prisma) {
    return await prisma.company.findFirst();
}
