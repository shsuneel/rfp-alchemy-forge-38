
import React from 'react';
import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Message {
  id: string;
  sender: 'bot' | 'user';
  text?: string;
  type: 'text' | 'input-prompt' | 'file-upload-prompt' | 'file-uploaded' | 'action-request';
  timestamp: Date;
  children?: React.ReactNode; // For rendering inputs or other elements within a message
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.sender === 'bot';

  return (
    <div
      className={cn(
        'flex animate-fade-in mb-4 p-4 rounded-lg shadow-md max-w-3xl w-full',
        isBot ? 'bg-secondary/70 self-start' : 'bg-primary/10 self-end',
        isBot ? 'mr-auto' : 'ml-auto' // Align message bubble
      )}
      style={{ backdropFilter: 'blur(5px)' }}
    >
      <div className="flex-shrink-0 mr-3">
        {isBot ? (
          <Bot className="h-6 w-6 text-secondary-foreground" />
        ) : (
          <User className="h-6 w-6 text-primary" />
        )}
      </div>
      <div className="flex-grow">
        <p className={cn('text-sm md:text-base', isBot ? 'text-secondary-foreground' : 'text-foreground')}>
          {message.text}
        </p>
        {message.children && <div className="mt-2">{message.children}</div>}
        <p className="text-xs text-muted-foreground mt-1 text-right">
          {message.timestamp.toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

export default ChatMessage;
