import { render, screen } from '@testing-library/react';
import Container from '../Container';

describe('Container component', () => {
  it('renders its children', () => {
    render(
      <Container>
        <div automation-id="child" />
      </Container>,
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('applies styling based on props', () => {
    render(
      <Container marginTop="24px" marginBottom={'32px'}>
        <div automation-id="child" />
      </Container>,
    );

    const container = screen.getByTestId('child').parentNode;
    expect(container).toHaveStyle('margin-top: 24px');
    expect(container).toHaveStyle('margin-bottom: 32px');
  });

  it('supports display, justifyContent, and overflow props', () => {
    render(
      <Container display="flex" justifyContent="center" overflow="auto">
        <div automation-id="child" />
      </Container>,
    );

    const container = screen.getByTestId('child').parentNode;
    expect(container).toHaveStyle('display: flex');
    expect(container).toHaveStyle('justify-content: center');
    expect(container).toHaveStyle('overflow: auto');
  });

  it('passes through additional props', () => {
    render(
      <Container automation-id="container">
        <div />
      </Container>,
    );

    const container = screen.getByTestId('container');
    expect(container).toHaveAttribute('automation-id');
  });
});
