import { RequestLang } from "@app/common/enums/request-lang.enum";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { createJwtCookieSession } from "./create-jwt-cookie-session.test-helper";

/**
 * Credentials type for creating HTTP requests.
 */
type Credentials = {
    username: string
    password: string
}

/**
 * Function type for creating HTTP requests.
 */
export type CreateRequestFN = (data?: any) => Promise<request.Response>;

/**
 * Arguments type for creating HTTP requests.
 */
type Args = {
    app: INestApplication;
    url: string;
    meta?: Record<string, string>;
    credentials?: Credentials;
};

/**
 * Creates a function to send POST requests to a specified URL.
 *
 * @param {Args} args - The arguments for creating the POST request.
 * @returns {(data: any) => Promise<request.Response>} - A function that sends a POST request with the given data.
 */
export function createPost({ app, url, meta }: Args): CreateRequestFN {
    return async (data: any): Promise<request.Response> => {
        return await request(app.getHttpServer())
            .post(url)
            .set("accept-language", meta?.["accept-language"] || RequestLang.EN)
            .set("cookie", meta?.["cookie"] || null)
            .send(data);
    };
}

/**
 * Creates a function to send PATCH requests to a specified URL.
 *
 * @param {Args} args - The arguments for creating the PATCH request.
 * @returns {(data: any) => Promise<request.Response>} - A function that sends a PATCH request with the given data.
 */
export function createPatch({ app, url, meta }: Args): CreateRequestFN {
    return async (data: any): Promise<request.Response> => {
        return await request(app.getHttpServer())
            .patch(url)
            .set("accept-language", meta?.["accept-language"] || RequestLang.EN)
            .send(data);
    };
}

/**
 * Creates a function to send GET requests to a specified URL.
 *
 * @remarks
 * This function is used to send GET requests to the server with the provided URL,
 * meta information, and credentials. It retrieves cookies for authentication if
 * the credentials are provided.
 *
 * @param {Args} args - The arguments for creating the GET request.
 * @returns {(data?: any) => Promise<request.Response>} - A function that sends a GET request.
 *
 * @throws Will throw an error if the server request fails.
 *
 * @example
 * ```typescript
 * const app = await NestFactory.create(AppModule);
 * const credentials = { username: 'john', password: 'ecret' };
 * const getRequest = createGet({ app, url: '/api/users', meta: { ["accept-language"]: RequestLang.EN }, credentials });
 * const response = await getRequest();
 * ```
 */
export function createGet({ app, url, meta, credentials }: Args): CreateRequestFN {
    return async (data: any): Promise<request.Response> => {
        const cookies = await getCookies(app, credentials);
        return await request(app.getHttpServer())
            .get(url)
            .set("accept-language", meta?.["accept-language"] || RequestLang.EN)
            .set("cookie", cookies)// TODO: Refactor this code in conflict with meta cookies
            .send(data);
    }
};

/**
 * Function to retrieve cookies for authentication.
 *
 * @remarks
 * This function is used to obtain the necessary cookies for authentication
 * by making a request to the server with the provided credentials.
 *
 * @param {INestApplication} app - The NestJS application instance.
 * @param {Credentials} credentials - The user's credentials for authentication.
 * @returns {Promise<string | null>} - A promise that resolves to an string of cookies
 * if the credentials are valid, or null if the credentials are not provided.
 *
 * @throws Will throw an error if the server request fails.
 *
 * @example
 * ```typescript
 * const app = await NestFactory.create(AppModule);
 * const credentials = { username: 'john', password: 'ecret' };
 * const cookies = await getCookies(app, credentials);
 * ```
 */
async function getCookies(app: INestApplication, credentials: Credentials): Promise<string | null> {
    if (!credentials) {
        return null;
    }
    const { username, password } = credentials;
    return await createJwtCookieSession(app.getHttpServer(), username, password);
}
