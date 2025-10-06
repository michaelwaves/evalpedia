'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';
import { SystemPromptSection } from './components/SystemPromptSection';
import { ModelSelector } from './components/ModelSelector';
import { ChatMessages } from './components/ChatMessages';
import { ChatInput } from './components/ChatInput';
import { DefaultChatTransport } from 'ai';

const DEFAULT_SYSTEM_PROMPT = 'You are a helpful assistant.';
const INITIAL_MODEL = 'anthropic:claude-3-5-sonnet-20241022';

export default function PlaygroundPage() {
  const [input, setInput] = useState('');
  const [systemPrompt, setSystemPrompt] = useState(DEFAULT_SYSTEM_PROMPT);
  const [model, setModel] = useState(INITIAL_MODEL);
  const [isSystemPromptOpen, setIsSystemPromptOpen] = useState(false);

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({
      body: {
        model,
        systemPrompt,
      }
    }),
  });

  const isLoading = status === 'submitted' || status === 'streaming';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    sendMessage({ text: input });
    setInput('');
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== messageId));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Playground</h1>
          <p className="text-muted-foreground">
            Test different models and system prompts
          </p>
        </div>

        <SystemPromptSection
          systemPrompt={systemPrompt}
          onSystemPromptChange={setSystemPrompt}
          isOpen={isSystemPromptOpen}
          onOpenChange={setIsSystemPromptOpen}
        />

        <ModelSelector model={model} onModelChange={setModel} />

        <ChatMessages
          messages={messages}
          isLoading={isLoading}
          onDeleteMessage={handleDeleteMessage}
        />

        <ChatInput
          input={input}
          onInputChange={setInput}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
