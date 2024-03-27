import { Process, Processor } from "@nestjs/bull";
import { TFA_STRATEGY_QUEUE } from "../constants/authentication.constants";
import { Logger } from "@nestjs/common";
import { Job } from "bull";
import { TFARequestDto } from "../dtos/tfa/tfa.request.dto";
import { TFAFactory } from "../factories/tfa.factory";

@Processor(TFA_STRATEGY_QUEUE)
export class TfaStrategyProcessor {

    private readonly logger = new Logger(TfaStrategyProcessor.name);

    constructor(private readonly tfaFactory: TFAFactory) { }

    @Process()
    async run(job: Job<TFARequestDto>) {
        this.logger.log(`TfaStrategyProcessor for: ${job.id}`);

        const data: TFARequestDto = job.data;
        if (!data) {
            this.logger.error('data is required');
            throw new Error('data is required');
        }

        const strategy = this.tfaFactory.getTfaStrategy(data.user.tfaType);
        if (!strategy) {
            this.logger.error('TfaStrategy is required');
            throw new Error('TfaStrategy is required');
        }

        try {
            await strategy.execute(data);
        } catch (error) {
            this.logger.error(`TfaStrategyProcessor for: ${job.id} failed`);
            throw new Error(error.message);
        }

        this.logger.log(`TfaStrategyProcessor complete for job: ${job.id}`);
    }

}