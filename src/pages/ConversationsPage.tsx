import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import conversationService from '../services/conversationService';
import { Conversation } from '../components/Conversation';

const ConversationsListPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      conversationService.getUserConversations(Number(userId))
        .then(response => {
          setConversations(response.data);
          setLoading(false);
        })
        .catch(err => {
          setError('Failed to load conversations');
          setLoading(false);
        });
    }
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Conversations</h1>
      {conversations.length > 0 ? (
        <ul>
          {conversations.map(conversation => (
            <li key={conversation.id}>
              <a href={`/conversations/${conversation.id}/messages`}>{conversation.title}</a>
            </li>
          ))}
        </ul>
      ) : (
        <div>No conversations found.</div>
      )}
    </div>
  );
};

export default ConversationsListPage;