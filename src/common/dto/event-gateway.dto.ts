export class EventGatewayDto {

    constructor(
        readonly event: string,
        readonly message: string,
        readonly id: string | null,
        readonly data: Record<string, string> | null
    ) { }

    to(): string {
        if (this.id === null) {
            return String(this.event);
        }
        return `${this.event}:${this.id}`
    }
}