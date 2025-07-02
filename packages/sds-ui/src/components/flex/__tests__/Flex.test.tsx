import { render, screen } from '@testing-library/react';
import Flex from '../Flex';

describe('Flex Component', () => {
  test('renders children correctly', () => {
    render(
      <Flex>
        <div automation-id="child">Child Content</div>
      </Flex>,
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  test('applies default prop values correctly', () => {
    const { container } = render(
      <Flex>
        <div>Child Content</div>
      </Flex>,
    );

    const flexDiv = container.firstChild as HTMLElement;
    expect(flexDiv).toHaveStyle({
      display: 'flex',
      gap: '24px',
    });
  });

  test('applies custom display value correctly', () => {
    const { container } = render(
      <Flex display="inline-flex">
        <div>Child Content</div>
      </Flex>,
    );

    const flexDiv = container.firstChild as HTMLElement;
    expect(flexDiv).toHaveStyle('display: inline-flex');
  });

  test('applies custom gap value correctly', () => {
    const { container } = render(
      <Flex gap="8px">
        <div>Child Content</div>
      </Flex>,
    );

    const flexDiv = container.firstChild as HTMLElement;
    expect(flexDiv).toHaveStyle('gap: 8px');
  });

  test('applies alignment props correctly', () => {
    const { container } = render(
      <Flex alignItems="center" justifyContent="space-between">
        <div>Child Content</div>
      </Flex>,
    );

    const flexDiv = container.firstChild as HTMLElement;
    expect(flexDiv).toHaveStyle({
      'align-items': 'center',
      'justify-content': 'space-between',
    });
  });

  test('applies flex direction and wrap props correctly', () => {
    const { container } = render(
      <Flex flexDirection="column" flexWrap="wrap">
        <div>Child Content</div>
      </Flex>,
    );

    const flexDiv = container.firstChild as HTMLElement;
    expect(flexDiv).toHaveStyle({
      'flex-direction': 'column',
      'flex-wrap': 'wrap',
    });
  });

  test('applies flex child props correctly', () => {
    const { container } = render(
      <Flex flexBasis="100px" flexGrow={1} flexShrink={0}>
        <div>Child Content</div>
      </Flex>,
    );

    const flexDiv = container.firstChild as HTMLElement;
    expect(flexDiv).toHaveStyle({
      'flex-basis': '100px',
      'flex-grow': 1,
      'flex-shrink': 0,
    });
  });

  test('applies minHeight prop correctly', () => {
    const { container } = render(
      <Flex minHeight="200px">
        <div>Child Content</div>
      </Flex>,
    );

    const flexDiv = container.firstChild as HTMLElement;
    expect(flexDiv).toHaveStyle('min-height: 200px');
  });

  test('applies custom className correctly', () => {
    const { container } = render(
      <Flex className="custom-class">
        <div>Child Content</div>
      </Flex>,
    );

    const flexDiv = container.firstChild as HTMLElement;
    expect(flexDiv).toHaveClass('custom-class');
  });

  test('applies automation-id correctly', () => {
    render(
      <Flex automation-id="flex-test">
        <div>Child Content</div>
      </Flex>,
    );

    expect(screen.getByText('Child Content').parentElement).toHaveAttribute('automation-id', 'flex-test');
  });

  test('forwards additional props to div element', () => {
    render(
      <Flex automation-id="flex-component" aria-label="flex container">
        <div>Child Content</div>
      </Flex>,
    );

    const flexDiv = screen.getByTestId('flex-component');
    expect(flexDiv).toBeInTheDocument();
    expect(flexDiv).toHaveAttribute('aria-label', 'flex container');
  });
});
