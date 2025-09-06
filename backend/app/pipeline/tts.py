import os
import pyttsx3
from ..config import ELEVENLABS_API_KEY, ELEVENLABS_VOICE_ID


def tts_to_wav(script: str, out_wav: str) -> None:
    if ELEVENLABS_API_KEY:
        # Placeholder: integrate ElevenLabs if desired later
        pass
    engine = pyttsx3.init()
    engine.setProperty('rate', 175)
    engine.save_to_file(script, out_wav)
    engine.runAndWait()


