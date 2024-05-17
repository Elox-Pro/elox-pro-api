import { HttpStatus, INestApplication } from "@nestjs/common";
import { bootstrapTest } from "../test.main";
import { AuthenticationModule } from "@app/authentication/authentication.module";
import { UserModule } from "@app/user/user.module";
import { TfaType } from "@prisma/client";
import { PrismaService } from "@app/prisma/prisma.service";
import { getTestUser } from "../test-helpers/get-test-user.test-helper";
import { CreateRequestFN, createPatch } from "../test-helpers/create-request.test-helper";
import { resetUser } from "../test-helpers/reset-user.test-helper";

describe("Update tfa type use case", () => {
    const url = "/users/profile/tfa";
    const user = getTestUser();

    let app: INestApplication;
    let prisma: PrismaService;
    let patch: CreateRequestFN;

    beforeAll(async () => {
        app = await bootstrapTest([
            AuthenticationModule,
            UserModule
        ]);
        prisma = app.get(PrismaService);
        patch = createPatch({
            app, url, credentials: {
                username: user.username,
                password: user.password
            }
        });
    });

    afterEach(async () => {
        await resetUser(prisma, user);
    });

    afterAll(async () => {
        await app.close();
    });

    describe("PATCH: users/profile/name", () => {
        describe("Update to Email TFA", () => {
            describe("Email not verified", () => {
                it("should return HTTP status bad request", async () => {
                    await prisma.user.update({
                        where: { username: user.username },
                        data: { emailVerified: false }
                    });
                    const res = await patch({ tfaType: TfaType.EMAIL });
                    expect(res.status).toBe(HttpStatus.BAD_REQUEST);
                });
            });
            describe("Email verified", () => {
                it("should return HTTP status OK", async () => {
                    const res = await patch({ tfaType: TfaType.EMAIL });
                    expect(res.status).toBe(HttpStatus.OK);
                });
            });
        });
        describe("Update to None TFA", () => {
            it("should return HTTP status OK", async () => {
                const res = await patch({ tfaType: TfaType.NONE });
                expect(res.status).toBe(HttpStatus.OK);
            });
        });
    });
});