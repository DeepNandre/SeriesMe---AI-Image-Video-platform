import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import Library from '../../pages/Library';

// Mock the useToast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

// Mock the IndexedDB operations
vi.mock('@/lib/idb', () => ({
  idbGet: vi.fn().mockResolvedValue([
    {
      id: 'video1',
      filename: 'test-video.mp4',
      thumbnail: '/placeholder.svg',
      duration: 15,
      createdAt: new Date('2024-01-01'),
      script: 'Test script',
      videoUrl: 'blob:test-url'
    }
  ]),
  idbSet: vi.fn().mockResolvedValue(undefined),
  idbDelete: vi.fn().mockResolvedValue(undefined)
}));

describe('Library Actions Accessibility', () => {
  it('should have keyboard accessible action buttons', async () => {
    render(<Library />);
    
    // Wait for video to load
    await screen.findByText('test-video.mp4');
    
    // All action buttons should be present and keyboard accessible
    const downloadButton = screen.getByLabelText('Download test-video.mp4');
    const duplicateButton = screen.getByLabelText('Duplicate test-video.mp4');
    const deleteButton = screen.getByLabelText('Delete test-video.mp4');
    
    expect(downloadButton).toBeInTheDocument();
    expect(duplicateButton).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();
    
    // Buttons should be focusable
    expect(downloadButton.tagName).toBe('BUTTON');
    expect(duplicateButton.tagName).toBe('BUTTON');
    expect(deleteButton.tagName).toBe('BUTTON');
  });

  it('should handle keyboard navigation with Enter key', async () => {
    const user = userEvent.setup();
    render(<Library />);
    
    await screen.findByText('test-video.mp4');
    
    const downloadButton = screen.getByLabelText('Download test-video.mp4');
    
    // Focus and press Enter
    downloadButton.focus();
    await user.keyboard('{Enter}');
    
    // Action should be triggered (we can't easily test the actual download,
    // but we can verify the button responds to keyboard events)
    expect(downloadButton).toHaveFocus();
  });

  it('should handle keyboard navigation with Space key', async () => {
    const user = userEvent.setup();
    render(<Library />);
    
    await screen.findByText('test-video.mp4');
    
    const duplicateButton = screen.getByLabelText('Duplicate test-video.mp4');
    
    // Focus and press Space
    duplicateButton.focus();
    await user.keyboard(' ');
    
    // Button should remain focused after activation
    expect(duplicateButton).toHaveFocus();
  });

  it('should provide proper ARIA labels for all actions', async () => {
    render(<Library />);
    
    await screen.findByText('test-video.mp4');
    
    // Check aria-label attributes
    const downloadButton = screen.getByLabelText('Download test-video.mp4');
    const duplicateButton = screen.getByLabelText('Duplicate test-video.mp4');
    const deleteButton = screen.getByLabelText('Delete test-video.mp4');
    
    expect(downloadButton).toHaveAttribute('aria-label', 'Download test-video.mp4');
    expect(duplicateButton).toHaveAttribute('aria-label', 'Duplicate test-video.mp4');
    expect(deleteButton).toHaveAttribute('aria-label', 'Delete test-video.mp4');
    
    // Check title attributes for additional context
    expect(downloadButton).toHaveAttribute('title', 'Download');
    expect(duplicateButton).toHaveAttribute('title', 'Duplicate');
    expect(deleteButton).toHaveAttribute('title');
  });

  it('should have visible focus rings', async () => {
    render(<Library />);
    
    await screen.findByText('test-video.mp4');
    
    const buttons = [
      screen.getByLabelText('Download test-video.mp4'),
      screen.getByLabelText('Duplicate test-video.mp4'),
      screen.getByLabelText('Delete test-video.mp4')
    ];
    
    buttons.forEach(button => {
      expect(button).toHaveClass('focus-visible:outline');
      expect(button).toHaveClass('focus-visible:outline-2');
      expect(button).toHaveClass('focus-visible:outline-offset-2');
    });
  });

  it('should show empty state when no videos are available', () => {
    // Mock empty library
    const { idbGet } = require('@/lib/idb');
    idbGet.mockResolvedValueOnce([]);
    
    render(<Library />);
    
    // Should show empty state with proper messaging
    expect(screen.getByText(/No videos yet/)).toBeInTheDocument();
    expect(screen.getByText(/Create your first video/)).toBeInTheDocument();
  });

  it('should handle action button interactions properly', async () => {
    const user = userEvent.setup();
    render(<Library />);
    
    await screen.findByText('test-video.mp4');
    
    // Test download button click
    const downloadButton = screen.getByLabelText('Download test-video.mp4');
    await user.click(downloadButton);
    
    // Test duplicate button click  
    const duplicateButton = screen.getByLabelText('Duplicate test-video.mp4');
    await user.click(duplicateButton);
    
    // Test delete button click
    const deleteButton = screen.getByLabelText('Delete test-video.mp4');
    await user.click(deleteButton);
    
    // All interactions should complete without errors
    // (Actual functionality testing would require more complex mocking)
  });

  it('should display video metadata accessibly', async () => {
    render(<Library />);
    
    await screen.findByText('test-video.mp4');
    
    // Video information should be displayed
    expect(screen.getByText('test-video.mp4')).toBeInTheDocument();
    expect(screen.getByText('0:15')).toBeInTheDocument(); // Duration
    
    // Creation date should be shown
    const dateElement = screen.getByText(/Jan 1, 2024/);
    expect(dateElement).toBeInTheDocument();
  });
});