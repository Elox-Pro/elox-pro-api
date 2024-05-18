import { TfaResponseDto } from "@app/common/dto/tfa.response.dto";

export class UpdateEmailResponseDto extends TfaResponseDto {
    constructor(
        readonly isTFAPending: boolean,
        readonly jobId?: string,
    ) {
        super(isTFAPending, jobId);
    }
}