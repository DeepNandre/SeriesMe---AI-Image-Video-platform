import subprocess
from typing import List
from . import files
from ..config import FFMPEG_BIN


def run_ffmpeg(args: List[str]) -> None:
    cmd = [FFMPEG_BIN, '-y'] + args
    proc = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if proc.returncode != 0:
        raise RuntimeError(proc.stderr.decode('utf-8', errors='ignore'))


def probe_duration(path: str) -> float:
    cmd = [
        'ffprobe', '-v', 'error', '-show_entries', 'format=duration',
        '-of', 'default=noprint_wrappers=1:nokey=1', path
    ]
    proc = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if proc.returncode != 0:
        raise RuntimeError(proc.stderr.decode('utf-8', errors='ignore'))
    try:
        return float(proc.stdout.decode().strip())
    except Exception:
        return 0.0


