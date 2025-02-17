import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { MessageEvent } from "./core/types/message-event.type";
import { JwtService } from "@nestjs/jwt";
import { Server, Socket } from 'socket.io';
import { JwtPayload } from "./core/types/jwt-payload.type";
import { MessageService } from "./message/message.service";
import { ConversationService } from "./conversation/conversation.service";
import { Logger } from "@nestjs/common";
import { User } from "./user/user.entity";
import { UserService } from "./user/user.service";

@WebSocketGateway(80, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
    ]
  }
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private operators: Map<string, [string, number]>;
  private rooms: Map<string, string[]>;

  @WebSocketServer()
  server: Server;

  constructor(
    private readonly jwtService: JwtService,
    private readonly messageService: MessageService,
    private readonly conversationService: ConversationService,
    private readonly userService: UserService,
  ) {
    this.operators = new Map<string, [string, number]>(); // Key: Socket ID, Value: Array[ID Of the Operator, Amount of active Conversaton he has]
    this.rooms = new Map<string, string[]>();
  }

  getConnectedVisitorsCount(): number {
    return this.server.engine.clientsCount - this.operators.size;
  }

  socketIsInConversation(socketId: string, conversationId: string) {
    const rooms = this.rooms.get(socketId);

    return rooms && rooms.includes(conversationId);
  }

  socketIsInAnyConversation(socketId: string) {
    const rooms = this.rooms.get(socketId);
    
    return rooms && rooms.length > 0;
  }

  joinRoom(socket: Socket, conversationId: string) {
    if (this.rooms.has(socket.id)) {
      const values = this.rooms.get(socket.id)!;
      if (values.includes(conversationId)) return;

      this.rooms.set(socket.id, [...values, conversationId]);
    } else {
      this.rooms.set(socket.id, [conversationId]);
    }

    socket.join(conversationId);
  }

  leaveRoom(socket: Socket, conversationId: string) {
    if (!this.rooms.has(socket.id)) return;

    const values = this.rooms.get(socket.id)!;
    this.rooms.set(socket.id, values.filter(i => i !== conversationId));
    socket.leave(conversationId);
  }

  leaveAllRooms(socket: Socket) {
    const rooms = this.rooms.get(socket.id);
    
    if (rooms) {
      rooms.forEach(value => {
        socket.leave(value);
        Logger.log(`${socket.id} has left room ${value}`)
      });
    }


    this.rooms.delete(socket.id);
  }


  canCreateConversation(clientId: string): boolean {
    return !this.operators.has(clientId);
  }

  operatorsAreAvailable() {
    return this.operators.size > 0;
  }

  async registerOperator(socket: Socket) {
    const operatorEntry = this.operators.get(socket.id);

    if (!operatorEntry) return;

    const operatorId = operatorEntry[0];

    const conversations = await this.conversationService.FindAllFor(operatorId);

    conversations.forEach(conv => {
      const { id } = conv;
      
      this.joinRoom(socket, id);
    });
  }

  async getOperatorForNewConversation(): Promise<[string, User] | null> {
    if (this.operators.size <= 0) return null;

    let user: string | null = null;
    let socketId: string | null = null;
    let count = Infinity;

    this.operators.forEach(([userId, conversationCount], socket) => {
      if (conversationCount < count) {
        count = conversationCount;
        socketId = socket;
        user = userId;
      }
    });

    if (!user || !socketId) return null;

    const _user = await this.userService.FindOne(user);
    
    return [socketId, _user!];
  }

  async handleConnection(socket: Socket, ...args: any[]) {
    const { token } = socket.handshake.headers;

    if (token && typeof token === "string") {
      try {
        const data = await this.jwtService.verifyAsync<JwtPayload>(token);
        const count = await this.conversationService.CountActiveFor(data.sub);
        this.operators.set(socket.id, [data.sub, count]);
        this.registerOperator(socket);
      } catch {
        socket.disconnect();
      }
    }

    Logger.log(`${socket.id} is connected`);

    this.server.emit("count", this.getConnectedVisitorsCount());
  }
  
  handleDisconnect(socket: Socket) {
    const { token } = socket.handshake.headers;

    if (token) {
      this.operators.delete(socket.id);
    }

    this.server.emit("count", this.getConnectedVisitorsCount() - 1);
    this.leaveAllRooms(socket);

    Logger.log(`${socket.id} has left`);
  }

  @SubscribeMessage("create-conversation")
  async createConversation(@MessageBody("message") message: string, @ConnectedSocket() socket: Socket) {
    if (!this.operatorsAreAvailable()) return;
    if (!this.canCreateConversation(socket.id)) return;

    if (this.socketIsInAnyConversation(socket.id)) {
      this.leaveAllRooms(socket);
    }

    const userAgent = socket.handshake.headers["user-agent"];

    const newOperator = await this.getOperatorForNewConversation();

    if (!newOperator) return;

    const [operatorSocket, operator] = newOperator;

    const conversation = await this.conversationService.Create({ userAgent, operator: operator.id, message });

    this.joinRoom(socket, conversation.id); // Client side

    Logger.log(`${socket.id} created conversation ${conversation.id}`);
    
    socket.emit("join", conversation); // Client side
    this.server.to(operatorSocket).emit("new-conversation", conversation); // Operator side

    const operatorEntry = this.operators.get(operatorSocket);

    if (operatorEntry) {
      this.operators.set(operatorSocket, [operatorEntry[0], operatorEntry[1] + 1]);
    }
  }

  @SubscribeMessage("open-conversation")
  async openConversation(@MessageBody("conversation") conversation: string, @ConnectedSocket() socket: Socket) {
    const conversationExists = await this.conversationService.Exists(conversation);

    if (!conversationExists || this.socketIsInConversation(socket.id, conversation)) return;

    this.joinRoom(socket, conversation);
    Logger.log(`${socket.id} joined room ${conversation}`);
  }

  @SubscribeMessage("close-conversation")
  closeConversation(@MessageBody("conversation") conversation: string, @ConnectedSocket() socket: Socket) {
    if (!this.socketIsInConversation(socket.id, conversation)) return;

    this.leaveRoom(socket, conversation);
    Logger.log(`${socket.id} has left room ${conversation}`);
}

  @SubscribeMessage("message")
  async sendMessage(@MessageBody() body: MessageEvent, @ConnectedSocket() socket: Socket) {
    if (!this.socketIsInConversation(socket.id, body.conversation)) return;

    const message = await this.messageService.CreateMessage(
      body.conversation,
      body.text,
      this.operators.get(socket.id) ? this.operators.get(socket.id)![0] : undefined
    );

    if (!message) return;

    this.server.in(body.conversation).emit("message", message);
  }
}