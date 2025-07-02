import { render, screen, act } from '@testing-library/react';
import Beacon from '../Beacon';

// Mock timers for predictable animation testing
jest.useFakeTimers();

describe('Beacon', () => {
  beforeEach(() => {
    jest.clearAllTimers();
  });

  it('renders with default thinking state', () => {
    render(<Beacon />);

    expect(screen.getByText('Thinking')).toBeInTheDocument();

    // Verify NO progress bar by default (showProgressBar defaults to false)
    const progressBar = document.querySelector('.progressBarContainer');
    expect(progressBar).not.toBeInTheDocument();
  });

  it('renders idle state correctly', () => {
    render(<Beacon state="idle" />);

    expect(screen.getByText('Ready')).toBeInTheDocument();

    // Verify no progress bar in idle state
    const progressBar = document.querySelector('.progressBarContainer');
    expect(progressBar).not.toBeInTheDocument();
  });

  it('renders processing state correctly', () => {
    render(<Beacon state="processing" />);

    expect(screen.getByText('Processing your request')).toBeInTheDocument();

    // Verify NO progress bar by default (showProgressBar defaults to false)
    const progressBar = document.querySelector('.progressBarContainer');
    expect(progressBar).not.toBeInTheDocument();
  });

  it('renders generating state correctly', () => {
    render(<Beacon state="generating" />);

    expect(screen.getByText('Generating response')).toBeInTheDocument();

    // Verify NO progress bar by default (showProgressBar defaults to false)
    const progressBar = document.querySelector('.progressBarContainer');
    expect(progressBar).not.toBeInTheDocument();
  });

  it('shows progress bar when explicitly enabled', () => {
    render(<Beacon state="processing" showProgressBar={true} />);

    expect(screen.getByText('Processing your request')).toBeInTheDocument();

    // Verify progress bar IS visible when explicitly enabled
    const progressBar = document.querySelector('.progressBarContainer');
    expect(progressBar).toBeInTheDocument();
  });

  it('does not show progress bar in idle state even when enabled', () => {
    render(<Beacon state="idle" showProgressBar={true} />);

    expect(screen.getByText('Ready')).toBeInTheDocument();

    // Progress bar should not show in idle state regardless of showProgressBar prop
    const progressBar = document.querySelector('.progressBarContainer');
    expect(progressBar).not.toBeInTheDocument();
  });

  it('animates dots in active states', () => {
    render(<Beacon state="thinking" />);

    // Initially should not have dots (need to check the dots container separately)
    const textContent = document.querySelector('.statusTextContent');
    const dotsContainer = document.querySelector('.statusDots');

    expect(textContent).toHaveTextContent('Thinking');
    expect(dotsContainer).toHaveTextContent('');

    // After 500ms, should have one dot
    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(dotsContainer).toHaveTextContent('.');

    // After another 500ms, should have two dots
    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(dotsContainer).toHaveTextContent('..');

    // After another 500ms, should have three dots
    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(dotsContainer).toHaveTextContent('...');

    // After another 500ms, should cycle back to no dots
    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(dotsContainer).toHaveTextContent('');
  });

  it('animates text transition when state changes', () => {
    const { rerender } = render(<Beacon state="thinking" />);

    // Initially in thinking state
    const textContent = document.querySelector('.statusTextContent');
    expect(textContent).toHaveTextContent('Thinking');

    // Change to processing state
    rerender(<Beacon state="processing" />);

    // Before the animation completes, the old text should still be visible
    // but with the exiting class
    let statusText = document.querySelector('.statusText');
    expect(statusText).toHaveClass('exiting');
    expect(textContent).toHaveTextContent('Thinking');

    // After 300ms, the text should update and have entering class
    act(() => {
      jest.advanceTimersByTime(300);
    });
    statusText = document.querySelector('.statusText');
    expect(statusText).toHaveClass('entering');
    expect(textContent).toHaveTextContent('Processing your request');

    // After 50ms more, the text should have current class
    act(() => {
      jest.advanceTimersByTime(50);
    });
    statusText = document.querySelector('.statusText');
    expect(statusText).toHaveClass('current');
    expect(textContent).toHaveTextContent('Processing your request');
  });

  it('applies drop shadow effect in active states but not in idle state', () => {
    // First check active state (thinking)
    const { rerender } = render(<Beacon state="thinking" />);

    // Check for presence of active class on circle in active state
    const circle = document.querySelector('.circle');
    expect(circle).toHaveClass('active');

    // Now check idle state
    rerender(<Beacon state="idle" />);

    // After animation completes, active class should not be present
    act(() => {
      jest.advanceTimersByTime(350); // Wait for animation to complete
    });

    const idleCircle = document.querySelector('.circle');
    expect(idleCircle).not.toHaveClass('active');
  });

  it('stops dot animation when switching to idle state', () => {
    const { rerender } = render(<Beacon state="thinking" />);

    // Get dots going
    act(() => {
      jest.advanceTimersByTime(500);
    });
    const dotsContainer = document.querySelector('.statusDots');
    expect(dotsContainer).toHaveTextContent('.');

    // Switch to idle
    rerender(<Beacon state="idle" />);

    // After animation completes, should show Ready with no dots
    act(() => {
      jest.advanceTimersByTime(350); // Wait for animation
    });
    const textContent = document.querySelector('.statusTextContent');
    expect(textContent).toHaveTextContent('Ready');
    expect(dotsContainer).toHaveTextContent('');

    // Advance time more to ensure no dots appear
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(dotsContainer).toHaveTextContent(''); // Still no dots
  });

  it('applies the active class with drop shadow in active states', () => {
    const { rerender } = render(<Beacon state="thinking" />);

    const circle = document.querySelector('.circle');
    expect(circle).toHaveClass('circle');
    expect(circle).toHaveClass('active');

    // Check it's not applied in idle state
    rerender(<Beacon state="idle" />);

    // After animation completes
    act(() => {
      jest.advanceTimersByTime(350);
    });

    const idleCircle = document.querySelector('.circle');
    expect(idleCircle).not.toHaveClass('active');
  });

  it('handles multiple rapid state changes gracefully', () => {
    const { rerender } = render(<Beacon state="thinking" />);

    // Rapidly change states multiple times
    rerender(<Beacon state="processing" />);

    act(() => {
      jest.advanceTimersByTime(100); // Not enough time for full animation
    });

    rerender(<Beacon state="generating" />);

    act(() => {
      jest.advanceTimersByTime(100); // Not enough time for full animation
    });

    rerender(<Beacon state="idle" />);

    // After sufficient time, the final state should be displayed
    act(() => {
      jest.advanceTimersByTime(350); // Wait for animation
    });

    const textContent = document.querySelector('.statusTextContent');
    expect(textContent).toHaveTextContent('Ready');
  });

  it('respects custom messages', () => {
    const customMessages = {
      thinking: 'Analyzing query...',
      processing: 'Searching database...',
      generating: 'Creating response...',
      idle: 'How can I help?',
    };

    render(<Beacon state="thinking" customMessages={customMessages} />);

    const textContent = document.querySelector('.statusTextContent');
    expect(textContent).toHaveTextContent('Analyzing query...');
  });

  it('calls onComplete when transitioning to idle state', () => {
    const onCompleteMock = jest.fn();
    const { rerender } = render(<Beacon state="thinking" onComplete={onCompleteMock} />);

    // Change to idle state
    rerender(<Beacon state="idle" onComplete={onCompleteMock} />);

    // After transition completes, onComplete should have been called
    act(() => {
      jest.advanceTimersByTime(350);
    });

    expect(onCompleteMock).toHaveBeenCalledTimes(1);
  });

  it('can disable all animations', () => {
    render(<Beacon state="thinking" disabled={true} />);

    const circle = document.querySelector('.circle');
    const container = document.querySelector('.container');

    expect(container).toHaveClass('disabled');
    expect(circle).not.toHaveClass('active');

    // Should not animate dots when disabled
    const dotsContainer = document.querySelector('.statusDots');
    act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(dotsContainer).toHaveTextContent('');
  });
});
