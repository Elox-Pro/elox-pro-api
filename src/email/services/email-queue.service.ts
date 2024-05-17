import { Injectable } from "@nestjs/common";
import { EMAIL_QUEUE } from "../constants/email.constants";
import { InjectQueue } from "@nestjs/bull";
import Bull, { Queue } from "bull";
import { EmailProcessorRequestDto } from "../dtos/email-processor/email-processor.request.dto";

@Injectable()
export class EmailQueueService {

    constructor(
        @InjectQueue(EMAIL_QUEUE)
        private readonly queue: Queue
    ) { }

    async add(request: EmailProcessorRequestDto): Promise<Bull.Job<any>> {
        return this.queue.add(request);
    }
}