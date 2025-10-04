from pydantic import BaseModel
from typing import Optional


class EvalConfig(BaseModel):
    eval: str
    model: str
    limit: Optional[int] = None
    system_prompt: Optional[str] = None
    temperature: Optional[float] = None
    max_connections: Optional[int] = None
    task_arguments: Optional[dict] = None
