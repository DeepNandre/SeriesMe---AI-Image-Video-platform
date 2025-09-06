from ..util.ffmpeg import run_ffmpeg


def kenburns(selfie_path: str, duration_sec: float, out_mp4: str) -> None:
    # Simple zoompan over portrait canvas, pad to 1080x1920
    # Use a gentle zoom up to 1.2x
    vf = (
        "scale=-1:1920,"
        "zoompan=z='min(zoom+0.0015,1.2)':d=\"{d}\":fps=30:".replace('{d}', str(int(duration_sec*30))) +
        "x='iw*0.5*(1-1/zoom)':y='ih*0.5*(1-1/zoom)',"
        "pad=1080:1920:(1080-iw)/2:(1920-ih)/2:black"
    )
    args = [
        '-loop', '1', '-t', str(max(1, int(duration_sec))), '-i', selfie_path,
        '-vf', vf,
        '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out_mp4
    ]
    run_ffmpeg(args)


