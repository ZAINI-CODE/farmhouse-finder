import { useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  sender_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
  sender_name?: string;
}

interface MessageListProps {
  messages: Message[];
  loading?: boolean;
}

export function MessageList({ messages, loading }: MessageListProps) {
  const { user } = useAuth();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <p className="text-muted-foreground">No messages yet</p>
        <p className="text-sm text-muted-foreground mt-1">Start the conversation!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4 p-4 max-h-96 overflow-y-auto">
      {messages.map((message) => {
        const isOwn = message.sender_id === user?.id;
        const initials = message.sender_name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';
        
        return (
          <div
            key={message.id}
            className={cn(
              "flex gap-3",
              isOwn ? "flex-row-reverse" : "flex-row"
            )}
          >
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback className={cn(
                "text-xs",
                isOwn ? "bg-primary text-primary-foreground" : "bg-muted"
              )}>
                {initials}
              </AvatarFallback>
            </Avatar>
            
            <div className={cn(
              "flex flex-col max-w-[70%]",
              isOwn ? "items-end" : "items-start"
            )}>
              <div className={cn(
                "rounded-2xl px-4 py-2",
                isOwn 
                  ? "bg-primary text-primary-foreground rounded-tr-sm" 
                  : "bg-muted rounded-tl-sm"
              )}>
                <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
              </div>
              <span className="text-xs text-muted-foreground mt-1">
                {format(new Date(message.created_at), 'MMM d, h:mm a')}
              </span>
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
