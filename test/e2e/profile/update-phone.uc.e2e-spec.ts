import { HttpStatus, INestApplication } from "@nestjs/common";
import { bootstrapTest } from "../test.main";
import { AuthenticationModule } from "@app/authentication/authentication.module";
import { UserModule } from "@app/user/user.module";
import { getTestUser, getTestUser2 } from "../test-helpers/get-test-user.test-helper";
import { CreateRequestFN, createPatch } from "../test-helpers/create-request.test-helper";
import { resetUser } from "../test-helpers/reset-user.test-helper";
import { PrismaService } from "@app/prisma/prisma.service";

describe("Update phone use case", () => {
    const url = "/users/profile/phone";
    const user = getTestUser();
    const user2 = getTestUser2();

    let app: INestApplication;
    let patch: CreateRequestFN;

    beforeAll(async () => {
        app = await bootstrapTest([
            AuthenticationModule,
            UserModule
        ]);
        patch = createPatch({
            app, url, credentials: {
                username: user.username,
                password: user.password
            }
        });
    });

    afterAll(async () => {
        resetUser(app.get(PrismaService), user);
        await app.close();
    });

    describe("PATCH: users/profile/phone", () => {
        describe("Phones are equals", () => {
            it("should return HTTP status BAD REQUEST", async () => {
                const res = await patch({ phone: user.phone });
                expect(res.status).toBe(HttpStatus.BAD_REQUEST);
            });
        });
        describe("Phone already exists", () => {
            it("should return HTTP status BAD REQUEST", async () => {
                const res = await patch({ phone: user2.phone });
                expect(res.status).toBe(HttpStatus.BAD_REQUEST);
            });
        });
        describe("Update phone successfully", () => {
            it('should return HTTP status CREATED', async () => {
                const response = await patch({ phone: "9876543210" });
                expect(response.status).toBe(HttpStatus.OK);
            });
        });
    });
});