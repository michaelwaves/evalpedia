import { getEvals } from "@/lib/actions/evals/evals";
import { getAnthropicModels } from "@/lib/actions/anthropic/models";
import { getOpenaiModels } from "@/lib/actions/openai/models";
import EvalFormClient from "./EvalFormClient";

async function EvalForm() {
    const [evalsData, openaiData, anthropicData] = await Promise.all([
        getEvals(),
        getOpenaiModels(),
        getAnthropicModels(),
    ]);

    const evals = evalsData._root || [];
    const openaiModels = openaiData?.data || [];
    const anthropicModels = anthropicData?.data || [];

    return (
        <EvalFormClient
            evals={evals}
            openaiModels={openaiModels}
            anthropicModels={anthropicModels}
        />
    );
}

export default EvalForm;
