export interface Message {
  id?: string;
  uuid: string;
  conversationId: number;
  fromUserId: number;
  fromUserName: string;
  text: string;
  timestamp?: string;
}

export const MessageComponent: React.FC<Message> = ({ fromUserName, text }) => {
  return (
    <div>
      <strong>{fromUserName}:</strong> {text}
    </div>
  );
};