import { render, screen } from '@testing-library/react';
import { VideoPlayer } from '@/components/VideoPlayer';

describe('VideoPlayer', () => {
  it('renders video with poster and src', () => {
    render(<VideoPlayer src="/test.mp4" poster="/poster.jpg" duration={12} />);
    const video = document.querySelector('video');
    expect(video).toBeTruthy();
    expect(video?.getAttribute('src')).toContain('/test.mp4');
    expect(video?.getAttribute('poster')).toContain('/poster.jpg');
  });
});


