"use server"

const EVAL_URL = process.env.EVAL_URL

export async function getEvals() {
    const res = await fetch(`${EVAL_URL}/evals`)
    const data = await res.json()
    console.log(data)
    return data
}

interface RunEvalParams {
    eval: string;
    model: string;
    limit?: number;
    system_prompt?: string;
    temperature?: number;
    max_connections?: number;
    epochs?: number;
    task_arguments?: Record<string, any>;
}

export async function runEval(params: RunEvalParams) {
    const res = await fetch(`${EVAL_URL}/job/run`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            eval: params.eval,
            model: params.model,
            limit: params.limit ?? 0,
            system_prompt: params.system_prompt || null,
            temperature: params.temperature ?? 0,
            max_connections: params.max_connections ?? 10,
            epochs: params.epochs ?? 1,
            task_arguments: params.task_arguments ?? {},
        }),
    });

    if (!res.ok) {
        throw new Error(`Failed to run eval: ${res.statusText}`);
    }

    const data = await res.json();
    console.log("Eval run response:", data);
    return data;
}