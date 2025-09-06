import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ProgressStepper from '../ProgressStepper';

describe('ProgressStepper Accessibility', () => {
  it('should have proper ARIA live regions', () => {
    render(
      <ProgressStepper
        currentStage="processing"
        progress={50}
        etaSeconds={30}
      />
    );

    // Check for status live region
    const statusRegion = screen.getByRole('status');
    expect(statusRegion).toBeInTheDocument();
    expect(statusRegion).toHaveAttribute('aria-live', 'polite');
    expect(statusRegion).toHaveAttribute('aria-atomic', 'true');
  });

  it('should announce progress updates to screen readers', () => {
    const { rerender } = render(
      <ProgressStepper
        currentStage="processing"
        progress={25}
        etaSeconds={60}
      />
    );

    // Initial status should be announced
    expect(screen.getByText(/Processing\.\.\./)).toBeInTheDocument();
    expect(screen.getByText(/~1m remaining/)).toBeInTheDocument();

    // Update progress
    rerender(
      <ProgressStepper
        currentStage="assembling"
        progress={75}
        etaSeconds={15}
      />
    );

    // Updated status should be announced
    expect(screen.getByText(/Assembling\.\.\./)).toBeInTheDocument();
    expect(screen.getByText(/~15s remaining/)).toBeInTheDocument();
  });

  it('should properly announce errors with alert role', () => {
    render(
      <ProgressStepper
        currentStage="error"
        error="Processing failed. Please try again."
      />
    );

    const errorMessage = screen.getByText(/Processing failed\. Please try again\./);
    expect(errorMessage).toBeInTheDocument();
    // The error should be in an alert context for screen readers
    expect(screen.getByText(/Generation Failed/)).toBeInTheDocument();
  });

  it('should have meaningful stage labels', () => {
    const stages = ['uploading', 'queued', 'processing', 'assembling', 'ready'] as const;
    
    stages.forEach(stage => {
      const { rerender } = render(
        <ProgressStepper currentStage={stage} progress={50} />
      );
      
      // Each stage should have a descriptive label
      const stageLabels = {
        uploading: 'Uploading',
        queued: 'Queued', 
        processing: 'Processing',
        assembling: 'Assembling',
        ready: 'Ready'
      };
      
      expect(screen.getByText(stageLabels[stage])).toBeInTheDocument();
    });
  });

  it('should format ETA times accessibly', () => {
    const { rerender } = render(
      <ProgressStepper
        currentStage="processing"
        progress={25}
        etaSeconds={90}
      />
    );

    // Should show minutes and seconds
    expect(screen.getByText(/~1m 30s remaining/)).toBeInTheDocument();

    // Test with just seconds
    rerender(
      <ProgressStepper
        currentStage="processing"
        progress={75}
        etaSeconds={45}
      />
    );

    expect(screen.getByText(/~45s remaining/)).toBeInTheDocument();

    // Test with just minutes
    rerender(
      <ProgressStepper
        currentStage="processing"
        progress={50}
        etaSeconds={120}
      />
    );

    expect(screen.getByText(/~2m remaining/)).toBeInTheDocument();
  });
});