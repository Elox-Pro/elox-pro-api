import { Injectable } from "@nestjs/common";
import { EmailDTO } from "./dtos/email.dto";

@Injectable()
export abstract class EmailService {
    abstract send(data: EmailDTO): Promise<Boolean>;
}