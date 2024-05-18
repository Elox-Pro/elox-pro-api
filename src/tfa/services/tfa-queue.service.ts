import { Injectable } from "@nestjs/common";
import { TFA_STRATEGY_QUEUE } from "../constants/tfa.constants";
import { InjectQueue } from "@nestjs/bull";
import Bull, { Queue } from "bull";
import { TfaRequestDto } from "../dtos/tfa/tfa.request.dto";

@Injectable()
export class TfaQueueService {

    constructor(
        @InjectQueue(TFA_STRATEGY_QUEUE)
        private readonly tfaQueue: Queue,
    ) { }

    /**
     * Add a job to the TFA strategy queue.
     *
     * @param {TfaRequestDto} tfaRequest - The TFA request data.
     * @returns {Promise<Bull.Job<any>>} - The job that was added to the queue.
     */
    async add(tfaRequest: TfaRequestDto): Promise<Bull.Job<any>> {
        return this.tfaQueue.add(tfaRequest);
    }

    /**
     * Get the status of a job by its ID.
     *
     * @param {string} jobId - The ID of the job to check.
     * @returns {Promise<string | null>} - The status of the job or null if the job does not exist.
     */
    async getJobStatus(jobId: string): Promise<string | null> {
        const job = await this.tfaQueue.getJob(jobId);
        if (!job) {
            return null;
        }
        return job.getState();
    }

    /**
     * Get detailed information about a job by its ID.
     *
     * @param {string} jobId - The ID of the job to check.
     * @returns {Promise<TfaRequestDto | null>} - The detailed information of the job or null if the job does not exist.
     */
    async getJobDetails(jobId: string): Promise<TfaRequestDto | null> {
        const job = await this.tfaQueue.getJob(jobId);
        if (!job) {
            return null;
        }
        return job.data
    }
}