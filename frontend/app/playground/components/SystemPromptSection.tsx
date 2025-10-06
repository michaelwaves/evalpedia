'use client';

import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface SystemPromptSectionProps {
  systemPrompt: string;
  onSystemPromptChange: (value: string) => void;
  isOpen: boolean;
  onOpenChange: (value: boolean) => void;
}

export function SystemPromptSection({
  systemPrompt,
  onSystemPromptChange,
  isOpen,
  onOpenChange,
}: SystemPromptSectionProps) {
  return (
    <Collapsible open={isOpen} onOpenChange={onOpenChange} className="mb-6">
      <Card className="p-4">
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <Label className="text-base font-semibold cursor-pointer">
            System Prompt
          </Label>
          {isOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <Textarea
            value={systemPrompt}
            onChange={(e) => onSystemPromptChange(e.target.value)}
            placeholder="Enter system prompt..."
            className="min-h-[150px] font-mono text-sm"
          />
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}
