import { TfaStatusService } from "@app/tfa/services/tfa-status.service";

/**
 * Possible statuses for a job to be considered completed or failed.
 */
const PollJobStatus = ["completed", "failed"];

/**
 * Arguments type for polling job status.
 */
type Args = {
    statusService: TfaStatusService;
    jobId: string;
    retries?: number; // Number of retries before giving up
    delay?: number;   // Delay in milliseconds between retries
};

/**
 * Polls the status of a job until it is either completed or failed, or until the maximum number of retries is reached.
 *
 * @param {Args} args - The arguments for polling the job status.
 * @param {TfaStatusService} args.statusService - The service to check the job status.
 * @param {string} args.jobId - The ID of the job to check.
 * @param {number} [args.retries=10] - The maximum number of retries.
 * @param {number} [args.delay=1000] - The delay in milliseconds between retries.
 * @returns {Promise<string>} - A promise that resolves with the job status if it is completed or failed.
 * @throws {Error} - Throws an error if the job status check times out.
 */
export async function pollJobStatus({
    statusService,
    jobId,
    retries = 5,
    delay = 1000
}: Args): Promise<string> {
    let attempt = 0;

    do {
        const jobStatus = await statusService.getJobStatus(jobId);
        if (PollJobStatus.includes(jobStatus)) {
            return jobStatus;
        }
        await new Promise(resolve => setTimeout(resolve, delay));
        attempt++;
    } while (attempt < retries);

    throw new Error('Job status check timed out');
}
