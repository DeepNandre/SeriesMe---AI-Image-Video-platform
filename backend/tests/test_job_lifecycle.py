from app.pipeline.captions import make_srt


def test_captions_duration(tmp_path):
    srt = tmp_path / 'cap.srt'
    dur = make_srt('This is a short test sentence for captions', str(srt))
    assert dur >= 6.0
    assert srt.exists()


