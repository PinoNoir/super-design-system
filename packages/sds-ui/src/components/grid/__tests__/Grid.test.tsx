import React from 'react';
import { render, screen } from '@testing-library/react';
import Grid from '../Grid';

describe('Grid Component', () => {
  test('renders children correctly', () => {
    render(
      <Grid>
        <div automation-id="child">Child Content</div>
      </Grid>,
    );

    const childElement = screen.getByTestId('child');
    expect(childElement).toBeInTheDocument();
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  test('applies custom className when provided', () => {
    const { container } = render(
      <Grid className="custom-class">
        <div>Child Content</div>
      </Grid>,
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  test('renders with default gap value', () => {
    const { container } = render(
      <Grid>
        <div>Child Content</div>
      </Grid>,
    );

    const gridElement = container.firstChild as HTMLElement;
    expect(gridElement).toHaveStyle({ gap: '24px' });
  });

  test('renders with custom gap value', () => {
    const { container } = render(
      <Grid gap="32px">
        <div>Child Content</div>
      </Grid>,
    );

    const gridElement = container.firstChild as HTMLElement;
    expect(gridElement).toHaveStyle({ gap: '32px' });
  });

  test('renders with default display value', () => {
    const { container } = render(
      <Grid>
        <div>Child Content</div>
      </Grid>,
    );

    const gridElement = container.firstChild as HTMLElement;
    expect(gridElement).toHaveStyle({ display: 'grid' });
  });

  test('renders with inline-grid display value', () => {
    const { container } = render(
      <Grid display="inline-grid">
        <div>Child Content</div>
      </Grid>,
    );

    const gridElement = container.firstChild as HTMLElement;
    expect(gridElement).toHaveStyle({ display: 'inline-grid' });
  });

  test('applies numeric columns correctly', () => {
    const { container } = render(
      <Grid columns={3}>
        <div>Child Content</div>
      </Grid>,
    );

    const gridElement = container.firstChild as HTMLElement;
    expect(gridElement).toHaveStyle({ gridTemplateColumns: 'repeat(3, 1fr)' });
  });

  test('applies string columns correctly', () => {
    const { container } = render(
      <Grid columns="100px 1fr 2fr">
        <div>Child Content</div>
      </Grid>,
    );

    const gridElement = container.firstChild as HTMLElement;
    expect(gridElement).toHaveStyle({ gridTemplateColumns: '100px 1fr 2fr' });
  });

  test('applies numeric rows correctly', () => {
    const { container } = render(
      <Grid rows={2}>
        <div>Child Content</div>
      </Grid>,
    );

    const gridElement = container.firstChild as HTMLElement;
    expect(gridElement).toHaveStyle({ gridTemplateRows: 'repeat(2, 1fr)' });
  });

  test('applies string rows correctly', () => {
    const { container } = render(
      <Grid rows="auto 1fr">
        <div>Child Content</div>
      </Grid>,
    );

    const gridElement = container.firstChild as HTMLElement;
    expect(gridElement).toHaveStyle({ gridTemplateRows: 'auto 1fr' });
  });

  test('applies gridAutoColumns correctly', () => {
    const { container } = render(
      <Grid gridAutoColumns="minmax(100px, 1fr)">
        <div>Child Content</div>
      </Grid>,
    );

    const gridElement = container.firstChild as HTMLElement;
    expect(gridElement).toHaveStyle({ gridAutoColumns: 'minmax(100px, 1fr)' });
  });

  test('applies gridAutoRows correctly', () => {
    const { container } = render(
      <Grid gridAutoRows="minmax(50px, auto)">
        <div>Child Content</div>
      </Grid>,
    );

    const gridElement = container.firstChild as HTMLElement;
    expect(gridElement).toHaveStyle({ gridAutoRows: 'minmax(50px, auto)' });
  });

  test('renders with default gridAutoFlow value', () => {
    const { container } = render(
      <Grid>
        <div>Child Content</div>
      </Grid>,
    );

    const gridElement = container.firstChild as HTMLElement;
    expect(gridElement).toHaveStyle({ gridAutoFlow: 'row' });
  });

  test('applies custom gridAutoFlow correctly', () => {
    const { container } = render(
      <Grid gridAutoFlow="column">
        <div>Child Content</div>
      </Grid>,
    );

    const gridElement = container.firstChild as HTMLElement;
    expect(gridElement).toHaveStyle({ gridAutoFlow: 'column' });
  });

  test('passes containerName prop correctly', () => {
    const { container } = render(
      <Grid containerName="main-layout">
        <div>Child Content</div>
      </Grid>,
    );

    const gridElement = container.firstChild as HTMLElement;
    expect(gridElement.style).toHaveProperty('containerName', 'main-layout');
  });

  test('passes containerType prop correctly', () => {
    const { container } = render(
      <Grid containerType="inline-size">
        <div>Child Content</div>
      </Grid>,
    );

    const gridElement = container.firstChild as HTMLElement;
    expect(gridElement.style).toHaveProperty('containerType', 'inline-size');
  });

  test('applies automation-id for testing purposes', () => {
    render(
      <Grid automation-id="test-grid">
        <div>Child Content</div>
      </Grid>,
    );

    const gridElement = screen.getByTestId('test-grid');
    expect(gridElement).toBeInTheDocument();
  });

  test('forwards additional props to the div element', () => {
    const { container } = render(
      <Grid data-custom="custom-value" title="Grid Title">
        <div>Child Content</div>
      </Grid>,
    );

    const gridElement = container.firstChild as HTMLElement;
    expect(gridElement).toHaveAttribute('data-custom', 'custom-value');
    expect(gridElement).toHaveAttribute('title', 'Grid Title');
  });

  test('uses ref correctly', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <Grid ref={ref}>
        <div>Child Content</div>
      </Grid>,
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
