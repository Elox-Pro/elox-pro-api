import { EventGatewayDto } from "@app/common/dto/event-gateway.dto";

export abstract class EventGatewayService {
    abstract emit(event: EventGatewayDto): void;
}