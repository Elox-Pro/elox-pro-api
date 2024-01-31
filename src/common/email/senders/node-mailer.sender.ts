import { Injectable, Logger } from "@nestjs/common";
import { EmailDTO as EmailDto } from "../dtos/email.dto";
import { EmailSender } from "./email.sender";
import * as nodemailer from "nodemailer";
import { EmailConfig } from "../email.config";
import Mail, { Address } from "nodemailer/lib/mailer";
import { EmailRender } from "../renders/email.render";

@Injectable()
export class NodeMailerSender extends EmailSender {

    private readonly logger = new Logger(NodeMailerSender.name);
    private transporter: nodemailer.Transporter;

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

    public send(emailDto: EmailDto): Promise<Boolean> {
        return new Promise(async (resolve, reject) => {
            const mailOptions = await this.mapper(emailDto);
            this.transporter.sendMail(mailOptions, (error) => {
                if (error) {
                    this.logger.error(error.message);
                    return reject(new Error(error.message));
                }
                this.logger.log(`Email sent to ${emailDto.to.email}, subject: ${emailDto.subject}`);
                return resolve(true);
            });
        });
    }

    private async mapper(emailDto: EmailDto): Promise<Mail.Options> {

        return {
            from: {
                name: emailDto.from.name || '',
                address: emailDto.from.email
            },
            to: {
                name: emailDto.to.name || '',
                address: emailDto.to.email
            },
            subject: emailDto.subject,
            html: await this.emailRender.render(emailDto.filePath, emailDto.params)
        }
    }
}