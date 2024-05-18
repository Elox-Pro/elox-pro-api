export class TfaResponseDto {
    constructor(
        readonly isTFAPending: boolean,
        readonly jobId?: string,
    ) { }
}