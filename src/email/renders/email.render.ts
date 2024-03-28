import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class EmailRender {
    abstract render(filePath: string, params: Map<string, string>): Promise<string>;
}