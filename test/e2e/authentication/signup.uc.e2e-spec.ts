import { HttpStatus, INestApplication } from "@nestjs/common";
import { bootstrapTest } from "../test.main";
import * as request from "supertest";

describe('signup Use Case', () => {
    let app: INestApplication;

    beforeAll(async () => {
        app = await bootstrapTest();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('POST: authentication/signup', () => {
        const url = '/authentication/signup';
        it('should return HTTP status CREATED', async () => {
            return await request(app.getHttpServer()).post(url).send({
                "username": `alaska:${Date.now()}`,
                "password": "0987lkj",
                "ipClient": "127.0.01"
            }).expect(HttpStatus.CREATED);
        });
    });
});