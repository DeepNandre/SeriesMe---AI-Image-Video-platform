import os
from ..util.ffmpeg import run_ffmpeg, probe_duration
from ..config import ASSETS_DIR


def assemble_final(talking_mp4: str, audio_wav: str, captions_srt: str, out_dir: str) -> tuple[str, str, int, int, int]:
    os.makedirs(out_dir, exist_ok=True)
    watermark = os.path.join(ASSETS_DIR, 'watermark.png')
    endslate = os.path.join(ASSETS_DIR, 'endslate.png')

    final_mp4 = os.path.join(out_dir, 'final.mp4')
    poster_jpg = os.path.join(out_dir, 'poster.jpg')

    has_captions = os.path.exists(captions_srt)
    has_watermark = os.path.exists(watermark)

    if has_watermark:
        # Use filter_complex to combine subtitles and overlay
        filters = [
            "[0:v]scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(1080-iw)/2:(1920-ih)/2:black[v0]"
        ]
        map_chain = "[v0]"
        if has_captions:
            filters.append(f"{map_chain}subtitles={captions_srt}[v1]")
            map_chain = "[v1]"
        filters.append(f"{map_chain}[2:v]overlay=W-w-40:H-h-40[vout]")

        args = [
            '-i', talking_mp4,
            '-i', audio_wav,
            '-i', watermark,
            '-filter_complex', ';'.join(filters),
            '-map', '[vout]', '-map', '1:a:0',
            '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '23',
            '-c:a', 'aac', '-b:a', '128k',
            '-shortest', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', final_mp4
        ]
        run_ffmpeg(args)
    else:
        # Simple -vf chain
        vf_filters = [
            "scale=1080:1920:force_original_aspect_ratio=decrease",
            "pad=1080:1920:(1080-iw)/2:(1920-ih)/2:black"
        ]
        if has_captions:
            vf_filters.append(f"subtitles={captions_srt}")
        args = [
            '-i', talking_mp4,
            '-i', audio_wav,
            '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '23',
            '-c:a', 'aac', '-b:a', '128k',
            '-shortest',
            '-vf', ','.join(vf_filters),
            '-pix_fmt', 'yuv420p', '-movflags', '+faststart', final_mp4
        ]
        run_ffmpeg(args)

    dur = probe_duration(final_mp4)
    mid = max(0.0, dur / 2.0)
    run_ffmpeg(['-ss', str(mid), '-i', final_mp4, '-frames:v', '1', poster_jpg])

    # Default dimensions
    width, height = 1080, 1920
    return final_mp4, poster_jpg, int(dur or 0), width, height


