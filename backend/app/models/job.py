from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from .job_status import JobStatus
from .eval_config import EvalConfig


class Job(BaseModel):
    job_id: str
    config: EvalConfig
    status: JobStatus
    command: str
    created_at: datetime
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    error_message: Optional[str] = None
    process_id: Optional[int] = None
