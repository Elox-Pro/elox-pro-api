import { Process, Processor } from "@nestjs/bull";
import { TFA_STRATEGY_QUEUE } from "../constants/tfa.constants";
import { Job } from "bull";
import { TfaRequestDto } from "../dtos/tfa/tfa.request.dto";
import { TfaFactory } from "../factories/tfa.factory";
import { getDefaultTfaType } from "@app/common/helpers/get-default-tfa-type";
import { EventGatewayDto } from "@app/common/dto/event-gateway.dto";
import { EventGatewayService } from "@app/common/services/event-gateway/event-gateway.service";
import { TfaEvent } from "../enums/tfa-event.enum";
import { I18nService } from "nestjs-i18n";

@Processor(TFA_STRATEGY_QUEUE)
export class TfaStrategyProcessor {

    constructor(
        private readonly tfaFactory: TfaFactory,
        private readonly eventGatewayService: EventGatewayService,
        private readonly i18n: I18nService
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
          
            // Wait for a moment before sending the TFA request.
            await new Promise(resolve => setTimeout(resolve, 500));

            const type = getDefaultTfaType(user.tfaType);
            const strategy = this.tfaFactory.createStrategy(type);
            await strategy.execute(data);

            await this.handleSuccess(job, data, user.username);
        } catch (error) {
            await this.handleError(job, data, user.username, error);
        }
    }

    /**
     * Handles successful execution of a TFA strategy.
     *
     * @param {Job<TfaRequestDto>} job - The job containing TFA request data.
     * @param {TfaRequestDto} data - The TFA request data.
     * @param {string} username - The username associated with the TFA request.
     */
    private async handleSuccess(job: Job<TfaRequestDto>, data: TfaRequestDto, username: string) {

        const message = await this.i18n.t("tfa.succeeded", {
            lang: data.lang.toLocaleLowerCase()
        });

        this.emitWebSocketEvent(job, username, TfaEvent.SUCCEEDED, message);
    }

    /**
     * Handles errors during execution of a TFA strategy.
     *
     * @param {Job<TfaRequestDto>} job - The job containing TFA request data.
     * @param {TfaRequestDto} data - The TFA request data.
     * @param {string} username - The username associated with the TFA request.
     * @param {any} error - The error encountered during execution.
     */
    private async handleError(job: Job<TfaRequestDto>, data: TfaRequestDto, username: string, error: any) {
        const message = await this.i18n.t("tfa.failed", {
            lang: data.lang.toLocaleLowerCase()
        });

        this.emitWebSocketEvent(job, username, TfaEvent.FAILED, message, error.message);
    }

    /**
     * Emits a WebSocket event based on TFA strategy execution.
     *
     * @param {Job<TfaRequestDto>} job - The job containing TFA request data.
     * @param {string} username - The username associated with the TFA request.
     * @param {TfaEvent} event - The TFA event type (SUCCEEDED or FAILED).
     * @param {string} message - The message to emit.
     * @param {string} [error] - Optional error message.
     */
    private emitWebSocketEvent(job: Job<TfaRequestDto>, username: string, event: TfaEvent, message: string, error?: string) {
        const eventDto = new EventGatewayDto(
            event,
            message,
            username,
            {
                jobId: String(job.id),
                action: job.data.action,
                error: error
            }
        );
        this.eventGatewayService.emit(eventDto);
    }
}
