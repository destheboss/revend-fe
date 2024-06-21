import apiClient from './apiClient';
import { Message } from '../components/Message';
import { Conversation } from '../components/Conversation';

const conversationService = {
    sendMessage: async (conversationId: number, message: Message) => {
    console.log(`Sending message to conversation ${conversationId}`);
    return apiClient.post(`/conversations/${conversationId}/messages`, message);
    },
  
    getChatHistory: async (conversationId: number) => {
    console.log(`Fetching chat history for conversation ${conversationId}`);
    return apiClient.get<Message[]>(`/conversations/${conversationId}/messages`);
    },
  
    getConversation: async (conversationId: number) => {
    console.log(`Fetching conversation ${conversationId}`);
    return apiClient.get<Conversation>(`/conversations/conversation/${conversationId}`);
    },
  
    getUserConversations: async (userId: number) => {
    console.log(`Fetching conversations for user ${userId}`);
    return apiClient.get<Conversation[]>(`/conversations/user/${userId}`);
    },
  
    createConversation: async (conversationData: any) => {
    console.log('Creating a new conversation');
    return apiClient.post('/conversations', conversationData);
    },
};

export default conversationService;