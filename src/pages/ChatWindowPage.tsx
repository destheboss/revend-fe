import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Client } from '@stomp/stompjs';
import { v4 as uuidv4 } from 'uuid';
import conversationService from '../services/conversationService';
import { Message } from '../components/Message';
import { Conversation } from '../components/Conversation';
import setupStompClient from '../services/setupStompClient';
import { getUserIdFromToken } from '../services/authService';

const ChatWindowPage: React.FC = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const clientRef = useRef<Client | null>(null);
  const sendingMessageRef = useRef(false);  // Track message sending status
  const userId = getUserIdFromToken();

  const onMessageReceived = (message: any) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const onError = (errorMsg: string) => {
    console.error('WebSocket error:', errorMsg);
    setError(errorMsg);
  };

  useEffect(() => {
    async function fetchConversationAndMessages() {
      try {
        const [convResponse, historyResponse] = await Promise.all([
          conversationService.getConversation(Number(conversationId)),
          conversationService.getChatHistory(Number(conversationId))
        ]);
        setConversation(convResponse.data);
        setMessages(historyResponse.data);

        if (conversationId && userId) {
          if (!clientRef.current) {
            const client = setupStompClient(Number(conversationId), onMessageReceived, onError);
            clientRef.current = client;
          }
        } else {
          setError('User ID or token is not available');
        }
      } catch (error) {
        console.error('Failed to load conversation or messages:', error);
        setError('Failed to load conversation or messages');
      } finally {
        setLoading(false);
      }
    }

    if (conversationId) {
      fetchConversationAndMessages();
    }

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
        clientRef.current = null;
      }
    };
  }, [conversationId, userId]);

  const handleSendMessage = async () => {
    if (!conversationId || !newMessage.trim() || !clientRef.current || !userId || sendingMessageRef.current) return;

    sendingMessageRef.current = true;

    const message: Message = {
      uuid: uuidv4(),
      conversationId: Number(conversationId),
      fromUserId: userId,
      fromUserName: '', // Ensure this is properly set with the user's name
      text: newMessage,
      timestamp: new Date().toISOString(),
    };

    try {
      await conversationService.sendMessage(Number(conversationId), message);
      clientRef.current.publish({
        destination: `/app/conversation/${conversationId}`,
        body: JSON.stringify(message),
      });
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
      setError('Failed to send message');
    } finally {
      sendingMessageRef.current = false;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>{conversation?.title}</h1>
      <div>
        {messages.map((message, index) => (
          <div key={index}>
            <strong>{message.fromUserName}:</strong> {message.text}
          </div>
        ))}
      </div>
      <div>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatWindowPage;