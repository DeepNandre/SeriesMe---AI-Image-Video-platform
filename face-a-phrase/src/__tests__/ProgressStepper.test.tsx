import { render, screen } from '@testing-library/react';
import ProgressStepper from '@/components/ProgressStepper';

describe('ProgressStepper', () => {
  it('renders current stage and aria-live region', () => {
    render(<ProgressStepper currentStage="processing" progress={50} etaSeconds={60} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByText(/Processing/i)).toBeInTheDocument();
  });
});


