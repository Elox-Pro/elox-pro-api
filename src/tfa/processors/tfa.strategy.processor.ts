import { Process, Processor } from "@nestjs/bull";
import { TFA_STRATEGY_QUEUE } from "../constants/tfa.constants";
import { Job } from "bull";
import { TfaRequestDto } from "../dtos/tfa/tfa.request.dto";
import { TfaFactory } from "../factories/tfa.factory";
import { getDefaultTfaType } from "@app/common/helpers/get-default-tfa-type";
import { EventGatewayDto } from "@app/common/dto/event-gateway.dto";
import { EventGatewayService } from "@app/common/services/event-gateway/event-gateway.service";
import { TfaEvent } from "../enums/tfa-event.enum";

@Processor(TFA_STRATEGY_QUEUE)
export class TfaStrategyProcessor {

    constructor(
        private readonly tfaFactory: TfaFactory,
        private readonly eventGatewayService: EventGatewayService
    ) { }

    /**
     * Processes TFA requests received from the TFA strategy queue.
     *
     * @param {Job<TfaRequestDto>} job - The job containing TFA request data.
     */
    @Process()
    async run(job: Job<TfaRequestDto>) {
        const data = job.data;
        const user = data.user;

        try {
            const type = getDefaultTfaType(user.tfaType);
            const strategy = this.tfaFactory.createStrategy(type);
            await strategy.execute(data);

            this.handleSuccess(job, data, user);
        } catch (error) {
            this.handleError(job, data, user, error);
        }
    }

    /**
     * Handles successful execution of a TFA strategy.
     *
     * @param {Job<TfaRequestDto>} job - The job containing TFA request data.
     * @param {TfaRequestDto} data - The TFA request data.
     * @param {any} user - The user associated with the TFA request.
     */
    private handleSuccess(job: Job<TfaRequestDto>, data: TfaRequestDto, user: any) {
        const logMessage = `TFA strategy ${data.action} succeeded - Job id: ${job.id}`;
        this.emitWebSocketEvent(job, user, TfaEvent.SUCCEEDED, logMessage);
    }

    /**
     * Handles errors during execution of a TFA strategy.
     *
     * @param {Job<TfaRequestDto>} job - The job containing TFA request data.
     * @param {TfaRequestDto} data - The TFA request data.
     * @param {any} user - The user associated with the TFA request.
     * @param {any} error - The error encountered during execution.
     */
    private handleError(job: Job<TfaRequestDto>, data: TfaRequestDto, user: any, error: any) {
        const logMessage = `TFA strategy ${data.action} failed - Job id: ${job.id}`;
        this.emitWebSocketEvent(job, user, TfaEvent.FAILED, logMessage, error.message);
    }

    /**
     * Emits a WebSocket event based on TFA strategy execution.
     *
     * @param {Job<TfaRequestDto>} job - The job containing TFA request data.
     * @param {any} user - The user associated with the TFA request.
     * @param {TfaEvent} event - The TFA event type (SUCCEEDED or FAILED).
     * @param {string} message - The message to emit.
     * @param {string} [error] - Optional error message.
     */
    private emitWebSocketEvent(job: Job<TfaRequestDto>, user: any, event: TfaEvent, message: string, error?: string) {
        const eventDto = new EventGatewayDto(
            event,
            message,
            user.username,
            {
                jobId: String(job.id),
                action: job.data.action,
                error: error
            }
        );
        this.eventGatewayService.emit(eventDto);
    }
}
