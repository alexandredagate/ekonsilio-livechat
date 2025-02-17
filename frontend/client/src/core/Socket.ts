import { io, Socket } from "socket.io-client";

const url = import.meta.env.VITE_WEBSOCKET_URL!;

export class LCSocket {
  private static socket: Socket;

  static Initialize() {
    if (this.Connected()) return;

    this.socket = io(url, {
      autoConnect: false
    });

    return this.socket;
  }

  static GetInstance(): Socket {
    if (!this.socket) throw new Error("Socket not initialized and/or not connected");

    return this.socket;
  }

  static Connected(): boolean {
    return this.socket && this.socket.connected;
  }

  static Close() {
    if (!this.socket) return;

    this.socket.disconnect();
  }
}