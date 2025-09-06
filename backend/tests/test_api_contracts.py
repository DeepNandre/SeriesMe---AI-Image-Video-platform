import os
import io
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def tiny_jpg_bytes():
    # minimal 1x1 jpg
    return (b"\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x00\x00\x01\x00\x01\x00\x00\xff\xdb\x00C"
            b"\x00\x08\x06\x06\x07\x06\x05\x08\x07\x07\x07\x09\x09\x08\n\x0c\x14\r\x0c\x0b\x0b\x0c"
            b"\x19\x12\x13\x0f\x14\x1d\x1a\x1f\x1e\x1d\x1a\x1c\x1c $.'\x1c\x1c(7),01444\x1f"
            b"9=82<.342\xff\xdb\x00C\x01\t\t\t\x0c\x0b\x0c\x18\r\r\x18.\x1d\x1c\x1d.2(2" 
            b"2.2.2.2.2.2.2.2.2.2.2.2\xff\xc0\x00\x11\x08\x00\x01\x00\x01\x03\x01\x11\x00\x02\x11\x01\x03\x11\x01\xff\xc4\x00\x14\x00\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\xff\xc4\x00\x14\x10\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\xff\xda\x00\x08\x01\x01\x00\x00?\x00\xd2\xcf\x00\xff\xd9")


def test_generate_and_result():
    files = {
        'selfie': ('selfie.jpg', tiny_jpg_bytes(), 'image/jpeg')
    }
    data = {
        'script': 'Hello world',
        'consent': 'true'
    }
    r = client.post('/api/generate', data=data, files=files)
    assert r.status_code == 202
    jobId = r.json()['jobId']

    # poll status until ready or timeout
    for _ in range(30):
        s = client.get('/api/status', params={'jobId': jobId})
        assert s.status_code == 200
        st = s.json()['status']
        if st == 'ready':
            break
    assert st == 'ready'

    res = client.get('/api/result', params={'jobId': jobId})
    assert res.status_code == 200
    body = res.json()
    assert body['videoUrl'].startswith('/media/')
    assert body['posterUrl'].startswith('/media/')


