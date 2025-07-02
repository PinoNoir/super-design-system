import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';

import Icon from '../Icon';

// Mock the SVG sprite import
jest.mock('../../../public/bcc-icon-sprite.svg', () => 'mocked-sprite.svg');

// Mock the useId hook
jest.mock('../../../utilities/use-id', () => ({
  useId: jest.fn((prefix) => `${prefix}-mocked-id`),
}));

// Mock the styles
jest.mock('../styles/Icon.module.css', () => ({
  icon: 'icon',
  sizesmall: 'sizesmall',
  sizedefault: 'sizedefault',
  sizelarge: 'sizelarge',
  colordefault: 'colordefault',
  colorprimary: 'colorprimary',
  colorsecondary: 'colorsecondary',
  colortertiary: 'colortertiary',
  coloraccent: 'coloraccent',
  colordisabled: 'colordisabled',
  colorinfo: 'colorinfo',
  colorsuccess: 'colorsuccess',
  colorwarning: 'colorwarning',
  colorerror: 'colorerror',
}));

// Clean up after each test to avoid multiple elements with the same test ID
afterEach(cleanup);

describe('Icon Component', () => {
  it('renders with default props', () => {
    render(<Icon name="mdi-account" />);

    const icon = screen.getByTestId('icon-mdi-account-mocked-id');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass('icon');
    expect(icon).toHaveClass('sizedefault');
    expect(icon).toHaveClass('colordefault');

    // Check the href attribute of the use element
    const useElement = icon.querySelector('use');
    expect(useElement).toHaveAttribute('href', 'mocked-sprite.svg#mdi-account');
  });

  it('renders with small size', () => {
    render(<Icon name="mdi-account" size="small" />);
    expect(screen.getByTestId('icon-mdi-account-mocked-id')).toHaveClass('sizesmall');
  });

  it('renders with large size', () => {
    render(<Icon name="mdi-account" size="large" />);
    expect(screen.getByTestId('icon-mdi-account-mocked-id')).toHaveClass('sizelarge');
  });

  // Test each color individually
  it('renders with primary color', () => {
    render(<Icon name="mdi-account" color="primary" />);
    expect(screen.getByTestId('icon-mdi-account-mocked-id')).toHaveClass('colorprimary');
  });

  it('renders with secondary color', () => {
    render(<Icon name="mdi-account" color="secondary" />);
    expect(screen.getByTestId('icon-mdi-account-mocked-id')).toHaveClass('colorsecondary');
  });

  it('renders with tertiary color', () => {
    render(<Icon name="mdi-account" color="tertiary" />);
    expect(screen.getByTestId('icon-mdi-account-mocked-id')).toHaveClass('colortertiary');
  });

  it('renders with accent color', () => {
    render(<Icon name="mdi-account" color="accent" />);
    expect(screen.getByTestId('icon-mdi-account-mocked-id')).toHaveClass('coloraccent');
  });

  it('renders with disabled color', () => {
    render(<Icon name="mdi-account" color="disabled" />);
    expect(screen.getByTestId('icon-mdi-account-mocked-id')).toHaveClass('colordisabled');
  });

  it('renders with info color', () => {
    render(<Icon name="mdi-account" color="info" />);
    expect(screen.getByTestId('icon-mdi-account-mocked-id')).toHaveClass('colorinfo');
  });

  it('renders with success color', () => {
    render(<Icon name="mdi-account" color="success" />);
    expect(screen.getByTestId('icon-mdi-account-mocked-id')).toHaveClass('colorsuccess');
  });

  it('renders with warning color', () => {
    render(<Icon name="mdi-account" color="warning" />);
    expect(screen.getByTestId('icon-mdi-account-mocked-id')).toHaveClass('colorwarning');
  });

  it('renders with error color', () => {
    render(<Icon name="mdi-account" color="error" />);
    expect(screen.getByTestId('icon-mdi-account-mocked-id')).toHaveClass('colorerror');
  });

  it('applies custom className', () => {
    render(<Icon name="mdi-account" className="custom-class" />);
    expect(screen.getByTestId('icon-mdi-account-mocked-id')).toHaveClass('custom-class');
  });

  it('applies custom automation-id', () => {
    render(<Icon name="mdi-account" automation-id="custom-icon-id" />);
    expect(screen.getByTestId('custom-icon-id')).toBeInTheDocument();
  });

  it('passes additional props to svg element', () => {
    render(<Icon name="mdi-account" data-testprop="test-value" aria-label="Account icon" />);
    const icon = screen.getByTestId('icon-mdi-account-mocked-id');
    expect(icon).toHaveAttribute('data-testprop', 'test-value');
    expect(icon).toHaveAttribute('aria-label', 'Account icon');
  });

  it('applies ref to svg element', () => {
    const ref = React.createRef<SVGSVGElement>();
    render(<Icon name="mdi-account" ref={ref} />);
    expect(ref.current).not.toBeNull();
    expect(ref.current?.tagName.toLowerCase()).toBe('svg');
  });

  it('supports different icon names', () => {
    // Test a few different icon names one at a time
    const iconName = 'mdi-account-card';
    render(<Icon name={iconName as any} />);
    const icon = screen.getByTestId(`icon-${iconName}-mocked-id`);
    expect(icon).toBeInTheDocument();
    const useElement = icon.querySelector('use');
    expect(useElement).toHaveAttribute('href', `mocked-sprite.svg#${iconName}`);
  });

  it('supports mdi-alert icon name', () => {
    const iconName = 'mdi-alert';
    render(<Icon name={iconName as any} />);
    const icon = screen.getByTestId(`icon-${iconName}-mocked-id`);
    expect(icon).toBeInTheDocument();
    const useElement = icon.querySelector('use');
    expect(useElement).toHaveAttribute('href', `mocked-sprite.svg#${iconName}`);
  });

  it('supports mdi-information icon name', () => {
    const iconName = 'mdi-information';
    render(<Icon name={iconName as any} />);
    const icon = screen.getByTestId(`icon-${iconName}-mocked-id`);
    expect(icon).toBeInTheDocument();
    const useElement = icon.querySelector('use');
    expect(useElement).toHaveAttribute('href', `mocked-sprite.svg#${iconName}`);
  });
});
