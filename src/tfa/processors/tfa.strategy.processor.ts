import { Process, Processor } from "@nestjs/bull";
import { TFA_STRATEGY_QUEUE } from "../constants/tfa.constants";
import { Logger } from "@nestjs/common";
import { Job } from "bull";
import { TfaRequestDto } from "../dtos/tfa/tfa.request.dto";
import { TfaFactory } from "../factories/tfa.factory";
import { getDefaultTfaType } from "@app/common/helpers/get-default-tfa-type";
import { EventsGateway } from "@app/common/events/events-gateway";

@Processor(TFA_STRATEGY_QUEUE)
export class TfaStrategyProcessor {

    private readonly logger = new Logger(TfaStrategyProcessor.name);

    constructor(
        private readonly tfaFactory: TfaFactory,
        private readonly eventsGateway: EventsGateway
    ) { }

    @Process()
    async run(job: Job<TfaRequestDto>) {
        const data = job.data;
        const user = data.user;
        try {


            // await for one second
            await new Promise((resolve) => setTimeout(resolve, 3000));

            this.eventsGateway.handleJobSent(user.username, String(job.id));
            // this.eventsGateway.handleJobSent2(user.username, String(job.id));

            const type = getDefaultTfaType(user.tfaType);
            const strategy = this.tfaFactory.createStrategy(type);
            await strategy.execute(data);

            this.eventsGateway.handleJobSucceeded(user.username, String(job.id), {
                type,
                action: data.action,
            });

        } catch (error) {
            this.eventsGateway.handleJobFailed(user.username, String(job.id), error.message);
        }
    }

}