import math


def make_srt(script: str, out_srt: str) -> float:
    words = script.strip().split()
    if not words:
        with open(out_srt, 'w') as f:
            f.write('')
        return 0.0
    wps = 3.0  # ~3 words/sec
    total_seconds = max(6.0, min(15.0, len(words) / wps + 2.0))

    # naive single block
    def fmt(t: float) -> str:
        h = int(t // 3600)
        m = int((t % 3600) // 60)
        s = int(t % 60)
        ms = int((t - int(t)) * 1000)
        return f"{h:02d}:{m:02d}:{s:02d},{ms:03d}"

    text = script.strip()
    with open(out_srt, 'w') as f:
        f.write("1\n")
        f.write(f"00:00:00,000 --> 00:00:{int(total_seconds):02d},000\n")
        f.write(text + "\n\n")
    return total_seconds


