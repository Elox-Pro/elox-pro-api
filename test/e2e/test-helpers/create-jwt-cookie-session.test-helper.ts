import { RequestLang } from '@app/common/enums/request-lang.enum';
import { HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
export async function createJwtCookieSession(server: any, username: string, password: string): Promise<string> {

    const url = '/authentication/login';
    const res = await request(server)
        .post(url)
        .set("accept-language", RequestLang.EN)
        .send({
            "username": username,
            "password": password,
            "grecaptchaToken": "<TOKEN>"
        });

    if (res.status !== HttpStatus.OK) {
        console.error("createJwtCookieSession", res.status, res.error);
        throw new Error('Could not login');
    }

    return res.headers['set-cookie']
}