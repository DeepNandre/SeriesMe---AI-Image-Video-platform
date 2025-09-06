import os
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

PORT = int(os.getenv('PORT', '8001'))
ALLOWED_ORIGINS = [o.strip() for o in os.getenv('ALLOWED_ORIGINS', 'http://localhost:5173,http://127.0.0.1:5173').split(',') if o.strip()]

MEDIA_BASE = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'data'))
UPLOADS_DIR = os.path.join(MEDIA_BASE, 'uploads')
OUTPUTS_DIR = os.path.join(MEDIA_BASE, 'outputs')
JOBS_DB_PATH = os.path.join(MEDIA_BASE, 'jobs.sqlite')

ASSETS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'assets'))
FFMPEG_BIN = os.getenv('FFMPEG_BIN', 'ffmpeg')

ELEVENLABS_API_KEY = os.getenv('ELEVENLABS_API_KEY', '')
ELEVENLABS_VOICE_ID = os.getenv('ELEVENLABS_VOICE_ID', '')

TALKING_HEAD_MODE = os.getenv('TALKING_HEAD_MODE', 'kenburns')
SADTALKER_BIN = os.getenv('SADTALKER_BIN', 'python scripts/sadtalker_infer.py')

os.makedirs(UPLOADS_DIR, exist_ok=True)
os.makedirs(OUTPUTS_DIR, exist_ok=True)


