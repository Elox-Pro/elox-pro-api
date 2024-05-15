import { INestApplication } from "@nestjs/common";
import * as request from "supertest";

/**
 * Enum for HTTP header keys.
 */
enum Key {
    AcceptLanguage = 'accept-language'
}

/**
 * Arguments type for creating HTTP requests.
 */
type Args = {
    app: INestApplication;
    url: string;
    meta?: Record<Key, string>;
};

/**
 * Creates a function to send POST requests to a specified URL.
 *
 * @param {Args} args - The arguments for creating the POST request.
 * @returns {(data: any) => Promise<request.Response>} - A function that sends a POST request with the given data.
 */
export function createPost({ app, url, meta }: Args) {
    return async (data: any): Promise<request.Response> => {
        return await request(app.getHttpServer())
            .post(url)
            .set(Key.AcceptLanguage, meta?.[Key.AcceptLanguage] || 'en')
            .send(data);
    };
}

/**
 * Creates a function to send PATCH requests to a specified URL.
 *
 * @param {Args} args - The arguments for creating the PATCH request.
 * @returns {(data: any) => Promise<request.Response>} - A function that sends a PATCH request with the given data.
 */
export function createPatch({ app, url, meta }: Args) {
    return async (data: any): Promise<request.Response> => {
        return await request(app.getHttpServer())
            .patch(url)
            .set(Key.AcceptLanguage, meta?.[Key.AcceptLanguage] || 'en')
            .send(data);
    };
}
