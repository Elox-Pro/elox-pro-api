import { Injectable } from "@nestjs/common";
import { EmailDTO } from "../dtos/email.dto";
import { EmailSender } from "./email.sender";
import nodemailer, { Transporter } from "nodemailer";
import { EmailConfig } from "../email.config";
import Mail from "nodemailer/lib/mailer";
import { EmailRender } from "../renders/email.render";

@Injectable()
export class NodeMailerSender extends EmailSender {

    private transporter: Transporter;

    constructor(
        private readonly config: EmailConfig,
        private readonly emailRender: EmailRender
    ) {
        super();

        this.transporter = nodemailer.createTransport({
            host: this.config.HOST,
            port: this.config.PORT,
            auth: {
                user: this.config.USERNAME,
                pass: this.config.PASSWORD
            }
        });
    }

    public send(data: EmailDTO): Promise<Boolean> {
        return new Promise(async (resolve, reject) => {
            this.transporter.sendMail(await this.mapper(data), (error) => {
                if (error) {
                    return reject(new Error(error.message));
                }
                return resolve(true);
            });
        });
    }

    private async mapper(data: EmailDTO): Promise<Mail.Options> {
        return {
            from: {
                name: data.from.name || '',
                address: data.from.email
            },
            to: {
                name: data.to.name || '',
                address: data.to.email
            },
            subject: data.subject,
            html: await this.emailRender.render(data.filePath, data.params)
        }
    }
}