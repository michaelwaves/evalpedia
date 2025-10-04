from fastapi import APIRouter, HTTPException
from app.models import EvalConfig
from app.services import job_queue


router = APIRouter()


@router.post("/job/run")
def submit_job(config: EvalConfig):
    job_id = job_queue.submit_job(config)
    job = job_queue.get_job(job_id)
    return {"job_id": job_id, "status": job.status, "command": job.command}


@router.get("/job/{job_id}")
def get_job(job_id: str):
    job = job_queue.get_job(job_id)
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    return job


@router.get("/jobs")
def get_all_jobs():
    return job_queue.get_all_jobs()


@router.get("/jobs/queue")
def get_queued_jobs():
    return job_queue.get_queued_jobs()


@router.get("/jobs/running")
def get_running_jobs():
    return job_queue.get_running_jobs()
