import { streamText, UIMessage, convertToModelMessages } from 'ai';
import { registry } from '@/lib/registry';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages, model, systemPrompt }: { messages: UIMessage[], model: string, systemPrompt: string } = await req.json();

    console.log(messages, systemPrompt, model)

    const result = streamText({
        model: registry.languageModel(model as `anthropic:${string}` | `openai:${string}`),
        system: systemPrompt,
        messages: convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
}