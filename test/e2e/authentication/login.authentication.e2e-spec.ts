import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { bootstrapTest } from '../test.main';
import { LoginResponseDto } from '@app/authentication/dtos/login-response.dto';

import { Test, TestingModule } from "@nestjs/testing";
// import { TestModule } from "./test.module";
import { ValidationPipe } from "@nestjs/common";
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { AppConfig } from '@app/app.config';
import { AuthenticationModule } from '@app/authentication/authentication.module';
import { RedisModule } from '@app/redis/redis.module';
import { RedisConfig } from '@app/redis/redis.config';


describe('Login - POST: authentication/login', () => {
    let app: INestApplication;

    beforeAll(async () => {
        app = await bootstrapTest();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('wrong password', () => {
        it('should HTTP status Unauthorized', async () => {
            return await request(app.getHttpServer()).post(
                '/authentication/login'
            ).send({
                "username": "yonax73",
                "password": "idontknow",
                "ipClient": "127.0.01"
            }).expect(HttpStatus.UNAUTHORIZED);
        });
    });

    describe('wrong username', () => {
        it('should HTTP status Unauthorized', async () => {
            return await request(app.getHttpServer()).post(
                '/authentication/login'
            ).send({
                "username": "idontknow",
                "password": "098lkj!",
                "ipClient": "127.0.01"
            }).expect(HttpStatus.UNAUTHORIZED);
        });
    });

    describe('tfa - Type: NONE', () => {
        it('should return HTTP status OK', async () => {
            const res = await request(app.getHttpServer()).post(
                '/authentication/login'
            ).send({
                "username": "alaska",
                "password": "098lkj!",
                "ipClient": "127.0.01"
            });
            expect(res.status).toBe(HttpStatus.OK);
            expect(res.body).toBeDefined();

            const body = res.body as LoginResponseDto;

            expect(body.tokens).toBeDefined();

            const { accessToken, refreshToken } = body.tokens;

            expect(accessToken).toBeDefined();
            expect(refreshToken).toBeDefined();
            expect(body.isTFAPending).toBeFalsy();
        });
    });

    describe('tfa - Type: EMAIL', () => {
        it('should return HTTP status OK', async () => {
            const res = await request(app.getHttpServer()).post(
                '/authentication/login'
            ).send({
                "username": "brazil",
                "password": "098lkj!",
                "ipClient": "127.0.01"
            });

            expect(res.status).toBe(HttpStatus.OK);
            expect(res.body).toBeDefined();

            const body = res.body as LoginResponseDto;

            expect(body.tokens).toBeNull();
            expect(body.isTFAPending).toBeTruthy();
        });
    });

});