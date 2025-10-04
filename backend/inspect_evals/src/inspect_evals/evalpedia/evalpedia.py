from typing import Any

from inspect_ai import Task, task
from inspect_ai.dataset import Sample
from inspect_ai.scorer import model_graded_qa, Score, accuracy, scorer
from inspect_ai.solver import (
    Solver,
    generate,
    prompt_template,
    TaskState
)
import openai
import json
import os

from pydantic import BaseModel
from dotenv import load_dotenv
load_dotenv()

class ScoreResponse(BaseModel):
    value: float
    explanation: str


from inspect_ai.agent import react
from inspect_ai.tool import mcp_server_http


with open("system_prompts/price_comparison.md", "r") as f:
    SYSTEM_PROMPT = f.read()
with open("eval_prompts/price_comparison.md", "r") as f:
    EVAL_PROMPT = f.read()

APIFY_API_KEY = os.getenv("APIFY_API_KEY")


@task
def evalpedia() -> Task:
    """Inspect Task implementation for product comparison"""
    dataset = [Sample(input="Find the best price for iPhone 15 Pro", target=["iPhone 15 Pro - $999 at Apple, iPhone 15 Pro - $949 at Best Buy"])]

    return Task(
        dataset=dataset,
        solver=evalpedia_solver(),
        scorer=[
            compare_products_score()
        ],
    )



@scorer(metrics=[accuracy()])
def compare_products_score():
    score = compare_product_scorer(EVAL_PROMPT)
    return score

def compare_product_scorer(system_prompt: str):
    async def score(state: TaskState, target):
        answer_start = "BEST DEALS:"

        all_messages = "\n".join([message.text.strip()
                            for message in state.messages])
        product_message = all_messages.split(answer_start)[-1]

        client = openai.AsyncOpenAI(api_key=os.getenv(
            "ANTHROPIC_API_KEY"), base_url="https://api.anthropic.com/v1/")

        instructions = system_prompt.format(product_message=product_message)

        response = await client.chat.completions.create(
            model="claude-sonnet-4-20250514",
            messages=[
                {"role": "user", "content": instructions}
            ],
            max_tokens=500,
            temperature=0
        )

        response_text = response.choices[0].message.content
        try:
            parsed_response = json.loads(response_text)
            score_response = ScoreResponse(**parsed_response)
            return Score(value=score_response.value,
                         explanation=score_response.explanation
                         )
        except (json.JSONDecodeError, KeyError, TypeError) as e:
            raise ValueError(
                f"Unable to parse structured response from OpenAI API: {e} \n Response text: {response_text}")
    
    return score

def evalpedia_solver() -> list[Solver]:
    """Build solver for Product Comparison task."""
    apify_server = mcp_server_http(
        name="apify",
        url="https://mcp.apify.com?tools=apify/e-commerce-scraping-tool,junglee/Amazon-crawler,curious_coder/facebook-marketplace,axesso_data/amazon-reviews-scraper,junglee/amazon-bestsellers",
        authorization=APIFY_API_KEY
    )

    solver = [prompt_template(SYSTEM_PROMPT), react(tools=[apify_server]), generate()]
    return solver


def competitor_analysis_solver() -> list[Solver]:
    """Build solver for Product Comparison task."""
    apify_server = mcp_server_http(
        name="apify",   
        url="https://mcp.apify.com?tools=apify/website-content-crawler",
        authorization=APIFY_API_KEY
    )

    solver = [prompt_template("You are a competitor analysis agent"), react(tools=[apify_server]), generate()]
    return solver

@task
def competitor_analysis() -> Task:
    """Inspect Task implementation for competitor analysis"""
    dataset = [Sample(input="Analyze this competitor website and summarize what they do: https://www.alignarena.com/", target=["Anything relating to whitebox and blackbox enterprise evals"])]

    return Task(
        dataset=dataset,
        solver=competitor_analysis_solver(),
        scorer=[
            model_graded_qa()
        ],
    )
