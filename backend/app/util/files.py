import os
import mimetypes
import uuid
from typing import Tuple


def safe_uuid() -> str:
    return str(uuid.uuid4())


def sniff_image_mime(path: str) -> str:
    mime, _ = mimetypes.guess_type(path)
    return mime or ''


def ensure_dirs(*paths: str) -> None:
    for p in paths:
        os.makedirs(p, exist_ok=True)


def join(*parts: str) -> str:
    return os.path.join(*parts)


