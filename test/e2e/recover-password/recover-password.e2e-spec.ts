import { HttpStatus, INestApplication } from "@nestjs/common";
import { bootstrapTest } from "../test.main";
import { CreateRequestFN, createPost } from "../test-helpers/create-request.test-helper";
import { RecoverPasswordModule } from "@app/recover-password/recover-password.module";
import { PrismaService } from "@app/prisma/prisma.service";
import { resetUser } from "../test-helpers/reset-user.test-helper";
import { getTestUser } from "../test-helpers/get-test-user.test-helper";
import { TfaType } from "@prisma/client";
import { RecoverPasswordInitResponseDto } from "@app/recover-password/dtos/recover-password-init/recover-password-init.response.dto";
import { TfaQueueService } from "@app/tfa/services/tfa-queue.service";
import { pollJobStatus } from "../test-helpers/poll-job-status.test-helper";
import { getTfaCode } from "../test-helpers/get-tfa-code.test-helper";

describe('Recover Password Use Case', () => {
    const url = '/recover-password/init';
    const user = getTestUser();

    let app: INestApplication;
    let post: CreateRequestFN;
    let prisma: PrismaService;
    let cookies: string = null;

    beforeAll(async () => {
        app = await bootstrapTest([
            RecoverPasswordModule
        ]);
        post = createPost({ app, url });
        prisma = app.get(PrismaService);
    });

    afterAll(async () => {
        await app.close();
    });

    describe('POST: recover-password/init', () => {
        describe('username not found', () => {
            it('should return HTTP status bad request', async () => {
                const res = await post({
                    "username": 'idontknow',
                    "grecaptchaToken": "<TOKEN>"
                });
                expect(res.status).toBe(HttpStatus.BAD_REQUEST);
            });
        });
        describe('user not verified', () => {
            it('should return HTTP status bad request', async () => {
                await prisma.user.update({
                    where: { username: user.username },
                    data: {
                        tfaType: TfaType.EMAIL,
                        emailVerified: false
                    }
                });
                const res = await post({
                    "username": user.username,
                    "grecaptchaToken": "<TOKEN>"
                });
                expect(res.status).toBe(HttpStatus.BAD_REQUEST);
                await resetUser(prisma, user);
            });
        });
        describe("send tfa code", () => {
            let jobId: string = null;
            it('should return HTTP status OK', async () => {
                const res = await post({
                    "username": user.username,
                    "grecaptchaToken": "<TOKEN>"
                });
                expect(res.status).toBe(HttpStatus.OK);
                expect(res.body).toBeDefined();
                const body = res.body as RecoverPasswordInitResponseDto;
                expect(body.isTFAPending).toBe(true);
                expect(body.jobId).toBeDefined();
                jobId = body.jobId;
            });
            it("should complete the job", async () => {
                const tfaService = app.get(TfaQueueService);
                const jobStatus = await pollJobStatus({
                    service: tfaService,
                    jobId: jobId
                });
                expect(jobStatus).toBe("completed");
            });
        });
        describe("validate tfa code", () => {
            it("should validate the TFA code", async () => {
                const tfaPost = createPost({ app, url: '/tfa/validate' });
                const tfaResult = await tfaPost({
                    code: getTfaCode(),
                    username: user.username
                });
                expect(tfaResult.status).toBe(HttpStatus.OK);
                expect(tfaResult.body).toBeDefined();
                cookies = tfaResult.headers['set-cookie'];
                expect(cookies).toBeDefined();
            });
        });
    })
    describe('POST: recover-password/reset', () => {
        let resetPasswordPost: CreateRequestFN;
        describe("token not found", () => {
            it("should return HTTP status bad request", async () => {
                const resetPasswordPostAux = createPost({
                    app,
                    url: '/recover-password/reset'
                });
                const res = await resetPasswordPostAux({
                    "username": user.username,
                    "password1": user.password,
                    "password2": user.password,
                    "grecaptchaToken": "<TOKEN>"
                });
                expect(res.status).toBe(HttpStatus.BAD_REQUEST);
            });
        });
        describe("passwords does not match", () => {
            it("should return HTTP status bad request", async () => {
                resetPasswordPost = createPost({
                    app,
                    url: '/recover-password/reset',
                    meta: {
                        "cookie": cookies
                    }
                });
                const res = await resetPasswordPost({
                    "username": user.username,
                    "password1": user.password,
                    "password2": user.password + "1",
                    "grecaptchaToken": "<TOKEN>"
                });
                expect(res.status).toBe(HttpStatus.BAD_REQUEST);
            });
        });
        describe("recover password successfully", () => {
            it("should return HTTP status OK", async () => {
                const res = await resetPasswordPost({
                    "username": user.username,
                    "password1": user.password,
                    "password2": user.password,
                    "grecaptchaToken": "<TOKEN>"
                });
                expect(res.status).toBe(HttpStatus.OK);
            });
        });
    });
})