import asyncio
import uvicorn
from contextlib import asynccontextmanager
from app.core.app import create_app
from app.endpoints import jobs, evals
from app.services import job_queue


@asynccontextmanager
async def lifespan(_app):
    task = asyncio.create_task(job_queue.process_queue())
    yield
    task.cancel()


app = create_app()
app.router.lifespan_context = lifespan
app.include_router(jobs.router)
app.include_router(evals.router)


@app.get("/")
def home():
    return "Welcome to the inspect evals api"


if __name__ == "__main__":
    uvicorn.run("main:app", port=8008, host="0.0.0.0", reload=True)