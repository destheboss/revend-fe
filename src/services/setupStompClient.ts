import { Client, Frame } from '@stomp/stompjs';
import { getUserIdFromToken } from '../services/authService';

const setupStompClient = (
  conversationId: number,
  onMessageReceived: (message: any) => void,
  onError: (errorMsg: string) => void
): Client | null => {
  const userId = getUserIdFromToken();
  const token = sessionStorage.getItem('token');

  if (!userId || !token) {
    console.error('User ID or token is not available.');
    return null;
  }

  const authHeader = `Bearer ${token}`;
  const websocketUrl = `ws://localhost:8080/ws?token=${encodeURIComponent(authHeader)}`;

  const stompClient = new Client({
    brokerURL: websocketUrl,
    connectHeaders: {
      Authorization: authHeader,
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
  });

  stompClient.onConnect = (frame: Frame) => {
    console.log('Connected to WebSocket');

    const subscription = stompClient.subscribe(`/topic/conversation/${conversationId}`, (data) => {
      console.log('Received message from /topic/conversation:', data);
      const message = JSON.parse(data.body);
      onMessageReceived(message);
    });

    return () => {
      subscription.unsubscribe();
    };
  };

  stompClient.onStompError = (frame) => {
    const errorMsg = `Broker reported error: ${frame.headers['message']}`;
    console.error(errorMsg);
    onError(errorMsg);
  };

  stompClient.onWebSocketError = (event) => {
    const errorMsg = 'WebSocket error';
    console.error(errorMsg, event);
    onError(errorMsg);
  };

  stompClient.onWebSocketClose = (event) => {
    const errorMsg = 'WebSocket closed';
    console.error(errorMsg, event);
    onError(errorMsg);
  };

  stompClient.activate();

  return stompClient;
};

export default setupStompClient;