import {
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

type RequestType = {
  id: string;
  path: string;
  date: string;
  method: string;
  query: string;
  headers: string;
  body: string;
};

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class WebsocketGateway {
  @WebSocketServer()
  server: Server;
  users = [];

  handleConnection(client: Socket) {
  }

  handleDisconnect(client: Socket) {
  }

  newRequest(request: RequestType ) {
    this.server.emit('newRequest', request);
  }
}