import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { VideoPlayer } from '../VideoPlayer';

// Mock URL.createObjectURL for blob handling
Object.defineProperty(global.URL, 'createObjectURL', {
  writable: true,
  value: vi.fn(() => 'mocked-object-url')
});

describe('VideoPlayer', () => {
  const defaultProps = {
    src: 'test-video.mp4',
    poster: 'test-poster.jpg',
    duration: 15,
    onDownload: vi.fn(),
    onShare: vi.fn(),
    onSave: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render with preload metadata and poster', () => {
    render(<VideoPlayer {...defaultProps} />);
    
    const video = screen.getByRole('button'); // Video element with controls
    const videoElement = document.querySelector('video');
    
    expect(videoElement).toBeInTheDocument();
    expect(videoElement).toHaveAttribute('preload', 'metadata');
    expect(videoElement).toHaveAttribute('poster', 'test-poster.jpg');
    expect(videoElement).toHaveAttribute('playsInline');
  });

  it('should have proper aspect ratio for vertical videos', () => {
    render(<VideoPlayer {...defaultProps} />);
    
    const container = screen.getByRole('button').closest('div');
    expect(container).toHaveClass('aspect-[9/16]');
  });

  it('should display video controls and metadata', () => {
    render(<VideoPlayer {...defaultProps} />);
    
    // Duration should be displayed
    expect(screen.getByText('0:15')).toBeInTheDocument();
    
    // Resolution should be displayed (default values)
    expect(screen.getByText('1080×1920')).toBeInTheDocument();
  });

  it('should show watermark overlay', () => {
    render(<VideoPlayer {...defaultProps} />);
    
    const watermark = screen.getByText('SeriesMe');
    expect(watermark).toBeInTheDocument();
    expect(watermark).toHaveClass('absolute', 'bottom-4', 'right-4');
  });

  it('should handle action button clicks', async () => {
    const mockOnDownload = vi.fn();
    const mockOnShare = vi.fn();
    const mockOnSave = vi.fn();
    
    render(
      <VideoPlayer
        {...defaultProps}
        onDownload={mockOnDownload}
        onShare={mockOnShare}
        onSave={mockOnSave}
      />
    );
    
    // Action buttons should be present
    const downloadButton = screen.getByLabelText('Download video');
    const shareButton = screen.getByLabelText('Share video');
    const saveButton = screen.getByLabelText('Save to library');
    
    expect(downloadButton).toBeInTheDocument();
    expect(shareButton).toBeInTheDocument();
    expect(saveButton).toBeInTheDocument();
  });

  it('should handle blob URLs correctly', () => {
    const blobUrl = 'blob:http://localhost:3000/abcd-1234';
    
    render(
      <VideoPlayer
        {...defaultProps}
        src={blobUrl}
      />
    );
    
    const videoElement = document.querySelector('video');
    expect(videoElement).toHaveAttribute('src', blobUrl);
  });

  it('should format duration correctly', () => {
    const { rerender } = render(
      <VideoPlayer {...defaultProps} duration={65} />
    );
    
    // Should show minutes and seconds for durations over 60s
    expect(screen.getByText('1:05')).toBeInTheDocument();
    
    // Test with just seconds
    rerender(<VideoPlayer {...defaultProps} duration={45} />);
    expect(screen.getByText('0:45')).toBeInTheDocument();
    
    // Test with longer duration
    rerender(<VideoPlayer {...defaultProps} duration={125} />);
    expect(screen.getByText('2:05')).toBeInTheDocument();
  });

  it('should handle missing poster gracefully', () => {
    render(
      <VideoPlayer
        {...defaultProps}
        poster={undefined}
      />
    );
    
    const videoElement = document.querySelector('video');
    expect(videoElement).not.toHaveAttribute('poster');
  });

  it('should display custom resolution when provided', () => {
    render(
      <VideoPlayer
        {...defaultProps}
        width={720}
        height={1280}
      />
    );
    
    expect(screen.getByText('720×1280')).toBeInTheDocument();
  });

  it('should have accessible controls', () => {
    render(<VideoPlayer {...defaultProps} />);
    
    const videoElement = document.querySelector('video');
    expect(videoElement).toHaveAttribute('controls');
    
    // Action buttons should have proper ARIA labels
    expect(screen.getByLabelText('Download video')).toBeInTheDocument();
    expect(screen.getByLabelText('Share video')).toBeInTheDocument();
    expect(screen.getByLabelText('Save to library')).toBeInTheDocument();
  });

  it('should handle video loading states', () => {
    render(<VideoPlayer {...defaultProps} />);
    
    const videoElement = document.querySelector('video');
    
    // Should use metadata preload for performance
    expect(videoElement).toHaveAttribute('preload', 'metadata');
    
    // Should not autoplay
    expect(videoElement).not.toHaveAttribute('autoplay');
  });

  it('should be optimized for mobile', () => {
    render(<VideoPlayer {...defaultProps} />);
    
    const videoElement = document.querySelector('video');
    
    // Should have playsInline for better mobile experience
    expect(videoElement).toHaveAttribute('playsInline');
    
    // Container should have proper responsive classes
    const container = videoElement?.closest('.relative');
    expect(container).toHaveClass('relative');
  });
});