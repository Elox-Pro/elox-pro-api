import { HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
export async function createJwtCookieSession(
    server: any, username: string, password: string
): Promise<string> {
    const url = '/authentication/login';
    const res = await request(server).post(url).send({
        "username": username,
        "password": password,
        "ipClient": "127.0.01",
        "grecaptchaToken": "<TOKEN>"
    });

    if (res.status !== HttpStatus.OK) {
        throw new Error('Could not login');
    }

    return res.headers['set-cookie']
}