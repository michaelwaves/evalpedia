"use client"

import { useState } from "react";
import { useForm } from "react-hook-form";
import { runEval } from "@/lib/actions/evals/evals";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ModelSelector from "./ModelSelector";
import EvalSelector from "./EvalSelector";
import { TaskArgumentsInput } from "@/components/TaskArgumentsInput";

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

interface Model {
    id: string;
}

interface EvalFormClientProps {
    evals: Eval[];
    openaiModels: Model[];
    anthropicModels: Model[];
}

interface FormData {
    model: string;
    systemPrompt: string;
    eval: string;
    limit: number;
    temperature: number;
    maxConnections: number;
    epochs: number;
}

function EvalFormClient({ evals, openaiModels, anthropicModels }: EvalFormClientProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [taskArguments, setTaskArguments] = useState<Record<string, string>>({});

    const { register, setValue, watch, handleSubmit } = useForm<FormData>({
        defaultValues: {
            model: "",
            systemPrompt: undefined,
            eval: "",
            limit: 10,
            temperature: 1.0,
            maxConnections: 10,
            epochs: 1,
        },
    });

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        setError(null);
        setSuccess(null);

        try {
            const result = await runEval({
                eval: data.eval,
                model: data.model,
                system_prompt: data.systemPrompt,
                limit: data.limit,
                temperature: data.temperature,
                max_connections: data.maxConnections,
                epochs: data.epochs,
                task_arguments: Object.keys(taskArguments).length > 0 ? taskArguments : undefined,
            });

            setSuccess(`Eval started successfully! Job ID: ${result.job_id || "N/A"}`);
            console.log("Eval run result:", result);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to run eval");
            console.error("Error running eval:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left side - Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <ModelSelector
                    openaiModels={openaiModels}
                    anthropicModels={anthropicModels}
                    register={register}
                    setValue={setValue}
                    watch={watch}
                />

                <div className="grid grid-cols-4 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="limit">Limit</Label>
                        <Input
                            id="limit"
                            type="number"
                            {...register("limit", { valueAsNumber: true })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="temperature">Temperature</Label>
                        <Input
                            id="temperature"
                            type="number"
                            step="0.1"
                            min="0"
                            max="2"
                            {...register("temperature", { valueAsNumber: true })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="maxConnections">Max Connections</Label>
                        <Input
                            id="maxConnections"
                            type="number"
                            {...register("maxConnections", { valueAsNumber: true })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="epochs">Epochs</Label>
                        <Input
                            id="epochs"
                            type="number"
                            min="1"
                            {...register("epochs", { valueAsNumber: true })}
                        />
                    </div>
                </div>

                <TaskArgumentsInput
                    value={taskArguments}
                    onChange={setTaskArguments}
                />

                {error && (
                    <div className="p-4 bg-destructive/10 text-destructive rounded-md">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="p-4 bg-green-500/10 text-green-600 dark:text-green-400 rounded-md">
                        {success}
                    </div>
                )}

                <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? "Running Eval..." : "Run Evaluation"}
                </Button>
            </form>

            {/* Right side - Evaluations */}
            <div className="lg:border-l lg:pl-8">
                <h2 className="text-xl font-semibold mb-4">Select Evaluation</h2>
                <EvalSelector
                    evals={evals}
                    value={watch("eval")}
                    onValueChange={(value) => setValue("eval", value)}
                />
            </div>
        </div>
    );
}

export default EvalFormClient;
