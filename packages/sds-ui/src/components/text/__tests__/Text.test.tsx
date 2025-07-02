import { render, screen } from '@testing-library/react';
import Text from '../Text';

// Mock the CSS module
jest.mock('./styles/text.module.css', () => ({
  text: 'text',
  xs: 'xs',
  small: 'small',
  body: 'body',
  large: 'large',
  xl: 'xl',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  light: 'light',
  normal: 'normal',
  medium: 'medium',
  bold: 'bold',
  base: 'base',
  neutral80: 'neutral80',
  neutral60: 'neutral60',
  disabled: 'disabled',
  primary: 'primary',
  secondary: 'secondary',
  tertiary: 'tertiary',
  accent: 'accent',
  help: 'help',
  info: 'info',
  success: 'success',
  warning: 'warning',
  error: 'error',
}));

describe('Text Component', () => {
  it('renders with default props', () => {
    render(<Text as="p">Hello World</Text>);
    const element = screen.getByText('Hello World');
    expect(element.tagName).toBe('P');
    expect(element).toHaveClass('text', 'base');
  });

  it('renders different HTML elements based on "as" prop', () => {
    const { rerender } = render(<Text as="h1">Heading</Text>);
    expect(screen.getByText('Heading').tagName).toBe('H1');

    rerender(<Text as="span">Span Text</Text>);
    expect(screen.getByText('Span Text').tagName).toBe('SPAN');
  });

  it('applies custom className', () => {
    render(
      <Text as="p" className="custom-class">
        Text
      </Text>,
    );
    expect(screen.getByText('Text')).toHaveClass('custom-class', 'text', 'base');
  });

  it('applies custom style', () => {
    render(
      <Text as="p" style={{ color: 'red' }}>
        Styled Text
      </Text>,
    );
    expect(screen.getByText('Styled Text')).toHaveStyle('color: red');
  });

  it('passes href and target props to anchor element', () => {
    render(
      <Text as="a" href="https://example.com" target="_blank">
        Link
      </Text>,
    );
    const link = screen.getByText('Link');
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('applies automation-id when provided', () => {
    render(
      <Text as="p" automation-id="test-text">
        Text
      </Text>,
    );
    expect(screen.getByText('Text')).toHaveAttribute('automation-id', 'test-text');
  });

  it('applies appropriate classes based on props', () => {
    render(
      <Text as="p" size="large" color="primary" weight="bold">
        Text
      </Text>,
    );
    const element = screen.getByText('Text');
    expect(element).toHaveClass('text', 'large', 'primary', 'bold');
  });

  it('applies default color class when color not provided', () => {
    render(<Text as="p">Text</Text>);
    expect(screen.getByText('Text')).toHaveClass('base');
  });

  it('applies size class when provided', () => {
    render(
      <Text as="p" size="small">
        Small Text
      </Text>,
    );
    expect(screen.getByText('Small Text')).toHaveClass('small');
  });

  it('applies weight class when provided', () => {
    render(
      <Text as="p" weight="medium">
        Medium Weight
      </Text>,
    );
    expect(screen.getByText('Medium Weight')).toHaveClass('medium');
  });
});
