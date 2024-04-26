import { Logger } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { EventGatewayDto } from '@app/common/dto/event-gateway.dto';
import { EventGatewayService } from './event-gateway.service';

@WebSocketGateway(4025, { cors: { origin: '*' } })
export class EventGatewayCommonService extends EventGatewayService {
    private readonly logger = new Logger(EventGatewayCommonService.name);

    @WebSocketServer()
    public readonly server: Server;

    emit(event: EventGatewayDto): void {
        const { message, data } = event;
        this.server.emit(event.to(), { message, data });
        this.logger.log(message, EventGatewayCommonService.name);
    }
}