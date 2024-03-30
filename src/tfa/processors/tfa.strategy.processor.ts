import { Process, Processor } from "@nestjs/bull";
import { TFA_STRATEGY_QUEUE } from "../constants/tfa.constants";
import { Logger } from "@nestjs/common";
import { Job } from "bull";
import { TfaRequestDto } from "../dtos/tfa/tfa.request.dto";
import { TfaFactory } from "../factories/tfa.factory";
import { getDefaultTfaType } from "@app/common/helpers/get-default-tfa-type";

@Processor(TFA_STRATEGY_QUEUE)
export class TfaStrategyProcessor {

    private readonly logger = new Logger(TfaStrategyProcessor.name);

    constructor(private readonly tfaFactory: TfaFactory) { }

    @Process()
    async run(job: Job<TfaRequestDto>) {
        this.logger.log(`TfaStrategyProcessor for: ${job.id}`);

        const data = job.data;
        if (!data) {
            this.logger.error('data is required');
            throw new Error('data is required');
        }

        const type = getDefaultTfaType(data.user.tfaType);

        const strategy = this.tfaFactory.createStrategy(type);
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