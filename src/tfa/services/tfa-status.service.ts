import { Injectable } from "@nestjs/common";
import { TFA_STRATEGY_QUEUE } from "../constants/tfa.constants";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";

@Injectable()
export class TfaStatusService {

    constructor(
        @InjectQueue(TFA_STRATEGY_QUEUE)
        private readonly tfaQueue: Queue,
    ) { }

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
     * @returns {Promise<any | null>} - The detailed information of the job or null if the job does not exist.
     */
    async getJobDetails(jobId: string): Promise<any | null> {
        const job = await this.tfaQueue.getJob(jobId);
        if (!job) {
            return null;
        }
        return job;
    }
}