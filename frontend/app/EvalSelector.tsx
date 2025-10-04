"use client"

import { useState, useMemo } from "react";
import { Search, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Task {
    name: string;
    dataset_samples: number;
    human_baseline: number | null;
}

interface Eval {
    title: string;
    description: string;
    path: string;
    arxiv?: string;
    group: string;
    contributors: string[];
    tasks: Task[];
    tags: string[] | null;
}

interface EvalSelectorProps {
    evals: Eval[];
    value?: string;
    onValueChange?: (value: string) => void;
}

function EvalSelector({ evals, value, onValueChange }: EvalSelectorProps) {
    const [search, setSearch] = useState("");
    const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

    // Get all unique groups
    const groups = useMemo(() => {
        const uniqueGroups = new Set(evals.map((e) => e.group));
        return Array.from(uniqueGroups).sort();
    }, [evals]);

    // Filter evals based on search and group
    const filteredEvals = useMemo(() => {
        return evals.filter((evalItem) => {
            const matchesSearch =
                search === "" ||
                evalItem.title.toLowerCase().includes(search.toLowerCase()) ||
                evalItem.description.toLowerCase().includes(search.toLowerCase()) ||
                evalItem.tasks.some((t) => t.name.toLowerCase().includes(search.toLowerCase()));

            const matchesGroup = selectedGroup === null || evalItem.group === selectedGroup;

            return matchesSearch && matchesGroup;
        });
    }, [evals, search, selectedGroup]);

    return (
        <div className="space-y-4">
            <div className="space-y-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search evaluations..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>

                <div className="flex flex-wrap gap-2">
                    <Badge
                        variant={selectedGroup === null ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setSelectedGroup(null)}
                    >
                        All
                    </Badge>
                    {groups.map((group) => (
                        <Badge
                            key={group}
                            variant={selectedGroup === group ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => setSelectedGroup(group)}
                        >
                            {group}
                        </Badge>
                    ))}
                </div>
            </div>

            <div className="space-y-3 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
                {filteredEvals.map((evalItem) => (
                    <div key={evalItem.path}>
                        {evalItem.tasks.map((task) => (
                            <Card
                                key={task.name}
                                className={cn(
                                    "cursor-pointer transition-all hover:shadow-md mb-3",
                                    value === task.name && "ring-2 ring-primary"
                                )}
                                onClick={() => onValueChange?.(task.name)}
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1 min-w-0">
                                            <CardTitle className="text-base mb-1 line-clamp-1">
                                                {evalItem.title}
                                            </CardTitle>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <Badge variant="secondary" className="text-xs">
                                                    {evalItem.group}
                                                </Badge>
                                                <span className="text-xs text-muted-foreground">
                                                    {task.dataset_samples} samples
                                                </span>
                                            </div>
                                        </div>
                                        {evalItem.arxiv && (
                                            <a
                                                href={evalItem.arxiv}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="text-muted-foreground hover:text-foreground"
                                            >
                                                <ExternalLink className="h-4 w-4" />
                                            </a>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <CardDescription className="line-clamp-2 text-sm">
                                        {evalItem.description}
                                    </CardDescription>
                                    <div className="mt-2">
                                        <span className="text-xs font-medium text-muted-foreground">
                                            Task: {task.name}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ))}

                {filteredEvals.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                        No evaluations found
                    </div>
                )}
            </div>
        </div>
    );
}

export default EvalSelector;
