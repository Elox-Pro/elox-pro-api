import { HttpStatus, INestApplication } from "@nestjs/common";
import { bootstrapTest } from "../test.main";
import { AuthenticationModule } from "@app/authentication/authentication.module";
import { UserModule } from "@app/user/user.module";
import { createJwtCookieSession } from "../test-helpers/create-jwt-cookie-session.test-helper";
import * as request from "supertest";
import { UpdatePasswordResponseDto } from "@app/user/dtos/update-password/update-password-response.dto";
import { PrismaService } from "@app/prisma/prisma.service";
import { TfaType, User } from "@prisma/client";
import { getTestUser } from "../test-helpers/get-test-user.test-helper";
import { CreateRequestFN, createPatch, createPost } from "../test-helpers/create-request.test-helper";
import { TfaService } from "@app/tfa/services/tfa.service";
import { pollJobStatus } from "../test-helpers/poll-job-status.test-helper";
import { getTfaCode } from "../test-helpers/get-tfa-code.test-helper";

describe("Update password use case", () => {

    const userTest = getTestUser();
    const username = userTest.username;
    const password = userTest.password;
    const url = "/users/profile/password";

    let app: INestApplication;
    let user: User;
    let prisma: PrismaService;
    let patch: CreateRequestFN;

    beforeAll(async () => {
        app = await bootstrapTest([
            AuthenticationModule,
            UserModule
        ]);
        prisma = app.get(PrismaService);
        user = await prisma.user.findUnique({
            where: { username }
        });
        patch = createPatch({
            app, url, credentials: { username, password }
        });
    });

    afterEach(async () => {
        await prisma.user.update({
            where: { username },
            data: {
                password: user.password,
                tfaType: TfaType.NONE
            }
        });
    });

    afterAll(async () => {
        await app.close();
    });

    describe("PATCH: users/profile/password", () => {
        describe("Invalid password", () => {
            it("should return HTTP status BAD REQUEST", async () => {
                const res = await patch({
                    currentPassword: "123",
                    newPassword: "123",
                    confirmPassword: "123"
                });
                expect(res.status).toBe(HttpStatus.BAD_REQUEST);
            });
        });
        describe("Password does not match", () => {
            it("should return HTTP status BAD REQUEST", async () => {
                const res = await patch({
                    currentPassword: "123",
                    newPassword: "123",
                    confirmPassword: "3210"
                });
                expect(res.status).toBe(HttpStatus.BAD_REQUEST);
            });
        });
        describe("Change password without TFA", () => {
            let res: request.Response;
            let body: UpdatePasswordResponseDto;
            it("should return HTTP status OK", async () => {
                res = await patch({
                    currentPassword: password,
                    newPassword: "123",
                    confirmPassword: "123"
                });
                expect(res.status).toBe(HttpStatus.OK);
            });
            it("should return tfa pending false", async () => {
                expect(res.body).toBeDefined();
                body = res.body;
                expect(body.isTFAPending).toBe(false);

            });
        });
        describe("Change password with TFA", () => {
            let res: request.Response;
            let body: UpdatePasswordResponseDto;
            it("should return HTTP status OK", async () => {
                // Create the auth cookie for use in the auxpatch to avoid use the tfa code when the tfa type is updated
                const authCookies = await createJwtCookieSession(app, username, password);
                // Create the request with authentcation without make use the tfa code
                const auxPatch = createPatch({
                    app, url, meta: { "cookie": authCookies }
                });
                // Update the tfa type to email
                await prisma.user.update({
                    where: { username },
                    data: {
                        tfaType: TfaType.EMAIL
                    }
                });
                // Use the request with the previous auth cookie
                res = await auxPatch({
                    currentPassword: password,
                    newPassword: "123",
                    confirmPassword: "123"
                });
                expect(res.status).toBe(HttpStatus.OK);
            });
            it("should return tfa pending true", async () => {
                expect(res.body).toBeDefined();
                body = res.body;
                expect(body.isTFAPending).toBe(true);
            });
            it("should return jobId", async () => {
                expect(body.jobId).toBeDefined();
            });
            it("should complete job", async () => {
                const tfaService = app.get(TfaService);
                const jobStatus = await pollJobStatus({
                    service: tfaService,
                    jobId: body.jobId
                });
                expect(jobStatus).toBe("completed");
            });
            it("should validate the tfa code", async () => {
                const tfaPost = createPost({ app, url: '/tfa/validate' });
                const tfaResult = await tfaPost({
                    code: getTfaCode(),
                    username: user.username
                });
                expect(tfaResult.status).toBe(HttpStatus.OK);
            });
        });
    });
});