import asyncio
import subprocess
import uuid
from datetime import datetime
from typing import Dict, List
from app.models import Job, JobStatus, EvalConfig


class JobQueue:
    def __init__(self):
        self.jobs: Dict[str, Job] = {}
        self.queue: asyncio.Queue = asyncio.Queue()

    def submit_job(self, config: EvalConfig) -> str:
        job_id = str(uuid.uuid4())
        command = self._build_command(config)

        job = Job(
            job_id=job_id,
            config=config,
            status=JobStatus.QUEUED,
            command=' '.join(command),
            created_at=datetime.now()
        )

        self.jobs[job_id] = job
        self.queue.put_nowait(job_id)
        return job_id

    def get_job(self, job_id: str):
        return self.jobs.get(job_id)

    def get_all_jobs(self) -> List[Job]:
        return list(self.jobs.values())

    def get_queued_jobs(self) -> List[Job]:
        return [j for j in self.jobs.values() if j.status == JobStatus.QUEUED]

    def get_running_jobs(self) -> List[Job]:
        return [j for j in self.jobs.values() if j.status == JobStatus.RUNNING]

    async def process_queue(self):
        while True:
            job_id = await self.queue.get()
            await self._run_job(job_id)

    async def _run_job(self, job_id: str):
        job = self.jobs[job_id]
        job.status = JobStatus.RUNNING
        job.started_at = datetime.now()

        try:
            process = await asyncio.create_subprocess_exec(
                *job.command.split(),
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )

            _, stderr = await process.communicate()

            if process.returncode == 0:
                job.status = JobStatus.COMPLETED
            else:
                job.status = JobStatus.FAILED
                job.error_message = stderr.decode() if stderr else "Unknown error"

            job.completed_at = datetime.now()

        except Exception as e:
            job.status = JobStatus.FAILED
            job.error_message = str(e)
            job.completed_at = datetime.now()

    def _build_command(self, config: EvalConfig) -> List[str]:
        cmd = ['uv', 'run', 'inspect', 'eval', f'inspect_evals/{config.eval}']

        if config.limit is not None:
            cmd += ['--limit', str(config.limit)]
        if config.temperature is not None:
            cmd += ['--temperature', str(config.temperature)]
        if config.max_connections is not None:
            cmd += ['--max-connections', str(config.max_connections)]
        if config.system_prompt is not None:
            cmd += ['--system-message', str(config.system_prompt)]
        if config.model is not None:
            cmd += ['--model',str(config.model)]
        if config.task_arguments:
            for k, v in config.task_arguments.items():
                cmd += ['-T', f'{k}={v}']

        return cmd


job_queue = JobQueue()
