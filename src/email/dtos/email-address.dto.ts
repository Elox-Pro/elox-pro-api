export class EmailAddressDto {

    constructor(
        readonly email: string,
        readonly name?: string
    ) {
    }
}