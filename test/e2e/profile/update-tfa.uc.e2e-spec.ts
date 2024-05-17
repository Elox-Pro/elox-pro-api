import { HttpStatus, INestApplication } from "@nestjs/common";
import { bootstrapTest } from "../test.main";
import { AuthenticationModule } from "@app/authentication/authentication.module";
import { UserModule } from "@app/user/user.module";
import { createJwtCookieSession } from "../test-helpers/create-jwt-cookie-session.test-helper";
import * as request from "supertest";
import { TfaType, User } from "@prisma/client";
import { PrismaService } from "@app/prisma/prisma.service";
import { UpdateTfaRequestDto } from "@app/user/dtos/update-tfa/update-tfa.request.dto";
import { UpdateTfaResponseDto } from "@app/user/dtos/update-tfa/update-tfa.response.dto";

describe("Update tfa type use case", () => {
    const username = "alaska";
    const password = "098lkj!";
    const url = "/users/profile/tfa";

    let app: INestApplication;
    let cookies: string;
    let user: User;
    let prisma: PrismaService;

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
                emailVerified: user.emailVerified,
                tfaType: user.tfaType
            }
        });
    });

    afterAll(async () => {
        await app.close();
    });

    describe("PATCH: users/profile/name", () => {

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

        describe("Update to Email TFA", () => {
            describe("Email not verified", () => {

                it("should return HTTP status BAD REQUEST", async () => {
                    await prisma.user.update({
                        where: { username },
                        data: { emailVerified: false }
                    });

                    const res = await request(app.getHttpServer())
                        .patch(url)
                        .set('Cookie', cookies)
                        .send({
                            tfaType: TfaType.EMAIL,
                        } as UpdateTfaRequestDto);

                    expect(res.status).toBe(HttpStatus.BAD_REQUEST);
                });

                it("should return HTTP status OK", async () => {
                    await prisma.user.update({
                        where: { username },
                        data: { emailVerified: true }
                    });

                    const res = await request(app.getHttpServer())
                        .patch(url)
                        .set('Cookie', cookies)
                        .send({
                            tfaType: TfaType.EMAIL,
                        } as UpdateTfaRequestDto);

                    expect(res.status).toBe(HttpStatus.OK);
                    expect(res.body).toBeDefined();
                    const body = res.body as UpdateTfaResponseDto;
                    expect(body.OK).toBe(true);
                    expect(HttpStatus.OK).toBe(res.status);
                });
            });
        });

        describe("Update to NONE TFA", () => {

            it("should return HTTP status OK", async () => {
                await prisma.user.update({
                    where: { username },
                    data: { tfaType: TfaType.EMAIL }
                });

                const res = await request(app.getHttpServer())
                    .patch(url)
                    .set('Cookie', cookies)
                    .send({
                        tfaType: TfaType.NONE,
                    } as UpdateTfaRequestDto);

                expect(res.status).toBe(HttpStatus.OK);
                expect(res.body).toBeDefined();
                const body = res.body as UpdateTfaResponseDto;
                expect(body.OK).toBe(true);
                expect(HttpStatus.OK).toBe(res.status);
            });
        });
    });
});