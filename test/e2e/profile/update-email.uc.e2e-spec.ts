import { HttpStatus, INestApplication } from "@nestjs/common";
import { bootstrapTest } from "../test.main";
import { AuthenticationModule } from "@app/authentication/authentication.module";
import { UserModule } from "@app/user/user.module";
import { getTestUser, getTestUser2 } from "../test-helpers/get-test-user.test-helper";
import { CreateRequestFN, createPatch, createPost } from "../test-helpers/create-request.test-helper";
import { UpdateEmailResponseDto } from "@app/user/dtos/update-email/update-email-response.dto";
import { PrismaService } from "@app/prisma/prisma.service";
import { resetUser } from "../test-helpers/reset-user.test-helper";
import { TfaService } from "@app/tfa/services/tfa.service";
import { pollJobStatus } from "../test-helpers/poll-job-status.test-helper";
import { getTfaCode } from "../test-helpers/get-tfa-code.test-helper";

describe("Update email use case", () => {
    const url = "/users/profile/email";
    const user = getTestUser();
    const user2 = getTestUser2();

    let app: INestApplication;
    let patch: CreateRequestFN;
    let prisma: PrismaService;

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
        prisma = app.get(PrismaService);
    });

    afterAll(async () => {
        await app.close();
    });

    describe("PATCH: users/profile/email", () => {
        describe("Emails are equals", () => {
            it("should return HTTP status BAD REQUEST", async () => {
                const res = await patch({ email: user.email });
                expect(res.status).toBe(HttpStatus.BAD_REQUEST);
            });
        });
        describe("Email already exists", () => {
            it("should return HTTP status BAD REQUEST", async () => {
                const res = await patch({ email: user2.email });
                expect(res.status).toBe(HttpStatus.BAD_REQUEST);
            });
        });
        describe("Update email successfully", () => {
            const id = Math.floor(Math.random() * 9000) + 1000;
            const newEmail = `yhonax.qrz+${id}@gmail.com`;
            let res: UpdateEmailResponseDto = null;
            let jobId: string = null;
            it('should return HTTP status CREATED', async () => {
                const response = await patch({ email: newEmail });
                expect(response.status).toBe(HttpStatus.OK);
                res = response.body as UpdateEmailResponseDto;
            });
            it("should return tfa is pending", () => {
                expect(res.isTFAPending).toBeTruthy();
            });
            it("should return jobId", () => {
                expect(res.jobId).toBeDefined();
                jobId = res.jobId;
            });
            it("should complete job", async () => {
                const tfaService = app.get(TfaService);
                const jobStatus = await pollJobStatus({
                    service: tfaService,
                    jobId: jobId
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
            it("should update email", async () => {
                const updatedUser = await prisma.user.findUnique({
                    where: { username: user.username }
                });
                expect(updatedUser).toBeDefined();
                expect(updatedUser.email).toBe(newEmail);
                await resetUser(prisma, user);
            });
        });
    });
});