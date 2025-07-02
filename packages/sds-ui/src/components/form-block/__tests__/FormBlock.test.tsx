import { render, screen } from '@testing-library/react';
import FormBlock from '../FormBlock';

// Mock the CSS module
jest.mock('./styles/FormBlock.module.css', () => ({
  base: 'base-class',
  layoutVariants1Column: 'layout-1-column-class',
  layoutVariants2Column: 'layout-2-column-class',
  layoutVariants3Column: 'layout-3-column-class',
  layoutVariants4Column: 'layout-4-column-class',
  row: 'row-class',
}));

describe('FormBlock', () => {
  it('renders children correctly', () => {
    render(
      <FormBlock>
        <div automation-id="child-element">Child Content</div>
      </FormBlock>,
    );

    expect(screen.getByTestId('child-element')).toBeInTheDocument();
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  it('applies base class and default 1-column layout when no variant is provided', () => {
    render(
      <FormBlock automation-id="form-block">
        <div>Content</div>
      </FormBlock>,
    );

    const blockElement = screen.getByTestId('form-block');
    expect(blockElement).toHaveClass('base-class');
    expect(blockElement).toHaveClass('layout-1-column-class');
  });

  it('applies 2-column layout class when specified', () => {
    render(
      <FormBlock layoutVariant="2-column" automation-id="form-block">
        <div>Content</div>
      </FormBlock>,
    );

    const blockElement = screen.getByTestId('form-block');
    expect(blockElement).toHaveClass('base-class');
    expect(blockElement).toHaveClass('layout-2-column-class');
    expect(blockElement).not.toHaveClass('layout-1-column-class');
  });

  it('applies 3-column layout class when specified', () => {
    render(
      <FormBlock layoutVariant="3-column" automation-id="form-block">
        <div>Content</div>
      </FormBlock>,
    );

    const blockElement = screen.getByTestId('form-block');
    expect(blockElement).toHaveClass('layout-3-column-class');
    expect(blockElement).not.toHaveClass('layout-2-column-class');
  });

  it('applies 4-column layout class when specified', () => {
    render(
      <FormBlock layoutVariant="4-column" automation-id="form-block">
        <div>Content</div>
      </FormBlock>,
    );

    const blockElement = screen.getByTestId('form-block');
    expect(blockElement).toHaveClass('layout-4-column-class');
  });

  it('applies row class when row prop is true', () => {
    render(
      <FormBlock row={true} automation-id="form-block">
        <div>Content</div>
      </FormBlock>,
    );

    const blockElement = screen.getByTestId('form-block');
    expect(blockElement).toHaveClass('row-class');
  });

  it('does not apply row class when row prop is false', () => {
    render(
      <FormBlock row={false} automation-id="form-block">
        <div>Content</div>
      </FormBlock>,
    );

    const blockElement = screen.getByTestId('form-block');
    expect(blockElement).not.toHaveClass('row-class');
  });

  it('applies custom className when provided', () => {
    render(
      <FormBlock className="custom-class" automation-id="form-block">
        <div>Content</div>
      </FormBlock>,
    );

    const blockElement = screen.getByTestId('form-block');
    expect(blockElement).toHaveClass('custom-class');
  });

  it('applies inline styles based on props', () => {
    render(
      <FormBlock alignItems="center" marginBlockStart="16px" marginBlockEnd="32px" gap="8px" automation-id="form-block">
        <div>Content</div>
      </FormBlock>,
    );

    const blockElement = screen.getByTestId('form-block');
    expect(blockElement).toHaveStyle({
      alignItems: 'center',
      marginBlockStart: '16px',
      marginBlockEnd: '32px',
      gap: '8px',
    });
  });

  it('passes additional props to the div element', () => {
    const dataAttributes = { 'data-something': 'value' };

    render(
      <FormBlock {...dataAttributes} automation-id="form-block">
        <div>Content</div>
      </FormBlock>,
    );

    const blockElement = screen.getByTestId('form-block');
    expect(blockElement).toHaveAttribute('data-something', 'value');
  });

  it('forwards ref to the underlying div element', () => {
    const ref = jest.fn();

    render(
      <FormBlock ref={ref} automation-id="form-block">
        <div>Content</div>
      </FormBlock>,
    );

    expect(ref).toHaveBeenCalled();
    const blockElement = screen.getByTestId('form-block');
    expect(ref.mock.calls[0][0]).toBe(blockElement);
  });

  it('combines all props and classes correctly', () => {
    render(
      <FormBlock
        layoutVariant="3-column"
        alignItems="flex-end"
        marginBlockEnd="48px"
        className="extra-class"
        automation-id="wrapper"
      >
        <div>Content</div>
      </FormBlock>,
    );

    const blockElement = screen.getByTestId('wrapper');
    expect(blockElement).toHaveClass('base-class');
    expect(blockElement).toHaveClass('layout-3-column-class');
    expect(blockElement).toHaveClass('row-class'); // default is true
    expect(blockElement).toHaveClass('extra-class');
    expect(blockElement).toHaveStyle({
      alignItems: 'flex-end',
      marginBlockEnd: '48px',
    });
  });
});
