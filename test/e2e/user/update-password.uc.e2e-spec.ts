import { HttpStatus, INestApplication } from "@nestjs/common";
import { bootstrapTest } from "../test.main";
import { AuthenticationModule } from "@app/authentication/authentication.module";
import { UserModule } from "@app/user/user.module";
import { createJwtCookieSession } from "../test-helpers/create-jwt-cookie-session.test-helper";
import * as request from "supertest";
import { UpdatePasswordRequestDto } from "@app/user/dtos/update-password/update-password-request.dto";
import { UpdatePasswordResponseDto } from "@app/user/dtos/update-password/update-password-response.dto";
import { PrismaService } from "@app/prisma/prisma.service";
import { TfaType, User } from "@prisma/client";
import { HashingStrategy } from "@app/common/strategies/hashing/hashing.strategy";

describe("Update password use case", () => {

    const username = "alaska";
    const password = "098lkj!";
    const url = "/users/profile/password";

    let app: INestApplication;
    let cookies: string;
    let user: User;
    let prisma: PrismaService;
    let hashingStrategy: HashingStrategy;

    beforeAll(async () => {
        app = await bootstrapTest([
            AuthenticationModule,
            UserModule
        ]);

        prisma = app.get(PrismaService);
        user = await prisma.user.findUnique({
            where: { username }
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

        describe("Authenticated user", () => {
            it("should authenticate the user", async () => {
                cookies = await createJwtCookieSession(
                    app.getHttpServer(),
                    username,
                    password
                );

                expect(cookies).toBeDefined();
            });
        });

        describe("Invalid password", () => {
            it("should return HTTP status BAD REQUEST", async () => {
                const res = await request(app.getHttpServer())
                    .patch(url)
                    .set('Cookie', cookies)
                    .send({
                        currentPassword: "123",
                        newPassword: "123",
                        confirmPassword: "123"
                    } as UpdatePasswordRequestDto);
                expect(res.status).toBe(HttpStatus.BAD_REQUEST);
            });
        });

        describe("Password does not match", () => {
            it("should return HTTP status BAD REQUEST", async () => {
                const res = await request(app.getHttpServer())
                    .patch(url)
                    .set('Cookie', cookies)
                    .send({
                        currentPassword: password,
                        newPassword: "123",
                        confirmPassword: "1234"
                    } as UpdatePasswordRequestDto);

                expect(res.status).toBe(HttpStatus.BAD_REQUEST);
            });
        });

        describe("Change password without TFA", () => {
            it("should return HTTP status OK", async () => {

                const res = await request(app.getHttpServer())
                    .patch(url)
                    .set('Cookie', cookies)
                    .send({
                        currentPassword: password,
                        newPassword: "123",
                        confirmPassword: "123"
                    } as UpdatePasswordRequestDto);

                expect(res.status).toBe(HttpStatus.OK);
                expect(res.body).toBeDefined();
                const body = res.body as UpdatePasswordResponseDto;
                expect(body.isTFAPending).toBe(false);
                expect(HttpStatus.OK).toBe(res.status);
            });

        });

        describe("Change password with TFA", () => {
            it("should return HTTP status OK", async () => {

                await prisma.user.update({
                    where: { username },
                    data: {
                        tfaType: TfaType.EMAIL
                    }
                });

                const res = await request(app.getHttpServer())
                    .patch(url)
                    .set('Cookie', cookies)
                    .send({
                        currentPassword: password,
                        newPassword: "123",
                        confirmPassword: "123"
                    } as UpdatePasswordRequestDto);

                expect(res.status).toBe(HttpStatus.OK);
                expect(res.body).toBeDefined();
                const body = res.body as UpdatePasswordResponseDto;
                expect(body.isTFAPending).toBe(true);
                expect(HttpStatus.OK).toBe(res.status);
                
            });
        });
    });
});