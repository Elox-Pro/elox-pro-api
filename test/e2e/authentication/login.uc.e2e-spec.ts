import { HttpStatus, INestApplication } from '@nestjs/common';
import { bootstrapTest } from '../test.main';
import { LoginResponseDto } from '@app/authentication/dtos/login/login.response.dto';
import { AuthenticationModule } from '@app/authentication/authentication.module';
import { getTestUser } from '../test-helpers/get-test-user.test-helper';
import { PrismaService } from '@app/prisma/prisma.service';
import { resetUser } from '../test-helpers/reset-user.test-helper';
import { CreateRequestFN, createPost } from '../test-helpers/create-request.test-helper';
import { TfaType } from '@prisma/client';
import { TfaService } from '@app/tfa/services/tfa.service';
import { pollJobStatus } from '../test-helpers/poll-job-status.test-helper';
import { TfaAction } from '@app/tfa/enums/tfa-action.enum';
import { getTfaCode } from '../test-helpers/get-tfa-code.test-helper';
import { ValidateTFAResponseDto } from '@app/tfa/dtos/validate-tfa/validate-tfa.response.dto';

describe('Login Use Case', () => {
    const url = '/authentication/login';
    const user = getTestUser();

    let app: INestApplication;
    let prisma: PrismaService;
    let post: CreateRequestFN;

    beforeAll(async () => {
        // Setting up the NestJS application and dependencies for testing
        app = await bootstrapTest([
            AuthenticationModule
        ]);
        prisma = app.get(PrismaService);
        post = createPost({ app, url });
    });

    afterAll(async () => {
        // Cleaning up the user data and closing the application after tests
        await resetUser(prisma, user);
        await app.close();
    });


    describe('POST: authentication/login', () => {
        describe('wrong password', () => {
            // Test to check login failure with incorrect password
            it('should return HTTP status bad request', async () => {
                const res = await post({
                    "username": user.username,
                    "password": "idontknow",
                    "grecaptchaToken": "<TOKEN>",
                })
                expect(res.status).toBe(HttpStatus.BAD_REQUEST);
            });
        });

        describe('wrong username', () => {
            // Test to check login failure with incorrect username
            it('should return HTTP status bad request', async () => {
                const res = await post({
                    "username": "idontknow",
                    "password": user.password,
                    "grecaptchaToken": "<TOKEN>"
                });
                expect(res.status).toBe(HttpStatus.BAD_REQUEST);
            });
        });

        describe('tfa - Type: NONE', () => {
            // Test to check login success without TFA
            it('should return HTTP status OK', async () => {
                const res = await post({
                    "username": user.username,
                    "password": user.password,
                    "grecaptchaToken": "<TOKEN>"
                });

                expect(res.status).toBe(HttpStatus.OK);
                expect(res.body).toBeDefined();

                const body = res.body as LoginResponseDto;

                expect(body.tokens).toBeUndefined();
                expect(body.isTFAPending).toBeFalsy();
            });
        });

        describe('tfa - Type: EMAIL', () => {
            let jobId: string = null;
            // Test to check login initiation with EMAIL TFA type
            it('should return HTTP status OK', async () => {

                await prisma.user.update({
                    where: { username: user.username },
                    data: {
                        tfaType: TfaType.EMAIL
                    }
                });

                const res = await post({
                    "username": user.username,
                    "password": user.password,
                    "grecaptchaToken": "<TOKEN>"
                });


                expect(res.status).toBe(HttpStatus.OK);
                expect(res.body).toBeDefined();

                const body = res.body as LoginResponseDto;

                expect(body.tokens).toBeUndefined();
                expect(body.isTFAPending).toBeTruthy();
                expect(body.jobId).toBeDefined();
                jobId = body.jobId;

            });

            // Test to check TFA job completion status
            it("should complete the job", async () => {

                const tfaService = app.get(TfaService);
                const jobStatus = await pollJobStatus({
                    service: tfaService,
                    jobId: jobId
                });

                expect(jobStatus).toBe("completed");
            });

            // Test to validate the TFA code
            it("should validate the TFA code", async () => {

                const tfaPost = createPost({ app, url: '/tfa/validate' });
                const tfaResult = await tfaPost({
                    code: getTfaCode(),
                    username: user.username
                });

                expect(tfaResult.status).toBe(HttpStatus.OK);
                expect(tfaResult.body).toBeDefined();
                const tfaBody = tfaResult.body as ValidateTFAResponseDto;
                expect(tfaBody.type).toBe(TfaType.EMAIL);
                expect(tfaBody.action).toBe(TfaAction.SIGN_IN);
            });
        });

        describe("Email not verified", () => {
            let jobId: string = null;
            let tfaService: TfaService;
            // Test to check login initiation when email is not verified
            it("should return HTTP status OK", async () => {

                await prisma.user.update({
                    where: { username: user.username },
                    data: {
                        tfaType: TfaType.EMAIL,
                        emailVerified: false
                    }
                });

                const res = await post({
                    "username": user.username,
                    "password": user.password,
                    "grecaptchaToken": "<TOKEN>"
                });

                expect(res.status).toBe(HttpStatus.OK);
                expect(res.body).toBeDefined();

                const body = res.body as LoginResponseDto;
                expect(body.jobId).toBeDefined();
                jobId = body.jobId;
            });

            // Test to check TFA job completion status when email is not verified
            it("should complete the job", async () => {
                tfaService = app.get(TfaService);
                const jobStatus = await pollJobStatus({
                    service: tfaService,
                    jobId: jobId
                });

                expect(jobStatus).toBe("completed");
            });

            // Test to check TFA job details action for SIGN_UP
            it("should return TFA SIGN_UP action", async () => {
                const jobDetails = await tfaService.getJobDetails(jobId);
                expect(jobDetails).toBeDefined();
                expect(jobDetails.action).toBe(TfaAction.SIGN_UP);
            });
        });
    });
});