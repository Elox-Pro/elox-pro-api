import { RequestLang } from "@app/common/enums/request-lang.enum";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { createJwtCookieSession } from "./create-jwt-cookie-session.test-helper";

type MetaType = "cookie" | "accept-language";

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
    meta?: Partial<Record<MetaType, string>>;
    credentials?: Credentials;
};

/**
 * Creates a function to send POST requests to a specified URL.
 *
 * @param {Args} args - The arguments for creating the POST request.
 * @returns {(data: any) => Promise<request.Response>} - A function that sends a POST request with the given data.
 */
export function createPost({ app, url, meta, credentials }: Args): CreateRequestFN {
    return async (data: any): Promise<request.Response> => {
        const authCookies = await getAuthCookies(app, credentials);
        const cookies = mergeCookies(authCookies, meta?.["cookie"]);
        return await request(app.getHttpServer())
            .post(url)
            .set("accept-language", meta?.["accept-language"] || RequestLang.EN)
            .set("Cookie", cookies)
            .send(data);
    };
}

/**
 * Creates a function to send PATCH requests to a specified URL.
 *
 * @param {Args} args - The arguments for creating the PATCH request.
 * @returns {(data: any) => Promise<request.Response>} - A function that sends a PATCH request with the given data.
 */
export function createPatch({ app, url, meta, credentials }: Args): CreateRequestFN {
    return async (data: any): Promise<request.Response> => {
        const authCookies = await getAuthCookies(app, credentials);
        const cookies = mergeCookies(authCookies, meta?.["cookie"]);
        return await request(app.getHttpServer())
            .patch(url)
            .set("accept-language", meta?.["accept-language"] || RequestLang.EN)
            .set("Cookie", cookies)
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
        const authCookies = await getAuthCookies(app, credentials);
        const cookies = mergeCookies(authCookies, meta?.["cookie"]);
        return await request(app.getHttpServer())
            .get(url)
            .set("accept-language", meta?.["accept-language"] || RequestLang.EN)
            .set("Cookie", cookies)
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
async function getAuthCookies(app: INestApplication, credentials: Credentials): Promise<string | null> {
    if (!credentials) {
        return null;
    }
    const { username, password } = credentials;
    return await createJwtCookieSession(app.getHttpServer(), username, password);
}


/**
 * Function to merge two sets of cookies into a single string.
 *
 * @remarks
 * This function takes two strings representing cookies and merges them into a single string.
 * It handles cases where either or both of the input strings may be null or empty.
 *
 * @param {string | null} cookies1 - The first set of cookies.
 * @param {string | null} cookies2 - The second set of cookies.
 * @returns {string | null} - The merged cookies as a single string, or null if both input strings are null.
 *
 * @throws Will throw an error if the input strings are not in a valid format.
 *
 * @example
 * ```typescript
 * const cookies1 = 'session=abc123; user=john';
 * const cookies2 = 'lang=en; theme=dark';
 * const mergedCookies = mergeCookies(cookies1, cookies2);
 * console.log(mergedCookies); // 'session=abc123; user=john, lang=en; theme=dark'
 * ```
 */
function mergeCookies(cookies1: string | null, cookies2: string | null): string | null {
    // Check if both inputs are null
    if (!cookies1 && !cookies2) return null;

    // Extract cookie arrays from the input strings
    const getCookiesArray = (cookieString: string | null): string[] => {
        if (cookieString === null) return [];
        const cleanedString = cookieString.toString().trim();
        return cleanedString.split(/,\s*(?='.*?')/).map(cookie => cookie.trim());
    };

    let cookiesArray1: string[] = [];
    let cookiesArray2: string[] = [];

    try {
        // Extract cookie arrays from the input strings
        cookiesArray1 = getCookiesArray(cookies1 || null);
        cookiesArray2 = getCookiesArray(cookies2 || null);
    } catch (err) {
        // Handle invalid input format
        console.error('Create Request Error:', err.message);
        return null;
    }

    // Merge the cookie arrays
    const mergedCookiesArray = [...cookiesArray1, ...cookiesArray2];

    // Join the merged array and add the prefix and suffix
    return `${mergedCookiesArray.join(', ')}`;
}