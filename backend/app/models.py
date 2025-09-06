from pydantic import BaseModel, Field
from typing import Optional, Literal

Status = Literal['queued','processing','assembling','ready','error']

class GenerateResponse(BaseModel):
    jobId: str

class StatusResponse(BaseModel):
    status: Status
    progress: Optional[int] = None
    etaSeconds: Optional[int] = None
    error: Optional[str] = None

class ResultResponse(BaseModel):
    videoUrl: str
    posterUrl: str
    durationSec: int
    width: int
    height: int


