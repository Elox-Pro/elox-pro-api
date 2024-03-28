import { Injectable } from "@nestjs/common";
import { EmailRender } from "./email.render";
import * as ejs from "ejs";

@Injectable()
export class EJSEmailRender extends EmailRender {
    async render(filePath: string, params: Map<string, string>): Promise<string> {
        return await ejs.renderFile(filePath, Object.fromEntries(params));
    }
}