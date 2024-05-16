import { HttpStatus, INestApplication } from "@nestjs/common";
import { bootstrapTest } from "../test.main";
import { TfaModule } from "@app/tfa/tfa.module";
import { getTestUser } from "../test-helpers/get-test-user.test-helper";
import { CreateRequestFN, createPost } from "../test-helpers/create-request.test-helper";
import { TfaService } from "@app/tfa/services/tfa.service";
import { TfaRequestDto } from "@app/tfa/dtos/tfa/tfa.request.dto";
import { TfaAction } from "@app/tfa/enums/tfa-action.enum";
import { RequestLang } from "@app/common/enums/request-lang.enum";
import { pollJobStatus } from "../test-helpers/poll-job-status.test-helper";
import { getTfaCode } from "../test-helpers/get-tfa-code.test-helper";

describe('Validate TFA Use Case', () => {
    const url = '/tfa/validate';
    const user = getTestUser();

    let app: INestApplication;
    let post: CreateRequestFN;

    beforeAll(async () => {
        // Setting up the NestJS application and dependencies for testing
        app = await bootstrapTest([
            TfaModule
        ]);
        post = createPost({ app, url });
    });

    afterAll(async () => {
        await app.close();
    });

    describe('POST: tfa/validate', () => {
        describe('username not found', () => {
            // Test to check that the username is not found
            it('should return HTTP status bad request', async () => {
                const res = await post({
                    "username": "idontknow",
                    "code": 123,
                });
                expect(res.status).toBe(HttpStatus.BAD_REQUEST);
            });
        });
        describe('check code', () => {
            let jobId: string = null;
            // Test to check that the job is created
            it("should create TFA job", async () => {
                const tfaService = app.get(TfaService);
                const job = await tfaService.add(new TfaRequestDto(
                    user,
                    '127.0.0.1',
                    TfaAction.RECOVER_PASSWORD,
                    RequestLang.EN
                ));
                expect(job).toBeDefined();
                expect(job.id).toBeDefined();
                jobId = job.id.toString();
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
            describe('invalid code', () => {
                // Test to check the invalid TFA code
                it('should return HTTP status bad request', async () => {
                    const res = await post({
                        "username": user.username,
                        "code": 123,
                    });
                    expect(res.status).toBe(HttpStatus.BAD_REQUEST);
                });
            });
            describe('valid code', () => {
                // Test to check the valid TFA code
                it('should return HTTP status OK', async () => {
                    const res = await post({
                        "username": user.username,
                        "code": getTfaCode(),
                    });
                    expect(res.status).toBe(HttpStatus.OK);
                    expect(res.body).toBeDefined();
                });
            });
        });
    })
});