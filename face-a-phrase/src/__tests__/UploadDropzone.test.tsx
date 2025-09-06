import { render, screen, fireEvent } from '@testing-library/react';
import UploadDropzone from '@/components/UploadDropzone';

describe('UploadDropzone', () => {
  it('accepts jpg/png and rejects others', () => {
    const onFileSelect = vi.fn();
    render(<UploadDropzone onFileSelect={onFileSelect} accept={["image/jpeg","image/png"]} maxSizeMB={10} />);

    const input = screen.getByRole('textbox', { hidden: true }) as HTMLInputElement | null;
    // Fallback: query by input[type=file] when role is hidden
    const fileInput = (input ?? document.querySelector('input[type="file"]')) as HTMLInputElement;

    const good = new File([new Uint8Array(10)], 'good.jpg', { type: 'image/jpeg' });
    const bad = new File([new Uint8Array(10)], 'bad.gif', { type: 'image/gif' });

    // Accept good file
    fireEvent.change(fileInput, { target: { files: [good] } });
    expect(onFileSelect).toHaveBeenCalledTimes(1);

    // Reject bad file (error shown)
    fireEvent.change(fileInput, { target: { files: [bad] } });
    expect(screen.getByText(/Upload Error/i)).toBeInTheDocument();
  });
});


