'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UIMessage } from 'ai';
import { X } from 'lucide-react';

interface ChatMessagesProps {
  messages: UIMessage[];
  isLoading: boolean;
  onDeleteMessage: (messageId: string) => void;
}

export function ChatMessages({ messages, isLoading, onDeleteMessage }: ChatMessagesProps) {
  return (
    <div className="mb-6 space-y-4 min-h-[400px] max-h-[600px] overflow-y-auto">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-[400px] text-muted-foreground">
          Start a conversation below
        </div>
      ) : (
        messages.map((message) => (
          <Card
            key={message.id}
            className={`p-4 relative group ${
              message.role === 'user'
                ? 'bg-primary/5 ml-auto max-w-[85%]'
                : 'bg-muted max-w-[85%]'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="text-xs font-semibold mb-2 text-muted-foreground uppercase">
                  {message.role === 'user' ? 'You' : 'Assistant'}
                </div>
                <div className="whitespace-pre-wrap">
                  {message.parts.map((part, i) => {
                    switch (part.type) {
                      case 'text':
                        return (
                          <div key={`${message.id}-${i}`}>{part.text}</div>
                        );
                      default:
                        return null;
                    }
                  })}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onDeleteMessage(message.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))
      )}
      {isLoading && (
        <Card className="p-4 bg-muted max-w-[85%]">
          <div className="text-xs font-semibold mb-2 text-muted-foreground uppercase">
            Assistant
          </div>
          <div className="animate-pulse">Thinking...</div>
        </Card>
      )}
    </div>
  );
}
