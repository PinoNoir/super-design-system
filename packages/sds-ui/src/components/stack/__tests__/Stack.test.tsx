import { render, screen } from '@testing-library/react';
import Stack from '../Stack';

describe('Stack Component', () => {
  it('renders children correctly', () => {
    render(
      <Stack>
        <div automation-id="child">Test Child</div>
      </Stack>,
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  it('applies default styling correctly', () => {
    render(
      <Stack>
        <div>Test Child</div>
      </Stack>,
    );

    const stack = screen.getByText('Test Child').parentElement;
    expect(stack).toHaveStyle({
      display: 'flex',
      gap: '24px',
      flexDirection: 'column',
    });
  });

  it('applies custom className', () => {
    render(
      <Stack className="custom-class">
        <div>Test Child</div>
      </Stack>,
    );

    const stack = screen.getByText('Test Child').parentElement;
    expect(stack).toHaveClass('custom-class');
  });

  it('applies custom gap value', () => {
    render(
      <Stack gap="16px">
        <div>Test Child</div>
      </Stack>,
    );

    const stack = screen.getByText('Test Child').parentElement;
    expect(stack).toHaveStyle({
      gap: '16px',
    });
  });

  it('applies alignItems correctly', () => {
    render(
      <Stack alignItems="center">
        <div>Test Child</div>
      </Stack>,
    );

    const stack = screen.getByText('Test Child').parentElement;
    expect(stack).toHaveStyle({
      alignItems: 'center',
    });
  });

  it('applies justifyContent correctly', () => {
    render(
      <Stack justifyContent="space-between">
        <div>Test Child</div>
      </Stack>,
    );

    const stack = screen.getByText('Test Child').parentElement;
    expect(stack).toHaveStyle({
      justifyContent: 'space-between',
    });
  });

  it('applies custom flexDirection', () => {
    render(
      <Stack flexDirection="row">
        <div>Test Child</div>
      </Stack>,
    );

    const stack = screen.getByText('Test Child').parentElement;
    expect(stack).toHaveStyle({
      flexDirection: 'row',
    });
  });

  it('applies automation-id attribute', () => {
    render(
      <Stack automation-id="test-stack">
        <div>Test Child</div>
      </Stack>,
    );

    const stack = screen.getByText('Test Child').parentElement;
    expect(stack).toHaveAttribute('automation-id', 'test-stack');
  });

  it('passes additional props to the div element', () => {
    render(
      <Stack automation-id="stack-element" aria-label="stack container">
        <div>Test Child</div>
      </Stack>,
    );

    const stack = screen.getByTestId('stack-element');
    expect(stack).toHaveAttribute('aria-label', 'stack container');
  });

  it('renders multiple children correctly', () => {
    render(
      <Stack>
        <div automation-id="child1">Child 1</div>
        <div automation-id="child2">Child 2</div>
        <div automation-id="child3">Child 3</div>
      </Stack>,
    );

    expect(screen.getByTestId('child1')).toBeInTheDocument();
    expect(screen.getByTestId('child2')).toBeInTheDocument();
    expect(screen.getByTestId('child3')).toBeInTheDocument();
  });

  it('combines all style properties correctly', () => {
    render(
      <Stack gap="8px" alignItems="flex-end" justifyContent="center" flexDirection="row-reverse">
        <div>Test Child</div>
      </Stack>,
    );

    const stack = screen.getByText('Test Child').parentElement;
    expect(stack).toHaveStyle({
      display: 'flex',
      gap: '8px',
      alignItems: 'flex-end',
      justifyContent: 'center',
      flexDirection: 'row-reverse',
    });
  });
});
