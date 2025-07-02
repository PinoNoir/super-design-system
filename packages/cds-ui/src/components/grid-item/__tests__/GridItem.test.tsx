import { render, screen } from '@testing-library/react';
import GridItem from '../GridItem';

describe('GridItem Component', () => {
  test('renders children correctly', () => {
    render(
      <GridItem as="div">
        <span automation-id="child">Child Content</span>
      </GridItem>,
    );

    const childElement = screen.getByTestId('child');
    expect(childElement).toBeInTheDocument();
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  test('applies custom className when provided', () => {
    const { container } = render(
      <GridItem as="div" className="custom-class">
        <span>Child Content</span>
      </GridItem>,
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  test('renders with default display value (grid)', () => {
    const { container } = render(
      <GridItem as="div">
        <span>Child Content</span>
      </GridItem>,
    );

    const gridItemElement = container.firstChild as HTMLElement;
    expect(gridItemElement).toHaveStyle({ display: 'grid' });
  });

  test('renders with custom display value', () => {
    const { container } = render(
      <GridItem as="div" display="flex">
        <span>Child Content</span>
      </GridItem>,
    );

    const gridItemElement = container.firstChild as HTMLElement;
    expect(gridItemElement).toHaveStyle({ display: 'flex' });
  });

  test('applies custom gap correctly', () => {
    const { container } = render(
      <GridItem as="div" gap="16px">
        <span>Child Content</span>
      </GridItem>,
    );

    const gridItemElement = container.firstChild as HTMLElement;
    expect(gridItemElement).toHaveStyle({ gap: '16px' });
  });

  test('applies column span correctly', () => {
    const { container } = render(
      <GridItem as="div" colSpan={3}>
        <span>Child Content</span>
      </GridItem>,
    );

    const gridItemElement = container.firstChild as HTMLElement;
    expect(gridItemElement).toHaveStyle({ gridColumnEnd: 'span 3' });
  });

  test('applies string column span correctly', () => {
    const { container } = render(
      <GridItem as="div" colSpan="3">
        <span>Child Content</span>
      </GridItem>,
    );

    const gridItemElement = container.firstChild as HTMLElement;
    expect(gridItemElement).toHaveStyle({ gridColumnEnd: 'span 3' });
  });

  test('applies row span correctly', () => {
    const { container } = render(
      <GridItem as="div" rowSpan={2}>
        <span>Child Content</span>
      </GridItem>,
    );

    const gridItemElement = container.firstChild as HTMLElement;
    expect(gridItemElement).toHaveStyle({ gridRowEnd: 'span 2' });
  });

  test('applies string row span correctly', () => {
    const { container } = render(
      <GridItem as="div" rowSpan="2">
        <span>Child Content</span>
      </GridItem>,
    );

    const gridItemElement = container.firstChild as HTMLElement;
    expect(gridItemElement).toHaveStyle({ gridRowEnd: 'span 2' });
  });

  test('applies startColumn correctly', () => {
    const { container } = render(
      <GridItem as="div" startColumn={2}>
        <span>Child Content</span>
      </GridItem>,
    );

    const gridItemElement = container.firstChild as HTMLElement;
    expect(gridItemElement).toHaveStyle({ gridColumnStart: 2 });
  });

  test('applies string startColumn correctly', () => {
    const { container } = render(
      <GridItem as="div" startColumn="2">
        <span>Child Content</span>
      </GridItem>,
    );

    const gridItemElement = container.firstChild as HTMLElement;
    expect(gridItemElement).toHaveStyle({ gridColumnStart: '2' });
  });

  test('applies endColumn correctly', () => {
    const { container } = render(
      <GridItem as="div" endColumn={4}>
        <span>Child Content</span>
      </GridItem>,
    );

    const gridItemElement = container.firstChild as HTMLElement;
    expect(gridItemElement).toHaveStyle({ gridColumnEnd: 4 });
  });

  test('applies string endColumn correctly', () => {
    const { container } = render(
      <GridItem as="div" endColumn="4">
        <span>Child Content</span>
      </GridItem>,
    );

    const gridItemElement = container.firstChild as HTMLElement;
    expect(gridItemElement).toHaveStyle({ gridColumnEnd: '4' });
  });

  test('applies startRow correctly', () => {
    const { container } = render(
      <GridItem as="div" startRow={3}>
        <span>Child Content</span>
      </GridItem>,
    );

    const gridItemElement = container.firstChild as HTMLElement;
    expect(gridItemElement).toHaveStyle({ gridRowStart: 3 });
  });

  test('applies string startRow correctly', () => {
    const { container } = render(
      <GridItem as="div" startRow="3">
        <span>Child Content</span>
      </GridItem>,
    );

    const gridItemElement = container.firstChild as HTMLElement;
    expect(gridItemElement).toHaveStyle({ gridRowStart: '3' });
  });

  test('applies endRow correctly', () => {
    const { container } = render(
      <GridItem as="div" endRow={5}>
        <span>Child Content</span>
      </GridItem>,
    );

    const gridItemElement = container.firstChild as HTMLElement;
    expect(gridItemElement).toHaveStyle({ gridRowEnd: 5 });
  });

  test('applies string endRow correctly', () => {
    const { container } = render(
      <GridItem as="div" endRow="5">
        <span>Child Content</span>
      </GridItem>,
    );

    const gridItemElement = container.firstChild as HTMLElement;
    expect(gridItemElement).toHaveStyle({ gridRowEnd: '5' });
  });

  test('applies alignItems correctly', () => {
    const { container } = render(
      <GridItem as="div" alignItems="center">
        <span>Child Content</span>
      </GridItem>,
    );

    const gridItemElement = container.firstChild as HTMLElement;
    expect(gridItemElement).toHaveStyle({ alignItems: 'center' });
  });

  test('applies justifyContent correctly', () => {
    const { container } = render(
      <GridItem as="div" justifyContent="space-between">
        <span>Child Content</span>
      </GridItem>,
    );

    const gridItemElement = container.firstChild as HTMLElement;
    expect(gridItemElement).toHaveStyle({ justifyContent: 'space-between' });
  });

  test('applies maxHeight correctly', () => {
    const { container } = render(
      <GridItem as="div" maxHeight="200px">
        <span>Child Content</span>
      </GridItem>,
    );

    const gridItemElement = container.firstChild as HTMLElement;
    expect(gridItemElement).toHaveStyle({ maxHeight: '200px' });
  });

  test('renders as different elements based on "as" prop', () => {
    const { container: divContainer } = render(
      <GridItem as="div">
        <span>Div Container</span>
      </GridItem>,
    );

    const { container: sectionContainer } = render(
      <GridItem as="section">
        <span>Section Container</span>
      </GridItem>,
    );

    const { container: asideContainer } = render(
      <GridItem as="aside">
        <span>Aside Container</span>
      </GridItem>,
    );

    expect(divContainer.firstChild?.nodeName).toBe('DIV');
    expect(sectionContainer.firstChild?.nodeName).toBe('SECTION');
    expect(asideContainer.firstChild?.nodeName).toBe('ASIDE');
  });

  test('applies automation-id for testing purposes', () => {
    render(
      <GridItem as="div" automation-id="test-grid-item">
        <span>Child Content</span>
      </GridItem>,
    );

    const gridItemElement = screen.getByTestId('test-grid-item');
    expect(gridItemElement).toBeInTheDocument();
  });

  test('forwards additional props to the element', () => {
    const { container } = render(
      <GridItem as="div" data-custom="custom-value" title="GridItem Title">
        <span>Child Content</span>
      </GridItem>,
    );

    const gridItemElement = container.firstChild as HTMLElement;
    expect(gridItemElement).toHaveAttribute('data-custom', 'custom-value');
    expect(gridItemElement).toHaveAttribute('title', 'GridItem Title');
  });

  test('correctly processes colSpan over endColumn when both are provided', () => {
    const { container } = render(
      <GridItem as="div" colSpan={3} endColumn={5}>
        <span>Child Content</span>
      </GridItem>,
    );

    const gridItemElement = container.firstChild as HTMLElement;
    // colSpan takes precedence over endColumn
    expect(gridItemElement).toHaveStyle({ gridColumnEnd: 'span 3' });
  });

  test('correctly processes rowSpan over endRow when both are provided', () => {
    const { container } = render(
      <GridItem as="div" rowSpan={2} endRow={4}>
        <span>Child Content</span>
      </GridItem>,
    );

    const gridItemElement = container.firstChild as HTMLElement;
    // rowSpan takes precedence over endRow
    expect(gridItemElement).toHaveStyle({ gridRowEnd: 'span 2' });
  });

  test('handles justifySelf prop correctly', () => {
    const { container } = render(
      <GridItem as="div" justifySelf="end">
        <span>Child Content</span>
      </GridItem>,
    );
    const gridItemElement = container.firstChild as HTMLElement;
    expect(gridItemElement).toHaveStyle({ justifySelf: 'end' });
  });
});
