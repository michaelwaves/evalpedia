from fastapi import FastAPI
import uvicorn
from typing import Optional
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from inspect_evals.metadata import load_listing

class EvalConfig(BaseModel):
    eval: str
    model:str
    limit: Optional[int]=None
    system_prompt: Optional[str]=None
    temperature: Optional[float]=None
    max_connections: Optional[int]=None
    task_arguments: Optional[dict]=None

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_methods=["*"],
    allow_origins=["*"]
)
@app.get("/")
def home():
    return("Welcome to the inspect evals api")

@app.get("/evals")
def list_evals():
    evals = load_listing()
    print(evals)
    return(evals)

@app.post("/job/run")
def run_eval(config:EvalConfig):

    inspect_command = build_eval_command_from_config(config)
    return {"eval_name":config.eval, "eval_temperature":config.temperature, "eval_command":inspect_command}

def build_eval_command_from_config(config:EvalConfig):
    base_command = [
        'uv','run','inspect','eval',f'inspect_evals/{config.eval}'
    ]

    if config.limit is not None:
        base_command +=['--limit', str(config.limit)]

    if config.temperature is not None:
        base_command +=['--temperature', str(config.temperature)]

    if config.max_connections is not None:
        base_command += ['--max-connections', str(config.max_connections)]
    
    if config.system_prompt is not None:
        base_command +=['--system-message', str(config.system_prompt)]

    if config.task_arguments:
        for k, v in config.task_arguments.items():
            base_command += [ '-T', f'{k}={v}']

    inspect_command = ' '.join(base_command)

    return inspect_command
    
if __name__=="__main__":
    uvicorn.run("main:app",port=8008, host="0.0.0.0", reload=True)