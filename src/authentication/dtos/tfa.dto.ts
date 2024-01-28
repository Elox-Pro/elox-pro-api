export class TfaDTO {
    readonly email: string;
    readonly username: string;

    constructor(tfaDto: Partial<TfaDTO>) {
        Object.assign(this, tfaDto);
    }

}