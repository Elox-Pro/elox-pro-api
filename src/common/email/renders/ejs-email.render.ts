import { Injectable } from "@nestjs/common";
import { RenderEmailService } from "./email.render";
import ejs from "ejs";

@Injectable()
export class EJSEmailRender extends RenderEmailService {
    async render(filePath: string, params: Map<string, string>): Promise<string> {
        return await ejs.renderFile(filePath, params);
    }
}