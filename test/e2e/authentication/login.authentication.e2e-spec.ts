import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { RedisModule } from '@app/redis/redis.module';
import { RedisConfig } from '@app/redis/redis.config';
import { AuthenticationModule } from '@app/authentication/authentication.module';
import { AppConfig } from '@app/app.config';
import { LoginDto } from '@app/authentication/dtos/login.dto';
import { AppModule } from '@app/app.module';

//TODO: Update enviroments to localhost
//TODO: Create a custom module for testing

describe('Login - POST: authentication/login', () => {
    let app: INestApplication;

    const body: LoginDto =

        beforeAll(async () => {
            const moduleFixture: TestingModule = await Test.createTestingModule({
                imports: [
                    ConfigModule.forRoot({
                        envFilePath: '.env.test'
                    }),
                    BullModule.forRootAsync({
                        imports: [RedisModule],
                        useFactory: async (config: RedisConfig) => ({
                            redis: {
                                port: config.PORT,
                                host: config.HOST
                            },
                        }),
                        inject: [RedisConfig],
                    }),
                    AuthenticationModule
                ],
                providers: [
                    AppConfig
                ]
            }).compile();


            app = moduleFixture.createNestApplication();
            app.useGlobalPipes(new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
                transform: true,
                transformOptions: {
                    enableImplicitConversion: true,
                },
            }));
            await app.init();
        });

    beforeAll(async () => {
        await app.close();
    });

    it('should Http status Unauthorized', async () => {
        return request(app.getHttpServer())
            .post('/authentication/login')
            .send({
                "username": "yonax73",
                "password": "1!",
                "ipClient": "127.0.01"
            })
            .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should return Http status OK', () => {
        return request(app.getHttpServer())
            .post('/authentication/login')
            .send({
                "username": "yonax73",
                "password": "098lkj!",
                "ipClient": "127.0.01"
            })
            .expect(HttpStatus.OK);
    });
});