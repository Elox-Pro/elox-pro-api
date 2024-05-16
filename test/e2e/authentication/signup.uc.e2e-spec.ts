import { HttpStatus, INestApplication } from "@nestjs/common";
import { bootstrapTest } from "../test.main";
import * as request from "supertest";
import { AuthenticationModule } from "@app/authentication/authentication.module";
import { TfaModule } from "@app/tfa/tfa.module";
import { createPost } from "../test-helpers/create-request.test-helper";
import { getTestUser } from "../test-helpers/get-test-user.test-helper";
import { TfaService } from "@app/tfa/services/tfa.service";
import { pollJobStatus } from "../test-helpers/poll-job-status.test-helper";
import { getTfaCode } from "../test-helpers/get-tfa-code.test-helper";
import { ValidateTFAResponseDto } from "@app/tfa/dtos/validate-tfa/validate-tfa.response.dto";
import { TfaAction } from "@app/tfa/enums/tfa-action.enum";
import { SignupResponseDto } from "@app/authentication/dtos/signup/signup.response.dto";

describe('Signup Use Case', () => {
    const url = '/authentication/signup';
    const user = getTestUser();

    let app: INestApplication;
    let post: (data: any) => Promise<request.Response>;

    beforeAll(async () => {
        // Setting up the NestJS application and dependencies for testing
        app = await bootstrapTest([
            AuthenticationModule,
            TfaModule
        ]);
        post = createPost({ app, url });
    });

    afterAll(async () => {
        await app.close();
    });

    describe('POST: authentication/signup', () => {
        describe('uername already exists', () => {
            // Test to check signup failure with existing username
            it('should return HTTP status bad request', async () => {
                const res = await post({
                    "username": user.username,
                    "email": "yhonax.qrz@gmail.com",
                    "password1": "1234",
                    "password2": "1234",
                    "grecaptchaToken": "<TOKEN>",
                });
                expect(res.status).toBe(HttpStatus.BAD_REQUEST);
            });
        });
        describe('email already exists', () => {
            // Test to check signup failure with existing email
            it('should return HTTP status bad request', async () => {
                const res = await post({
                    "username": `user:${Date.now()}`,
                    "email": user.email,
                    "password1": "1234",
                    "password2": "1234",
                    "grecaptchaToken": "<TOKEN>",
                });
                expect(res.status).toBe(HttpStatus.BAD_REQUEST);
            });
        });
        describe('passwords do not match', () => {
            // Test to check signup failure with passwords that do not match
            it('should return HTTP status bad request', async () => {
                const res = await post({
                    "username": `user:${Date.now()}`,
                    "email": `yhonax.qrz+${Date.now()}@gmail.com`,
                    "password1": "1234",
                    "password2": "1234678",
                    "grecaptchaToken": "<TOKEN>",
                });
                expect(res.status).toBe(HttpStatus.BAD_REQUEST);
            });
        });
        describe('signup successfully', () => {
            let jobId: string = null;
            const username = `user:${Date.now()}`;
            // Test to check signup success
            it('should return HTTP status CREATED', async () => {
                const res = await post({
                    "username": username,
                    "email": `yhonax.qrz+${Date.now()}@gmail.com`,
                    "password1": "1234",
                    "password2": "1234",
                    "grecaptchaToken": "<TOKEN>",
                });
                expect(res.status).toBe(HttpStatus.CREATED);
                const body = res.body as SignupResponseDto;
                expect(body).toBeDefined();
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
                    username: username
                });
                expect(tfaResult.status).toBe(HttpStatus.OK);
                expect(tfaResult.body).toBeDefined();
                const tfaBody = tfaResult.body as ValidateTFAResponseDto;
                expect(tfaBody.action).toBe(TfaAction.SIGN_UP);
            });
        });
    });
});