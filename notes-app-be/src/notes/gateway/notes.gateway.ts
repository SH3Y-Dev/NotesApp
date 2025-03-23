import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: ['process.env.FE_URL'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
})
export class NotesGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  handleConnection(client: any) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: any) {
    console.log(`Client disconnected: ${client.id}`);
  }

  emitNoteCreated(note: any, clientId: string) {
    this.server.except(clientId).emit('noteCreated', note);
  }

  emitNoteUpdated(note: any) {
    this.server.emit('noteUpdated', note);
  }

  emitNoteDeleted(id: string) {
    this.server.emit('noteDeleted', id);
  }
}
