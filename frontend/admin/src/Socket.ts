import { io, Socket } from "socket.io-client";

const url = import.meta.env.VITE_WEBSOCKET_URL!;

export class LCSocket {
  private static socket: Socket;

  static Initialize() {
    if (this.socket && this.socket.connected) return;

    const token = localStorage.getItem("token");

    if (!token) return;

    this.socket = io(url, {
      extraHeaders: {
        "Token": token
      }
    });
  }

  static GetInstance(): Socket {
    if (!this.socket) throw new Error("Socket not initialized");

    return this.socket;
  }

  static Close() {
    if (!this.socket) return;

    this.socket.disconnect();
  }
}