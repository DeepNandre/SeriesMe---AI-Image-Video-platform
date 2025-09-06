import os
from .store import update_status, get_job
from .config import OUTPUTS_DIR
from .pipeline.tts import tts_to_wav
from .pipeline.captions import make_srt
from .pipeline.talking_head import kenburns
from .pipeline.assemble import assemble_final


def run_pipeline(job_id: str) -> None:
    job = get_job(job_id)
    if not job:
        return
    base_out = os.path.join(OUTPUTS_DIR, job_id)
    os.makedirs(base_out, exist_ok=True)
    try:
        update_status(job_id, 'processing', 10)

        # 1) TTS
        audio_wav = os.path.join(base_out, 'audio.wav')
        tts_to_wav(job['script'] or '', audio_wav)
        update_status(job_id, 'processing', 40)

        # 2) Captions
        captions_srt = os.path.join(base_out, 'captions.srt')
        dur = make_srt(job['script'] or '', captions_srt)
        update_status(job_id, 'processing', 60)

        # 3) Talking head (Ken Burns fallback)
        talking_mp4 = os.path.join(base_out, 'talking.mp4')
        kenburns(job['selfie_path'], max(6.0, min(15.0, dur or 8.0)), talking_mp4)
        update_status(job_id, 'assembling', 80)

        # 4) Assemble
        final_mp4, poster_jpg, duration_sec, width, height = assemble_final(
            talking_mp4, audio_wav, captions_srt, base_out
        )
        update_status(job_id, 'ready', 100, video_path=final_mp4, poster_path=poster_jpg)
    except Exception as e:
        update_status(job_id, 'error', 100, error=str(e))


