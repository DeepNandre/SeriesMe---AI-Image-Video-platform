import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import UploadDropzone from '../UploadDropzone';

describe('UploadDropzone Validation', () => {
  const mockOnFileSelect = vi.fn();

  beforeEach(() => {
    mockOnFileSelect.mockClear();
  });

  it('should reject files with invalid types', async () => {
    render(
      <UploadDropzone
        onFileSelect={mockOnFileSelect}
        accept={['image/jpeg', 'image/png']}
        maxSizeMB={10}
      />
    );

    const fileInput = screen.getByLabelText('Upload selfie');
    
    // Create a text file (invalid type)
    const invalidFile = new File(['test content'], 'test.txt', {
      type: 'text/plain'
    });

    await userEvent.upload(fileInput, invalidFile);

    // Should show error message
    expect(screen.getByText(/Please choose a image\/jpeg or image\/png file/)).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(mockOnFileSelect).not.toHaveBeenCalled();
  });

  it('should reject files that are too large', async () => {
    render(
      <UploadDropzone
        onFileSelect={mockOnFileSelect}
        accept={['image/jpeg']}
        maxSizeMB={1} // 1MB limit
      />
    );

    const fileInput = screen.getByLabelText('Upload selfie');
    
    // Create a file larger than 1MB
    const largeFile = new File(['x'.repeat(2 * 1024 * 1024)], 'large.jpg', {
      type: 'image/jpeg'
    });

    await userEvent.upload(fileInput, largeFile);

    // Should show error message
    expect(screen.getByText(/File size must be under 1 MB/)).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(mockOnFileSelect).not.toHaveBeenCalled();
  });

  it('should accept valid files', async () => {
    render(
      <UploadDropzone
        onFileSelect={mockOnFileSelect}
        accept={['image/jpeg', 'image/png']}
        maxSizeMB={10}
      />
    );

    const fileInput = screen.getByLabelText('Upload selfie');
    
    // Create a valid JPEG file
    const validFile = new File(['fake image content'], 'selfie.jpg', {
      type: 'image/jpeg'
    });

    await userEvent.upload(fileInput, validFile);

    // Should call onFileSelect and show success state
    expect(mockOnFileSelect).toHaveBeenCalledWith(validFile);
    expect(screen.getByText('selfie.jpg')).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('should handle drag and drop validation', () => {
    render(
      <UploadDropzone
        onFileSelect={mockOnFileSelect}
        accept={['image/png']}
        maxSizeMB={5}
      />
    );

    const dropzone = screen.getByText(/Drop your selfie here/);
    
    // Create an invalid file for drop
    const invalidFile = new File(['content'], 'test.gif', {
      type: 'image/gif'
    });

    // Mock drag and drop event
    fireEvent.drop(dropzone, {
      dataTransfer: {
        files: [invalidFile]
      }
    });

    // Should show error
    expect(screen.getByText(/Please choose a image\/png file/)).toBeInTheDocument();
    expect(mockOnFileSelect).not.toHaveBeenCalled();
  });

  it('should provide accessible error dismissal', async () => {
    render(
      <UploadDropzone
        onFileSelect={mockOnFileSelect}
        accept={['image/jpeg']}
        maxSizeMB={1}
      />
    );

    const fileInput = screen.getByLabelText('Upload selfie');
    
    // Upload invalid file to trigger error
    const invalidFile = new File(['content'], 'test.txt', {
      type: 'text/plain'
    });

    await userEvent.upload(fileInput, invalidFile);

    // Error should be visible
    expect(screen.getByRole('alert')).toBeInTheDocument();

    // Find and click dismiss button
    const dismissButton = screen.getByLabelText('Dismiss error');
    await userEvent.click(dismissButton);

    // Error should be dismissed
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('should handle disabled state properly', () => {
    render(
      <UploadDropzone
        onFileSelect={mockOnFileSelect}
        accept={['image/jpeg']}
        maxSizeMB={10}
        disabled={true}
      />
    );

    const fileInput = screen.getByLabelText('Upload selfie');
    expect(fileInput).toBeDisabled();
    
    // Dropzone should have disabled styling
    const dropzone = dropzone = screen.getByText(/Drop your selfie here/).closest('div');
    expect(dropzone).toHaveClass('opacity-50', 'cursor-not-allowed');
  });

  it('should allow file removal after successful upload', async () => {
    render(
      <UploadDropzone
        onFileSelect={mockOnFileSelect}
        accept={['image/jpeg']}
        maxSizeMB={10}
      />
    );

    // Upload valid file
    const fileInput = screen.getByLabelText('Upload selfie');
    const validFile = new File(['image'], 'photo.jpg', {
      type: 'image/jpeg'
    });

    await userEvent.upload(fileInput, validFile);

    // Should show file with remove button
    expect(screen.getByText('photo.jpg')).toBeInTheDocument();
    
    const removeButton = screen.getByLabelText('Remove photo.jpg');
    await userEvent.click(removeButton);

    // File should be removed, back to upload state
    expect(screen.queryByText('photo.jpg')).not.toBeInTheDocument();
    expect(screen.getByText(/Drop your selfie here/)).toBeInTheDocument();
  });

  it('should provide keyboard accessibility', async () => {
    render(
      <UploadDropzone
        onFileSelect={mockOnFileSelect}
        accept={['image/jpeg']}
        maxSizeMB={10}
      />
    );

    const chooseButton = screen.getByLabelText('Open file picker');
    expect(chooseButton).toBeInTheDocument();
    
    // Button should be keyboard accessible
    chooseButton.focus();
    expect(chooseButton).toHaveFocus();
    
    // Should have visible focus ring
    expect(chooseButton).toHaveClass('focus-visible:outline');
  });
});