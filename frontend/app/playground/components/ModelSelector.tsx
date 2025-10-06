'use client';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const MODELS = [
  { id: 'anthropic:claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet', provider: 'anthropic' },
  { id: 'anthropic:claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku', provider: 'anthropic' },
  { id: 'anthropic:claude-3-opus-20240229', name: 'Claude 3 Opus', provider: 'anthropic' },
  { id: 'openai:gpt-4o', name: 'GPT-4o', provider: 'openai' },
  { id: 'openai:gpt-4o-mini', name: 'GPT-4o Mini', provider: 'openai' },
  { id: 'openai:gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'openai' },
];

interface ModelSelectorProps {
  model: string;
  onModelChange: (value: string) => void;
}

export function ModelSelector({ model, onModelChange }: ModelSelectorProps) {
  return (
    <div className="mb-6">
      <Label htmlFor="model-select" className="mb-2 block">
        Model
      </Label>
      <Select value={model} onValueChange={onModelChange}>
        <SelectTrigger id="model-select">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {MODELS.map((m) => (
            <SelectItem key={m.id} value={m.id}>
              {m.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
