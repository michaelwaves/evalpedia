"use client"

import { useState, useMemo } from "react";
import { UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { Check, ChevronsUpDown } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface Model {
    id: string;
    provider: "openai" | "anthropic";
}

interface ApiModel {
    id: string;
}

interface FormData {
    model: string;
    systemPrompt: string;
    eval: string;
}

interface ModelSelectorProps {
    openaiModels: ApiModel[];
    anthropicModels: ApiModel[];
    register: UseFormRegister<FormData>;
    setValue: UseFormSetValue<FormData>;
    watch: UseFormWatch<FormData>;
}

function ModelSelector({
    openaiModels,
    anthropicModels,
    register,
    setValue,
    watch,
}: ModelSelectorProps) {
    const [open, setOpen] = useState(false);

    const selectedModel = watch("model");

    const models = useMemo(() => {
        const openai: Model[] = (openaiModels || []).map((m) => ({
            id: m.id,
            provider: "openai" as const,
        }));

        const anthropic: Model[] = (anthropicModels || []).map((m) => ({
            id: m.id,
            provider: "anthropic" as const,
        }));

        return [...openai, ...anthropic];
    }, [openaiModels, anthropicModels]);

    // Extract provider and model name from the full path (e.g., "openai/gpt-4" -> {provider: "openai", modelName: "gpt-4"})
    const getProviderAndModel = (fullPath: string) => {
        if (!fullPath) return { provider: null, modelName: null };
        const parts = fullPath.split('/');
        return { provider: parts[0], modelName: parts[1] };
    };

    const { provider, modelName } = getProviderAndModel(selectedModel);

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            id="model"
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-full justify-between"
                        >
                            {selectedModel ? (
                                <div className="flex items-center gap-2">
                                    {provider && (
                                        <Image
                                            src={`/${provider}.png`}
                                            alt={provider}
                                            width={16}
                                            height={16}
                                            className="rounded"
                                        />
                                    )}
                                    {modelName}
                                </div>
                            ) : (
                                "Select model..."
                            )}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[600px] p-0" align="start">
                        <Command>
                            <CommandInput placeholder="Search models..." />
                            <CommandList>
                                <CommandEmpty>No model found.</CommandEmpty>
                                <CommandGroup heading="OpenAI">
                                    {models
                                        .filter((model) => model.provider === "openai")
                                        .map((model) => (
                                            <CommandItem
                                                key={model.id}
                                                value={model.id}
                                                onSelect={(currentValue) => {
                                                    const fullModelPath = `openai/${currentValue}`;
                                                    setValue("model", selectedModel === fullModelPath ? "" : fullModelPath);
                                                    setOpen(false);
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        selectedModel === `openai/${model.id}` ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                <Image
                                                    src="/openai.png"
                                                    alt="OpenAI"
                                                    width={16}
                                                    height={16}
                                                    className="mr-2 rounded"
                                                />
                                                {model.id}
                                            </CommandItem>
                                        ))}
                                </CommandGroup>
                                <CommandGroup heading="Anthropic">
                                    {models
                                        .filter((model) => model.provider === "anthropic")
                                        .map((model) => (
                                            <CommandItem
                                                key={model.id}
                                                value={model.id}
                                                onSelect={(currentValue) => {
                                                    const fullModelPath = `anthropic/${currentValue}`;
                                                    setValue("model", selectedModel === fullModelPath ? "" : fullModelPath);
                                                    setOpen(false);
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        selectedModel === `anthropic/${model.id}` ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                <Image
                                                    src="/anthropic.png"
                                                    alt="Anthropic"
                                                    width={16}
                                                    height={16}
                                                    className="mr-2 rounded"
                                                />
                                                {model.id}
                                            </CommandItem>
                                        ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
            </div>

            <div className="space-y-2">
                <Label htmlFor="systemPrompt">System Prompt</Label>
                <Textarea
                    id="systemPrompt"
                    placeholder="Enter system prompt for the agentic evaluation..."
                    className="min-h-[120px]"
                    {...register("systemPrompt")}
                />
            </div>
        </div>
    );
}

export default ModelSelector;