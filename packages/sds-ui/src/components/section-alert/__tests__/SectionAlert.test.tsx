import { render, screen } from '@testing-library/react';
import SectionAlert from '../SectionAlert';

// Mock the Icon component
jest.mock('@iconify/react', () => ({
  Icon: ({ icon, ...props }) => <span data-icon={icon} {...props} />,
}));

// Mock the Link component
jest.mock('../../link', () => ({
  Link: ({ children, ...props }) => <a {...props}>{children}</a>,
}));

// Mock the styles with CSS modules format
jest.mock('./SectionAlert.module.css', () => ({
  baseSectionAlertStyle: 'baseSectionAlertStyle',
  wrapper: 'wrapper',
  sectionAlertIcon: 'sectionAlertIcon',
  sectionAlertMessageHeading: 'sectionAlertMessageHeading',
  sectionAlertMessage: 'sectionAlertMessage',
  layout1: 'layout1',
  layout2: 'layout2',
  sectionAlertAdditionalMessage: 'sectionAlertAdditionalMessage',
  sectionAlertMessageLink: 'sectionAlertMessageLink',
  info: 'info',
  success: 'success',
  warning: 'warning',
  error: 'error',
  global: 'global',
}));

describe('SectionAlert Component', () => {
  it('renders with basic props', () => {
    render(<SectionAlert variant="info" message="Test message" header="Information" hasHeader />);
    expect(screen.getByText('Information')).toBeInTheDocument();
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('renders default header based on variant when hasHeader is true but no header is provided', () => {
    // Test each variant's default header text
    const variantHeaderMap = {
      info: 'Information',
      success: 'Success',
      warning: 'Warning',
      error: 'Error',
      invalid: '', // Testing default case
    };

    Object.entries(variantHeaderMap).forEach(([variant, expectedHeader]) => {
      const { getByText, queryByText, unmount } = render(
        // @ts-ignore - For 'invalid' case
        <SectionAlert variant={variant} message="Test message" hasHeader />,
      );

      if (expectedHeader) {
        expect(getByText(expectedHeader)).toBeInTheDocument();
      } else {
        // For the default case, no header should be rendered
        expect(queryByText(/Information|Success|Warning|Error/)).not.toBeInTheDocument();
      }

      unmount();
    });
  });

  it('renders default header based on variant when hasHeader is true but no header is provided', () => {
    render(<SectionAlert variant="warning" message="Test message" hasHeader />);
    expect(screen.getByText('Warning')).toBeInTheDocument();
  });

  it('renders custom header when provided', () => {
    render(<SectionAlert variant="info" message="Test" header="Custom Header" hasHeader />);
    expect(screen.getByText('Custom Header')).toBeInTheDocument();
  });

  it('renders additional bold message when provided', () => {
    render(<SectionAlert variant="info" message="Test" additionalBoldMessage="Bold Message" />);
    expect(screen.getByText('Bold Message')).toHaveClass('sectionAlertAdditionalMessage');
  });

  it('renders link without target attribute when linkCurrentTab is true', () => {
    render(
      <SectionAlert variant="info" message="Test" link="https://example.com" linkText="Click here" linkCurrentTab />,
    );
    expect(screen.getByText('Click here')).not.toHaveAttribute('target');
  });

  it('renders link with _blank target when linkCurrentTab is false', () => {
    render(<SectionAlert variant="info" message="Test" link="https://example.com" linkText="Click here" />);
    expect(screen.getByText('Click here')).toHaveAttribute('target', '_blank');
  });

  it('applies custom className', () => {
    const { container } = render(<SectionAlert variant="info" message="Test" className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
    expect(container.firstChild).toHaveClass('baseSectionAlertStyle');
    expect(container.firstChild).toHaveClass('info');
  });

  it('passes automation-id to the root element', () => {
    render(<SectionAlert variant="info" message="Test" automation-id="custom-alert" />);
    expect(screen.getByText('Test').closest('div[automation-id="custom-alert"]')).toBeInTheDocument();
  });

  it('displays the correct icon based on variant', () => {
    const { container } = render(<SectionAlert variant="success" message="Test message" />);
    expect(container.querySelector('[data-name="success"]')).toBeInTheDocument();
  });

  it('does not render link when link or linkText is not provided', () => {
    const { container } = render(<SectionAlert variant="info" message="Test" />);
    expect(container.querySelector('a')).not.toBeInTheDocument();
  });

  it('applies the correct variant class', () => {
    const variants = ['info', 'success', 'warning', 'error', 'global'];

    variants.forEach((variant) => {
      const { container, unmount } = render(
        <SectionAlert
          variant={variant as 'info' | 'success' | 'warning' | 'error' | 'global'}
          message={`${variant} message`}
        />,
      );
      expect(container.firstChild).toHaveClass(variant);
      unmount();
    });
  });

  it('handles undefined variant by rendering empty icon', () => {
    // @ts-ignore - Testing invalid prop on purpose
    const { container } = render(<SectionAlert variant="invalid" message="Test message" />);
    const iconElement = container.querySelector('.sectionAlertIcon');
    expect(iconElement).toBeInTheDocument();
    expect(iconElement.textContent).toBe('');
  });

  it('renders global variant correctly', () => {
    const { container } = render(<SectionAlert variant="global" message="Global message" />);
    expect(container.querySelector('[data-name="global"]')).toBeInTheDocument();
  });

  it('renders message in layout1 when hasHeader is false', () => {
    const { container } = render(<SectionAlert variant="info" message="Test message" />);
    expect(container.querySelector('.layout1')).toHaveTextContent('Test message');
  });

  it('renders message in layout2 when hasHeader is true', () => {
    const { container } = render(<SectionAlert variant="info" message="Test message" hasHeader />);
    expect(container.querySelector('.layout2')).toHaveTextContent('Test message');
  });

  it('uses empty string as headerText when hasHeader is false', () => {
    const { container } = render(
      <SectionAlert variant="info" message="Test message" header="Custom Header" hasHeader={false} />,
    );
    expect(screen.queryByText('Custom Header')).not.toBeInTheDocument();
    expect(container.querySelector('.layout1')).toHaveTextContent('Test message');
  });

  it('applies both additionalBoldMessage and header when both are provided', () => {
    const { container } = render(
      <SectionAlert
        variant="info"
        message="Test message"
        additionalBoldMessage="Additional text"
        header="Header text"
        hasHeader
      />,
    );

    expect(screen.getByText('Header text')).toBeInTheDocument();
    expect(screen.getByText('Additional text')).toHaveClass('sectionAlertAdditionalMessage');
    expect(container.querySelector('.layout2')).toHaveTextContent('Test message');
  });
});
