"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

interface TaskArgumentsInputProps {
    value: Record<string, string>;
    onChange: (value: Record<string, string>) => void;
}

export function TaskArgumentsInput({ value, onChange }: TaskArgumentsInputProps) {
    const [newKey, setNewKey] = useState("");
    const [newValue, setNewValue] = useState("");

    const addArgument = () => {
        if (newKey.trim() && newValue.trim()) {
            onChange({ ...value, [newKey.trim()]: newValue.trim() });
            setNewKey("");
            setNewValue("");
        }
    };

    const removeArgument = (key: string) => {
        const updated = { ...value };
        delete updated[key];
        onChange(updated);
    };

    return (
        <div className="space-y-4">
            <Label>Task Arguments</Label>

            {Object.entries(value).length > 0 && (
                <div className="space-y-2">
                    {Object.entries(value).map(([key, val]) => (
                        <div key={key} className="flex items-center gap-2 p-2 bg-muted rounded-md">
                            <span className="font-mono text-sm flex-1">
                                {key} = {val}
                            </span>
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeArgument(key)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}

            <div className="flex gap-2">
                <Input
                    placeholder="Key"
                    value={newKey}
                    onChange={(e) => setNewKey(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addArgument())}
                />
                <Input
                    placeholder="Value"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addArgument())}
                />
                <Button type="button" onClick={addArgument} variant="outline">
                    Add
                </Button>
            </div>
        </div>
    );
}
