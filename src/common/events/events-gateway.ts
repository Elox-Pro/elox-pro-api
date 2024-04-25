import { Logger } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway(4025, { cors: { origin: '*' } })
export class EventsGateway {

    private readonly logger = new Logger(EventsGateway.name);

    @WebSocketServer()
    public readonly server: Server;

    handleJobSent(username: string, jobId: string) {
        const to = `job-sent-${username}`;
        // const to = "job-sent";
        console.log(to, jobId);
        this.server
            .emit(to, `Job ${jobId} sent`);
        this.logger.log(`TfaStrategyProcessor for: ${jobId}`);
    }

    handleJobSent2(username: string, jobId: string) {
        const to = `job-sent2`;
        this.server.emit(to, `Job ${jobId} sent`);
        this.logger.log(`TfaStrategyProcessor for: ${jobId}`);
    }

    handleJobFailed(username: string, jobId: string, error: string) {
        const to = `job-failed-${username}`;
        this.server
            .emit(to, `Job ${jobId} failed: ${error}`);
        this.logger.error(`TfaStrategyProcessor for: ${jobId} failed`);
    }

    handleJobSucceeded(username: string, jobId: string, result: any) {
        const to = `job-succeeded-${username}`;
        this.server
            .emit(to, `Job ${jobId} succeeded: ${JSON.stringify(result)}`);
        this.logger.log(`TfaStrategyProcessor complete for job: ${jobId}`);
    }
}