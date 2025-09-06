import os
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from typing import Optional

from .config import ALLOWED_ORIGINS, UPLOADS_DIR, OUTPUTS_DIR, MEDIA_BASE
from .models import GenerateResponse, StatusResponse, ResultResponse
from .store import init_db, create_job, get_job
from .util.files import safe_uuid, ensure_dirs, join, sniff_image_mime
from .jobs import run_pipeline

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ensure_dirs(UPLOADS_DIR, OUTPUTS_DIR)
init_db()

app.mount("/media", StaticFiles(directory=MEDIA_BASE), name="media")


@app.post('/api/generate', response_model=GenerateResponse, status_code=202)
async def generate(
    background_tasks: BackgroundTasks,
    selfie: UploadFile = File(...),
    script: str = Form(...),
    consent: str = Form(...),
):
    if (not script) or len(script) > 200:
        raise HTTPException(status_code=400, detail='Invalid script')
    if consent not in ('true', 'True', '1'):
        raise HTTPException(status_code=400, detail='Consent required')
    # Size check: UploadFile doesn't expose size pre-read; rely on client-side and stream to disk
    ext = os.path.splitext(selfie.filename or '')[1].lower()
    if ext not in ['.jpg', '.jpeg', '.png']:
        raise HTTPException(status_code=400, detail='Unsupported file type')

    job_id = safe_uuid()
    job_dir = join(UPLOADS_DIR, job_id)
    ensure_dirs(job_dir)
    selfie_path = join(job_dir, f'selfie{ext}')

    # Save file
    with open(selfie_path, 'wb') as f:
        chunk = await selfie.read()
        if len(chunk) > 10 * 1024 * 1024:
            raise HTTPException(status_code=400, detail='File too large')
        f.write(chunk)

    mime = sniff_image_mime(selfie_path)
    if mime not in ('image/jpeg', 'image/png'):
        raise HTTPException(status_code=400, detail='Invalid image mime')

    create_job(job_id, selfie_path, script, mode='kenburns')
    background_tasks.add_task(run_pipeline, job_id)
    return GenerateResponse(jobId=job_id)


@app.get('/api/status', response_model=StatusResponse)
def status(jobId: str):
    job = get_job(jobId)
    if not job:
        raise HTTPException(status_code=404, detail='Job not found')
    return StatusResponse(
        status=job['status'],
        progress=job['progress'],
        etaSeconds=30 if job['status'] in ('queued','processing','assembling') else 0,
        error=job.get('error')
    )


@app.get('/api/result', response_model=ResultResponse)
def result(jobId: str):
    job = get_job(jobId)
    if not job:
        raise HTTPException(status_code=404, detail='Job not found')
    if job['status'] != 'ready':
        raise HTTPException(status_code=409, detail='Not ready')
    # Build URLs
    video_rel = os.path.relpath(job['video_path'], MEDIA_BASE)
    poster_rel = os.path.relpath(job['poster_path'], MEDIA_BASE)
    return ResultResponse(
        videoUrl=f"/media/{video_rel}",
        posterUrl=f"/media/{poster_rel}",
        durationSec=10,
        width=1080,
        height=1920
    )


