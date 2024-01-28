import { Injectable } from "@nestjs/common";
import { EmailDTO } from "./dtos/email.dto";
import { EmailService } from "./email.service";
import nodemailer, { Transporter } from "nodemailer";
import { EmailConfig } from "./email.config";
import Mail from "nodemailer/lib/mailer";

@Injectable()
export class NodeMailerService extends EmailService {

    private transporter: Transporter;

    constructor(private readonly config: EmailConfig) {
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

    send(data: EmailDTO): Promise<Boolean> {
        return new Promise((resolve, reject) => {
            this.transporter.sendMail(mapper(data), (error) => {
                if (error) {
                    return reject(new Error(error.message));
                }
                return resolve(true);
            });
        });

    }
}

//TODO: Complete this function
function mapper(data: EmailDTO): Mail.Options {
    return {
        from: data.from.email,
        to: data.to.email,
        subject: data.subject,
        text: data.text,
        html: data.html
    }
}