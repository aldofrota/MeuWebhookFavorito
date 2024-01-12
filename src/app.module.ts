import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { WebsocketGateway } from './websocket.gateway';

@Module({
  imports: [WebsocketGateway],
  controllers: [WebhookController],
  providers: [WebsocketGateway],
})
export class AppModule {}
