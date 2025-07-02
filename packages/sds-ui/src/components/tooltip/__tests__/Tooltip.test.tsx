import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Tooltip from '../Tooltip';

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe(target: Element) {
    // Mock implementation: Log the observed element
    console.log('Observing:', target);
  }
  unobserve() {
    // Intentionally left empty for mocking purposes
  }
  disconnect() {
    // Intentionally left empty for mocking purposes
  }
};

// Mock the styles to avoid issues with CSS modules in tests
jest.mock('./styles/Tooltip.module.css', () => ({
  TooltipTrigger: 'trigger',
  TooltipContent: 'content',
  TooltipArrow: 'arrow',
}));

describe('Tooltip', () => {
  it('renders children correctly', () => {
    render(
      <Tooltip description="Tooltip description">
        <button>Hover me</button>
      </Tooltip>,
    );

    expect(screen.getByText('Hover me')).toBeInTheDocument();
  });

  it('shows tooltip content on hover', async () => {
    const user = userEvent.setup();

    render(
      <Tooltip description="Tooltip description">
        <button>Hover me</button>
      </Tooltip>,
    );

    const trigger = screen.getByText('Hover me');
    await user.hover(trigger);

    await waitFor(
      () => {
        const tooltip = document.querySelector('[role="tooltip"]');
        expect(tooltip).not.toBeNull();
        expect(tooltip).toHaveTextContent('Tooltip description');
      },
      { timeout: 2000 },
    );
  });
});
