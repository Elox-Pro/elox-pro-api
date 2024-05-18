import { EMAIL_QUEUE } from "../constants/email.constants";
import { Process, Processor } from "@nestjs/bull";
import { Logger } from "@nestjs/common";
import { Job } from "bull";
import { EmailFactory } from "../factories/email.factory";
import { EmailProcessorRequestDto } from "../dtos/email-processor/email-processor.request.dto";
import { EmailAddressDto } from "../dtos/email-address.dto";

@Processor(EMAIL_QUEUE)
export class EmailProcessor {

    private readonly logger = new Logger(EmailProcessor.name);

    constructor(private readonly emailFactory: EmailFactory) { }

    @Process()
    async run(job: Job<EmailProcessorRequestDto>) {
        this.logger.log(`EmailProcessor for: ${job.id}`);

        const data = job.data;
        if (!data) {
            this.logger.error('data is required');
            throw new Error('data is required');
        }

        const template = this.emailFactory.getEmail(data.type);
        if (!template) {
            this.logger.error('Template is required');
            throw new Error('Template is required');
        }

        const { email, username } = data.user;

        try {
            await template.send(new EmailAddressDto(email, username), new Map<string, string>([
                ['lang', data.lang],
                ['username', username],
            ]));

        } catch (error) {
            this.logger.error(`EmailProcessor for: ${job.id} failed`);
            console.error(error);
            throw new Error(error.message);
        }

        this.logger.log(`EmailProcessor complete for job: ${job.id}`);
    }
}