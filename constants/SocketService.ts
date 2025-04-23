import { io, Socket } from 'socket.io-client';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base URL for WebSocket connection
const SOCKET_URL =
  Platform.OS === 'web' ? 'http://localhost:3000' : 'http://10.0.2.2:3000';

class SocketService {
  private socket: Socket | null = null;
  private static instance: SocketService;

  private constructor() {}

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public async connect(): Promise<Socket> {
    try {
      // Using 'authToken' instead of 'token'
      const token = await AsyncStorage.getItem('authToken');

      if (!token) {
        console.warn('Authentication token not found');
        // Still proceed with connection but without auth
      }

      // Create socket with compatible options for socket.io-client 4.5.1
      this.socket = io(SOCKET_URL, {
        auth: token ? { token } : undefined,
        extraHeaders: token ? { Authorization: `Bearer ${token}` } : undefined,
        forceNew: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 20000,
      });

      this.socket.on('connect', () => {
        console.log('Connected to WebSocket server');
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });

      this.socket.on('disconnect', (reason) => {
        console.log('Disconnected from server:', reason);
      });

      return this.socket;
    } catch (error) {
      console.error('Socket initialization error:', error);
      throw error;
    }
  }

  public getSocket(): Socket | null {
    return this.socket;
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log('Disconnected from WebSocket server');
    }
  }

  // Join a chat room for a specific booking
  public joinChatRoom(bookingId: string): void {
    if (this.socket) {
      this.socket.emit('joinRoom', JSON.stringify({ bookingId }));
    } else {
      console.error('Socket not connected');
    }
  }

  // Send a message in a chat room
  public sendMessage(bookingId: string, content: string): void {
    if (this.socket) {
      this.socket.emit('sendMessage', JSON.stringify({ bookingId, content }));
    } else {
      console.error('Socket not connected');
    }
  }
}

export default SocketService.getInstance();
